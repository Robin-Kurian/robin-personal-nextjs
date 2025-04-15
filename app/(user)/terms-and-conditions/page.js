import { SHOP_DETAILS } from '@/utilities/constants';
import React from 'react';

const TermsAndConditions = () => {
    return (
        <div className="container mx-auto mt-6 p-6 bg-gray-50 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Terms and conditions</h1>
            <p className="mb-6 text-lg text-gray-700">
                We&apos;re thrilled to have you here! By using our website, you agree to our terms and conditions. Let&apos;s make sure you have a great experience!
            </p>
            <h2 className="text-2xl font-semibold mb-4 text-blue-500">1. Introduction</h2>
            <p className="mb-6 text-gray-700">
                These terms outline how you can use our website and purchase our delightful products, including newborn items, dresses, gifts, and toys. If you have any questions, feel free to reach out!
            </p>
            <h2 className="text-2xl font-semibold mb-4 text-blue-500">2. Product Information</h2>
            <p className="mb-6 text-gray-700">
                We strive to provide accurate descriptions and images of our products. However, we can&apos;t guarantee that everything is perfect. If you have any concerns, just let us know!
            </p>
            <h2 className="text-2xl font-semibold mb-4 text-blue-500">3. Orders and Payment</h2>
            <p className="mb-6 text-gray-700">
                All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason. Payment must be made in full at the time of purchase.
            </p>
            <h2 className="text-2xl font-semibold mb-4 text-blue-500">4. Shipping and Delivery</h2>
            <p className="mb-6 text-gray-700">
                We aim to deliver your order within the estimated delivery time. However, delays may occur due to unforeseen circumstances. We appreciate your understanding!
            </p>
            <h2 className="text-2xl font-semibold mb-4 text-blue-500">5. Returns and Refunds</h2>
            <p className="mb-6 text-gray-700">
                If you&apos;re not completely satisfied with your purchase, you can return the item within 10 days of receipt for a full refund, provided it is in its original condition. Please check our Returns Policy for more details.
            </p>
            <h2 className="text-2xl font-semibold mb-4 text-blue-500">6. Limitation of Liability</h2>
            <p className="mb-6 text-gray-700">
                Baby Paradise shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our liability is limited to the maximum extent permitted by law.
            </p>
            <h2 className="text-2xl font-semibold mb-4 text-blue-500">7. Changes to Terms</h2>
            <p className="mb-6 text-gray-700">
                We reserve the right to modify these terms at any time. Any changes will be effective immediately upon posting on our website. Your continued use of the site after changes are made constitutes your acceptance of the new terms.
            </p>
            <h2 className="text-2xl font-semibold mb-4 text-blue-500">8. Contact Us</h2>
            <p className="text-gray-700">
                If you have any questions about these terms and conditions, please don&apos;t hesitate to contact us at <a href={`mailto:${SHOP_DETAILS.SHOP_SUPPORT_EMAIL}`} className="text-blue-600 underline">{SHOP_DETAILS.SHOP_SUPPORT_EMAIL}</a>. We&apos;re here to help!
            </p>
        </div>
    );
};

export default TermsAndConditions;

