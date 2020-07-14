const exec = require("cordova/exec");
const ENVS = {
  TEST: {
    url: "https://test.cashfree.com/billpay/checkout/post/submit",
  },
  PROD: {
    url: "https://www.cashfree.com/checkout/post/submit",
  },
};

const PLUGIN_NAME = "Cashfree";
const REQUIRED_KEYS = ["appId", "cfToken", "order"];

const Cashfree = {
  echo: function (phrase, cb) {
    exec(cb, null, PLUGIN_NAME, "echo", [phrase]);
  },
  checkout: function (sdkInput, cb) {
    return new Promise(function (resolve) {
      const envObj = ENVS[sdkInput.env];

      if (!envObj) {
        return reject({ message: "Please provide correct ENV!" });
      }

      const isValid = REQUIRED_KEYS.every((key) =>
        sdkInput.hasOwnProperty(key)
      );

      if (!isValid) {
        return reject({
          message: "Bad request, please check the documentation!",
        });
      }

      const { url } = envObj;
      const order = sdkInput.order;
      const toolbarColor = sdkInput.toolbarColor || "#7d49f0";
      const closeButtonColor = sdkInput.closeButtonColor || "#ffffff";

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
