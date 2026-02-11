import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

export const ContentCard = ({ content, onBookmark, onView }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'article': return 'FileText';
      case 'video': return 'Play';
      case 'faq': return 'HelpCircle';
      case 'guidance': return 'MessageSquare';
      default: return 'FileText';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'article': return 'text-blue-600';
      case 'video': return 'text-red-600';
      case 'faq': return 'text-green-600';
      case 'guidance': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-card dark:bg-card rounded-xl shadow-medical border border-border overflow-hidden hover:shadow-lg hover:border-2 hover:border-blue-500 hover:translate-y-[-2px] transition-all duration-300">
      {content?.image && (
        <div className="h-48 overflow-hidden">
          <Image
            src={content?.image}
            alt={content?.imageAlt}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon 
              name={getTypeIcon(content?.type)} 
              size={18} 
              className={getTypeColor(content?.type)} 
            />
            <span className={`text-sm font-medium capitalize ${getTypeColor(content?.type)}`}>
              {content?.type}
            </span>
          </div>
          
          <button
            onClick={() => onBookmark(content?.id)}
            className={`p-1 rounded-full transition-colors cursor-pointer ${
              content?.isBookmarked 
                ? 'text-yellow-500 hover:text-yellow-600' :'text-gray-400 hover:text-yellow-500'
            }`}
          >
            <Icon name={content?.isBookmarked ? "Bookmark" : "BookmarkPlus"} size={18} />
          </button>
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-left text-primary mb-2 line-clamp-2">
          {content?.title}
        </h3>
        
        <p className="text-text-secondary text-left text-sm mb-4 line-clamp-3">
          {content?.description}
        </p>

        {/* Tags */}
        {content?.tags && content?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {content?.tags?.slice(0, 3)?.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-muted text-text-secondary text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {content?.tags?.length > 3 && (
              <span className="px-2 py-1 bg-muted text-text-secondary text-xs rounded-full">
                +{content?.tags?.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-text-secondary">
            <div className="flex items-center space-x-1">
              <Icon name="Calendar" size={14} />
              <span>{formatDate(content?.updatedAt)}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} />
              <span>{content?.readTime} min read</span>
            </div>
            
            {content?.rating && (
              <div className="flex items-center space-x-1">
                <Icon name="Star" size={14} className="text-yellow-500" />
                <span>{content?.rating}</span>
              </div>
            )}
          </div>

          <button
            className="flex items-center space-x-2 bg-transparent hover:bg-sky-500 hover:text-white px-4 py-1 rounded-md transition-colors cursor-pointer text-md font-medium"
            onClick={() => onView(content)}
          >
            <span>View</span>
            <Icon name="ExternalLink" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;