// "use client";

// import React, { useEffect } from "react";
import AdminManageUsers from "./AdminManageUsers";
// import { useRouter } from "next/navigation";
// import useAuthStore from "@/hooks/useAuthStore";

const AdminDashboard = () => {
  // const { user, loading } = useAuthStore();
  // const router = useRouter();

  // useEffect(() => {
  //   // Redirect if the user is not an admin
  //   if (!user || user?.role !== "admin") {
  //     router.push("/");
  //     return;
  //   }
  // }, [user, router]);

  // if (loading) return <Loader />;

  return (
    <div className="admin-dashboard">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <AdminManageUsers />
    </div>
  );
};

export default AdminDashboard;
