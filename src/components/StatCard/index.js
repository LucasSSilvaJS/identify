import React from 'react';

function StatCard({ title, value, icon: Icon, color = "text-darkblue" }) {
    return (
        <div className="bg-white rounded-lg p-6 border-2 border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-gray-300">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
                    <p className={`text-4xl font-bold ${color}`}>{value}</p>
                </div>
                {Icon && <Icon className={`text-5xl ${color} opacity-70`} />}
            </div>
        </div>
    );
}

export default StatCard; 