"use client"
import Image from "next/image";
import Link from "next/link";
import bg_about from '../../public/images/bg-about.svg'
import img_1_about from '../../public/images/img-1-about.svg'
import img_2_about from '../../public/images/img-2-about.svg'
import img_3_about from '../../public/images/img-3-about.svg'
import component_1_about from '../../public/images/component-1_about.svg'
import component_2_about from '../../public/images/component-2_about.svg'
import pfp_aya from '../../public/images/pfp_aya.svg'
import pfp_bagas from '../../public/images/pfp_bagas.svg'
import pfp_dika from '../../public/images/pfp_dika.svg'

export default function AboutContent() { 
    return (
        <div className="flex flex-col w-full gap-32">
            <div className="h-screen relative flex flex-col items-center justify-center gap-20">
                <Image src={bg_about} alt="image bg about" className="absolute bg-cover w-full z-0"></Image>
                <div className="w-3/5 relative text-center text-white flex flex-col gap-8 pt-24">
                    <h1 className="font-semibold text-7xl">Hi, We’re LokaBudaya!</h1>
                    <p className="font-light font-inter">We’re here to help you find exciting cultural events, must-visit local destinations, and delicious regional foods — all in one place! Whether you’re a local looking for something new to explore, or a traveler who wants to dive into the local scene, LokaBudaya’s got your back. We also provide helpful info on how to get there, so you don’t miss a thing.</p>
                </div>
                <div className="font-thin text-white relative flex flex-col items-center gap-8">
                    <p className="font-semibold text-2xl">Meet our team:</p>
                    <div className="flex font-inter font-light gap-24">
                        <Link href={'https://instagram.com/adikanuu'} className="flex items-center gap-8">
                            <Image src={pfp_dika} alt="pfp dika"></Image>
                            <div>
                                <p>Adika Nugraha</p>
                                <p>L0123006</p>
                            </div>
                        </Link>
                        <Link href={'https://instagram.com/alyargnns'} className="flex items-center gap-8">
                            <Image src={pfp_aya} alt="pfp dika"></Image>
                            <div>
                                <p>Alya Irgina Mas'udah</p>
                                <p>L0123018</p>
                            </div>
                        </Link>
                        <Link href={'https://instagram.com/bags.rz'} className="flex items-center gap-8">
                            <Image src={pfp_bagas} alt="pfp dika"></Image>
                            <div>
                                <p>Bagas Rizki Gunardi</p>
                                <p>L0123034</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="px-24 relative flex flex-col gap-48 justify-center">
                <Image src={component_1_about} className="absolute top-0 -right-1/3 -z-1" alt="component 1 about"></Image>
                <Image src={component_2_about} className="absolute -bottom-16 -left-1/8 -z-1" alt="component 1 about"></Image>
                <div className="flex gap-35 items-center z-10">
                    <Image src={img_1_about} alt="image 1 about flex-[1]"></Image>
                    <div className="flex-[2] flex flex-col gap-8">
                        <h2 className="font-semibold text-4xl">
                            Do you have a trouble finding accurate, up-to-date information about cultural events happening in a city you're visiting?
                        </h2>
                        <p className="pe-4">
                            That’s where LokaBudaya comes in — we aim to make it <span className="font-semibold text-lookabudaya_dark_blue underline">easier for people to discover and join</span> events happening around them, now or soon.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-16 relative z-10">
                    <div className="flex-[1] flex flex-col gap-8">
                        <h2 className="font-semibold text-5xl">
                            What’s cool is?
                        </h2>
                        <p>
                            LokaBudaya can detect your current location and show you what’s going on nearby. So if you're visiting a new city or just exploring your own town, you won’t miss out on the culture and fun happening just around the corner.
                        </p>
                    </div>
                    <div className="flex-[1]">
                        <Image src={img_2_about} alt="image 2 about"></Image>
                    </div>
                </div>
                <div className="flex flex-col gap-8">
                    <div className="text-center">
                        <h2 className="font-semibold text-5xl">But, why LokaBudaya?</h2>
                    </div>
                    <div className="flex flex-col w-7/13 gap-4">
                        <div className="flex gap-4">
                            <div className=" font-semibold text-4xl py-1 px-6 text-center bg-lokabudayagold">1</div>
                            <p>LokaBudaya is free — No subscriptions, no hidden fees. Just open and explore.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className=" font-semibold text-4xl py-1 px-6 text-center bg-lokabudaya_event">2</div>
                            <p>Easy to use — The interface is simple and clean, so anyone can use it, even on the go.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className=" font-semibold text-4xl py-1 px-6 text-center bg-lokabudaya_tour">3</div>
                            <p>Location-aware — It helps you find events and experiences based on where you are.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className=" font-semibold text-4xl py-1 px-6 text-center bg-lokabudaya_kuliner">4</div>
                            <p>Culturally rich — From food to festivals, everything is locally rooted and meaningful</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-8 py-8 px-8 bg-lookabudaya_dark_blue rounded-2xl items-center">
                    <Image src={img_3_about} alt="image 3 about flex-[1]"></Image>
                    <div className="flex flex-col text-lokabudayagold flex-[2] gap-4">
                        <h2 className="font-semibold text-4xl">Fun Fact!</h2>
                        <p className="font-thin">LokaBudaya actually started as a project for a class called Pemograman Website in Sebelas Maret University. Yep, just a school assignment! But We, <span className="underline font-semibold">Kelompok 1</span>, wanted to take it further and turn it into something real — something that could help promote cultural tourism and support local communities.</p>
                    </div>
                </div>
                <div className="text-center">
                    <h2 className="font-semibold text-5xl leading-20 z-10">Thanks for stopping by — and happy exploring with LokaBudaya!</h2>
                    <div className='relative flex items-center mt-4'>
                        <Link href='/explore' className='m-auto cursor-pointer relative border-4 border-lookabudaya_dark_blue text-xl font-medium py-1 px-4 hover:text-white hover:bg-lookabudaya_dark_blue transition-all duration-300'>
                                Explore Now →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
 }