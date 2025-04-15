import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function addProductToCart(product, userId) {
  try {
    const cartRef = collection(db, "cart");
    const productRef = doc(db, "products", product.id);

    // Check if product already exists in cart with the same variants
    const q = query(
      cartRef,
      where("userId", "==", userId),
      where("productRef", "==", productRef),
      where("variants", "==", product.variants) // Check for matching variants
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Product exists with the same variants, update quantity
      const existingCartItem = querySnapshot.docs[0];
      const currentQuantity = existingCartItem.data().quantity;
      await updateDoc(existingCartItem.ref, {
        quantity: currentQuantity + (product.quantity || 1),
      });
    } else {
      // Product doesn't exist, add new item with product details
      const cartItem = {
        userId: userId,
        productRef: productRef,
        quantity: product.quantity || 1,
        addedAt: serverTimestamp(),
        productName: product.name,
        productDescription: product.description,
        productPrice: product.price,
        freeDelivery: product.freeDelivery,
        deliveryFee: product.deliveryFee || 0,
        productImageURL: product.imageURL,
        productMrp: product?.mrp,
        variants: product.variants,
      };
      await addDoc(cartRef, cartItem);
    }

    return { message: "Product added to cart successfully" };
  } catch (error) {
    console.error("Error adding product to cart:", error);
    throw new Error("Failed to add product to cart");
  }
}

const getProductsInCart = async (userId) => {
  try {
    const cartRef = collection(db, "cart");
    const cartSnapshot = await getDocs(
      query(cartRef, where("userId", "==", userId))
    );

    const cartItems = cartSnapshot.docs.map((doc) => {
      const cartData = doc.data();
      return {
        id: doc.id,
        quantity: cartData.quantity,
        addedAt: cartData.addedAt,
        name: cartData.productName,
        price: cartData.productPrice,
        description: cartData.productDescription,
        imageURL: cartData.productImageURL,
        mrp: cartData.productMrp,
        freeDelivery: cartData.freeDelivery,
        deliveryFee: cartData.deliveryFee,
        variants: cartData.variants,
      };
    });

    return { data: cartItems };
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

const deleteProductFromCart = async (cartItemId, userId) => {
  try {
    const cartRef = doc(db, "cart", cartItemId);
    await deleteDoc(cartRef);
    return { message: "Product removed from cart successfully" };
  } catch (error) {
    console.error("Error removing product from cart:", error);
    throw error;
  }
};

const updateProductQuantityInCart = async (cartItemId, quantity, userId) => {
  try {
    const cartRef = doc(db, "cart", cartItemId);
    await updateDoc(cartRef, { quantity });
    return { message: "Quantity updated successfully" };
  } catch (error) {
    console.error("Error updating quantity:", error);
    throw error;
  }
};

const CART_API = {
  getProductsInCart,
  deleteProductFromCart,
  updateProductQuantityInCart,
  addProductToCart,
};

export default CART_API;
