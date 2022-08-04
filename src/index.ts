import getSlots from "./api/slots";
import { readFile } from "fs/promises";
import bookSlot from "./api/book_slot";

export interface ConfigFile {
  vin: string;
  dates: string[];
  auto_schedule: boolean;
  contact: {
    emailAddress: string;
    phoneNumber: string;
  };
  check_interval_seconds: number;
}

interface TokenFile {
  access_token: string;
  refresh_token: string;
  id_token: string;
  expires_in: number;
  state: string;
  token_type: string;
}

export interface VisitDataFile {
  serviceVisitId: string;
  latitude: string;
  longitude: string;
  narratives: { [symptomKey: string]: string };
  activities: {
    activityId: number;
    symptomKey: string;
    narrative: string;
    activityType: string;
  }[];
  isRescheduleOnly: boolean;
}

async function setup() {
  const configFile = JSON.parse(
    await readFile("data/config.json", "utf-8")
  ) as ConfigFile;
  const tokenFile = JSON.parse(
    await readFile("data/tokens.json", "utf-8")
  ) as TokenFile;
  const visitData = JSON.parse(
    await readFile("data/visitData.json", "utf-8")
  ) as VisitDataFile;

  run(configFile, tokenFile, visitData);
  setInterval(
    () => run(configFile, tokenFile, visitData),
    configFile.check_interval_seconds * 1000
  );
}

async function run(
  configFile: ConfigFile,
  tokenFile: TokenFile,
  visitData: VisitDataFile
) {
  console.log(`${Date.now()}: checking for slots...`);
  const slots = await getSlots(
    tokenFile.access_token,
    configFile.vin,
    visitData
  );

  let failCount = 0;
  for (const date of configFile.dates) {
    if (slots[date]) {
      console.log(`available slot(s) on ${date}!`);
      if (configFile.auto_schedule && failCount < 4) {
        for (const slot of slots[date]) {
          console.log("attempting to book slot...");
          const bookResp = await bookSlot(
            tokenFile.access_token,
            configFile,
            slot,
            visitData
          );
          if (bookResp.success) {
            console.log("Booked slot! Check your email for more info.");
            process.exit(0);
          } else {
            console.log(
              "Error auto-booking. Trying to book the next slot. Try booking the slot yourself?"
            );
            failCount++;
            process.exit(1);
          }
        }
      }
    }
  }

  console.log(
    `No matching slots found, will try again in ${configFile.check_interval_seconds} seconds...`
  );
}

setup();
