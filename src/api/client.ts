import axios from "axios";

const client = axios.create({
  headers: {
    "x-tesla-user-agent": "TeslaApp/4.11.1/12ad93c62a/ios/15.6",
    "user-agent": "Tesla/1195 CFNetwork/1335.0.3 Darwin/21.6.0",
  },
  proxy: {
    host: "localhost",
    port: 8888,
  },
});

export default client;
