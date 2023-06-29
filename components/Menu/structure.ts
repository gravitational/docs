import { MenuCategoryProps } from "./Category";

const menu: MenuCategoryProps[] = [
  {
    title: "Platform",
    href: "/",
    testId: "platform",
    containsSubCategories: true,
    children: [
      {
        title: "Platform",
        children: [
          { title: "Why Teleport", href: "/why-teleport/" },
          { title: "How It Works", href: "/how-it-works/" },
        ],
      },
      {
        title: "Access Modules",
        titleLink: true,
        href: "/access-modules/",
        children: [
          { title: "SSH", href: "/ssh-server-access/" },
          { title: "Kubernetes", href: "/kubernetes-access/" },
          { title: "Databases", href: "/database-access/" },
          {
            title: "Internal Applications",
            href: "/access-modules/#applications",
          },
          { title: "Windows", href: "/access-modules/#windows" },
        ],
      },
      {
        title: "Our Features",
        href: "/features/",
        titleLink: true,
        children: [
          { title: "Assist", href: "/features/assist/" },
          { title: "Single Sign On", href: "/features/sso-for-ssh/" },
          {
            title: "Just In Time Access Requests",
            href: "/features/access-requests/",
          },
          {
            title: "Role Based Access Control",
            href: "/features/rbac-for-ssh/",
          },
          {
            title: "Audit and Session Recordings",
            href: "/how-it-works/audit-logging-for-ssh-and-kubernetes/",
          },
          {
            title: "Device Trust",
            href: "/docs/access-controls/guides/device-trust/",
          },
          { title: "Passwordless", href: "/passwordless/" },
        ],
      },
    ],
  },
  {
    title: "Solutions",
    href: "/",
    containsSubCategories: true,
    testId: "solutions",
    children: [
      {
        title: "By Industry",
        children: [
          {
            title: "E-commerce & Entertainment",
            href: "/use-cases/ecommerce-entertainment/",
          },
          {
            title: "Financial Services",
            href: "/use-cases/finance/",
          },
          {
            title: "Software-as-a-service (SaaS) Providers",
            href: "/use-cases/saas/",
          },
        ],
      },
      {
        title: "By Use Case",
        children: [
          {
            title: "Privileged Access Management",
            href: "/use-cases/privileged-access-management/",
          },
          {
            title: "Machine-to-Machine Access",
            href: "/use-cases/machine-to-machine-access/",
          },
          {
            title: "Developer-friendly browser",
            href: "/connect/",
          },
          {
            title: "Passwordless Infrastructure Access",
            href: "/passwordless/",
          },
        ],
      },
      {
        title: "By Cloud Provider",
        children: [
          {
            title: "Infrastructure Access for AWS",
            href: "/use-cases/aws/",
          },
        ],
      },
    ],
  },
  {
    title: "Resources",
    href: "/resources/",
    containsSubCategories: true,
    testId: "resources",
    children: [
      {
        title: "Try Teleport",
        children: [
          {
            title: "Teleport Labs",
            href: "/labs/",
          },
          {
            title: "Teleport Teams",
            href: "/signup/",
          },
          {
            title: "Integrations",
            href: "/integrations/",
          },
        ],
      },
      {
        title: "Community",
        titleLink: true,
        href: "/community/",
        children: [
          {
            title: "GitHub",
            href: "https://github.com/gravitational/teleport/",
          },
        ],
      },
      {
        title: "Resources",
        titleLink: true,
        href: "/resources/",
        children: [
          {
            title: "Blog",
            href: "/blog/",
          },
          {
            title: "Events",
            href: "/about/events/",
          },
          {
            title: "Webinars",
            href: "/resources/videos/",
          },
          {
            title: "Podcasts",
            href: "/resources/podcast/",
          },
          {
            title: "Tech Papers",
            href: "/resources/white-papers/",
          },
        ],
      },
      {
        title: "Support",
        children: [
          {
            title: "Support Portal",
            href: "/support/",
          },
          {
            title: "Community Slack",
            href: "/community-slack/",
          },
          {
            title: "GitHub Discussion",
            href: "https://github.com/gravitational/teleport/discussion",
          },
          {
            title: "System Status",
            href: "https://status.goteleport.com/",
          },
        ],
      },
      {
        title: "",
        children: [
          {
            href: "/resources/books/identity-native-infrastructure-access-management/",
            title: "Featured Resource",
            isImageLink: true,
            imageSrc: "/static/og-cards/books/oreilly.png",
          },
        ],
      },
    ],
  },
  {
    title: "Documentation",
    href: "/docs/",
    testId: "docs",
    children: [
      {
        title: "Documentation",
        href: "/docs/",
      },
      {
        title: "Teleport Clients",
        href: "/docs/connect-your-client/introduction/",
      },
      {
        title: "How It Works",
        href: "/how-it-works/",
      },
      {
        title: "Teleport Labs",
        href: "/labs/",
      },
      {
        title: "Teleport Community",
        href: "/community/",
      },
      {
        title: "Teleport Slack Channel",
        href: "/community-slack/",
      },
      {
        title: "GitHub",
        href: "https://github.com/gravitational/teleport/",
      },
    ],
  },
  {
    title: "Pricing",
    href: "/pricing/",
    testId: "pricing",
  },
];

export default menu;
