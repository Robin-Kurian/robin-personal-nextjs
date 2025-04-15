"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { MdHome } from "react-icons/md";
import React, { Suspense } from "react";
import Loader from "@/components/common/Loader";

const NotFound = () => {
  return (
    <Suspense fallback={<Loader />}>
      <div className="min-h-full flex flex-col items-center justify-center my-20">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
          <Button
            as={Link}
            href="/"
            color="primary"
            variant="flat"
            startContent={<MdHome size={20} />}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </Suspense>
  );
};

export default NotFound;
