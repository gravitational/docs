import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { default as DocNavigation } from "layouts/DocsPage/Navigation";
import { NavigationCategory } from "./types";

export const NavigationFourLevels = () => {
  const data = [
    {
      icon: "cloud",
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
                  title: "Deploy Machine ID on AWS",
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
      data={data as Array<NavigationCategory>}
      section={true}
      currentVersion="16.x"
      currentPathGetter={() => {
        return "/enroll-resources/machine-id/deployment/aws/";
      }}
    ></DocNavigation>
  );
};

const meta: Meta<typeof DocNavigation> = {
  title: "layouts/DocNavigation",
  component: NavigationFourLevels,
};
export default meta;
