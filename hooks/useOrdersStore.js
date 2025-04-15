import { create } from 'zustand'
import { collection, query, limit, startAfter, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { FIREBASE } from '@/utilities/functions'

const useOrdersStore = create((set, get) => ({
    orders: [],
    loading: false,
    error: null,
    lastVisible: null,
    hasMore: true,

    fetchOrders: async (userId = null) => {
        set({ loading: true, error: null });
        try {
            const ordersRef = collection(db, 'orders');
            let q;

            if (userId) {
                q = query(
                    ordersRef,
                    where('userId', '==', userId),
                    orderBy('createdAt', 'desc'),
                    limit(10)
                );
            } else {
                q = query(
                    ordersRef,
                    orderBy('createdAt', 'desc'),
                    limit(10)
                );
            }

            const snapshot = await getDocs(q);
            const orders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            set({
                orders,
                lastVisible: snapshot.docs[snapshot.docs.length - 1],
                hasMore: orders.length === 10, // If we got full page, there might be more
                loading: false
            });
        } catch (error) {
            console.error('Error fetching orders:', error);
            set({ error: error.message, loading: false });
        }
    },

    loadMoreOrders: async (userId = null) => {
        const { lastVisible, hasMore, orders, loading } = get();

        // Don't fetch if we're already loading or there's no more data
        if (loading || !lastVisible || !hasMore) {
            return;
        }

        set({ loading: true });
        try {
            const ordersRef = collection(db, 'orders');
            let q;

            if (userId) {
                q = query(
                    ordersRef,
                    where('userId', '==', userId),
                    orderBy('createdAt', 'desc'),
                    startAfter(lastVisible),
                    limit(10)
                );
            } else {
                q = query(
                    ordersRef,
                    orderBy('createdAt', 'desc'),
                    startAfter(lastVisible),
                    limit(10)
                );
            }

            const snapshot = await getDocs(q);
            const newOrders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Only prevent exact duplicates (same ID and no data changes)
            const existingOrders = new Map(orders.map(order => [order.id, order]));
            const uniqueNewOrders = newOrders.filter(newOrder => {
                const existingOrder = existingOrders.get(newOrder.id);
                // Keep the order if:
                // 1. It doesn't exist in our current list, OR
                // 2. Its data has changed (comparing createdAt as it never changes)
                return !existingOrder || existingOrder.createdAt !== newOrder.createdAt;
            });

            // If we got exactly 10 items, there might be more
            const mightHaveMore = newOrders.length === 10;

            set({
                orders: [...orders, ...uniqueNewOrders],
                lastVisible: snapshot.docs[snapshot.docs.length - 1],
                // Keep showing Load More if we got a full page, regardless of duplicates
                hasMore: mightHaveMore,
                loading: false
            });
        } catch (error) {
            console.error('Error loading more orders:', error);
            set({ loading: false });
        }
    },

    getOrdersByStatus: (statuses) => {
        const { orders } = get();
        if (!orders || orders.length === 0) return [];
        return orders.filter(order => statuses.includes(order.orderStatus));
    },

    resetOrders: () => {
        set({
            orders: [],
            lastVisible: null,
            hasMore: true,
            loading: false,
            error: null
        });
    }
}))

export default useOrdersStore