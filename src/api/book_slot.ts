import { APIGetSlotsResponseSlot } from "./slots";
import client from "./client";
import { ConfigFile, VisitDataFile } from "../index";
import { start } from "repl";

interface APIBookSlotResponse {
  code: number;
  message: string;
  success: boolean;
}

export default async function bookSlot(
  token: string,
  config: ConfigFile,
  slot: APIGetSlotsResponseSlot,
  visitData: VisitDataFile
): Promise<APIBookSlotResponse> {
  try {
    const startTime = slot.appointmentDateTime.slice(
      0,
      slot.appointmentDateTime.length - 1
    );
    const endTime = slot.appointmentEndDateTime.slice(
      0,
      slot.appointmentEndDateTime.length - 1
    );

    const res = await client({
      method: "PUT",
      url: `https://ownership.tesla.com/mobile-app/service/appointments/${visitData.serviceVisitId}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        deviceLanguage: "en",
        deviceCountry: "US",
        ttpLocale: "en_US",
        vin: config.vin,
      },
      data: {
        trtId: slot.trtId,
        narratives: visitData.narratives,
        activities: visitData.activities,
        contact: config.contact,
        countryCode: "US",
        appointmentStartDateTime: startTime,
        appointmentEndDateTime: endTime,
        additionalSlotData: {
          ...slot,
          isMobile: false,
          appointmentDateTime: startTime,
          appointmentEndDateTime: endTime,
        },
      },
    });

    return res.data as APIBookSlotResponse;
  } catch (e) {
    console.error("Error booking a slot: ", e);
  }

  return {
    code: -1,
    message: "NON-TESLA unknown error",
    success: false,
  };
}
