## Tesla Service Appointment Checker

Checks for and auto-reschedules Tesla Service Center Appointments.

Super janky at the moment-- but it works!
Currently, you'll need an iOS device with a ssl-decrypting reverse proxy (Charles, mitmproxy, etc.) to use this.

## Installation and setup

- Install Node.js and clone the repo. 
- `yarn` or `npm i` to install the required packages
- Rename the `data-templates` folder to just `data`
- Update the `config.json` file as needed-- keep dates in the mm/dd/yyyy format
- Set the contents of `tokens.json` file to a full Tesla grant response - get one by going [here](https://replit.com/@iamtheyammer/TeslaAuthorizer#index.js), clicking Run at the top right and following the instructions. Paste the JSON into the tokens file.
- To get the contents of the `visitData.json` file,
  - Schedule a Service Center appointment
  - In the Tesla app, from the home screen, go to Service -> Upcoming Appointment -> Manage Appointment
  - Connect your Reverse Proxy
  - Click Reschedule
  - Take the body of the request to `https://ownership.tesla.com/mobile-app/service/locations/center/slots` and paste it into the `visitData.json` file.

## Running

`yarn start` and wait for an appointment confirmation email in your inbox!

(it'll only run for 8 hours at a time as that's how long tesla's tokens last and the bot doesn't support refreshing)
