import React, { useState } from 'react';
import { Edit2, Trash2, Plus, Search, BarChart2, Activity } from 'lucide-react';

// --- Components ---

const Modal = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[hsl(var(--card))] rounded-xl shadow-lg max-w-md w-full mx-4 border border-[hsl(var(--border))]">
        <div className="flex justify-between items-center p-6 border-b border-[hsl(var(--border))]">
          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">{title}</h2>
          <button onClick={onClose} className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const HealthDataForm = ({ initialData, categories, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialData || { id: '', name: '', description: '', category: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Add form inputs based on your needs here */}
      <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Name" className="w-full p-2 border rounded" required />
      <button type="submit" className="w-full bg-[hsl(var(--primary))] text-white py-2 rounded">Save</button>
    </form>
  );
};

// --- Main HealthData Component ---

const HealthData = () => {
  const [healthData, setHealthData] = useState([
    { id: 1, name: 'Asthma', category: 'Respiratory', description: 'Chronic airway inflammation' },
    { id: 2, name: 'Hypertension', category: 'Cardiovascular', description: 'High blood pressure' }
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const filteredData = healthData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    setHealthData(healthData.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Health Data Management</h1>
        <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="bg-[hsl(var(--primary))] text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={18} /> Add Entry
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search health data..." 
          className="w-full pl-10 p-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-[hsl(var(--card))] border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[hsl(var(--muted))]">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(item => (
              <tr key={item.id} className="border-t">
                <td className="p-4">{item.name}</td>
                <td className="p-4">{item.category}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="text-blue-600"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} title={editingItem ? "Edit Data" : "Add Data"} onClose={() => setIsModalOpen(false)}>
        <HealthDataForm initialData={editingItem} categories={['Respiratory', 'Cardiovascular']} onSubmit={(data) => { /* Add logic */ setIsModalOpen(false); }} />
      </Modal>
    </div>
  );
};

export default HealthData;