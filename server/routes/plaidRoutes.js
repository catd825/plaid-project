const plaid = require('plaid')
const moment = require('moment')
const keys = require('../config/keys')


var PLAID_CLIENT_ID = keys.PLAID_CLIENT_ID;
var PLAID_SECRET = keys.PLAID_SECRET;
var PLAID_ENV = keys.PLAID_ENV;

var ACCESS_TOKEN = null;
var PUBLIC_TOKEN = null;
var ITEM_ID = null;


// Initialize the Plaid client
const client = new plaid.Client({
    clientID: keys.PLAID_CLIENT_ID,
    secret: keys.PLAID_SECRET,
    env: plaid.environments.sandbox
  });


const createLinkToken = async (req, res) => {
  console.log('req', req, 'res', res)
  const response = await client
  .createLinkToken({
    user: {
      client_user_id: '123-test-user-id',
    },
    client_name: 'Plaid Test App',
    products: ['auth', 'transactions'],
    country_codes: ['GB'],
    language: 'en',
    webhook: 'https://sample-web-hook.com',
    account_filters: {
      depository: {
        account_subtypes: ['checking', 'savings'],
      },
    },
  })
  .catch((err) => {
    // handle error
  });
const linkToken = response.link_token;
console.log("link token", linkToken)
}




const receivePublicToken = (req, res) => {
  // First, receive the public token and set it to a variable
  console.log('req', req, 'res', res)
  let PUBLIC_TOKEN = req.body.public_token;
  // Second, exchange the public token for an access token
  client.exchangePublicToken(PUBLIC_TOKEN, function(error, tokenResponse) {
    ACCESS_TOKEN = tokenResponse.access_token;
    ITEM_ID = tokenResponse.item_id;
    res.json({
      access_token: ACCESS_TOKEN,
      item_id: ITEM_ID
    });
    console.log("access token below");
    console.log("access token", ACCESS_TOKEN);
  });
};

const getTransactions = (req, res) => {
  // Pull transactions for the last 30 days
  let startDate = moment()
    .subtract(30, "days")
    .format("YYYY-MM-DD");
  let endDate = moment().format("YYYY-MM-DD");
  console.log("made it past variables");
  client.getTransactions(
    ACCESS_TOKEN,
    startDate,
    endDate,
    {
      count: 250,
      offset: 0
    },
    function(error, transactionsResponse) {
      res.json({ transactions: transactionsResponse });
      // TRANSACTIONS LOGGED BELOW! 
      // They will show up in the terminal that you are running nodemon in.
      console.log("trans", transactionsResponse);
    }
  );
};

console.log(receivePublicToken, getTransactions)

module.exports = {
  receivePublicToken,
  getTransactions,
  createLinkToken
};

