"use client"

import React, { useState } from 'react';
import { Button, Card } from "@heroui/react";
import { toast } from "@/hooks/use-toast";
import ImageProcessor from '@/components/common/ImageProcessor';
import { IoCloudUpload } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import JSZip from 'jszip';

const ImageCompressor = () => {
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [processedFiles, setProcessedFiles] = useState([]);
    const [showProcessor, setShowProcessor] = useState(false);

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        // Validate files
        const validFiles = files.filter(file => {
            const isValid = file.type.startsWith('image/');
            if (!isValid) {
                toast({
                    title: "Invalid file",
                    description: `${file.name} is not an image file.`,
                    variant: "destructive"
                });
            }
            return isValid;
        });

        if (validFiles.length > 0) {
            setSelectedFiles(validFiles);
            setShowProcessor(true);
        }
        event.target.value = '';
    };

    const handleProcessingComplete = (processed) => {
        setProcessedFiles(processed);
        setShowProcessor(false);
        setSelectedFiles(null);
        toast({
            title: "Success",
            description: `${processed.length} image(s) processed successfully!`,
            variant: "success"
        });
    };

    const downloadFile = (file) => {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const downloadAll = async () => {
        if (processedFiles.length === 0) return;

        if (processedFiles.length === 1) {
            downloadFile(processedFiles[0]);
            return;
        }

        // Create zip file for multiple images
        const zip = new JSZip();
        processedFiles.forEach((file, index) => {
            zip.file(file.name, file);
        });

        try {
            const content = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = "compressed-images.zip";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create download package",
                variant: "destructive"
            });
        }
    };

    const clearProcessed = () => {
        setProcessedFiles([]);
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">Image Compressor</h1>
                    <p className="text-gray-600">
                        Compress and resize your images while maintaining quality.
                        Supports AVIF, WebP, JPEG, and PNG formats.
                    </p>
                </div>

                {/* Upload Area */}
                {!showProcessor && (
                    <Card className="p-8">
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer flex flex-col items-center gap-2"
                                >
                                    <IoCloudUpload className="w-12 h-12 text-gray-400" />
                                    <span className="text-gray-600">
                                        Click to upload or drag and drop
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        Supports: JPG, PNG, WebP, AVIF
                                    </span>
                                </label>
                            </div>

                            {/* Processed Files List */}
                            {processedFiles.length > 0 && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold">
                                            Processed Images ({processedFiles.length})
                                        </h3>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="bordered"
                                                onClick={clearProcessed}
                                            >
                                                Clear All
                                            </Button>
                                            <Button
                                                size="sm"
                                                color="primary"
                                                onClick={downloadAll}
                                                startContent={<FiDownload />}
                                            >
                                                Download {processedFiles.length > 1 ? 'All' : ''}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                                        {processedFiles.map((file, index) => (
                                            <Card
                                                key={index}
                                                className="p-4 flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                                        <img
                                                            src={URL.createObjectURL(file)}
                                                            alt={`Preview ${index + 1}`}
                                                            className="max-w-full max-h-full object-contain"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm truncate max-w-[200px]">
                                                            {file.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {(file.size / 1024).toFixed(1)} KB
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="bordered"
                                                    isIconOnly
                                                    onClick={() => downloadFile(file)}
                                                >
                                                    <FiDownload className="w-4 h-4" />
                                                </Button>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                )}

                {/* Image Processor Modal */}
                {showProcessor && selectedFiles && (
                    <ImageProcessor
                        files={selectedFiles}
                        onProcessingComplete={handleProcessingComplete}
                        onCancel={() => {
                            setShowProcessor(false);
                            setSelectedFiles(null);
                        }}
                        defaultPreset="product"
                    />
                )}
            </div>
        </div>
    );
};

export default ImageCompressor; 