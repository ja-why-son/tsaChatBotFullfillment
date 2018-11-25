// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {google} = require('googleapis');

const sheets = google.sheets('v4');
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

const serviceAccount = {"type": "service_account",
                        "project_id": "hohoho-a593b",
                        "private_key_id": "a97c45fa886fe0b3d4a178fb98098ed2d7f62d9e",
                        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCV8mUgLEGckI35\n3yEXUaPhWrS0gSVa+pyNtrycWEUCeXkBf5lMXYWx4vsL3o6WjM2N2+fzHVIp2Saj\nhSyhQxIcOzNgMsf77rIBcL/33uMNdU2nKihTARaCIQvqB3O8oxeJYJ+hOikXC+89\n02Xz9hEIUIZQlPd//p/O8vFWQV4FLtYbFCNO5ffXMJC7ebX1Ljhd1j1yuCfA0E4W\nYcgZnobAZLCw3LVKbVbLIzTFl5KlDlrLWsOuPphLTtw7npa45k1q+vTezuvthWEU\n7fmcw2WP+zEJQu3hhbyh9XdWPOH29bXxvqeFeem9NKrcDHyM80cJk4DO6+obWWsZ\nZWEQOP6VAgMBAAECggEABONGlGkAGuxQkt1JCChDOTSkByERYijtxhk3hoZcE+ur\n9ZzYSh4St+ZuiSFpykXwHcuWAOp33XrBU/tvcn94s8HiqvEABg07is96YOHIZFpq\nbxekaKkOHkZmGIYoqcGZO7Z4gNPTN6sBOYwBp67h0qcPuC9UiAmse1CXbFirvQVD\nUsyJYd8uAjGurNsl3VvjbOebDAtvjLzOlg92W0d9veN9zvUMhd4WSN4c8IgATp0h\nAT1/X7HCEbxdo15LvEHTutQeSqaD6O05cMVUZlItiVSdtn7FiwM3wCRSntIc/cAW\nFuEbKcpcaeEPNQl0fqudcaJADvJKJOY1dP4dFvVZGwKBgQDRcl/5aeGn58Y3R3x6\nH/jrXhlEcaSzvADotxRmckFKgt82uQ60vYfvwsX+bizSZ57dHkxAYMhJpSSSQJyz\nQpKbVKkQZuwZTvIaGw6xh1nns++aaEs8+bRS5rr3+AHHdgCoPOF8xgtltHNQ7/MW\nkm6pzF/wA4yxQB4D+HITkXC1+wKBgQC3RnH4TnmJHGDENUDv5MSox7lub1MiILyL\nGYeL6fxfGi21+YX/JXd8LTyzW7niYPMmTBZWGjey2r5uGy22DQ7OFegc9iRBqfq1\nmEWAwj0J3zDKnHOhThzK6LhvV1Yf4GtP9Foo+YMUJBeuTCBPFl26AVVY+fgqoixM\nDuUg6JpIrwKBgE1px91o7DXiLdo6uuBsttVP52jr1CN2hqN9H7Yp3sYKjzQrvCrD\nrt3IkOPUlw6BrC8wRqC45O6LcnP4G7MKFSQCa6abVAKaslNB0vF9BJbmY9YfXEfC\nR4soqsyCRy4RCHcmYXV7wbSquMCen6ulHe/2kTMmLLdK6o0vJALli9JHAoGBAIEl\nVcg4XDH+2j1InWKuHNomKwej0Lv6v4FxUu+HyTumsdFKbF7XovPQ2LY2i6z2zkAN\nW6v+u4L/2zKxWiuv1d/o1fAajn/q7GysSUWrGeHr8XDEgEKJTYa6KMTkkR7TQCtO\nL34yHGjD6h/7KsUwKImayO5y7qn0LyzFTjY7UgSnAoGASIcJkJw8ZQjJDUmO1B7Q\n/gBT6wIUshIkkI3OHYudJQzZ4WCu6OqEMvLOvKXGl0DiFcZLdGwP+2qJmS1/x7D9\nSwTrYnPFsKN068pEGOaxSF2E83gkXS+GV1AKogs80PIas9dKAtUZvdI+n2vWT5SF\nsojHooG4wp5wHcdfbJ5zPH0=\n-----END PRIVATE KEY-----\n",
                        "client_email": "tsa-boothing-schedule@hohoho-a593b.iam.gserviceaccount.com",
                        "client_id": "116192376622415300205",
                        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                        "token_uri": "https://oauth2.googleapis.com/token",
                        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/tsa-boothing-schedule%40hohoho-a593b.iam.gserviceaccount.com"};

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
