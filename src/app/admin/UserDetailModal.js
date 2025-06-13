"use client";

import {
    X 
} from 'lucide-react';

export default function UserDetailModal({ user, onClose, onUpdateRole }) {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Detail User</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Display Name</label>
                            <p className="mt-1 text-sm text-gray-900">{user.profile?.displayname || 'N/A'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <p className="mt-1 text-sm text-gray-900">{user.username || user.profile?.username || 'N/A'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <p className="mt-1 text-sm text-gray-900">{user.profile?.phonenumber || 'N/A'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <p className="mt-1 text-sm text-gray-900 capitalize">{user.role}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Verified</label>
                            <p className="mt-1 text-sm text-gray-900">
                                {user.isEmailVerified ? 'Yes' : 'No'}
                            </p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">User ID</label>
                            <p className="mt-1 text-sm text-gray-900 font-mono">{user.uid}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Created At</label>
                            <p className="mt-1 text-sm text-gray-900">
                                {user.createdAt ? 
                                    new Date(user.createdAt.toDate ? user.createdAt.toDate() : user.createdAt).toLocaleString('id-ID') 
                                    : 'N/A'
                                }
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
