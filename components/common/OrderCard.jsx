import React, { useState } from 'react';
import CONSTANTS from '@/utilities/constants';
import { DATE } from '@/utilities/functions';
import { FIREBASE } from '@/utilities/functions';
import { Select, SelectItem } from "@heroui/react";
import { db } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';

export const statuses = [
    { label: "Pending" },
    { label: "Paid" },
    { label: "Processing" },
    { label: "Packed" },
    { label: "In Transit" },
    { label: "Out for Delivery" },
    { label: "Delivered" },
    { label: "Cancelled" },
    { label: "Refund Processing" }
];

const OrderCard = ({ order, onClick, isPrivileaged = false }) => {
    const [orderState, setOrderState] = useState(null);

    const handleStatusChange = (e) => {
        const newOrderState = e.target.value;
        setOrderState(newOrderState);
        FIREBASE.UPDATE_DATA(db, 'orders', order.id, { orderStatus: newOrderState })
            .then(() => {
                toast({
                    variant: "success",
                    title: "Update Successful",
                    description: <>Order status updated to <strong>{newOrderState}</strong>!</>,
                });
            })
            .catch((error) => {
                toast({
                    variant: "destructive",
                    title: "Status update Failed",
                    description: `Error updating order status: ${error}!`,
                });
            });
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4 cursor-pointer" onClick={onClick}>
            <div className="flex justify-between items-start ">
                <div className='w-1/2 sm:3/4'>
                    <h3 className="font-semibold text-base sm:text-lg">{order.orderId}  {isPrivileaged ? `[ ${order.deliveryAddress.firstName} ${order.deliveryAddress.lastName} ]` : ""}</h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                        Placed {DATE.FORMAT_TIME_AGO(new Date(order.createdAt))}
                    </p>
                </div>
                {isPrivileaged ? (
                    <div className="w-1/2 sm:w-1/5 mt-6 sm:mt-2">
                        <Select size='sm' radius='md' variant='bordered'
                            label={order.orderStatus}
                            aria-label="Update Order Status"
                            selectedKeys={[orderState]}
                            classNames={{
                                trigger: ['min-h-4 h-9']
                            }}
                            onChange={handleStatusChange}>
                            {statuses.map((status) => (
                                <SelectItem key={status.label}>{status.label}</SelectItem>
                            ))}
                        </Select>
                    </div>
                ) : <div className={`px-3 py-1 rounded-full text-xs sm:text-sm ${order.orderStatus === 'Pending' ? 'bg-blue-100 text-blue-800' :
                    order.orderStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {order.orderStatus ? order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1) : 'Unknown Status'}
                </div>
                }
            </div>
            <div className="mt-2">
                <div className="text-sm text-gray-600 mb-2">
                    {order.selectedProducts?.map((product, index) => (
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
                            <span className="text-sm sm:text-base">SUBTOTAL: {CONSTANTS.SYMBOLS.CURRENCY}{product.subtotal?.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <span className='flex justify-end text-sm text-gray-600'>DELIVERY FEE: {CONSTANTS.SYMBOLS.CURRENCY} {order.orderSummary?.deliveryFee?.toFixed(2) ?? 0}</span>
                <div className="border-t pt-2 mt-2">
                    <p className="text-gray-700 font-medium text-base sm:text-lg">
                        Total: {CONSTANTS.SYMBOLS.CURRENCY}{order.orderSummary?.finalAmount?.toFixed(2)}
                    </p>
                    <p className="text-gray-600 text-sm">
                        Items: {order.selectedProducts?.reduce((acc, curr) => acc + curr.quantity, 0)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderCard; 