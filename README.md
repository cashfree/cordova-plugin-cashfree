# DEPRECATED

Please check https://www.npmjs.com/package/cashfree_pg_sdk_cordova for the Cashfree Cordova plugin. This plugin has been deprecated.

## Supported platforms

- Android
- iOS

You can check out the sample apps for

- [Ionic Angular](examples/ionicangularsampleblank).

## Installation:

Install the plugin

**Note**: This plugin has a dependency on [cordova-plugin-inappbrowser](https://github.com/apache/cordova-plugin-inappbrowser).

```bash
cd your-project-folder
cordova plugin add cordova-plugin-inappbrowser
cordova plugin add https://github.com/cashfree/cordova-plugin-cashfree
```

Add navigation to cashfree.com. Add this line in your `config.xml`

```xml
<allow-navigation href="*.cashfree.com" />
```

## Step 1: Generate Token (From Backend)

You will need to generate a token from your backend and pass it to app while initiating payments. For generating token you need to use our token generation API.

Please note that this API is called only from your <b><u>backend</u></b> as it uses **secretKey**. Thus this API should **never be called from App**.

### Request Description

For `production/live` usage set the form action to:
`https://api.cashfree.com/api/v2/cftoken/order`

For `test` usage set the form action to:
`https://test.cashfree.com/api/v2/cftoken/order`

You need to send `orderId`, `orderCurrency` and `orderAmount` as a JSON object to the API endpoint and in response a token will received. Please see the description of request below.

```bash
curl -XPOST -H 'Content-Type: application/json'
-H 'x-client-id: <YOUR_APP_ID>'
-H 'x-client-secret: <YOUR_SECRET_KEY>'
-d '{
  "orderId": "<ORDER_ID>",
  "orderAmount":<ORDER_AMOUNT>,
  "orderCurrency": "INR"
}' 'https://test.cashfree.com/api/v2/cftoken/order'
```

### Request Example

Replace **YOUR_APP_ID** and **YOUR_SECRET_KEY** with actual values.

```bash
curl -XPOST -H 'Content-Type: application/json' -H 'x-client-id: YOUR_APP_ID' -H 'x-client-secret: YOUR_SECRET_KEY' -d '{
  "orderId": "Order0001",
  "orderAmount":1,
  "orderCurrency":"INR"
}' 'https://test.cashfree.com/api/v2/cftoken/order'
```

### Response Example

```bash
{
  "status": "OK",
  "message": "Token generated",
  "cftoken": "v79JCN4MzUIJiOicGbhJCLiQ1VKJiOiAXe0Jye.s79BTM0AjNwUDN1EjOiAHelJCLiIlTJJiOik3YuVmcyV3QyVGZy9mIsEjOiQnb19WbBJXZkJ3biwiIxADMwIXZkJ3TiojIklkclRmcvJye.K3NKICVS5DcEzXm2VQUO_ZagtWMIKKXzYOqPZ4x0r2P_N3-PRu2mowm-8UXoyqAgsG"
}
```

The `cftoken` is the token that is used authenticate your payment request that will be covered in the next step.

## Usage code

#### Declare Cashfree variable

Declare Cashfree variable in your app/file

```
declare let Cashfree : any;
```

#### Create order object

```js
const skdInput = {
  env: "TEST", // PROD or TEST
  order: {
    orderId: "Order0001",
    orderAmount: 1,
    orderCurrency: "INR",
    customerName: "Jane Doe",
    customerPhone: "8014012322",
    customerEmail: "dev@cashfree.com",
    notifyUrl: "https://your.domain/notify",
  },
  appId: "<YOUR_APP_ID>",
  cftoken: "<your cftoken generated from backend>",
};
```

#### Initiate and handle payment response

```js
Cashfree.checkout(skdInput).then(
  function (txResponse) {
    console.log(txResponse);
  },
  function (err) {
    console.log(err);
  }
);
```
