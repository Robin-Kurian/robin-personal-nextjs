import React from "react";
import { Button } from "@heroui/react";
import { FiMinus, FiPlus, FiTrash } from "react-icons/fi";
import { DEFAULT_BUTTON_STYLES } from "@/utilities/constants";

const QuantitySelector = ({ quantity, onIncrease, onDecrease, onRemove, isRemovable = false }) => {
    return (
        <div className="flex items-center  mt-3">
            <Button
                isIconOnly
                size="sm"
                isDisabled={!isRemovable && quantity === 1}
                onPress={isRemovable && quantity === 1 ? onRemove : onDecrease}
                color={"danger"}
                variant="faded"
                className={`${DEFAULT_BUTTON_STYLES?.classNames} text-sm md:text-base font-medium hover:bg-red-500 hover:text-white border-color-secondary-s80`}
            >
                {isRemovable && quantity === 1 ? <FiTrash /> : <FiMinus />}
            </Button>
            <div className="w-8 text-center text-gray-800 hover:text-gray-950">
                {quantity}
            </div>
            <Button
                isIconOnly
                size="sm"
                color="success"
                onPress={onIncrease}
                variant="faded"
                className={`${DEFAULT_BUTTON_STYLES?.classNames} text-sm md:text-base font-medium hover:bg-green-500 hover:text-white border-color-secondary-s80`}
            >
                <FiPlus />
            </Button>
        </div>
    );
};

export default QuantitySelector; 