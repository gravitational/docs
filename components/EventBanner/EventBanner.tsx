import { getParsedDate } from "utils/date";
import CalendarTrans from "./assets/calendar-trans.svg?react";
import ArrowRight from "./assets/arrow-right.svg?react";
import MapPin from "./assets/map-pin.svg?react";
import Link from "next/link";
import styles from "./EventBanner.module.css";

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
  selectedEvent: EventProps;
}

const getComingEvent = (events: EventProps[]) => {
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
  events: EventProps[];
}> = ({ events }) => {
  const selectedEvent = getComingEvent(events);
  return selectedEvent ? (
    <Link className={styles.banner} href={selectedEvent.link}>
      <div className={styles.mainText}>{selectedEvent.title}</div>
      <div className={styles.container}>
        <div className={styles.styledBox}>
          <div className={styles.icon}>
            <CalendarTrans />
          </div>
          <div className={styles.styledText}>
            {getParsedDate(new Date(selectedEvent.start), "MMM d")}
            {selectedEvent.end != null &&
              "-" + getParsedDate(new Date(selectedEvent.end), "d")}
          </div>
        </div>
        <div className={styles.styledBox}>
          <div className={styles.icon}>
            <MapPin />
          </div>
          <div className={styles.styledText}>{selectedEvent.location}</div>
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
