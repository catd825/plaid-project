# plaid-project

```cd server``` and run ```npm install```
```cd client``` and run ```npm install```

You will need to create a free Plaid account to get keys.  Once you have the keys, you need to create the keys file:
```cd server``` 
```cd config```
```touch keys.js```
In the file, add the following:
```
module.exports = {
    PLAID_CLIENT_ID: 'ADD CLIENT KEY',
    PLAID_SECRET: 'ADD SANDBOX SECRET KEY'
};
```

To run both servers, run ```npm run dev```


When prompted, add the following test credentials:
```username: user_good```
```password: pass_good```
