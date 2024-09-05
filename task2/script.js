const twilio = require("twilio");
require("dotenv").config();
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

client.studio.v2
  .flows("FWc07e5ffb1b82752ec35e8ff919624691")
  .executions.create({
    to: "+918299572365",
    from: "+18157073168",
    parameters: {
      name: "Aman",
      interviewLink:
        "https://v.personaliz.ai/?id=9b697c1a&uid=fe141702f66c760d85ab&mode=test",
    },
  })
  .then((execution) => console.log(execution.sid));
