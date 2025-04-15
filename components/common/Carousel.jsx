/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import useCarouselStore from '@/hooks/useCarouselStore';
import { Button, Skeleton } from '@heroui/react';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

const AUTO_SCROLL_INTERVAL = 8000;
const DESKTOP_DIMENSIONS = { width: 1416, height: 431 };
const MOBILE_RATIO = 9 / 16; // 16:9 aspect ratio for mobile

const Carousel = () => {
    const {
        carouselData,
        currentIndex,
        setCurrentIndex,
        incrementIndex,
        decrementIndex,
        isLoading
    } = useCarouselStore();
    const [isClient, setIsClient] = useState(false);
    const [[page, direction], setPage] = useState([0, 0]);

    const imageIndex = ((currentIndex % carouselData.length) + carouselData.length) % carouselData.length;

    // Handle hydration
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Auto scroll
    useEffect(() => {
        if (carouselData.length <= 1) return;

        const interval = setInterval(() => {
            paginate(1);
        }, AUTO_SCROLL_INTERVAL);

        return () => clearInterval(interval);
    }, [carouselData.length]);

    const paginate = (newDirection) => {
        if (newDirection > 0) {
            incrementIndex();
        } else {
            decrementIndex();
        }
        setPage([page + newDirection, newDirection]);
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset, velocity) => {
        return Math.abs(offset) * velocity;
    };

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? "100%" : "-100%",
            opacity: 1
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? "100%" : "-100%",
            opacity: 1
        })
    };

    if (!isClient) return null;

    const slideTransition = {
        x: { type: "spring", stiffness: 400, damping: 30 },
        opacity: { duration: 0.2 }
    };

    return (
        <div className="relative w-full overflow-hidden bg-gray-100">
            <div className="w-full md:hidden" style={{ paddingTop: `${MOBILE_RATIO * 100}%` }} />
            <div className="hidden md:block" style={{
                height: `min(${DESKTOP_DIMENSIONS.height}px, calc(100vw * ${DESKTOP_DIMENSIONS.height / DESKTOP_DIMENSIONS.width}))`
            }} />

            {/* Loading State */}
            {isLoading && (
                <div className="absolute inset-0 w-full h-full">
                    <Skeleton className="w-full h-full rounded-none" />
                </div>
            )}

            {/* Main Carousel */}
            <div className="absolute inset-0">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    {!isLoading && carouselData[imageIndex] && (
                        <motion.div
                            key={page}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={slideTransition}
                            className="absolute w-full h-full"
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.7}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = swipePower(offset.x, velocity.x);

                                if (swipe < -swipeConfidenceThreshold) {
                                    paginate(1);
                                } else if (swipe > swipeConfidenceThreshold) {
                                    paginate(-1);
                                }
                            }}
                        >
                            <div className="relative w-full h-full">
                                <Image
                                    src={carouselData[imageIndex].imageURL}
                                    alt={`Carousel image ${imageIndex + 1}`}
                                    fill
                                    quality={90}
                                    priority={imageIndex === 0}
                                    className="md:object-contain object-cover object-center select-none"
                                    sizes={`(max-width: 768px) 100vw, ${DESKTOP_DIMENSIONS.width}px`}
                                    draggable="false"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation Buttons - Only visible on larger screens */}
            {carouselData.length > 1 && !isLoading && (
                <>
                    <Button
                        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full z-10 shadow-md"
                        onClick={() => paginate(-1)}
                        size="sm"
                        isIconOnly
                    >
                        <IoChevronBackOutline className="w-6 h-6" />
                    </Button>
                    <Button
                        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full z-10 shadow-md"
                        onClick={() => paginate(1)}
                        size="sm"
                        isIconOnly
                    >
                        <IoChevronForwardOutline className="w-6 h-6" />
                    </Button>
                </>
            )}

            {/* Dots Indicator */}
            {carouselData.length > 1 && !isLoading && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2 z-10">
                    {carouselData.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                const newDirection = index > currentIndex ? 1 : -1;
                                setPage([index, newDirection]);
                                setCurrentIndex(index);
                            }}
                            className={`transition-all ${index === imageIndex
                                ? 'bg-white w-3 md:w-4 h-1.5 md:h-2'
                                : 'bg-white/50 w-1.5 md:w-2 h-1.5 md:h-2'
                                } rounded-full`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Carousel; 