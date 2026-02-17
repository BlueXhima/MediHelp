import React, { useState } from 'react';
import { Phone, Heart, Mail, Star, Trash2, AlertTriangle, Edit, X, Check, Plus } from 'lucide-react';
import Input from '../../../components/ui/Input.jsx';

const EmergencyContactCard = ({ emergencyContacts, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [contacts, setContacts] = useState(emergencyContacts);
  const [newContact, setNewContact] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: ''
  });

  const handleSave = () => {
    onUpdate(contacts);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setContacts(emergencyContacts);
    setNewContact({ name: '', relationship: '', phone: '', email: '' });
    setIsEditing(false);
  };

  const addContact = () => {
    if (newContact?.name?.trim() && newContact?.phone?.trim()) {
      setContacts([...contacts, {
        id: Date.now(),
        ...newContact,
        isPrimary: contacts?.length === 0
      }]);
      setNewContact({ name: '', relationship: '', phone: '', email: '' });
    }
  };

  const removeContact = (id) => {
    setContacts(contacts?.filter(c => c?.id !== id));
  };

  const setPrimaryContact = (id) => {
    setContacts(contacts?.map(contact => ({
      ...contact,
      isPrimary: contact?.id === id
    })));
  };

  return (
    <div className="bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 rounded-xl shadow-medical p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
            <Phone size={20} className="text-white" />
          </div>
          <h3 className="text-xl font-semibold text-text-primary">Emergency Contacts</h3>
        </div>
        {!isEditing ? (
          <button
            className="inline-flex items-center justify-center px-4 py-2 rounded-md text-gray-700 hover:bg-primary hover:text-white cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            <Edit size={16} className="mr-2" /> Edit
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-primary text-primary hover:bg-primary/10 cursor-pointer"
              onClick={handleCancel}
            >
              <X size={16} className="mr-2" /> Cancel
            </button>
            <button
              className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 cursor-pointer"
              onClick={handleSave}
            >
              <Check size={16} className="mr-2" /> Save
            </button>
          </div>
        )}
      </div>
      <div className="space-y-4">
        {contacts?.map((contact) => (
          <div key={contact?.id} className={`p-4 rounded-lg border-2 ${
            contact?.isPrimary 
              ? 'bg-destructive/5 border-destructive/20' :'bg-muted border-gray-200'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-medium text-text-primary">{contact?.name}</h4>
                  {contact?.isPrimary && (
                    <span className="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-medium">
                      Primary
                    </span>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-text-secondary">
                  <div className="flex items-center space-x-2">
                    <Heart size={16} />
                    <span>{contact?.relationship}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone size={16} />
                    <span>{contact?.phone}</span>
                  </div>
                  {contact?.email && (
                    <div className="flex items-center space-x-2">
                      <Mail size={16} />
                      <span>{contact?.email}</span>
                    </div>
                  )}
                </div>
              </div>
              {isEditing && (
                <div className="flex space-x-2 ml-4">
                  {!contact?.isPrimary && (
                    <button
                      className="inline-flex items-center justify-center px-4 py-4 rounded-md text-icon hover:text-icon/100 hover:bg-icon/20 cursor-pointer"
                      onClick={() => setPrimaryContact(contact?.id)}
                    >
                      <Star size={16} />
                    </button>
                  )}
                  <button
                    className="inline-flex items-center justify-center px-4 py-4 rounded-md text-red-500 hover:text-red-700 hover:bg-red-100 cursor-pointer"
                    onClick={() => removeContact(contact?.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
            {!isEditing && (
              <div className="mt-3 flex space-x-2">
                <button
                  className="inline-flex items-center justify-center px-4 py-2 rounded-sm bg-transparent text-sm text-gray-900 hover:bg-primary hover:text-white cursor-pointer"
                >
                  <Phone size={16} className="mr-2" /> Call
                </button>
                {contact?.email && (
                  <button
                    className="inline-flex items-center justify-center px-4 py-2 rounded-sm bg-transparent text-sm text-gray-900 hover:bg-primary hover:text-white cursor-pointer"
                  >
                    <Mail size={16} className="mr-2" /> Email
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
        {isEditing && (
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <h4 className="text-lg font-medium text-left text-text-primary mb-4">Add Emergency Contact</h4>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary text-left block">
                  Full Name
                </label>
                <Input
                  type="text"
                  placeholder="e.g., John Smith"
                  value={newContact?.name}
                  onChange={(e) => setNewContact({...newContact, name: e?.target?.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary text-left block">
                  Relationship
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Spouse, Parent, Friend"
                  value={newContact?.relationship}
                  onChange={(e) => setNewContact({...newContact, relationship: e?.target?.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary text-left block">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  placeholder="e.g., (555) 123-4567"
                  value={newContact?.phone}
                  onChange={(e) => setNewContact({...newContact, phone: e?.target?.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary text-left block">
                  Email (Optional)
                </label>
                <Input
                  type="email"
                  placeholder="e.g., john@example.com"
                  value={newContact?.email}
                  onChange={(e) => setNewContact({...newContact, email: e?.target?.value})}
                />
              </div>
            </div>
            <div className="mt-4 text-left">
              <button
                className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-descructive font-medium 
                  ${!newContact?.name?.trim() ? 'bg-transparent text-gray-400 cursor-not-allowed' : 'hover:bg-primary hover:text-white cursor-pointer'}`}
                onClick={addContact}
                disabled={!newContact?.name?.trim() || !newContact?.phone?.trim()}
              >
                <Plus size={16} className="mr-2" /> Add Contact
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertTriangle size={20} className="text-icon" />
          <div>
            <h4 className="font-medium text-left text-text-primary mb-1">Emergency Services</h4>
            <p className="text-sm text-text-secondary mb-2">
              For immediate medical emergencies, always call 911 first.
            </p>
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span>Emergency: 911</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span>Poison Control: 1-800-222-1222</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContactCard;