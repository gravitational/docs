import { getParsedDate } from "utils/date";
import CalendarTrans from "./assets/calendar-trans.svg?react";
import ArrowRight from "./assets/arrow-right.svg?react";
import MapPin from "./assets/map-pin.svg?react";
import VirtualIcon from "./assets/video-meeting.svg?react";
import Link from "next/link";
import styles from "./EventBanner.module.css";
import { useEffect, useState } from "react";

export interface EventProps {
  end?: string | null;
  link?: string;
  location?: string | null;
  start?: string | null;
  title?: string | null;
  cta?: string;
  isVirtual?: boolean;
  bannerType?: "custom" | "event" | string;
}

export interface Events {
  events: EventProps[];
}

export interface Event {
  event: EventProps;
}

export const getComingEvent = (event: EventProps) => {
  if (!event || !event?.title) return null;
  const currentDate = new Date().setHours(0, 0, 0, 0);
  const endDate = event.end ? new Date(event.end).setHours(0, 0, 0, 0) : null;

  if (endDate && currentDate > endDate) {
    //Event end date has gone
    return null;
  }
  return event; //No end date set or end date is in the future
};

export const EventBanner: React.FC<{
  initialEvent: EventProps;
}> = ({ initialEvent }) => {
  const [event, setEvent] = useState<EventProps>(initialEvent);
  useEffect(() => {
    const fetchEvent = async () => {
      const tempEvent = await fetch("/api/getfeaturedevent/").then(
        (res) => res.status === 200 && res.json()
      );
      tempEvent && setEvent(tempEvent.data as EventProps);
    };
    fetchEvent();
  }, []);
  return event ? (
    <Link className={styles.banner} href={event.link}>
      <div className={styles.mainText}>{event.title}</div>
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

        {event.bannerType === "custom" &&
          (event.location || event.isVirtual) && (
            <div className={styles.styledBox}>
              <div className={styles.icon}>
                {event.location === "virtual" || event.isVirtual ? (
                  <VirtualIcon viewBox="0 0 16 16" />
                ) : (
                  <MapPin />
                )}
              </div>
              <div className={styles.styledText}>
                {event.location || (event.isVirtual && "Virtual")}
              </div>
            </div>
          )}
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div className={styles.linkButton}>{event.cta || "Register"}</div>
        <div className={styles.icon}>
          <ArrowRight />
        </div>
      </div>
    </Link>
  ) : null;
};
