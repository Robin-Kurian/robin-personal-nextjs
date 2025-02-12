const ExperienceSection = () => {
    return (
        <section id="experience" className="min-h-full py-20">
            <h2 className="text-4xl font-bold mb-8">Work Experience</h2>
            <div className="space-y-8">
                <div className="bg-secondary/10 p-6 rounded-lg">
                    <h3 className="text-2xl font-semibold mb-2">Software Developer</h3>
                    <p className="text-gray-500">Mobiux Labs</p>
                    <p className="mt-4">Key responsibilities and achievements...</p>
                </div>
                <div className="bg-secondary/10 p-6 rounded-lg">
                    <h3 className="text-2xl font-semibold mb-2">Software Developer</h3>
                    <p className="text-gray-500">Cybrosys Technologies</p>
                    <p className="mt-4">Key responsibilities and achievements...</p>
                </div>
            </div>
        </section>
    );
};

export default ExperienceSection; 