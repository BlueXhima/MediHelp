//src/hooks/useFeedback.js

import { useState, useCallback } from 'react';

const FEEDBACK_OPTIONS = [
  { id: 'slow', label: 'Slow and buggy' },
  { id: 'incorrect', label: 'Incorrect or incomplete' },
  { id: 'not_helpful', label: 'Not helpful' },
  { id: 'offensive', label: 'Offensive or unsafe' },
  { id: 'other', label: 'Other' },
];

export default function useFeedback() {
  const [feedbackState, setFeedbackState] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [feedbackText, setFeedbackText] = useState('');

  const handleThumbsUp = useCallback((messageId) => {
    setFeedbackState((prev) => {
      const current = prev[messageId];
      if (current?.type === 'positive') {
        const { [messageId]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [messageId]: { type: 'positive', submitted: true },
      };
    });
  }, []);

  const handleThumbsDown = useCallback((messageId) => {
    const currentFeedback = feedbackState[messageId];

    if (currentFeedback?.type === 'negative') {
      setFeedbackState((prev) => {
        const { [messageId]: _, ...rest } = prev;
        return rest;
      });
      return;
    }

    setSelectedMessageId(messageId);
    setSelectedOptions([]);
    setFeedbackText('');
    setIsModalOpen(true);
  }, [feedbackState]);

  const handleOptionToggle = useCallback((optionId) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  }, []);

  const handleSubmitFeedback = useCallback(() => {
    if (!selectedMessageId) return;
    
    const isOtherSelected = selectedOptions.includes('other');
    if (isOtherSelected && !feedbackText.trim()) {
      return;
    }

    setFeedbackState((prev) => ({
      ...prev,
      [selectedMessageId]: { type: 'negative', submitted: true },
    }));

    setIsModalOpen(false);
    setSelectedMessageId(null);
    setSelectedOptions([]);
    setFeedbackText('');
  }, [selectedMessageId, selectedOptions, feedbackText]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedMessageId(null);
    setSelectedOptions([]);
    setFeedbackText('');
  }, []);

  const getFeedbackForMessage = useCallback(
    (messageId) => feedbackState[messageId] || null,
    [feedbackState]
  );

  return {
    isModalOpen,
    selectedOptions,
    feedbackText,
    setFeedbackText,
    FEEDBACK_OPTIONS,
    handleThumbsUp,
    handleThumbsDown,
    handleOptionToggle,
    handleSubmitFeedback,
    handleCloseModal,
    getFeedbackForMessage,
  };
}