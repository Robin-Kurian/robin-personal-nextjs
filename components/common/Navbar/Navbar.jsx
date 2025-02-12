// components/Navbar.jsx
"use client";

import Link from "next/link";
import {
  Navbar as NextNavbar,
  NavbarContent,
  NavbarItem,
  Image,
} from "@heroui/react";
import { ABOUT_MENU_ITEMS } from "@/utilities/constants";
import ThemeSwitcher from "@/components/ThemeSwitcher";
// import { SidebarTrigger } from "@/components/ui/sidebar";

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
        {/* <SidebarTrigger /> */}
        <Link href="/" className="flex items-center">
          <Image src="/r.ico" alt="logo" width={32} height={32} />
        </Link>
      </NavbarContent>

      {/* Middle Section: Search Bar and Delivery Address (DESKTOP ONLY) */}
      <NavbarContent className="hidden md:flex gap-4 w-2/3" justify="center">
        {/* <nav className="flexs flex-cols"> */}
        <ul className="flex flex-row gap-4">
          {ABOUT_MENU_ITEMS.map((item) => (
            <li key={item.title}>
              <Link
                href={item.url}
                className="text-teal-500 hover:underline "
              >
                <div className="flex items-center gap-2">
                  <item.icon />
                  {item.title}
                </div>
              </Link>
            </li>
          ))}
        </ul>
        {/* </nav>       */}
      </NavbarContent>

      {/* Right Section*/}
      <NavbarContent justify="end" className="flex gap-4">
        <ThemeSwitcher />
        {/* RightMenuGroup: Login, Menu Button */}
        <NavbarItem className="sm:flex">
          {/* <RightMenuGroup /> */}
        </NavbarItem>
      </NavbarContent>
    </NextNavbar>
  );
};

export default Navbar;
