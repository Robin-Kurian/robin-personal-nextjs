"use client";

import { useEffect, useState } from "react";
import useAuthStore from "@/hooks/useAuthStore";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";

const AdminManageUsers = () => {
  const { user } = useAuthStore();
  const [users, setUsers, loading] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }

    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, [user, router, setUsers]);

  if (loading) return <Loader />;

  return (
    <div className="p-4">
      <h2 className="text-xl mt-2 text-gray-600">Users List</h2>
      <table className="min-w-full mt-4 bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="border-b p-4 text-left text-gray-700">ID</th>
            <th className="border-b p-4 text-left text-gray-700">Name</th>
            <th className="border-b p-4 text-left text-gray-700">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-100">
              <td className="border-b p-4">{user.id}</td>
              <td className="border-b p-4">{user.name}</td>
              <td className="border-b p-4">{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminManageUsers;
