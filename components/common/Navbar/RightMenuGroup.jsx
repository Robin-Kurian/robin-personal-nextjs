import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@heroui/react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import React from "react";
import useAuthStore from "@/hooks/useAuthStore";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";

const RightMenuGroup = () => {
  const { user, setUser, loading, isLoggedIn, isAdmin } = useAuthStore();
  const router = useRouter();
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    router.push("/");
  };
  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div className="flex items-center gap-2">
      {/* TODO: Remove this badge */}
      {/* <Badge
        {...(isAdmin && { onClick: () => router.push("/admin") })}
        className="my-6 bg-color-primary-p90/35 text-color-secondary-s05 hover:bg-color-primary-p90 cursor-pointer"
      >
        {isLoggedIn ? (isAdmin ? "Admin" : "User") : "Guest"}
      </Badge> */}

      {/* Dropdown for Login/Logout */}
      {isLoggedIn ? (
        <Dropdown>
          <DropdownTrigger>
            <Button
              fullWidth
              className="bg-color-primary-p90/65 text-color-secondary-s30 hover:bg-color-primary-p80 hover:text-color-secondary-s05"
            >
              {user?.name}
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="User Actions">
            <DropdownItem key="profile" as={Link} href="/profile">
              Profile
            </DropdownItem>
            <DropdownItem key="logout" onClick={handleLogout}>
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ) : (
        <Button
          onPress={handleLogin}
          className="bg-color-primary-p90/65 text-color-secondary-s30 hover:bg-color-primary-p80 hover:text-color-secondary-s05"
        >
          Login
        </Button>
      )}
    </div>
  );
};

export default RightMenuGroup;
