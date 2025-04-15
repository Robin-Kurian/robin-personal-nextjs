import React, { useEffect, useState, useCallback } from "react";
import ADDRESS_API from "@/utilities/api/address.api";
import useAuthStore from "@/hooks/useAuthStore";
import { toast } from "@/hooks/use-toast";
import { FiTrash, FiEdit } from "react-icons/fi";
import { Button, Chip, Skeleton, Input } from "@heroui/react";
import Gridlayout from "@/components/common/layouts/Gridlayout";
import CustomModal from "@/components/admin/CustomModal";
import EmptyMessage from "../common/EmptyMessage";
import AddEditAddress from "@/components/shop/AddEditAddress";
import { useFormValidation, EMAIL_REGEX } from "@/hooks/useFormValidation";

// Define validation rules for the address form
const addressValidations = {
    firstName: { required: { message: "First name is required." } },
    lastName: { required: { message: "Last name is required." } },
    phone: {
        required: { message: "Phone number is required." },
        pattern: { value: /^[6-9]\d{9}$/, message: "Enter valid 10-digit Indian mobile number." }
    },
    email: {
        required: { message: "Email is required." },
        pattern: { value: EMAIL_REGEX, message: "Invalid email address." }
    },
    addressLine1: {
        required: { message: "Address Line 1 is required." },
        maxLength: { value: 100, message: "Address Line 1 cannot exceed 100 characters." }
    },
    addressLine2: {
        maxLength: { value: 100, message: "Address Line 2 cannot exceed 100 characters." }
    },
    apartment: {
        maxLength: { value: 50, message: "Apartment cannot exceed 50 characters." }
    },
    pinCode: {
        required: { message: "Pin code is required." },
        pattern: { value: /^\d{6}$/, message: "Enter a valid 6-digit pin code." }
    },
    postOffice: { required: { message: "Post office is required." } },
    city: { required: { message: "City is required." } },
    state: { required: { message: "State is required." } },
    country: { required: { message: "Country is required." } },
};

const Address = ({ onAddressSaved, setAddress, deliveryAddress }) => {
    const { user, isLoggedIn } = useAuthStore();
    const [addresses, setAddresses] = useState([]);
    const initialAddressState = {
        id: null,
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        addressLine1: "",
        addressLine2: "",
        apartment: "",
        pinCode: "",
        postOffice: "",
        city: "",
        state: "",
        country: "India",
        isDefault: addresses.length === 0,
    };

    const [isCreating, setIsCreating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);
    const [addressToEdit, setAddressToEdit] = useState(null);

    // Instantiate the form validation hook
    const {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        setValues,
        resetForm,
    } = useFormValidation(initialAddressState, addressValidations);

    const fetchAddresses = useCallback(async () => { 
        if (!user?.uid) return;
        setIsLoading(true); 
        try {
            const response = await ADDRESS_API.getAddresses(user.uid);
            setAddresses(response.data);
        } catch (error) {
            console.error("Error fetching addresses:", error);
            toast({ variant: "destructive", title: "Error fetching addresses." });
        } finally {
            setIsLoading(false);
        }
    }, [user?.uid]); 

    useEffect(() => {
        if (user?.uid) {
            fetchAddresses();
        }
    }, [user, fetchAddresses]); 

    useEffect(() => {
        if (addresses.length === 0) {
            setAddress(null); 
            onAddressSaved(null);
            return;
        }

        // If a delivery address is already selected and still exists, keep it.
        const currentSelectedExists = addresses.some(addr => addr.id === deliveryAddress?.id);
        if (deliveryAddress && currentSelectedExists) {
            // No change needed, already selected
            return;
        }

        // Otherwise, select the default or the first one.
        const defaultAddress = addresses.find(addr => addr.isDefault);
        const addressToSelect = defaultAddress || addresses[0];
        handleAddressSelect(addressToSelect);

    }, [addresses, deliveryAddress]); 

    const handleAddressSelect = (address) => {
        setAddress(address); 
        onAddressSaved(address); 
    };

    // Open Add modal
    const toggleCreateAddress = () => {
        setAddressToEdit(null); 
        resetForm({ ...initialAddressState, isDefault: addresses.length === 0 });
        setIsCreating(true);
    };

    // Open Edit modal
    const toggleEditAddress = (address) => {
        setAddressToEdit(address); 
        resetForm(address);
        setIsCreating(true);
    };

    const openDeleteAddressModal = (address) => {
        setIsDeleting(true);
        setAddressToDelete(address);
    };

    const handleRemoveAddress = async (addressId) => {
        if (!addressId) return;
        setIsLoading(true); 
        try {
            await ADDRESS_API.deleteAddress(addressId);
            setIsDeleting(false);
            setAddressToDelete(null);
            await fetchAddresses(); // Refetch after delete
            toast({ variant: "success", title: "Address removed successfully." });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Failed to remove address. Please try again.",
                description: error.message
            });
        } finally {
            setIsLoading(false);
        }
    };

    // This function is now the callback for the hook's handleSubmit
    const handleSaveAddressSubmit = async (formData) => {
        let savedAddressId = formData.id; // Keep track of the ID
        let needsDefaultUpdate = false; // Flag to check if default needs handling

        try {
            if (formData.id) { // Check if it has an ID (means editing)
                // Update existing address
                const updateAddressResponse = await ADDRESS_API.updateAddress(formData.id, formData);
                if (updateAddressResponse.error) {
                    toast({ variant: "destructive", title: updateAddressResponse.message });
                    return;
                } else {
                    toast({ variant: "success", title: updateAddressResponse.message });
                    if (formData.isDefault) {
                        needsDefaultUpdate = true; // Mark that default logic needs to run
                    }
                }
            } else {
                // Add new address (remove null id before sending)
                const { id, ...newAddressData } = formData;
                const newAddressResponse = await ADDRESS_API.addAddress(newAddressData, user?.uid);

                if (newAddressResponse.error) {
                    toast({ variant: "destructive", title: newAddressResponse.message });
                    return; // Exit the function if there's an error
                } else {
                    savedAddressId = newAddressResponse.id; // Get the ID of the newly added address
                    toast({ variant: "success", title: newAddressResponse.message });
                    if (formData.isDefault) {
                        needsDefaultUpdate = true; // Mark that default logic needs to run
                    }
                }
            }

            // If the saved address was marked as default, ensure others are not
            if (needsDefaultUpdate && savedAddressId) {
                // Update local state optimistically first
                const updatedAddressesForDefault = addresses.map(addr => ({
                    ...addr,
                    isDefault: addr.id === savedAddressId, // Set isDefault true only for the saved address
                }));
                setAddresses(updatedAddressesForDefault); // Update UI immediately

                // Now update the database for addresses that changed default status
                const previousDefault = addresses.find(addr => addr.isDefault && addr.id !== savedAddressId);

                const updates = [];
                // Update the new default (already done by save/update, but ensures consistency if API differs)
                updates.push(ADDRESS_API.updateAddress(savedAddressId, { isDefault: true }));
                // If there was a different previous default, unset it
                if (previousDefault) {
                    updates.push(ADDRESS_API.updateAddress(previousDefault.id, { isDefault: false }));
                }
                await Promise.all(updates);
            }

            await fetchAddresses(); // Refetch addresses after save/update/default change
            setIsCreating(false); // Close modal on success
            resetForm(initialAddressState); // Reset form state
            setAddressToEdit(null);
        } catch (error) {
            console.error("Error saving address:", error); // Log the full error
            toast({ variant: "destructive", title: "Error saving address.", description: error.message });
        }
    };

    // Show loading skeleton for initial fetch
    if (isLoading && addresses.length === 0) {
        return (
            <Gridlayout gridClassNames="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
                {[...Array(3)].map((_, i) => ( // Show a few skeletons
                    <Skeleton key={i} className="rounded-[4px] h-[150px]" />
                ))}
            </Gridlayout>
        );
    }

    // Show login prompt if not logged in
    if (!isLoggedIn) {
        return (
            <div className="p-4 text-center">
                <p>Please log in to manage your addresses.</p>
            </div>
        );
    }

    return (
        <>
            <div className="flex p-2 items-center justify-between ">
                <h2 className="text-md sm:text-lg font-medium text-gray-800">Delivery Address</h2>
                <Button
                    size="sm"
                    color="primary"
                    variant="bordered"
                    className="text-blue-500 rounded-[4px] md:scale-110 hover:border-blue-600"
                    onPress={toggleCreateAddress} // Use the updated function
                >
                    Add Address
                </Button>
            </div>
            <Gridlayout gridClassNames="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
                {addresses.length > 0 ? addresses.map((address) => (
                    <div key={address.id} className={`relative rounded-[4px] p-4 border transition-colors duration-200 flex flex-col justify-between min-h-[180px] ${deliveryAddress?.id === address.id ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>
                        {/* Top section for details and edit/delete */}
                        <div className="flex-grow mb-4"> {/* Allow this section to grow */}
                            <div className="text-gray-800 pr-8 space-y-1"> {/* Add padding for edit/delete */}
                                <div className="flex justify-between items-start">
                                    <p className="font-medium text-base">{address.firstName} {address.lastName}</p>
                                    {/* Edit/Delete Buttons Container (Top Right) */}
                                    <div className="absolute top-1 right-1 flex flex-col items-end space-y-1">
                                        <div className="flex space-x-1">
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                onPress={() => toggleEditAddress(address)}
                                                className="text-yellow-600 hover:bg-yellow-100 min-w-0 w-6 h-6"
                                                aria-label="Edit Address"
                                            >
                                                <FiEdit size={14} />
                                            </Button>
                                            {/* Prevent deleting default address directly */}
                                            {!address.isDefault && (
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="light"
                                                    onPress={() => openDeleteAddressModal(address)}
                                                    className="text-red-600 hover:bg-red-100 min-w-0 w-6 h-6"
                                                    aria-label="Delete Address"
                                                >
                                                    <FiTrash size={14} />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* Address Details */}
                                <p className="text-sm truncate">{address.addressLine1}</p>
                                <p className="text-sm">{address.postOffice}, {address.city}, {address.state} - {address.pinCode}</p>
                                {/* {address.email && <p className="text-sm truncate">{address.email}</p>} */}
                                <p className="text-sm">{address.phone}</p>
                            </div>
                        </div>

                        {/* Bottom section for buttons/chip */}
                        <div className="flex items-end justify-between"> {/* Align items to end (bottom) */}
                            {/* Deliver Here Button (Bottom Left) */}
                            <Button
                                size="sm"
                                variant={deliveryAddress?.id === address.id ? "solid" : "bordered"}
                                color="primary"
                                isDisabled={deliveryAddress?.id === address.id}
                                className={`rounded font-medium ${deliveryAddress?.id === address.id ? "bg-blue-600 text-white cursor-default" : "border-blue-500 text-blue-500 hover:bg-blue-50"}`}
                                onPress={() => handleAddressSelect(address)}
                            >
                                {deliveryAddress?.id === address.id ? "Selected" : "Deliver here"}
                            </Button>

                            {/* Default Chip (Bottom Right - Conditional) */}
                            {address.isDefault && (
                                <Chip size="sm" color="success" variant="flat">
                                    Default Address
                                </Chip >
                            )}
                            {/* Removed the "Set as Default" button */}
                        </div>
                    </div>
                )) : (!isLoading && <EmptyMessage title="No addresses found!" message="Add a delivery address to continue." />)}
            </Gridlayout>

            <CustomModal
                size="sm"
                isOpen={isDeleting}
                onClose={() => {
                    setIsDeleting(false);
                    setAddressToDelete(null);
                }}
                title="Confirm Deletion"
                body={
                    <p>Are you sure you want to delete the address for <span className="font-semibold text-gray-700">
                        {addressToDelete?.firstName} {addressToDelete?.lastName}
                    </span>?</p>
                }
                footer={
                    <div className="flex justify-end gap-2">
                        <Button
                            onPress={() => {
                                setIsDeleting(false);
                                setAddressToDelete(null);
                            }}
                            variant="flat" // Use flat variant
                        >
                            Cancel
                        </Button>
                        <Button
                            onPress={() => handleRemoveAddress(addressToDelete?.id)}
                            color="danger"
                            variant="solid" // Use solid for destructive action
                            isLoading={isLoading} // Show loader on delete button too
                        >
                            Delete
                        </Button>
                    </div>
                }
            />

            {/* Add/Edit Address Modal */}
            <CustomModal
                isOpen={isCreating}
                contentClassName="max-h-[50vh] sm:max-h-[90vh]"
                onClose={() => {
                    setIsCreating(false);
                    resetForm(initialAddressState); // Reset form on close
                    setAddressToEdit(null);
                }}
                scrollBehavior="inside" 
                size="2xl" 
                title={addressToEdit ? "Edit Address" : "Add New Address"} 
                body={
                    <AddEditAddress
                        values={values}
                        errors={errors}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        setValues={setValues}
                        validations={addressValidations} 
                    />
                }
                footer={
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="flat"
                            onPress={() => {
                                setIsCreating(false);
                                resetForm(initialAddressState); 
                                setAddressToEdit(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            variant="solid"
                            onPress={() => handleSubmit(handleSaveAddressSubmit)()} 
                            isLoading={isSubmitting} 
                        >
                            {addressToEdit ? "Update Address" : "Save Address"}
                        </Button>
                    </div>}
            />
        </>
    );
};

export default Address; 