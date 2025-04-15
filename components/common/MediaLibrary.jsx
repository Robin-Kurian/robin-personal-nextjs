import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { Button, Checkbox, Chip, Input, Select, SelectItem } from "@heroui/react";
import { toast } from "@/hooks/use-toast";
import Loader from "@/components/common/Loader";
import { IoTrash } from "react-icons/io5";
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';
import ImageProcessor from './ImageProcessor';

export const MediaLibrary = ({
    onSelect,
    multiple = false,
    selectedImages = [],
    folder = "all",
    defaultUploadFolder = "products",
    isManagement = false,
    allowFolderChange = false,
    availableFolders = null,
    onUploadStateChange
}) => {
    const [images, setImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState(new Set(selectedImages));
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadFolder, setUploadFolder] = useState(defaultUploadFolder);
    const [toggleDelete, setToggleDelete] = useState(false)
    const [showImageProcessor, setShowImageProcessor] = useState(false);
    const [filesToProcess, setFilesToProcess] = useState(null);

    const db = getFirestore();
    const types = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
        "image/avif",
        "image/svg+xml",
        "image/gif"
    ];

    const folders = availableFolders || [
        { id: "products", name: "Product Images" },
        { id: "categories", name: "Category Images" },
        { id: "carousel", name: "Carousel Images" },
    ];

    const MAX_FILE_SIZE = uploadFolder === 'categories' ? 1 * 1024 * 1024 : 5 * 1024 * 1024; // 1MB for thumbnails, 5MB for others
    const MAX_DIMENSIONS = uploadFolder === 'categories' ? { width: 400, height: 400 } : null; // Max dimensions for thumbnails

    useEffect(() => {
        fetchImages();
    }, [folder]);

    const fetchImages = async () => {
        try {
            const mediaRef = collection(db, "media");
            let q;

            if (folder === "all") {
                q = query(mediaRef);
            } else {
                q = query(mediaRef, where("folder", "==", folder));
            }

            const snapshot = await getDocs(q);
            const mediaData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Sort by uploadedAt in descending order (newest first)
            mediaData.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
            setImages(mediaData);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error fetching images",
                description: error.message
            });
        } finally {
            setIsLoading(false);
        }
    };

    const generateUniqueFileName = (file) => {
        const timestamp = new Date().getTime();
        const randomString = Math.random().toString(36).substring(2, 8);
        const extension = file.name.split('.').pop();
        return `${timestamp}-${randomString}.${extension}`;
    };

    const checkImageDimensions = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    if (MAX_DIMENSIONS && (img.width > MAX_DIMENSIONS.width || img.height > MAX_DIMENSIONS.height)) {
                        reject(new Error(`Image dimensions must be ${MAX_DIMENSIONS.width}x${MAX_DIMENSIONS.height}px or smaller`));
                    } else {
                        resolve();
                    }
                };
            };
        });
    };

    const handleFileUpload = async (event) => {
        const files = Array.from(event.target.files);
        const validFiles = [];

        for (const file of files) {
            if (!types.includes(file.type)) {
                toast({
                    variant: "destructive",
                    title: "Invalid file type",
                    description: `File "${file.name}" is not a valid image type.`
                });
                continue;
            }
            if (file.size > MAX_FILE_SIZE) {
                toast({
                    variant: "destructive",
                    title: "File too large",
                    description: `File "${file.name}" exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit.`
                });
                continue;
            }

            validFiles.push(file);
        }

        if (validFiles.length === 0) {
            return;
        }

        setFilesToProcess(validFiles);
        setShowImageProcessor(true);
        event.target.value = '';
    };

    const handleProcessedImages = async (processedFiles) => {
        setShowImageProcessor(false);
        setIsUploading(true);
        onUploadStateChange?.(true);

        try {
            for (const file of processedFiles) {
                const uniqueFileName = generateUniqueFileName(file);
                const storageRef = ref(storage, `images/${uploadFolder}/${uniqueFileName}`);

                try {
                    await uploadBytes(storageRef, file);
                    const url = await getDownloadURL(storageRef);

                    await addDoc(collection(db, "media"), {
                        name: file.name,
                        fileName: uniqueFileName,
                        url: url,
                        type: file.type,
                        folder: uploadFolder,
                        uploadedAt: new Date().toISOString(),
                        size: file.size,
                        dimensions: await getImageDimensions(file)
                    });
                } catch (uploadError) {
                    console.error(uploadError)
                    toast({
                        variant: "destructive",
                        title: "Upload failed",
                        description: `Failed to upload "${file.name}". ${uploadError.message}`
                    });
                    continue;
                }
            }

            toast({
                title: "Success",
                description: `${processedFiles.length} image(s) uploaded successfully`,
                variant: "success"
            });

            fetchImages();
        } catch (error) {
            console.error(error)
            toast({
                variant: "destructive",
                title: "Upload failed",
                description: "An error occurred during the upload process."
            });
        } finally {
            setIsUploading(false);
            onUploadStateChange?.(false);
            setFilesToProcess(null);
        }
    };

    const getImageDimensions = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    resolve({
                        width: img.width,
                        height: img.height
                    });
                };
            };
        });
    };

    const handleImageSelect = (image) => {
        if (!multiple) {
            // Single selection mode
            const newSelected = new Set([image.url]);
            setSelectedFiles(newSelected);
            onSelect(Array.from(newSelected));
        } else {
            // Multiple selection mode
            const newSelected = new Set(selectedFiles);
            if (newSelected.has(image.url)) {
                newSelected.delete(image.url);
            } else {
                newSelected.add(image.url);
            }
            setSelectedFiles(newSelected);
            onSelect(Array.from(newSelected));
        }
    };

    const handleDeleteImage = async (image, e) => {
        setToggleDelete(image); // Store the image object directly in toggleDelete
    };

    const confirmDelete = async () => {
        if (!toggleDelete) return;

        try {
            // Delete from Storage
            const storageRef = ref(storage, `images/${toggleDelete.folder}/${toggleDelete.fileName}`);
            try {
                await deleteObject(storageRef);
            } catch (storageError) {
                // If file doesn't exist in storage, continue with Firestore deletion
                if (storageError.code === 'storage/object-not-found') {
                    toast({ variant: "destructive", title: "File not found in storage, proceeding with database cleanup" })
                } else {
                    toast({ variant: "destructive", title: storageError.message || storageError || "Storage Error" })
                    throw storageError;
                }
            }

            // Delete from Firestore
            await deleteDoc(doc(db, "media", toggleDelete.id));

            // Remove from selected files if it was selected
            const newSelected = new Set(selectedFiles);
            if (newSelected.has(toggleDelete.url)) {
                newSelected.delete(toggleDelete.url);
                setSelectedFiles(newSelected);
                onSelect(Array.from(newSelected));
            }

            // Update UI
            setImages(prevImages => prevImages.filter(img => img.id !== toggleDelete.id));

            toast({
                title: "Success",
                description: "Image deleted successfully",
                variant: "success"
            });
        } catch (error) {
            // toast({
            //     variant: "destructive",
            //     title: "Error",
            //     description: "Failed to delete image. Please try again."
            // });

            console.error('Delete error:', error);

            // Handle specific error cases
            if (error.code === 'storage/unauthorized') {
                toast({
                    title: "Error",
                    description: "You don't have permission to delete this file",
                    variant: "destructive"
                });
            } else if (error.code === 'storage/cancelled') {
                toast({
                    title: "Error",
                    description: "Delete operation was cancelled",
                    variant: "destructive"
                });
            } else if (error.code === 'storage/unknown') {
                // Try to delete from Firestore anyway if storage deletion fails
                try {
                    await deleteDoc(doc(db, "media", toggleDelete.id));
                    setImages(prevImages => prevImages.filter(img => img.id !== toggleDelete.id));
                    toast({
                        title: "Partial Success",
                        description: "Database entry removed but storage cleanup failed",
                        variant: "warning"
                    });
                } catch (firestoreError) {
                    toast({
                        title: "Error",
                        description: "Failed to delete image. Please try again.",
                        variant: "destructive"
                    });
                }
            } else {
                toast({
                    title: "Error",
                    description: "Failed to delete image. Please try again.",
                    variant: "destructive"
                });
            }
        } finally {
            setToggleDelete(false);
        }
    };

    if (isLoading) return <Loader />;

    return (
        <div className="flex flex-col gap-6">
            {showImageProcessor && filesToProcess && (
                <ImageProcessor
                    files={filesToProcess}
                    onProcessingComplete={handleProcessedImages}
                    onCancel={() => {
                        setShowImageProcessor(false);
                        setFilesToProcess(null);
                    }}
                    aspectRatio={1}
                    outputFormat="webp"
                    quality={0.8}
                    maxWidth={1200}
                />
            )}
            <DeleteConfirmationModal
                size="sm"
                isOpen={Boolean(toggleDelete)}
                onClose={() => setToggleDelete(false)}
                onConfirm={confirmDelete}
                item={toggleDelete?.name || "this image"}
            />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">
                        {folder === "all" ? "All Images" : `${folders.find(folder => folder.id === folder)?.name || ''}`}
                    </h3>
                    <Chip className={`text-sm font-semibold ${images.length < 150 ? 'bg-green-100' : images.length < 250 ? 'bg-yellow-100' : 'bg-red-100'}`}>
                        {images.length}
                    </Chip>
                </div>
                <div className="flex items-stretch sm:items-center gap-4 w-full sm:w-auto">
                    {allowFolderChange && (
                        <Select
                            label="Choose Folder"
                            value={uploadFolder}
                            onChange={(e) => setUploadFolder(e.target.value)}
                            className="w-[180px]"
                            classNames={{
                                base: "w-full",
                                trigger: "min-h-8 h-8 py-0", // Reduced height and padding
                                innerWrapper: "py-0", // Remove padding from inner wrapper
                                value: "text-small" // Optional: adjust text size if needed
                            }}
                            size="sm"
                        >
                            {folders.map((folder) => (
                                <SelectItem key={folder.id} value={folder.id}>
                                    {folder.name}
                                </SelectItem>
                            ))}
                        </Select>
                    )}
                    <div className="flex items-center gap-4">
                        <Input
                            type="file"
                            label=""
                            size='sm'
                            onChange={handleFileUpload}
                            accept={types.join(',')}
                            multiple
                            disabled={isUploading}
                            classNames={{
                                input: "opacity-0 w-full h-full cursor-pointer z-10 absolute inset-0", // Make input cover the entire area but invisible
                                inputWrapper: "relative bg-white hover:bg-white shadow-none",
                                innerWrapper: "relative hover:bg-white"
                            }}
                            startContent={
                                <Button
                                    as="span"
                                    className="pointer-events-none text-sm" // Important: prevent button from capturing clicks
                                    size="sm"
                                    color="primary"
                                >
                                    Upload Images
                                </Button>
                            }
                        />
                        {isUploading && <Loader size="sm" />}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3  gap-4">
                {images.map((image) => (
                    <div
                        key={image.id}
                        className="relative group cursor-pointer border rounded-lg p-3 hover:border-blue-500 transition-colors bg-white"
                        onClick={() => !isManagement && handleImageSelect(image)}
                    >
                        <div className={`absolute top-3 ${isManagement && "right-3"} z-10 flex items-center justify-between gap-2`}>
                            {isManagement &&
                                <Button
                                    size="sm"
                                    color="danger"
                                    variant="flat"
                                    isIconOnly
                                    className="flex opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm h-[32px] w-[32px] min-w-[32px]"
                                    onPress={(e) => handleDeleteImage(image, e)}
                                >
                                    <IoTrash className="h-4 w-4" />
                                </Button>}
                            {!isManagement && (
                                <Checkbox
                                    size="sm"
                                    isSelected={selectedFiles.has(image.url)}
                                    onChange={() => handleImageSelect(image)}
                                    className="flex opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm h-[32px] w-[32px] min-w-[32px]  rounded-lg"

                                // className="bg-white/80 rounded-md backdrop-blur-sm h-[32px] w-[32px]"
                                />
                            )}
                        </div>
                        <div className="aspect-square overflow-hidden rounded-md mb-3">
                            <img
                                src={image.url}
                                alt={image.name}
                                className={`w-full h-full object-contain rounded-md ${selectedFiles.has(image.url) ? 'ring-2 ring-blue-500' : ''
                                    }`}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-xs text-gray-700 font-medium truncate" title={image.name}>
                                {image.name}
                            </p>
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-xs text-gray-400">
                                    {new Date(image.uploadedAt).toLocaleDateString()}
                                </p>
                                {isManagement && (
                                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full truncate max-w-[100px]" title={folders.find(folder => folder.id === image.folder)?.name || image.folder}>
                                        {folders.find(folder => folder.id === image.folder)?.name || image.folder}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}; 