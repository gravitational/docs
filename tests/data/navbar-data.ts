const HOST = "goteleport.com";

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
          href: `https://${HOST}/ssh-server-access/`,
          isExternal: true,
        },
        {
          title: "Kubernetes Access",
          href: `https://${HOST}/kubernetes-access/`,
          isExternal: true,
        },
        {
          title: "Application Access",
          href: `https://${HOST}/application-access/`,
          isExternal: true,
        },
        {
          title: "Database Access",
          href: `https://${HOST}/database-access/`,
          isExternal: true,
        },
        {
          title: "Desktop Access",
          href: `https://${HOST}/desktop-access/`,
          isExternal: true,
        },
        {
          title: "Teleport Features",
          href: `https://${HOST}/features/`,
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
          href: `https://${HOST}/use-cases/finance/`,
          isExternal: true,
        },
        {
          title: "Software-as-a-service (SaaS) Providers",
          href: `https://${HOST}/use-cases/saas/`,
          isExternal: true,
        },
        {
          title: "E-commerce & Entertainment",
          href: `https://${HOST}/use-cases/ecommerce-entertainment/`,
          isExternal: true,
        },
        {
          title: "Infrastructure Access for AWS",
          href: `https://${HOST}/use-cases/aws/`,
          isExternal: true,
        },
        {
          title: "Privileged Access Management",
          href: `https://${HOST}/use-cases/privileged-access-management/`,
          isExternal: true,
        },
        {
          title: "Machine-to-Machine Access",
          href: `https://${HOST}/use-cases/machine-to-machine-access/`,
          isExternal: true,
        },
        {
          title: "Developer-friendly browser",
          href: `https://${HOST}/connect/`,
          isExternal: true,
        },
        {
          title: "Passwordless Infrastructure Access",
          href: `https://${HOST}/passwordless/`,
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
          href: `https://${HOST}/docs/`,
        },
        {
          title: "How It Works",
          href: `https://${HOST}/how-it-works/`,
          isExternal: true,
        },
        {
          title: "Teleport Labs",
          href: `https://${HOST}/labs/`,
          isExternal: true,
        },
        {
          title: "Community Forum",
          href: "https://github.com/gravitational/teleport/discussions/",
          isExternal: true,
        },
        {
          title: "Teleport Slack Channel",
          href: `https://${HOST}/slack/`,
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
          href: `https://${HOST}/blog/`,
          isExternal: true,
        },
        {
          title: "Our Customers",
          href: `https://${HOST}/case-study/`,
          isExternal: true,
        },
        {
          title: "Resources",
          href: `https://${HOST}/resources/`,
          isExternal: true,
        },
        {
          title: "Events",
          href: `https://${HOST}/about/events/`,
          isExternal: true,
        },
        {
          title: "What is SSH?",
          href: `https://${HOST}/ssh/`,
          isExternal: true,
        },
      ],
    },
  },
  {
    button: { title: "Pricing", testId: "pricing" },
    href: `https://${HOST}/pricing/`,
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
          href: `https://${HOST}/about/`,
          isExternal: true,
        },
        {
          title: "Careers",
          href: `https://${HOST}/careers/`,
          isExternal: true,
        },
        {
          title: "News",
          href: `https://${HOST}/about/press/`,
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
    href: `https://${HOST}/pricing/`,
    isExternal: true,
  },
];
