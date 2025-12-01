import React from 'react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, icon }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4 font-sans transition-colors duration-300">
            <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-slate-700">
                <div className="flex flex-col items-center mb-8 text-center">
                    {icon && (
                        <div className="mb-4 text-primary">
                            {icon}
                        </div>
                    )}
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{title}</h1>
                    {subtitle && (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{subtitle}</p>
                    )}
                </div>
                {children}
            </div>
        </div>
    );
};
