import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, hover = false, padding = 'md', className = '', ...props }, ref) => {
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={`
          bg-white rounded-xl shadow-md border border-gray-100
          ${hover ? 'hover:shadow-xl transition-shadow duration-300' : ''}
          ${paddingClasses[padding]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = ({ children, className = '' }: HTMLAttributes<HTMLDivElement>) => (
  <div className={`border-b border-gray-100 pb-4 mb-4 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = '' }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>
);

export const CardContent = ({ children, className = '' }: HTMLAttributes<HTMLDivElement>) => (
  <div className={className}>{children}</div>
);

export const CardFooter = ({ children, className = '' }: HTMLAttributes<HTMLDivElement>) => (
  <div className={`border-t border-gray-100 pt-4 mt-4 ${className}`}>{children}</div>
);
