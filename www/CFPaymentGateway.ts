const PLUGIN_NAME = "CFPaymentGateway";
const version = "1.0.11"

declare let cordova: any
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
            return "session object is missing in cfWebPayment object"
        }
    } else {
        return "cfWebPayment object is missing"
    }
}

function validateSubscriptionInput(cfSubscriptionPayment: any) {
    if (cfSubscriptionPayment) {
        if (cfSubscriptionPayment.session) {
            if (!cfSubscriptionPayment.session.subscription_session_id) {
                return "subscription_session_id is missing in session object"
            }
            if (!cfSubscriptionPayment.session.subscription_id) {
                return "subscription_id is missing in session object"
            }
            if (!cfSubscriptionPayment.session.environment) {
                return "environment is missing in session object"
            }
            return null
        } else {
            return "session object is missing in cfSubscriptionPayment object"
        }
    } else {
        return "cfSubscriptionPayment object is missing"
    }
}

function validateUPIInput(cfUPIPayment: any) {
    if (cfUPIPayment) {
        if (cfUPIPayment.session) {
            if (!cfUPIPayment.session.payment_session_id) {
                return "payment_session_id object is missing in session object"
            }
            if (!cfUPIPayment.session.orderID) {
                return "orderID object is missing in session object"
            }
            if (!cfUPIPayment.session.environment) {
                return "environment object is missing in session object"
            }
            return null
        } else {
            return "session object is missing in cfUPIPayment object"
        }
    } else {
        return "cfUPIPayment object is missing"
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
    doUPIPayment(cfUPIPayment: any) {
        const callback = this.cfCallback;
        const error = validateUPIInput(cfUPIPayment)
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
        }, PLUGIN_NAME, 'doUPIPayment', [JSON.stringify(cfUPIPayment), version]);
    },
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
        }, PLUGIN_NAME, 'doDropPayment', [JSON.stringify(cfDropPayment), version]);
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
        }, PLUGIN_NAME, 'doWebCheckoutPayment', [JSON.stringify(cfWebPayment), version]);
    },
    doSubscriptionPayment(cfSubscriptionPayment: any) {
        const callback = this.cfCallback;
        const error = validateSubscriptionInput(cfSubscriptionPayment)
        if (error) {
            if (callback) {
                callback.onError(getError(error));
            }
            return
        }
        cordova.exec(function (result: any) {
            if (callback) {
                callback.onVerify(result);
            }
        }, function (error: any) {
            if (callback) {
                callback.onError(error);
            }
        }, PLUGIN_NAME, 'doSubscriptionPayment', [JSON.stringify(cfSubscriptionPayment), version]);
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
