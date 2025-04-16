import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"
import { TextAnimate } from "../magicui/text-animate";

// Animation variants for reusability
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            when: "beforeChildren", // Ensures container animates before children
        },
    },
    exit: {
        opacity: 0,
        transition: {
            staggerChildren: 0.1,
            staggerDirection: -1, // Animate children in reverse order when exiting
        }
    }
};

// Helper function to determine animation direction based on screen size and position
const getAnimationDirection = (index, totalItems, isLargeScreen) => {
    if (isLargeScreen) {
        return "top"; // All items come from top on large screens
    }

    // Mobile behavior
    const row = Math.floor(index / 3);
    const isLastRow = Math.floor(index / 3) === Math.floor((totalItems - 1) / 3);
    const itemsInLastRow = totalItems % 3 || 3;

    if (isLastRow && itemsInLastRow === 1) {
        return "center";
    }
    return index % 2 === 0 ? "left" : "right";
};

// Get animation properties based on direction
const getDirectionalAnimation = (direction) => {
    switch (direction) {
        case "top":
            return {
                hidden: { y: -100, opacity: 0 },
                visible: { y: 0, opacity: 1 },
                exit: { y: 100, opacity: 0 }
            };
        case "center":
            return {
                hidden: { y: 100, opacity: 0 },
                visible: { y: 0, opacity: 1 },
                exit: { y: 100, opacity: 0 }
            };
        case "left":
            return {
                hidden: { x: -100, opacity: 0 },
                visible: { x: 0, opacity: 1 },
                exit: { x: 100, opacity: 0 }
            };
        case "right":
            return {
                hidden: { x: 100, opacity: 0 },
                visible: { x: 0, opacity: 1 },
                exit: { x: -100, opacity: 0 }
            };
    }
};

// Reusable animation variants for skill blocks
const skillBlockVariants = {
    hidden: (direction) => ({
        ...getDirectionalAnimation(direction).hidden,
    }),
    visible: {
        x: 0,
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            duration: 0.8,
            bounce: 0.4
        }
    },
    exit: (direction) => ({
        ...getDirectionalAnimation(direction).exit,
        transition: {
            type: "tween",
            duration: 0.4,
            ease: "easeInOut"
        }
    })
};

const SkillBlock = ({ title, skills, index, totalItems }) => {
    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        const checkScreenSize = () => {
            setIsLargeScreen(window.innerWidth >= 1024); // lg breakpoint
        };

        // Initial check
        checkScreenSize();

        // Add event listener for resize
        window.addEventListener('resize', checkScreenSize);

        // Cleanup
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const animationDirection = shouldReduceMotion
        ? "top"
        : getAnimationDirection(index, totalItems, isLargeScreen);

    return (
        <motion.div
            variants={skillBlockVariants}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: true, amount: 0.3 }}
            custom={animationDirection}
            className="bg-secondary/10 p-6 rounded-lg hover:bg-secondary/20 transition-colors duration-300"
        >
            <h3 className="text-xl font-semibold mb-4 border-b">
                <TextAnimate animation="slideLeft" by="character">
                    {title}
                </TextAnimate>
            </h3>
            <ul className="space-y-2">
                {skills.map((skill, idx) => (
                    <li key={idx}>{skill}</li>
                ))}
            </ul>
        </motion.div>
    );
};

const SKILLS_DATA = [
    {
        title: "Frontend",
        skills: ["Next.js", "React.js", "TailwindCSS", "JavaScript", "TypeScript", "HTML5, CSS3"]
    },
    {
        title: "Backend",
        skills: ["Django", "DRF - REST APIs", "Python", "PostgreSQL", "Odoo ERP"]
    },
    {
        title: "Extras",
        skills: ["AWS", "Firebase", "Supabase", "Algolia", "Zustand"]
    }
];

const SkillsSection = () => {
    return (
        <section id="skills" className="min-h-full py-20">
            <motion.h2
                className="text-4xl font-bold mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                Skills
            </motion.h2>
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: true }}
            >
                {SKILLS_DATA.map((skillSet, index) => (
                    <SkillBlock
                        key={skillSet.title}
                        title={skillSet.title}
                        skills={skillSet.skills}
                        index={index}
                        totalItems={SKILLS_DATA.length}
                    />
                ))}
            </motion.div>
        </section>
    );
};

export default SkillsSection; 