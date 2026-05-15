// FeedbackModal.jsx

import { X } from "lucide-react";

export default function FeedbackModal({
  isOpen,
  onClose,
  options,
  selectedOptions,
  onOptionToggle,
  feedbackText,
  onTextChange,
  onSubmit,
}) {
  if (!isOpen) return null;

  const isOtherSelected = selectedOptions.includes('other');
  const canSubmit = selectedOptions.length > 0 && (!isOtherSelected || feedbackText.trim().length > 0);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="bg-background w-full max-w-md rounded-2xl shadow-2xl max-h-[90vh] flex flex-col border animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
      >
        <div className="flex items-center justify-between p-5 border-b bg-muted/30 rounded-t-2xl">
          <h3 id="feedback-title" className="font-semibold text-lg">Share Feedback</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Close feedback modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5 overflow-y-auto">
          <p className="text-sm text-muted-foreground">
            Why wasn't this response helpful? Your feedback helps us improve.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {options.map((option) => (
              <label
                key={option.id}
                className={`flex text-start items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedOptions.includes(option.id)
                    ? "bg-primary/5 border-primary shadow-sm" 
                    : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option.id)}
                  onChange={() => onOptionToggle(option.id)}
                  className="w-4 h-4 rounded border-gray-300 shrink-0 accent-primary cursor-pointer"
                />
                <span className="text-sm font-medium leading-tight select-none">{option.label}</span>
              </label>
            ))}
          </div>

          <div className="space-y-2">
            <label 
              htmlFor="feedback-text"
              className={`text-sm font-medium flex items-center gap-1 ${
                isOtherSelected ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Additional comments
              {isOtherSelected && <span className="text-destructive">*</span>}
            </label>
            <textarea
              id="feedback-text"
              value={feedbackText}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder={isOtherSelected 
                ? "Please describe the issue in detail..." 
                : "Optional - enabled when 'Other' is selected"
              }
              disabled={!isOtherSelected}
              className={`w-full min-h-[100px] rounded-xl border-2 px-4 py-3 text-sm resize-none transition-all focus:outline-none ${
                isOtherSelected
                  ? "bg-background border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10"
                  : "bg-muted/50 border-border cursor-not-allowed opacity-60"
              }`}
            />
            {isOtherSelected && (
              <p className="text-xs text-muted-foreground">
                Please provide details so we can better understand your feedback.
              </p>
            )}
          </div>
        </div>

        <div className="p-5 border-t flex justify-end gap-3 bg-muted/30 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium border-2 border-border rounded-xl hover:bg-muted transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            className="px-5 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
}