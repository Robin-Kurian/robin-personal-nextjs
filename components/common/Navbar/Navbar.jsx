// components/Navbar.jsx
"use client";

import Link from "next/link";
import { Navbar as NextNavbar, NavbarContent, NavbarItem } from "@heroui/react";
import RightMenuGroup from "./RightMenuGroup";
import ThemeSwitcher from "@/components/ThemeSwitcher";
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
      <NavbarContent justify="start">
        <Link href="/" className="flex items-center gap-1">
          <span className="text-lg font-bold">Robin's Portfolio</span>
        </Link>
      </NavbarContent>

      {/* Middle Section: Search Bar and Delivery Address (DESKTOP ONLY) */}
      <NavbarContent className="hidden lg:flex gap-4 w-1/3" justify="center">
        {/* <NavSearchBar /> */}
      </NavbarContent>

      {/* Right Section*/}
      <NavbarContent justify="end" className="flex gap-4">
        {/* RightMenuGroup: Login, Menu Button */}
        <ThemeSwitcher />

        <NavbarItem className="sm:flex">
          <RightMenuGroup />
        </NavbarItem>
      </NavbarContent>
    </NextNavbar>
  );
};

export default Navbar;
