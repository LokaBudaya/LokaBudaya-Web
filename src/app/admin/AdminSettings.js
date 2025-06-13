"use client";

export default function AdminSettings() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                <p className="text-gray-600">Pengaturan sistem dan konfigurasi admin</p>
            </div>

            {/* System Settings */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">System Settings</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Maintenance Mode</label>
                            <p className="text-sm text-gray-500">Enable maintenance mode untuk website</p>
                        </div>
                        <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-gray-700">User Registration</label>
                            <p className="text-sm text-gray-500">Izinkan pendaftaran user baru</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Email Verification Required</label>
                            <p className="text-sm text-gray-500">Wajibkan verifikasi email untuk user baru</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                    </div>
                </div>
            </div>

            {/* Event Settings */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Event Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Default Event Duration (hours)</label>
                        <input 
                            type="number" 
                            defaultValue="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Ticket per User</label>
                        <input 
                            type="number" 
                            defaultValue="5"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Booking Deadline (days before event)</label>
                        <input 
                            type="number" 
                            defaultValue="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Refund Period (days)</label>
                        <input 
                            type="number" 
                            defaultValue="7"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                            <p className="text-sm text-gray-500">Kirim notifikasi via email</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-gray-700">SMS Notifications</label>
                            <p className="text-sm text-gray-500">Kirim notifikasi via SMS</p>
                        </div>
                        <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
                    Save Settings
                </button>
            </div>
        </div>
    );
}