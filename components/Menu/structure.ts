import { MenuCategoryProps } from "./Category";

const menu: MenuCategoryProps[] = [
  {
    title: "Platform",
    href: "/teleport/",
    testId: "products",
    children: [
      {
        title: "SSH",
        href: "/ssh-server-access/",
      },
      {
        title: "Kubernetes",
        href: "/kubernetes-access/",
      },
      {
        title: "Databases",
        href: "/database-access/",
      },
      {
        title: "Applications",
        href: "/application-access/",
      },
      {
        title: "Windows",
        href: "/desktop-access/",
      },
      {
        title: "Teleport Features",
        href: "/features/",
      },
    ],
  },
  {
    title: "Solutions",
    href: "/",
    testId: "solutions",
    children: [
      {
        title: "Financial Services",
        href: "/use-cases/finance/",
      },
      {
        title: "Software-as-a-service (SaaS) Providers",
        href: "/use-cases/saas/",
      },
      {
        title: "E-commerce & Entertainment",
        href: "/use-cases/ecommerce-entertainment/",
      },
      {
        title: "Infrastructure Access for AWS",
        href: "/use-cases/aws/",
      },
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
    title: "Documentation",
    href: "/",
    testId: "docs",
    children: [
      {
        title: "Documentation",
        href: "/docs/",
      },
      {
        title: "Teleport Clients",
        href: "/docs/connect-your-client/introduction/",
        passthrough: false,
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
        href: "/slack/",
      },
      {
        title: "GitHub",
        href: "https://github.com/gravitational/teleport/",
      },
    ],
  },
  {
    title: "Learn",
    href: "/resources/",
    testId: "learn",
    children: [
      {
        title: "The Blog",
        href: "/blog/",
      },
      {
        title: "Our Customers",
        href: "/case-study/",
      },
      {
        title: "Resources",
        href: "/resources/",
      },
      {
        title: "Events",
        href: "/about/events/",
      },
    ],
  },
  {
    title: "Pricing",
    href: "/pricing/",
    testId: "pricing",
  },
  {
    title: "Company",
    href: "/about/",
    testId: "company",
    children: [
      {
        title: "About Us",
        href: "/about/",
      },
      {
        title: "Careers",
        href: "/careers/",
      },
      {
        title: "News",
        href: "/about/press/",
      },
    ],
  },
];

export default menu;
