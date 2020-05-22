const twilio = require('twilio');
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const moment = require('moment');

// let config;
// try {
//   config = require('./config/config.json');
// } catch (ex) {
//   console.error('Failed to load config/config.json!');
//   console.error('Will try to load the config vars via process.env');
//   console.error('If you need help, check out the config.example.json file.');
//   process.exit(1);
// }

ensureRequiredENVVarsAreSet();

const plugins = require('./plugins/index.js');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/bg", function (request, response) {
    getBGData(function(result) {
    response.send( result);
  });
  return;
});

app.post(process.env.webhook_path /*config.twilio.webhook_path*/, function(request, response) {
  const twilioSignature = request.header('X-Twilio-Signature');
  const validTwilioRequest = twilio.validateRequest(
    //config.twilio.authToken,
    process.env.authToken,
    twilioSignature,
    //config.twilio.webhookUrl,
    process.env.webhookUrl,
    request.body
  );

  if (validTwilioRequest) {
    response.set('Content-Type', 'text/xml');

    // if (!config.twilio.allowedNumbers.includes(request.body.From)) {
    if (!process.env.allowedNumbers.includes(request.body.From)) {
      console.log(
        `Received command from disallowed number ${
          request.From
        }. Not responding.`
      );

      const twiml = new MessagingResponse();
      response.send(twiml.toString());
      return;
    }

    plugins.handle(request.body, response);
  } else {
    console.log('Received a potentially spoofed request - dropping silently.');
    response.sendStatus(403);
  }
});

app.listen(process.env.PORT || process.env.express_port /*config.express.port*/, function() {
  console.log(`TextEverything listening on port ${process.env.PORT || process.env.express_port /*config.express.port*/}.`);
});


function getBGData(callback){


  let nightscoutURL = process.env.nightscoutURL;

  https.get(nightscoutURL, (resp) => {
    let data = '';
  
    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });
  
    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      //console.log(JSON.parse(data)[0]);
      let parsedResponse = JSON.parse(data)[0];
      let bg = parsedResponse.sgv;
      let direction = parsedResponse.direction;
      let date = parsedResponse.date;
      let actualtime = new Date(date);
      let delta = Math.round(parsedResponse.delta);
      let displayDelta = Math.sign(delta)==1 ? "+" + delta : delta;
      let message =  "The last reading was "+bg+" ("+displayDelta+") and the direction is "+direction+". Reading time: "+ moment(actualtime, "YYYYMMDD").fromNow(); 
      callback(message);
    });
  
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
    return "";
  }
  
function ensureRequiredENVVarsAreSet(){
  // Ensure required ENV vars are set
  let requiredEnv = [
    'nightscoutURL', 'accountSid',
    'authToken', 'phoneNumber',
    'allowedNumbers', 'webhookUrl','webhook_path'
  ];
  let unsetEnv = requiredEnv.filter((env) => !(typeof process.env[env] !== 'undefined'));

  if (unsetEnv.length > 0) {
    throw new Error("Required ENV variables are not set: [" + unsetEnv.join(', ') + "]");
  }
}