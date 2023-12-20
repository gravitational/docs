import { writeFileSync } from "fs";
import { fetchEventsFromSanity } from "./sanity";

export type GenerateEventProps = {
  file: string; // path to file
};

export const generateEvent = async ({ file }: GenerateEventProps) => {
  const eventData = await fetchEventsFromSanity();
  try {
    writeFileSync(file, JSON.stringify(eventData));
    console.log("");
    console.log("Writing event data to file:", file, "\n");
  } catch (error) {
    console.error("Error writing event data to file:", error);
  }
};
