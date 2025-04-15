import { getFirestore, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { toast } from "@/hooks/use-toast";
import { IoTrashOutline, IoAddCircleOutline } from "react-icons/io5";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";

const AddProductVariants = ({ onVariantsUpdate }) => {
  const [variants, setVariants] = useState({});
  const [newVariantName, setNewVariantName] = useState("");
  const [newVariantType, setNewVariantType] = useState("text");
  const [newValue, setNewValue] = useState("");
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    type: null, // 'variant' or 'value'
    variantName: null,
    valueToDelete: null,
    itemName: null
  });
  const db = getFirestore();

  useEffect(() => {
    fetchVariants();
  }, []);

  const fetchVariants = async () => {
    try {
      const variantDoc = await getDoc(doc(db, "variants", "productVariants"));
      if (variantDoc.exists()) {
        setVariants(variantDoc.data());
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

  const handleAddVariant = async () => {
    if (!newVariantName.trim()) {
      toast({
        title: "Error",
        description: "Variant name is required",
        variant: "destructive",
      });
      return;
    }

    const variantKey = newVariantName.toLowerCase().trim();
    if (variants[variantKey]) {
      toast({
        title: "Error",
        description: "Variant with this name already exists",
        variant: "destructive",
      });
      return;
    }

    try {
      const variantRef = doc(db, "variants", "productVariants");
      const newVariant = {
        type: newVariantType,
        values: newVariantType === "color" ? {} : []
      };

      await setDoc(variantRef, {
        ...variants,
        [variantKey]: newVariant
      }, { merge: true });

      setVariants(prev => ({
        ...prev,
        [variantKey]: newVariant
      }));
      setNewVariantName("");

      toast({
        title: "Success",
        description: "Variant type added successfully",
        variant: "success",
      });
    } catch (error) {
      console.error("Error adding variant:", error);
      toast({
        title: "Error",
        description: "Failed to add variant",
        variant: "destructive",
      });
    }
  };

  const handleAddValue = async (variantName) => {
    const variant = variants[variantName];
    if (!variant) return;

    try {
      const variantRef = doc(db, "variants", "productVariants");
      let updatedVariant;

      if (variant.type === "color") {
        if (!newColorName.trim() || !newColorHex.trim()) {
          toast({
            title: "Error",
            description: "Both color name and color value are required",
            variant: "destructive",
          });
          return;
        }
        const colorKey = newColorName.toLowerCase().trim();
        if (variant.values[colorKey]) {
          toast({
            title: "Error",
            description: "Color with this name already exists",
            variant: "destructive",
          });
          return;
        }
        updatedVariant = {
          ...variant,
          values: {
            ...variant.values,
            [colorKey]: newColorHex
          }
        };
        setNewColorName("");
        setNewColorHex("");
      } else {
        if (!newValue.trim()) {
          toast({
            title: "Error",
            description: "Value is required",
            variant: "destructive",
          });
          return;
        }
        const valueToAdd = newValue.toLowerCase().trim();
        if (variant.values.includes(valueToAdd)) {
          toast({
            title: "Error",
            description: "This value already exists",
            variant: "destructive",
          });
          return;
        }
        updatedVariant = {
          ...variant,
          values: [...variant.values, valueToAdd]
        };
        setNewValue("");
      }

      await updateDoc(variantRef, {
        [variantName]: updatedVariant
      });

      setVariants(prev => ({
        ...prev,
        [variantName]: updatedVariant
      }));

      // Update parent component
      onVariantsUpdate(variants);

      toast({
        title: "Success",
        description: "Variant value added successfully",
        variant: "success",
      });
    } catch (error) {
      console.error("Error adding variant value:", error);
      toast({
        title: "Error",
        description: "Failed to add variant value",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirmation = (type, variantName, valueToDelete = null) => {
    setDeleteConfirmation({
      isOpen: true,
      type,
      variantName,
      valueToDelete,
      itemName: type === 'variant' ? variantName : valueToDelete
    });
  };

  const handleConfirmDelete = async () => {
    const { type, variantName, valueToDelete } = deleteConfirmation;

    try {
      if (type === 'variant') {
        await handleRemoveVariant(variantName);
      } else if (type === 'value') {
        await handleRemoveValue(variantName, valueToDelete);
      }
    } catch (error) {
      console.error('Error deleting:', error);
      toast({
        title: "Error",
        description: `Failed to delete ${type}`,
        variant: "destructive",
      });
    } finally {
      setDeleteConfirmation({
        isOpen: false,
        type: null,
        variantName: null,
        valueToDelete: null,
        itemName: null
      });
    }
  };

  const handleRemoveValue = async (variantName, valueToRemove) => {
    try {
      const variant = variants[variantName];
      const variantRef = doc(db, "variants", "productVariants");
      let updatedVariant;

      if (variant.type === "color") {
        const { [valueToRemove]: removed, ...remainingValues } = variant.values;
        updatedVariant = {
          ...variant,
          values: remainingValues
        };
      } else {
        updatedVariant = {
          ...variant,
          values: variant.values.filter(value => value !== valueToRemove)
        };
      }

      await updateDoc(variantRef, {
        [variantName]: updatedVariant
      });

      setVariants(prev => ({
        ...prev,
        [variantName]: updatedVariant
      }));

      toast({
        title: "Success",
        description: "Variant value removed successfully",
        variant: "success",
      });
    } catch (error) {
      throw error;
    }
  };

  const handleRemoveVariant = async (variantName) => {
    try {
      const variantRef = doc(db, "variants", "productVariants");
      const { [variantName]: removed, ...remainingVariants } = variants;

      await setDoc(variantRef, remainingVariants);
      setVariants(remainingVariants);

      toast({
        title: "Success",
        description: "Variant removed successfully",
        variant: "success",
      });
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b items-end pb-4">
        <h3 className="text-md font-medium mb-4">Create Variant Types</h3>
        <div className="flex gap-4 mb-4">
          <Input
            label='Variant name'
            isRequired
            type="text"
            value={newVariantName}
            onChange={(e) => setNewVariantName(e.target.value)}
            className="flex-1"
          />
          <Select
            label="Type"
            value={newVariantType}
            onChange={(e) => setNewVariantType(e.target.value)}
            className="w-40"
          >
            <SelectItem value="text">Text/Number</SelectItem>
            <SelectItem value="color">Color</SelectItem>
          </Select>
        </div>
        <div className="flex justify-end">
          <Button
            color="primary"
            onPress={handleAddVariant}
            startContent={<IoAddCircleOutline />}
          >
            Create new variant type
          </Button>
        </div>
      </div>
      <h3 className="text-md font-medium mb-4">Create Variants</h3>

      <div className="space-y-6">
        {Object.entries(variants).map(([variantName, variant]) => (
          <div key={variantName} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium capitalize">{variantName}</h4>
              <Button
                color="danger"
                variant="light"
                isIconOnly
                onPress={() => handleDeleteConfirmation('variant', variantName)}
              >
                <IoTrashOutline />
              </Button>
            </div>

            {variant.type === "color" ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    size="sm"
                    type="text"
                    placeholder="Color name"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    size="sm"
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-20"
                  />
                  <Button
                    size="sm"
                    color="primary"
                    onPress={() => handleAddValue(variantName)}
                    startContent={<IoAddCircleOutline />}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(variant.values).map(([colorName, hex]) => (
                    <div key={colorName} className="flex items-center gap-2 px-2 border rounded-lg group hover:border-red-200">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="capitalize">{colorName}</span>
                      <Button
                        color="danger"
                        variant="light"
                        size="sm"
                        isIconOnly
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onPress={() => handleDeleteConfirmation('value', variantName, colorName)}
                      >
                        <IoTrashOutline />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder={`Add ${variantName} value`}
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    color="primary"
                    onPress={() => handleAddValue(variantName)}
                    startContent={<IoAddCircleOutline />}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {variant.values.map((value, index) => (
                    <div key={index} className="group flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-red-50">
                      <span className="capitalize">{value}</span>
                      <Button
                        color="danger"
                        variant="light"
                        size="sm"
                        isIconOnly
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onPress={() => handleDeleteConfirmation('value', variantName, value)}
                      >
                        <IoTrashOutline />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
        item={deleteConfirmation.itemName}
      />
    </div>
  );
};

export default AddProductVariants;