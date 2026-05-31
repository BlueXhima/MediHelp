import React from 'react';

const Button = ({ 
    children, 
    variant = 'primary', // Color/Style variant
    type = 'pill',       // Shape/Structure type
    size = 'md', 
    className = '', 
    onClick, 
    buttonType = 'button', // native HTML button type
    disabled = false,
    leadingIcon: LeadingIcon,
    trailingIcon: TrailingIcon,
    ...props 
}) => {
    // 1. Base Styles
    const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-300 cursor-pointer active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:grayscale select-none";

    // 2. Type Mapping (Shape & Structure)
    const types = {
        pill: "rounded-full",
        outline: "bg-transparent border-2", // Needs variant for border color
        bordered: "border shadow-sm",      // Subtle border
        '3d': "border-b-4 active:border-b-0 active:translate-y-[2px]",
        elevated: "shadow-md hover:shadow-xl hover:-translate-y-1",
        circular: "rounded-full p-0 w-10 h-10 shrink-0 flex items-center justify-center", // For icon-only circular buttons
        rounded: "rounded-2xl", // Modern rounded corners
    };

    // 3. Variant Mapping (Colors base sa index.css variables)
    const variants = {
        /* Primary: Solid contrast. Puting text para sa dark bg, dark text para sa light bg */
        primary: "bg-primary text-primary-foreground hover:brightness-110 hover:shadow-lg hover:shadow-primary/30",
        
        /* Secondary: Subtle tint. Sumasama ang text color sa foreground para hindi "off" sa paningin */
        secondary: "bg-primary/10 text-primary hover:brightness-110 border border-primary/20 hover:bg-primary/40 dark:bg-primary/20",
        
        /* Soft: Dynamic text color. Sumusunod sa kulay ng container text (foreground) */
        soft: "bg-foreground/5 text-primary-foreground hover:bg-foreground/10 border-transparent",
        
        /* Outline: Walang solid bg, border lang ang may kulay */
        outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
        
        /* Ghost: Pinaka-minimalist. Maganda para sa mga buttons sa loob ng cards */
        ghost: "bg-transparent text-foreground/70 hover:bg-foreground/5 hover:text-foreground",
        
        /* Danger: Fixed red color para sa emergency o logout actions */
        danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20",

        /* DangerGhost: */
        dangerGhost: "bg-transparent text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 border-transparent",
    };

    // 4. Size Mapping
    const sizes = {
        sm: "px-4 py-1.5 text-[10px] tracking-wider uppercase",
        md: "px-6 py-2.5 text-xs tracking-widest uppercase",
        lg: "px-10 py-4 text-sm tracking-widest uppercase",
    };

    const isCircular = type === 'circular';

    // Combine all classes
    const combinedClasses = `
        ${baseStyles} 
        ${types[type] || types.pill} 
        ${variants[variant] || variants.primary} 
        ${!isCircular ? (sizes[size] || sizes.md) : ''} 
        ${className}
    `.replace(/\s+/g, ' ').trim();

    return (
        <button
            type={buttonType}
            className={combinedClasses}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {/* Leading Icon */}
            {LeadingIcon && <LeadingIcon className={`${children ? 'mr-2' : ''} shrink-0`} size={16} />}
            
            {children}

            {/* Trailing Icon */}
            {TrailingIcon && <TrailingIcon className={`${children ? 'ml-2' : ''} shrink-0`} size={16} />}
        </button>
    );
};

export default Button;