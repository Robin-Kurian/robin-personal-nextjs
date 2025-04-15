"use client";

import React, { useState, useEffect } from "react";
import { Button, Chip } from "@heroui/react";
import Address from "./Address";
import { useRouter } from "next/navigation";
import useAuthStore from "@/hooks/useAuthStore";
import { createOrder, verifyOrderPayment } from "@/utilities/cashfreeServerSideFunctions"
import { initiatePayment } from "@/utilities/cashfreeClientSideFunctions"
import { FIREBASE } from "@/utilities/functions";
import { getFirestore } from "firebase/firestore";
import useCheckoutStore from "@/hooks/useCheckoutStore";
import CART_API from "@/utilities/api/cart.api";
import { toast } from "@/hooks/use-toast";
import CONSTANTS from "@/utilities/constants";
import { ConfettiSideCannons } from "@/components/ui/confetti-sidecannons";

const Checkout = ({ products }) => {
  const router = useRouter();
  const [addressSaved, setAddressSaved] = useState(false);
  const [address, setAddress] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const { user } = useAuthStore();
  const db = getFirestore();
  const { clearSelectedProducts } = useCheckoutStore();
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [showFreeDeliveryMessage, setShowFreeDeliveryMessage] = useState(false);
  const [showOrderSuccessMessage, setShowOrderSuccessMessage] = useState(false);

  // Convert products object to an array
  const productsArray = Object.values(products);
  // Calculate total price
  const totalPrice = productsArray.reduce((total, item) => total + item.price * item.quantity, 0);
  useEffect(() => {
    const hasFreeDeliveryProduct = productsArray.some(product => (product.freeDelivery === true || product.deliveryFee === 0));
    const isEligibleForFreeDelivery = totalPrice >= 499;
    const maxDeliveryFee = Math.max(...productsArray.map(product => product.deliveryFee || 50));
    if (hasFreeDeliveryProduct || isEligibleForFreeDelivery) {
      setDeliveryFee(0);
      if (!showFreeDeliveryMessage) {
        setShowFreeDeliveryMessage(true);
        const timer = setTimeout(() => setShowFreeDeliveryMessage(false), 3000); // Hide message after 3 seconds
        return () => clearTimeout(timer); // Cleanup timer on unmount
      }
    } else {
      setDeliveryFee(maxDeliveryFee);
    }
  }, [productsArray, totalPrice, showFreeDeliveryMessage]); // Dependencies for useEffect

  const finalPrice = totalPrice - discount + deliveryFee;

  const handleAddressSaved = (newAddress) => {
    setAddress(newAddress);
    setAddressSaved(true);
  };

  const handlePlaceOrder = async () => {
    if (!addressSaved) {
      toast({ variant: "warning", title: "Please save your address before proceeding." });
      return;
    }

    setPaymentProcessing(true);

    try {
      // 1. Create Cashfree Order
      const returnUrl = window.location.origin + "/orders";
      const cashfreeOrderRequest = {
        order_amount: finalPrice.toFixed(2),
        order_currency: "INR",
        order_id: `OID_${new Date().getTime()}`,
        customer_details: {
          customer_id: user?.uid,
          customer_name: `${address.firstName} ${address.lastName}`,
          customer_phone: address?.phone,
          customer_email: address?.email,
        },
        order_meta: {
          return_url: returnUrl,
        }
      };

      const orderResponse = await createOrder(cashfreeOrderRequest);

      if (!orderResponse?.cf_order_id || !orderResponse?.payment_session_id || orderResponse?.error) {
        toast({
          variant: "destructive",
          title: "Order Creation Failed",
          description: orderResponse?.message || "Unable to initialize payment. Please try again."
        });
        router.refresh();
        return;
      }

      // 2. Initiate Payment
      const paymentResponse = await initiatePayment(orderResponse.payment_session_id);
      // Handle different payment states
      switch (paymentResponse.status) {
        case 'REDIRECT':
          // User needs to complete payment in redirect window
          toast({
            variant: "warning",
            title: "Complete Your Payment",
            description: "Please complete the payment in the opened window."
          });
          return;

        case 'ERROR':
          // Handle specific error cases
          if (paymentResponse.code === "payment_aborted") {
            toast({
              variant: "warning",
              title: "Payment Cancelled",
              description: "You cancelled the payment. Please try again when ready.",
              className: "bg-yellow-50"
            });
          } else if (paymentResponse.code === "network_error") {
            toast({
              variant: "destructive",
              title: "Network Error",
              description: "Please check your internet connection and try again.",
              className: "bg-red-50"

            });
          } else {
            toast({
              variant: "destructive",
              title: "Payment Error",
              description: paymentResponse.message?.message || "Payment failed. Please try again.",
              className: "bg-red-50"

            });
          }
          router.refresh();
          return;

        case 'COMPLETED':
          break;

        default:
          toast({
            variant: "destructive",
            title: "Payment Failed",
            description: "Unexpected payment status. Please check your orders page or try again.",
            className: "bg-red-50"
          });
          router.push('/orders');
          return;
      }

      // 3. Verify Payment
      const orderPaymentDetails = await verifyOrderPayment(orderResponse.order_id);
      if (!orderPaymentDetails || orderPaymentDetails instanceof Error || orderPaymentDetails.error) {
        toast({
          variant: "warning",
          title: "Payment Status Unclear",
          description: "We couldn't verify your payment status right now. Please check your orders page for updates."
        });
        router.push('/orders');
        return;
      }

      // Check all possible payment statuses
      const paymentStatus = orderPaymentDetails[0]?.payment_status;

      switch (paymentStatus) {
        case 'SUCCESS':
          // Show confetti and redirect immediately
          setShowOrderSuccessMessage(true);
          router.replace('/orders');

          // Save order in background
          saveOrderToFirebase(orderResponse, orderPaymentDetails);
          break;

        case 'PENDING':
          toast({
            variant: "warning",
            title: "Payment Processing",
            description: "Your payment is being processed. Please check orders page for updates.",
            className: "bg-yellow-50"
          });
          router.push('/orders');
          return;

        case 'FAILED':
          toast({
            variant: "destructive",
            title: "Payment Failed",
            description: "Your payment was unsuccessful. Please try again."
          });
          router.refresh();
          return;

        case 'CANCELLED':
          toast({
            variant: "warning",
            title: "Payment Cancelled",
            description: "Your payment was cancelled. Please try again when ready.",
            className: "bg-yellow-50"
          });
          router.refresh();
          return;

        default:
          toast({
            variant: "warning",
            title: "Unknown Payment Status",
            description: "Please check your orders page for the latest status."
          });
          router.push('/orders');
          return;
      }

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Checkout Error",
        description: "An unexpected error occurred. Please check your orders page or try again."
      });
      router.push('/orders');
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Helper function to save order to Firebase
  const saveOrderToFirebase = async (orderResponse, orderPaymentDetails) => {
    const orderToSave = {
      orderId: orderResponse.order_id,
      userId: orderResponse.customer_details.customer_id,
      selectedProducts: productsArray.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        deliveryFee: product.deliveryFee || 0,
        variants: product.variants || {},
        subtotal: product.price * product.quantity
      })),
      orderSummary: {
        subtotal: totalPrice,
        discount: discount,
        deliveryFee: deliveryFee,
        finalAmount: finalPrice
      },
      deliveryAddress: address,
      orderStatus: 'Paid',
      trackingId: orderResponse.order_id,
      paymentStatus: 'SUCCESS',
      paymentDetails: {
        ...orderPaymentDetails[0],
        lastPaymentAttempt: new Date().toISOString()
      },
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      platform: 'web',
      currency: 'INR'
    };

    const maxRetries = 3;
    let attempts = 0;

    while (attempts < maxRetries) {
      try {
        const saveResponse = await FIREBASE.POST_DATA(db, "orders", orderToSave);
        if (!saveResponse.error && saveResponse.message === 'Data added Successfully') {
          // Clear cart and selected products in background
          Promise.all([
            clearSelectedProducts(),
            clearCart(productsArray, user?.uid)
          ]).catch(console.error);
          break;
        }
        throw new Error('Failed to save order data');
      } catch (error) {
        attempts++;
        toast({
          variant: "destructive",
          title: "Checkout Error",
          description: `Order attempt ${attempts} failed. Please contact support if a payment was processed.`
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  const clearCart = async (products, userId) => {
    try {
      const cartResponse = await CART_API.getProductsInCart(userId);
      const cartItems = cartResponse.data;

      for (const product of products) {
        const matchingCartItem = cartItems.find(cartItem =>
          cartItem.id === product.id &&
          JSON.stringify(cartItem.variants) === JSON.stringify(product.variants)
        );

        if (matchingCartItem) {
          await CART_API.deleteProductFromCart(matchingCartItem.id, userId);
        }
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error clearing cart" });
    }
  };


  return (
    <>
      {showOrderSuccessMessage && (
        <ConfettiSideCannons
          message="Order placed successfully! 🎉"
          duration={300}
          messageDuration={3000}
          position="top"
          confettiColors={["#4CAF50", "#8BC34A", "#CDDC39"]}
          messageBgColor="bg-green-500"
        />
      )}
      {showFreeDeliveryMessage && (
        <ConfettiSideCannons
          message="Yay! Free delivery!"
          duration={300}
          position="top"
          confettiColors={["#13b801"]}
        />
      )}
      <div className="bg-white border rounded mb-6 p-1">
        <Address onAddressSaved={handleAddressSaved} setAddress={setAddress} deliveryAddress={address} />
      </div>
      <div className="bg-white rounded mb-6">
        <h3 className="text-md sm:text-lg font-medium text-gray-800 mb-4">Order Summary</h3>
        <div className="gap-2 border-t-2 border-gray-100 ">
          {productsArray.map((product) => (
            <div key={`product-${product.id}`} className={`flex flex-row justify-between p-1 md:p-3 rounded-lg gap-2 md:gap-6 border-b border-gray-100 mt-2`}
            // onClick={() => router.push(`/products/${product?.id}`)}
            >
              {/* Section 1 Image*/}
              <div className="flex">
                <img src={product.imageURL} alt={product.name} className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-md border border-gray-300 shadow-sm" />
              </div>
              {/* Section 2 Name,description*/}
              <div className="w-1/3 flex-grow">
                <h3 className="font-semibold text-gray-900 text-md sm:text-lg">{product.name}</h3>
                <p className="text-sm sm:text-md text-gray-600 truncate">{product.description}</p>
                {/* Section 3 Variants  */}
                {product.variants && (
                  <div className="text-sm flex gap-2 mt-1 flex-auto">
                    {Object.entries(product.variants).map(([key, value]) => (
                      <Chip size="sm" variant="shadow" color="secondary" key={key} className="text-[10px] sm:text[12px] font-medium capitalize">
                        {`${value}`}
                      </Chip>
                    ))}
                  </div>
                )}
              </div>
              {/* Section 4: Price and deductions */}
              <div className="flex-grow flex flex-col justify-end text-pretty">
                {product.mrp && product.mrp > product.price && (
                  <div className="products-baseline">
                    <p className="text-sm sm:text-md text-gray-500 line-through">
                      {CONSTANTS.SYMBOLS.CURRENCY}{product.mrp.toFixed(2)} x {product.quantity}
                    </p>
                    <p className="text-md sm:text-lg font-semibold text-gray-500">
                      {CONSTANTS.SYMBOLS.CURRENCY}{product.price.toFixed(2)} x {product.quantity}
                    </p>
                    <p className="text-[11px] sm:text-md font-medium text-green-600">
                      {CONSTANTS.SYMBOLS.CURRENCY} {((product.mrp - product.price) * product.quantity).toFixed(2)} saved!
                    </p>
                  </div>
                )}
              </div>

              {/* Section 5: Subtotal */}
              <div className="flex text-md  items-end sm:text-2xl font-semibold text-gray-500">
                {CONSTANTS.SYMBOLS.CURRENCY}{(product.price * product.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        <div className="py-6 border-gray-100 border-b-2">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-800">₹{totalPrice.toFixed(2)}</span>
          </div>
          {/* Taxes */}
          {/* <div className="flex justify-between mb-2">
            <span className="text-gray-600">Taxes</span>
            <span className="text-green-600">₹{discount.toFixed(2)}</span>
          </div> */}
          {/* Delivery Charges */}
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Delivery charge</span>
            <span className={deliveryFee === 0 ? "text-green-600" : "text-red-600"}>
              {deliveryFee === 0 ? "Free" : `+ ₹${deliveryFee.toFixed(2)}`}
            </span>
          </div>
          {/* Promotions */}
          {/* {discount > 0 && ( */}
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Coupons & Promotions</span>
            <span className="text-green-600">-₹{discount.toFixed(2)}</span>
          </div>
          {/* )} */}
          {/* Total */}
          <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
            <span className="text-lg font-semibold text-gray-800">Total</span>
            <span className="text-lg font-semibold text-gray-800">₹{finalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="h-1/3 flex justify-center">
        <Button
          onPress={handlePlaceOrder}
          color="success"
          radius="full"
          isDisabled={paymentProcessing}
          className="w-full h-full sm:w-1/3 py-3 text-base font-medium rounded-lgs transition-all"
        >
          {paymentProcessing ? "Processing..." : `Proceed to pay`}
        </Button>
      </div>
    </>
  );
};


export default Checkout