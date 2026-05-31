import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Settings as SettingsIcon, CheckCircle, Lock, Globe, Database, UserCheck } from 'lucide-react';
import { userService } from '../../services/userService';

// --- Expanded Sub-components ---

const ProfileSettings = ({ onSave }) => {
  const [adminData, setAdminData] = useState(null);
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    role: ''
  });

  // Fetch data pag-mount ng component
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await userService.getFullDetails();
        setAdminData(data);
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          role: data.role || ''
        });
      } catch (error) {
        console.error("Failed to load profile", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="space-y-8">
      <div className="bg-[hsl(var(--card))] rounded-xl p-6 border border-[hsl(var(--border))] shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Account Information</h3>
        
        {/* Upload Photo Area na may Avatar */}
        <div className="mb-8 p-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-border flex items-center justify-center text-primary font-bold overflow-hidden shrink-0">
              {adminData?.profile_picture ? (
                <img src={adminData.profile_picture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl">{adminData?.firstName?.charAt(0)}{adminData?.lastName?.charAt(0)}</span>
              )}
            </div>
            <div>
              <p className="font-medium">Profile Photo</p>
              <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
            </div>
          </div>
          <button className="text-sm font-medium text-[hsl(var(--primary))] px-4 py-2 border border-[hsl(var(--primary))] rounded-lg">
            Upload Photo
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg bg-[hsl(var(--background))]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg bg-[hsl(var(--background))]" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg bg-[hsl(var(--background))]" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <input 
                type="text" 
                name="role" 
                value={formData.RoleID || 'Admin'} 
                disabled 
                className="w-full px-4 py-2.5 border rounded-lg bg-[hsl(var(--background))] cursor-not-allowed" 
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button onClick={() => onSave('Profile updated successfully')} className="px-6 py-2.5 bg-[hsl(var(--primary))] text-white rounded-lg">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

const NotificationSettings = ({ onSave }) => {
  const [preferences, setPreferences] = useState({ 
    emailNotifications: true, 
    systemAlerts: true,
    patientReminders: true,
    serverUptimeAlerts: true,
    securityBreachAlerts: true,
    weeklyReport: false 
  });
  
  const handleToggle = (key) => setPreferences({ ...preferences, [key]: !preferences[key] });

  return (
    <div className="bg-[hsl(var(--card))] rounded-xl p-6 border border-[hsl(var(--border))]">
      <h3 className="text-lg font-semibold mb-2">Notification Preferences</h3>
      <p className="text-sm text-gray-500 mb-6">Configure administrative alerts and system notifications.</p>
      {Object.keys(preferences).map(key => (
        <div key={key} className="flex justify-between items-center py-4 border-b border-gray-100">
          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
          <button onClick={() => handleToggle(key)} className={`w-12 h-6 rounded-full transition-colors ${preferences[key] ? 'bg-[hsl(var(--primary))]' : 'bg-gray-300'}`} />
        </div>
      ))}
      <button onClick={() => onSave('Preferences saved')} className="mt-6 px-6 py-2 bg-[hsl(var(--primary))] text-white rounded-lg">Save Notifications</button>
    </div>
  );
};

const SystemSettings = ({ isDarkMode, onToggleDarkMode, onSave }) => (
  <div className="bg-[hsl(var(--card))] rounded-xl p-6 border border-[hsl(var(--border))]">
    <h3 className="text-lg font-semibold mb-4">System Configuration</h3>
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">Dark Mode</p>
          <p className="text-sm text-gray-500">Toggle between light and dark themes.</p>
        </div>
        <button onClick={onToggleDarkMode} className={`w-12 h-6 rounded-full ${isDarkMode ? 'bg-[hsl(var(--primary))]' : 'bg-gray-300'}`} />
      </div>
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">Maintenance Mode</p>
          <p className="text-sm text-gray-500">Disable site access for users during updates.</p>
        </div>
        <button className="w-12 h-6 rounded-full bg-gray-300" />
      </div>
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">Data Backup Frequency</p>
          <p className="text-sm text-gray-500">Set automatic server snapshots.</p>
        </div>
        <select className="border p-2 rounded-lg bg-[hsl(var(--background))]">
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
      </div>
    </div>
    <button onClick={() => onSave('System updated')} className="mt-8 px-6 py-2 bg-[hsl(var(--primary))] text-white rounded-lg">Save System Settings</button>
  </div>
);

const SecuritySettings = ({ onSave }) => (
  <div className="bg-[hsl(var(--card))] rounded-xl p-6 border border-[hsl(var(--border))]">
    <h3 className="text-lg font-semibold mb-4">Security</h3>
    <div className="space-y-6">
      <div className="p-4 border rounded-lg flex items-center justify-between">
        <div>
          <p className="font-medium">Two-Factor Authentication</p>
          <p className="text-sm text-gray-500">Require 2FA for all administrator logins.</p>
        </div>
        <button className="text-sm font-bold text-[hsl(var(--primary))] underline">Enable</button>
      </div>
      <div className="p-4 border rounded-lg">
        <p className="font-medium mb-2">IP Whitelisting</p>
        <input type="text" placeholder="Enter allowed IP address" className="w-full px-4 py-2 border rounded-lg mb-2" />
        <button className="text-sm text-[hsl(var(--primary))] font-medium">Add to Whitelist</button>
      </div>
      <div className="p-4 border rounded-lg">
        <p className="font-medium">Active Admin Sessions</p>
        <p className="text-sm text-gray-500">You are the only active administrator session.</p>
      </div>
    </div>
    <button onClick={() => onSave('Security updated')} className="mt-8 px-6 py-2 bg-[hsl(var(--primary))] text-white rounded-lg">Update Security</button>
  </div>
);

// --- Main Settings Component ---

const Settings = ({ isDarkMode, toggleDarkMode }) => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [toast, setToast] = useState('');

  const handleSave = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  const tabs = [
    { name: 'Profile', icon: User },
    { name: 'Notifications', icon: Bell },
    { name: 'System', icon: SettingsIcon },
    { name: 'Security', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-64">
          <div className="bg-[hsl(var(--card))] rounded-xl border p-2">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === tab.name ? 'bg-[hsl(var(--primary))] text-white' : ''}`}
              >
                <tab.icon size={18} />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          {activeTab === 'Profile' && <ProfileSettings onSave={handleSave} />}
          {activeTab === 'Notifications' && <NotificationSettings onSave={handleSave} />}
          {activeTab === 'System' && <SystemSettings isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} onSave={handleSave} />}
          {activeTab === 'Security' && <SecuritySettings onSave={handleSave} />}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 p-4 bg-black text-white rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle size={16} />
          {toast}
        </div>
      )}
    </div>
  );
};

export default Settings;