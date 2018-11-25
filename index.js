// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {google} = require('googleapis');

const sheets = google.sheets('v4');
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

const serviceAccount = {/*service account credentials*/};

const client = new google.auth.JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.file']
})

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));


  function boothingShift(agent) {
    let name = agent.parameters.name;
  }

  function boothingInstruc(agent) {


    return new Promise((resolve, reject) => {
      client.authorize((err, tokens) => {
        let sheets = google.sheets('v4');

        sheets.spreadsheets.values.get({
          auth: client,
          spreadsheetId: '1krH4BhKL0Z4qngiV5Bn3YjaQQ4iUvNRjxkvo2uQuWrY',
          range: 'Sheet1!J4:J4',
          majorDimension: 'COLUMNS',
          dateTimeRenderOption: 'SERIAL_NUMBER',
          valueRenderOption: 'FORMATTED_VALUE'
        }, (err, response) => err ? reject(err) : resolve(response));
        // agent.add(JSON.stringify(response));
      });
    }).then(() => {
      agent.add(JSON.stringify(response));
    });
  }


  let intentMap = new Map();
  intentMap.set('Boothing time', boothingShift);
  intentMap.set('Boothing Instruction', boothingInstruc);
  agent.handleRequest(intentMap);
});
