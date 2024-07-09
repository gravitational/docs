# UI reference

Teleport uses Next.js to generate its static documentation site. Next.js uses
Markdown with React, hence the `.mdx` filename suffix.

This section briefly describes some of the features that are most relevant when
writing documentation.

## Admonitions

Admonitions are similar to notices, but are intended for longer content that
looks better against a white background. Use this syntax:

```jsx
<Admonition title="Admonition title" type="tip">
 Admonition content.
</Admonition>
```

`type` can be one of the following values: `warning`, `tip`, `note`, `danger`.
Different types will result in different colors for the header. Omitting the type
or using some other value will result in resetting it to the `tip`.

If `title` is omitted, `type` will be used instead as the title value.

## Code blocks

You will often need to illustrate documentation with examples of commands, code,
or configuration files. You can do this by adding a code block. Code blocks
begin and end with three backticks. A label after the first row of backticks
configures the way the block will be rendered:

   ````md
   ```yaml
   key: value
   array:
   - val1
   - val2
   - val3
   ```
   ````

If a code block's label is `code` or `bash`, the block will be optimized for
example commands. Readers will be able to copy individual lines that begin with
`$`. Comments and output will be highlighted differently than commands.

Here is an example of a `code` block:

   ````md
   ```bash
   # Comment
   $ tsh login
   Output
   ```
   ````

## Details

To insert a details block like the one above, use this syntax:

```
<Details title="Details title" min="7.0" opened>
  Details content
</Details>
```

## Figures

The `Figure` component can help with using images, figures, and diagrams:

```jsx
<Figure
  align="center"
  bordered
  caption="Example"
>
  ![Example](../../../img/overview.png)
</Figure>
```

## Icons

The `Icon` component lets you insert icons into documentation text. This is
useful when referencing a UI element with an icon. For example:

```md
In the main menu, click on <Icon name="desktop" inline size="sm"/> **Desktops**
to view desktops available to your Teleport user.
```

## Image pixel density markers

Browsers can't distinguish between images that are suitable for Apple's Retina display and images that are not. Because of this, screenshots taken on Retina screens may look large on the page.

To hint to browsers that an image is meant for a Retina display, we can add the
suffix `@Nx` to the image's file name. For example, screenshots made on MacOS
should have the suffix `filename@2x.png`. This will tell the browser to scale
images down twice to show them in their actual size.

## In-page edits

Teleport deeply integrates with a user's infrastructure, so configuration
options, URLs, and other values often vary from setup to setup. Docs pages can
define variables that users can edit, allowing them to tailor their
documentation experience to their own environment.

### The Var component

To declare a variable, use the `Var` component, as shown in the following `code`
snippets. This example includes an extra space before the tag names of the `Var`
components to prevent these components from rendering:

````markdown
<Details title="Getting cluster information" opened>
Log in to your Teleport cluster using the following command:

```bash
$ tsh login --user=< Var name="user"/> --proxy=< Var name="proxy" description="Domain name of your Teleport Web UI" />
```

Get information about your Teleport cluster:

```bash
$ curl https://< Var name="proxy"/>/webapi/ping
```

</Details>
````

#### Where to use the Var component

You can use the `Var` component inside as well as outside code snippets. It is
possible to use this component in code snippets with any language label, such as
`yaml` or `go`.

`Var` tags must be self closing (ending in `/>`).

#### How the Var component works

When a user updates the value of an in-page variable, the values of any `Var`
components with the same `name` property update automatically. When you copy a
`code` snippet using the copy button, the values of any in-page variables within
the `code` snippet are added to the clipboard.

Variables are scoped to a single page by default. You can make a variable
preserve its value across all of the pages a user visits by adding the
`isGlobal` property to the `<Var/>` tag. Variable values are not preserved
between browser sessions.

#### Var component properties

By default, the `Var` component displays its `name` until the user assigns a
value to it. To configure the component to display an initial value beside its
name, set the `initial` field:

```
< Var name="proxy" initial="teleport.example.com" />
```

You should only set an `initial` field for a single occurrence of a `Var` with a
particular name. Otherwise, `Var`s will overwrite one another's initial values.

## Notices

If you want to add notice like the one above to the page, use this syntax:

```
<Notice type="tip">
  Notice content.
</Notice>
```

`type` can be one of the following values: `warning`, `tip`, `note`, `danger`. The default is `tip`.
Different types will result in different background colors and icons.

## Partials

To prevent content duplication, it's useful to include code examples or Markdown
content from a partial file into the current page. This allows our documentation
to reduce maintenance overhead so we can focus on writing new articles.

### Including partials

To include a partial, use the following syntax, removing the `\` character
before each `!`:

```markdown
(!path-to-file.mdx!) 
```

When a page includes a partial, our docs engine resolves the partial's path from
the root of the `gravitational/teleport` repository.

Partials will be linted when a PR is created as part of our CI/CD process. If a
partial does not exist in the repository, our system will throw an error.
Incorrect placement of include statements will also throw errors.

Partials will only be included in these two cases:

#### Surrounded by newlines

   ```md
   Some text.

   (! include.mdx !)

   Some other text.
   ```

If the partial is an `.mdx` file, it will be parsed and rendered as Markdown. In
other cases it will be included as-is.

#### Inside code blocks

   ````md
   ```bash
   # Code example below

   (!include.sh!)

   ```
   ````

These will be inserted as-is, even in the case of `.mdx` files.

### Partial parameters

A partial can define parameters, which allow multiple docs pages to include the
same partial but with slightly different content.

Inside a partial, a parameter uses the `{{ }}` syntax. For example, the partial
`mypartial.mdx` below uses the `{{ action }}` parameter.

```markdown
This is an example of a partial.

A partial makes it possible to {{ action }}.
```

To provide a value for a partial, the page that includes it can use the
following syntax:

```text
(!mypartial.mdx param1="val" param2="val"!)
```

For example, a page could supply a value to the `action` parameter in the
`mypartial.mdx` partial above using this expression:

```text
(!mypartial.mdx action="reuse content in docs pages."!)
```

This partial would render as:

```markdown
This is an example of a partial.

A partial makes it possible to reuse content in docs pages.
```

When including a partial, parameter definitions must be separated by single
spaces. Values must be enclosed in double quotes. Parameter names and values
must be separated by a `=` character, and the `=` character must not be
surrounded by spaces. 

If a partial defines parameters but a page does not assign them when including
the partial, the docs engine will render the literal `{{ }}` expressions for
those parameters within the content of the included partial. The exception to
this is when the partial defines default parameter values, as described in the
next section.

### Default parameter values

When defining parameters in a partial, you can instruct the docs engine to
supply a value for those parameters if a page that includes the partial does
not.

To define default parameter values, add an expression with the following format
to the top line of a partial:

```markdown
{{ param1="val1" param2="val2" param3="val3" }}
```

For example, let's say the `mypartial.mdx` partial we introduced earlier begins
with the following expression:

```markdown
{{ action="write docs pages more easily." }}
This is an example of a partial.

A partial makes it possible to {{ action }}.
```

If a page includes the partial with this expression...

```markdown
(!mypartial.mdx!)
```

...then the partial will render as follows:

```markdown
This is an example of a partial.

A partial makes it possible to write docs pages more easily.
```

Default parameter assignments follow the same rules as parameter value
assignments. Default parameter assignments must be separated by single spaces.
Values must be enclosed in double quotes. Parameter names and values must be
separated by a `=` character, and the `=` character must not be surrounded by
spaces. 

### Relative link paths in partials

When a partial contains a link with a relative path, the docs engine
evaluates the path relative to the partial, not the including file.

For example, let's say you have a file called `docs/pages/page.mdx` with the
following content:

```markdown
This is a page.

(!docs/pages/includes/include.mdx!)
```

The partial in `docs/pages/includes/include.mdx` looks like this:

```markdown
Here is an image:

![Screenshot](../../img/screenshot.png)
```

When including the partial, the docs engine will rewrite the link path to load
the image in `docs/img/screenshot.png`.

## Tables of Contents

You can add a list of links to pages in the current directory by adding the
following line to a docs page:

```
(!toc!)
```

The docs engine replaces this line with a list of links to pages in the current
directory, using the title and description of each page to populate the link:

```
- [Page 1](page1.mdx): This is a description of Page 1.
- [Page 2](page2.mdx): This is a description of Page 2.
```

## Tabs

To insert a tabs block like the one above, use this syntax:

```jsx
<Tabs>
  <TabItem label="First label">
    First tab.
  </TabItem>
  <TabItem label="Second label">
    Second tab.
  </TabItem>
</Tabs>
```

### Tabs scopes

For example, a page will display the "Teleport Cloud" label in this `Tabs`
component if the user selects the appropriate scope:

```jsx
<Tabs>
  <TabItem label="Self-Hosted" scope={["oss", "enterprise"]}>

  Here are instructions for users of Teleport Community Edition and Teleport
  Enterprise.

  </TabItem>
  <TabItem label="Teleport Cloud" scope="cloud">

  Here are instructions for Teleport Cloud users.

  </TabItem>
</Tabs>
```

### Two-dimensional Tabs components

You can add a second dimension of categories to a `Tabs` component by including
the `dropdownCaption` and `dropdownSelected` options, as shown below:

```jsx
<Tabs dropdownCaption="Choose an environment" dropdownSelected="Helm">
  <TabItem options="Helm" label="From Source">
    Instructions for building from source using a Helm chart.
  </TabItem>
  <TabItem options="Executable" label="From Source">
    Instructions for building from source using shell commands.
  </TabItem>
  <TabItem options="Helm" label="Latest Release">
    Instructions for installing the latest release using a Helm chart.
  </TabItem>
  <TabItem options="Executable" label="Latest Release">
    Instructions for installing the latest release using shell commands.
  </TabItem>
</Tabs>
```

The `options` attribute indicates which dropdown menu option will render a
`TabItem` visible.

### Dropdown-only Tabs components

For `Tabs` components with long lists of tabs, it often makes sense to display
all tabs via a single dropdown menu. You can do this using the `dropdownView`
option of the `Tabs` component:

```jsx
<Tabs dropdownView dropdownCaption="Teleport Component">
  <TabItem label="Database Service">
  More information about the Database Service.
  </TabItem>
  <TabItem label="Application Service">
  More information about the Application Service.
  </TabItem>
  <TabItem label="Desktop Service">
  More information about the Desktop Service.
  </TabItem>
  <TabItem label="SSH Service">
  More information about the SSH Service.
  </TabItem>
  <TabItem label="Kubernetes Service">
  More information about the Kubernetes Service.
  </TabItem>
  <TabItem label="Machine ID">
  More information about the Machine ID.
  </TabItem>
  <TabItem label="Auth Service">
  More information about the Auth Service.
  </TabItem>
  <TabItem label="Proxy Service">
  More information about the Proxy Service.
  </TabItem>
</Tabs>
```

Here is the result:

When defining a `Tabs` component with the `dropdownView` option enabled, you
must declare dropdown options using the `label` attribute of `TabItem`, not the
`options` attribute. 

## Variables, templating, and interpolation

Many documentation teams struggle with maintaining the vast number of articles
and resources that are eventually created and consumed. Links and images have to
be rechecked for accuracy and relevance.

To ease this burden, we can replace links and code examples with *variables* so we don't have to constantly update everything after each release.

Variables are stored in the `docs/config.json` file under the key `variables`.

To insert a variable into a page, use the `(\= path.to.variable \=)` syntax (remove backslashes in the actual Markdown).

Variables will be linted when a PR is created as part of our CI/CD process. If a variable does not exist in the config, you will see an error that you must remedy in order to merge your PR.

## Videos

To embed a video in a docs page, use the `video` tag:

```html
<video autoPlay loop muted playsInline>
  <source src="../../img/database-access/dbaccessdemo.mp4" type="video/mp4" />
  <source src="../../img/database-access/dbaccessdemo.webm" type="video/webm" />
Your browser does not support the video tag.
</video>
```

