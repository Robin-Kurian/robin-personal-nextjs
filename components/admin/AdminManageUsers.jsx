"use client";

import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { getAuth, deleteUser } from "firebase/auth";
import AddEditUsers from "./AddEditUsers";
import Loader from "@/components/common/Loader";
import { Button } from "@heroui/react";
import CustomModal from "./CustomModal";
import { toast } from "@/hooks/use-toast";

const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({ variant: "destructive", title: "Failed to fetch users" });
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      setLoading(true);
      // Delete from Firestore
      await deleteDoc(doc(db, "users", userId));

      // Attempt to delete from Firebase Auth if possible
      try {
        const user = auth.currentUser;
        if (user && user.uid === userId) {
          await deleteUser(user);
        }
      } catch (authError) {
        console.error("Error deleting user from Auth:", authError);
        // Continue even if auth deletion fails
      }
      toast({ variant: "success", title: "User deleted successfully" });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({ variant: "destructive", title: "Failed to delete user" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddEdit = (user = null) => {
    setSelectedUser(user);
    setShowAddEditModal(true);
  };

  if (loading) return <Loader />;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">User List</h2>
        <Button
          color="primary"
          onPress={() => handleAddEdit()}
        >
          Add New User
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {user.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === "admin"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Button
                      color="primary"
                      variant="flat"
                      size="sm"
                      className="mr-2"
                      onPress={() => handleAddEdit(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      color="danger"
                      variant="flat"
                      size="sm"
                      onPress={() => handleDelete(user.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CustomModal
        isOpen={showAddEditModal}
        onClose={() => {
          setShowAddEditModal(false);
          setSelectedUser(null);
        }}
        title={selectedUser ? "Edit User" : "Add New User"}
        body={
          <AddEditUsers
            user={selectedUser}
            onClose={() => {
              setShowAddEditModal(false);
              setSelectedUser(null);
            }}
            onSuccess={() => {
              fetchUsers();
            }}
          />
        }
      />
    </div>
  );
};

export default AdminManageUsers;
