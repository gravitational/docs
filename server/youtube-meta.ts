/*
 * Gets YouTube video metadate given video ID.
 */

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const REQUEST_PATH = "videos";
const YOUTUBE_URL = "https://www.youtube.com/watch";
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3";

const addZero = (num: number) => String(num).padStart(2, `0`);

const changeFormatDuration = (duration: string) => {
  const reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
  const matches = reptms.exec(duration);
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  if (matches && matches[1]) hours = Number(matches[1]);
  if (matches && matches[2]) minutes = Number(matches[2]);
  if (matches && matches[3]) seconds = Number(matches[3]);
  const hourDuration = hours !== 0 ? `${hours}:` : "";
  return `${hourDuration}${addZero(minutes)}:${addZero(seconds)}`;
};

export interface Meta {
  href: string;
}

export interface FullMeta extends Meta {
  title: string;
  duration: string;
  thumbnail: string;
}

interface RawContentDetails {
  duration: string;
}

interface RawThumnailsVariant {
  url: string;
  width: number;
  height: number;
}

interface RawThumbnailsSize {
  default: RawThumnailsVariant;
  high: RawThumnailsVariant;
  maxres: RawThumnailsVariant;
  medium: RawThumnailsVariant;
  standart: RawThumnailsVariant;
}

interface RawSnippet {
  thumbnails: RawThumbnailsSize;
  title: string;
}

interface RawItem {
  contentDetails: RawContentDetails;
  snippet: RawSnippet;
}

interface RawVideoMeta {
  items: RawItem[];
}

const cache: Record<string, Meta | FullMeta> = {};

export async function fetchVideoMeta(id: string): Promise<Meta | FullMeta> {
  if (id in cache) {
    return cache[id];
  }

  let data: Meta | FullMeta = {
    href: `${YOUTUBE_URL}?v=${id}`,
  };

  if (YOUTUBE_API_KEY) {
    try {
      const response = await fetch(
        `${YOUTUBE_API_URL}/${REQUEST_PATH}?part=snippet&part=contentDetails&id=${id}&key=${YOUTUBE_API_KEY}`
      );

      const rawData: unknown = await response.json();
      const rawDataItem = (rawData as RawVideoMeta).items[0];

      data = {
        href: data.href,
        title: rawDataItem.snippet.title,
        thumbnail: rawDataItem.snippet.thumbnails.default.url,
        duration: changeFormatDuration(rawDataItem.contentDetails.duration),
      };
    } catch (e) {
      console.error(e);

      if (process.env.NODE_ENV === "production") {
        throw new Error("Can't get YouTube Video meta");
      }
    }
  } else {
    data = {
      href: "#",
      title: "This is a fake video link, YouTube API key is not available",
      thumbnail: "/docs/placeholder-videobar.jpg",
      duration: "03:44",
    };
  }

  cache[id] = data;

  return data;
}
