import { create } from "zustand";

const useCheckoutStore = create((set) => ({
    selectedProducts: {},
    setSelectedProducts: (products) => {
        set({ selectedProducts: products });
    },
    clearSelectedProducts: () => {
        set({ selectedProducts: {} });
    },
}));

export default useCheckoutStore;