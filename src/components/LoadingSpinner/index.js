import React from 'react';

function LoadingSpinner({ message = "Carregando..." }) {
    return (
        <div className="flex items-center justify-center p-8">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-darkblue mx-auto mb-4"></div>
                <p className="text-darkblue font-medium">{message}</p>
            </div>
        </div>
    );
}

export default LoadingSpinner; 