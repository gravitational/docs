import { MenuCategoryProps } from "./Category";
import DatabaseSvgPath from "./assets/database.svg";
import ApplicationSvgPath from "./assets/application.svg";
import KubernetesSvgPath from "./assets/kubernetes.svg";
import ServerSvgPath from "./assets/server.svg";
import DesktopSvgPath from "./assets/desktop.svg";
import FeaturesSvgPath from "./assets/features.svg";

const HOST = "goteleport.com";
import { sendAnalyticsEvent } from "utils/tracking";

const onClick = () =>
  sendAnalyticsEvent({
    action: "Button Click",
    category: "Pricing Buttons",
    label: "Navbar Pricing Button",
  });

const menu: MenuCategoryProps[] = [
  {
    title: "Products",
    description: "Teleport Products",
    href: `https://${HOST}/`,
    testId: "products",
    children: [
      {
        image: ServerSvgPath,
        title: "Server Access",
        description:
          "SSH securely into Linux servers and smart devices with a complete audit trail",
        href: `https://${HOST}/ssh-server-access/`,
      },
      {
        image: KubernetesSvgPath,
        title: "Kubernetes Access",
        description:
          "Access Kubernetes clusters securely with complete visibility to access and behavior",
        href: `https://${HOST}/kubernetes-access/`,
      },
      {
        image: ApplicationSvgPath,
        title: "Application Access",
        description:
          "Access web applications running behind NAT and firewalls with security and compliance",
        href: `https://${HOST}/application-access/`,
      },
      {
        image: DatabaseSvgPath,
        title: "Database Access",
        description:
          "For PostgreSQL and MySQL databases behind NAT in multiple environments",
        href: `https://${HOST}/database-access/`,
      },
      {
        image: DesktopSvgPath,
        title: "Desktop Access",
        description:
          "Securely access Windows servers and desktops in multiple environments.",
        href: `https://${HOST}/desktop-access/`,
      },
      {
        image: FeaturesSvgPath,
        title: "Teleport Features",
        description:
          "An overview of Teleport Access Plane features, capabilities and more...",
        href: `https://${HOST}/features/`,
      },
    ],
  },
  {
    title: "Use Cases",
    description: "Teleport Use Cases",
    href: `/`,
    testId: "use-cases",

    children: [
      {
        icon: "building",
        title: "Financial Services",
        description: "Learn how Financial Services companies use Teleport",
        href: `https://${HOST}/use-cases/finance/`,
      },
      {
        icon: "window",
        title: "Software-as-a-service (SaaS) Providers",
        description: "Learn how SaaS providers use Teleport",
        href: `https://${HOST}/use-cases/saas/`,
      },
      {
        icon: "gamepad",
        title: "E-commerce & Entertainment",
        description:
          "Learn how E-commerce & Entertainment companies use Teleport",
        href: `https://${HOST}/use-cases/ecommerce-entertainment/`,
      },
      {
        icon: "server",
        title: "Infrastructure Access for AWS",
        description:
          "Easily control who can provision and access your critical AWS resources",
        href: `https://${HOST}/use-cases/aws/`,
      },
      {
        icon: "card",
        title: "Privileged Access Management",
        description:
          "Secure your critical infrastructure without slowing developers down",
        href: `https://${HOST}/use-cases/privileged-access-management/`,
      },
      {
        icon: "chip",
        title: "Machine-to-Machine Access",
        description:
          "Machine ID delivers automated, identity-based access for your services",
        href: `https://${HOST}/use-cases/machine-to-machine-access/`,
      },
      {
        icon: "connect",
        title: "Developer-friendly browser",
        description:
          "Teleport Connect improves UX and identity-based access for the cloud",
        href: `https://${HOST}/connect/`,
      },
      {
        icon: "lock",
        title: "Passwordless Infrastructure Access",
        description:
          "Instantly login to all your computing infrastructure using Passwordless",
        href: `https://${HOST}/passwordless/`,
      },
    ],
  },
  {
    title: "Documentation",
    description: "Teleport Documentation",
    href: "/docs/",
    testId: "docs",
    children: [
      {
        icon: "stack",
        title: "Documentation",
        description: "Installation and Teleport user guidessssss",
        href: `https://${HOST}/docs/`,
      },
      {
        icon: "gamepad",
        title: "How It Works",
        description: "Learn the fundamentals of how Teleport works",
        href: `https://${HOST}/how-it-works/`,
      },
      {
        icon: "desktop",
        title: "Teleport Labs",
        description: "Get hands on experience with Teleport",
        href: `https://${HOST}/labs/`,
      },
      {
        icon: "question",
        title: "Community Forum",
        description:
          "Ask us a setup question, post your tutorial, feedback or idea on our forum",
        href: `https://github.com/gravitational/teleport/discussions/`,
      },
      {
        icon: "window",
        title: "Teleport Slack Channel",
        description: "Need help with set-up? Ping us in Slack channel",
        href: `https://${HOST}/slack/`,
      },
      {
        icon: "code",
        title: "GitHub",
        description: "View the open source repository on Github",
        href: `https://github.com/gravitational/teleport/`,
      },
    ],
  },
  {
    title: "Learn",
    description: "Learn More About Teleport",
    href: `/resources/`,
    testId: "learn",
    children: [
      {
        icon: "note",
        title: "The Blog",
        description: "Technical articles, news, and product announcements",
        href: `https://${HOST}/blog/`,
      },
      {
        icon: "building",
        title: "Our Customers",
        description:
          "Learn how companies use Teleport to secure their environments",
        href: `https://${HOST}/case-study/`,
      },
      {
        icon: "presentation",
        title: "Resources",
        description:
          "A collection of whitepapers, webinars, demos, and more...",
        href: `https://${HOST}/resources/`,
      },
      {
        icon: "calendar",
        title: "Events",
        description: "View our upcoming events",
        href: `https://${HOST}/about/events/`,
      },
      {
        icon: "code2",
        title: "What is SSH?",
        description:
          "Learn the basics of SSH and how it's used to Access Infrastructure",
        href: `https://${HOST}/ssh/`,
      },
    ],
  },
  {
    title: "Pricing",
    description: "Pricing",
    href: `https://${HOST}/pricing/`,
    testId: "pricing",
  },
  {
    title: "Company",
    description: "Company",
    href: `https://${HOST}/about/`,
    testId: "company",
    children: [
      {
        icon: "building",
        title: "About Us",
        description: "Our missions and vision for the future",
        href: `https://${HOST}/about/`,
      },
      {
        icon: "flag",
        title: "Careers",
        description: "View our available career opportunities",
        href: `https://${HOST}/careers/`,
      },
      {
        icon: "earth",
        title: "News",
        description: "Featured publication from around the web",
        href: `https://${HOST}/about/press/`,
      },
    ],
  },
];

export default menu;
