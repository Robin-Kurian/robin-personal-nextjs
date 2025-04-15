import React from "react";
import { Button } from "@heroui/react";
import { Card, CardBody } from "@heroui/react";
import Image from "next/image";
import useAuthStore from "@/hooks/useAuthStore";
import Loader from "@/components/common/Loader";

const Profile = () => {
  const { user, loading, isLoggedIn } = useAuthStore();

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "Never";

    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  return (
    <Card className="w-3/4 md:w-1/3 h-[60%] flex justify-center items-center m-auto py-6">
      {
        isLoggedIn && !loading ?
          <CardBody className="flex ">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-20 h-20 rounded-full overflow-hidden">
                <Image
                  src={user?.imageURL || user?.photoURL || "/images/user.png"}
                  alt="Profile picture"
                  fill
                  sizes="80px"
                  className="object-cover"
                  priority
                />
              </div>

              <div className="text-center">
                <h2 className="text-lg md:text-xl font-bold">{user?.name || "User Name"}</h2>
                <p className="text-gray-500">
                  {user?.email || "email@example.com"}
                </p>
                <span className="inline-block px-3 py-1 mt-2 text-sm bg-primary-100 text-primary-700 rounded-full">
                  {user?.role || "User"}
                </span>
              </div>

              <div className="w-full mt-4 space-y-2s flex flex-col justify-center items-center">
                <div className="flex justify-between p-2 bg-gray-50 rounded-md">
                  <span className=" text-gray-600">
                    Last login:{" "}
                    <span className="text-md md:text-xlfont-bold">
                      {formatDateTime(user?.lastLoginAt)}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </CardBody> : <Loader />
      }

    </Card>
  );
};

export default Profile;
