import React, { useState, useEffect, useRef } from 'react';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { Button, Input } from "@heroui/react";
import CustomModal from "@/components/admin/CustomModal";
import { MediaLibrary } from "@/components/common/MediaLibrary";
import Loader from "@/components/common/Loader";
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';

const AddEditCarousel = () => {
    const formRef = useRef(null);
    const [carousels, setCarousels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMediaLibrary, setShowMediaLibrary] = useState(false);
    const [editingCarousel, setEditingCarousel] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        link: '',
        imageURL: ''
    });
    const [toggleDelete, setToggleDelete] = useState(false);
    const db = getFirestore();

    useEffect(() => {
        fetchCarousels();
    }, []);

    const fetchCarousels = async () => {
        try {
            const snapshot = await getDocs(collection(db, "carousel"));
            const carouselData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCarousels(carouselData);
        } catch (error) {
            console.error("Error fetching carousels:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch carousels"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleImageSelect = (selectedUrls) => {
        setFormData(prev => ({
            ...prev,
            imageURL: selectedUrls[0]
        }));
        setShowMediaLibrary(false);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            link: '',
            imageURL: ''
        });
        setEditingCarousel(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.imageURL) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please select an image"
            });
            return;
        }

        try {
            if (editingCarousel) {
                // Update existing carousel
                await updateDoc(doc(db, "carousel", editingCarousel.id), {
                    name: formData.name,
                    link: formData.link,
                    imageURL: formData.imageURL
                });
                toast({
                    title: "Success",
                    description: "Carousel updated successfully",
                    variant: "success"
                });
            } else {
                // Add new carousel
                await addDoc(collection(db, "carousel"), {
                    name: formData.name,
                    link: formData.link,
                    imageURL: formData.imageURL
                });
                toast({
                    title: "Success",
                    description: "Carousel added successfully",
                    variant: "success"
                });
            }

            resetForm();
            fetchCarousels();
        } catch (error) {
            console.error("Error saving carousel:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to save carousel"
            });
        }
    };

    const handleEdit = (carousel) => {
        setEditingCarousel(carousel);
        setFormData({
            name: carousel.name,
            link: carousel.link || '',
            imageURL: carousel.imageURL
        });
        // Scroll to form section
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleDelete = async (carousel) => {
        setToggleDelete(carousel);
    };

    const confirmDelete = async () => {
        if (!toggleDelete) return;

        try {
            await deleteDoc(doc(db, "carousel", toggleDelete.id));
            toast({
                title: "Success",
                description: "Carousel deleted successfully",
                variant: "success"
            });
            fetchCarousels();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete carousel"
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
            <div ref={formRef} className="bg-white rounded-lg">
                <h2 className="text-xl font-semibold mb-4">
                    {editingCarousel ? 'Edit Carousel' : 'Add New Carousel'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input
                            size='sm'
                            type="text"
                            label="Name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            isRequired
                        />
                    </div>

                    <div>
                        <Input
                            size='sm'
                            type="url"
                            label="Link (optional)"
                            value={formData.link}
                            onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}

                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Image <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 flex items-center gap-4">
                            {formData.imageURL && (
                                <img
                                    src={formData.imageURL}
                                    alt="Selected"
                                    className="h-20 w-20 object-cover rounded"
                                />
                            )}
                            <Button
                                type="button"
                                variant="bordered"
                                onPress={() => setShowMediaLibrary(true)}
                            >
                                {formData.imageURL ? 'Change Image' : 'Select Image'}
                            </Button>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit">
                            {editingCarousel ? 'Update Carousel' : 'Add Carousel'}
                        </Button>
                        {editingCarousel && (
                            <Button
                                type="button"
                                variant="bordered"
                                onPress={resetForm}
                            >
                                Cancel Edit
                            </Button>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Active Carousels</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {carousels.map((carousel) => (
                        <div
                            key={carousel.id}
                            className="border rounded-lg p-4 space-y-3"
                        >
                            <img
                                src={carousel.imageURL}
                                alt={carousel.name}
                                className="w-full h-40 object-cover rounded"
                            />
                            <div>
                                <h3 className="font-medium">{carousel.name}</h3>
                                {carousel.link && (
                                    <a
                                        href={carousel.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-500 hover:underline"
                                    >
                                        {carousel.link}
                                    </a>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="bordered"
                                    onPress={() => handleEdit(carousel)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    color="danger"
                                    variant="bordered"
                                    onPress={() => handleDelete(carousel)}
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
                title="Select Image"
                body={
                    <MediaLibrary
                        onSelect={handleImageSelect}
                        multiple={false}
                        selectedImages={formData.imageURL ? [formData.imageURL] : []}
                        folder="carousel"
                        defaultUploadFolder="carousel"
                    />
                }
            />
        </div>
    );
};

export default AddEditCarousel; 