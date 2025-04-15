import React from "react";
import { Button } from "@heroui/react";
import Link from "next/link";
import Image from "next/image";
import { DEFAULT_BUTTON_STYLES } from "@/utilities/constants";

const EmptyCart = ({ className = "", isLoggedIn = false }) => {

  return (
    <div
      className={`flex flex-col items-center justify-center h-[calc(100vh-100px)] ${className}`}
    >
      <div className="mb-4">
        <Image
          src="/images/empty_cart.png"
          alt="Empty Cart"
          width={128}
          height={128}
          priority
        />
      </div>
      {isLoggedIn ? (
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-5">Oops! Cart empty??</h2>
          <Button
            as={Link}
            href="/"
            variant="shadow"
            className={`rounded-2xl hover:bg-color-primary-p90 hover:text-color-secondary-s05 text-md font-normal bg-slate-50`} >
            Add some products!
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-5">Oops! Missing Cart items?</h2>
          <Button
            as={Link}
            href="/login"
            variant="shadow"
            color={DEFAULT_BUTTON_STYLES?.color}
            className={`rounded-2xl hover:bg-color-primary-p90 hover:text-color-secondary-s05 text-md font-normal bg-slate-50 `}
          >
            Login & shop now!
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyCart;
