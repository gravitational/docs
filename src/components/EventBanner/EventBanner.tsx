import { useEffect, useState } from "react";

import { getParsedDate } from "../../utils/date";

import CalendarTrans from "./assets/calendar-trans.svg";
import ArrowRight from "./assets/arrow-right.svg";
import MapPin from "./assets/map-pin.svg";
import VirtualIcon from "./assets/video-meeting.svg";
import styles from "./EventBanner.module.css";

export interface EventProps {
  end?: string | null;
  link?: string;
  location?: string | null;
  start?: string | null;
  title?: string | null;
  cta?: string;
  isVirtual?: boolean;
  bannerType?: "custom" | "event" | string;
  defaultContent?: {
    title: string;
    link: string;
    cta: string;
  };
  sideButtons?: {
    first?: {
      title: string;
      url: string;
    };
    second?: {
      title: string;
      url: string;
    };
  };
}

export interface Events {
  events: EventProps[];
}

export interface Event {
  selectedEvent: EventProps;
}

export const getComingEvent = (event?: EventProps) => {
  if (!event || !event?.title)
    return { ...event?.defaultContent, sideButtons: { ...event?.sideButtons } };
  const currentDate = new Date();
  const endDate = event.end ? new Date(event.end) : null;

  if (endDate && currentDate > endDate) {
    //Event end date has gone
    return { ...event?.defaultContent, sideButtons: { ...event?.sideButtons } };
  }
  return event; //No end date set or end date is in the future
};

export const EventBanner: React.FC<{
  initialEvent: EventProps;
}> = ({ initialEvent }) => {
  const [event, setEvent] = useState<EventProps>(initialEvent);
  /* There was an excessive amount of api requests coming in to fetch the event data
so this fetch is disable until we find and fix the issue or decide to completely drop this version of the revalidation
useEffect(() => {
    const fetchEvent = async () => {
      const tempEvent = await fetch("/api/getfeaturedevent/").then(
        (res) => res.status === 200 && res.json()
      );
      tempEvent && setEvent(tempEvent.data as EventProps);
    };
    fetchEvent();
  }, []);*/
  const { sideButtons } = event;
  return (
    <div className={styles.banner}>
      <a className={styles.linkWrapper} href={event.link}>
        <div className={styles.mainText}>{event.title}</div>
        {(event.start || event.location) && (
          <div className={styles.container}>
            {event.start && (
              <div className={styles.styledBox}>
                <div className={styles.icon}>
                  <CalendarTrans />
                </div>
                <div className={styles.styledText}>
                  {getParsedDate(new Date(event.start), "MMM d")}
                  {event.end != null &&
                    "-" + getParsedDate(new Date(event.end), "d")}
                </div>
              </div>
            )}
            {event.bannerType !== "custom" &&
              (event?.location || event?.isVirtual) && (
                <div className={styles.styledBox}>
                  <div className={styles.icon}>
                    {event?.location === "Virtual" || event.isVirtual ? (
                      <VirtualIcon viewBox="0 0 16 16" />
                    ) : (
                      <MapPin />
                    )}
                  </div>
                  <div className={styles.styledtext}>
                    {event?.location || (event?.isVirtual && "Virtual")}
                  </div>
                </div>
              )}
          </div>
        )}
        <div className={styles.ctaWrapper}>
          <div className={styles.linkButton}>{event?.cta}</div>
          <div className={styles.icon}>
            <ArrowRight />
          </div>
        </div>
      </a>
      {sideButtons && (
        <div className={styles.sideButtonBox}>
          {sideButtons?.first && (
            <div className={styles.linkButton}>
              <a href={sideButtons.first?.url || ""}>
                {sideButtons.first?.title}
              </a>
              <div className={styles.icon}>
                <ArrowRight />
              </div>
            </div>
          )}
          {sideButtons?.second && (
            <div className={styles.linkButton}>
              <a href={sideButtons.second?.url || ""}>
                {sideButtons.second?.title}
              </a>
              <div className={styles.icon}>
                <ArrowRight />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
