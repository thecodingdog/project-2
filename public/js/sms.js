// Twilio Credentials
var accountSid = 'AC60ace2e936b35e9ce2b351cf962ae9bc';
var authToken = '0074c3b9ab3598758b0204eb0429b288';

// require the Twilio module and create a REST client
var client = require('twilio')(accountSid, authToken);

client.messages.create({
    to: "+6590227377",
    from: "+12602757491",
    body: "This is the ship that made the Kessel Run in fourteen parsecs?",
}, function(err, message) {
  if (err) console.log(err)
    console.log('sms-success');
});
