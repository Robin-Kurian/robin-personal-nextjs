const SkillsSection = () => {
    return (
        <section id="skills" className="min-h-screen py-20">
            <h2 className="text-4xl font-bold mb-8">Technical Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-secondary/10 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Frontend</h3>
                    <ul className="space-y-2">
                        <li>React.js</li>
                        <li>Next.js</li>
                        <li>TailwindCSS</li>
                    </ul>
                </div>
                {/* Add more skill categories */}
            </div>
        </section>
    );
};

export default SkillsSection; 