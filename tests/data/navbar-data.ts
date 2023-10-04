export type LinkData = {
  title: string;
  href: string;
  isExternal?: boolean;
};

export type MenuButton = {
  title: string;
  testId: string;
};

export type Menu = {
  title: string;
  testId: string;
  children: LinkData[];
};

export type NavigationItem = {
  button: MenuButton;
  menu?: Menu;
  href?: string;
  isExternal?: boolean;
};

export type NavbarData = NavigationItem[];

export const navigationData: NavbarData = [
  {
    button: { title: "Platform", testId: "platform" },
    menu: {
      title: "Platform",
      testId: "platform-menu",
      children: [
        { title: "Why Teleport", href: "/why-teleport/", isExternal: true },
        { title: "How It Works", href: "/how-it-works/", isExternal: true },
        {
          title: "SSH",
          href: "/ssh-server-access/",
          isExternal: true,
        },
        {
          title: "Kubernetes",
          href: "/kubernetes-access/",
          isExternal: true,
        },
        {
          title: "Databases",
          href: "/database-access/",
          isExternal: true,
        },
        {
          title: "Internal Webapps",
          href: "/application-access/",
          isExternal: true,
        },
        {
          title: "Windows",
          href: "/desktop-access/",
          isExternal: true,
        },
        {
          title: "AWS Console",
          href: "/use-cases/aws/",
          isExternal: true,
        },
        { title: "Our Features", href: "/features/", isExternal: true },
        { title: "Assist", href: "/features/assist/", isExternal: true },
        {
          title: "Single Sign On",
          href: "/features/sso-for-ssh/",
          isExternal: true,
        },
        {
          title: "Just In Time Access Requests",
          href: "/features/access-requests/",
          isExternal: true,
        },
        {
          title: "Role Based Access Control",
          href: "/features/rbac-for-ssh/",
          isExternal: true,
        },
        {
          title: "Audit and Session Recordings",
          href: "/how-it-works/audit-logging-for-ssh-and-kubernetes/",
          isExternal: true,
        },
        {
          title: "Device Trust",
          href: "/docs/access-controls/guides/device-trust/",
          isExternal: true,
        },
        { title: "Passwordless", href: "/passwordless/", isExternal: true },
      ],
    },
  },
  {
    button: { title: "Solutions", testId: "solutions" },
    menu: {
      title: "Solutions",
      testId: "solutions-menu",
      children: [
        {
          title: "E-commerce & Entertainment",
          href: "/use-cases/ecommerce-entertainment/",
          isExternal: true,
        },
        {
          title: "Financial Services",
          href: "/use-cases/finance/",
          isExternal: true,
        },
        {
          title: "Software-as-a-service (SaaS) Providers",
          href: "/use-cases/saas/",
          isExternal: true,
        },
        {
          title: "Privileged Access Management",
          href: "/use-cases/privileged-access-management/",
          isExternal: true,
        },
        {
          title: "Machine-to-Machine Access",
          href: "/use-cases/machine-to-machine-access/",
          isExternal: true,
        },
        {
          title: "Developer-friendly browser",
          href: "/connect/",
          isExternal: true,
        },
        {
          title: "Passwordless Infrastructure Access",
          href: "/passwordless/",
          isExternal: true,
        },
        {
          title: "Infrastructure Access for AWS",
          href: "/use-cases/aws/",
          isExternal: true,
        },
        {
          title: "FedRAMP",
          href: "/use-cases/fedramp-compliance/",
          isExternal: true,
        },
        {
          title: "HIPAA",
          href: "/use-cases/hipaa-compliance/",
          isExternal: true,
        },
        {
          title: "SOC 2",
          href: "/use-cases/soc2-compliance/",
          isExternal: true,
        },
      ],
    },
  },
  {
    button: { title: "Resources", testId: "resources" },
    menu: {
      title: "Resources",
      testId: "resources-menu",
      children: [
        {
          title: "Teleport Labs",
          href: "/labs/",
          isExternal: true,
        },
        {
          title: "Teleport Team",
          href: "/signup/",
          isExternal: true,
        },
        {
          title: "Integrations",
          href: "/integrations/",
          isExternal: true,
        },
        {
          title: "Community",
          href: "/community/",
          isExternal: true,
        },
        {
          title: "Our Customers",
          href: "/case-study/",
          isExternal: true,
        },
        {
          title: "GitHub",
          href: "https://github.com/gravitational/teleport/",
          isExternal: true,
        },
        {
          title: "Resources",
          href: "/resources/",
          isExternal: true,
        },
        {
          title: "Blog",
          href: "/blog/",
          isExternal: true,
        },
        {
          title: "Events",
          href: "/about/events/",
          isExternal: true,
        },
        {
          title: "Webinars",
          href: "/resources/videos/",
          isExternal: true,
        },
        {
          title: "Podcasts",
          href: "/resources/podcast/",
          isExternal: true,
        },
        {
          title: "Tech Papers",
          href: "/resources/white-papers/",
          isExternal: true,
        },
        {
          title: "Support Portal",
          href: "/support/",
          isExternal: true,
        },
        {
          title: "Community Slack",
          href: "/community-slack/",
          isExternal: true,
        },
        {
          title: "GitHub Discussion",
          href: "https://github.com/gravitational/teleport/discussions",
          isExternal: true,
        },
        {
          title: "System Status",
          href: "https://status.goteleport.com/",
          isExternal: true,
        },
        {
          title: "Featured Resource",
          href: "/resources/books/identity-native-infrastructure-access-management/",
          isExternal: true,
        },
      ],
    },
  },
  {
    button: { title: "Documentation", testId: "docs" },
    menu: {
      title: "Documentation",
      testId: "docs-menu",
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
          isExternal: true,
        },
        {
          title: "Teleport Labs",
          href: "/labs/",
          isExternal: true,
        },
        {
          title: "Teleport Community",
          href: "/community/",
          isExternal: true,
        },
        {
          title: "Teleport Slack Channel",
          href: "/community-slack/",
          isExternal: true,
        },
        {
          title: "GitHub",
          href: "https://github.com/gravitational/teleport/",
          isExternal: true,
        },
      ],
    },
  },
  {
    button: { title: "Pricing", testId: "pricing" },
    href: "/pricing/",
    isExternal: true,
  },
  {
    button: { title: "Community", testId: "community" },
    menu: {
      title: "Community",
      testId: "community-menu",
      children: [
        {
          title: "Getting Started with OSS",
          href: "/docs/",
        },
        {
          title: "Downloads",
          href: "/download/",
        },
        {
          title: "Community Slack",
          href: "/community-slack/",
        },
        {
          title: "GitHub Discussions",
          href: "https://github.com/gravitational/teleport/discussions",
        },
        {
          title: "Podcasts",
          href: "/resources/podcast/",
        },
      ],
    },
  },
  {
    button: { title: "Sign In", testId: "sign-in" },
    menu: {
      title: "Sign in to Teleport",
      testId: "sign-in-menu",
      children: [
        {
          title: "Teleport Cloud Login",
          href: "https://teleport.sh/",
          isExternal: true,
        },
        {
          title: "Dashboard Login",
          href: "https://dashboard.gravitational.com/web/login/",
          isExternal: true,
        },
      ],
    },
  },
  {
    button: { title: "Get Started", testId: "get-started" },
    href: "/signup/",
    isExternal: true,
  },
];
