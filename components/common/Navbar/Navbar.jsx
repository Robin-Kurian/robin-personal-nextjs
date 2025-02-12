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
import { useState, useEffect } from "react";
// import { SidebarTrigger } from "@/components/ui/sidebar";

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ABOUT_MENU_ITEMS.map(item => item.url.replace('#', ''));

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
            setActiveSection('#' + sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToSection = (e, url) => {
    e.preventDefault();
    const sectionId = url.replace('#', '');
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(url);
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
        <a href="#home"
          onClick={(e) => handleScrollToSection(e, "#home")}
          className="flex items-center"
        >
          <Image src="/r.ico" alt="logo" width={32} height={32} />
        </a>
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
                className={`
                  px-4 py-2 
                  rounded-full
                  ${activeSection === item.url
                    ? 'bg-background/30 border-primary/50 text-foreground shadow-md'
                    : 'bg-background/10 border-border/50 text-foreground/80'
                  }
                  backdrop-blur-md
                  border
                  hover:bg-background/20 
                  hover:scale-105
                  active:scale-95
                  transition-all duration-200
                  flex items-center gap-2
                  hover:text-foreground
                  shadow-sm hover:shadow-md
                `}
              >
                <item.icon className="w-4 h-4" />
                {item.title}
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
