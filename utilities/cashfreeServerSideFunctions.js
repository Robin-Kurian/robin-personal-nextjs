"use server"
import { Cashfree } from "cashfree-pg";
import { IS_DEVELOPMENT_MODE } from "@/utilities/functions.js";

const CLIENT_ID = IS_DEVELOPMENT_MODE ? process.env.CASHFREE_APP_ID_TEST : process.env.CASHFREE_APP_ID
const CLIENT_SECRET = IS_DEVELOPMENT_MODE ? process.env.CASHFREE_SECRET_KEY_TEST : process.env.CASHFREE_SECRET_KEY
const CF_ENV_MODE = IS_DEVELOPMENT_MODE ? Cashfree.Environment.SANDBOX : Cashfree.Environment.PRODUCTION;

// Initialize Cashfree configuration
Cashfree.XClientId = CLIENT_ID;
Cashfree.XClientSecret = CLIENT_SECRET;
Cashfree.XEnvironment = CF_ENV_MODE;

// Set version for API calls
const version = "2023-08-01";

export const createOrder = async (request) => {
    try {
        // Validate return URL before making the request
        if (!request.order_meta?.return_url) {
            throw new Error('Return URL is required');
        }

        const response = await Cashfree.PGCreateOrder(version, request);
        return response.data;
    } catch (error) {
        // Return a structured error object
        return {
            error: true,
            message: error.response?.data?.message || error.message,
            status: error.response?.status || 500
        };
    }
};

export const verifyOrderPayment = async (order_id) => {
    try {
        if (!order_id) {
            throw new Error('Order ID is required for payment verification');
        }

        const response = await Cashfree.PGOrderFetchPayments(version, order_id);
        return response.data;
    } catch (error) {
        console.error('Payment Verification Error:', {
            message: error.response?.data?.message || error.message,
            status: error.response?.status,
            orderId: order_id
        });

        return {
            error: true,
            message: error.response?.data?.message || error.message,
            status: error.response?.status || 500
        };
    }
};
