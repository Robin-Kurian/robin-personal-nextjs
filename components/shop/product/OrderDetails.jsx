import React from 'react';
import CONSTANTS from '@/utilities/constants';

const OrderDetails = ({ order }) => {
    const {
        orderId,
        createdAt,
        orderStatus,
        trackingId,
        selectedProducts,
        orderSummary,
        deliveryAddress,
        paymentDetails,
    } = order;

    return (
        <div className="bg-white rounded-lg">
            <div className="mb-4">
                <p className="text-gray-700">
                    <strong>Order :</strong> {orderId}
                </p>
                <p className="text-gray-700">
                    <strong>Status :</strong> {orderStatus}
                </p>
                <p className="text-gray-700">
                    <strong>Tracking Id :</strong> {trackingId}
                </p>
                <p className="text-gray-700">
                    <strong>Placed On :</strong> {new Date(createdAt).toLocaleDateString()}
                </p>
            </div>
            <h3 className="text-md font-semibold mb-2">Products</h3>
            <div className="text-sm text-gray-600 mb-2">
                {selectedProducts?.map((product, index) => (
                    <div key={index} className="flex justify-between items-center mb-1">
                        <div className='flex'>
                            <span className="text-sm sm:text-base">{product.name} ({product.quantity} Nos.)</span>
                            {/* Display variants if they exist */}
                            {Object.keys(product.variants).length > 0 && (
                                <div className="ml-2">
                                    {Object.entries(product.variants).map(([key, value]) => (
                                        <span key={key} className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full mr-1">
                                            {key}: {value}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <span>{CONSTANTS.SYMBOLS.CURRENCY}{product.subtotal?.toFixed(2)}</span>
                    </div>
                ))}
            </div>
            <div className="border-t pt-2 mt-2">
                <p className="text-gray-700 font-medium">
                    <strong>Subtotal :</strong> {CONSTANTS.SYMBOLS.CURRENCY}{orderSummary.subtotal?.toFixed(2)}
                </p>
                <p className="text-gray-700 font-medium">
                    <strong>Delivery Fee :</strong> {CONSTANTS.SYMBOLS.CURRENCY}{orderSummary.deliveryFee?.toFixed(2)}
                </p>
                <p className="text-gray-700 font-medium">
                    <strong>Total :</strong> {CONSTANTS.SYMBOLS.CURRENCY}{orderSummary.finalAmount?.toFixed(2)}
                </p>
                <p className="text-gray-600 text-sm">
                    <strong>Items :</strong> {selectedProducts?.reduce((acc, curr) => acc + curr.quantity, 0)}
                </p>
            </div>
            <h3 className="text-md font-semibold mb-2 mt-4">Delivery Address</h3>
            <div className="text-sm text-gray-600 mb-2">
                <p><strong>Name :</strong> {deliveryAddress.firstName} {deliveryAddress.lastName}</p>
                <p><strong>Address :</strong> {deliveryAddress.addressLine1}, {deliveryAddress.addressLine2}, {deliveryAddress.apartment}</p>
                <p><strong>City :</strong> {deliveryAddress.city}</p>
                <p><strong>State :</strong> {deliveryAddress.state}</p>
                <p><strong>Pin Code :</strong> {deliveryAddress.pinCode}</p>
                <p><strong>Country :</strong> {deliveryAddress.country}</p>
                <p><strong>Phone :</strong> {deliveryAddress.phone}</p>
                <p><strong>Email :</strong> {deliveryAddress.email}</p>
            </div>
            <h3 className="text-md font-semibold mb-2 mt-4">Payment Details</h3>
            <div className="text-sm text-gray-600 mb-2">
                <p><strong>Payment Method :</strong> {paymentDetails.payment_method?.upi?.channel || 'N/A'}</p>
                <p><strong>UPI ID :</strong> {paymentDetails.payment_method?.upi?.upi_id || 'N/A'}</p>
                <p><strong>Payment Status :</strong> {paymentDetails.payment_status}</p>
                <p><strong>Payment Amount :</strong> {CONSTANTS.SYMBOLS.CURRENCY}{paymentDetails.payment_amount?.toFixed(2)}</p>
                <p><strong>Transaction ID :</strong> {paymentDetails.cf_payment_id}</p>
                <p><strong>Payment Time :</strong> {new Date(paymentDetails.payment_time).toLocaleString()}</p>
            </div>
        </div>
    );
};

export default OrderDetails;
