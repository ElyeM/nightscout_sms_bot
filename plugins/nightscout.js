const MessagingResponse = require('twilio').twiml.MessagingResponse
const https = require('https');
const moment = require('moment');

const methods = {
    run: function(request, response) {
         // Create a new response object to send to Twilio.
        const twiml = new MessagingResponse()
        getBGData(function(result) {
            twiml.message(result)
            response.set('Content-Type', 'text/xml')
            response.send(twiml.toString())  
          });
        
    },

    meta: {
        aliases: ['bg', 'BG', 'Bg']
    }
}
module.exports = methods

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
      let parsedResponsePrevious = JSON.parse(data)[1];
      let bg = parsedResponse.sgv;
      let bgPrevious = parsedResponsePrevious.sgv
      let direction = parsedResponse.direction;
      let date = parsedResponse.date;
      let actualtime = new Date(date);
      let delta = Math.round(bg - bgPrevious);
      let displayDelta = Math.sign(delta)==1 ? "+" + delta : delta;
      let message =  "The last reading was "+bg+" ("+displayDelta+") and the direction is "+direction+". Reading time: "+ moment(actualtime, "YYYYMMDD").fromNow(); 
      callback(message);
    });
  
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
    return "";
}