"use client";

import React, { useState, useEffect, useRef } from 'react';

import {
    Trash2, Edit
} from 'lucide-react';

export default function KulinerManagement({ kuliners, addKuliner, deleteKuliner, updateKuliner }) {
    const [title, setTitle] = useState('');
    const [kulinerTime, setKulinerTime] = useState('');
    const [price, setPrice] = useState('');
    const [rating, setRating] = useState('');
    const [location, setLocation] = useState('');
    const [desc, setDesc] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [editingKuliner, setEditingKuliner] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Function untuk upload gambar
    const handleImageUpload = async (file) => {
        if (!file) return;
        
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            
            const result = await response.json();
            
            if (response.ok) {
                setImageUrl(result.url);
                console.log('Upload berhasil:', result.url);
            } else {
                console.error('Upload gagal:', result.error);
                alert('Upload gagal: ' + result.error);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Terjadi kesalahan saat upload');
        } finally {
            setUploading(false);
        }
    };

    const startEditKuliner = (kuliner) => {
        setEditingKuliner(kuliner);
        setIsEditing(true);
        
        // Populate form dengan data kuliner yang akan diedit
        setTitle(kuliner.title || '');
        setKulinerTime(kuliner.kulinerTime || '');
        setPrice(kuliner.price || '');
        setRating(kuliner.rating || '');
        setLocation(kuliner.location || '');
        setDesc(kuliner.desc || '');
        setLatitude(kuliner.latitude || '');
        setLongitude(kuliner.longtitude || '');
        setImageUrl(kuliner.imgRes || '');
    };

    // Function untuk cancel edit
    const cancelEdit = () => {
        setEditingKuliner(null);
        setIsEditing(false);
        
        // Reset form
        setTitle('');
        setKulinerTime('');
        setPrice('');
        setRating('');
        setLocation('');
        setDesc('');
        setLatitude('');
        setLongitude('');
        setImageUrl('');
        setImageFile(null);
    };

    // Function untuk update kuliner
    const handleUpdateKuliner = async (e) => {
        e.preventDefault();
        
        if (!editingKuliner) return;
        
        if (title.trim() === '' || location.trim() === '' || desc.trim() === '' || 
            price === '' || rating === '' || kulinerTime === '') {
            alert('Mohon lengkapi semua field yang diperlukan');
            return;
        }
        
        const kulinerData = {
            title: title,
            kulinerTime: kulinerTime,
            price: parseInt(price),
            rating: parseFloat(rating),
            location: location,
            desc: desc,
            latitude: latitude ? parseFloat(latitude) : 0,
            longtitude: longitude ? parseFloat(longitude) : 0,
            imgRes: imageUrl || 'https://placehold.co/600x400/166534/FFFFFF?text=Kuliner',
            isFavorite: false,
            updatedAt: new Date()
        };

        try {
            // Panggil function updateKuliner dari props
            await updateKuliner(editingKuliner.id, kulinerData);
            alert('Kuliner berhasil diupdate!');
            cancelEdit();
        } catch (error) {
            console.error('Error updating kuliner:', error);
            alert('Gagal mengupdate kuliner');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (title.trim() === '' || location.trim() === '' || desc.trim() === '' || 
            price === '' || rating === '' || kulinerTime === '') {
            alert('Mohon lengkapi semua field yang diperlukan');
            return;
        }
        
        const kulinerData = {
            title: title,
            kulinerTime: kulinerTime,
            price: parseInt(price),
            rating: parseFloat(rating),
            location: location,
            desc: desc,
            latitude: latitude ? parseFloat(latitude) : 0,
            longtitude: longitude ? parseFloat(longitude) : 0, // Note: typo sesuai Android
            imgRes: imageUrl || 'https://placehold.co/600x400/166534/FFFFFF?text=Kuliner',
            isFavorite: false, // Hidden field, always false
            createdAt: new Date()
        };

        await addKuliner(kulinerData);

        // Reset form
        setTitle('');
        setKulinerTime('');
        setPrice('');
        setRating('');
        setLocation('');
        setDesc('');
        setLatitude('');
        setLongitude('');
        setImageUrl('');
        setImageFile(null);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Kelola Kuliner</h2>
            
            {/* Form Tambah Kuliner */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">
                    {isEditing ? `Edit Kuliner: ${editingKuliner?.title}` : 'Tambah Kuliner Baru'}
                </h3>
                {isEditing && (
                    <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
                        <p className="text-sm">
                            <strong>Mode Edit:</strong> Anda sedang mengedit kuliner "{editingKuliner?.title}"
                        </p>
                    </div>
                )}
                <form onSubmit={isEditing ? handleUpdateKuliner : handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Title */}
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kuliner</label>
                        <input 
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                            placeholder="Nama Kuliner" 
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500" 
                            required
                        />
                    </div>

                    {/* Kuliner Time */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jam Operasional</label>
                        <input 
                            value={kulinerTime} 
                            onChange={e => setKulinerTime(e.target.value)} 
                            placeholder="10 AM - 9 PM" 
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500" 
                            required
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                        <input 
                            value={location} 
                            onChange={e => setLocation(e.target.value)} 
                            placeholder="Lokasi Kuliner" 
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500" 
                            required
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                        <input 
                            type="number"
                            value={price} 
                            onChange={e => setPrice(e.target.value)} 
                            placeholder="25000" 
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500" 
                            required
                            min="0"
                        />
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                        <input 
                            type="number"
                            value={rating} 
                            onChange={e => setRating(e.target.value)} 
                            placeholder="4.5" 
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500" 
                            required
                            min="1"
                            max="5"
                            step="0.1"
                        />
                    </div>

                    {/* Latitude */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                        <input 
                            type="number"
                            value={latitude} 
                            onChange={e => setLatitude(e.target.value)} 
                            placeholder="-7.5709241" 
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500" 
                            step="any"
                        />
                    </div>

                    {/* Longitude */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                        <input 
                            type="number"
                            value={longitude} 
                            onChange={e => setLongitude(e.target.value)} 
                            placeholder="110.7926132" 
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500" 
                            step="any"
                        />
                    </div>

                    {/* Upload Gambar */}
                    <div className="lg:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Kuliner</label>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setImageFile(file);
                                    handleImageUpload(file);
                                }
                            }}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500"
                            disabled={uploading}
                        />
                        {uploading && (
                            <div className="flex items-center mt-1">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600 mr-2"></div>
                                <p className="text-sm text-blue-600">Uploading...</p>
                            </div>
                        )}
                        {imageUrl && (
                            <p className="text-sm text-green-600 mt-1 flex items-center">
                                <span className="mr-1">✓</span> Upload berhasil
                            </p>
                        )}
                    </div>
                    
                    {/* Deskripsi */}
                    <div className="lg:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Kuliner</label>
                        <textarea 
                            value={desc} 
                            onChange={e => setDesc(e.target.value)} 
                            placeholder="Deskripsi lengkap kuliner..." 
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500"
                            rows="4"
                            required
                        ></textarea>
                    </div>
                    
                    {/* Submit Button */}
                    <div className="lg:col-span-3">
                        <button 
                            type="submit" 
                            className="w-full md:w-auto px-6 py-3 font-semibold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={uploading}
                        >
                            {uploading ? 'Processing...' : isEditing ? 'Update Kuliner' : 'Simpan Kuliner'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Preview Gambar */}
            {imageUrl && (
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h4 className="font-semibold mb-3 text-gray-700">Preview Gambar Kuliner:</h4>
                    <div className="flex items-start space-x-4">
                        <img 
                            src={imageUrl} 
                            alt="Preview Kuliner" 
                            className="max-w-xs h-auto rounded-lg shadow-sm border"
                        />
                        <div className="flex-1">
                            <p className="text-sm text-gray-600 mb-2">
                                <strong>URL:</strong> {imageUrl}
                            </p>
                            <button 
                                onClick={() => {
                                    setImageUrl('');
                                    setImageFile(null);
                                }}
                                className="text-red-600 hover:text-red-800 text-sm"
                            >
                                Hapus Gambar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabel Daftar Kuliner */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Daftar Kuliner</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gambar</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kuliner</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lokasi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jam Operasional</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {kuliners.map(kuliner => (
                                <tr key={kuliner.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img 
                                            src={kuliner.imgRes} 
                                            alt={kuliner.title}
                                            className="h-12 w-12 rounded-lg object-cover"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">
                                            {kuliner.title}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {kuliner.location}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {kuliner.kulinerTime}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        Rp {kuliner.price.toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className="text-yellow-400">★</span>
                                            <span className="ml-1 text-sm text-gray-600">
                                                {kuliner.rating}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button 
                                                onClick={() => startEditKuliner(kuliner)}
                                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                                title="Edit Kuliner"
                                            >
                                                <Edit className="h-5 w-5" />
                                            </button>
                                            <button 
                                                onClick={() => deleteKuliner(kuliner.id)} 
                                                className="text-red-600 hover:text-red-800 transition-colors"
                                                title="Hapus Kuliner"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}