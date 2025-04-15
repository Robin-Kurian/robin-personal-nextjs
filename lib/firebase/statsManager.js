import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
const STATS_DOC_ID = 'main_stats';

export class DashboardStatsManager {
    constructor() {
        this.statsDoc = doc(db, 'dashboard_stats', STATS_DOC_ID);
        this.unsubscribe = null;
    }

    // Subscribe to real-time updates
    subscribeToStats(callback) {
        if (this.unsubscribe) {
            this.unsubscribe();
        }

        this.unsubscribe = onSnapshot(this.statsDoc, (doc) => {
            if (doc.exists()) {
                callback({
                    ...doc.data(),
                    lastUpdated: doc.data().lastUpdated?.toDate() || new Date(),
                });
            } else {
                // Initialize with default values if no stats exist
                this.updateStats({
                    totalSales: 0,
                    activeProducts: 0,
                    pendingOrders: 0,
                    totalUsers: 0,
                    lastUpdated: new Date(),
                });
            }
        }, (error) => {
            console.error('Error subscribing to stats:', error);
        });

        return () => {
            if (this.unsubscribe) {
                this.unsubscribe();
            }
        };
    }

    // Calculate total sales and month-over-month change
    async calculateTotalSales() {
        try {
            // Fetch all orders directly from Firestore
            const ordersRef = collection(db, 'orders');
            const ordersSnapshot = await getDocs(ordersRef);
            const orders = ordersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Calculate totals from successful payments
            const currentMonthTotal = orders.reduce((sum, order) => {
                if (order.paymentDetails?.payment_status === 'SUCCESS' && order.orderStatus === 'Delivered') {
                    return sum + (order.paymentDetails?.order_amount || 0);
                }
                return sum;
            }, 0);

            // You can implement similar logic for last month if needed
            // For now, let's just return the current month total
            return {
                total: currentMonthTotal,
                change: 0 // Placeholder for change calculation
            };
        } catch (error) {
            console.error('Error calculating sales:', error);
            return { total: 0, change: 0 };
        }
    }

    // Count active products and change from last month
    async countActiveProducts() {
        try {
            const productsRef = collection(db, 'products');
            const activeProductsQuery = query(
                productsRef,
                where('isActive', '==', true)
            );

            const snapshot = await getDocs(activeProductsQuery);
            const currentCount = snapshot.size;

            // Get the previous count from the stats document
            const statsDoc = await getDoc(this.statsDoc);
            const previousCount = statsDoc.exists() ? (statsDoc.data().activeProducts || 0) : 0;

            const change = currentCount - previousCount;

            return {
                count: currentCount,
                change
            };
        } catch (error) {
            console.error('Error counting products:', error);
            return { count: 0, change: 0 };
        }
    }

    // Count pending orders
    async countPendingOrders() {
        try {
            const ordersRef = collection(db, 'orders');
            const pendingOrdersQuery = query(
                ordersRef,
                where('orderStatus', 'in', ['Pending', 'Processing'])
            );

            const snapshot = await getDocs(pendingOrdersQuery);
            return { count: snapshot.size };
        } catch (error) {
            console.error('Error counting pending orders:', error);
            return { count: 0 };
        }
    }

    // Count total users and change from last month
    async countTotalUsers() {
        try {
            const usersRef = collection(db, 'users');

            // Get current month's new users
            const currentDate = new Date();
            const firstDayCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

            const [totalUsersSnapshot, newUsersSnapshot] = await Promise.all([
                getDocs(collection(db, 'users')),
                getDocs(query(
                    usersRef,
                    where('createdAt', '>=', firstDayCurrentMonth)
                ))
            ]);

            return {
                count: totalUsersSnapshot.size,
                change: newUsersSnapshot.size // Number of new users this month
            };
        } catch (error) {
            console.error('Error counting users:', error);
            return { count: 0, change: 0 };
        }
    }

    // Manually refresh all stats
    async refreshStats() {
        try {
            // Get counts from respective collections
            const [
                salesData,
                productsData,
                ordersData,
                usersData
            ] = await Promise.all([
                this.calculateTotalSales(),
                this.countActiveProducts(),
                this.countPendingOrders(),
                this.countTotalUsers()
            ]);

            const newStats = {
                totalSales: salesData.total,
                salesChange: salesData.change,
                activeProducts: productsData.count,
                productsChange: productsData.change,
                pendingOrders: ordersData.count,
                totalUsers: usersData.count,
                usersChange: usersData.change,
                lastUpdated: new Date(),
            };

            await this.updateStats(newStats);
            return newStats;
        } catch (error) {
            console.error('Error refreshing stats:', error);
            throw error;
        }
    }

    async updateStats(stats) {
        try {
            await setDoc(this.statsDoc, stats);
        } catch (error) {
            console.error('Error updating stats:', error);
            throw error;
        }
    }
}

export const dashboardStats = new DashboardStatsManager(); 