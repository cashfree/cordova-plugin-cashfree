# Cashfree Cordova SDK Sample

![GitHub](https://img.shields.io/github/license/cashfree/cordova-plugin-cashfree) ![Discord](https://img.shields.io/discord/931125665669972018?label=discord) ![GitHub last commit (branch)](https://img.shields.io/github/last-commit/cashfree/cordova-plugin-cashfree/master) ![GitHub release (with filter)](https://img.shields.io/github/v/release/cashfree/cordova-plugin-cashfree?label=latest) ![GitHub forks](https://img.shields.io/github/forks/cashfree/cordova-plugin-cashfree) ![GitHub Repo stars](https://img.shields.io/github/stars/cashfree/cordova-plugin-cashfree)


![Sample Banner Image](https://maven.cashfree.com/images/github-header-image-cordova.png)

## **Description** 

Sample integration project for Cashfree Payment Gateway's Cordova SDK, facilitating seamless and secure payment processing within your Cordova application.

## Supported platforms

- Android
- Cordova


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

### Step 2.2: Create a UPI Payment Object
```js
const upiPaymentObject = {
    "theme": { //optional
        "navigationBarBackgroundColor": "#E64A19", //ios
        "navigationBarTextColor": "#FFFFFF", //ios
        "buttonBackgroundColor": "#FFC107", //ios
        "buttonTextColor": "#FFFFFF", //ios
        "primaryTextColor": "#212121", 
        "secondaryTextColor": "#757575", //ios
        "backgroundColor": "#FFFFFF"
    },
    "session":  { //required
        "payment_session_id": "order_session_id",
        "orderID": "order_id",
        "environment": "SANDBOX" // "SANDBOX" or "PRODUCTION"
    }
}
```

### Step 2.3: Create a Web Checkout Payment Object
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
### Step 4.2: Initiate Web Checkout Payment
```js
CFPaymentGateway.doUPIPayment(upiPaymentObject)
```
## Getting help

If you have questions, concerns, bug reports, etc, you can reach out to us using one of the following 

1. File an issue in this repository's Issue Tracker.
2. Send a message in our discord channel. Join our [discord server](https://discord.gg/znT6X45qDS) to get connected instantly.
3. Send an email to care@cashfree.com

## Getting involved

For general instructions on _how_ to contribute please refer to [CONTRIBUTING](CONTRIBUTING.md).


----

## Open source licensing and other misc info
1. [LICENSE](https://github.com/cashfree/cordova-plugin-cashfree/blob/master/LICENSE.md)
2. [CODE OF CONDUCT](https://github.com/cashfree/cordova-plugin-cashfree/blob/master/CODE_OF_CONDUCT.md)
