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

const SESSION_ID = 'sub_session_f-e0jnzQa_qQtkFtPZmWmxj1We1Tu5f76DImA4ySE5CklsjjJVTiGbyTGxGM-ZKLUJV8-ft2SBYRmws180vI-nivXWq56qJhfY75AIjY823dgn1bLGUADSgZ1yqN_6spayment' // payment_session_id
const ORDER_ID = 'devstudio_subs_7358099936054719343' // order_id

const ENV = "SANDBOX" // "SANDBOX" or "PRODUCTION"

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    let webElement = document.getElementById("onWEB");
    let dropElement = document.getElementById("onDrop");
    let upiElement = document.getElementById("onUPI");
    webElement.addEventListener('touchstart', (e) => addButtonClass(webElement));
    webElement.addEventListener('touchend', (e) => removeButtonClass(webElement));
    dropElement.addEventListener('touchstart', (e) => addButtonClass(dropElement));
    dropElement.addEventListener('touchend', (e) => removeButtonClass(dropElement));
    upiElement.addEventListener('touchstart', (e) => addButtonClass(upiElement));
    upiElement.addEventListener('touchend', (e) => removeButtonClass(upiElement));
    webElement.addEventListener("click", (e) => initiateWebPayment());
    dropElement.addEventListener("click", (e) => initiateDropPayment());
    upiElement.addEventListener("click", (e) => initiateUPIPayment());
    
    let subscriptionElement = document.getElementById("onSubscription");
    subscriptionElement.addEventListener('touchstart', (e) => addButtonClass(subscriptionElement));
    subscriptionElement.addEventListener('touchend', (e) => removeButtonClass(subscriptionElement));
    subscriptionElement.addEventListener("click", (e) => initiateSubscriptionPayment());

    const callbacks = {
        onVerify: function (result) {
            console.log("This is in the Application Verify: " + JSON.parse(JSON.stringify(result)));
            document.getElementById('response_text').innerHTML = `{ <br>
                orderID: ${result.orderID} <br>
            }`
        },
        onError: function (error){
            console.log("This is in the Application Error: " + JSON.parse(JSON.stringify(error)));
            document.getElementById('response_text').innerHTML = `{ <br>
                orderID: ${error.orderID} <br>
                status: ${error.status} <br>
                code: ${error.code} <br>
                type: ${error.type} <br>
                message: ${error.message} <br>
            }`
        }
    }
    CFPaymentGateway.setCallback(callbacks)
}

function initiateDropPayment() {
    document.getElementById('response_text').innerText = "Response will Show Here"
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
            "payment_session_id": SESSION_ID,
            "orderID": ORDER_ID,
            "environment": ENV
        }
    })
}

function initiateUPIPayment() {
    document.getElementById('response_text').innerText = "Response will Show Here"
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
            "payment_session_id": SESSION_ID,
            "orderID": ORDER_ID,
            "environment": ENV
        }
    })
}

function initiateWebPayment() {
    document.getElementById('response_text').innerText = "Response will Show Here"
    CFPaymentGateway.doWebCheckoutPayment({
        "theme": {
            "navigationBarBackgroundColor": "#E64A19",
            "navigationBarTextColor": "#FFFFFF"
        },
        "session": {
            "payment_session_id": SESSION_ID,
            "orderID": ORDER_ID,
            "environment": ENV
        }
    })
}

function initiateSubscriptionPayment() {
    document.getElementById('response_text').innerText = "Response will Show Here"
    var subSession = {
        "session": {
            "subscription_session_id": SESSION_ID,
            "subscription_id": ORDER_ID,
            "environment": ENV
        }
    }
    console.log("Subscription Session:", JSON.stringify(subSession))
    CFPaymentGateway.doSubscriptionPayment(subSession)
}

function addButtonClass(element) {
    element.classList.add('button-active');
}

function removeButtonClass(element) {
    element.classList.remove('button-active');
}
