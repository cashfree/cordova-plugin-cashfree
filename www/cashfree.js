const exec = require("cordova/exec");
const { URL } = require("url");

const ENVS = {
  TEST: {
    url: "https://test.cashfree.com/billpay/checkout/post/submit",
  },
  PROD: {
    url: "https://www.cashfree.com/checkout/post/submit",
  },
};

const PLUGIN_NAME = "Cashfree";
const REQUIRED_KEYS = ["appId", "cftoken"];

const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const validateUrl = (str) => {
  let urlObj;

  try {
    urlObj = new URL(str);
  } catch (e) {
    return false;
  }

  return urlObj;
};

const Cashfree = {
  echo: function (phrase, cb) {
    exec(cb, null, PLUGIN_NAME, "echo", [phrase]);
  },
  checkout: function (sdkInput, cb) {
    return new Promise(function (resolve, reject) {
      const envObj = ENVS[sdkInput.env];

      if (!envObj) {
        return reject({ message: "Please provide correct ENV!" });
      }

      const isValid = REQUIRED_KEYS.every((key) =>
        sdkInput.hasOwnProperty(key)
      );

      const {
        order,
        toolbarColor = "#7d49f0",
        closeButtonColor = "#ffffff",
      } = sdkInput;

      if (!isValid || typeof order !== "object") {
        return reject({
          message: "Bad request. Please check the documentation!",
        });
      }

      if (
        !(
          order.orderAmount &&
          order.customerName &&
          order.customerPhone &&
          order.customerEmail
        )
      ) {
        return reject({
          message:
            "Invalid parameters for order property. Please check the documentation!",
        });
      }

      if (order.orderAmount <= 0) {
        return reject({
          message: "Invalid order amount",
        });
      }

      if (order.customerPhone.length < 9) {
        return reject({
          message: "Invalid customer phone number",
        });
      }

      if (!validateEmail(order.customerEmail)) {
        return reject({
          message: "Invalid customer email",
        });
      }

      const notifyUrlObj = validateUrl(order.notifyUrl);

      if (
        order.notifyUrl &&
        (!notifyUrlObj || notifyUrlObj.protocol !== "https:")
      ) {
        return reject({
          message: "Invalid notify url",
        });
      }

      if (order.returnUrl && !validateUrl(order.returnUrl)) {
        return reject({
          message: "Invalid return url",
        });
      }

      const { url } = envObj;

      let pageContent = `
        <html>
            <body>
                <form id="redirectForm" method="post" action="${url}" >
                    <input type="hidden" name="source" value="cordova-sdk" />
                    <input type="hidden" name="source" value="cordova-sdk" />
                    <input type="hidden" name="appId" value="${sdkInput.appId}" />
                    <input type="hidden" name="tokenData" value="${sdkInput.cftoken}" />
      `;

      for (let key in order) {
        if (order.hasOwnProperty(key)) {
          pageContent += `<input type="hidden" name="${key}" value="${order[key]}"/>`;
        }
      }

      pageContent += `
                </form>
                <script type="text/javascript">
                    window.onload = function() { 
                        document.getElementById("redirectForm").submit();
                    };
                </script>
            </body>
        </html>
      `;

      const pageContentUrl = "data:text/html;base64," + btoa(pageContent);
      const browserObjectOptions = [
        "hidenavigationbuttons=yes",
        "hidden=no",
        "location=yes",
        "hideurlbar=yes",
        "clearsessioncache=yes",
        "clearcache=yes",
        `toolbarcolor=${toolbarColor}`,
        "hardwareback=no",
        `closebuttoncolor=${closeButtonColor}`,
        "useWideViewPort=no",
        "lefttoright=yes",
        "closebuttoncaption=Cancel",
        "zoom=no",
        /**ios*/
        "hidespinner=no",
        "toolbar=yes",
        "toolbarposition=top",
        "enableViewportScale=no",
        "enableViewportScale=yes",
      ];

      const browserRef = cordova.InAppBrowser.open(
        pageContentUrl,
        "_blank",
        browserObjectOptions.join()
      );

      browserRef.addEventListener("loadstart", function (event) {
        if (event.url.indexOf("cordova-sdk://") > -1) {
          browserRef.close();
          const [_, str] = event.url.split(
            "cordova-sdk://TransactionResponse#"
          );
          const unescapedStr = unescape(str);
          const parsedStr = JSON.parse(unescapedStr);

          return resolve(parsedStr);
        }
      });
    });
  },
};

module.exports = Cashfree;
