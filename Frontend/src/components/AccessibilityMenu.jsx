import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Accessibility, X, Contrast, Minus, Plus, Type, Baseline, ArrowDownUp, AlignLeft, ZoomIn, RotateCcw, FileText } from 'lucide-react';

const AccessibilityMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [menuVertical, setMenuVertical] = useState('up');
    const [menuHorizontal, setMenuHorizontal] = useState('left');
    const [activeStates, setActiveStates] = useState({});
    const buttonRef = useRef(null);

    const checkPosition = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            // Kung ang button ay nasa lower half ng screen, i-display ang menu sa taas (up)
            setMenuVertical(rect.top > window.innerHeight / 2 ? 'up' : 'down');
            // Kung ang button ay nasa right side, i-align sa right
            setMenuHorizontal(rect.left > window.innerWidth / 2 ? 'right' : 'left');
        }
    };

    const toggleMenu = () => {
        if (!isOpen) checkPosition();
        setIsOpen(!isOpen);
    };

    const updateStyle = (prop, value, key) => {
        const isCurrentlyActive = activeStates[key];
        const root = document.documentElement.style;

        if (!isCurrentlyActive) {
            // I-apply ang style kung ON
            root.setProperty(prop, value);
        } else {
            // Alisin ang style kung OFF
            root.removeProperty(prop);
        }
        
        // I-update ang state
        setActiveStates(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleHighContrast = () => {
        document.documentElement.classList.toggle('dark');
        setActiveStates(prev => ({ ...prev, contrast: !prev.contrast }));
    };

    const changeFontSize = (delta) => {
        const root = document.documentElement;
        const size = parseFloat(getComputedStyle(root).fontSize || 16);
        root.style.fontSize = `${size + delta}px`;
    };

    const handleZoom = (delta) => {
        const root = document.documentElement;
        const currentZoom = parseFloat(getComputedStyle(root).getPropertyValue('--text-zoom') || 1);
        const newZoom = Math.min(Math.max(currentZoom + delta, 0.8), 1.5); // Limitahan ang zoom (0.8x - 1.5x)
        
        root.style.setProperty('--text-zoom', newZoom);
    };

    const resetSettings = () => {
        document.documentElement.style.fontSize = '16px';
        document.documentElement.classList.remove('dark');
        const root = document.documentElement.style;
        root.removeProperty('--font-family');
        root.removeProperty('--line-spacing');
        root.removeProperty('--para-spacing');
        root.removeProperty('--text-align');
        root.removeProperty('--text-zoom');
        setActiveStates({});
    };

    const menuItems = [
        { id: 'textSize', label: 'Text Size', icon: Type, type: 'counter', action: changeFontSize },
        { id: 'contrast', label: 'Color Contrast', icon: Contrast, type: 'toggle', action: toggleHighContrast },
        { id: 'font', label: 'Font Family', icon: Type, type: 'toggle', action: () => updateStyle('--font-family', 'serif', 'font') },
        { id: 'lineSpace', label: 'Line Spacing', icon: Baseline, type: 'toggle', action: () => updateStyle('--line-spacing', '1.8', 'lineSpace') },
        { id: 'paraSpace', label: 'Paragraph Spacing', icon: Baseline, type: 'toggle', action: () => updateStyle('--para-spacing', '2rem', 'paraSpace') },
        { id: 'align', label: 'Text Alignment', icon: AlignLeft, type: 'toggle', action: () => updateStyle('--text-align', 'justify', 'align') },
        { id: 'spacing', label: 'Text Spacing', icon: ArrowDownUp, type: 'toggle', action: () => updateStyle('--letter-spacing', '0.1em', 'spacing') },
        { id: 'semantic', label: 'Semantic Text', icon: FileText, type: 'toggle', action: () => setActiveStates(prev => ({...prev, semantic: !prev.semantic})) },
        { id: 'zoom', label: 'Text Zoom', icon: ZoomIn, type: 'counter', action: (delta) => handleZoom(delta * 0.1) }
    ];

    return (
        <motion.div 
            ref={buttonRef} 
            className="fixed bottom-6 left-6 z-[99999] cursor-grab active:cursor-grabbing" 
            drag 
            dragMomentum={false} 
            style={{ touchAction: "none", position: "fixed" }} // Explicit position
        >
            <motion.button 
                onClick={toggleMenu} 
                className="p-4 bg-primary text-primary-foreground rounded-full shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:scale-110 transition-transform"
            >
                {isOpen ? <X size={24} /> : <Accessibility size={24} />}
            </motion.button>

            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`absolute w-80 bg-card/95 backdrop-blur-md border border-border p-5 rounded-3xl shadow-2xl z-[10000] 
                    ${menuVertical === 'up' ? 'bottom-full mb-4' : 'top-full mt-4'}
                    ${menuHorizontal === 'right' ? 'right-0' : 'left-0'}
                    `}
                >
                    {/* ITO YUNG TRIANGLE POINTER */}
                    <div 
                        className={`absolute w-4 h-4 bg-card/95 border-l border-t border-border rotate-45 
                            ${menuVertical === 'up' ? '-bottom-2' : '-top-2'}
                            ${menuHorizontal === 'right' ? 'right-6' : 'left-6'}
                        `} 
                    />

                    <h4 className="text-sm font-bold mb-4 text-muted-foreground">Accessibility Settings</h4>
                    
                    <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                        {menuItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-background/50">
                                
                                <span className="flex items-center gap-2 text-xs font-semibold">
                                    <item.icon size={14} className="text-primary" /> {item.label}
                                </span>

                                {/* Buttons ay laging visible sa gilid */}
                                <div className="flex gap-1">
                                    {item.type === 'counter' ? (
                                        <>
                                            <button 
                                                onClick={() => item.action(-2)} className="p-2 bg-background border border-border rounded-lg hover:bg-primary hover:text-white transition-all"
                                            >
                                                    <Minus size={14}/>
                                            </button>
                                            <button 
                                                onClick={() => item.action(2)} className="p-2 bg-background border border-border rounded-lg hover:bg-primary hover:text-white transition-all"
                                            >
                                                    <Plus size={14}/>
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            onClick={item.action} className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${activeStates[item.id] ? 'bg-primary text-white' : 'bg-background border-border hover:bg-muted'}`}
                                        >
                                            {activeStates[item.id] ? 'ON' : 'OFF'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button 
                        onClick={resetSettings} 
                        className="mt-6 w-full flex items-center justify-center gap-2.5 p-2 
                        bg-red-50 text-red-700 rounded-xl border border-red-200 
                        hover:bg-red-100 hover:border-red-300 hover:text-red-800
                        font-bold text-xs uppercase tracking-wider transition-all duration-200"
                    >
                        <RotateCcw size={14} /> 
                        Reset All Settings
                    </button>
                </motion.div>
            )}
        </motion.div>
    );
};

export default AccessibilityMenu;