import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    doc,
    updateDoc,
    deleteDoc,
    writeBatch,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// Function to add a new address for a specific user
export async function addAddress(address, userId) {
    try {
        const addressRef = collection(db, "addresses");

        // Validate required fields
        if (!address.pinCode || !address.addressLine1) {
            return {
                error: true,
                message: "Pin code and address line 1 are required."
            };
        }

        // Check for duplicate address
        const q = query(
            addressRef,
            where("userId", "==", userId),
            where("pinCode", "==", address.pinCode),
            where("addressLine1", "==", address.addressLine1)
        );
        const duplicateCheck = await getDocs(q);

        if (!duplicateCheck.empty) {
            return {
                error: true,
                message: "An address with the same address line and pin code exists. Would you like to update it instead?"
            };
        }

        // If address is set as default, update other addresses
        if (address.isDefault) {
            const existingAddresses = await getDocs(
                query(addressRef, where("userId", "==", userId))
            );

            const batch = writeBatch(db);
            existingAddresses.docs.forEach((doc) => {
                if (doc.data().isDefault) {
                    batch.update(doc.ref, { isDefault: false });
                }
            });
            await batch.commit();
        }

        const addressData = {
            ...address,
            userId,
            createdAt: serverTimestamp(),
        };
        await addDoc(addressRef, addressData);
        return {
            error: false,
            message: "Address added successfully"
        };
    } catch (error) {
        console.error("Error adding address:", error);
        return {
            error: true,
            message: "Failed to add address. Please try again."
        };
    }
}

// Function to fetch all addresses for a specific user
export async function getAddresses(userId) {
    try {
        const addressRef = collection(db, "addresses");
        const q = query(addressRef, where("userId", "==", userId));
        const addressSnapshot = await getDocs(q);

        const addresses = addressSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return { data: addresses };
    } catch (error) {
        console.error("Error fetching addresses:", error);
        throw error;
    }
}

// Function to update an existing address
export async function updateAddress(addressId, updatedData) {
    try {
        const addressRef = doc(db, "addresses", addressId);

        // Ensure required fields are defined
        const { userId, pinCode, addressLine1, isDefault } = updatedData;
        if (!userId || !pinCode || !addressLine1) {
            return {
                error: true,
                message: "User ID, pin code, and address line 1 are required."
            };
        }

        // Check for duplicate address
        const addressRefCollection = collection(db, "addresses");
        const q = query(
            addressRefCollection,
            where("userId", "==", updatedData.userId),
            where("pinCode", "==", updatedData.pinCode),
            where("isDefault", "==", updatedData.isDefault),
            where("addressLine1", "==", updatedData.addressLine1)
        );
        const duplicateCheck = await getDocs(q);

        if (!duplicateCheck.empty) {
            return {
                error: true,
                message: "No changes were made, or an address with identical details already exists."
            };
        }

        // If the address is being set as default, update other addresses
        if (isDefault) {
            const existingAddresses = await getDocs(
                query(addressRefCollection, where("userId", "==", userId))
            );

            const batch = writeBatch(db);
            existingAddresses.docs.forEach((doc) => {
                if (doc.id !== addressId && doc.data().isDefault) {
                    batch.update(doc.ref, { isDefault: false });
                }
            });
            await batch.commit();
        }

        await updateDoc(addressRef, updatedData);
        return { error: false, message: "Address updated successfully" };
    } catch (error) {
        console.error("Error updating address:", error);
        return {
            error: true,
            message: "Failed to update address. Please try again."
        };
    }
}

// Function to delete an address
export async function deleteAddress(addressId) {
    try {
        const addressRef = doc(db, "addresses", addressId);
        await deleteDoc(addressRef);
        return { message: "Address deleted successfully" };
    } catch (error) {
        console.error("Error deleting address:", error);
        throw error;
    }
}


// Exporting the API functions
const ADDRESS_API = {
    addAddress,
    getAddresses,
    updateAddress,
    deleteAddress
};

export default ADDRESS_API;