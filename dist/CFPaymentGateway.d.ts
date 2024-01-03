declare const PLUGIN_NAME = "CFPaymentGateway";
declare const version = "1.0.6";
declare let cordova: any;
declare function validateDropInput(cfDropPayment: any): "payment_session_id object is missing in session object" | "orderID object is missing in session object" | "environment object is missing in session object" | "session object is missing in cfDropPayment object" | "cfDropPayment object is missing";
declare function validateWebInput(cfWebPayment: any): "payment_session_id object is missing in session object" | "orderID object is missing in session object" | "environment object is missing in session object" | "session object is missing in cfWebPayment object" | "cfWebPayment object is missing";
declare function validateUPIInput(cfUPIPayment: any): "payment_session_id object is missing in session object" | "orderID object is missing in session object" | "environment object is missing in session object" | "session object is missing in cfUPIPayment object" | "cfUPIPayment object is missing";
declare function getError(message: string, orderId?: string): {
    status: string;
    message: string;
    code: string;
    type: string;
    orderID: string;
};
declare const CFPaymentGatewayService: {
    cfCallback: any;
    doUPIPayment(cfUPIPayment: any): void;
    doDropPayment(cfDropPayment: any): void;
    doWebCheckoutPayment(cfWebPayment: any): void;
    setCallback(cfCallback: any): void;
};
