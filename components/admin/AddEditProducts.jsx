import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, getDoc, query, where } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import AddProductVariants from './AddProductVariants';
import CustomModal from "@/components/admin/CustomModal";
import AdminManageCategories from './AdminManageCategories';
import { useFormValidation } from "@/hooks/useFormValidation";
import { MediaLibrary } from "@/components/common/MediaLibrary";
import { Button, Input, Textarea, Select, SelectItem, Checkbox } from "@heroui/react";

// Define validation rules for the product form
const productValidations = {
    productName: {
        required: { message: "Product name is required." },
        minLength: { value: 3, message: "Product name must be at least 3 characters." }
    },
    productPrice: {
        required: { message: "Product price is required." },
        custom: {
            validate: (value) => !value || Number(value) > 0,
            message: "Price must be greater than 0."
        }
    },
    mrp: {
        custom: {
            validate: (value, values) => !value || Number(value) >= Number(values.productPrice || 0),
            message: "MRP must be greater than or equal to selling price."
        }
    },
    productCode: {
        required: { message: "Product code is required." },
        pattern: {
            value: /^[A-Za-z0-9-_]+$/,
            message: "Product code can only contain letters, numbers, hyphens and underscores."
        }
    },
    description: {
        required: { message: "Product description is required." },
        minLength: { value: 10, message: "Description must be at least 10 characters." }
    },
    selectedCategories: {
        custom: {
            validate: (value) => Array.isArray(value) && value.length > 0,
            message: "Please select at least one category."
        }
    },
    displayImage: {
        custom: {
            validate: (value) => !!value,
            message: "Please select a display image."
        }
    },
    variants: {
        custom: {
            validate: (value) => {
                // Allow empty variants
                if (!value || Object.keys(value).length === 0) return true;
                // Check if each variant has at least one value
                return Object.values(value).every(values => Array.isArray(values) && values.length > 0);
            },
            message: "Each selected variant must have at least one value."
        }
    }
};

export const AddEditProducts = ({ productToEdit, onCancel, onSuccess }) => {
    const initialState = {
        productName: "",
        productPrice: "",
        mrp: "",
        freeDelivery: false,
        deliveryFee: 49,
        productCode: "",
        description: "",
        selectedCategories: [],
        productImgs: [],
        displayImage: "",
        variants: {
            hasVariants: false,
            size: [],
            color: []
        },
        socialMediaLink: "",
        searchTags: [],
        isActive: true
    };

    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [tagInput, setTagInput] = useState("");
    const [showMediaLibrary, setShowMediaLibrary] = useState(false);
    const [mediaLibraryMode, setMediaLibraryMode] = useState('multiple'); // 'multiple' or 'single'
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showVariantModal, setShowVariantModal] = useState(false);
    const [availableVariants, setAvailableVariants] = useState({});
    const [selectedVariantTypes, setSelectedVariantTypes] = useState([]);
    const [selectedVariantValues, setSelectedVariantValues] = useState({});
    const db = getFirestore();

    // Initialize form validation with mapped product data if editing
    const {
        values,
        errors,
        handleChange,
        handleBlur,
        setValues,
        resetForm
    } = useFormValidation(
        productToEdit ? {
            productName: productToEdit.name || "",
            productPrice: productToEdit.price || "",
            mrp: productToEdit.mrp || "",
            freeDelivery: productToEdit.freeDelivery || false,
            deliveryFee: productToEdit.deliveryFee || 49,
            productCode: productToEdit.productCode || "",
            description: productToEdit.description || "",
            selectedCategories: [],
            productImgs: productToEdit.ProductImages || [],
            displayImage: productToEdit.imageURL || "",
            variants: productToEdit.variants || {
                hasVariants: false,
                size: [],
                color: []
            },
            socialMediaLink: productToEdit.socialMediaLink || "",
            searchTags: productToEdit.searchTags || [],
            isActive: productToEdit.isActive !== undefined ? productToEdit.isActive : true
        } : initialState,
        productValidations
    );

    // Fetch categories and handle category refs
    useEffect(() => {
        const fetchCategoriesAndSetSelected = async () => {
            try {
                const snapshot = await getDocs(collection(db, "categories"));
                const fetchedCategories = snapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name
                }));
                setCategories(fetchedCategories);

                // If editing, fetch and set selected categories
                if (productToEdit && productToEdit.categoryRefs) {
                    const categoryRefs = productToEdit.categoryRefs;
                    const selectedCategoryIds = categoryRefs.map(ref => ref.id);
                    setValues(prev => ({
                        ...prev,
                        selectedCategories: selectedCategoryIds
                    }));
                }
            } catch (err) {
                toast({
                    variant: "destructive",
                    title: "Error fetching categories",
                    description: err.message
                });
            }
        };
        fetchCategoriesAndSetSelected();
    }, [productToEdit, db, setValues]);

    // Add after useEffect for categories
    useEffect(() => {
        const fetchVariants = async () => {
            try {
                const db = getFirestore();
                const variantDoc = await getDoc(doc(db, "variants", "productVariants"));
                if (variantDoc.exists()) {
                    setAvailableVariants(variantDoc.data());
                    if (productToEdit?.variants) {
                        setSelectedVariantTypes(Object.keys(productToEdit.variants));
                        setSelectedVariantValues(productToEdit.variants);
                    }
                }
            } catch (error) {
                console.error("Error fetching variants:", error);
                toast({
                    title: "Error",
                    description: "Failed to fetch variants",
                    variant: "destructive",
                });
            }
        };
        fetchVariants();
    }, [productToEdit]);

    const handleImageSelection = (selectedUrls) => {
        if (mediaLibraryMode === 'multiple') {
            setValues(prev => ({
                ...prev,
                productImgs: selectedUrls
            }));
        } else {
            setValues(prev => ({
                ...prev,
                displayImage: selectedUrls[0] || ""
            }));
        }
        setShowMediaLibrary(false);
    };

    // Handle search tags
    const handleAddTag = () => {
        if (tagInput.trim()) {
            setValues(prev => ({
                ...prev,
                searchTags: [...new Set([...prev.searchTags, tagInput.trim().toLowerCase()])]
            }));
            setTagInput("");
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setValues(prev => ({
            ...prev,
            searchTags: prev.searchTags.filter(tag => tag !== tagToRemove)
        }));
    };

    // Add after the searchTags state
    const handleVariantTypeChange = (selectedKeys) => {
        const newSelectedTypes = Array.from(selectedKeys);
        setSelectedVariantTypes(newSelectedTypes);

        // Remove values for unselected types
        const newValues = { ...selectedVariantValues };
        Object.keys(newValues).forEach(type => {
            if (!newSelectedTypes.includes(type)) {
                delete newValues[type];
            }
        });
        setSelectedVariantValues(newValues);
    };

    const handleVariantValueChange = (variantType, selectedKeys) => {
        setSelectedVariantValues(prev => ({
            ...prev,
            [variantType]: Array.from(selectedKeys)
        }));
    };

    // Add before the form submission
    const handleVariantsUpdate = (updatedVariants) => {
        setAvailableVariants(updatedVariants);
    };

    // Add validation check function
    const validateForm = () => {
        const requiredFields = {
            productName: values.productName,
            productPrice: values.productPrice,
            productCode: values.productCode,
            description: values.description,
            selectedCategories: values.selectedCategories,
            displayImage: values.displayImage
        };

        const hasEmptyRequired = Object.entries(requiredFields).some(([key, value]) => {
            if (key === 'selectedCategories') {
                return !Array.isArray(value) || value.length === 0;
            }
            if (key === 'productPrice') {
                return !value || Number(value) <= 0;
            }
            return !value;
        });

        if (hasEmptyRequired) {
            return false;
        }

        // Check MRP if provided
        if (values.mrp && Number(values.mrp) < Number(values.productPrice)) {
            return false;
        }

        return true;
    };

    // Handle form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast({
                variant: "destructive",
                title: "Validation Error",
                description: "Please fill in all required fields correctly."
            });
            return;
        }

        setIsLoading(true);

        try {
            const productData = {
                name: values.productName,
                price: Number(values.productPrice),
                mrp: values.mrp ? Number(values.mrp) : Number(values.productPrice),
                freeDelivery: values.freeDelivery,
                deliveryFee: values.freeDelivery ? 0 : Number(values.deliveryFee),
                productCode: values.productCode,
                description: values.description,
                categoryRefs: values.selectedCategories.map(id => doc(db, 'categories', id)),
                ProductImages: Array.isArray(values.productImgs) ? values.productImgs : [],
                imageURL: values.displayImage,
                isActive: values.isActive,
                variants: selectedVariantValues,
                socialMediaLink: values.socialMediaLink || "",
                searchTags: values.searchTags || [],
                updatedAt: new Date().toISOString()
            };

            // Update lastUsed timestamp for all used images
            const mediaRef = collection(db, "media");
            const allImageUrls = [...productData.ProductImages];
            if (productData.imageURL) allImageUrls.push(productData.imageURL);

            const updateImageUsage = allImageUrls.map(async (url) => {
                const q = query(mediaRef, where("url", "==", url));
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    const mediaDoc = snapshot.docs[0];
                    await updateDoc(doc(db, "media", mediaDoc.id), {
                        lastUsed: new Date().toISOString()
                    });
                }
            });

            await Promise.all(updateImageUsage);

            if (productToEdit) {
                await updateDoc(doc(db, "products", productToEdit.id), productData);
                toast({
                    title: "Success",
                    description: "Product updated successfully",
                    variant: "success",
                });
            } else {
                await addDoc(collection(db, "products"), productData);
                toast({
                    title: "Success",
                    description: "Product added successfully",
                    variant: "success",
                });
            }

            resetForm();
            if (onSuccess) {
                onSuccess();
            } else {
                onCancel();
            }
        } catch (err) {
            console.error("Error saving product:", err);
            toast({
                variant: "destructive",
                title: "Error",
                description: err.message || "Failed to save product"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const openMediaLibrary = (mode) => {
        setMediaLibraryMode(mode);
        setShowMediaLibrary(true);
    };

    return (
        <>
            <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Product Name"
                        name="productName"
                        value={values.productName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isRequired
                        isInvalid={!!errors.productName}
                        errorMessage={errors.productName}
                    />

                    <Input
                        type="number"
                        label="Price"
                        name="productPrice"
                        value={values.productPrice}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isRequired
                        isInvalid={!!errors.productPrice}
                        errorMessage={errors.productPrice}
                    />

                    <Input
                        type="number"
                        label="MRP"
                        name="mrp"
                        value={values.mrp}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!errors.mrp}
                        errorMessage={errors.mrp}
                    />

                    <Input
                        label="Product Code"
                        name="productCode"
                        value={values.productCode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isRequired
                        isInvalid={!!errors.productCode}
                        errorMessage={errors.productCode}
                    />
                </div>

                <Textarea
                    label="Description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isRequired
                    isInvalid={!!errors.description}
                    errorMessage={errors.description}
                />

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Select
                            size='sm'
                            items={categories}
                            name="selectedCategories"
                            selectionMode="multiple"
                            selectedKeys={new Set(values.selectedCategories)}
                            className="w-[240px] sm:w-[320px] mr-2"
                            classNames={{
                                base: "w-full",
                                trigger: "min-h-10 h-9 py-0", // Reduced height and padding
                                innerWrapper: "py-0", // Remove padding from inner wrapper
                                value: "text-small" // Optional: adjust text size if needed
                            }}
                            isMultiline={true}
                            placeholder="Select Categories"
                            variant="bordered"
                            isInvalid={!!errors.selectedCategories}
                            errorMessage={errors.selectedCategories}
                            onSelectionChange={(keys) => {
                                const selectedKeys = Array.from(keys);
                                setValues(prev => ({
                                    ...prev,
                                    selectedCategories: selectedKeys
                                }));
                            }}
                            renderValue={(items) => {
                                return (
                                    <div className="flex flex-wrap gap-2">
                                        {items.map((item) => (
                                            <div key={item.key} className="bg-blue-100 px-2 py-1 rounded text-sm">
                                                {item.data.name}
                                            </div>
                                        ))}
                                    </div>
                                );
                            }}
                        >
                            {(category) => (
                                <SelectItem key={category.id} value={category.id} textValue={category.name}>
                                    {category.name}
                                </SelectItem>
                            )}
                        </Select>
                        <Button
                            size='md'
                            color="primary"
                            onPress={() => setShowCategoryModal(true)}

                            className='text-xs'
                        >
                            Create Category
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Search Tags</label>
                    <div className="flex gap-2">
                        <Input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            placeholder="Add search tags here"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        />
                        <Button type="button" onPress={handleAddTag}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {values.searchTags.map((tag) => (
                            <div key={tag} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                                <span>{tag}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTag(tag)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <Checkbox
                        name="freeDelivery"
                        isSelected={values.freeDelivery}
                        onChange={handleChange}
                        className='mr-2'
                    >
                        Free Delivery
                    </Checkbox>

                    <Checkbox
                        name="isActive"
                        isSelected={values.isActive}
                        onChange={handleChange}
                        color="success"
                    >
                        In stock
                    </Checkbox>

                    {!values.freeDelivery && (
                        <Input
                            type="number"
                            label="Delivery Fee"
                            name="deliveryFee"
                            value={values.deliveryFee}
                            onChange={handleChange}
                        />
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Product Images</label>
                    <div className="flex flex-wrap gap-2">
                        {values.productImgs.map((url, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={url}
                                    alt={`Product ${index + 1}`}
                                    className="h-20 w-20 object-cover rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newImages = values.productImgs.filter((_, i) => i !== index);
                                        setValues(prev => ({ ...prev, productImgs: newImages }));
                                    }}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="bordered"
                            onPress={() => openMediaLibrary('multiple')}
                            className="h-20 w-20 flex items-center justify-center border-2 border-dashed rounded hover:border-blue-500"
                        >
                            +
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Display Image</label>
                    <div className="flex items-center gap-4">
                        {values.displayImage && (
                            <div className="relative group">
                                <img
                                    src={values.displayImage}
                                    alt="Display"
                                    className="h-20 w-20 object-cover rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => setValues(prev => ({ ...prev, displayImage: "" }))}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                        <Button
                            type="button"
                            variant="bordered"
                            onPress={() => openMediaLibrary('single')}
                            className="h-20 w-20 flex items-center justify-center border-2 border-dashed rounded hover:border-blue-500"
                        >
                            +
                        </Button>
                    </div>
                </div>

                <Input
                    label="Social Media Link"
                    name="socialMediaLink"
                    value={values.socialMediaLink}
                    onChange={handleChange}
                    onBlur={handleBlur}
                // placeholder="Enter social media link"
                />

                <div className="space-y-2 border rounded-2xl p-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Product Variants</label>
                        <Button
                            size="sm"
                            color="primary"
                            onPress={() => setShowVariantModal(true)}
                        >
                            Manage Variants
                        </Button>
                    </div>
                    {availableVariants && Object.keys(availableVariants).length > 0 ? (
                        <div className="space-y-4">
                            <Select
                                label="Select Variant Types"
                                selectionMode="multiple"
                                selectedKeys={new Set(selectedVariantTypes)}
                                onSelectionChange={handleVariantTypeChange}
                                className="w-full"
                            >
                                {Object.entries(availableVariants).map(([name, variant]) => (
                                    <SelectItem key={name} value={name} textValue={name}>
                                        <span className="capitalize">{name}</span>
                                    </SelectItem>
                                ))}
                            </Select>

                            {selectedVariantTypes.map(variantType => {
                                const variant = availableVariants[variantType];
                                return (
                                    <div key={variantType} className="space-y-2">
                                        <label className="text-sm font-medium capitalize">{variantType} Values</label>
                                        <Select
                                            selectionMode="multiple"
                                            selectedKeys={new Set(selectedVariantValues[variantType] || [])}
                                            onSelectionChange={(keys) => handleVariantValueChange(variantType, keys)}
                                            className="w-full"
                                        >
                                            {variant.type === "color" ? (
                                                Object.entries(variant.values).map(([colorName, hex]) => (
                                                    <SelectItem key={colorName} value={colorName} textValue={colorName}>
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-4 h-4 rounded-full border"
                                                                style={{ backgroundColor: hex }}
                                                            />
                                                            <span className="capitalize">{colorName}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                variant.values.map((value) => (
                                                    <SelectItem key={value} value={value} textValue={value}>
                                                        <span className="capitalize">{value}</span>
                                                    </SelectItem>
                                                ))
                                            )}
                                        </Select>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No variants available. Create some variants first.</p>
                    )}
                </div>

                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="bordered"
                        onPress={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        isDisabled={isLoading}
                        color="primary"
                    >
                        {productToEdit ? 'Update Product' : 'Add Product'}
                    </Button>
                </div>
            </form>

            <CustomModal
                isOpen={showMediaLibrary}
                onClose={() => setShowMediaLibrary(false)}
                title="Media Library"
                size="xl"
                body={
                    <MediaLibrary
                        onSelect={handleImageSelection}
                        multiple={mediaLibraryMode === 'multiple'}
                        selectedImages={mediaLibraryMode === 'multiple' ? values.productImgs : [values.displayImage]}
                        folder="products"
                    />
                }
            />

            <CustomModal
                isOpen={showCategoryModal}
                onClose={() => setShowCategoryModal(false)}
                title="Manage Categories"
                size="3xl"
                body={
                    <AdminManageCategories
                        onClose={() => {
                            setShowCategoryModal(false);
                            // Refresh categories list
                            const fetchCategoriesAndSetSelected = async () => {
                                try {
                                    const snapshot = await getDocs(collection(db, "categories"));
                                    const fetchedCategories = snapshot.docs.map(doc => ({
                                        id: doc.id,
                                        name: doc.data().name
                                    }));
                                    setCategories(fetchedCategories);
                                } catch (err) {
                                    toast({
                                        variant: "destructive",
                                        title: "Error fetching categories",
                                        description: err.message
                                    });
                                }
                            };
                            fetchCategoriesAndSetSelected();
                        }}
                    />
                }
            />

            <CustomModal
                isOpen={showVariantModal}
                onClose={() => setShowVariantModal(false)}
                title="Manage Product Variants"
                size="2xl"
                contentClassName="max-h-[50vh] sm:max-h-[90vh]"
                body={
                    <AddProductVariants onVariantsUpdate={handleVariantsUpdate} />
                }
            />
        </>
    );
}; 