import client from "./client";

interface APIGetSlotsResponse {
  data: {
    code: number;
    message: string;
    success: boolean;
    slots: APIGetSlotsResponseSlots;
  };
}

interface APIGetSlotsResponseSlots {
  [mmSlashddSlashYYYY: string]: APIGetSlotsResponseSlot[];
}

export interface APIGetSlotsResponseSlot {
  duration: number;
  appointmentDateTime: string;
  score: number;
  trtId: number;
  distance: number;
  jobId: number;
  startAppointmentTime: string;
  appointmentEndDateTime: string;
  unitId: number;
  resourceId: number;
}

export default async function getSlots(
  token: string,
  vin: string,
  visitData: unknown
): Promise<APIGetSlotsResponseSlots> {
  try {
    const res = await client({
      method: "POST",
      url: "https://ownership.tesla.com/mobile-app/service/locations/center/slots",
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        deviceLanguage: "en",
        deviceCountry: "US",
        ttpLocale: "en_US",
        vin,
      },
      data: visitData,
    });

    const data = res.data as APIGetSlotsResponse;

    return data.data.slots;
  } catch (e) {
    console.error("Error checking for slots: ", e);
  }

  return {};
}
