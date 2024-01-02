/*
 * Teleport
 * Copyright (C) 2023  Gravitational, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package common

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"strings"
	"text/template"
	"time"

	"github.com/alecthomas/kingpin/v2"
	"github.com/google/uuid"
	"github.com/gravitational/trace"
	log "github.com/sirupsen/logrus"

	"github.com/gravitational/teleport"
	"github.com/gravitational/teleport/api/client/proto"
	"github.com/gravitational/teleport/api/constants"
	headerv1 "github.com/gravitational/teleport/api/gen/proto/go/teleport/header/v1"
	machineidv1pb "github.com/gravitational/teleport/api/gen/proto/go/teleport/machineid/v1"
	"github.com/gravitational/teleport/api/types"
	"github.com/gravitational/teleport/lib/asciitable"
	"github.com/gravitational/teleport/lib/auth"
	"github.com/gravitational/teleport/lib/auth/machineid/machineidv1"
	"github.com/gravitational/teleport/lib/defaults"
	"github.com/gravitational/teleport/lib/service/servicecfg"
	"github.com/gravitational/teleport/lib/utils"
)

type BotsCommand struct {
	format string

	lockExpires string
	lockTTL     time.Duration

	botName  string
	botRoles string
	tokenID  string
	tokenTTL time.Duration

	allowedLogins []string

	botsList   *kingpin.CmdClause
	botsAdd    *kingpin.CmdClause
	botsRemove *kingpin.CmdClause
	botsLock   *kingpin.CmdClause
}

// Initialize sets up the "tctl bots" command.
func (c *BotsCommand) Initialize(app *kingpin.Application, config *servicecfg.Config) {
	bots := app.Command("bots", "Operate on certificate renewal bots registered with the cluster.")

	c.botsList = bots.Command("ls", "List all certificate renewal bots registered with the cluster.")
	c.botsList.Flag("format", "Output format, 'text' or 'json'").Hidden().Default(teleport.Text).EnumVar(&c.format, teleport.Text, teleport.JSON)

	c.botsAdd = bots.Command("add", "Add a new certificate renewal bot to the cluster.")
	c.botsAdd.Arg("name", "A name to uniquely identify this bot in the cluster.").Required().StringVar(&c.botName)
	c.botsAdd.Flag("roles", "Roles the bot is able to assume.").StringVar(&c.botRoles)
	c.botsAdd.Flag("ttl", "TTL for the bot join token.").DurationVar(&c.tokenTTL)
	c.botsAdd.Flag("token", "Name of an existing token to use.").StringVar(&c.tokenID)
	c.botsAdd.Flag("format", "Output format, 'text' or 'json'").Hidden().Default(teleport.Text).EnumVar(&c.format, teleport.Text, teleport.JSON)
	c.botsAdd.Flag("logins", "List of allowed SSH logins for the bot user").StringsVar(&c.allowedLogins)

	c.botsRemove = bots.Command("rm", "Permanently remove a certificate renewal bot from the cluster.")
	c.botsRemove.Arg("name", "Name of an existing bot to remove.").Required().StringVar(&c.botName)

	c.botsLock = bots.Command("lock", "Prevent a bot from renewing its certificates.")
	c.botsLock.Arg("name", "Name of an existing bot to lock.").Required().StringVar(&c.botName)
	c.botsLock.Flag("expires", "Time point (RFC3339) when the lock expires.").StringVar(&c.lockExpires)
	c.botsLock.Flag("ttl", "Time duration after which the lock expires.").DurationVar(&c.lockTTL)
	c.botsLock.Hidden()
}

// TryRun attempts to run subcommands.
func (c *BotsCommand) TryRun(ctx context.Context, cmd string, client auth.ClientI) (match bool, err error) {
	switch cmd {
	case c.botsList.FullCommand():
		err = c.ListBots(ctx, client)
	case c.botsAdd.FullCommand():
		err = c.AddBot(ctx, client)
	case c.botsRemove.FullCommand():
		err = c.RemoveBot(ctx, client)
	case c.botsLock.FullCommand():
		err = c.LockBot(ctx, client)
	default:
		return false, nil
	}

	return true, trace.Wrap(err)
}

// TODO(noah): DELETE IN 16.0.0
func (c *BotsCommand) listBotsLegacy(ctx context.Context, client auth.ClientI) error {
	users, err := client.GetBotUsers(ctx)
	if err != nil {
		return trace.Wrap(err)
	}

	if c.format == teleport.Text {
		if len(users) == 0 {
			fmt.Println("No users found")
			return nil
		}
		t := asciitable.MakeTable([]string{"Bot", "User", "Roles"})
		for _, u := range users {
			var botName string
			meta := u.GetMetadata()
			if val, ok := meta.Labels[types.BotLabel]; ok {
				botName = val
			} else {
				// Should not be possible, but not worth failing over.
				botName = "-"
			}

			t.AddRow([]string{
				botName, u.GetName(), strings.Join(u.GetRoles(), ","),
			})
		}
		fmt.Println(t.AsBuffer().String())
	} else {
		err := utils.WriteJSONArray(os.Stdout, users)
		if err != nil {
			return trace.Wrap(err, "failed to marshal users")
		}
	}
	return nil
}

// ListBots writes a listing of the cluster's certificate renewal bots
// to standard out.
func (c *BotsCommand) ListBots(ctx context.Context, client auth.ClientI) error {
	var bots []*machineidv1pb.Bot
	req := &machineidv1pb.ListBotsRequest{}
	for {
		resp, err := client.BotServiceClient().ListBots(ctx, req)
		if err != nil {
			if trace.IsNotImplemented(err) {
				return trace.Wrap(c.listBotsLegacy(ctx, client))
			}
			return trace.Wrap(err)
		}

		bots = append(bots, resp.Bots...)
		if resp.NextPageToken == "" {
			break
		}
		req.PageToken = resp.NextPageToken
	}

	if c.format == teleport.Text {
		if len(bots) == 0 {
			fmt.Println("No bots found")
			return nil
		}
		t := asciitable.MakeTable([]string{"Bot", "User", "Roles"})
		for _, u := range bots {
			t.AddRow([]string{
				u.Metadata.Name, u.Status.UserName, strings.Join(u.Spec.GetRoles(), ","),
			})
		}
		fmt.Println(t.AsBuffer().String())
	} else {
		err := utils.WriteJSONArray(os.Stdout, bots)
		if err != nil {
			return trace.Wrap(err, "failed to marshal bots")
		}
	}
	return nil
}

// bold wraps the given text in an ANSI escape to bold it
func bold(text string) string {
	return utils.Color(utils.Bold, text)
}

var startMessageTemplate = template.Must(template.New("node").Funcs(template.FuncMap{
	"bold": bold,
}).Parse(`The bot token: {{.token}}{{if .minutes}}
This token will expire in {{.minutes}} minutes.{{end}}

Optionally, if running the bot under an isolated user account, first initialize
the data directory by running the following command {{ bold "as root" }}:

> tbot init \
   --destination-dir=./tbot-user \
   --bot-user=tbot \
   --reader-user=alice

... where "tbot" is the username of the bot's UNIX user, and "alice" is the
UNIX user that will be making use of the certificates.

Then, run this {{ bold "as the bot user" }} to begin continuously fetching
certificates:

> tbot start \
   --destination-dir=./tbot-user \
   --token={{.token}} \
   --auth-server={{.addr}}{{if .join_method}} \
   --join-method={{.join_method}}{{end}}

Please note:

  - The ./tbot-user destination directory can be changed as desired.
  - /var/lib/teleport/bot must be accessible to the bot user, or --data-dir
    must point to another accessible directory to store internal bot data.
  - This invitation token will expire in {{.minutes}} minutes
  - {{.addr}} must be reachable from the new node
`))

// TODO(noah): DELETE IN 16.0.0
func (c *BotsCommand) addBotLegacy(ctx context.Context, client auth.ClientI) error {
	roles := splitRoles(c.botRoles)
	if len(roles) == 0 {
		log.Warning("No roles specified. The bot will not be able to produce outputs until a role is added to the bot.")
	}

	traits := map[string][]string{
		constants.TraitLogins: flattenSlice(c.allowedLogins),
	}

	response, err := client.CreateBot(ctx, &proto.CreateBotRequest{
		Name:    c.botName,
		TTL:     proto.Duration(c.tokenTTL),
		Roles:   roles,
		TokenID: c.tokenID,
		Traits:  traits,
	})
	if err != nil {
		return trace.Wrap(err, "creating bot")
	}

	if c.format == teleport.JSON {
		out, err := json.MarshalIndent(response, "", "  ")
		if err != nil {
			return trace.Wrap(err, "failed to marshal CreateBot response")
		}

		fmt.Println(string(out))
		return nil
	}

	proxies, err := client.GetProxies()
	if err != nil {
		return trace.Wrap(err)
	}
	if len(proxies) == 0 {
		return trace.Errorf("bot was created but this cluster does not have any proxy servers running so unable to display success message")
	}
	addr := proxies[0].GetPublicAddr()
	if addr == "" {
		addr = proxies[0].GetAddr()
	}

	joinMethod := response.JoinMethod
	if joinMethod == types.JoinMethodUnspecified {
		joinMethod = types.JoinMethodToken
	}

	return startMessageTemplate.Execute(os.Stdout, map[string]interface{}{
		"token":       response.TokenID,
		"minutes":     int(time.Duration(response.TokenTTL).Minutes()),
		"addr":        addr,
		"join_method": joinMethod,
	})
}

// AddBot adds a new certificate renewal bot to the cluster.
func (c *BotsCommand) AddBot(ctx context.Context, client auth.ClientI) error {
	// Jankily call the endpoint invalidly. This lets us version check and use
	// the legacy version of this CLI tool if we are talking to an older
	// server.
	// DELETE IN 16.0
	{
		_, err := client.BotServiceClient().CreateBot(ctx, &machineidv1pb.CreateBotRequest{
			Bot: nil,
		})
		if trace.IsNotImplemented(err) {
			return trace.Wrap(c.addBotLegacy(ctx, client))
		}
	}

	roles := splitRoles(c.botRoles)
	if len(roles) == 0 {
		log.Warning("No roles specified. The bot will not be able to produce outputs until a role is added to the bot.")
	}
	var token types.ProvisionToken
	var err error
	if c.tokenID == "" {
		// If there's no token specified, generate one
		tokenName, err := utils.CryptoRandomHex(16)
		if err != nil {
			return trace.Wrap(err)
		}
		ttl := c.tokenTTL
		if ttl == 0 {
			ttl = defaults.DefaultBotJoinTTL
		}
		tokenSpec := types.ProvisionTokenSpecV2{
			Roles:      types.SystemRoles{types.RoleBot},
			JoinMethod: types.JoinMethodToken,
			BotName:    c.botName,
		}
		token, err = types.NewProvisionTokenFromSpec(tokenName, time.Now().Add(ttl), tokenSpec)
		if err != nil {
			return trace.Wrap(err)
		}
		if err := client.UpsertToken(ctx, token); err != nil {
			return trace.Wrap(err)
		}
	} else {
		// If there is, check the token matches the potential bot
		token, err = client.GetToken(ctx, c.tokenID)
		if err != nil {
			if trace.IsNotFound(err) {
				return trace.NotFound("token with name %q not found, create the token or do not set TokenName: %v",
					c.tokenID, err)
			}
			return trace.Wrap(err)
		}
		if !token.GetRoles().Include(types.RoleBot) {
			return trace.BadParameter("token %q is not valid for role %q",
				c.tokenID, types.RoleBot)
		}
		if token.GetBotName() != c.botName {
			return trace.BadParameter("token %q is valid for bot with name %q, not %q",
				c.tokenID, token.GetBotName(), c.botName)
		}
	}

	bot := &machineidv1pb.Bot{
		Metadata: &headerv1.Metadata{
			Name: c.botName,
		},
		Spec: &machineidv1pb.BotSpec{
			Roles: roles,
			Traits: []*machineidv1pb.Trait{
				{
					Name:   constants.TraitLogins,
					Values: flattenSlice(c.allowedLogins),
				},
			},
		},
	}

	bot, err = client.BotServiceClient().CreateBot(ctx, &machineidv1pb.CreateBotRequest{
		Bot: bot,
	})
	if err != nil {
		return trace.Wrap(err)
	}

	if c.format == teleport.JSON {
		tokenTTL := time.Duration(0)
		if exp := token.Expiry(); !exp.IsZero() {
			tokenTTL = time.Until(exp)
		}
		// This struct is equivalent to a legacy bit of JSON we used to output
		// when we called an older RPC. We've preserved it here to avoid
		// breaking customer scripts.
		response := struct {
			UserName string        `json:"user_name"`
			RoleName string        `json:"role_name"`
			TokenID  string        `json:"token_id"`
			TokenTTL time.Duration `json:"token_ttl"`
		}{
			UserName: bot.Status.UserName,
			RoleName: bot.Status.RoleName,
			TokenID:  token.GetName(),
			TokenTTL: tokenTTL,
		}
		out, err := json.MarshalIndent(response, "", "  ")
		if err != nil {
			return trace.Wrap(err, "failed to marshal CreateBot response")
		}

		fmt.Println(string(out))
		return nil
	}

	proxies, err := client.GetProxies()
	if err != nil {
		return trace.Wrap(err)
	}
	if len(proxies) == 0 {
		return trace.Errorf("bot was created but this cluster does not have any proxy servers running so unable to display success message")
	}
	addr := proxies[0].GetPublicAddr()
	if addr == "" {
		addr = proxies[0].GetAddr()
	}

	joinMethod := token.GetJoinMethod()
	if joinMethod == types.JoinMethodUnspecified {
		joinMethod = types.JoinMethodToken
	}

	return startMessageTemplate.Execute(os.Stdout, map[string]interface{}{
		"token":       token.GetName(),
		"minutes":     int(time.Until(token.Expiry()).Minutes()),
		"addr":        addr,
		"join_method": joinMethod,
	})
}

func (c *BotsCommand) RemoveBot(ctx context.Context, client auth.ClientI) error {
	_, err := client.BotServiceClient().DeleteBot(ctx, &machineidv1pb.DeleteBotRequest{
		BotName: c.botName,
	})
	if err != nil {
		if trace.IsNotImplemented(err) {
			// This falls back to the deprecated RPC.
			// TODO(noah): DELETE IN 16.0.0
			if err := client.DeleteBot(ctx, c.botName); err != nil {
				return trace.Wrap(err, "error deleting bot")
			}
		} else {
			return trace.Wrap(err)
		}
	}

	fmt.Printf("Bot %q deleted successfully.\n", c.botName)

	return nil
}

func (c *BotsCommand) LockBot(ctx context.Context, client auth.ClientI) error {
	lockExpiry, err := computeLockExpiry(c.lockExpires, c.lockTTL)
	if err != nil {
		return trace.Wrap(err)
	}

	user, err := client.GetUser(ctx, machineidv1.BotResourceName(c.botName), false)
	if err != nil {
		return trace.Wrap(err)
	}

	meta := user.GetMetadata()
	botName, ok := meta.Labels[types.BotLabel]
	if !ok {
		return trace.BadParameter("User %q is not a bot user; use `tctl lock` directly to lock this user", user.GetName())
	}

	if botName != c.botName {
		return trace.BadParameter("User %q is not associated with expected bot %q (expected %q); use `tctl lock` directly to lock this user", user.GetName(), c.botName, botName)
	}

	lock, err := types.NewLock(uuid.New().String(), types.LockSpecV2{
		Target: types.LockTarget{
			User: user.GetName(),
		},
		Expires: lockExpiry,
		Message: fmt.Sprintf("The bot user %q associated with bot %q has been locked.", user.GetName(), c.botName),
	})
	if err != nil {
		return trace.Wrap(err)
	}

	if err := client.UpsertLock(ctx, lock); err != nil {
		return trace.Wrap(err)
	}

	fmt.Printf("Created a lock with name %q.\n", lock.GetName())

	return nil
}

func splitRoles(flag string) []string {
	var roles []string
	for _, s := range strings.Split(flag, ",") {
		s = strings.TrimSpace(s)
		if s == "" {
			continue
		}
		roles = append(roles, s)
	}
	return roles
}