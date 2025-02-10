// components/Navbar.jsx
"use client";

import Link from "next/link";
import {
  Navbar as NextNavbar,
  NavbarContent,
  NavbarItem,
  Image,
} from "@heroui/react";
import RightMenuGroup from "./RightMenuGroup";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Navbar = () => {
  return (
    <NextNavbar
      maxWidth="2xl"
      className="shadow-sm"
      classNames={{
        // base: "bg-white/50",
        wrapper: "px-4",
      }}
    >
      {/* Left Section: Shop Logo */}
      <NavbarContent justify="start" className="flex gap-2">
        <SidebarTrigger />
        <Link href="/" className="flex items-center">
          <Image src="/r.ico" alt="logo" width={32} height={32} />
        </Link>
      </NavbarContent>

      {/* Middle Section: Search Bar and Delivery Address (DESKTOP ONLY) */}
      <NavbarContent className="hidden lg:flex gap-4 w-1/3" justify="center">
        {/* <NavSearchBar /> */}
      </NavbarContent>

      {/* Right Section*/}
      <NavbarContent justify="end" className="flex gap-4">
        <ThemeSwitcher />
        {/* RightMenuGroup: Login, Menu Button */}
        <NavbarItem className="sm:flex">
          <RightMenuGroup />
        </NavbarItem>
      </NavbarContent>
    </NextNavbar>
  );
};

export default Navbar;
