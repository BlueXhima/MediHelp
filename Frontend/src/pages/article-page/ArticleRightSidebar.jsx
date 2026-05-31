import { Share2, Bookmark, Download, MessageCircle, ArrowUpRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button'; // Adjust path based on your folder structure
import ThemeToggle from '../../components/ThemeToggle';

const ArticleRightSidebar = ({ setTextSize, textSize, onShare, onDownload, onSave, isSaved, onFeedback, userFeedback, labels }) => {
    // Map the internal size keys to their translated labels
    const sizeOptions = [
        { id: 'small', label: labels.sizeSmall },
        { id: 'standard', label: labels.sizeStandard },
        { id: 'large', label: labels.sizeLarge }
    ];

    const navigate = useNavigate();

    return (
        <div className="space-y-8">
            <ThemeToggle />

            {/* Appearance Section */}
            <div className="space-y-4">
                <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-foreground">
                    {labels.appearance}
                </h4>
                <div className="space-y-3">
                    <p className="text-[10px] text-slate-400 font-bold uppercase px-1 mt-4">{labels.textSize}</p>
                    {/* One column layout for buttons */}
                    <div className="flex flex-col gap-2">
                        {sizeOptions.map(option => (
                            <Button
                                key={option.id}
                                onClick={() => setTextSize(option.id)}
                                variant={textSize === option.id ? 'primary' : 'ghost'}
                                type="rounded"
                                size="md"
                                className={`justify-start !px-4 py-3 border ${
                                    textSize === option.id 
                                    ? 'border-primary shadow-lg shadow-primary/20' 
                                    : 'border-border text-slate-600'
                                }`}
                            >
                                <span className="capitalize">{option.label}</span>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tools Section */}
            <div className="space-y-3 pt-6 border-t border-border">
                <h4 className="text-[12px] font-bold uppercase tracking-widest text-slate-400">{labels.tool}</h4>
                <div className="flex flex-col gap-2">
                    <Button 
                        variant="ghost" 
                        type="rounded" 
                        className="justify-start !px-3 text-slate-600 hover:text-primary" 
                        leadingIcon={Share2}
                        onClick={onShare}
                    >
                        {labels.buttonShare}
                    </Button>
                    <Button 
                        onClick={onSave} // Dito tatawagin yung handleSaveToLibrary
                        variant={isSaved ? "primary" : "ghost"}
                        type="pill"
                        size="md"
                        className="justify-start !px-3 text-foreground" 
                        leadingIcon={isSaved ? Check : Bookmark} // Magpapalit ng icon
                    >
                        {isSaved ? labels.buttonSaved : labels.buttonSave}
                    </Button>
                    <Button 
                        variant="ghost" 
                        type="rounded" 
                        className="justify-start !px-3 text-slate-600 hover:text-primary" 
                        leadingIcon={Download}
                        onClick={onDownload}
                    >
                        {labels.buttonDownload}
                    </Button>
                </div>
            </div>

            {/* Feedback Section */}
            <div className="pt-6 border-t border-border">
                <div className="bg-card rounded-3xl p-5 border border-border">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3">
                        {labels.wasHelpful}
                    </p>
                    <div className="flex gap-2">
                        <Button 
                            // Highlight "YES" kung userFeedback ay true
                            variant={userFeedback === true ? "primary" : "ghost"} 
                            className="flex-1 text-[10px] font-bold py-2 border border-border"
                            onClick={() => onFeedback(true)}
                        >
                            {userFeedback === true && <Check size={14} className="mr-2" />}
                            {labels.yes}
                        </Button>
                        <Button 
                            // Highlight "NO" kung userFeedback ay false
                            variant={userFeedback === false ? "primary" : "ghost"} 
                            className="flex-1 text-[10px] font-bold py-2 border border-border"
                            onClick={() => onFeedback(false)}
                        >
                            {userFeedback === false && <Check size={14} className="mr-2" />}
                            {labels.no}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Need Help Card */}
            <div className="pt-6 border-t border-border">
                {/* Uses slate-900 to ensure high contrast with your primary purple theme */}
                <div className="bg-slate-900 rounded-[2rem] p-6 relative overflow-hidden group">
                    {/* Background Gradient uses your --color-primary from index.css */}
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/40 transition-colors duration-500" />
                    
                    <div className="relative z-10 space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <MessageCircle size={20} />
                        </div>
                        <div>
                            <h5 className="text-white font-bold text-sm">{labels.needHelp}</h5>
                            <p className="text-slate-400 text-[11px] leading-relaxed mt-1">
                                {labels.descHelp}
                            </p>
                        </div>
                        <Button 
                            variant="primary" 
                            type="rounded" 
                            size="sm" 
                            className="w-full text-[10px] py-4 shadow-lg shadow-primary/20"
                            trailingIcon={ArrowUpRight}
                            onClick={() => navigate('/contact-support')}
                        >
                            {labels.contactSupport}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleRightSidebar;