import React from 'react';

const AboutUs = () => {
    return (
        <div className="container mx-auto mt-6 p-6 bg-gray-50 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">About Us</h1>
            <p className="mb-4 text-lg text-gray-700">
                Welcome to Baby Paradise, your one-stop shop for all things baby! We specialize in providing high-quality newborn items, stylish dresses, thoughtful gifts, and delightful toys for your little ones. Our mission is to make parenting easier and more enjoyable by offering a curated selection of products that cater to the needs of both parents and their babies.
            </p>
            <h2 className="text-2xl font-semibold mb-4 text-blue-500">Our Story</h2>
            <p className="mb-4 text-gray-700">
                Baby Paradise was founded with a passion for helping parents find the best products for their children. We understand that every parent wants the best for their baby, and we strive to provide a shopping experience that is both convenient and enjoyable. Our team is dedicated to sourcing products that are safe, durable, and stylish, ensuring that you can trust the items you purchase from us.
            </p>
            <h2 className="text-2xl font-semibold mb-4 text-blue-500">Our Products</h2>
            <p className="mb-4 text-gray-700">
                We offer a wide range of products, including:
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-700">
                <li>Newborn essentials such as clothing, blankets, and accessories</li>
                <li>Stylish dresses for special occasions and everyday wear</li>
                <li>Thoughtful gifts for baby showers and new parents</li>
                <li>Fun and educational toys that promote development and creativity</li>
            </ul>
            <h2 className="text-2xl font-semibold mb-4 text-blue-500">Our Commitment</h2>
            <p className="mb-4 text-gray-700">
                At Baby Paradise, we are committed to providing exceptional customer service and ensuring that our customers are satisfied with their purchases. We believe in building lasting relationships with our customers and are always here to help with any questions or concerns you may have.
            </p>
            <h2 className="text-2xl font-semibold mb-4 text-blue-500">Join Our Community</h2>
            <p className="text-gray-700">
                We invite you to explore our collection and join the Baby Paradise family. Follow us on social media for updates, promotions, and parenting tips. Thank you for choosing Baby Paradise, where we celebrate the joy of parenthood!
            </p>
        </div>
    );
};

export default AboutUs;
