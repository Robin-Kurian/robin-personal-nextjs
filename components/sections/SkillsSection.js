const SkillsSection = () => {
    return (
        <section id="skills" className="min-h-full py-20">
            <h2 className="text-4xl font-bold mb-8">Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-secondary/10 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 border-b">Frontend</h3>
                    <ul className="space-y-2">
                        <li>Next.js</li>
                        <li>React.js</li>
                        <li>TailwindCSS</li>
                        <li>JavaScript</li>
                        <li>TypeScript</li>
                        <li>HTML5, CSS3</li>
                    </ul>
                </div>
                <div className="bg-secondary/10 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 border-b">Backend</h3>
                    <ul className="space-y-2">
                        <li>Django</li>
                        <li>DRF - REST APIs</li>
                        <li>Python</li>
                        <li>PostgreSQL</li>
                        <li>Odoo ERP</li>
                    </ul>
                </div>
                <div className="bg-secondary/10 p-6 rounded-lg ">
                    <h3 className="text-xl font-semibold mb-4 border-b">Extras</h3>
                    <ul className="space-y-2">
                        <li>AWS</li>
                        <li>Firebase</li>
                        <li>Supabase</li>
                        <li>Algolia</li>
                        <li>Zustand</li>
                    </ul>
                </div>
                {/* Add more skill categories */}
            </div>
        </section>
    );
};

export default SkillsSection; 