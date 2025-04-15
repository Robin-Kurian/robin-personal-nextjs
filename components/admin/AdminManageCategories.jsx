import React, { useState, useEffect, useRef } from 'react';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { Button, Input } from "@heroui/react";
import CustomModal from "@/components/admin/CustomModal";
import { MediaLibrary } from "@/components/common/MediaLibrary";
import Loader from "@/components/common/Loader";
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';
import { RiImageAddLine, RiImageEditLine } from "react-icons/ri";
import { CiImageOff } from "react-icons/ci";

const AdminManageCategories = ({ onClose }) => {
    const formRef = useRef(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMediaLibrary, setShowMediaLibrary] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        thumbnailURL: '',
        order: 0
    });
    const [toggleDelete, setToggleDelete] = useState(false);
    const db = getFirestore();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const snapshot = await getDocs(collection(db, "categories"));
            const categoryData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Sort categories by order
            categoryData.sort((a, b) => (a.order || 0) - (b.order || 0));
            setCategories(categoryData);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch categories"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleImageSelect = (selectedUrls) => {
        setFormData(prev => ({
            ...prev,
            thumbnailURL: selectedUrls[0]
        }));
        setShowMediaLibrary(false);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            thumbnailURL: '',
            order: 0
        });
        setEditingCategory(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please enter a category name"
            });
            return;
        }

        try {
            const categoryData = {
                name: formData.name,
                order: parseInt(formData.order) || 0,
                updatedAt: new Date().toISOString()
            };

            // Only add thumbnailURL if it exists
            if (formData.thumbnailURL) {
                categoryData.thumbnailURL = formData.thumbnailURL;
            }

            if (editingCategory) {
                // Update existing category
                await updateDoc(doc(db, "categories", editingCategory.id), categoryData);
                toast({
                    title: "Success",
                    description: "Category updated successfully",
                    variant: "success"
                });
            } else {
                // Add new category
                categoryData.createdAt = new Date().toISOString();
                await addDoc(collection(db, "categories"), categoryData);
                toast({
                    title: "Success",
                    description: "Category added successfully",
                    variant: "success"
                });
            }

            resetForm();
            await fetchCategories();
        } catch (error) {
            console.error("Error saving category:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to save category"
            });
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            thumbnailURL: category.thumbnailURL || '',
            order: category.order || 0
        });
        // Scroll to form section
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleDelete = async (category) => {
        // Check if category is being used by any products
        try {
            const productsRef = collection(db, "products");
            const productsSnapshot = await getDocs(productsRef);
            const isUsed = productsSnapshot.docs.some(doc => {
                const product = doc.data();
                return product.category === category.id;
            });

            if (isUsed) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Cannot delete category as it is being used by products"
                });
                return;
            }

            setToggleDelete(category);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to check category usage"
            });
        }
    };

    const confirmDelete = async () => {
        if (!toggleDelete) return;

        try {
            await deleteDoc(doc(db, "categories", toggleDelete.id));
            toast({
                title: "Success",
                description: "Category deleted successfully",
                variant: "success"
            });
            fetchCategories();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete category"
            });
        } finally {
            setToggleDelete(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <DeleteConfirmationModal
                isOpen={Boolean(toggleDelete)}
                onClose={() => setToggleDelete(false)}
                onConfirm={confirmDelete}
                item={toggleDelete?.name}
            />
            <div ref={formRef} className="bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        {editingCategory ? 'Edit Category' : 'Add New Category'}
                    </h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className='space-y-4'>
                        {/* First row: Name and Order fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                type="text"
                                size='sm'
                                variant='bordered'
                                radius='md'
                                label='Name'
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                isRequired
                                classNames={{
                                    inputWrapper: "min-h-10 h-8 py-0"
                                }}
                            />
                            <Input
                                type="number"
                                size='sm'
                                variant='bordered'
                                radius='md'
                                label='Display Order'
                                value={formData.order}
                                onChange={(e) => setFormData(prev => ({ ...prev, order: e.target.value }))}
                                classNames={{
                                    inputWrapper: "min-h-10 h-8 py-0"
                                }}
                            />
                        </div>

                        {/* Second row: Thumbnail and Actions */}
                        <div className="grid grid-cols-2 gap-4 items-start">
                            <div className="space-y-4">
                                {formData.thumbnailURL && (
                                    <img
                                        src={formData.thumbnailURL}
                                        alt="Selected"
                                        className="h-32 w-full object-cover rounded"
                                    />
                                )}
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        type="button"
                                        variant="bordered"
                                        onPress={() => setShowMediaLibrary(true)}
                                        className='text-sm text-gray-400'
                                        startContent={formData.thumbnailURL ? <RiImageEditLine />
                                            :
                                            <RiImageAddLine />
                                        }
                                    >
                                        {formData.thumbnailURL ? 'Change Thumbnail' : 'Upload Thumbnail'}
                                    </Button>
                                    {formData.thumbnailURL && (
                                        <Button
                                            type="button"
                                            variant="bordered"
                                            color="danger"
                                            onPress={() => setFormData(prev => ({ ...prev, thumbnailURL: '' }))}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 justify-end h-full">
                                <Button type="submit" color='primary' className="w-full sm:w-auto">
                                    {editingCategory ? 'Update' : 'Add Category'}
                                </Button>
                                {editingCategory && (
                                    <Button
                                        type="button"
                                        color='danger'
                                        variant="bordered"
                                        onPress={resetForm}
                                        className="w-full sm:w-auto"
                                    >
                                        Cancel Edit
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div className="bg-white">
                <h2 className="text-xl font-semibold mb-4">Categories List</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="border rounded-lg p-4 space-y-3 hover:border-blue-500 transition-colors"
                        >
                            <div className="aspect-square overflow-hidden rounded-lg">
                                {category.thumbnailURL ?

                                    <img
                                        src={category.thumbnailURL}
                                        alt={category.name}
                                        className="w-full h-full object-cover"
                                    /> :
                                    <div className="w-full h-full object-cover">
                                        <CiImageOff size={135} /></div>
                                }
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-medium">{category.name}</h3>
                                <p className="text-sm text-gray-500">Order: {category.order || 0}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="bordered"
                                    onPress={() => handleEdit(category)}
                                    className="flex-1"
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    color="danger"
                                    variant="bordered"
                                    onPress={() => handleDelete(category)}
                                    className="flex-1"
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <CustomModal
                isOpen={showMediaLibrary}
                onClose={() => setShowMediaLibrary(false)}
                title="Select/Upload Thumbnail"
                contentClassName='max-h-[50vh]'
                size="sm"
                body={
                    <MediaLibrary
                        onSelect={handleImageSelect}
                        multiple={false}
                        selectedImages={formData.thumbnailURL ? [formData.thumbnailURL] : []}
                        folder="categories"
                        defaultUploadFolder="categories"
                    />
                }
            />
        </div>
    );
};

export default AdminManageCategories;
