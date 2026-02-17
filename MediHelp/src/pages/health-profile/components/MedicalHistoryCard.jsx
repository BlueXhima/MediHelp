import React, { useState } from 'react';
import { FileText, Activity, AlertTriangle, Scissors, Trash2, Plus, Edit, X, Check } from 'lucide-react';
import Button from '../../../components/Button.jsx';
import Input from '../../../components/ui/Input.jsx';

const MedicalHistoryCard = ({ medicalHistory, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [conditions, setConditions] = useState(medicalHistory?.conditions);
    const [allergies, setAllergies] = useState(medicalHistory?.allergies);
    const [surgeries, setSurgeries] = useState(medicalHistory?.surgeries);
    const [newCondition, setNewCondition] = useState('');
    const [newAllergy, setNewAllergy] = useState('');
    const [newSurgery, setNewSurgery] = useState('');

    const handleSave = () => {
        onUpdate({
            conditions,
            allergies,
            surgeries
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setConditions(medicalHistory?.conditions);
        setAllergies(medicalHistory?.allergies);
        setSurgeries(medicalHistory?.surgeries);
        setNewCondition('');
        setNewAllergy('');
        setNewSurgery('');
        setIsEditing(false);
    };

    const addCondition = () => {
        if (newCondition?.trim()) {
            setConditions([...conditions, {
                id: Date.now(),
                name: newCondition,
                diagnosedDate: new Date()?.toISOString()?.split('T')?.[0],
                status: 'Active'
            }]);
            setNewCondition('');
        }
    };

    const addAllergy = () => {
        if (newAllergy?.trim()) {
            setAllergies([...allergies, {
                id: Date.now(),
                allergen: newAllergy,
                severity: 'Moderate',
                reaction: 'Unknown'
            }]);
            setNewAllergy('');
        }
    };

    const addSurgery = () => {
        if (newSurgery?.trim()) {
            setSurgeries([...surgeries, {
                id: Date.now(),
                procedure: newSurgery,
                date: new Date()?.toISOString()?.split('T')?.[0],
                hospital: 'Not specified'
            }]);
            setNewSurgery('');
        }
    };

    const removeCondition = (id) => {
        setConditions(conditions?.filter(c => c?.id !== id));
    };

    const removeAllergy = (id) => {
        setAllergies(allergies?.filter(a => a?.id !== id));
    };

    const removeSurgery = (id) => {
        setSurgeries(surgeries?.filter(s => s?.id !== id));
    };

    return (
        <div className="bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 rounded-xl shadow-medical p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <FileText size={20} className="text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary">Medical History</h3>
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
            <div className="space-y-8">
                {/* Medical Conditions */}
                <div>
                    <h4 className="text-lg font-medium text-text-primary mb-4 flex items-center">
                        <Activity size={18} className="mr-2" />
                        Medical Conditions
                    </h4>
                    <div className="space-y-3">
                        {conditions?.map((condition) => (
                            <div
                                key={condition?.id}
                                className="flex items-center justify-between px-4 py-2 bg-background/40 rounded-lg"
                            >
                                <div>
                                    <p className="font-medium text-left text-foreground">{condition?.name}</p>
                                    <p className="text-sm text-text-foreground">
                                        Diagnosed: {condition?.diagnosedDate} • Status: {condition?.status}
                                    </p>
                                </div>
                                {isEditing && (
                                    <button
                                        className="inline-flex items-center justify-center px-4 py-4 rounded-md text-red-500 hover:text-red-700 hover:bg-red-100 cursor-pointer"
                                        onClick={() => removeCondition(condition?.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                        {isEditing && (
                            <div className="flex space-x-2">
                                <Input
                                    type="text"
                                    placeholder="Add new condition"
                                    value={newCondition}
                                    onChange={(e) => setNewCondition(e?.target?.value)}
                                    className="flex-1"
                                />
                                <button
                                    className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-primary text-primary hover:bg-primary/10"
                                    onClick={addCondition}
                                >
                                    <Plus size={16} className="mr-2" /> Add
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Allergies */}
                <div>
                    <h4 className="text-lg font-medium text-text-primary mb-4 flex items-center">
                        <AlertTriangle size={18} className="mr-2" />
                        Allergies
                    </h4>
                    <div className="space-y-3">
                        {allergies?.map((allergy) => (
                            <div key={allergy?.id} className="flex items-center justify-between p-3 bg-background/40 border border-warning/20 rounded-lg">
                                <div>
                                    <p className="font-medium text-left text-text-primary">{allergy?.allergen}</p>
                                    <p className="text-sm text-text-secondary">
                                        Severity: {allergy?.severity} • Reaction: {allergy?.reaction}
                                    </p>
                                </div>
                                {isEditing && (
                                    <button
                                        className="inline-flex items-center justify-center px-4 py-4 rounded-md text-red-500 hover:text-red-700 hover:bg-red-100 cursor-pointer"
                                        onClick={() => removeCondition(condition?.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                        {isEditing && (
                            <div className="flex space-x-2">
                                <Input
                                    type="text"
                                    placeholder="Add new allergy"
                                    value={newAllergy}
                                    onChange={(e) => setNewAllergy(e?.target?.value)}
                                    className="flex-1"
                                />
                                <Button
                                    variant="outline"
                                    iconName="Plus"
                                    onClick={addAllergy}
                                >
                                    Add
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Surgeries */}
                <div>
                    <h4 className="text-lg font-medium text-text-primary mb-4 flex items-center">
                        <Scissors size={18} className="mr-2" />
                        Surgeries & Procedures
                    </h4>
                    <div className="space-y-3">
                        {surgeries?.map((surgery) => (
                            <div key={surgery?.id} className="flex items-center justify-between p-3 bg-background/40 rounded-lg">
                                <div>
                                    <p className="font-medium text-left text-text-primary">{surgery?.procedure}</p>
                                    <p className="text-sm text-text-secondary">
                                        Date: {surgery?.date} • Hospital: {surgery?.hospital}
                                    </p>
                                </div>
                                {isEditing && (
                                    <button
                                        className="inline-flex items-center justify-center px-4 py-4 rounded-md text-red-500 hover:text-red-700 hover:bg-red-100 cursor-pointer"
                                        onClick={() => removeCondition(condition?.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                        {isEditing && (
                            <div className="flex space-x-2">
                                <Input
                                    type="text"
                                    placeholder="Add new surgery/procedure"
                                    value={newSurgery}
                                    onChange={(e) => setNewSurgery(e?.target?.value)}
                                    className="flex-1"
                                />
                                <Button
                                    variant="outline"
                                    iconName="Plus"
                                    onClick={addSurgery}
                                >
                                    Add
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicalHistoryCard;