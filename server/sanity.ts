const PROJECT_ID = process.env["SANITY_PROJECT_ID"] || "";
const DATASET = process.env["SANITY_DATASET"] || "";

const bannerQuery = `*[_type == "topBanner"][0] {
      bannerType,
      event -> {
        location,
        link,
        title,
        start,
        end,
        isVirtual,
      },
      title,
      cta,
      link,
      end,
      defaultContent,
      sideButtons,
    }`;

interface BannerResponse {
  result: BannerData;
}

interface BannerData {
  bannerType: string;
  event: any;
  cta: any;
  sideButtons: any;
}

export async function fetchEventsFromSanity() {
  const apiUrl = `https://${PROJECT_ID}.api.sanity.io/v1/data/query/${DATASET}?query=${encodeURIComponent(
    bannerQuery
  )}`;

  const response = await fetch(apiUrl);

  const data = await response.json().then((res: BannerResponse) => res?.result);
  if (!data) return undefined;
  if (data?.bannerType === "event")
    return {
      ...data?.event,
      cta: data?.cta,
      bannerType: data?.bannerType,
      sideButtons: data?.sideButtons,
    };
  return data;
}

const navQuery = `
{
"navbarData": *[_type == "navigation"][0] {
  "logo": logo.asset->url,
  menu[]{
    title,
    isDropdown,
    url,
    menuType,
    columns[]{
      columnSections[]{
        title,
        subtitle,
        sectionItems[]{
          itemType,
          "icon": icon.asset->url,
          title,
          description,
          link,
          imageItem {
            imageTitle,
            useMetadata,
            customImage {
              "itemImage": itemImage.asset->url,
              itemTitle,
              imageCTA,
              imageDate
            }
          }
        }
      }
    },
    submenus[]{
      submenuTitle,
      titleLink,
      submenuSections[]{
        title,
        subtitle,
        sectionItems[]{
          itemType,
          "icon": icon.asset->url,
          title,
          description,
          link,
          imageItem {
            imageTitle,
            useMetadata,
            customImage {
              "itemImage": itemImage.asset->url,
              itemTitle,
              imageCTA,
              imageDate
            }
          }
        }
      }
    }
  },
  rightSide {
    search {
      "searchIcon": searchIcon.asset->url,
      searchLink
    },
    CTAs,
    mobileBtn
  }
},
"bannerButtons": *[_type == "topBanner"][0] {
  "first": sideButtons.first,
   "second": sideButtons.second
  }
}`;

export const getNavData = async () => {
  const apiUrl = `https://${PROJECT_ID}.api.sanity.io/v1/data/query/${DATASET}?query=${encodeURIComponent(
    navQuery
  )}`;
  const response = await fetch(apiUrl);

  const data = await response.json().then((res: any) => res?.result);
  if (!data) return undefined;
  return data;
};
