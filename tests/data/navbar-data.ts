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
    button: { title: "Products", testId: "products" },
    menu: {
      title: "Teleport Products",
      testId: "products-menu",
      children: [
        {
          title: "Server Access",
          href: "/ssh-server-access/",
          isExternal: true,
        },
        {
          title: "Kubernetes Access",
          href: "/kubernetes-access/",
          isExternal: true,
        },
        {
          title: "Application Access",
          href: "/application-access/",
          isExternal: true,
        },
        {
          title: "Database Access",
          href: "/database-access/",
          isExternal: true,
        },
        {
          title: "Desktop Access",
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
    button: { title: "Use Cases", testId: "use-cases" },
    menu: {
      title: "Teleport Use Cases",
      testId: "use-cases-menu",
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
          title: "Teleport Connect 2022",
          href: "/teleport-connect-2022/?utm_campaign=eg&utm_medium=web&utm_source=navbar",
          isExternal: true,
        },
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
        {
          title: "What is SSH?",
          href: "/ssh/",
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
