import React, { useState } from 'react';
import { Search, Mic, MicOff } from 'lucide-react';

import Input from '../../../components/ui/Input';

export const SearchBar = ({ onSearch, onVoiceSearch, isListening }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e?.preventDefault();
    onSearch(searchQuery);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e?.target?.value);
    if (e?.target?.value?.length > 2) {
      onSearch(e?.target?.value);
    }
  };

  return (
    <div className="bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 rounded-xl p-6 shadow-medical mb-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-primary mb-4 text-center">
          Search Health Topics & Guidance
        </h2>
        <p className="text-text-secondary text-center mb-6">
          Find reliable health information, previous guidance, and educational resources
        </p>
        
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search symptoms, conditions, medications, or health topics..."
              value={searchQuery}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-6 py-2 cursor-pointer bg-success text-white rounded-sm flex items-center space-x-2 hover:bg-success/90 transition-colors"
            >
              <Search size={16} />
              <span>Search</span>
            </button>
            
            <button
              type="button"
              onClick={onVoiceSearch}
              className={`px-4 py-2 cursor-pointer ${isListening ? 'bg-blue-500' : 'bg-sky-500'} text-white rounded-sm flex items-center space-x-2 hover:${isListening ? 'bg-destructive/90' : 'bg-sky-500/90'} transition-colors ${isListening ? 'voice-pulse' : ''}`}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              <span>{isListening ? 'Stop' : 'Voice'}</span>
            </button>
          </div>
        </form>

        {/* Quick Search Suggestions */}
        <div className="mt-4">
          <p className="text-sm text-left text-text-secondary mb-2">Popular searches:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'Common cold symptoms',
              'Blood pressure management',
              'Diabetes care',
              'Mental health',
              'Exercise guidelines',
              'Medication interactions'
            ]?.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setSearchQuery(suggestion);
                  onSearch(suggestion);
                }}
                className="px-3 py-1 bg-transparent text-text-secondary rounded-full text-sm hover:bg-sky-500 hover:text-white transition-colors cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;