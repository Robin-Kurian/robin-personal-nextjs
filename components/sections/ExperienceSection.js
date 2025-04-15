import { EXPERIENCE_DATA } from "@/utilities/constants";
import Experience from "../common/Experience";

const ExperienceSection = () => {
    return (
        <section id="experience" className="min-h-full py-20">
            <h2 className="text-4xl font-bold mb-8">Work Experience</h2>
            <div className="space-y-8">
                {EXPERIENCE_DATA.map((experience, index) => (
                    <Experience
                        key={index}
                        company={experience.company}
                        position={experience.position}
                        duration={experience.duration}
                        achievements={experience.achievements}
                    />
                ))}
            </div>
        </section>
    );
};

export default ExperienceSection; 