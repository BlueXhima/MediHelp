import React from 'react';
import { MessageCircle, Tag, RotateCcw, Download, Volume2 } from 'lucide-react';
import Button from '../../../components/Button.jsx';

const ConversationHistory = ({ conversations, onReplay, onSave }) => {
    return (
        <div className="bg-white rounded-xl shadow-medical border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-text-primary flex items-center">
                    <MessageCircle size={20} className="mr-3 text-accent" />
                    Conversation History
                </h3>
                <Button 
                    variant="outline" 
                    size="sm"
                    iconPosition="left"
                    onClick={onSave}
                    className="flex items-center text-sm border border-gray-300 rounded-md px-3 py-1
                        bg-white text-gray-900 hover:bg-gray-100 transition cursor-pointer"
                >
                    <Download size={16} className="mr-2" />
                    Export
                </Button>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
                {conversations?.map((conversation) => (
                    <div key={conversation?.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                        {/* User Message */}
                        <div className="flex justify-end mb-3">
                            <div className="chat-bubble-user max-w-xs lg:max-w-md px-4 py-3 bg-blue-100 rounded-t-2xl rounded-bl-2xl text-left">
                                <p className="text-sm text-blue-900 leading-relaxed">{conversation?.userMessage}</p>
                                <span className="text-xs opacity-75 mt-1 block text-right">
                                    {conversation?.timestamp}
                                </span>
                            </div>
                        </div>

                        {/* AI Response */}
                        <div className="flex justify-start mb-3">
                            <div className="chat-bubble-ai max-w-xs lg:max-w-md px-4 py-3 bg-gray-100 rounded-t-2xl rounded-br-2xl text-left">
                                <p className="text-sm text-gray-900 leading-relaxed">{conversation?.aiResponse}</p>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs opacity-75 text-left">{conversation?.timestamp}</span>
                                    <Button
                                        variant="ghost"
                                        size="xs"
                                        iconName="RotateCcw"
                                        onClick={() => onReplay(conversation?.aiResponse)}
                                        className="ml-2 flex items-center text-sm border border-gray-300 rounded-md px-2 py-1
                                                bg-blue text-white hover:bg-gray-100 hover:text-gray-900 transition cursor-pointer"
                                    >
                                        <Volume2 size={14} className="mr-1" />
                                        <span>Replay</span>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Health Topic Tag */}
                        {conversation?.category && (
                        <div className="flex justify-start">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                                <Tag size={12} className="mr-1" />
                                {conversation?.category}
                            </span>
                        </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConversationHistory;