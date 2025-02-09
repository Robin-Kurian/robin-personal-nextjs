"use client";
import NextImage from "next/image";
import { Skeleton } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const NavButton = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    className={`hidden sm:flex absolute ${
      direction === "left" ? "left-2" : "right-2"
    } top-1/2 -translate-y-1/2 z-10 bg-white/40 hover:bg-white rounded-full p-2 shadow-md`}
    aria-label={`${direction === "left" ? "Previous" : "Next"} slide`}
  >
    {direction === "left" ? (
      <FiChevronLeft className="w-4 h-4" />
    ) : (
      <FiChevronRight className="w-4 h-4" />
    )}
  </button>
);

export default function AutoplayCarousel({ items }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const autoPlayRef = useRef();
  const [direction, setDirection] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState(new Set());

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const startAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(handleNext, 5000);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  });

  useEffect(() => {
    if (!items?.length) return;

    const preloadImages = async () => {
      setIsLoading(true);

      try {
        await Promise.all(
          items.map(
            (item) =>
              new Promise((resolve, reject) => {
                const img = new window.Image();
                img.src = item.imageURL;
                img.onload = () => {
                  setLoadedImages((prev) => new Set([...prev, item.imageURL]));
                  resolve();
                };
                img.onerror = reject;
              })
          )
        );
      } catch (error) {
        console.error("Error preloading images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    preloadImages();
  }, [items]);

  const handleDragEnd = (_, info) => {
    const threshold = 50;
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        handlePrevious();
      } else {
        handleNext();
      }
    }
    setIsDragging(false);
  };

  const handleClick = (id) => {
    if (!isDragging) {
      console.log(`Clicked on: ${id}`);
    }
  };

  const handleDotClick = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  if (!items || items.length === 0) {
    return null;
  }

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.85,
      rotateY: direction > 0 ? 25 : -25,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.85,
      rotateY: direction > 0 ? -25 : 25,
    }),
  };

  return (
    <Skeleton isLoaded={true}>
      <div
        className="w-full overflow-hidden relative"
        onMouseEnter={stopAutoPlay}
        onMouseLeave={startAutoPlay}
      >
        <div className="relative h-56 sm:h-96">
          {/* Navigation Buttons */}
          <NavButton direction="left" onClick={handlePrevious} />
          <NavButton direction="right" onClick={handleNext} />

          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 },
                scale: { duration: 0.4 },
                rotateY: { duration: 0.4 },
              }}
              className="absolute w-full h-full"
              style={{
                cursor: "grab",
                perspective: "1000px",
                transformStyle: "preserve-3d",
              }}
              drag="x"
              dragElastic={1}
              dragMomentum={true}
              dragConstraints={{ left: 0, right: 0 }}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={handleDragEnd}
              whileDrag={{ cursor: "grabbing" }}
            >
              <div className="h-full">
                <div
                  onClick={() => handleClick(items[currentIndex].id)}
                  className="relative w-full h-full cursor-pointer"
                >
                  <NextImage
                    src={items[currentIndex].imageURL}
                    alt={`Slide ${items[currentIndex].id}`}
                    fill
                    className={`rounded-3xl transition-opacity duration-300 ${
                      loadedImages.has(items[currentIndex].imageURL)
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                    style={{ objectFit: "cover" }}
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-4">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentIndex === index ? "bg-blue-500 w-4" : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </Skeleton>
  );
}
