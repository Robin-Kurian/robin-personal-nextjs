
import { load } from "@cashfreepayments/cashfree-js";
import { IS_DEVELOPMENT_MODE, IS_ON_MOBILE } from "@/utilities/functions.js";
const CF_ENV_MODE = IS_DEVELOPMENT_MODE ? "sandbox" : "production";
let cashfree;
var initializeSDK = async function () {
    cashfree = await load({
        mode: CF_ENV_MODE,
    });
};
initializeSDK();


export const initiatePayment = (paymentSessionIdFromOrder) => {
    const isMobile = IS_ON_MOBILE();
    return new Promise((resolve, reject) => {
        let checkoutOptions = {
            paymentSessionId: paymentSessionIdFromOrder,
            // redirectTarget: isMobile ? "_self" : "_modal",
            redirectTarget: "_modal",
        };

        cashfree.checkout(checkoutOptions).then((result) => {
            if (result.error) {
                resolve({
                    status: 'ERROR',
                    code: result.error.code,
                    message: result.error,
                    details: result
                });
            } else if (result.redirect) {
                resolve({
                    status: 'REDIRECT',
                    message: 'Payment redirected',
                    details: result
                });
            } else if (result.paymentDetails) {
                resolve({
                    status: 'COMPLETED',
                    message: result.paymentDetails.paymentMessage,
                    details: result.paymentDetails
                });
            }
        }).catch((error) => {
            reject({
                status: 'ERROR',
                code: error.code,
                message: 'Payment failed',
                error: error
            });
        });
    });
}

