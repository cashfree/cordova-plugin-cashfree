import { Component } from "@angular/core";
declare let Cashfree: any;
declare let cordova: any;

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  currency = "INR";
  amount = "";
  phoneNumber = "";

  checkoutWithCashfree() {
    cordova.plugin.http.setDataSerializer("json");

    const tokenAPI = "https://test.cashfree.com/api/v2/cftoken/order";
    const appId = "<YOUR_APP_ID_GOES_HERE>";
    const secret = "<YOUR_APP_SECRET_GOES_HERE>";

    const skdInput = {
      env: "TEST",
      order: {
        orderId: "Ord69611" + Date.now(),
        orderAmount: this.amount,
        orderCurrency: this.currency,
        customerName: "John Doe",
        customerPhone: this.phoneNumber,
        customerEmail: "developer@cashfree.com",
        notifyUrl: "https://cashfree.com/notify",
      },
      appId,
      cftoken: "",
    };

    const options = {
      method: "post",
      data: {
        orderId: skdInput.order.orderId,
        orderAmount: skdInput.order.orderAmount,
        orderCurrency: skdInput.order.orderCurrency,
      },
      headers: {
        "Content-Type": "application/json",
        "x-client-secret": secret,
        "x-client-id": appId,
      },
    };

    cordova.plugin.http.sendRequest(
      tokenAPI,
      options,
      function (response) {
        const token = JSON.parse(response.data).cftoken;
        skdInput.cftoken = token;
        Cashfree.checkout(skdInput).then(function (txResponse) {
          console.log(txResponse);
        });
      },
      function (response) {
        // prints 403
        console.log(response.status);
        // prints Permission denied
        console.log(response.error);
      }
    );
  }
}
