"use client"
import React from 'react';
import { SHOP_DETAILS } from '@/utilities/constants';
import WhatsappFormModal from '@/components/common/WhatsappFormModal';

const ContactUs = () => {
    return (
        <div className="container mx-auto mt-6 p-6 bg-gray-50 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Contact Us</h1>
            <p className="mb-4 text-lg text-gray-700">
                Thank you for your interest in Baby Paradise! We are here to assist you with any inquiries you may have regarding our products, including newborn items, dresses, gifts, and toys.
            </p>
            <h2 className="text-2xl font-semibold mb-4 text-blue-500">Get in Touch</h2>
            <p className="mb-4 text-gray-700">
                If you have any questions, feedback, or concerns, please feel free to reach out to us through the following methods:
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-700">
                <li>Email: <a href={`mailto:${SHOP_DETAILS.SHOP_SUPPORT_EMAIL}`} className="text-blue-500">{SHOP_DETAILS.SHOP_SUPPORT_EMAIL}</a></li>
                <li>Phone: <a href={`tel:+91${SHOP_DETAILS.SHOP_ADMIN_CONTACT}`} className="text-blue-500">+91 {SHOP_DETAILS.SHOP_ADMIN_CONTACT}</a></li>
                <li>Address: Baby Paradise, mission Hospital road, opposite to Sacred heart mission Hospital, Pullur, Kerala 680683</li>
            </ul>
            <p className="mb-4 text-gray-700">
                You can find us at our location:
            </p>
            <div className="mb-4">
                <iframe
                    src={SHOP_DETAILS.SHOP_LOCATION}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy">
                </iframe>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-blue-500">Follow Us</h2>
            <p className="mb-4 text-gray-700">
                Stay updated with our latest products and offers by following us on social media:
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-700">
                <li><a href={SHOP_DETAILS.SHOP_INSTAGRAM} target='blank' className="text-blue-500">Instagram</a></li>
                <li><a href={SHOP_DETAILS.SHOP_FACEBOOK} target='blank' className="text-blue-500">Facebook</a></li>
            </ul>
            <h2 className="text-2xl font-semibold mb-4 text-blue-500">Feedback</h2>
            <p className="mb-4 text-gray-700">
                We value your feedback! Please let us know how we can improve your experience with Baby Paradise.<br />
                Mail us @ <a href={`mailto:${SHOP_DETAILS.SHOP_SUPPORT_EMAIL}`} className="text-blue-500">{SHOP_DETAILS.SHOP_SUPPORT_EMAIL}</a>
            </p>

            {/* WhatsApp Chat Button */}
            <div className="flex justify-center mt-8">
                <WhatsappFormModal buttonText="Chat with us now!" />
            </div>
        </div>
    );
};

export default ContactUs;
