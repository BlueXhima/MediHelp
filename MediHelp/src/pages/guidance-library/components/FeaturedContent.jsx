import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { ArrowRight } from 'lucide-react';

export const FeaturedContent = ({ featuredItems, onViewContent }) => {
  return (
    <div className="bg-primary rounded-xl shadow-medical-hover p-8 mb-8 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Featured Health Resources</h2>
          <p className="text-white/90">
            Curated content from medical professionals and trusted sources
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredItems?.map((item) => (
            <div
              key={item?.id}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300 cursor-pointer"
              onClick={() => onViewContent(item)}
            >
              {item?.image && (
                <div className="h-32 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={item?.image}
                    alt={item?.imageAlt}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-center space-x-2 mb-3">
                <Icon name={item?.icon} size={18} />
                <span className="text-sm font-medium opacity-90">{item?.category}</span>
              </div>

              <h3 className="text-lg text-left font-semibold mb-2 line-clamp-2">
                {item?.title}
              </h3>

              <p className="text-white/80 text-left text-sm mb-4 line-clamp-3">
                {item?.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs opacity-75">
                  <span className="flex items-center space-x-1">
                    <Icon name="Clock" size={12} />
                    <span>{item?.readTime} min</span>
                  </span>
                  
                  <span className="flex items-center space-x-1">
                    <Icon name="Eye" size={12} />
                    <span>{item?.views}</span>
                  </span>
                </div>

                <button
                  className="inline-flex flex items-center bg-blue-500 hover:bg-blue-600 cursor-pointer space-x-2 px-4 py-2 rounded-lg text-sm font-medium"
                  onClick={(e) => {
                    e?.stopPropagation();
                    onViewContent(item);
                  }}
                >
                  <span>Read More</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedContent;