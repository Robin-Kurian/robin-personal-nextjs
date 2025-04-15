"use client";

import confetti from "canvas-confetti";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function ConfettiSideCannons({ duration = 300, confettiColors, message, messageDuration = 4000, position = "bottom", messageBgColor = "bg-green-500", }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const end = Date.now() + duration; // Duration in milliseconds
        const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];
        const frame = () => {
            if (Date.now() > end) {
                return; // Stop the animation after the duration
            }

            confetti({
                particleCount: 1,
                angle: 60,
                spread: 55,
                startVelocity: 45,
                origin: { x: 0, y: 0.5 },
                colors: confettiColors ?? colors,
            });
            confetti({
                particleCount: 1,
                angle: 120,
                spread: 55,
                startVelocity: 45,
                origin: { x: 1, y: 0.5 },
                colors: confettiColors ?? colors,
            });

            requestAnimationFrame(frame); // Continue the animation
        };

        // Start the confetti animation
        frame();

        // Hide message after the specified duration
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, messageDuration);

        return () => clearTimeout(timer); // Cleanup timer on unmount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Determine the position style
    const positionStyles = {
        top: "top-20", // Adjust this value as needed for spacing below the navbar
        center: "top-1/2 transform -translate-y-1/2",
        bottom: "bottom-8", // Adjust this value as needed for spacing above the footer
    };

    return (
        <div className={`fixed z-50 left-1/2 transform -translate-x-1/2 ${positionStyles[position]}`}>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -40 }} // Start hidden and slightly above
                    animate={{ opacity: 1, y: 0 }} // Fade in and move to position
                    exit={{ opacity: 0, y: 40 }} // Fade out and move up
                    transition={{ duration: 1 }} // Duration of the animation
                    className={`text-white font-medium text-xs sm:text-sm text-center px-3 py-2  rounded-full shadow-lg ${messageBgColor}`}
                >
                    {message}
                </motion.div>
            )}
        </div>
    );
}
