import { Calendar, MessageCircle, Shield } from "lucide-react";

const QuickStatsBar = () => {
    return (
        <div className="bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-success rounded-full"></div>
                        <span className="text-sm text-text-secondary">Health Status: Good</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Calendar size={16} />
                        <span className="text-sm text-text-secondary">Last Check-up: 2 weeks ago</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <MessageCircle size={16} />
                        <span className="text-sm text-text-secondary">12 questions answered this month</span>
                    </div>
                </div>
                <div className="hidden lg:flex items-center space-x-2 text-sm text-foreground">
                    <Shield size={16} />
                    <span>Secure & Private</span>
                </div>
            </div>
        </div>
    );
};

export default QuickStatsBar;
