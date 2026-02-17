import React from 'react';
import Icon from '../../../components/AppIcon';

export const GuidanceHistory = ({ history, onViewHistory, onClearHistory }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'voice': return 'Mic';
      case 'search': return 'Search';
      case 'bookmark': return 'Bookmark';
      default: return 'MessageSquare';
    }
  };

  return (
    <div className="bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 rounded-xl p-4 shadow-medical ">
      <div className="mb-4">
        <h3 className="text-lg text-left font-semibold text-primary flex items-center">
          <Icon name="History" size={16} className="mr-2" />
          Recent Guidance History
        </h3>

        <div className="flex gap-2 mt-2">
          <button
            className="inline-flex items-center justify-center cursor-pointer px-6 py-2 text-md bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
            onClick={onViewHistory}
          >
            <Icon name="Eye" size={14} className="mr-1" /> View All
          </button>

          <button
            className="inline-flex items-center justify-center cursor-pointer px-6 py-2 text-md bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
            onClick={onClearHistory}
          >
            <Icon name="Trash2" size={14} className="mr-1" /> Clear
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {history?.length === 0 ? (
          <div className="text-center py-6">
            <Icon name="Clock" size={36} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-text-secondary">No guidance history yet</p>
            <p className="text-xs text-text-secondary mt-1">
              Your searches and interactions will appear here
            </p>
          </div>
        ) : (
          history?.map((item) => (
            <div
              key={item?.id}
              className="flex items-start space-x-3 p-3 rounded-md border border-gray-100 hover:bg-gray-300/20 transition cursor-pointer"
              onClick={() => onViewHistory(item)}
            >
              <div className={`p-1.5 rounded-full ${
                item?.type === 'voice' ? 'bg-accent/10 text-accent' :
                item?.type === 'search' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
              }`}>
                <Icon name={getTypeIcon(item?.type)} size={14} />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm text-left font-medium text-primary mb-1 truncate">
                  {item?.query}
                </h4>

                <p className="text-xs text-left text-text-secondary mb-1 line-clamp-2">
                  {item?.summary}
                </p>

                <div className="flex flex-col text-xs text-text-secondary space-y-1 mt-4">
                  <span className="flex items-center space-x-2">
                    <Icon name="Calendar" size={16} />
                    <span>{formatDate(item?.timestamp)}</span>
                  </span>

                  <span className="flex items-center space-x-2">
                    <Icon name="Tag" size={16} />
                    <span className="capitalize">{item?.category}</span>
                  </span>
                </div>
              </div>

              <Icon name="ChevronRight" size={14} className="text-gray-400" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GuidanceHistory;