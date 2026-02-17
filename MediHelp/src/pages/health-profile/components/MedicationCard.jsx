import React, { useState } from 'react';
import { Pill, Clock, Pause, Play, Trash2, Plus, AlertTriangle, Edit, X, Check } from 'lucide-react';
import Input from '../../../components/ui/Input.jsx';

const MedicationCard = ({ medications, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [medicationList, setMedicationList] = useState(medications);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    prescribedBy: ''
  });

  const handleSave = () => {
    onUpdate(medicationList);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setMedicationList(medications);
    setNewMedication({ name: '', dosage: '', frequency: '', prescribedBy: '' });
    setIsEditing(false);
  };

  const addMedication = () => {
    if (newMedication?.name?.trim()) {
      setMedicationList([...medicationList, {
        id: Date.now(),
        ...newMedication,
        startDate: new Date()?.toISOString()?.split('T')?.[0],
        status: 'Active'
      }]);
      setNewMedication({ name: '', dosage: '', frequency: '', prescribedBy: '' });
    }
  };

  const removeMedication = (id) => {
    setMedicationList(medicationList?.filter(m => m?.id !== id));
  };

  const toggleMedicationStatus = (id) => {
    setMedicationList(medicationList?.map(med => 
      med?.id === id 
        ? { ...med, status: med?.status === 'Active' ? 'Inactive' : 'Active' }
        : med
    ));
  };

  return (
    <div className="bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 rounded-xl shadow-medical p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center">
            <Pill size={20} className="text-white" />
          </div>
          <h3 className="text-xl font-semibold text-text-primary">Current Medications</h3>
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
        {medicationList?.map((medication) => (
          <div key={medication?.id} className={`p-4 rounded-lg border-2 ${
            medication?.status === 'Active' ? 'bg-success/5 border-success/20' :'bg-background/20 border-gray/20'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-medium text-text-primary">{medication?.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    medication?.status === 'Active' ? 'bg-success text-success-foreground' :'bg-gray-500 text-white'
                  }`}>
                    {medication?.status}
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-left text-text-secondary">
                  <div>
                    <span className="font-medium">Dosage:</span> {medication?.dosage}
                  </div>
                  <div>
                    <span className="font-medium">Frequency:</span> {medication?.frequency}
                  </div>
                  <div>
                    <span className="font-medium">Prescribed by:</span> {medication?.prescribedBy}
                  </div>
                  <div>
                    <span className="font-medium">Start Date:</span> {medication?.startDate}
                  </div>
                </div>
              </div>
              {isEditing && (
                <div className="flex space-x-2 ml-4">
                  <button
                    className="inline-flex items-center justify-center px-4 py-4 rounded-md text-green-500 hover:text-green-700 hover:bg-green-100 cursor-pointer"
                    onClick={() => toggleMedicationStatus(medication?.id)}
                  >
                    {medication?.status === 'Active' ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button
                    className="inline-flex items-center justify-center px-4 py-4 rounded-md text-red-500 hover:text-red-700 hover:bg-red-100 cursor-pointer"
                    onClick={() => removeMedication(medication?.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
            {medication?.status === 'Active' && (
              <div className="mt-3 p-3 bg-accent/10 rounded-lg">
                <div className="flex items-center space-x-2 text-sm">
                  <Clock size={16} className="text-blue-500" />
                  <span className="text-text-secondary">
                    Next dose: Today at 8:00 PM
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
        {isEditing && (
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <h4 className="text-lg font-medium text-left text-text-primary mb-4">Add New Medication</h4>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary text-left block">
                  Medication Name
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Lisinopril"
                  value={newMedication?.name}
                  onChange={(e) => setNewMedication({ ...newMedication, name: e?.target?.value })}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary text-left block">
                  Dosage
                </label>
                <Input
                  type="text"
                  placeholder="e.g., 10mg"
                  value={newMedication?.dosage}
                  onChange={(e) => setNewMedication({...newMedication, dosage: e?.target?.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary text-left block">
                  Frequency
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Once daily"
                  value={newMedication?.frequency}
                  onChange={(e) => setNewMedication({...newMedication, frequency: e?.target?.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary text-left block">
                  Prescribed By
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Dr. Smith"
                  value={newMedication?.prescribedBy}
                  onChange={(e) => setNewMedication({...newMedication, prescribedBy: e?.target?.value})}
                />
              </div>
            </div>
            <div className="mt-4 text-left">
              <button
                className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-descructive font-medium 
                  ${!newMedication?.name?.trim() ? 'bg-transparent text-gray-400 cursor-not-allowed' : 'hover:bg-primary hover:text-white cursor-pointer'}`}
                onClick={addMedication}
                disabled={!newMedication?.name?.trim()}
              >
                <Plus size={16} className="mr-2" /> Add Medication
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertTriangle size={20} className="text-icon" />
          <div>
            <h4 className="font-medium text-left text-text-primary mb-1">Drug Interaction Alert</h4>
            <p className="text-sm text-text-secondary">
              Always consult your healthcare provider before starting, stopping, or changing medications. 
              Check for potential drug interactions with your current medications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationCard;