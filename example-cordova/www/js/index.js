/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready

document.addEventListener('deviceready', onDeviceReady, false);

const ENV = "SANDBOX"; // "SANDBOX" or "PRODUCTION"

const CF_CONFIG = {
    SANDBOX: {
        baseUrl: "https://sandbox.cashfree.com/pg",
        clientId: "TEST430329ae80e0f32e41a393d78b923034",
        clientSecret: "TESTaf195616268bd6202eeb3bf8dc458956e7192a85"
    },
    PRODUCTION: {
        baseUrl: "https://api.cashfree.com/pg",
        clientId: "",
        clientSecret: ""
    }
};

// Populated after createOrder(); used by all payment methods.
let currentSessionId = null;
let currentOrderId = null;

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

    const createOrderEl   = document.getElementById("onCreateOrder");
    const webElement      = document.getElementById("onWEB");
    const dropElement     = document.getElementById("onDrop");
    const upiElement      = document.getElementById("onUPI");
    const subscriptionEl  = document.getElementById("onSubscription");

    [createOrderEl, webElement, dropElement, upiElement, subscriptionEl].forEach(el => {
        el.addEventListener('touchstart', () => addButtonClass(el));
        el.addEventListener('touchend',   () => removeButtonClass(el));
    });

    createOrderEl.addEventListener("click",  () => createOrder());
    webElement.addEventListener("click",     () => initiateWebPayment());
    dropElement.addEventListener("click",    () => initiateDropPayment());
    upiElement.addEventListener("click",     () => initiateUPIPayment());
    subscriptionEl.addEventListener("click", () => initiateSubscriptionPayment());

    CFPaymentGateway.setCallback({
        onVerify: function (result) {
            console.log("Verify:", result);
            document.getElementById('response_text').innerHTML =
                `{ <br> orderID: ${result.orderID} <br> }`;
        },
        onError: function (error) {
            console.log("Error:", error);
            document.getElementById('response_text').innerHTML = `{ <br>
                orderID: ${error.orderID} <br>
                status: ${error.status} <br>
                code: ${error.code} <br>
                type: ${error.type} <br>
                message: ${error.message} <br>
            }`;
        }
    });
}

function createOrder() {
    const btn = document.getElementById("onCreateOrder");
    btn.disabled = true;
    btn.innerText = "Creating...";
    document.getElementById('response_text').innerText = "Creating order...";

    const cfg = CF_CONFIG[ENV];
    const orderId = "cordova_" + Date.now();
    const body = {
        order_amount: 1.00,
        order_currency: "INR",
        order_id: orderId,
        customer_details: {
            customer_id: "devstudio_user",
            customer_phone: "9876543210"
        },
        order_meta: {
            return_url: cfg.baseUrl.replace("/pg", "") + "/devstudio/preview/pg/web/checkout?order_id={order_id}"
        }
    };

    cordova.plugin.http.setDataSerializer("json");
    cordova.plugin.http.post(
        cfg.baseUrl + "/orders",
        body,
        {
            "x-client-id": cfg.clientId,
            "x-client-secret": cfg.clientSecret,
            "x-api-version": "2025-01-01",
            "Accept": "application/json"
        },
        function (response) {
            try {
                const data = JSON.parse(response.data);
                if (!data.payment_session_id) {
                    throw new Error(data.message || JSON.stringify(data));
                }
                currentSessionId = data.payment_session_id;
                currentOrderId   = data.order_id;

                document.getElementById("order_info_text").innerHTML =
                    `<b>order_id:</b> ${currentOrderId}<br><b>session_id:</b> ${currentSessionId}`;
                document.getElementById("order_info").classList.remove("hidden");
                document.getElementById('response_text').innerText = "Order created. Tap a payment button.";
                console.log("Order created:", currentOrderId, currentSessionId);
            } catch (e) {
                document.getElementById('response_text').innerText = "Parse error: " + e.message;
                console.error("createOrder parse error:", e);
            }
            btn.disabled = false;
            btn.innerText = "Create Order";
        },
        function (error) {
            document.getElementById('response_text').innerText = "Create order failed: " + error.error;
            console.error("createOrder error:", error);
            btn.disabled = false;
            btn.innerText = "Create Order";
        }
    );
}

function requireOrder() {
    if (!currentSessionId || !currentOrderId) {
        document.getElementById('response_text').innerText = "Tap 'Create Order' first.";
        return false;
    }
    return true;
}

function initiateDropPayment() {
    if (!requireOrder()) return;
    document.getElementById('response_text').innerText = "Response will Show Here";
    CFPaymentGateway.doDropPayment({
        "components": ["CARD", "UPI", "NB", "WALLET", "PAY_LATER"],
        "theme": {
            "navigationBarBackgroundColor": "#E64A19",
            "navigationBarTextColor": "#FFFFFF",
            "buttonBackgroundColor": "#FFC107",
            "buttonTextColor": "#FFFFFF",
            "primaryTextColor": "#212121",
            "secondaryTextColor": "#757575"
        },
        "session": {
            "payment_session_id": currentSessionId,
            "orderID": currentOrderId,
            "environment": ENV
        }
    });
}

function initiateUPIPayment() {
    if (!requireOrder()) return;
    document.getElementById('response_text').innerText = "Response will Show Here";
    CFPaymentGateway.doUPIPayment({
        "theme": {
            "navigationBarBackgroundColor": "#E64A19",
            "navigationBarTextColor": "#FFFFFF",
            "buttonBackgroundColor": "#FFC107",
            "buttonTextColor": "#FFFFFF",
            "primaryTextColor": "#212121",
            "secondaryTextColor": "#757575"
        },
        "session": {
            "payment_session_id": currentSessionId,
            "orderID": currentOrderId,
            "environment": ENV
        }
    });
}

function initiateWebPayment() {
    if (!requireOrder()) return;
    document.getElementById('response_text').innerText = "Response will Show Here";
    CFPaymentGateway.doWebCheckoutPayment({
        "theme": {
            "navigationBarBackgroundColor": "#E64A19",
            "navigationBarTextColor": "#FFFFFF"
        },
        "session": {
            "payment_session_id": currentSessionId,
            "orderID": currentOrderId,
            "environment": ENV
        }
    });
}

function initiateSubscriptionPayment() {
    if (!requireOrder()) return;
    document.getElementById('response_text').innerText = "Response will Show Here";
    var subSession = {
        "session": {
            "subscription_session_id": currentSessionId,
            "subscription_id": currentOrderId,
            "environment": ENV
        }
    };
    console.log("Subscription Session:", JSON.stringify(subSession));
    CFPaymentGateway.doSubscriptionPayment(subSession);
}

function addButtonClass(element) {
    element.classList.add('button-active');
}

function removeButtonClass(element) {
    element.classList.remove('button-active');
}
