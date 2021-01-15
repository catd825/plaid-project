const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
const cors = require('cors');
const plaid = require('plaid');
const passport = require("passport");


require('./models/Account')

const users = require("./routes/api/users");

const db = require("./config/keys").mongoURI;
mongoose.connect(db, () => console.log("database connected!"));

const app = express();
app.use(cors())
//Not sure what this does
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/users", users);


const client = new plaid.Client({
    clientID: keys.PLAID_CLIENT_ID,
    secret: keys.PLAID_SECRET,
    env: plaid.environments.sandbox
  });


  app.post('/create_link_token', async (req, res) => {
      // console.log("request:", req.body,"response:", res)
    try{
    const response = await client.createLinkToken({
    user: {
      client_user_id: '123-test-user-id',
    },
    client_name: 'Plaid Test App',
    products: ['auth', 'transactions'],
    country_codes: ['US'],
    language: 'en',
    webhook: 'https://sample-web-hook.com',
    account_filters: {
      depository: {
        account_subtypes: ['checking', 'savings'],
      },
    },
  })
    return res.send({link_token: response.link_token}) 
} catch (err) {
    return res.send({err: err.message})
}

//   .catch((err) => {
//     console.log("REQUEST!", req,"RESPONSE!", response.link_token)
//     // handle error
//     console.log("ERR", err)
//   });

});



app.post('/get_link_token', async(req, res) => {
const response = await client.getLinkToken(linkToken).catch((err) => {
    if(!linkToken){
        return "no link token"
    }
  });
})

app.post('/get_access_token', async(req, res) => {
  console.log('trying to get access token')
  const {publicToken} = req.body
  // console.log("PUBLIC TOKEN", publicToken)
  const response = await client
    .exchangePublicToken(publicToken)
    .catch((err) => {
      if(!publicToken){
        return "no public token"
      }
    });
  // const accessToken = response.access_token;
  const itemId = response.item_id;
  return res.send({access_token: response.access_token}) 
})

app.post('/transactions', async(req, res) =>{
  console.log('trying to get transactions')
  const {accessToken} = req.body
  // console.log(req.body)
  const response = await client
  .getTransactions(accessToken, '2020-01-01', '2021-01-31', {
    count: 250,
    offset: 0,
  })
  .catch((err) => {
    if(!accessToken){
      return "no access token"
    }
  });
// console.log("backend response", response)
// const transactions = response.transactions;
return res.send({transactions: response.transactions}) 
})


const PORT = 5000;

app.listen(PORT, () => console.log(`listening on port ${PORT}!`));




// let userSchema = mongoose.Schema({
//     email: String,
//     password: String,
//     transactions: Array,
//     items: Array
// });

// let User = mongoose.model('User', userSchema);
