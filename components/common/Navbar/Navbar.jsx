// components/Navbar.jsx
"use client";

import {
  Navbar as NextNavbar,
  NavbarContent,
  NavbarItem,
  Image,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@heroui/react";
import {RiMenu5Line} from "react-icons/ri"
import { ABOUT_MENU_ITEMS } from "@/utilities/constants";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useState, useEffect } from "react";

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

  const menuStyles = (isActive, additionalClasses = '') => `
    px-4 py-2 
    rounded-full
    ${isActive
      ? 'bg-background/30 border-primary/50 text-foreground shadow-md'
      : 'bg-background/10 border-border/50 text-foreground/80'
    }
    backdrop-blur-md
    border
    hover:bg-background/20 
    hover:scale-105
    active:scale-95
    active:bg-background/40
    transition-all duration-200
    flex items-center gap-2
    hover:text-foreground
    shadow-sm hover:shadow-md
    ${additionalClasses} // Append additional class names
  `;

  return (
    <NextNavbar
      maxWidth="2xl"
      className="shadow-sm sticky top-0 z-50 backdrop-blur-sm bg-background/80"
      classNames={{
        wrapper: "px-4",
      }}
    >
      {/* Left Section: Mobile Nav Menu, Logo */}
      <NavbarContent justify="start" className="flex gap-2">
        <Popover key={'backdrop'} backdrop="blur" offset={10} placement="bottom" >
          <PopoverTrigger className="sm:hidden">
          <Button isIconOnly radius="full" size="sm" className="text-foreground">
            <RiMenu5Line/>
          </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] h-[260px] flex gap-1">
            {ABOUT_MENU_ITEMS.map((item, index) => (
             <a
               href={item.url}
               key={item.title}
               onClick={(e) => handleScrollToSection(e, item.url)}
               className={menuStyles(activeSection === item.url, 'gap-1  w-full')}
             >
               <item.icon className="w-4 h-4" />
               {item.title}
             </a>
            ))}
          </PopoverContent>
        </Popover>

        <a href="#home"
          onClick={(e) => handleScrollToSection(e, "#home")}
          className="flex items-center"
        >
          <Image src="/r.ico" alt="logo" width={32} height={32} />
        </a>
      </NavbarContent>


      {/* Middle Section:  (DESKTOP ONLY) */}
      <NavbarContent className="hidden sm:flex gap-4 w-3/4" justify="center">
        <ul className="flex flex-row gap-4">
          {ABOUT_MENU_ITEMS.map((item) => (
            <li key={item.title}>
              <a
                href={item.url}
                onClick={(e) => handleScrollToSection(e, item.url)}
                className={menuStyles(activeSection === item.url, 'text-sm')}
              >
                <item.icon className="w-4 h-4" />
                {item.title}
              </a>
            </li>
          ))}
        </ul>
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
