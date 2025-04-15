import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Slider, RadioGroup, Radio } from "@heroui/react";
import { toast } from "@/hooks/use-toast";
import { IoMdResize } from "react-icons/io";
import { MdZoomIn, MdZoomOut } from "react-icons/md";

const DIMENSION_PRESETS = {
    product: {
        name: 'Product (1:1)',
        width: 720,
        height: 720,
        aspectRatio: 1
    },
    carousel: {
        name: 'Carousel (1416:431)',
        width: 1416,
        height: 431,
        aspectRatio: 1416 / 431
    },
    portrait: {
        name: 'Portrait (3:4)',
        width: 720,
        height: 960,
        aspectRatio: 3 / 4
    }
};

const ImageProcessor = ({
    files,
    onProcessingComplete,
    onCancel,
    defaultPreset = 'product',
    outputFormat = 'webp',
    targetSizeKB = {
        min: 35,
        max: 80
    }
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreas, setCroppedAreas] = useState({});
    const [selectedFormat, setSelectedFormat] = useState(outputFormat);
    const [processing, setProcessing] = useState(false);
    const [compressionStats, setCompressionStats] = useState(null);
    const [selectedPreset, setSelectedPreset] = useState(defaultPreset);

    const formats = [
        { value: 'avif', label: 'AVIF (Best Compression)' },
        { value: 'webp', label: 'WebP (Good Balance)' },
        { value: 'jpeg', label: 'JPEG (Wide Support)' },
        { value: 'png', label: 'PNG (Lossless)' }
    ];

    const handlePresetChange = (preset) => {
        setSelectedPreset(preset);
        // Reset crop and zoom when changing preset
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        // Clear the cropped area for current image to force re-crop
        setCroppedAreas(prev => {
            const newAreas = { ...prev };
            delete newAreas[currentImageIndex];
            return newAreas;
        });
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreas(prev => ({
            ...prev,
            [currentImageIndex]: croppedAreaPixels
        }));
    }, [currentImageIndex]);

    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', error => reject(error));
            image.src = url;
        });

    const compressImage = async (canvas, format, targetSize, originalSize) => {
        // Start with higher quality for smaller files
        const initialQuality = Math.min(0.92, Math.max(0.7, 1 - (originalSize / 1024 - targetSize.min) / 1000));
        let quality = initialQuality;
        let blob = null;
        let attempts = 0;
        const maxAttempts = 8;

        // Binary search for the right quality level
        let low = 0.1;  // Minimum quality
        let high = 0.92; // Maximum quality

        while (attempts < maxAttempts) {
            attempts++;
            // Create blob with current quality
            blob = await new Promise(resolve => {
                canvas.toBlob(resolve, `image/${format}`, quality);
            });
            const size = blob.size / 1024; // Convert to KB
            // If we're within our target range, or this is our last attempt, use this result
            if ((size >= targetSize.min && size <= targetSize.max) || attempts === maxAttempts) {
                setCompressionStats({
                    quality: Math.round(quality * 100),
                    size: Math.round(size),
                    dimensions: `${canvas.width}x${canvas.height}`
                });
                break;
            }

            // Adjust quality based on result
            if (size > targetSize.max) {
                high = quality;
                quality = (low + quality) / 2;
            } else if (size < targetSize.min) {
                low = quality;
                quality = (quality + high) / 2;
            }
        }

        // If the final size is still too large, try reducing dimensions
        if (blob.size / 1024 > targetSize.max) {
            const scale = Math.sqrt(targetSize.max / (blob.size / 1024));
            const scaledCanvas = document.createElement('canvas');
            const ctx = scaledCanvas.getContext('2d');

            scaledCanvas.width = Math.floor(canvas.width * scale);
            scaledCanvas.height = Math.floor(canvas.height * scale);

            ctx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

            blob = await new Promise(resolve => {
                scaledCanvas.toBlob(resolve, `image/${format}`, quality);
            });

            setCompressionStats({
                quality: Math.round(quality * 100),
                size: Math.round(blob.size / 1024),
                dimensions: `${scaledCanvas.width}x${scaledCanvas.height}`
            });
        }

        return blob;
    };

    const getCroppedImg = async (imageSrc, pixelCrop, format) => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const preset = DIMENSION_PRESETS[selectedPreset];

        // Calculate scale to maintain aspect ratio and fit within preset dimensions
        const scale = Math.min(
            preset.width / pixelCrop.width,
            preset.height / pixelCrop.height
        );

        canvas.width = preset.width;
        canvas.height = preset.height;

        // Fill with white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Center the image if smaller than canvas
        const scaledWidth = pixelCrop.width * scale;
        const scaledHeight = pixelCrop.height * scale;
        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;

        // Use better image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw the cropped image
        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            x,
            y,
            scaledWidth,
            scaledHeight
        );

        // Get original file size for better compression starting point
        const originalSize = files[currentImageIndex].size / 1024;

        // Compress the image to target size
        return new Promise(async (resolve) => {
            try {
                let blob;
                if (format === 'avif') {
                    try {
                        blob = await compressImage(canvas, 'avif', targetSizeKB, originalSize);
                    } catch (error) {
                        toast({
                            title: "AVIF compression failed",
                            description: `falling back to WebP`,
                            variant: "warning"
                        });
                        blob = await compressImage(canvas, 'webp', targetSizeKB, originalSize);
                    }
                } else {
                    blob = await compressImage(canvas, format, targetSizeKB, originalSize);
                }

                // Final size check
                const finalSize = blob.size / 1024;
                if (finalSize > targetSizeKB.max * 1.1) { // Allow 10% margin
                    // throw new Error(`Unable to compress image to target size. Current: ${Math.round(finalSize)}KB`);
                    toast({
                        title: "Unable to compress image to target size",
                        description: `Current: ${Math.round(finalSize)}KB`,
                        variant: "destructive"
                    });
                }

                resolve(blob);
            } catch (error) {
                toast({
                    title: "Compression Warning",
                    description: error.message,
                    variant: "warning"
                });
                // Final fallback to JPEG with aggressive compression
                const blob = await compressImage(canvas, 'jpeg', {
                    min: targetSizeKB.min * 0.8,
                    max: targetSizeKB.max
                }, originalSize);
                resolve(blob);
            }
        });
    };

    const processImages = async () => {
        setProcessing(true);
        try {
            const processedImages = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const croppedArea = croppedAreas[i];

                if (!croppedArea) {
                    toast({
                        title: "Error",
                        description: `Please crop image ${i + 1} before proceeding.`,
                        variant: "destructive"
                    });
                    return;
                }

                const imageUrl = URL.createObjectURL(file);
                const croppedBlob = await getCroppedImg(
                    imageUrl,
                    croppedArea,
                    selectedFormat
                );

                if (!croppedBlob) {
                    throw new Error(`Failed to process image ${i + 1}`);
                }

                const processedFile = new File(
                    [croppedBlob],
                    `${file.name.split('.')[0]}.${selectedFormat}`,
                    { type: `image/${selectedFormat}` }
                );

                processedImages.push(processedFile);
                URL.revokeObjectURL(imageUrl);
            }

            onProcessingComplete(processedImages);
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to process images. Please try again.",
                variant: "destructive"
            });
        } finally {
            setProcessing(false);
        }
    };

    const handleNext = () => {
        if (currentImageIndex < files.length - 1) {
            setCurrentImageIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(prev => prev - 1);
        }
    };

    return (
        <Modal
            isOpen={true}
            onClose={onCancel}
            size="3xl"
            classNames={{
                base: "max-h-[96vh]s", // Limit modal height to 90% of viewport
                body: "p-0", // Remove default padding to have more control
            }}
        >
            <ModalContent>
                <ModalHeader className="border-b">
                    <h3 className="text-xl font-semibold">
                        Process Images ({currentImageIndex + 1}/{files.length})
                    </h3>
                </ModalHeader>
                <ModalBody>
                    <div className="max-h-[calc(90vh-80px)] overflow-y-auto">
                        <div className="space-y-4 p-6">
                            {/* Dimension Presets */}
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm font-medium mb-2">Select Dimensions:</p>
                                <RadioGroup
                                    value={selectedPreset}
                                    onValueChange={handlePresetChange}
                                    orientation="horizontal"
                                >
                                    {Object.entries(DIMENSION_PRESETS).map(([key, preset]) => (
                                        <Radio
                                            key={key}
                                            value={key}
                                            description={`${preset.width}x${preset.height}`}
                                        >
                                            {preset.name}
                                        </Radio>
                                    ))}
                                </RadioGroup>
                            </div>

                            {/* Instructions */}
                            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-2 rounded-lg">
                                <IoMdResize className="w-5 h-5" />
                                <p>Drag to move, scroll or use controls to zoom, drag corners to resize crop area</p>
                            </div>

                            {/* Cropper */}
                            <div className="relative h-[350px] w-full bg-gray-900 rounded-lg">
                                <Cropper
                                    image={URL.createObjectURL(files[currentImageIndex])}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={DIMENSION_PRESETS[selectedPreset].aspectRatio}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                    objectFit="contain"
                                    showGrid={true}
                                    cropShape="rect"
                                    classes={{
                                        containerClassName: "rounded-lg",
                                        cropAreaClassName: "!border-2 !border-white",
                                        mediaClassName: "rounded-lg"
                                    }}
                                />
                            </div>

                            {/* Zoom Controls */}
                            <div className="flex items-center justify-center gap-4">
                                <div className="flex items-center gap-2 w-1/2">
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="flat"
                                        onPress={() => setZoom(Math.max(1, zoom - 0.1))}
                                    >
                                        <MdZoomOut className="w-5 h-5" />
                                    </Button>
                                    <Slider
                                        size="sm"
                                        step={0.1}
                                        maxValue={3}
                                        minValue={1}
                                        value={zoom}
                                        onChange={setZoom}
                                        className="w-[200px]"
                                        aria-label="Zoom"
                                    />
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="flat"
                                        onPress={() => setZoom(Math.min(3, zoom + 0.1))}
                                    >
                                        <MdZoomIn className="w-5 h-5" />
                                    </Button>
                                </div>
                                <Select
                                    label="Format"
                                    value={selectedFormat}
                                    onChange={(e) => setSelectedFormat(e.target.value)}
                                    className="w-[250px] sm:w-1/4"
                                    classNames={{
                                        base: "l",
                                        trigger: "min-h-10 h-8 py-0", // Reduced height and padding
                                        innerWrapper: "py-0", // Remove padding from inner wrapper
                                        value: "text-small" // Optional: adjust text size if needed
                                    }}
                                    size="sm"
                                >
                                    {formats.map((format) => (
                                        <SelectItem key={format.value} value={format.value}>
                                            {format.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>

                            {/* Compression Stats */}
                            {compressionStats && (
                                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg flex items-center justify-between">
                                    <span>Quality: {compressionStats.quality}%</span>
                                    <span>Size: {compressionStats.size}KB</span>
                                    <span>Dimensions: {compressionStats.dimensions}</span>
                                </div>
                            )}

                            {/* Navigation Controls */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="flat"
                                        disabled={currentImageIndex === 0}
                                        onPress={handlePrevious}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="flat"
                                        disabled={currentImageIndex === files.length - 1}
                                        onPress={handleNext}
                                    >
                                        Next
                                    </Button>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Image {currentImageIndex + 1} of {files.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className="border-t">
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="bordered"
                            onPress={onCancel}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            onPress={processImages}
                            disabled={processing}
                        >
                            {processing ? 'Processing...' : 'Done'}
                        </Button>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ImageProcessor; 