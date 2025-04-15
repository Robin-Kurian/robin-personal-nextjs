const Experience = ({ company, position, duration, achievements }) => {
    return (
        <div className="bg-secondary/10 p-6 rounded-lg transition-all duration-300 hover:bg-secondary/20">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                <div>
                    <h3 className="text-2xl font-semibold mb-1">{position}</h3>
                    <p className="text-primary/80 font-medium">{company}</p>
                </div>
                <p className="text-gray-500 text-sm md:text-base">{duration}</p>
            </div>
            <ul className="mt-4 space-y-2 list-disc list-inside text-gray-600">
                {achievements.map((achievement, index) => (
                    <li key={index} className="leading-relaxed">
                        {achievement}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Experience;
