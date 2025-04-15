"use client";

import React, { useEffect, useState } from "react";
import AdminManageUsers from "./AdminManageUsers";
import { useRouter } from "next/navigation";
import useAuthStore from "@/hooks/useAuthStore";
import Loader from "@/components/common/Loader";
import ContentWrapper from "@/components/common/layouts/ContentWrapper";
import AdminManageProducts from "@/components/admin/AdminManageProducts";
import CustomModal from "@/components/admin/CustomModal";
import AddEditCarousel from "@/components/admin/AddEditCarousel";
import AdminManageOffers from "@/components/admin/AdminManageOffers";
import AdminManageCategories from "@/components/admin/AdminManageCategories";
import { MediaManager } from "@/components/common/MediaManager";
import { Card, Chip, Button } from "@heroui/react";
import {
  MdOutlineShoppingCart, MdCategory, MdLocalOffer, MdPeople,
  MdSettings, MdImage, MdInventory2, MdViewCarousel,
  MdRefresh
} from "react-icons/md";
import { IoTrendingUp, IoTrendingDown } from "react-icons/io5";
import { dashboardStats } from "@/lib/firebase/statsManager";
import { toast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { user, loading } = useAuthStore();
  const router = useRouter();
  const [activeModal, setActiveModal] = useState(null);
  const [stats, setStats] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user?.role !== "admin")) {
      router.push("/");
      return;
    }

    // Subscribe to stats updates
    const unsubscribe = dashboardStats.subscribeToStats((newStats) => {
      setStats(newStats);
    });

    return () => unsubscribe();
  }, [user, router, loading]);

  const handleRefreshStats = async () => {
    setIsRefreshing(true);
    try {
      await dashboardStats.refreshStats();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error refreshing stats!",
        description: error?.message || "Try again later.",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatCards = () => [
    {
      title: "Total Sales",
      value: formatCurrency(stats?.totalSales || 0),
      change: stats?.salesChange ? `${stats.salesChange > 0 ? '+' : ''}${stats.salesChange}%` : undefined,
      trending: stats?.salesChange > 0 ? "up" : stats?.salesChange < 0 ? "down" : "neutral"
    },
    {
      title: "Active Products",
      value: stats?.activeProducts?.toString() || "0",
      change: stats?.productsChange ? `${stats.productsChange > 0 ? '+' : ''}${stats.productsChange}` : undefined,
      trending: stats?.productsChange > 0 ? "up" : stats?.productsChange < 0 ? "down" : "neutral"
    },
    {
      title: "Pending Orders",
      value: stats?.pendingOrders?.toString() || "0",
      trending: "neutral"
    },
    {
      title: "Total Users",
      value: stats?.totalUsers?.toString() || "0",
      change: stats?.usersChange ? `${stats.usersChange > 0 ? '+' : ''}${stats.usersChange}` : undefined,
      trending: stats?.usersChange > 0 ? "up" : stats?.usersChange < 0 ? "down" : "neutral"
    }
  ];

  const dashboardOptions = [
    {
      id: 'carousel',
      title: 'Carousel',
      description: 'Manage homepage banners',
      icon: MdViewCarousel,
      component: <AddEditCarousel />,
      color: 'bg-purple-500'
    },
    {
      id: 'categories',
      title: 'Categories',
      description: 'Organize product categories',
      icon: MdCategory,
      component: <AdminManageCategories onClose={() => setActiveModal(null)} />,
      color: 'bg-blue-500'
    },
    {
      id: 'offers',
      title: 'Offers',
      description: 'Manage special deals',
      icon: MdLocalOffer,
      component: <AdminManageOffers />,
      color: 'bg-green-500'
    },
    {
      id: 'orders',
      title: 'Orders',
      description: 'Manage customers\' orders',
      icon: MdOutlineShoppingCart,
      component: <div>Orders Management Coming Soon</div>,
      color: 'bg-amber-500'
    },
    {
      id: 'products',
      title: 'Products',
      description: 'Manage products & inventory',
      icon: MdInventory2,
      component: <AdminManageProducts />,
      color: 'bg-pink-500'
    },
    {
      id: 'media',
      title: 'Media Library',
      description: 'Manage images and media files',
      icon: MdImage,
      component: <MediaManager />,
      color: 'bg-cyan-500'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Configure store settings',
      icon: MdSettings,
      component: <div>Settings Panel Coming Soon</div>,
      color: 'bg-gray-500'
    },
    {
      id: 'users',
      title: 'Users',
      description: 'Manage customers',
      icon: MdPeople,
      component: <AdminManageUsers />,
      color: 'bg-indigo-500'
    }
  ];

  if (loading) return <Loader />;

  const renderTrendingIcon = (trending) => {
    if (trending === 'up') return <IoTrendingUp className="text-green-500" />;
    if (trending === 'down') return <IoTrendingDown className="text-red-500" />;
    return null;
  };

  return (
    <ContentWrapper className="bg-gray-50 p-4 h-[calc(100vh-120px)] overflow-y-auto">
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className=" text-xl font-bold">Overview</h1>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              radius="lg"
              isIconOnly
              color="primary"
              variant="flat"
              isLoading={isRefreshing}
              onPress={handleRefreshStats}
              className="p-0"
            >
              <MdRefresh className="w-4 h-4" />
            </Button>
            <Chip
              size="lg"
              radius="lg"
              color="success"
              variant="flat"
              className="text-xs"
            >
              Store Online
            </Chip>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {getStatCards().map((stat, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
                {renderTrendingIcon(stat.trending)}
              </div>
              {stat.change && (
                <p className={`text-sm mt-2 ${stat.trending === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change} from last month
                </p>
              )}
              {stats?.lastUpdated && (
                <p className="text-xs text-gray-400 mt-2">
                  Updated on: {new Date(stats.lastUpdated).toLocaleString()}
                </p>
              )}
            </Card>
          ))}
        </div>

        <h1 className="text-xl font-bold">Shop Management</h1>
        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {dashboardOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Card
                key={option.id}
                isPressable
                onPress={() => {
                  if (option.id === 'orders') {
                    window.open('/protected/admin/orders');
                  } else {
                    setActiveModal(option.id);
                  }
                }}
                className="p-4 hover:scale-[1.02] transition-transform"
              >
                <div className="flex gap-4">
                  <div className={`p-3 rounded-lg self-center ${option.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-full  mr-6">
                    <h2 className="font-semibold">{option.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <CustomModal
        isOpen={!!activeModal}
        size="3xl"
        contentClassName="max-h-[50vh] sm:max-h-[80vh]"
        onClose={() => setActiveModal(null)}
        bodyClassName="overflow-y-auto"
        title={dashboardOptions.find(opt => opt.id === activeModal)?.title}
        body={dashboardOptions.find(opt => opt.id === activeModal)?.component}
      />
    </ContentWrapper>
  );
};

export default AdminDashboard;
