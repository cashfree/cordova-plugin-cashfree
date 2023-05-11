## Supported platforms

- Android
- iOS


## Installation:
Install the plugin

```bash

cd your-project-folder

cordova plugin add cordova-plugin-cashfree-pg

```


## Step 1: Generate Session ID (From Backend)


You will need to generate a sessionID from your backend and pass it to app while initiating payments.

API Doc Link - https://docs.cashfree.com/reference/createorder

Note: This API is called only from your <b><u>backend</u></b> as it uses **secretKey**. Thus this API should **never be called from App**.


## Step 2: Create a Payment Object

### Step 2.1: Create a Drop Payment Object
```js
const dropPaymentObject = {
    "components": ["CARD", "UPI", "NB", "WALLET", "PAY_LATER"], //optional
    "theme": { //optional
        "navigationBarBackgroundColor": "#E64A19",
        "navigationBarTextColor": "#FFFFFF",
        "buttonBackgroundColor": "#FFC107",
        "buttonTextColor": "#FFFFFF",
        "primaryTextColor": "#212121",
        "secondaryTextColor": "#757575"
    },
    "session":  { //required
        "payment_session_id": "order_session_id",
        "orderID": "order_id",
        "environment": "SANDBOX" // "SANDBOX" or "PRODUCTION"
    }
}
```

### Step 2.2: Create a Web Checkout Payment Object
```js
const webPaymentObject = {
    "theme": { //optional
        "navigationBarBackgroundColor": "#E64A19",
        "navigationBarTextColor": "#FFFFFF"
    },
    "session":  { //required
        "payment_session_id": "order_session_id",
        "orderID": "order_id",
        "environment": "SANDBOX" // "SANDBOX" or "PRODUCTION"
    }
}
```


## Step 3: SetCallback
Set the callback **on the creation** of your payment page.
```js

const callbacks = {
    onVerify: function (result) {
        console.log("This is in the Application Verify: " + result);
        const orderId = result.orderID;
    },
    onError: function (error){
        console.log("This is in the Application Error: " + error);
        const orderID = error.orderID
        const status = error.status
        const code = error.code
        const type = error.type
        const message = error.message
    }
}
CFPaymentGateway.setCallback(callbacks) // onLoad of the Page
```

## Step 4: Initiate Payment

### Step 4.1: Initiate Drop Payment
```js
CFPaymentGateway.doDropPayment(dropPaymentObject)
```

### Step 4.2: Initiate Web Checkout Payment
```js
CFPaymentGateway.doWebCheckoutPayment(webPaymentObject)
```
