import React, { useState, useEffect } from 'react';
import { Plus, X, Trash2, Edit3, Eye, Loader, AlertCircle, Search } from 'lucide-react';
import { articleService } from '../../services/articleService';

// 1. Reusable Modal Component
const Modal = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[hsl(var(--card))] rounded-xl shadow-lg max-w-md w-full mx-4 border border-[hsl(var(--border))]">
        <div className="flex justify-between items-center p-6 border-b border-[hsl(var(--border))]">
          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">{title}</h2>
          <button onClick={onClose} className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// 2. Article Form Component
const ArticleForm = ({ initialData, onSubmit, onCancel, categories }) => {
  const [formData, setFormData] = useState(initialData || { title: '', category: '', status: 'Draft' });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input required className="w-full p-2 border border-[hsl(var(--border))] rounded-lg" 
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select 
            required 
            className="w-full p-2 border border-[hsl(var(--border))] rounded-lg" 
            value={formData.category} 
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_name}>
                    {cat.category_name}
                    </option>
                ))}
            </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select className="w-full p-2 border border-[hsl(var(--border))] rounded-lg focus:ring-2 focus:ring-[hsl(var(--primary))]"
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}>
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-500">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-lg">Save</button>
        </div>
      </div>
    </form>
  );
};

// 3. Main ArticleManage Component
const ArticleManage = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [articlesData, categoriesData] = await Promise.all([
        articleService.getAllArticles(),
        articleService.getCategories()
      ]);
      setArticles(articlesData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data) => {
    try {
      await articleService.createArticle(data);
      setIsModalOpen(false);
      loadArticles(); // Refresh list after create
    } catch (error) {
      alert("Failed to create article.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await articleService.deleteArticle(id);
        setArticles(articles.filter(a => a.id !== id));
      } catch (error) {
        alert("Failed to delete the article.");
      }
    }
  };

    const filteredArticles = articles.filter(a => {
        const matchesSearch = (a?.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                                (a?.category_name?.toLowerCase() || "").includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || a?.category_name === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">Article Management</h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">Manage and oversee all educational content.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-[hsl(var(--primary))] text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition shadow-lg">
          <Plus size={18} /> Create Article
        </button>
      </div>

      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[hsl(var(--border))] flex flex-wrap items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" size={18} />
                <input 
                type="text" 
                placeholder="Search articles..." 
                className="w-full pl-10 pr-4 py-2 bg-[hsl(var(--muted))] border-none rounded-lg" 
                onChange={(e) => setSearchTerm(e.target.value)} 
                />
            </div>

            {/* Category Buttons */}
            <div className="flex flex-wrap gap-2">
                <button 
                onClick={() => setSelectedCategory("All")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${selectedCategory === "All" ? "bg-[hsl(var(--primary))] text-white" : "bg-[hsl(var(--muted))] hover:bg-[hsl(var(--border))]"}`}
                >
                All
                </button>
                {categories.map((cat) => (
                <button
                    key={cat.category_id}
                    onClick={() => setSelectedCategory(cat.category_name)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${selectedCategory === cat.category_name ? "bg-[hsl(var(--primary))] text-white" : "bg-[hsl(var(--muted))] hover:bg-[hsl(var(--border))]"}`}
                >
                    {cat.category_name}
                </button>
                ))}
            </div>
            </div>

        {loading ? (
          <div className="p-12 text-center"><Loader className="animate-spin mx-auto text-[hsl(var(--primary))]" /></div>
        ) : filteredArticles.length === 0 ? (
          <div className="p-12 text-center text-[hsl(var(--muted-foreground))]"><AlertCircle className="mx-auto mb-2 opacity-20" /> No articles found.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-[hsl(var(--muted))/0.5] text-xs uppercase text-[hsl(var(--muted-foreground))]">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--border))]">
              {filteredArticles.map((article, index) => (
                <tr key={article.id || index} className="hover:bg-[hsl(var(--muted))/30]">
                  <td className="px-6 py-4 font-medium">{article.title || "Untitled"}</td>
                  <td className="px-6 py-4">{article.category_name || "Uncategorized"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${article.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {article.status || "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="p-2 hover:bg-[hsl(var(--muted))] rounded-lg"><Eye size={16} /></button>
                    <button className="p-2 hover:bg-[hsl(var(--muted))] rounded-lg"><Edit3 size={16} /></button>
                    <button onClick={() => handleDelete(article.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={isModalOpen} title="Add New Article" onClose={() => setIsModalOpen(false)}>
        <ArticleForm 
            categories={categories} // Ipinasa natin dito
            onSubmit={handleCreate} 
            onCancel={() => setIsModalOpen(false)} 
        />
        </Modal>
    </section>
  );
};

export default ArticleManage;