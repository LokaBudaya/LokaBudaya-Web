import { auth, db } from '@/lib/firebase';

"use client";

import {
    Calendar, Users, BarChart3, Shield,
} from 'lucide-react';

export default function AdminDashboardOverview({ events, users }) {
    const totalEvents = events.length;
    const totalUsers = users.length;
    const verifiedUsers = users.filter(user => user.isEmailVerified).length;
    const thisMonthEvents = events.filter(event => {
        const eventDate = new Date(event.startDate?.toDate ? event.startDate.toDate() : event.startDate);
        const thisMonth = new Date();
        thisMonth.setDate(1);
        return eventDate >= thisMonth;
    }).length;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600">Selamat datang di Admin Panel LokaBudaya</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Events</p>
                            <p className="text-2xl font-bold text-gray-900">{totalEvents}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Users className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Shield className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Verified Users</p>
                            <p className="text-2xl font-bold text-gray-900">{verifiedUsers}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <BarChart3 className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Events This Month</p>
                            <p className="text-2xl font-bold text-gray-900">{thisMonthEvents}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Events</h3>
                    <div className="space-y-3">
                        {events.slice(0, 5).map(event => (
                            <div key={event.id} className="flex items-center space-x-3">
                                <img 
                                    src={event.imgRes || event.gambar_event} 
                                    alt={event.title || event.nama_event}
                                    className="w-10 h-10 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        {event.title || event.nama_event}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {event.location || event.lokasi}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Users</h3>
                    <div className="space-y-3">
                        {users.slice(0, 5).map(user => (
                            <div key={user.id} className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-sm font-medium text-gray-700">
                                        {(user.profile?.displayname || user.email || 'U')[0].toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        {user.profile?.displayname || 'No Name'}
                                    </p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                    user.isEmailVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {user.isEmailVerified ? 'Verified' : 'Unverified'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}