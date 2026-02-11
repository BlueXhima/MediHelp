import React from 'react';
import Icon from '../../../components/AppIcon.jsx';

export const CategoryFilter = ({ selectedCategory, onCategoryChange, categories }) => {
  return (
    <div className="bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 rounded-xl p-6 shadow-medical mb-8">
      <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
        <Icon name="Filter" size={20} className="mr-2" />
        Browse by Category
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        <button
          onClick={() => onCategoryChange('all')}
          className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
            selectedCategory === 'all' ?'border-primary bg-primary text-primary-foreground shadow-medical' :'border-gray-200 hover:border-blue-500 hover:bg-gray-50'
          }`}
        >
          <Icon name="Grid3X3" size={24} className="mb-2" />
          <span className="text-sm font-medium">All Topics</span>
        </button>
        
        {categories?.map((category) => (
          <button
            key={category?.id}
            onClick={() => onCategoryChange(category?.id)}
            className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all cursor-pointer ${
              selectedCategory === category?.id
                ? 'border-primary bg-primary text-primary-foreground shadow-medical'
                : 'border-gray-200 hover:border-blue-500 hover:bg-gray-400/40'
            }`}
          >
            <Icon name={category?.icon} size={24} className="mb-2" />
            <span className="text-sm font-medium text-center">{category?.name}</span>
            <span className="text-xs opacity-75 mt-1">{category?.count} articles</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;