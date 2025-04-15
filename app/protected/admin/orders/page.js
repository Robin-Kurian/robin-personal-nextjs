/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React, { useEffect, useState } from 'react';
import useOrdersStore from '@/hooks/useOrdersStore';
import ContentWrapper from '@/components/common/layouts/ContentWrapper';
import { Button, ButtonGroup, Skeleton } from '@heroui/react';
import { toast } from '@/hooks/use-toast';
import useAuthStore from '@/hooks/useAuthStore';
import OrderCard from '@/components/common/OrderCard';
import EmptyMessage from '@/components/common/EmptyMessage';
import CustomModal from '@/components/admin/CustomModal';
import OrderDetails from '@/components/shop/product/OrderDetails';

const AdminOrdersPage = () => {
    const { orders, loading: ordersLoading, error, fetchOrders, loadMoreOrders, hasMore } = useOrdersStore();
    const { isLoggedIn, user, isAdmin, loading: authLoading } = useAuthStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedSource, setSelectedSource] = useState('firebase');

    useEffect(() => {
        if (!authLoading && isLoggedIn && user?.role === "admin" && selectedSource === 'firebase') {
            fetchOrders();
        }
    }, [isLoggedIn, user, authLoading]);

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    if (error) {
        toast({
            variant: "destructive",
            title: "Error loading orders",
            description: error
        });
    }

    // Show loading state while authentication or orders are loading
    if (authLoading || (ordersLoading && orders.length === 0)) {
        return (
            <ContentWrapper className="gap-4 bg-slate-50 p-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {Array(8).fill().map((_, index) => (
                        <Skeleton key={index} className="w-full h-48 rounded-lg" />
                    ))}
                </div>
            </ContentWrapper>
        );
    }

    return (
        <ContentWrapper className="gap-4 bg-slate-50 py-4 px-2 min-h-screen">
            <ButtonGroup
                size='sm'
                radius='md'
                variant='shadow'>
                <Button
                    variant={selectedSource === 'firebase' ? 'solid' : 'bordered'}
                    onPress={() => setSelectedSource('firebase')}
                >
                    Manage Orders
                </Button>
                <Button

                    variant={selectedSource === 'cashfree' ? 'solid' : 'bordered'}
                    onPress={() => { setSelectedSource('cashfree'); window.open("https://merchant.cashfree.com/merchants/pg/summary/overview", "_blank"); }}
                >
                    Visit CashFree PG
                </Button>
            </ButtonGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {orders.length > 0 ? (
                    <>
                        {orders.map((order) => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                isPrivileaged={isAdmin}
                                onClick={() => handleOrderClick(order)}
                            />
                        ))}
                    </>
                ) : (
                    <EmptyMessage
                        title="No orders found"
                        message="There are no orders available at the moment."
                    />
                )}
            </div>
            {hasMore && (
                <Button
                    onPress={() => loadMoreOrders()}
                    disabled={ordersLoading}
                    size='sm'
                    radius='full'
                    className="my-4 flex self-center w-1/6 bg-indigo-400 text-white px-6 py-2 hover:bg-indigo-600 transition-colors disabled:opacity-50"
                >
                    {ordersLoading ? "Loading..." : "Load More"}
                </Button>
            )}

            {/* Custom Modal for Order Details */}
            <CustomModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Order Details"
                contentClassName="max-h-[80vh]"
                body={selectedOrder && <OrderDetails order={selectedOrder} />}
            />
        </ContentWrapper>
    );
};

export default AdminOrdersPage;