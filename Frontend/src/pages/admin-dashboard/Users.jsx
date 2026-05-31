import React, { useState } from 'react';
import { Plus, Search, MoreHorizontal, Trash2, Edit3, Lock, X, Ban, Shield, Filter } from 'lucide-react';

// Modal Component
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

// Form Component
const UserForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(
    initialData || { firstName: '', lastName: '', email: '', role: 'User', status: 'active' }
  );

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">First Name</label>
        <input type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full px-3 py-2 bg-[hsl(var(--muted))] border rounded-lg" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 bg-[hsl(var(--muted))] border rounded-lg" required />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-[hsl(var(--muted))] rounded-lg">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-lg">Save</button>
      </div>
    </form>
  );
};

const Users = () => {
  const [users, setUsers] = useState([
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'Admin', status: 'active', updatedAt: '2026-05-20' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'User', status: 'active', updatedAt: '2026-05-19' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const filteredUsers = users.filter(u => 
    u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = (data) => {
    setUsers([...users, { ...data, id: Date.now(), updatedAt: new Date().toISOString().split('T')[0] }]);
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this user?')) setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">User Management</h1>
        <button onClick={() => { setEditingUser(null); setIsModalOpen(true); }} className="flex items-center gap-2 bg-[hsl(var(--primary))] text-white px-4 py-2 rounded-lg">
          <Plus size={18} /> Add User
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-[hsl(var(--muted-foreground))]" size={18} />
        <input 
          type="text" 
          placeholder="Search users..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-[hsl(var(--card))] border rounded-lg"
        />
      </div>

      <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[hsl(var(--muted))] text-xs uppercase font-semibold text-[hsl(var(--muted-foreground))]">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[hsl(var(--border))]">
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 font-medium">{user.firstName} {user.lastName}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button onClick={() => handleDelete(user.id)} className="p-2 text-[hsl(var(--muted-foreground))] hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} title={editingUser ? "Edit User" : "Add New User"} onClose={() => setIsModalOpen(false)}>
        <UserForm initialData={editingUser} onSubmit={handleAdd} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Users;