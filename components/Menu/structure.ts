import ApplicationSvgPath from "./assets/application.svg";
import DatabaseSvgPath from "./assets/database.svg";
import DesktopSvgPath from "./assets/desktop.svg";
import FeaturesSvgPath from "./assets/features.svg";
import KubernetesSvgPath from "./assets/kubernetes.svg";
import ServerSvgPath from "./assets/server.svg";
import { MenuCategoryProps } from "./Category";

const menu: MenuCategoryProps[] = [
  {
    title: "Protocols",
    description: "Teleport Access Platform protocols",
    href: "/teleport/",
    testId: "products",
    children: [
      {
        image: ServerSvgPath,
        title: "SSH",
        description:
          "SSH securely into Linux servers and smart devices with a complete audit trail",
        href: "/ssh-server-access/",
      },
      {
        image: KubernetesSvgPath,
        title: "Kubernetes",
        description:
          "Access Kubernetes clusters securely with complete visibility to access and behavior",
        href: "/kubernetes-access/",
      },
      {
        image: ApplicationSvgPath,
        title: "Databases",
        description: "For SQL and NoSQL databases across multi-environments",
        href: "/database-access/",
      },
      {
        image: DatabaseSvgPath,
        title: "Applications",
        description:
          "Access web applications running behind NAT and firewalls with security and compliance",
        href: "/application-access/",
      },
      {
        image: DesktopSvgPath,
        title: "Windows",
        description:
          "Securely access Windows servers and desktops in multiple environments.",
        href: "/desktop-access/",
      },
      {
        image: FeaturesSvgPath,
        title: "Teleport Features",
        description:
          "An overview of Teleport Access Plane features, capabilities and more...",
        href: "/features/",
      },
    ],
  },
  {
    title: "Solutions",
    description: "Teleport Solutions",
    href: "/",
    testId: "solutions",

    children: [
      {
        icon: "building",
        title: "Financial Services",
        description: "Learn how Financial Services companies use Teleport",
        href: "/use-cases/finance/",
      },
      {
        icon: "window",
        title: "Software-as-a-service (SaaS) Providers",
        description: "Learn how SaaS providers use Teleport",
        href: "/use-cases/saas/",
      },
      {
        icon: "gamepad",
        title: "E-commerce & Entertainment",
        description:
          "Learn how E-commerce & Entertainment companies use Teleport",
        href: "/use-cases/ecommerce-entertainment/",
      },
      {
        icon: "server",
        title: "Infrastructure Access for AWS",
        description:
          "Easily control who can provision and access your critical AWS resources",
        href: "/use-cases/aws/",
      },
      {
        icon: "card",
        title: "Privileged Access Management",
        description:
          "Secure your critical infrastructure without slowing developers down",
        href: "/use-cases/privileged-access-management/",
      },
      {
        icon: "chip",
        title: "Machine-to-Machine Access",
        description:
          "Machine ID delivers automated, identity-based access for your services",
        href: "/use-cases/machine-to-machine-access/",
      },
      {
        icon: "connect",
        title: "Developer-friendly browser",
        description:
          "Teleport Connect improves UX and identity-based access for the cloud",
        href: "/connect/",
      },
      {
        icon: "lock",
        title: "Passwordless Infrastructure Access",
        description:
          "Instantly login to all your computing infrastructure using Passwordless",
        href: "/passwordless/",
      },
    ],
  },
  {
    title: "Documentation",
    description: "Teleport Documentation",
    href: "/",
    testId: "docs",
    children: [
      {
        icon: "stack",
        title: "Documentation",
        description: "Installation and Teleport user guides",
        href: "/docs/",
      },
      {
        icon: "book",
        title: "Teleport Clients",
        description: "Learn how to connect to Teleport-protected services",
        href: "/docs/connect-your-client/introduction/",
        passthrough: false,
      },
      {
        icon: "gamepad",
        title: "How It Works",
        description: "Learn the fundamentals of how Teleport works",
        href: "/how-it-works/",
      },
      {
        icon: "desktop",
        title: "Teleport Labs",
        description: "Get hands on experience with Teleport",
        href: "/labs/",
      },
      {
        icon: "question",
        title: "Teleport Community",
        description:
          "Ask us a setup question, post your tutorial, feedback or idea on our forum",
        href: "/community/",
      },
      {
        icon: "window",
        title: "Teleport Slack Channel",
        description: "Need help with set-up? Ping us in Slack channel",
        href: "/slack/",
      },
      {
        icon: "code",
        title: "GitHub",
        description: "View the open source repository on Github",
        href: "https://github.com/gravitational/teleport/",
      },
    ],
  },
  {
    title: "Learn",
    description: "Learn More About Teleport",
    href: "/resources/",
    testId: "learn",
    children: [
      {
        icon: "note",
        title: "The Blog",
        description: "Technical articles, news, and product announcements",
        href: "/blog/",
      },
      {
        icon: "building",
        title: "Our Customers",
        description:
          "Learn how companies use Teleport to secure their environments",
        href: "/case-study/",
      },
      {
        icon: "presentation",
        title: "Resources",
        description:
          "A collection of whitepapers, webinars, demos, and more...",
        href: "/resources/",
      },
      {
        icon: "calendar",
        title: "Events",
        description: "View our upcoming events",
        href: "/about/events/",
      },
    ],
  },
  {
    title: "Pricing",
    description: "Pricing",
    href: "/pricing/",
    testId: "pricing",
  },
  {
    title: "Company",
    description: "Company",
    href: "/about/",
    testId: "company",
    children: [
      {
        icon: "building",
        title: "About Us",
        description: "Our missions and vision for the future",
        href: "/about/",
      },
      {
        icon: "flag",
        title: "Careers",
        description: "View our available career opportunities",
        href: "/careers/",
      },
      {
        icon: "earth",
        title: "News",
        description: "Featured publication from around the web",
        href: "/about/press/",
      },
    ],
  },
];

export default menu;
