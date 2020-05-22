
# Nightscout SMS Bot

A good use case for this bot is, for someone without an internet connected device that still wants to follow or get data from another users Nightscout website.

# Instructions
 1. Create a free Twilio account (https://www.twilio.com/), follow instructions on the site to setup your account, get a phone number and copy your Account SID, Auth Token, and Phone number as you’ll need it for the next step.
    
   
 2.  **If you have a Heroku account you can skip this step.** 
     Create a Heroku account. 
     Enter your account details. "Role" and "Primary development language" can be anything, but “Hobbyist” and “Node.js” are the most appropriate choices. 
     Verify your account via the link in the verification email, and set your password.
     
 3. Click on the Deploy to Heroku button below, this will take you to Heroku to Create a New App page. 
Choose an App name, this can be anything you like. For example `my_nightscout_sms_bot` 
Under Config Vars fill in all required information. 
webhookUrl is the current app that you are setting up now, so the full value will be something like: `https://my_nightscout_sms_bot.herokuapp.com/texteverything/message`. 
Copy this link as you’ll need it for the next step.   
Click Deploy app

 4. Go back to Twilio and open the phone number configuration page in the Twilio Console (https://www.twilio.com/console/phone-numbers/incoming) select the phone number you are using.  
Change the "Messaging > A message comes in" webhook to point to _YOUR_ app URL that you created in the previous step (For Example: `https://my_nightscout_sms_bot.herokuapp.com/texteverything/message`)
 5. Thats it, you are done, now send a text message to your Twilio phone number from one of the allowed phone numbers with the text `bg` and the bot will send you back the latest reading available in Nightscout.
 

 Note: If you want to be able to use this bot with a few phone numbers and you are using a free Twilio account you will have to verify each number with Twilio, and add that to the config vars in Heroku.
 
To verify another number in Twilio, go to https://www.twilio.com/console/phone-numbers/verified And add another number.

To add another allowed number to use this bot, go to your Heroku dashboard click on your app > Settings > Reveal Config Vars >  click on the edit button next to allowedNumbers and add a space and the new number.  

 
 

# Thanks
This is largely based on the TextEverything project (See ORIG_README for details). 
I added a nightsout plugin, and refactored the code it should be easy deployable to heroku. 
It is using environment variables instead of config file.
