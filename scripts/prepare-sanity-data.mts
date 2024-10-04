import "dotenv/config";

import { resolve, join } from "path";
import { generateEvent, generateNavigation } from "../server/sanity-settings";

const DATA_FOLDER = resolve(__dirname, "../data");

generateEvent({ file: join(DATA_FOLDER, "events.json") });
generateNavigation({ file: join(DATA_FOLDER, "navbar.json") });
