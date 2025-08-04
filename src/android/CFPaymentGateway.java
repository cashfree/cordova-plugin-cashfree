package com.cashfree.pg.cordova;

import android.app.Activity;

import com.cashfree.pg.api.CFPaymentGatewayService;
import com.cashfree.pg.api.util.DropPaymentParser;
import com.cashfree.pg.core.api.CFSubscriptionSession;
import com.cashfree.pg.core.api.CFSession;
import com.cashfree.pg.core.api.CFTheme;
import com.cashfree.pg.core.api.base.CFPayment;
import com.cashfree.pg.core.api.callback.CFCheckoutResponseCallback;
import com.cashfree.pg.core.api.callback.CFSubscriptionResponseCallback;
import com.cashfree.pg.core.api.exception.CFException;
import com.cashfree.pg.core.api.subscription.CFSubscriptionPayment;
import com.cashfree.pg.core.api.exception.CFInvalidArgumentException;
import com.cashfree.pg.core.api.utils.CFErrorResponse;
import com.cashfree.pg.core.api.utils.CFSubscriptionResponse;
import com.cashfree.pg.core.api.utils.CFUtil;
import com.cashfree.pg.core.api.webcheckout.CFWebCheckoutPayment;
import com.cashfree.pg.core.api.webcheckout.CFWebCheckoutTheme;
import com.cashfree.pg.ui.api.CFDropCheckoutPayment;
import com.cashfree.pg.ui.api.upi.intent.CFUPIIntentCheckoutPayment;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * This class echoes a string called from JavaScript.
 */
public class CFPaymentGateway extends CordovaPlugin implements CFCheckoutResponseCallback, CFSubscriptionResponseCallback {

    private CallbackContext callbackContext;

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if ("doDropPayment".equals(action)) {
            try {
                CFDropCheckoutPayment dropCheckoutPayment = DropPaymentParser.getDropCheckoutPayment(
                        (String) args.get(0),
                        CFPayment.CFSDKFlavour.DROP,
                        CFPayment.CFSDKFramework.CORDOVA.withVersion((String) args.get(1)));
                startDropPayment(dropCheckoutPayment, callbackContext);
            } catch (Exception e) {
                e.printStackTrace();
                if (callbackContext != null) {
                    PluginResult pluginResult = new PluginResult(PluginResult.Status.ERROR,
                            getJSONObject(CFUtil.getFailedResponse(e.getMessage()), "NA"));
                    sendResult(callbackContext, pluginResult);
                }
            }
            return true;
        } else if ("doWebCheckoutPayment".equals(action)) {
            try {
                CFWebCheckoutPayment cfWebCheckoutPayment = DropPaymentParser.getWebCheckoutPayment(
                        (String) args.get(0),
                        CFPayment.CFSDKFlavour.WEB_CHECKOUT,
                        CFPayment.CFSDKFramework.CORDOVA.withVersion((String) args.get(1)));
                startWebPayment(cfWebCheckoutPayment, callbackContext);
            } catch (Exception e) {
                e.printStackTrace();
                if (callbackContext != null) {
                    PluginResult pluginResult = new PluginResult(PluginResult.Status.ERROR,
                            getJSONObject(CFUtil.getFailedResponse(e.getMessage()), "NA"));
                    sendResult(callbackContext, pluginResult);
                }
            }
            return true;
        } else if ("doUPIPayment".equals(action)) {
            try {
                CFUPIIntentCheckoutPayment cfupiIntentCheckoutPayment = DropPaymentParser.getUPICheckoutPayment(
                        (String) args.get(0),
                        CFPayment.CFSDKFlavour.INTENT,
                        CFPayment.CFSDKFramework.CORDOVA.withVersion((String) args.get(1)));
                startUPIPayment(cfupiIntentCheckoutPayment, callbackContext);
            } catch (Exception e) {
                e.printStackTrace();
                if (callbackContext != null) {
                    PluginResult pluginResult = new PluginResult(PluginResult.Status.ERROR,
                            getJSONObject(CFUtil.getFailedResponse(e.getMessage()), "NA"));
                    sendResult(callbackContext, pluginResult);
                }
            }
            return true;
        } else if ("doSubscriptionPayment".equals(action)) {
            try {
                JSONObject cfSubscriptionJson = new JSONObject((String) args.get(0));
                JSONObject cfSubsSessionJson = cfSubscriptionJson.getJSONObject("session");
                CFSubscriptionSession cfSubsSession = new CFSubscriptionSession.CFSubscriptionSessionBuilder()
                        .setEnvironment(CFSubscriptionSession.Environment.valueOf(cfSubsSessionJson.getString("environment")))
                        .setSubscriptionId(cfSubsSessionJson.getString("subscription_id"))
                        .setSubscriptionSessionID(cfSubsSessionJson.getString("subscription_session_id"))
                        .build();
                CFSubscriptionPayment cfSubscriptionPayment = new CFSubscriptionPayment.CFSubscriptionCheckoutBuilder()
                        .setSubscriptionSession(cfSubsSession)
                        .build();

                cfSubscriptionPayment.setCfSDKFlavour(CFPayment.CFSDKFlavour.SUBSCRIPTION);
                cfSubscriptionPayment.setCfsdkFramework(CFPayment.CFSDKFramework.CORDOVA.withVersion((String) args.get(1)));

                startSubscriptionPayment(cfSubscriptionPayment, callbackContext);
            } catch (Exception e) {
                e.printStackTrace();
                if (callbackContext != null) {
                    PluginResult pluginResult = new PluginResult(PluginResult.Status.ERROR,
                            getJSONObject(CFUtil.getFailedResponse(e.getMessage()), "NA"));
                    sendResult(callbackContext, pluginResult);
                }
            }
            return true;
        } else if ("setCallback".equals(action)) {
            this.callbackContext = callbackContext;
            setCallback();
            return true;
        }
        return false;
    }

    private void sendResult(CallbackContext callbackContext, PluginResult pluginResult) {
        pluginResult.setKeepCallback(true);
        if (callbackContext != null) {
            callbackContext.sendPluginResult(pluginResult);
        }
    }

    private void startDropPayment(CFDropCheckoutPayment dropCheckoutPayment, CallbackContext callbackContext) {
        Activity activity = cordova.getActivity();
        try {
            CFPaymentGatewayService.getInstance().doPayment(activity, dropCheckoutPayment);
        } catch (CFException cfException) {
            cfException.printStackTrace();
            if (callbackContext != null) {
                PluginResult pluginResult = new PluginResult(PluginResult.Status.ERROR,
                        getJSONObject(CFUtil.getFailedResponse(cfException.getMessage()), "NA"));
                sendResult(callbackContext, pluginResult);
            }
        }
    }

    private void startUPIPayment(CFUPIIntentCheckoutPayment cfupiIntentCheckoutPayment, CallbackContext callbackContext) {
        Activity activity = cordova.getActivity();
        try {
            CFPaymentGatewayService.getInstance().doPayment(activity, cfupiIntentCheckoutPayment);
        } catch (CFException cfException) {
            cfException.printStackTrace();
            if (callbackContext != null) {
                PluginResult pluginResult = new PluginResult(PluginResult.Status.ERROR,
                        getJSONObject(CFUtil.getFailedResponse(cfException.getMessage()), "NA"));
                sendResult(callbackContext, pluginResult);
            }
        }
    }

    private void startWebPayment(CFWebCheckoutPayment cfWebCheckoutPayment, CallbackContext callbackContext) {
        Activity activity = cordova.getActivity();
        try {
            CFPaymentGatewayService.getInstance().doPayment(activity, cfWebCheckoutPayment);
        } catch (CFException cfException) {
            cfException.printStackTrace();
            if (callbackContext != null) {
                PluginResult pluginResult = new PluginResult(PluginResult.Status.ERROR,
                        getJSONObject(CFUtil.getFailedResponse(cfException.getMessage()), "NA"));
                sendResult(callbackContext, pluginResult);
            }
        }
    }

    private void startSubscriptionPayment(CFSubscriptionPayment cfSubscriptionPayment, CallbackContext callbackContext) {
        Activity activity = cordova.getActivity();
        try {
            CFPaymentGatewayService.getInstance().setSubscriptionCheckoutCallback(this);
            CFPaymentGatewayService.getInstance().doSubscriptionPayment(activity, cfSubscriptionPayment);
        } catch (CFException cfException) {
            cfException.printStackTrace();
            if (callbackContext != null) {
                PluginResult pluginResult = new PluginResult(PluginResult.Status.ERROR,
                        getJSONObject(CFUtil.getFailedResponse(cfException.getMessage()), "NA"));
                sendResult(callbackContext, pluginResult);
            }
        }
    }

    private void setCallback() {
        try {
            CFPaymentGatewayService.getInstance().setCheckoutCallback(this);
        } catch (CFException cfException) {
            cfException.printStackTrace();
            if (callbackContext != null) {
                PluginResult pluginResult = new PluginResult(PluginResult.Status.ERROR,
                        getJSONObject(CFUtil.getFailedResponse(cfException.getMessage()), "NA"));
                sendResult(callbackContext, pluginResult);
            }
        }
    }

    @Override
    public void onPaymentVerify(String s) {
        if (callbackContext != null) {
            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK,
                    getJSONObject(null, s));
            sendResult(callbackContext, pluginResult);

        }
    }

    @Override
    public void onPaymentFailure(CFErrorResponse cfErrorResponse, String s) {
        if (callbackContext != null) {
            PluginResult pluginResult = new PluginResult(PluginResult.Status.ERROR,
                    getJSONObject(cfErrorResponse.toJSON(), s));
            sendResult(callbackContext, pluginResult);
        }
    }

    @Override
    public void onSubscriptionVerify(CFSubscriptionResponse cfSubscriptionResponse) {
        onPaymentVerify(cfSubscriptionResponse.getSubscriptionId());
    }

    @Override
    public void onSubscriptionFailure(CFErrorResponse cfErrorResponse) {
        onPaymentFailure(cfErrorResponse, "NA");
    }

    private static JSONObject getJSONObject(JSONObject jsonObject, String orderId) {
        if (jsonObject == null) {
            jsonObject = new JSONObject();
        }
        try {
            jsonObject.put("orderID", orderId);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jsonObject;
    }
}
