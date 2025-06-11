"use client";
import React from 'react';

"use client";
import React, { useState, useEffect, useRef } from 'react';

import {
    Handshake, Facebook, Instagram, Youtube, Twitter, MessageCircle, Music
} from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-slate-800 text-gray-300 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo dan Partner Section */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="mb-6">
                            <img 
                                src="/images/logo.png" 
                                alt="LokaBudaya Logo" 
                                className="h-8 w-auto mb-4"
                            />
                        </div>
                        
                        {/* Partner Badges */}
                        <div className="mb-6">
                            {/* <div className="flex flex-wrap gap-2 mb-4">
                                <div className="bg-white p-2 rounded">
                                    <span className="text-xs font-bold text-gray-800">IATA</span>
                                </div>
                                <div className="bg-white p-2 rounded">
                                    <span className="text-xs font-bold text-gray-800">ASITA</span>
                                </div>
                                <div className="bg-white p-2 rounded">
                                    <span className="text-xs font-bold text-gray-800">ISO</span>
                                </div>
                            </div> */}
                            <button className="bg-slate-700 text-white px-4 py-2 rounded text-sm hover:bg-slate-600 transition-colors flex items-center space-x-2">
                                <Handshake size={16} />
                                <span>Jadi Partner LokaBudaya</span>
                            </button>
                        </div>

                        {/* Payment Partners */}
                        <div>
                            <h4 className="text-white font-semibold mb-3">Partner Pembayaran</h4>
                            <div className="grid grid-cols-4 gap-2">
                                <div className="bg-white p-2 rounded text-center">
                                    <span className="text-xs text-gray-800"><img src="https://ik.imagekit.io/tvlk/image/imageResource/2025/01/10/1736481390434-91c03767be9d8650e67d3236af416c78.webp?tr=h-19,q-75,w-57" alt="BCA Payment"></img></span>
                                </div>
                                <div className="bg-white p-2 rounded text-center">
                                    <span className="text-xs text-gray-800"><img src="https://ik.imagekit.io/tvlk/image/imageResource/2025/01/10/1736481407355-5c172bc37ff6d37a75e16fc17032112b.webp?tr=h-19,q-75,w-57" alt="BRI Payment"></img></span>
                                </div>
                                <div className="bg-white p-2 rounded text-center">
                                    <span className="text-xs text-gray-800"><img src="https://ik.imagekit.io/tvlk/image/imageResource/2025/01/10/1736481418674-af23636c3bb5dfae8181febb8b4c6713.webp?tr=h-19,q-75,w-57" alt="BNI Payment"></img></span>
                                </div>
                                <div className="bg-white p-2 rounded text-center">
                                    <span className="text-xs text-gray-800"><img src="https://ik.imagekit.io/tvlk/image/imageResource/2025/02/20/1740022373472-39026d4e4ad5cfc5a8ec3b8c8d38254c.jpeg?tr=h-19,q-75,w-57" alt="OVO Payment"></img></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tentang LokaBudaya */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Tentang LokaBudaya</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Cara Pesan</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Hubungi Kami</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Pusat Bantuan</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Karier</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Tentang Kami</a></li>
                        </ul>

                        <div className="mt-6">
                            <h4 className="text-white font-semibold mb-3">Follow kami di</h4>
                            <div className="space-y-2">
                                <a href="#" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                                    <Facebook size={16} />
                                    <span>Facebook</span>
                                </a>
                                <a href="#" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                                    <Instagram size={16} />
                                    <span>Instagram</span>
                                </a>
                                <a href="#" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                                    <Music size={16} />
                                    <span>TikTok</span>
                                </a>
                                <a href="#" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                                    <Youtube size={16} />
                                    <span>Youtube</span>
                                </a>
                                <a href="#" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                                    <Twitter size={16} />
                                    <span>Twitter</span>
                                </a>
                                <a href="#" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                                    <MessageCircle size={16} />
                                    <span>WhatsApp</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Produk */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Produk</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Event Budaya</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Tiket Pertunjukan</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Festival</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Pameran Seni</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Tari Tradisional</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Paket Wisata</a></li>
                        </ul>
                    </div>

                    {/* Lainnya */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Lainnya</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">LokaBudaya for Corporates</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">LokaBudaya Affiliate</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Blog LokaBudaya</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Pemberitahuan Privasi</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Daftarkan Bisnis Aktivitas Anda</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">LokaBudaya Press Room</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">LokaBudaya Ads</a></li>
                        </ul>

                        <div className="mt-6">
                            <h4 className="text-white font-semibold mb-3">Download LokaBudaya App</h4>
                            <div className="space-y-2">
                                <a href="#" className="block">
                                    <img src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v4.5.8/f/f519939e72eccefffb6998f1397901b7.svg" alt="Google Play" className="h-10 w-auto" />
                                </a>
                                <a href="#" className="block">
                                    <img src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v4.5.8/1/18339f1ae28fb0c49075916d11b98829.svg" alt="App Store" className="h-10 w-auto" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} LokaBudaya. Semua Hak Cipta Dilindungi.</p>
                </div>
            </div>
        </footer>
    );
}
