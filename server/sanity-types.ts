export type SanityBtn = {
  title: string;
  href: string;
  id: string;
  size?: "small" | "medium" | "large" | "xl" | "xxl";
  variant?: "text" | "outlined" | "contained";
  sendBtnClick: boolean;
};
type NavSection = {
  title?: string | null;
  subtitle?: string | null;
  sectionItems: {
    itemType: string | "normal" | "image";
    icon?: string | null;
    title?: string | null;
    description?: string | null;
    link: string | null;
    imageItem?: {
      imageTitle?: string | null;
      useMetadata: boolean | null;
      customImage?: {
        itemImage: string;
        itemTitle: string;
        imageCTA?: string;
        imageDate?: string;
      } | null;
    };
  }[];
};
export type NavigationItem = {
  title: string;
  isDropdown: string | "dropdown" | "link";
  url?: string;
  menuType?: string | "aio" | "submenus";
  columns?:
    | {
        columnSections: NavSection[];
      }[]
    | null;
  submenus?:
    | {
        submenuTitle?: string | null;
        titleLink?: string;
        submenuSections: NavSection[];
      }[]
    | null;
};
export type HeaderNavigation = {
  navbarData: {
    logo: string | null;
    menu: NavigationItem[] | null;
    rightSide: {
      search: { searchIcon: string; searchLink: string } | null;
      CTAs: SanityBtn[];
      mobileBtn?: SanityBtn;
    } | null;
  };
  bannerButtons: {
    first: { title: string; url: string };
    second: { title: string; url: string };
  };
};
