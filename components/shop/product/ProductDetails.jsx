"use client";

import React, { useState, useEffect, useMemo } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import ContentWrapper from "@/components/common/layouts/ContentWrapper";
import Loader from "@/components/common/Loader";
import CONSTANTS from "@/utilities/constants";
import { Image, Button } from "@heroui/react";
import { toast } from "@/hooks/use-toast";
import useCartStore from "@/hooks/useCartStore";
import useCheckoutStore from "@/hooks/useCheckoutStore";
import { useRouter } from "next/navigation";
import useProductStore from "@/hooks/useProductStore";
import QuantitySelector from "@/components/common/QuantitySelector";
import useAuthStore from "@/hooks/useAuthStore";
import { Lens } from "@/components/ui/magic-lens";
import { FaInstagram, FaYoutube, FaFacebook, FaLink } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { IS_ON_MOBILE } from "@/utilities/functions";
import { MdOutlineShoppingCart } from "react-icons/md";

const ProductDetails = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState({});
  const { quantity, setQuantity } = useProductStore();
  const [variantData, setVariantData] = useState(null);
  const { addProduct } = useCartStore();
  const [loading, setLoading] = useState(false);
  const { setSelectedProducts } = useCheckoutStore();
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const isMobile = IS_ON_MOBILE();

  // Memoize product images to prevent unnecessary re-renders
  const productImages = useMemo(() => product?.ProductImages || [], [product?.ProductImages]);

  useEffect(() => {
    setQuantity(1);
  }, [product, setQuantity]);

  useEffect(() => {
    const fetchVariantData = async () => {
      if (!product.variants) return;

      try {
        const db = getFirestore();
        const variantDoc = await getDoc(doc(db, "variants", "productVariants"));
        if (variantDoc.exists()) {
          const data = variantDoc.data();
          const filteredVariants = Object.keys(product.variants).reduce((acc, key) => {
            if (data[key]) acc[key] = data[key];
            return acc;
          }, {});
          setVariantData(filteredVariants);
        }
      } catch (error) {
        console.error("Error fetching variant data:", error);
      }
    };

    fetchVariantData();
  }, [product.variants]);

  const handleVariantChange = (variantType, value) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantType]: value,
    }));
  };

  const handleAddToCart = async () => {
    const productToAdd = {
      ...product,
      variants: selectedVariants,
      quantity: quantity,
    };

    setLoading(true);

    try {
      await addProduct(productToAdd);
      const toastInstance = toast({
        duration: 40500,
        variant: "success",
        title:
          <span className="text-sm">
            <h3 className="inline text-base md:text-lg font-semibold text-green-500">{productToAdd.name} </h3>added to cart
          </span>,
        description:
          <Button
            size="sm"
            variant="shadow"
            color="default"
            startContent={<MdOutlineShoppingCart size={20} />}
            onPress={() => {
              toastInstance.dismiss();
              router.push("/cart");
            }}
          >Check cart now!</Button>,
        className: "bg-green-50"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add product to cart. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    const deliveryFee = product.freeDelivery ? 0 : product.deliveryFee;
    const productToBuy = {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      mrp: product.mrp,
      freeDelivery: product.freeDelivery,
      deliveryFee: deliveryFee,
      quantity: quantity,
      variants: selectedVariants,
      imageURL: product.imageURL,
    };

    // Add amount validation
    if (product.price * quantity < 1) {
      toast({
        variant: "destructive",
        title: "Invalid Order Amount",
        description: "Order amount must be at least ₹1"
      });
      return;
    }

    // Set only the current product as selected
    setSelectedProducts({ [product.id]: productToBuy });

    // Redirect to checkout
    router.push("/checkout");
  };

  const areVariantsSelected = useMemo(() => {
    if (variantData) {
      return Object.keys(variantData).every((variantType) => {
        return selectedVariants[variantType] !== undefined;
      });
    }
    return true; // If no variants, assume valid
  }, [variantData, selectedVariants]);

  const getSocialMediaIcon = (url) => {
    if (!url) return { icon: FaLink, color: "text-gray-600" };

    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('instagram.com')) {
      return {
        icon: FaInstagram,
        color: "text-pink-600",
        hoverColor: "group-hover:text-pink-700",
        title: "View on Instagram"
      };
    }
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
      return {
        icon: FaYoutube,
        color: "text-red-600",
        hoverColor: "group-hover:text-red-700",
        title: "View on YouTube"
      };
    }
    if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.com')) {
      return {
        icon: FaFacebook,
        color: "text-blue-600",
        hoverColor: "group-hover:text-blue-700",
        title: "View on Facebook"
      };
    }
    return {
      icon: FaLink,
      color: "text-gray-600",
      hoverColor: "group-hover:text-gray-800",
      title: "View source"
    };
  };

  return (
    <>
      {!product ? (
        <Loader />
      ) : (
        <ContentWrapper className="m-auto 2xl:pt-4">
          <div className="flex flex-col sm:flex-row gap-4 min-h-[50vh] sm:min-h-[70vh] mb-8">
            {/* Left Half: Image Preview */}
            <div className="flex flex-col sm:flex-row sm:w-[60%] gap-4 h-fit">
              <div className="relative w-full sm:w-[85%] aspect-square">
                <Lens className="w-full h-full">
                  <Image
                    src={productImages[selectedImage] || product.imageURL}
                    alt={product.name}
                    className="object-cover w-full h-full"
                    radius="lg"
                    removeWrapper
                    loading="eager"
                  />
                </Lens>
              </div>
              {/* Thumbnail Gallery */}
              {(productImages.length > 0 || product.socialMediaLink) && (
                <div className={`grid grid-cols-6 sm:grid-cols-1 gap-3 w-full sm:w-[15%] h-fit`}>
                  {productImages.map((img, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square rounded-2xl m-1 overflow-hidden ${selectedImage === idx ? 'ring-1 ring-warning' : ''}`}
                    >
                      <Image
                        src={img}
                        alt={`Product ${idx + 1}`}
                        className="object-cover w-full h-full"
                        removeWrapper
                        loading="lazy"
                      />
                    </button>
                  ))}
                  {product.socialMediaLink && (() => {
                    const { icon: Icon, color, hoverColor, title } = getSocialMediaIcon(product.socialMediaLink);
                    return (
                      <a
                        href={product.socialMediaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="aspect-square rounded-2xl m-1 overflow-hidden relative group"
                        title={title}
                      >
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
                        <div className="relative h-full w-full flex flex-col items-center justify-center gap-1">
                          <Icon className={`h-6 w-6 ${color} ${hoverColor} transition-colors`} />
                          {!isMobile && (
                            <div className="flex items-center gap-1 text-[10px] font-medium text-gray-600">
                              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                Visit
                              </span>
                              <FiExternalLink className="h-3 w-3 -translate-y-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            </div>
                          )}
                        </div>
                      </a>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Right Half: Info */}
            <div className="flex flex-col sm:w-[40%] h-full p-2 sm:p-4 sm:overflow-y-auto">
              <div className="flex flex-col gap-3">
                {/* Product Info Section */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product?.name}</h1>
                <p className="text-xl md:text-2xl text-gray-700">{product?.description}</p>
                <p className="text-sm text-gray-500">{product?.productCode}</p>

                {/* Pricing Section */}
                <div className="flex flex-col gap-1">
                  <p className="text-xl md:text-2xl font-bold text-gray-900">
                    {CONSTANTS.SYMBOLS.CURRENCY}{product.price.toFixed(2)}
                  </p>
                  {product.mrp && product.mrp > product.price && (
                    <div className="flex gap-2 items-center">
                      <p className="text-md text-gray-500 line-through">
                        {CONSTANTS.SYMBOLS.CURRENCY}{product.mrp.toFixed(2)}
                      </p>
                      <p className="text-md font-semibold text-green-700 bg-green-50 w-fit px-2 rounded-sm">
                        {CONSTANTS.SYMBOLS.CURRENCY} {(product.mrp - product.price).toFixed(2)} off!
                      </p>
                    </div>
                  )}
                </div>

                {/* Dynamic Variants Section */}
                {variantData && Object.keys(variantData).length > 0 && (
                  <div className="flex flex-col gap-3">
                    {Object.entries(variantData).map(([variantName, variant]) => (
                      <div key={variantName} className="flex flex-col gap-2">
                        <h3 className="text-sm font-medium text-gray-900 capitalize">{variantName}</h3>
                        <div className="flex flex-wrap gap-2">
                          {variant.type === "color" ? (
                            Object.entries(variant.values).filter(([colorName]) =>
                              product.variants[variantName]?.includes(colorName)
                            ).map(([colorName, hex]) => (
                              <button
                                key={colorName}
                                onClick={() => handleVariantChange(variantName, colorName)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md border ${selectedVariants[variantName] === colorName
                                  ? 'ring-2 ring-gray-900 border-gray-900'
                                  : 'border-gray-200 hover:border-gray-300'
                                  }`}
                              >
                                <span
                                  className="w-6 h-6 rounded-full border"
                                  style={{ backgroundColor: hex }}
                                />
                                <span className="text-sm capitalize">{colorName}</span>
                              </button>
                            ))
                          ) : (
                            variant.values.filter(value =>
                              product.variants[variantName]?.includes(value)
                            ).map((value) => (
                              <button
                                key={value}
                                onClick={() => handleVariantChange(variantName, value)}
                                className={`px-4 py-2 text-sm font-medium rounded-md ${selectedVariants[variantName] === value
                                  ? 'bg-gray-900 text-white'
                                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                  }`}
                              >
                                {value}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quantity Adjustment Section */}
                <div className="py-2">
                  <QuantitySelector
                    quantity={quantity}
                    onIncrease={() => setQuantity(quantity + 1)}
                    onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
                  />
                </div>
              </div>

              {/* Purchase Actions */}
              <div className="mt-auto pt-4 space-y-3">
                {/* Stock Status */}
                {product.isActive ? (
                  <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <p className="text-green-600 font-medium">In Stock</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-3 w-3">
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                      <p className="text-red-600 font-medium">Temporarily Out of Stock</p>
                    </div>
                    <p className="text-sm text-gray-600 pl-5">
                      Don't worry! This product will be back in stock soon. Stay tuned! 🧐
                    </p>
                  </div>
                )}

                {/* Delivery Information */}
                {product.isActive && (
                  <div>
                    {product.freeDelivery ? (
                      <p className="text-md font-medium text-green-600">Free Delivery (Across India)</p>
                    ) : product.deliveryFee > 0 ? (
                      <p className="text-md font-medium text-gray-900">
                        Delivery Fee: {CONSTANTS.SYMBOLS.CURRENCY}{product.deliveryFee}
                      </p>
                    ) : null}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    size="lg"
                    className="w-full bg-warning hover:bg-warning-400 transition-colors"
                    variant="solid"
                    color="warning"
                    onPress={handleAddToCart}
                    isDisabled={!areVariantsSelected || loading || !product.isActive}
                  >
                    {loading ? "Adding..." : "Add to Cart"}
                  </Button>
                  {isLoggedIn && (
                    <Button
                      size="lg"
                      className="w-full bg-orange-500 hover:bg-orange-600 transition-colors"
                      variant="solid"
                      onPress={handleBuyNow}
                      isDisabled={!areVariantsSelected || !product.isActive}
                    >
                      Buy Now
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Secure transaction</span>
                </div>
              </div>
            </div>
          </div>
        </ContentWrapper>
      )}
    </>
  );
};

export default React.memo(ProductDetails);
