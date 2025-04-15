import { toast } from "@/hooks/use-toast";
import { Image, Button, Chip } from "@heroui/react";
import CART_API from "@/utilities/api/cart.api";
import useCartStore from "@/hooks/useCartStore";
import React, { useEffect, useState } from "react";
import useAuthStore from "@/hooks/useAuthStore";
import Loader from "@/components/common/Loader";
import EmptyCart from "@/components/shop/EmptyCart";
import { useRouter } from "next/navigation";
import CONSTANTS, { DEFAULT_BUTTON_STYLES } from "@/utilities/constants";
import useCheckoutStore from "@/hooks/useCheckoutStore";
import QuantitySelector from "@/components/common/QuantitySelector";
import { Tooltip } from "@heroui/react";
import { Pointer } from "../ui/custom-pointer";
import { motion } from "framer-motion"
import { FaHandPointUp } from "react-icons/fa6";
import { GrInfo } from "react-icons/gr";
import { PiShoppingCartDuotone } from "react-icons/pi";

const Cart = () => {
  const { products, setProducts, fetchCart } = useCartStore();
  const { setSelectedProducts } = useCheckoutStore();
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, user, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [selectedProductsState, setSelectedProductsState] = useState({});
  const subTotal =
    Object.values(selectedProductsState).reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ).toFixed(2)

  // Fetch cart items
  useEffect(() => {
    const loadCart = async () => {
      await fetchCart();
      setLoading(false);
    };

    loadCart();
  }, [fetchCart]);

  // Simplified checkbox handler
  const handleCheckboxChange = (product) => {
    setSelectedProductsState((prev) => {
      const newState = { ...prev };
      if (newState[product.id]) {
        delete newState[product.id];
      } else {
        newState[product.id] = {
          id: product.id,
          name: product.name,
          price: product.price,
          imageURL: product.imageURL,
          description: product.description,
          mrp: product.mrp,
          freeDelivery: product.freeDelivery,
          deliveryFee: product.deliveryFee,
          quantity: product.quantity,
          variants: product.variants,
        };
      }
      return newState;
    });
  };

  // Handle checkout
  const handleCheckout = () => {
    if (isLoggedIn) {
      // Add amount validation
      if (subTotal < 1) {
        toast({
          variant: "destructive",
          title: "Invalid Order Amount",
          description: "Order amount must be at least ₹1"
        });
        return;
      }
      // Update Zustand store with selected products
      setSelectedProducts(selectedProductsState);
      // Redirect to checkout
      router.push("/checkout");
    }
  };

  // Check if any products are selected
  const isAnyProductSelected = Object.keys(selectedProductsState).length > 0;

  // Updated quantity handler to only update selected products
  const handleUpdateQuantity = async (cartItemId, currentQuantity, increment) => {
    try {
      const newQuantity = increment ? currentQuantity + 1 : currentQuantity - 1;

      if (newQuantity < 1) return;

      // Update products state
      setProducts(products.map(item =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      ));

      // Only update selectedProductsState if the product is selected
      if (selectedProductsState[cartItemId]) {
        setSelectedProductsState(prev => ({
          ...prev,
          [cartItemId]: {
            ...prev[cartItemId],
            quantity: newQuantity
          }
        }));
      }

      // Handle backend updates
      if (isLoggedIn && user?.uid) {
        await CART_API.updateProductQuantityInCart(cartItemId, newQuantity, user.uid);
      } else {
        const updatedProducts = products.map(item =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        );
        localStorage.setItem("cartItems", JSON.stringify(updatedProducts));
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error updating quantity", description: `Failed to update product quantity, ${error}` });
    }
  };

  // Handle remove item
  const handleRemoveItem = async (cartItemId) => {
    try {
      // Optimistically remove item from UI
      const previousProducts = [...products];
      setProducts(products.filter((item) => item.id !== cartItemId));

      if (isLoggedIn && user?.uid) {
        // If user is logged in, make the API call
        try {
          await CART_API.deleteProductFromCart(cartItemId, user.uid);
        } catch (error) {
          // If API call fails, revert the optimistic update
          setProducts(previousProducts);
          toast({ variant: "destructive", title: "Error deleting item", description: `Failed to remove item. Please try again.` });
        }
      } else {
        // If user is not logged in, update localStorage
        const updatedProducts = products.filter(
          (item) => item.id !== cartItemId
        );
        localStorage.setItem("cartItems", JSON.stringify(updatedProducts));
      }
    } catch (error) {
      console.error("Error in remove item:", error);
    }
  };

  if (loading || authLoading) return <Loader />;
  if (products && products.length == 0) return <EmptyCart isLoggedIn={!!user} />;

  return (
    <>
      {/* Top Section */}
      <div className="flex flex-row justify-between text-left">
        <div className="flex-grow mb-4">
          <div className="flex items-center">
            <motion.div className="flex items-center">
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 15,
                }}
                className="flex items-center gap-2"
              >
                <motion.span
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 15,
                    delay: 1
                  }}
                  className="text-md sm:text-lg text-gray-600 font-medium"
                >
                  Cart
                </motion.span>
                <motion.span
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 1,
                    type: "spring",
                    stiffness: 300,
                  }}
                >
                  <PiShoppingCartDuotone className="w-4 h-5 inline-block" />
                </motion.span>
              </motion.div>
            </motion.div>
          </div>
          <p className="text-[10px] sm:text-[12px] font-light text-gray-700">
            {products && products.length} items
          </p>
        </div>
        <div className="flex flex-col pt-1 mr-2 text-right">
          <p className="text-xs font-medium text-gray-700 border-b-1">
            Selected {Object.keys(selectedProductsState).length} {Object.keys(selectedProductsState).length > 1 ? "items" : "item"}
          </p>
          <p className="text-xs font-medium text-gray-700">
            Subtotal: {CONSTANTS.SYMBOLS.CURRENCY}{subTotal}
          </p>
          <p className="text-[10px] text-color-success-s50 font-normal">
            total savings: {CONSTANTS.SYMBOLS.CURRENCY}
            {Object.values(selectedProductsState).reduce(
              (total, item) => total + (item.mrp - item.price) * item.quantity,
              0
            ).toFixed(2)}
          </p>
        </div>
        {isLoggedIn ?
          <Tooltip hidden={isAnyProductSelected} content="Select products first" variant="shadow" color="foreground" delay={500} classNames={{
            base: [
              "before:bg-color-primary-p70",
            ],
            content: ["shadow-md", "text-black bg-color-primary-p90"],
          }}
            placement="bottom" showArrow={true}>
            <div className="pt-2">
              <Button
                size="md"
                color="success"
                variant={DEFAULT_BUTTON_STYLES?.variant}
                className={`${DEFAULT_BUTTON_STYLES?.classNames} rounded text-sm md:text-base font-medium mb-4 disabled:border-gray-500 disabled:text-gray-500 disabled:bg-gray-200  border-indigo-400 bg-indigo-50 text-indigo-400 hover:bg-indigo-400 hover:border-indigo-900 hover:text-white hover:font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
                onPress={handleCheckout}
                isDisabled={!isAnyProductSelected}
              >
                Buy Now!
              </Button>
            </div>
          </Tooltip> : <div >
            <Pointer>
              <motion.div
                animate={{ y: [0, -30, 0], scale: [0.8, 1, 0.8], rotate: [0, 5, -5, 0], }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <FaHandPointUp
                  size={30}
                  className="text-gray-600 "
                />
              </motion.div>
            </Pointer>
            <Chip color="warning" startContent={<GrInfo />} className="text-white px-2">
              Login first!
            </Chip>
          </div>
        }
      </div>

      {/* Cart Items Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
        {products.map((item) => (
          <div key={item.id} className={`flex flex-row justify-between p-2 md:p-3 border rounded-lg gap-2 md:gap-3`}>
            {/* Checkbox Section*/}
            <div className="flex items-start">
              <label className="relative inline-flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedProductsState[item.id] ? true : false}
                  onChange={() => handleCheckboxChange(item)}
                  className="sr-only"
                />
                <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-gray-300 rounded bg-white flex items-center justify-center transition-colors duration-200">
                  {selectedProductsState[item.id] && (
                    <svg
                      className="w-3 h-3 md:w-4 md:h-4 text-green-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      />
                    </svg>
                  )}
                </div>
              </label>
            </div>

            {/* Image Section */}
            <div className="flex-shrink-0">
              <Image
                src={item.imageURL}
                alt={item.name}
                width={140}
                height={140}
                className="object-cover rounded-md"
              />
              {/* Quantity Section */}
              <QuantitySelector
                quantity={item.quantity}
                onIncrease={() => handleUpdateQuantity(item.id, item.quantity, true)}
                onDecrease={() => handleUpdateQuantity(item.id, item.quantity, false)}
                onRemove={() => handleRemoveItem(item.id)}
                isRemovable={true}
              />
            </div>

            {/* Main Section (#2)*/}
            <div className="flex-grow">
              <h3 className="text-lg font-medium">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
              <div>
                <p className="text-sm font-medium text-green-600">
                  {CONSTANTS.SYMBOLS.CURRENCY} {((item.mrp - item.price) * item.quantity).toFixed(2)} saved!
                </p>
              </div>
              {/* Variant Section */}
              {item.variants && (
                <div className="text-sm flex gap-2 mt-1 flex-wrap">
                  {Object.entries(item.variants).map(([key, value]) => (
                    <Chip variant="shadow" color="primary" key={key} className="text-xs font-medium capitalize">
                      {`${value}`}
                    </Chip>
                  ))}
                </div>
              )}
              {/* Price Section */}
              <div className="flex mr-10 space-x-4">
                {item.mrp && item.mrp > item.price && (
                  <div className="flex flex-row items-baseline space-x-4">
                    <p className="text-sm text-gray-500 line-through">
                      {CONSTANTS.SYMBOLS.CURRENCY}{item.mrp.toFixed(2)}
                    </p>
                    <p className="text-lg font-semibold text-gray-500">
                      {CONSTANTS.SYMBOLS.CURRENCY}{item.price.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex text-2xl font-semibold text-gray-500">
                {CONSTANTS.SYMBOLS.CURRENCY}{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Cart;

