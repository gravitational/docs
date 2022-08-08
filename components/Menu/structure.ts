import { MenuCategoryProps } from "./Category";
import databaseSvgPath from "./assets/database.svg";
import applicationSvgPath from "./assets/application.svg";
import kubernetesSvgPath from "./assets/kubernetes.svg";
import serverSvgPath from "./assets/server.svg";
import desktopSvgPath from "./assets/desktop.svg";
import featuresSvgPath from "./assets/features.svg";

const menu: MenuCategoryProps[] = [
  {
    title: "Products",
    description: "Teleport Products",
    href: "/teleport/",
    children: [
      {
        image: serverSvgPath,
        title: "Server Access",
        description:
          "SSH securely into Linux servers and smart devices with a complete audit trail",
        href: "/ssh-server-access/",
      },
      {
        image: kubernetesSvgPath,
        title: "Kubernetes Access",
        description:
          "Access Kubernetes clusters securely with complete visibility to access and behavior",
        href: "/kubernetes-access/",
      },
      {
        image: applicationSvgPath,
        title: "Application Access",
        description:
          "Access web applications running behind NAT and firewalls with security and compliance",
        href: "/application-access/",
      },
      {
        image: databaseSvgPath,
        title: "Database Access",
        description: "For SQL and NoSQL databases across multi-environments",
        href: "/database-access/",
      },
      {
        image: desktopSvgPath,
        title: "Desktop Access",
        description:
          "Securely access Windows servers and desktops in multiple environments.",
        href: "/desktop-access/",
      },
      {
        image: featuresSvgPath,
        title: "Teleport Features",
        description:
          "An overview of Teleport Access Plane features, capabilities and more...",
        href: "/features/",
      },
    ],
  },
  {
    title: "Use Cases",
    description: "Teleport Use Cases",
    href: "/",
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
    description: "Teleport documentation",
    href: "/docs/",
    children: [
      {
        icon: "stack",
        title: "Documentation",
        description: "Installation and Teleport user guides",
        href: "https://goteleport.com/docs/",
      },
      {
        icon: "gamepad",
        title: "How it Works",
        description: "Learn the fundamentals of how Teleport works",
        href: "/teleport/how-it-works/",
      },
      {
        icon: "question",
        title: "Community Forum",
        description:
          "Ask us a setup question, post your tutorial, feedback or idea on our forum",
        href: "https://github.com/gravitational/teleport/discussions",
      },
      {
        icon: "window",
        title: "Teleport Slack Channel",
        description: "Need help with set-up? Ping us in Slack channel",
        href: "/slack",
      },
      {
        icon: "code",
        title: "Github",
        description: "View the open source repository on Github",
        href: "https://github.com/gravitational/teleport",
      },
    ],
  },
  {
    title: "Learn",
    description: "Learn more about teleport",
    href: "/resources/",
    children: [
      {
        icon: "note",
        title: "The blog",
        description: "Technical articles, news, and product announcements",
        href: "/blog/",
      },
      {
        icon: "building",
        title: "Our customers",
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
      {
        icon: "code2",
        title: "What is SSH?",
        description:
          "Learn the basics of SSH and how it's used to Access Infrastructure",
        href: "/ssh/",
      },
    ],
  },
  {
    title: "Pricing",
    description: "Pricing",
    href: "/pricing/",
  },
  {
    title: "Company",
    description: "Company",
    href: "/about/",
    children: [
      {
        icon: "building",
        title: "About us",
        description: "Our missions and vision for the future",
        href: "/about/",
      },
      {
        icon: "flag",
        title: "Careers",
        description: "View our available career opportunities",
        href: "/careers",
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
