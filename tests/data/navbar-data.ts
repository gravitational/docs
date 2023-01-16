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
    button: { title: "Protocols", testId: "products" },
    menu: {
      title: "Teleport Access Platform protocols",
      testId: "products-menu",
      children: [
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
          isExternal: true,
          title: "Databases",
          href: "/database-access/",
        },
        {
          isExternal: true,
          title: "Applications",
          href: "/application-access/",
        },
        {
          title: "Windows",
          href: "/desktop-access/",
          isExternal: true,
        },
        {
          title: "Teleport Features",
          href: "/features/",
          isExternal: true,
        },
      ],
    },
  },
  {
    button: { title: "Solutions", testId: "solutions" },
    menu: {
      title: "Teleport Solutions",
      testId: "solutions-menu",
      children: [
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
          title: "E-commerce & Entertainment",
          href: "/use-cases/ecommerce-entertainment/",
          isExternal: true,
        },
        {
          title: "Infrastructure Access for AWS",
          href: "/use-cases/aws/",
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
      ],
    },
  },
  {
    button: { title: "Documentation", testId: "docs" },
    menu: {
      title: "Teleport Documentation",
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
          href: "/slack/",
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
    button: { title: "Learn", testId: "learn" },
    menu: {
      title: "Learn More About Teleport",
      testId: "learn-menu",
      children: [
        {
          title: "The Blog",
          href: "/blog/",
          isExternal: true,
        },
        {
          title: "Our Customers",
          href: "/case-study/",
          isExternal: true,
        },
        {
          title: "Resources",
          href: "/resources/",
          isExternal: true,
        },
        {
          title: "Events",
          href: "/about/events/",
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
    button: { title: "Company", testId: "company" },
    menu: {
      title: "Company",
      testId: "company-menu",
      children: [
        {
          title: "About Us",
          href: "/about/",
          isExternal: true,
        },
        {
          title: "Careers",
          href: "/careers/",
          isExternal: true,
        },
        {
          title: "News",
          href: "/about/press/",
          isExternal: true,
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
    href: "/pricing/",
    isExternal: true,
  },
];
