import Image from "next/image";
import React from "react";

const NavbarLogo = ({ title }) => {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/logo-temp.svg"
        alt="Logo"
        className="rounded-xl"
        width={135}
        height={40}
        priority
      />
      {/* <span className="font-bold text-inherit mr-2 text-color-primary-p40">{title}</span> */}
    </div>
  );
};

export default NavbarLogo;
