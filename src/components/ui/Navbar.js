"use client";

import Image from 'next/image';
import Link from "next/link";
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { signOut } from 'firebase/auth';
import { User } from 'lucide-react';

export default function Navbar({ user, userData, navigate }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [color, setColor] = useState(true);
    const pathname = usePathname();

    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'Partnership', href: '/partnership' },
        { name: 'About', href: '/about' },
    ];
    
    const handleLogout = async () => {
        await signOut(auth);
        navigate('home');
    };

    useEffect(()=> {
        let lastScrollY = window.scrollY;

        const controlNavbar = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            lastScrollY = currentScrollY;
        }

        window.addEventListener("scroll", controlNavbar);

        return () => window.removeEventListener("scroll", controlNavbar);
    }, []);

    useEffect(()=>{
        const changeColor = () => {
            if (window.scrollY > 40) {
                setColor(true);
            } else {
                setColor(false);
            }
        }

        window.addEventListener('scroll', changeColor);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 bg-transparent transition-all duration-400 mt-4 border-b 
            ${ isVisible ? "translate-y-0" : "-translate-y-24" }
            ${ color ? "border-transparent" : "border-b-white" }
         `}>
            <nav className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-200
                ${ color ? "rounded-2xl bg-blue-950" : "bg-transparent" }`}>
                <div className="flex justify-between items-center h-18">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center">
                            <Image 
                                src="/images/logo.png" 
                                alt="LokaBudaya Logo" 
                                width={164}
                                height={86}
                                priority
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-24">
                        {navItems.map((item) => (
                        <Link
                        key={item.href}
                        href={item.href}
                        className={`hover:text-lg transition-all duration-200 font-medium font-aboreto ${
                            pathname === item.href ? 'text-lokabudayagold border-b border-b-lokabudayagold' : 'text-white hover:text-emerald-300'
                        }`}>
                            {item.name}
                        </Link>
                    ))}
                    </div>

                    {/* Right Side - Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-2 text-white hover:text-emerald-300 transition-colors duration-200">
                                    <User size={20} />
                                    <span className="font-medium">{userData?.name || user.email}</span>
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    {userData?.role === 'admin' && (
                                        <a href="#" onClick={() => navigate('admin')} 
                                           className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700">
                                            Admin Panel
                                        </a>
                                    )}
                                    <a href="#" onClick={handleLogout} 
                                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700">
                                        Log Out
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <Link href={'/register'}
                                        className="mx-2 px-5 py-2 text-white border border-white rounded-lg hover:bg-white hover:text-black hover:px-6 transition-all duration-200 font-medium">
                                    Sign Up
                                </Link>
                                <Link href={'/login'} 
                                        className="mx-2 px-6 py-2 bg-lokabudayagold text-white rounded-lg hover:bg-lokabudaya_gold_hover_dark hover:px-7 transition-all duration-200 font-medium">
                                    Login
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} 
                                className="text-white hover:text-emerald-300 transition-colors duration-200">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                      d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white/95 backdrop-blur-md rounded-lg mt-2 py-4 px-4 shadow-lg">
                        <div className="flex flex-col space-y-4">
                            <a href="#" onClick={() => navigate('home')} 
                               className="text-gray-800 hover:text-emerald-600 font-medium">
                                HOME
                            </a>
                            <a href="#" className="text-gray-800 hover:text-emerald-600 font-medium">
                                PARTNERSHIPS
                            </a>
                            <a href="#" className="text-gray-800 hover:text-emerald-600 font-medium">
                                ABOUT US
                            </a>
                            <a href="#" className="text-gray-800 hover:text-emerald-600 font-medium">
                                BLOGS
                            </a>
                            {user ? (
                                <>
                                    <div className="border-t pt-4">
                                        <p className="text-gray-600 text-sm">{userData?.name || user.email}</p>
                                        {userData?.role === 'admin' && (
                                            <a href="#" onClick={() => navigate('admin')} 
                                               className="block mt-2 text-emerald-600 font-medium">
                                                Admin Panel
                                            </a>
                                        )}
                                        <button onClick={handleLogout} 
                                                className="block mt-2 text-red-600 font-medium">
                                            Log Out
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col space-y-2 border-t pt-4">
                                    <button onClick={() => navigate('login')} 
                                            className="px-4 py-2 text-emerald-600 border border-emerald-600 rounded-full font-medium">
                                        Log In
                                    </button>
                                    <button onClick={() => navigate('register')} 
                                            className="px-4 py-2 bg-emerald-600 text-white rounded-full font-medium">
                                        Sign Up
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
