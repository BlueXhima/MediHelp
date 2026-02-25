import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../lib/utils';
import { ArrowLeft, BookOpen, User, ChevronUp, ChevronDown, Download, Mail, Trash2, Plus, Edit, X, Check } from 'lucide-react';

const Button = ({ variant, iconName, iconPosition, children, fullWidth, iconColor, ...props }) => {
    const IconComponent = {
        ArrowLeft,
        BookOpen,
        User,
        ChevronUp,
        ChevronDown,
        Download,
        Mail,
        Trash2,
        Plus, // Added Plus icon
        Edit, // Added Edit icon
        X,    // Added X icon
        Check // Added Check icon
    }[iconName] || null;

    const { iconName: _, iconPosition: __, iconColor: ___, ...restProps } = props; // Exclude props

    return (
        <button
            className={cn(
                'inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition cursor-pointer',
                variant === 'outline' && 'border border-primary text-primary hover:bg-primary/10',
                variant === 'ghost' && 'text-primary text-md hover:bg-primary/10',
                variant === 'primary' && 'bg-primary text-md text-white hover:bg-primary/90',
                fullWidth && 'w-full'
            )}
            {...restProps} // Pass only valid props to the DOM
        >
            {iconPosition === 'left' && IconComponent && (
                <IconComponent className="mr-2" size={16} color={iconColor || 'currentColor'} />
            )}
            {children}
            {iconPosition === 'right' && IconComponent && (
                <IconComponent className="ml-2" size={16} color={iconColor || 'currentColor'} />
            )}
        </button>
    );
};

Button.propTypes = {
    variant: PropTypes.oneOf(['outline', 'ghost', 'primary', 'secondary']),
    iconName: PropTypes.oneOf(['ArrowLeft', 'BookOpen', 'User', 'ChevronUp', 'ChevronDown', 'Download', 'Mail', 'Trash2', 'Plus', 'Edit', 'X', 'Check']),
    iconPosition: PropTypes.oneOf(['left', 'right']),
    children: PropTypes.node.isRequired,
    fullWidth: PropTypes.bool,
    iconColor: PropTypes.string // Added prop for icon color
};

Button.defaultProps = {
    variant: 'outline',
    iconName: null,
    iconPosition: 'left',
    fullWidth: false,
    iconColor: 'currentColor' // Default color for icons
};

export default Button;