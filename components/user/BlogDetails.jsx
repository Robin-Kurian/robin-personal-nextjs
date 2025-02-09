"use client";

import React from "react";
import { Image } from "@heroui/react";
import ContentWrapper from "@/components/common/layouts/ContentWrapper";
import { Button } from "@heroui/react";
import CONSTANTS from "@/utilities/constants";
import Loader from "@/components/common/Loader";

const BlogDetails = ({ blog }) => {
  // Demo data for missing fields
  const demoDescription =
    "This premium blog offers exceptional quality and versatility. Perfect for everyday use, it combines modern design with practical functionality. Made from high-quality materials, ensuring durability and long-lasting performance.";
  const demoPrice = "299.99";

  return (
    <>
      {!blog ? (
        <Loader />
      ) : blog && typeof blog === "object" && Object.keys(blog).length > 0 ? (
        <ContentWrapper className="sm:flex-row mx-auto pt-4 sm:py-8 gap-8 h-fit">
          <div className="w-full ">
            {/* Image Section */}
            <div className="w-full max-w-full sm:max-w-[98%] md:sticky md:top-24 mx-auto relative">
              <Image
                src={blog?.imageURL}
                alt={blog?.name}
                className="object-cover w-full h-full transition-transform duration-300"
                radius="lg"
                removeWrapper
              />
            </div>
          </div>

          {/* Blog Info Section */}
          <div className="flex flex-col space-y-4">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
              {blog?.name}
            </h1>

            <div className="border-b border-gray-200 pb-4">
              {blog?.price ? (
                <span className="text-3xl font-bold text-gray-900">
                  {CONSTANTS.SYMBOLS.CURRENCY}
                  {blog?.price}
                </span>
              ) : (
                CONSTANTS.PLACEHOLDER.CURRENCY
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">About this item</h3>
              <p className="text-gray-600 leading-relaxed">
                {blog?.description || demoDescription}
              </p>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Blog ID:</span>
              <span className="font-mono">{blog?.id}</span>
            </div>

            {/* Buy Section */}
            <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm sticky top-4">
              <div className="space-y-4">
                <div className="text-xl font-bold text-gray-900">
                  {blog?.price ? (
                    <span className="text-xl font-bold text-gray-900">
                      {CONSTANTS.SYMBOLS.CURRENCY}
                      {blog?.price}
                    </span>
                  ) : (
                    CONSTANTS.PLACEHOLDER.CURRENCY
                  )}
                </div>

                <div className="text-sm text-gray-500">
                  <span className="text-green-600 font-medium">In Stock</span>
                  <p className="mt-1">Free Delivery Available</p>
                </div>

                <div className="space-y-3">

                  <Button
                    size="lg"
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    variant="solid"
                    onPress={() => console.log("Buy Now pressed")}
                  >
                    Buy Now
                  </Button>
                </div>

                <div className="text-sm text-gray-500 pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <span>Secure transaction</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ContentWrapper>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-800">
            No blog details available
          </h2>
        </div>
      )}
    </>
  );
};

export default BlogDetails;
