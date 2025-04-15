"use client";

import { Button } from "@heroui/react";
import { MdRefresh, MdHome } from "react-icons/md";
import Link from "next/link";

export default function Error({ error, reset }) {
  return (
    <div className="min-h-full flex flex-col items-center justify-center my-20">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-danger">Oops!</h1>
        <h2 className="text-2xl font-medium text-foreground">
          Something went wrong
        </h2>
        <p className="text-muted-foreground">
          {error?.message || "An unexpected error occurred"}
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            color="primary"
            variant="flat"
            onClick={() => reset()}
            startContent={<MdRefresh size={20} />}
          >
            Try Again
          </Button>
          <Button
            as={Link}
            href="/"
            color="default"
            variant="flat"
            startContent={<MdHome size={20} />}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
