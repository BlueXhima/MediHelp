const Button = ({ variant = 'primary', children, className = '', ...props }) => {
    const baseStyles = 'px-4 py-2 rounded-lg font-medium transition flex items-center justify-center';
    const variants = {
        primary: 'bg-primary text-white hover:bg-primary/90',
        outline: 'border border-primary text-primary hover:bg-primary/10',
    };
    return (
        <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
