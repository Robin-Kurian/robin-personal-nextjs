import { URLS } from "@/utilities/urls";
import { toast } from "@/hooks/use-toast";
import { collection, getDocs, query, limit, startAfter, addDoc, where, doc, updateDoc } from "firebase/firestore";
import * as XLSX from "xlsx";
import Cookies from "js-cookie";
import useAuthStore from "@/hooks/useAuthStore";
import { TextAnimate } from "@/components/ui/magic-text-animate";


export const handleLoginResult = (result, onClose, setUser, router) => {
  if (result.error) {
    toast("Uh-oh! " + result.error);
  } else {
    setUser(result.user);
    toast("Login successful!");
    onClose();
    if (result.user.role === "admin") {
      router.push("/protected/admin");
    } else {
      router.push("/");
    }
  }
};

const handleRegisterResult = (result, onClose, setUser, router) => {
  if (result.error) {
    toast.error("Uh- " + result.error);
  } else {
    setUser(result.user);
    toast("Registration successful!");
    if (result.user.role === "admin") {
      router.push("/protected/admin");
    } else {
      router.push("/");
    }
    onClose();
  }
};

const IS_DEVELOPMENT_MODE = process.env.NEXT_PUBLIC_ENVIRONMENT === "local";

// Add data to firestore
const addData = async (db, collectionName, collectionData) => {
  try {
    const collectionRef = collection(db, collectionName);
    await addDoc(collectionRef, collectionData);
    return {
      error: false,
      message: `Data added Successfully`
    };
  } catch (error) {
    console.error("Error adding data:", error);
    return {
      error: true,
      message: `Failed to add address. ERR: ${error}`,
    };
  }
};

const updateData = async (db, collectionName, documentId, collectionData) => {
  try {
    const documentRef = doc(db, collectionName, documentId);
    await updateDoc(documentRef, collectionData);
    return {
      error: false,
      message: `Data updated successfully`
    };
  } catch (error) {
    console.error("Error updating data:", error);
    return {
      error: true,
      message: `Failed to update data. ERR: ${error}`,
    };
  }
};

// Common fetch data from firestore fn
const fetchData = async (db, collectionName, options = {}) => {
  try {
    let q = query(collection(db, collectionName));

    // If userId is provided, add where clause
    if (options.userId) {
      q = query(q, where('userId', '==', options.userId));
    }

    // If startAfter is provided, add it to the query for pagination
    if (options.startAfter) {
      q = query(q, startAfter(options.startAfter));
    }

    // If limit is provided, add it to the query
    if (options.limit) {
      q = query(q, limit(options.limit));
    }

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort the data based on createdAt field in descending order
    const sortedData = data.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt); // Sort by createdAt, most recent first
    });

    return {
      data: sortedData,
      lastVisible: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: [], error };
  }
};

const formatErrorMessage = (errorCode) => {
  switch (errorCode) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-disabled":
      return "Account has been disabled.";
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/invalid-credential":
      return "Please check your credentials.";
    case "auth/weak-password":
      return "Password must be at least 6 characters long.";
    case "auth/email-already-in-use":
      return "Sorry, Account already exists.";
    case "auth/unauthorized-domain":
      return "Service temporarily unavailable.";
    case "auth/cancelled-popup-request":
      return "Popup was cancelled.";
    case "auth/too-many-requests":
      return "Too many login attempts. Please try again later.";
    case "undefined":
      return "Can't login right now. Please try again later.";
    default:
      return "Check your credentials and please try again.";
  }
};
const checkUid = () => {
  const uid = Cookies.get("uid");
  return uid ? true : false;
}
const handleLogout = async () => {
  try {
    await useAuthStore.getState().logout();

    toast({
      variant: "warning",
      title: (
        <TextAnimate animation="slideLeft" by="character">
          Logged out.
        </TextAnimate>
      ),
      description: (
        <TextAnimate animation="scaleUp" by="character" delay={2}>
          Please log in again.
        </TextAnimate>
      ),
    });
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Logout failed",
      description: `${error}`
    });
  }
};

const AUTH = {
  HANDLE_LOGIN_RESULT: handleLoginResult,
  CHECK_UID: checkUid,
  HANDLE_LOGOUT: handleLogout,
  FORMAT_ERROR_MESSAGE: formatErrorMessage,
  HANDLE_REGISTER_RESULT: handleRegisterResult,
};

const fetchCategories = async (db) => {
  try {
    const categoriesRef = collection(db, "categories");
    const categoriesSnapshot = await getDocs(categoriesRef);

    const categoriesData = {};
    categoriesSnapshot.docs.forEach(doc => {
      categoriesData[doc.id] = { ...doc.data(), id: doc.id };
    });

    return { categoriesData };
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to load categories. Please try again.");
  }
};

const fetchCategoryProducts = async (db, categoryId = null, lastVisible = null, itemLimit = 10) => {
  try {
    const productsRef = collection(db, "products");
    let productsQuery;

    if (categoryId) {
      const categoryRef = doc(db, "categories", categoryId);
      productsQuery = lastVisible
        ? query(
          productsRef,
          where("categoryRefs", "array-contains", categoryRef),
          startAfter(lastVisible),
          limit(itemLimit)
        )
        : query(
          productsRef,
          where("categoryRefs", "array-contains", categoryRef),
          limit(itemLimit)
        );
    } else {
      productsQuery = lastVisible
        ? query(productsRef, startAfter(lastVisible), limit(itemLimit))
        : query(productsRef, limit(itemLimit));
    }

    const productsSnapshot = await getDocs(productsQuery);
    const products = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Check if we got less products than the limit or no products
    const hasMore = products.length === itemLimit;

    return {
      products,
      lastVisible: productsSnapshot.docs[productsSnapshot.docs.length - 1] || null,
      hasMore
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to load products. Please try again.");
  }
};

const uploadProductsFromExcel = async (db, file) => {
  try {
    const data = await file.arrayBuffer(); // Read the file as an array buffer
    const workbook = XLSX.read(data); // Parse the workbook
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const worksheet = workbook.Sheets[sheetName]; // Get the worksheet
    const jsonData = XLSX.utils.sheet_to_json(worksheet); // Convert to JSON

    // Ensure categoryRefs is an array for each product
    const productsWithArrayRefs = jsonData.map(product => {
      return {
        ProductImages: product.ProductImages.split(',').map(url => url.trim()), // Convert to array
        categoryRefs: Array.isArray(product.categoryRefs)
          ? product.categoryRefs.map(ref => doc(db, ref)) // Convert string to Firestore reference
          : [doc(db, product.categoryRefs)], // Convert string to Firestore reference
        deliveryFee: Number(product.deliveryFee), // Convert to number
        description: product.description,
        freeDelivery: product.freeDelivery === 'TRUE', // Convert to boolean
        imageURL: product.imageURL,
        mrp: Number(product.mrp), // Convert to number
        name: product.name,
        price: Number(product.price), // Convert to number
        searchTags: product.searchTags ? product.searchTags.split(',').map(tag => tag.trim()) : [], // Process searchTags into an array
        instagramLink: product.instagramLink,
      };
    });

    // Add each product to the Firestore collection
    const productsRef = collection(db, "products");
    const promises = productsWithArrayRefs.map(async (product) => {
      await addDoc(productsRef, product); // Add each product document
    });

    await Promise.all(promises); // Wait for all promises to resolve
    return { success: true, message: "Products uploaded successfully!" };
  } catch (error) {
    console.error("Error uploading products:", error);
    return { error: true, message: error.message || "Failed to upload products. Please check the file contents." };
  }
};

// Function to check if mobile device
const IS_ON_MOBILE = () => {
  return /Mobi|Android/i.test(navigator.userAgent);
};

const COPY_TO_CLIPBOARD = (text) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand("copy");
    // Show toast notification only for PC browsers
    if (!IS_ON_MOBILE()) {
      toast({ title: "URL copied to clipboard!" });
    }
    return true;
  } catch (err) {
    toast({ variant: "destructive", title: "Failed to copy!", description: err });
    return false;
  } finally {
    document.body.removeChild(textArea); // Clean up
  }
}

const formatTimeAgo = (date) => {
  if (!date) return 'Recently';

  const now = new Date();
  const diff = now - date;

  // Convert milliseconds to minutes, hours, days
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else if (hours > 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else {
    return 'Just now';
  }
};

const DATE = {
  FORMAT_TIME_AGO: (date) => formatTimeAgo(date),
};

const GET_POST_OFFICE_BY_PIN_CODE = (pinCode) => `${URLS.POSTAL_API_URL}${pinCode}`;

const CAROUSEL = {
  GET_CAROUSEL: (db) => fetchData(db, "carousel"),
};

const PRODUCTS = {
  GET_PRODUCTS: (db) => fetchData(db, "products"),
  GET_CATEGORY_PRODUCTS: (db, categoryId, lastVisible, limit) =>
    fetchCategoryProducts(db, categoryId, lastVisible, limit),
  UPLOAD_PRODUCTS_FROM_EXCEL: uploadProductsFromExcel,
};

const CATEGORIES = {
  GET_CATEGORIES: (db) => fetchCategories(db),
};

const FIREBASE = {
  FETCH_DATA: async (db, collectionName, options) => {
    try {
      return await fetchData(db, collectionName, options);
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error("Failed to fetch data. Please try again later.");
    }
  },

  POST_DATA: async (db, collectionName, collectionData) => {
    try {
      return await addData(db, collectionName, collectionData);
    } catch (error) {
      console.error("Error posting data:", error);
      throw new Error("Failed to post data. Please try again later.");
    }
  },

  UPDATE_DATA: async (db, collectionName, documentId, data) => {
    try {
      return await updateData(db, collectionName, documentId, data);
    } catch (error) {
      console.error("Error updating data:", error);
      throw new Error("Failed to update data. Please try again later.");
    }
  }
};

export { AUTH, DATE, IS_DEVELOPMENT_MODE, IS_ON_MOBILE, COPY_TO_CLIPBOARD, FIREBASE, CAROUSEL, PRODUCTS, CATEGORIES, GET_POST_OFFICE_BY_PIN_CODE };