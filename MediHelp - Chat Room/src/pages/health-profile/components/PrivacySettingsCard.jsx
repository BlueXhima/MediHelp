import React, { useState } from 'react';
import { UserCheck, BarChart3, Bell, Lightbulb, AlertTriangle, Microscope, Shield, RotateCcw, Check, Download, Trash2, HelpCircle, Mail, Phone } from 'lucide-react';
import Button from '../../../components/Button.jsx';
import Checkbox from '../../../components/ui/Checkbox.jsx';

const PrivacySettingsCard = ({ privacySettings, onUpdate }) => {
  const [settings, setSettings] = useState(privacySettings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdate(settings);
    setHasChanges(false);
  };

  const handleReset = () => {
    setSettings(privacySettings);
    setHasChanges(false);
  };

  const privacyOptions = [
    {
      key: 'shareWithProviders',
      title: 'Share with Healthcare Providers',
      description: 'Allow sharing of health data with verified healthcare professionals',
      icon: UserCheck
    },
    {
      key: 'anonymousAnalytics',
      title: 'Anonymous Analytics',
      description: 'Help improve our services by sharing anonymized usage data',
      icon: BarChart3
    },
    {
      key: 'medicationReminders',
      title: 'Medication Reminders',
      description: 'Receive notifications for medication schedules and refills',
      icon: Bell
    },
    {
      key: 'healthInsights',
      title: 'Health Insights',
      description: 'Get personalized health recommendations based on your data',
      icon: Lightbulb
    },
    {
      key: 'emergencyAccess',
      title: 'Emergency Access',
      description: 'Allow emergency contacts to access critical health information',
      icon: AlertTriangle
    },
    {
      key: 'researchParticipation',
      title: 'Research Participation',
      description: 'Participate in anonymized medical research studies',
      icon: Microscope
    }
  ];

  const dataRetentionOptions = [
    { value: '1year', label: '1 Year' },
    { value: '3years', label: '3 Years' },
    { value: '5years', label: '5 Years' },
    { value: 'indefinite', label: 'Indefinite' }
  ];

  return (
    <div className="bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 rounded-xl shadow-medical p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <h3 className="text-xl font-semibold text-text-primary">Privacy & Data Settings</h3>
        </div>
        {hasChanges && (
          <div className="flex space-x-2">
            <button
              className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-primary text-primary hover:bg-primary/10 cursor-pointer"
              onClick={handleReset}
            >
              <RotateCcw size={16} className="mr-2" /> Reset
            </button>
            <button
              className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 cursor-pointer"
              onClick={handleSave}
            >
              <Check size={16} className="mr-2" /> Save Changes
            </button>
          </div>
        )}
      </div>
      {/* Privacy Controls */}
      <div className="space-y-6">
        <div>
          <h4 className="text-lg text-left font-medium text-text-primary mb-4">Data Sharing Preferences</h4>
          <div className="space-y-4">
            {privacyOptions?.map((option) => (
              <div key={option?.key} className="flex items-start space-x-4 px-6 py-4 bg-background rounded-lg">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <option.icon size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-left text-text-primary">{option?.title}</h5>
                      <p className="text-sm text-text-secondary">{option?.description}</p>
                    </div>
                    <Checkbox
                      checked={settings?.[option?.key]}
                      onChange={(e) => handleSettingChange(option?.key, e?.target?.checked)}
                      className="ml-4"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Retention */}
        <div>
          <h4 className="text-lg text-left font-medium text-text-primary mb-4">Data Retention</h4>
          <div className="px-6 py-4 bg-background rounded-md">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h5 className="font-medium text-left text-text-primary">Data Retention Period</h5>
                <p className="text-sm text-text-secondary">How long should we keep your health data?</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {dataRetentionOptions?.map((option) => (
                <button
                  key={option?.value}
                  onClick={() => handleSettingChange('dataRetention', option?.value)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    settings?.dataRetention === option?.value
                      ? 'bg-success text-primary-foreground'
                      : 'bg-gray-200 text-gray-600 hover:bg-primary/40 hover:text-white'
                  }`}
                >
                  {option?.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Data Export */}
        <div>
          <h4 className="text-lg text-left font-medium text-text-primary mb-4">Data Management</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="px-6 py-4 bg-background rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Download size={20} className="text-sky-500" />
                <h5 className="font-medium text-text-primary">Export Your Data</h5>
              </div>
              <p className="text-sm text-left text-text-secondary mb-4">
                Download a copy of all your health data in a portable format.
              </p>
              <button
                className="inline-flex items-center justify-center px-4 py-2 rounded-sm border border-border bg-transparent hover:text-white hover:bg-primary cursor-pointer w-full"
              >
                <Download size={16} className="mr-2" /> Request Data Export
              </button>
            </div>

            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Trash2 size={20} className="text-red-500" />
                <h5 className="font-medium text-text-primary">Delete Account</h5>
              </div>
              <p className="text-sm text-left text-text-secondary mb-4">
                Permanently delete your account and all associated health data.
              </p>
              <button
                className="inline-flex items-center justify-center px-4 py-2 rounded-sm bg-red-500 text-white hover:bg-red-700 cursor-pointer w-full"
              >
                <Trash2 size={16} className="mr-2" /> Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Compliance Information */}
        <div className="p-4 bg-transparent border border-success/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Shield size={20} className="text-success" />
            <div>
              <h4 className="font-medium text-left text-text-primary mb-2">Privacy Compliance</h4>
              <div className="space-y-2 text-sm text-text-secondary">
                <div className="flex items-center space-x-2">
                  <Check size={16} className="text-success" />
                  <span>HIPAA Compliant - Your health data is protected under federal law</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check size={16} className="text-success" />
                  <span>End-to-End Encryption - All data is encrypted in transit and at rest</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check size={16} className="text-success" />
                  <span>SOC 2 Type II Certified - Independently audited security controls</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check size={16} className="text-success" />
                  <span>GDPR Compliant - European data protection standards</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <HelpCircle size={20} className="text-sky-500" />
            <div>
              <h4 className="font-medium text-left text-text-primary mb-2">Privacy Questions?</h4>
              <p className="text-sm text-text-secondary mb-3">
                Have questions about how we handle your data? Our privacy team is here to help.
              </p>
              <div className="flex space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail size={16} />
                  <span>privacy@medihelp.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={16} />
                  <span>1-800-PRIVACY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettingsCard;