"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import CategorySection from "./ui/CategorySection";

import bg_big_component_blue_thing from "../../public/images/bg-big-component_blue-thing.svg";
import bg_big_component_flower_gold from "../../public/images/bg-big-component_flower-gold.svg";
import bg_big_component_leaf_blue from "../../public/images/bg-big-component_leaf-blue.svg";
import bg_component_cross_yellow from "../../public/images/bg-component_cross-yellow.svg";
import bg_component_heart_pink from "../../public/images/bg-component_heart-pink.svg";
import bg_component_pink_spiral from "../../public/images/bg-component_pink-spiral.svg";
import bg_component_quote_gold from "../../public/images/bg-component_quote-gold.svg";
import bg_component_star_blue from "../../public/images/bg-component_star-blue.svg";
import wayang from "../../public/images/wayang.svg";
import surabaya from "../../public/images/surabaya.svg";
import nasikuning from "../../public/images/nasikuning.svg";
import Link from 'next/link';

export default function AllCategorySections({ filtered, events, tours, kuliners }) {
    return (
        <div className='mt-24 relative'>
            {/* pinginnya yg semua dipanggil di sini gas, bukan di categorysection */}
            {/* <CategorySection events={filtered}></CategorySection> */}
            
            <div className='relative mb-28'>
                <Image src={bg_big_component_blue_thing} alt='bg big component' className='absolute right-0 top-20'></Image>
                <Image src={wayang} width={640} alt='wayang' className='absolute -left-20 -bottom-36 z-0'></Image>
                <div className='relative z-5 w-3/5 flex flex-col justify-start left-5/16'>
                    <div className='flex flex-col space-y-6 mb-16'>
                        <div className='flex items-center'>
                            <span className='font-semibold text-5xl mr-6'>See What Event</span>
                            <Image src={bg_component_pink_spiral} alt='bg_component_pink_spiral'></Image>
                        </div>
                        <div className='flex items-center'>
                            <Image src={bg_component_quote_gold} alt='bg_component_quote_gold'></Image>
                            <span className='font-semibold text-5xl ml-6'>Everyone’s Talking About</span>
                        </div>
                    </div>
                    <CategorySection items={events} type={"Event"}></CategorySection>
                    <div className='mt-12 relative'>
                        <Link href="/" >
                            <span className='text-xl absolute right-0 text-white font-aboreto py-2 px-6 bg-lookabudaya_dark_blue transition-all duration-500 hover:shadow-xl hover:shadow-gray-400 hover:-top-1'>
                                EXPLORE
                            </span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className='relative mb-28'>
                <Image src={bg_big_component_flower_gold} alt='bg big component flower' className='absolute -top-30 -left-40'></Image>
                <div className='relative z-10 w-3/5 flex flex-col justify-start left-1/12'>
                    <div className='flex flex-col space-y-6 mb-16'>
                        <div className='flex items-center'>
                            <span className='font-semibold text-5xl mr-6'>Find Out Where</span>
                        </div>
                        <div className='flex items-center'>
                            <span className='font-semibold text-5xl mr-6'>Everyone’s Going Next</span>
                            <Image src={bg_component_star_blue} alt='bg_component_quote_gold'></Image>
                        </div>
                    </div>
                    <CategorySection items={tours} type={"Tour"}></CategorySection>
                    <div className='mt-12 relative'>
                        <Link href="/" >
                            <span className='text-xl absolute left-0 text-white font-aboreto py-2 px-6 bg-lookabudaya_dark_blue transition-all duration-500 hover:shadow-xl hover:shadow-gray-400 hover:-top-1'>
                                EXPLORE
                            </span>
                        </Link>
                    </div>
                </div>
                <Image src={surabaya} width={900} alt='surabaya' className='absolute -right-70 -bottom-36 z-0'></Image>
            </div>

            <div className='relative mb-48'>
                <Image src={bg_component_cross_yellow} alt='bg component cross' className='absolute -bottom-30 left-10'></Image>
                <Image src={bg_big_component_leaf_blue} alt='bg component leaf' className='absolute -bottom-80 -right-30'></Image>
                <Image src={nasikuning} width={500} alt='nasikuning' className='absolute -left-20 -bottom-4 z-0'></Image>
                <div className='relative z-10 w-5/8 flex flex-col justify-start left-5/16'>
                    <div className='flex flex-col space-y-6 mb-16'>
                        <div className='flex items-center'>
                            <Image src={bg_component_heart_pink} alt='bg_component_quote_gold'></Image>
                            <span className='font-semibold text-5xl ml-6'>Taste What Everyone's Craving</span>
                        </div>
                    </div>
                    <CategorySection items={kuliners} type={"Kuliner"}></CategorySection>
                    <div className='mt-12 relative'>
                        <Link href="/" >
                            <span className='text-xl absolute right-0 text-white font-aboreto py-2 px-6 bg-lookabudaya_dark_blue transition-all duration-500 hover:shadow-xl hover:shadow-gray-400 hover:-top-1'>
                                EXPLORE
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}