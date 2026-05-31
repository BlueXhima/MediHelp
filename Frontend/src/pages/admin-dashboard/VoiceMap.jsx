import React, { useState } from 'react';
import { Search, Plus, Edit3, Trash2, X, Filter } from 'lucide-react';

// --- Components ---

const Modal = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[hsl(var(--card))] rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-[hsl(var(--border))]">
          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-[hsl(var(--muted))] rounded-lg transition-colors">
            <X size={20} className="text-[hsl(var(--muted-foreground))]" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const VoiceMapForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialData || { trigger: '', linkedId: '', status: 'active' });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.trigger.trim() && formData.linkedId.trim()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Voice Trigger</label>
        <input type="text" name="trigger" value={formData.trigger} onChange={handleChange} className="w-full px-3 py-2 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))]" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Linked ID Data</label>
        <input type="text" name="linkedId" value={formData.linkedId} onChange={handleChange} className="w-full px-3 py-2 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))]" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Status</label>
        <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))]">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="flex gap-3 pt-4">
        <button type="submit" className="flex-1 px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-lg">Save</button>
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] rounded-lg">Cancel</button>
      </div>
    </form>
  );
};

// --- Main HealthData Component ---

const VoiceMap = () => {
  const [commands, setCommands] = useState([
    { id: 1, trigger: 'Show Dashboard', linkedId: 'dashboard_main', status: 'active' },
    { id: 2, trigger: 'Open Users', linkedId: 'users_page', status: 'active' }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleAdd = (data) => {
    setCommands([...commands, { ...data, id: Date.now() }]);
    setIsModalOpen(false);
  };

  const handleEdit = (data) => {
    setCommands(commands.map(cmd => cmd.id === editingId ? { ...data, id: editingId } : cmd));
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    setCommands(commands.filter(cmd => cmd.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Voice Commands</h2>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-lg">
          <Plus size={16} /> Add Command
        </button>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[hsl(var(--border))] text-sm text-[hsl(var(--muted-foreground))]">
            <th className="pb-3">Trigger</th>
            <th className="pb-3">Linked ID</th>
            <th className="pb-3">Status</th>
            <th className="pb-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {commands.map(cmd => (
            <tr key={cmd.id} className="border-b border-[hsl(var(--border))]">
              <td className="py-3">{cmd.trigger}</td>
              <td className="py-3">{cmd.linkedId}</td>
              <td className="py-3">{cmd.status}</td>
              <td className="py-3 text-right">
                <button onClick={() => { setEditingId(cmd.id); setIsModalOpen(true); }} className="p-2 text-blue-500"><Edit3 size={16} /></button>
                <button onClick={() => handleDelete(cmd.id)} className="p-2 text-red-500"><Trash2 size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={isModalOpen} title={editingId ? 'Edit Command' : 'Add Command'} onClose={() => setIsModalOpen(false)}>
        <VoiceMapForm initialData={editingId ? commands.find(c => c.id === editingId) : null} onSubmit={editingId ? handleEdit : handleAdd} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default VoiceMap;