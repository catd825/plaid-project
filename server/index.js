const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const keys = require('./config/keys')

require('./models/Account')

const db = require("./config/keys").mongoURI;
mongoose.connect(db, () => console.log("database connected!"));

const {receivePublicToken, getTransactions, createLinkToken} = require("./routes/plaidRoutes")

const app = express();
app.use(bodyParser.json());

// Get the public token and exchange it for an access token
app.post('/create_link_token', createLinkToken);
// Get the public token and exchange it for an access token
app.post('/get_link_token', receivePublicToken);
// Get Transactions
app.get("http://localhost:5000/transactions", getTransactions);


const PORT = 5000;

app.listen(PORT, () => console.log(`listening on port ${PORT}!`));