import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity, Heart, Scale, Plus, X, Check, Info } from 'lucide-react';
import Input from '../../../components/ui/Input.jsx';

const HealthMetricsCard = ({ healthMetrics, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [metrics, setMetrics] = useState(healthMetrics);
  const [selectedMetric, setSelectedMetric] = useState('bloodPressure');
  const [newReading, setNewReading] = useState({
    systolic: '',
    diastolic: '',
    heartRate: '',
    weight: '',
    bloodSugar: '',
    temperature: ''
  });

  const handleSave = () => {
    onUpdate(metrics);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setMetrics(healthMetrics);
    setNewReading({
      systolic: '', diastolic: '', heartRate: '', 
      weight: '', bloodSugar: '', temperature: ''
    });
    setIsEditing(false);
  };

  const addReading = () => {
    const today = new Date()?.toISOString()?.split('T')?.[0];
    const newEntry = {
      date: today,
      timestamp: new Date()?.toISOString()
    };

    if (selectedMetric === 'bloodPressure' && newReading?.systolic && newReading?.diastolic) {
      newEntry.systolic = parseInt(newReading?.systolic);
      newEntry.diastolic = parseInt(newReading?.diastolic);
      setMetrics(prev => ({
        ...prev,
        bloodPressure: [...prev?.bloodPressure, newEntry]
      }));
    } else if (selectedMetric === 'heartRate' && newReading?.heartRate) {
      newEntry.bpm = parseInt(newReading?.heartRate);
      setMetrics(prev => ({
        ...prev,
        heartRate: [...prev?.heartRate, newEntry]
      }));
    } else if (selectedMetric === 'weight' && newReading?.weight) {
      newEntry.kg = parseFloat(newReading?.weight);
      setMetrics(prev => ({
        ...prev,
        weight: [...prev?.weight, newEntry]
      }));
    }

    setNewReading({
      systolic: '', diastolic: '', heartRate: '', 
      weight: '', bloodSugar: '', temperature: ''
    });
  };

  const getChartData = () => {
    switch (selectedMetric) {
      case 'bloodPressure':
        return metrics?.bloodPressure?.map(reading => ({
          date: reading?.date,
          systolic: reading?.systolic,
          diastolic: reading?.diastolic
        }));
      case 'heartRate':
        return metrics?.heartRate?.map(reading => ({
          date: reading?.date,
          bpm: reading?.bpm
        }));
      case 'weight':
        return metrics?.weight?.map(reading => ({
          date: reading?.date,
          kg: reading?.kg
        }));
      default:
        return [];
    }
  };

  const getLatestReading = () => {
    switch (selectedMetric) {
      case 'bloodPressure':
        const latestBP = metrics?.bloodPressure?.[metrics?.bloodPressure?.length - 1];
        return latestBP ? `${latestBP?.systolic}/${latestBP?.diastolic} mmHg` : 'No data';
      case 'heartRate':
        const latestHR = metrics?.heartRate?.[metrics?.heartRate?.length - 1];
        return latestHR ? `${latestHR?.bpm} bpm` : 'No data';
      case 'weight':
        const latestWeight = metrics?.weight?.[metrics?.weight?.length - 1];
        return latestWeight ? `${latestWeight?.kg} kg` : 'No data';
      default:
        return 'No data';
    }
  };

  const metricOptions = [
    { key: 'bloodPressure', label: 'Blood Pressure', icon: Activity, color: '#007BFF' },
    { key: 'heartRate', label: 'Heart Rate', icon: Heart, color: '#DC3545' },
    { key: 'weight', label: 'Weight', icon: Scale, color: '#28A745' }
  ];

  return (
    <div className="bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 rounded-xl shadow-medical p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
            <TrendingUp size={20} className="text-white" />
          </div>
          <h3 className="text-xl font-semibold text-text-primary">Health Metrics</h3>
        </div>
        {!isEditing ? (
          <button
            className="inline-flex items-center justify-center px-4 py-2 rounded-md text-gray-700 hover:bg-primary hover:text-white cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            <Plus size={16} className="mr-2" /> Add Reading
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

      {/* Metric Selector */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {metricOptions?.map((option) => (
          <button
            key={option?.key}
            onClick={() => setSelectedMetric(option?.key)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              selectedMetric === option?.key
                ? 'bg-success text-primary-foreground'
                : 'bg-muted text-text-secondary hover:bg-primary/10'
            }`}
          >
            <option.icon size={16} />
            <span>{option?.label}</span>
          </button>
        ))}
      </div>

      {/* Current Reading */}
      <div className="mb-6 p-4 w bg-background rounded-lg">
        <div className="flex items-center justify-between rounded-lg">
          <div>
            <p className="text-sm text-left text-text-secondary">Latest Reading</p>
            <p className="text-3xl font-bold text-text-primary">{getLatestReading()}</p>
          </div>
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            {React.createElement(
              metricOptions.find(opt => opt?.key === selectedMetric)?.icon || Activity,
              { size: 24, className: "text-white" }
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6">
        <h4 className="text-xl text-left font-medium text-text-primary mb-4">Trend (Last 30 Days)</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              {selectedMetric === 'bloodPressure' && (
                <>
                  <Line type="monotone" dataKey="systolic" stroke="#007BFF" strokeWidth={2} />
                  <Line type="monotone" dataKey="diastolic" stroke="#20B2AA" strokeWidth={2} />
                </>
              )}
              {selectedMetric === 'heartRate' && (
                <Line type="monotone" dataKey="bpm" stroke="#DC3545" strokeWidth={2} />
              )}
              {selectedMetric === 'weight' && (
                <Line type="monotone" dataKey="kg" stroke="#28A745" strokeWidth={2} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Add New Reading */}
      {isEditing && (
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
          <h4 className="text-lg text-left font-medium text-text-primary mb-4">
            Add New {metricOptions?.find(opt => opt?.key === selectedMetric)?.label} Reading
          </h4>
          
          {selectedMetric === 'bloodPressure' && (
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <Input
                label="Systolic (mmHg)"
                type="number"
                placeholder="e.g., 120"
                value={newReading?.systolic}
                onChange={(e) => setNewReading({...newReading, systolic: e?.target?.value})}
              />
              <Input
                label="Diastolic (mmHg)"
                type="number"
                placeholder="e.g., 80"
                value={newReading?.diastolic}
                onChange={(e) => setNewReading({...newReading, diastolic: e?.target?.value})}
              />
            </div>
          )}

          {selectedMetric === 'heartRate' && (
            <div className="text-left">
              <Input
                label="Heart Rate (bpm)"
                type="number"
                placeholder="e.g., 72"
                value={newReading?.heartRate}
                onChange={(e) => setNewReading({...newReading, heartRate: e?.target?.value})}
                className="max-w-md mt-2"
              />
            </div>
          )}

          {selectedMetric === 'weight' && (
            <div className="text-left">
              <Input
                label="Weight (kg)"
                type="number"
                placeholder="e.g., 70.5"
                step="0.1"
                value={newReading?.weight}
                onChange={(e) => setNewReading({...newReading, weight: e?.target?.value})}
                className="max-w-md mt-2"
              />
            </div>
          )}

          <div className="mt-4 text-left">
            <button
              className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-destructive font-medium 
                ${(selectedMetric === 'bloodPressure' && (!newReading?.systolic || !newReading?.diastolic)) ||
                  (selectedMetric === 'heartRate' && !newReading?.heartRate) ||
                  (selectedMetric === 'weight' && !newReading?.weight)
                    ? 'bg-transparent text-gray-400 cursor-not-allowed' 
                    : 'hover:bg-primary hover:text-white cursor-pointer'}`}
              disabled={
                (selectedMetric === 'bloodPressure' && (!newReading?.systolic || !newReading?.diastolic)) ||
                (selectedMetric === 'heartRate' && !newReading?.heartRate) ||
                (selectedMetric === 'weight' && !newReading?.weight)
              }
            >
              <Plus size={16} className="mr-2" /> Add Reading
            </button>
          </div>
        </div>
      )}
      <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Info size={20} className="text-sky-500" />
          <div>
            <h4 className="font-medium text-left text-text-primary mb-1">Health Tracking Tips</h4>
            <p className="text-sm text-text-secondary">
              Regular monitoring helps track your health trends. Always take readings at consistent times 
              and share significant changes with your healthcare provider.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthMetricsCard;