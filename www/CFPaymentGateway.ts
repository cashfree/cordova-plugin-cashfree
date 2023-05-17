const PLUGIN_NAME = "CFPaymentGateway";
function validateDropInput(cfDropPayment: any) {
    if (cfDropPayment) {
        if (cfDropPayment.session) {
            if (!cfDropPayment.session.payment_session_id) {
                return "payment_session_id object is missing in session object"
            }
            if (!cfDropPayment.session.orderID) {
                return "orderID object is missing in session object"
            }
            if (!cfDropPayment.session.environment) {
                return "environment object is missing in session object"
            }
            return null
        } else {
            return "session object is missing in cfDropPayment object"
        }
    } else {
        return "cfDropPayment object is missing"
    }
}
function validateWebInput(cfWebPayment: any) {
    if (cfWebPayment) {
        if (cfWebPayment.session) {
            if (!cfWebPayment.session.payment_session_id) {
                return "payment_session_id object is missing in session object"
            }
            if (!cfWebPayment.session.orderID) {
                return "orderID object is missing in session object"
            }
            if (!cfWebPayment.session.environment) {
                return "environment object is missing in session object"
            }
            return null
        } else {
            return "session object is missing in cfDropPayment object"
        }
    } else {
        return "cfDropPayment object is missing"
    }
}
function getError(message: string, orderId ?: string) {
    return {
        status: 'FAILED',
        message: message,
        code: 'payment_failed',
        type: 'request_failed',
        orderID: (orderId)? orderId : "NA",
    };
}
const CFPaymentGatewayService = module.exports = {
    cfCallback: null,
    doDropPayment(cfDropPayment: any) {
        const callback = this.cfCallback;
        const error = validateDropInput(cfDropPayment)
        if (error) {
            if (callback) {
                // @ts-ignore
                callback.onError(getError(error));
            }
            return
        }
        cordova.exec(function (result: any) {
            // @ts-ignore
            if (callback) {
                // @ts-ignore
                callback.onVerify(result);
            }
        }, function (error: any) {
            // @ts-ignore
            if (callback) {
                // @ts-ignore
                callback.onError(error);
            }
        }, PLUGIN_NAME, 'doDropPayment', [JSON.stringify(cfDropPayment), "1.0.0"]);
    },
    doWebCheckoutPayment(cfWebPayment: any) {
        const callback = this.cfCallback;
        const error = validateWebInput(cfWebPayment)
        if (error) {
            if (callback) {
                // @ts-ignore
                callback.onError(getError(error));
            }
            return
        }
        cordova.exec(function (result: any) {
            // @ts-ignore
            if (callback) {
                // @ts-ignore
                callback.onVerify(result);
            }
        }, function (error: any) {
            // @ts-ignore
            if (callback) {
                // @ts-ignore
                callback.onError(error);
            }
        }, PLUGIN_NAME, 'doWebCheckoutPayment', [JSON.stringify(cfWebPayment), "1.0.0"]);
    },
    setCallback(cfCallback: any) {
        this.cfCallback = cfCallback;
        cordova.exec(function (result: any) {
            // @ts-ignore
            if (cfCallback) {
                // @ts-ignore
                cfCallback.onVerify(result);
            }
        }, function (error: any) {
            // @ts-ignore
            if (cfCallback) {
                // @ts-ignore
                cfCallback.onError(error);
            }
        }, PLUGIN_NAME, 'setCallback', []);
    }
};
