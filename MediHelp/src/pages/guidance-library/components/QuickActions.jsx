import React from 'react';
import Icon from '../../../components/AppIcon';

export const QuickActions = ({ onAction }) => {
  const quickActions = [
    {
      id: 'symptom-checker',
      title: 'Symptom Checker',
      description: 'Get information about symptoms and when to seek care',
      icon: 'Stethoscope',
      color: 'bg-blue-500',
      action: () => onAction('symptom-checker')
    },
    {
      id: 'medication-info',
      title: 'Medication Guide',
      description: 'Learn about medications and drug interactions',
      icon: 'Pill',
      color: 'bg-green-500',
      action: () => onAction('medication-info')
    },
    {
      id: 'emergency-guide',
      title: 'Emergency Guide',
      description: 'First aid and emergency response information',
      icon: 'AlertTriangle',
      color: 'bg-red-500',
      action: () => onAction('emergency-guide')
    },
    {
      id: 'wellness-tips',
      title: 'Wellness Tips',
      description: 'Preventive care and healthy lifestyle guidance',
      icon: 'Heart',
      color: 'bg-purple-500',
      action: () => onAction('wellness-tips')
    },
    {
      id: 'ask-voice',
      title: 'Ask Voice Assistant',
      description: 'Get instant answers through voice interaction',
      icon: 'Mic',
      color: 'bg-sky-500',
      action: () => onAction('voice-assistant')
    },
    {
      id: 'find-provider',
      title: 'Find Healthcare Provider',
      description: 'Locate qualified medical professionals near you',
      icon: 'MapPin',
      color: 'bg-orange-500',
      action: () => onAction('find-provider')
    }
  ];

  return (
    <div className="bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 rounded-xl p-6 shadow-medical mb-8">
      <h3 className="text-xl font-semibold text-primary mb-6 flex items-center">
        <Icon name="Zap" size={24} className="mr-3" />
        Quick Actions
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions?.map((action) => (
          <button
            key={action?.id}
            onClick={action?.action}
            className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-medical transition-all duration-200 text-left group cursor-pointer"
          >
            <div className={`p-3 rounded-lg ${action?.color} text-white group-hover:scale-110 transition-transform`}>
              <Icon name={action?.icon} size={20} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold mb-1 group-hover:text-blue-500 transition-colors">
                {action?.title}
              </h4>
              <p className="text-sm text-text-secondary line-clamp-2">
                {action?.description}
              </p>
            </div>
            
            <Icon 
              name="ArrowRight" 
              size={16} 
              className="text-gray-400 group-hover:text-accent transition-colors mt-1" 
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;