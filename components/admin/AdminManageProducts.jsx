"use client";

import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import Loader from "@/components/common/Loader";
import { Button } from "@heroui/react";
import useProductStore from "@/hooks/useProductStore";
import CustomModal from "@/components/admin/CustomModal";
import { IoAddCircleOutline } from "react-icons/io5";
import EmptyMessage from "@/components/common/EmptyMessage";
import { PRODUCTS } from "@/utilities/functions"; // Import the PRODUCTS object
import { toast } from "@/hooks/use-toast";
import { AddEditProducts } from "@/components/admin/AddEditProducts";

const AdminManageProducts = () => {
    const { getCurrentProducts, setProducts, initializeCategory } = useProductStore();
    const products = getCurrentProducts();
    const [loading, setLoading] = useState(true);
    const [modalState, setModalState] = useState({ mode: null, product: null });
    const [productToDelete, setProductToDelete] = useState(null);
    const [file, setFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState("");
    const db = getFirestore();

    // Initialize the 'all' category on component mount
    useEffect(() => {
        initializeCategory('all');
    }, [initializeCategory]);

    // Functions
    const handleUpload = async () => {
        if (!file) {
            setUploadMessage("Please select a file.");
            return;
        }
        try {
            const response = await PRODUCTS.UPLOAD_PRODUCTS_FROM_EXCEL(db, file);
            if (!response.error) {
                // Show success toast
                toast({
                    variant: "success",
                    title: response.message,
                });
                setModalState({ mode: null, product: null }); // Close the modal
                fetchProducts();
            } else {
                // Handle error case
                toast({
                    variant: "destructive",
                    title: response.message,
                });
            }
        } catch (error) {
            setUploadMessage(error.message);
        }
    };

    // Modal Config for Add, Edit and Delete
    const modalConfig = {
        add: {
            title: "Create Product",
            body: <AddEditProducts
                onCancel={() => setModalState({ mode: null, product: null })}
                onSuccess={() => {
                    fetchProducts();
                    setModalState({ mode: null, product: null });
                }}
            />,
            footer: ""
        },
        edit: {
            title: "Update Product",
            body: <AddEditProducts
                productToEdit={modalState.product}
                onCancel={() => setModalState({ mode: null, product: null })}
                onSuccess={() => {
                    fetchProducts();
                    setModalState({ mode: null, product: null });
                }}
            />,
            footer: ""
        },
        upload: {
            title: "Upload Products",
            body:
                <div className="flex flex-col justify-center gap-2">
                    <p className="text-sm font-bold">Upload Excel file containing products data</p>
                    <input type="file" accept=".xlsx, .xls" onChange={(event) => setFile(event.target.files[0])} />
                    {uploadMessage && <p>{uploadMessage}</p>}
                </div>,
            footer:
                <Button onPress={handleUpload}>Upload</Button>
        },
        delete: {
            title: "Confirm Deletion",
            body: <div> Do you really wanna delete "<span className="font-bold text-red-600">{productToDelete?.name}</span>"?</div>,
            footer: <>
                <Button size="sm" color="success" variant="bordered" className="font-bold rounded-xl border text-green-700 hover:bg-green-600 hover:text-white transition duration-200" onPress={() => setModalState({ mode: null, product: null })}>Cancel</Button>
                <Button size="sm" color="danger" variant="bordered" className="font-bold rounded-xl border text-red-700 hover:bg-red-600 hover:text-white transition duration-200" onPress={() => productToDelete && handleDelete(productToDelete.id)}>Delete</Button>
            </>,
        },
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const snapshot = await getDocs(collection(db, "products"));
            const productsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProducts(productsData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "products", id));
            // After deletion, update the store with filtered products
            setProducts(getCurrentProducts().filter((product) => product.id !== id));
        } catch (error) {
            console.error("Error deleting product:", error);
        }
        setModalState({ mode: null, product: null });
    };

    // Modal for Adding Product
    const openAddProductModal = () => {
        setModalState({ mode: 'add', product: null });
    };

    // Modal for Updating Product
    const openUpdateProductModal = (product) => {
        setModalState({ mode: 'edit', product });
    };

    // Modal for Deleting Product
    const openDeleteProductModal = (product) => {
        setModalState({ mode: 'delete', product });
        setProductToDelete(product);
    };

    const handleFormSubmit = async (data) => {
        if (modalState.mode === 'edit') {
            toast({ variant: "success", title: "Updating product with data:", data })
        } else {
            toast({ variant: "success", title: "Adding product with data:", data })
        }
        setModalState({ mode: null, product: null });
    };

    const openBulkUploadProductModal = () => {
        setModalState({ mode: 'upload', product: null });
    };


    if (loading) return <Loader />;

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-3">
                <Button
                    size="sm"
                    variant="bordered"
                    color="primary"
                    onPress={openBulkUploadProductModal}
                    className={`rounded-xl text-sm font-bold border text-blue-600 hover:bg-blue-400  hover:text-white`}
                    startContent={<IoAddCircleOutline size={17} />}
                >
                    Add Bulk
                </Button>
                <Button
                    size="sm"
                    variant="bordered"
                    color="primary"
                    onPress={openAddProductModal}
                    className={`rounded-xl text-sm font-bold border text-indigo-600 hover:bg-indigo-400  hover:text-white`}
                    startContent={<IoAddCircleOutline size={17} />}
                >
                    Add
                </Button>
            </div>
            {/* Table: Products list */}
            {products && products.length > 0 ? (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Image
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Code
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <img
                                                src={product.imageURL}
                                                alt={product.name}
                                                className="h-10 w-10 rounded-full 
                                                object-cover"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{product.productCode}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{product.isActive ? "Active" : "Inactive"}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <Button
                                                size="sm"
                                                variant="bordered"
                                                className="text-indigo-600 rounded-xl border hover:text-indigo-900 hover:bg-indigo-200 font-bold mr-3"
                                                onPress={() => openUpdateProductModal(product)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="bordered"
                                                className="text-red-600 rounded-xl border hover:text-red-900 hover:bg-red-200 font-bold"
                                                onPress={() => openDeleteProductModal(product)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <EmptyMessage title="Inventory is empty!" message="It seems there are no products available at the moment." />
            )}
            <CustomModal
                contentClassName="max-h-[50vh] sm:max-h-[90vh]"
                size={modalState.mode === 'delete' || modalState.mode === 'upload' ? "sm" : "xl"}
                isOpen={modalState.mode !== null}
                onClose={() => setModalState({ mode: null, product: null })}
                onSubmit={handleFormSubmit}
                title={modalConfig[modalState.mode]?.title}
                body={modalConfig[modalState.mode]?.body}
                footer={modalConfig[modalState.mode]?.footer}
            />
        </div>
    );
};

export default AdminManageProducts;