import React, { useState } from 'react';
import { Shield, AlertCircle, Clock, FileText, Lock, ChevronUp, ChevronDown} from 'lucide-react';
import Button from '../../../components/Button.jsx';

const MedicalDisclaimer = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 shadow-medical">
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                    <Shield size={20} className="text-amber-600 mt-0.5" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-amber-800">Important Medical Disclaimer</h4>
                        <Button
                            variant="ghost"
                            size="xs"
                            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-amber-700 hover:text-amber-800 cursor-pointer p-0"
                        >
                            {isExpanded ? <ChevronUp /> : <ChevronDown />}
                        </Button>
                    </div>
                    
                    <p className="text-sm text-left text-amber-700 mt-2">
                        MediHelp provides general health information and guidance only. This is not medical diagnosis or treatment.
                    </p>

                    {isExpanded && (
                        <div className="mt-4 space-y-3 text-sm text-amber-700">
                            <div className="flex items-start space-x-2">
                                <AlertCircle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                                <p>
                                    <strong>Not a substitute for professional medical advice:</strong> Always consult with qualified healthcare professionals for medical advice, diagnosis, or treatment decisions.
                                </p>
                            </div>
                            <div className="flex items-start space-x-2">
                                <Clock size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                                <p>
                                    <strong>Emergency situations:</strong> For medical emergencies, call 911 or your local emergency services immediately.
                                </p>
                            </div>
                            <div className="flex items-start space-x-2">
                                <FileText size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                                <p>
                                    <strong>Information accuracy:</strong> While we strive for accuracy, medical information may change and individual circumstances vary.
                                </p>
                            </div>
                            <div className="flex items-start space-x-2">
                                <Lock size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                                <p>
                                    <strong>Privacy protection:</strong> Your conversations are encrypted and protected under HIPAA compliance standards.
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-amber-300">
                                <p className="text-xs">
                                    By using this voice assistant, you acknowledge that you understand these limitations and agree to seek professional medical care when appropriate.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MedicalDisclaimer;