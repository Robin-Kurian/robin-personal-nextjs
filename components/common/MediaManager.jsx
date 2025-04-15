import { Button, Input, Select, SelectItem } from "@heroui/react";
import { MediaLibrary } from "@/components/common/MediaLibrary";
import { IoAddCircleOutline } from "react-icons/io5";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import CustomModal from "../admin/CustomModal";
import Loader from "@/components/common/Loader";

export const MediaManager = () => {
    const [selectedFolder, setSelectedFolder] = useState("all");
    const [showAddFolder, setShowAddFolder] = useState(false);
    const [newFolder, setNewFolder] = useState({ id: "", name: "" });
    const [isUploading, setIsUploading] = useState(false);
    const [customFolders, setCustomFolders] = useState(() => {
        const saved = localStorage.getItem('customImageFolders');
        return saved ? JSON.parse(saved) : [];
    });

    // Default folders that cannot be removed
    const defaultFolders = [
        { id: "all", name: "All Images" },
        { id: "products", name: "Product Images" },
        { id: "categories", name: "Category Images" },
        { id: "carousel", name: "Carousel Images" },
    ];

    const folders = [...defaultFolders, ...customFolders];

    const validateFolderId = (id) => {
        return /^[a-z0-9-]+$/.test(id);
    };

    const handleAddFolder = () => {
        if (!newFolder.id || !newFolder.name) {
            toast({
                variant: "destructive",
                title: "Validation Error",
                description: "Both ID and Name are required."
            });
            return;
        }

        if (!validateFolderId(newFolder.id)) {
            toast({
                variant: "destructive",
                title: "Invalid ID",
                description: "ID must contain only lowercase letters, numbers, and hyphens."
            });
            return;
        }

        if (folders.some(cat => cat.id === newFolder.id)) {
            toast({
                variant: "destructive",
                title: "Duplicate ID",
                description: "This folder ID already exists."
            });
            return;
        }

        const updatedFolders = [...customFolders, newFolder];
        setCustomFolders(updatedFolders);
        localStorage.setItem('customImageFolders', JSON.stringify(updatedFolders));

        toast({
            title: "Success",
            description: "New folder added successfully",
            variant: "success"
        });

        setNewFolder({ id: "", name: "" });
        setShowAddFolder(false);
    };

    return (
        <div className="space-y-6">
            {/* block1 */}
            <div className="flex items-start sm:items-center justify-between">
                <Select
                    selectedKeys={[selectedFolder]}
                    label="Filter Images"
                    onChange={(e) => { e.target.value !== "addFolder" && setSelectedFolder(e.target.value) }}
                    className="w-[180px]"
                    classNames={{
                        base: "w-full",
                        trigger: "min-h-10 h-8 py-0", 
                        innerWrapper: "py-0", 
                        value: "text-small" 
                    }}
                    size="sm"
                >
                    {folders.map((folder) => (
                        <SelectItem key={folder.id} value={folder.id}>
                            {folder.name}
                        </SelectItem>
                    ))}
                    <SelectItem key="addFolder" value="Add folder" color="primary"
                        onPress={() => setShowAddFolder(true)}
                        startContent={<IoAddCircleOutline size={20} />}>
                        Add new folder
                    </SelectItem>
                </Select>
            </div>
            {/* Loader */}
            {isUploading && (
                <div className="flex items-center justify-center min-h-[100px]">
                    <Loader />
                </div>
            )}
            {/* block 2 */}
            <div className="bg-white rounded-lg shadow-sm">
                <MediaLibrary
                    onSelect={() => { }}
                    multiple={true}
                    folder={selectedFolder}
                    defaultUploadFolder="products"
                    isManagement={true}
                    allowFolderChange={true}
                    availableFolders={folders.filter(cat => cat.id !== "all")}
                    onUploadStateChange={setIsUploading}
                />
            </div>
            <CustomModal
                isOpen={showAddFolder}
                onClose={() => { setShowAddFolder(false) }}
                title="Add New folder"
                size="sm"
                body={
                    <div className="space-y-4">
                        <Input
                            label="Folder ID"
                            placeholder="e.g., blog-images"
                            value={newFolder.id}
                            onChange={(e) => setNewFolder(prev => ({ ...prev, id: e.target.value.toLowerCase() }))}
                            helperText="Use lowercase letters, numbers, and hyphens only"
                            size="sm"
                            classNames={{
                                label: "text-small font-medium"
                            }}
                        />
                        <Input
                            label="Folder Name"
                            placeholder="e.g., Blog Images"
                            value={newFolder.name}
                            onChange={(e) => setNewFolder(prev => ({ ...prev, name: e.target.value }))}
                            size="sm"
                            classNames={{
                                label: "text-small font-medium"
                            }}
                        />
                    </div>
                }
                footer={<div className="flex gap-2 pt-2">
                    <Button
                        variant="bordered"
                        onPress={() => {
                            setShowAddFolder(false);
                            setNewFolder({ id: "", name: "" });
                        }}
                        size="sm"
                        className="h-[32px]"
                    >
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        onPress={handleAddFolder}
                        size="sm"
                        className="h-[32px]"
                    >
                        Add Folder
                    </Button>
                </div>}
            />
        </div>
    );
};