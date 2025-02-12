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
  const handleScrollToSection = (e, url) => {
    e.preventDefault();
    const sectionId = url.replace('#', '');
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <NextNavbar
      maxWidth="2xl"
      className="shadow-sm sticky top-0 z-50 backdrop-blur-sm bg-background/80"
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
              <a
                href={item.url}
                onClick={(e) => handleScrollToSection(e, item.url)}
                className="text-teal-500 hover:underline cursor-pointer transition-colors duration-300"
              >
                <div className="flex items-center gap-2">
                  <item.icon className="w-4 h-4" />
                  {item.title}
                </div>
              </a>
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
