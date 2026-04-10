const ArticleGrid = ({ query }) => {
    const articles = [
        { id: 1, title: "Emergency Wound Care", cat: "First Aid", time: "5 min read" },
        { id: 2, title: "Managing Daily Stress", cat: "Wellness", time: "8 min read" },
        { id: 3, title: "Medication Safety 101", cat: "Guides", time: "6 min read" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((item) => (
                <div key={item.id} className="p-6 rounded-3xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 hover:transform hover:-translate-y-1 transition-all cursor-pointer shadow-lg">
                    <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                        {item.cat}
                    </span>
                    <h3 className="text-xl font-semibold mt-4 text-slate-800 dark:text-slate-200">
                        {item.title}
                    </h3>
                    <div className="flex justify-between items-center mt-6 text-sm text-slate-500">
                        <span>{item.time}</span>
                        <button className="text-blue-500 font-medium hover:underline">Read More →</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ArticleGrid;