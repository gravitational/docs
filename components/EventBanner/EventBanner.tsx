import { getParsedDate } from "utils/date";
import CalendarTrans from "./assets/calendar-trans.svg?react";
import ArrowRight from "./assets/arrow-right.svg?react";
import MapPin from "./assets/map-pin.svg?react";
import Link from "next/link";
import styles from "./EventBanner.module.css";
import { useEffect, useState } from "react";

export interface EventProps {
  end?: string | null;
  link: string;
  location: string;
  start: string;
  title: string;
  featured?: boolean;
}

export interface Events {
  events: EventProps[];
}

export interface Event {
  event: EventProps;
}

export const getComingEvent = (events: EventProps[]) => {
  const currentDate = new Date();
  let selectedEvent = null;
  for (const event of events) {
    // If the event is not featured, skip it
    if (!event?.featured) {
      continue;
    }

    const startDate = new Date(event.start);
    const endDate = event.end ? new Date(event.end) : startDate;

    if (currentDate <= endDate) {
      selectedEvent = event;
      break;
    }
  }

  return selectedEvent;
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
        <div className={styles.styledBox}>
          <div className={styles.icon}>
            <CalendarTrans />
          </div>
          <div className={styles.styledText}>
            {getParsedDate(new Date(event.start), "MMM d")}
            {event.end != null && "-" + getParsedDate(new Date(event.end), "d")}
          </div>
        </div>
        <div className={styles.styledBox}>
          <div className={styles.icon}>
            <MapPin />
          </div>
          <div className={styles.styledText}>{event.location}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div className={styles.linkButton}>Register</div>
        <div className={styles.icon}>
          <ArrowRight />
        </div>
      </div>
    </Link>
  ) : null;
};
