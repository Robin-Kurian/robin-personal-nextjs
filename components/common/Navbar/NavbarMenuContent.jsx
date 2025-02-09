import { NavbarItem } from "@nextui-org/navbar";
import React from "react";
import Link from "next/link";
// TODO: use it for something else and remove.
const NavbarMenuContent = ({ isLoggedIn, handleLogout }) => {
  const isLoggedInItems = [
    { label: "Profile Settings", href: "/profile" },
    { label: "About", href: "/about" },
    { label: "Help & Feedback", href: "/help" },
    { label: "Logout", onClick: handleLogout },
  ];
  const renderMenuItems = (items) => {
    return items.map((item) => (
      <NavbarItem
        as={item.href ? Link : "button"}
        key={item.label}
        href={item?.href}
        onClick={item?.onClick}
      >
        {item.label}
      </NavbarItem>
    ));
  };
  return (
    <div className="w-full h-full flex flex-col bg-green-500">
      {isLoggedIn
        ? renderMenuItems(isLoggedInItems)
        : renderMenuItems(menuItems)}
    </div>
  );
};

export default NavbarMenuContent;
