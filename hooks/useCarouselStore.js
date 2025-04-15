import { create } from 'zustand';

const useCarouselStore = create((set) => ({
    carouselData: [],
    isLoading: true,
    currentIndex: 0,
    hasInitiallyFetched: false,
    setCarouselData: (data) => set({ carouselData: data, hasInitiallyFetched: true }),
    setLoading: (loading) => set({ isLoading: loading }),
    setCurrentIndex: (index) => set({ currentIndex: index }),
    incrementIndex: () => set((state) => ({
        currentIndex: (state.currentIndex + 1) % state.carouselData.length
    })),
    decrementIndex: () => set((state) => ({
        currentIndex: state.currentIndex === 0
            ? state.carouselData.length - 1
            : state.currentIndex - 1
    })),
    resetStore: () => set({
        carouselData: [],
        isLoading: true,
        currentIndex: 0,
        hasInitiallyFetched: false
    })
}));

export default useCarouselStore;
