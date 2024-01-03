import CashfreePGCoreSDK
import CashfreePG
import CashfreePGUISDK

@objc(CFPaymentGateway)
class CFPaymentGateway : CDVPlugin {

    var callbackId: String?;

    override init() {
        super.init()
    }

    override init!(webViewEngine theWebViewEngine: WKWebView!) {
        super.init(webViewEngine: theWebViewEngine)
    }

    @objc(doDropPayment:)
    func doDropPayment(_ command: CDVInvokedUrlCommand) -> Void {
        self.callbackId = command.callbackId ?? "";
        let data = command.arguments[0] as? String ?? ""
        let version = command.arguments[1] as? String ?? ""
        do {
            let dropObject = try! parseDropPayment(paymentObject: data)
            if (dropObject != nil) {
                let systemVersion = UIDevice.current.systemVersion
                dropObject!.setPlatform("icor-d-\(version)-xx-m-s-x-i-\(systemVersion.prefix(4))")
                let vc = self.viewController;
                try CFPaymentGatewayService.getInstance().doPayment(dropObject!, viewController: vc!)
            }
        }
        catch {
            print (error)
        }
    }

    @objc(doUPIPayment:)
    func doUPIPayment(_ command: CDVInvokedUrlCommand) -> Void {
        self.callbackId = command.callbackId ?? "";
        let data = command.arguments[0] as? String ?? ""
        let version = command.arguments[1] as? String ?? ""
        do {
            let dropObject = try! parseUPIPayment(paymentObject: data)
            if (dropObject != nil) {
                let systemVersion = UIDevice.current.systemVersion
                dropObject!.setPlatform("icor-i-\(version)-xx-m-s-x-i-\(systemVersion.prefix(4))")
                let vc = self.viewController;
                try CFPaymentGatewayService.getInstance().doPayment(dropObject!, viewController: vc!)
            }
        }
        catch {
            print (error)
        }
    }

    @objc(doWebCheckoutPayment:)
    func doWebCheckoutPayment(_ command: CDVInvokedUrlCommand) -> Void {
        self.callbackId = command.callbackId ?? "";
        let data = command.arguments[0] as? String ?? ""
        let version = command.arguments[1] as? String ?? ""
        do {
            let webObject = try! parseWebPayment(paymentObject: data)
            if (webObject != nil) {
                let cfPaymentObject = try! CFWebCheckoutPayment.CFWebCheckoutPaymentBuilder()
                                    .setSession(webObject!)
                                    .build()
                let systemVersion = UIDevice.current.systemVersion
                cfPaymentObject.setPlatform("icor-c-\(version)-xx-m-s-x-i-\(systemVersion.prefix(4))")
                let vc = self.viewController;
                try CFPaymentGatewayService.getInstance().doPayment(cfPaymentObject, viewController: vc!)
            }
        }
        catch {
            print (error)
        }
    }

    @objc(setCallback:)
    func setCallback(_ command: CDVInvokedUrlCommand) -> Void {
        CFPaymentGatewayService.getInstance().setCallback(self)
    }

    private func parseDropPayment(paymentObject: String) throws -> CFDropCheckoutPayment? {
        //        print(paymentObject)
        let data = paymentObject.data(using: .utf8)!
        if let output = try! JSONSerialization.jsonObject(with: data, options: .allowFragments) as? Dictionary<String, Any> {
            do {
                let session = getSession(paymentObject: output)
                let component = getComponents(paymentObject: output)
                let theme = getTheme(paymentObject: output)

                let nativePayment = try CFDropCheckoutPayment.CFDropCheckoutPaymentBuilder()
                    .setSession(session!)
                    .setTheme(theme!)
                    .setComponent(component!)
                    .build()
                return nativePayment

            } catch let e {
                let error = e as! CashfreeError
                print(error.localizedDescription)
                // Handle errors here
            }
        }
        return nil
    }

    private func parseUPIPayment(paymentObject: String) throws -> CFDropCheckoutPayment? {
            //        print(paymentObject)
            let data = paymentObject.data(using: .utf8)!
            if let output = try! JSONSerialization.jsonObject(with: data, options: .allowFragments) as? Dictionary<String, Any> {
                do {
                    let session = getSession(paymentObject: output)
                    let paymentComponents = try CFPaymentComponent.CFPaymentComponentBuilder()
                                        .enableComponents(["upi"])
                                        .build()
                    let theme = getTheme(paymentObject: output)

                    let nativePayment = try CFDropCheckoutPayment.CFDropCheckoutPaymentBuilder()
                        .setSession(session!)
                        .setTheme(theme!)
                        .setComponent(paymentComponents)
                        .build()
                    return nativePayment

                } catch let e {
                    let error = e as! CashfreeError
                    print(error.localizedDescription)
                    // Handle errors here
                }
            }
            return nil
        }

    private func parseWebPayment(paymentObject: String) throws -> CFSession? {
        let data = paymentObject.data(using: .utf8)!
        do {
            if let output = try JSONSerialization.jsonObject(with: data, options: .allowFragments) as? Dictionary<String, Any> {
                let session = getSession(paymentObject: output)
                return session
            }
        } catch let e {
            let error = e as! CashfreeError
            print(error.localizedDescription)
            // Handle errors here
        }
        return nil
    }


    private func getSession(paymentObject: Dictionary<String,Any>) -> CFSession? {
        if let sessionDict = paymentObject["session"] as? Dictionary<String, String> {
            do {
                let builder =  CFSession.CFSessionBuilder()
                    .setOrderID(sessionDict["orderID"] ?? "")
                    .setPaymentSessionId(sessionDict["payment_session_id"] ?? "")
                if (sessionDict["environment"] == "SANDBOX") {
                    builder.setEnvironment(CFENVIRONMENT.SANDBOX)
                } else {
                    builder.setEnvironment(CFENVIRONMENT.PRODUCTION)
                }
                let session = try builder.build()
                return session
            } catch let e {
                let error = e as! CashfreeError
                print(error.localizedDescription)
                // Handle errors here
            }
        }
        return nil
    }

    private func getComponents(paymentObject: Dictionary<String,Any>) -> CFPaymentComponent? {
        if let components = paymentObject["components"] as? Array<String> {
            do {
                var array = ["order-details"]
                components.forEach { item in
                    let component = getItemName(item: item)
                    if (component != nil) {
                        array.append(component!)
                    }
                }
                let paymentComponents = try CFPaymentComponent.CFPaymentComponentBuilder()
                    .enableComponents(array)
                    .build()
                return paymentComponents
            } catch let e {
                let error = e as! CashfreeError
                print(error.localizedDescription)
                // Handle errors here
            }
        }
        return nil
    }

    private func getItemName(item: String) -> String? {
        switch item {
        case "CARD" :
            return "card"
        case "UPI" :
            return "upi"
        case "NB" :
            return "netbanking"
        case "WALLET" :
            return "wallet"
        case "EMI" :
            return "emi"
        case "PAY_LATER" :
            return "paylater"
        default :
            return nil
        }
    }

    private func getTheme(paymentObject: Dictionary<String,Any>) -> CFTheme? {
        if let theme = paymentObject["theme"] as? Dictionary<String, String> {
            do {
                return try CFTheme.CFThemeBuilder()
                    .setNavigationBarBackgroundColor(theme["navigationBarBackgroundColor"]!)
                    .setNavigationBarTextColor(theme["navigationBarTextColor"]!)
                    .setButtonBackgroundColor(theme["buttonBackgroundColor"]!)
                    .setButtonTextColor(theme["buttonTextColor"]!)
                    .setPrimaryTextColor(theme["primaryTextColor"]!)
                    .setSecondaryTextColor(theme["secondaryTextColor"]!)
                    .build()
            } catch let e {
                let error = e as! CashfreeError
                print(error.localizedDescription)
                // Handle errors here
            }
            //            return CFTheme.CFThemeBuilder().build()
            //                .setNavigationBarBackgroundColor(theme["navigationBarBackgroundColor"] ?? "")
        }
        return nil
    }

    func stringify(json: Any) -> String {
        let options: JSONSerialization.WritingOptions = []
        do {
            let data = try JSONSerialization.data(withJSONObject: json, options: options)
            if let string = String(data: data, encoding: String.Encoding.utf8) {
                return string
            }
        } catch {
            print(error)
        }

        return ""
    }
}

extension CFPaymentGateway: CFResponseDelegate {
    func onError(_ error: CFErrorResponse, order_id: String) {
        let data : [String: String] = ["status": error.status ?? ""
                                       , "message": error.message ?? ""
                                       , "code": error.code ?? ""
                                       , "type": error.type ?? ""
                                       , "orderID": order_id]
        let cdvResult = CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: data)
        self.commandDelegate.send(cdvResult, callbackId: self.callbackId)
    }

    func verifyPayment(order_id: String) {
        let body:[String: String] = ["orderID": order_id]
        let cdvResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: body)
        self.commandDelegate.send(cdvResult, callbackId: self.callbackId)
    }
}
