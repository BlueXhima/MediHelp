import { Zap } from "lucide-react";

const Icon = ({ name, size, color, strokeWidth, className }) => {
    const icons = {
        Sparkles: '✨',
        Calendar: '📅',
        MessageCircle: '💬',
        Shield: '🛡️',
        Mic: '🎤',
        MicOff: '🔇',
        Pill: '💊',
        Thermometer: '🌡️',
        Heart: '❤️',
        BookOpen: '📚',
        Dumbbell: '💪',
        Brain: '🧠',
        Clock: '⏰',
        ArrowRight: '➡️',
        Plus: '➕',
        Zap: '⚡',
    };
    return <span style={{ fontSize: size, color }} className={className}>{icons[name] || name}</span>;
};

export default Icon;
