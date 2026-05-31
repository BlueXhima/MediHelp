// src/hooks/useMetricsManager.js
import { useState, useEffect, useCallback } from 'react';
import { healthService } from '../../services/healthService';
import { showToast } from '../../components/ToastMessage';

export const useMetricsManager = (patientId) => {
    // FIX: Gawing walang laman (empty strings) ang initial values para mag-trigger ang Empty State kung walang data sa DB
    const [vitals, setVitals] = useState({
        bloodPressure: '',
        heartRate: '',
        weight: '',
        height: '',
        bloodSugar: '',
        temperature: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const fetchMetrics = useCallback(async () => {
        if (!patientId) return;
        setIsLoading(true);
        try {
            const result = await healthService.getLatestMetrics(patientId);
            // Kung may nakitang totoong data sa database, i-set ito sa state
            if (result.success && result.metrics) {
                setVitals({
                    bloodPressure: result.metrics.bloodPressure || '',
                    heartRate: result.metrics.heartRate ? String(result.metrics.heartRate) : '',
                    weight: result.metrics.weight ? String(result.metrics.weight) : '',
                    height: result.metrics.height ? String(result.metrics.height) : '',
                    bloodSugar: result.metrics.bloodSugar ? String(result.metrics.bloodSugar) : '',
                    temperature: result.metrics.temperature ? String(result.metrics.temperature) : ''
                });
            } else {
                // Kung walang nahanap na record sa DB, siguruhing malinis ang state para sa Empty State Interface
                setVitals({
                    bloodPressure: '',
                    heartRate: '',
                    weight: '',
                    height: '',
                    bloodSugar: '',
                    temperature: ''
                });
            }
        } catch (error) {
            console.error("Error loading health metrics:", error);
            showToast("Failed to sync health metrics.", "error");
        } finally {
            setIsLoading(false);
        }
    }, [patientId]);

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);

    const handleMetricChange = (key, value) => {
        setVitals(prev => ({ ...prev, [key]: value }));
    };

    const handleSaveMetrics = async () => {
        setIsLoading(true);
        try {
            const result = await healthService.updateMetrics(patientId, vitals);
            if (result.success) {
                showToast("Health metrics updated successfully.", "success");
                fetchMetrics(); 
                return { success: true };
            }
        } catch (error) {
            console.error("Error updating health metrics:", error);
            showToast("Failed to save health metrics.", "error");
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        vitals,
        setVitals,
        isLoading,
        handleMetricChange,
        handleSaveMetrics,
        fetchMetrics
    };
};