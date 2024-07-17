import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { default as DocNavigation } from "layouts/DocsPage/Navigation";

import { TabItem } from "./TabItem";
import { Tabs } from "./Tabs";

export const NavigationFourLevels = () => {
  const data = [
    {
      icon: "wrench",
      title: "Enroll Resources",
      entries: [
        {
          title: "Machine ID",
          slug: "/enroll-resources/machine-id/",
          entries: [
            {
              title: "Deploy Machine ID",
              slug: "/enroll-resources/machine-id/deployment/",
              entries: [
                {
                  title: "Deploy Machine ID on AWs",
                  slug: "/enroll-resources/machine-id/deployment/aws/",
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  return (
    <DocNavigation
      data={data}
      section={true}
      currentVersion="16.x"
      currentPathGetter={() => {
        return "/enroll-resources/machine-id/deployment/aws/";
      }}
    ></DocNavigation>
  );
};

const meta: Meta<typeof Tabs> = {
  title: "layouts/DocNavigation",
  component: NavigationFourLevels,
};
export default meta;
type Story = StoryObj<typeof Tabs>;

// export const InitialStateTab: Story = {
//   play: async ({ canvasElement, step }) => {
//     const canvas = within(canvasElement);
//     await step("Should be the text for the selected option", async () => {
//       expect(
//         await canvas.findByText(
//           "Instructions for installing release using shell commands."
//         )
//       ).toBeTruthy();
//     });
//     await step(
//       "Selected option should be disabled for re-selection",
//       async () => {
//         expect(canvas.getByText("Shell")).toBeDisabled();
//       }
//     );
//   },
// };
