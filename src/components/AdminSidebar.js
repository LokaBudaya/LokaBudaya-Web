import { auth, db } from '@/lib/firebase';

"use client";
import {
    Calendar, Home, Settings, UtensilsCrossed, Users, LogOut, BarChart3, Shield, MapPin
} from 'lucide-react';

export default function AdminSidebar({ activeTab, setActiveTab, navigate, handleLogout }) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'events', label: 'Kelola Event', icon: Calendar },
        { id: 'kuliner', label: 'Kelola Kuliner', icon: UtensilsCrossed },
        { id: 'tour', label: 'Kelola Tour', icon: MapPin },
        { id: 'users', label: 'Kelola Users', icon: Users },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-40">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
                        <p className="text-sm text-gray-500">LokaBudaya</p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="mt-6">
                <div className="px-3">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center px-3 py-3 text-left rounded-lg mb-1 transition-colors ${
                                    activeTab === item.id
                                        ? 'bg-emerald-100 text-emerald-700 border-r-2 border-emerald-500'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Icon className="w-5 h-5 mr-3" />
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* Bottom Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                <button
                    onClick={() => navigate('home')}
                    className="w-full flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg mb-2 transition-colors"
                >
                    <Home className="w-5 h-5 mr-3" />
                    Kembali ke Home
                </button>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                </button>
            </div>
        </div>
    );
}