"use client"

import Image from "next/image";
import Link from "next/link";
import bg_component_kipas from '../../public/images/bg-component_kipas.svg';
import bg_component_text from '../../public/images/text_partnership.svg';
import bg_component_text_1 from '../../public/images/text-1_partnership.svg';
import map_partnership from '../../public/images/map_partnership.svg'
import img_nature_partnership from '../../public/images/bg-component_partnership-nature.svg'
import bg_component_flower from '../../public/images/bg-component_partnership-flower.svg'
import bg_component_radial from '../../public/images/bg-component_partnership-radial.svg'
import bg_component_circle from '../../public/images/bg-component_partnership-circle.svg'

export default function PartnershipPage() {
    return (
        <div className="flex flex-col mt-36 relative">
            <div className="h-screen relative">
                <Image src={bg_component_text} alt="text partnership" className="absolute left-1/12 top-38"></Image>
                <Image src={bg_component_kipas} alt="kipas" className="absolute -right-1"></Image>
            </div>
            <div className="mb-24">
                <div className="relative flex flex-col items-center px-64">
                    <h2 className="font-semibold text-5xl">We Welcome</h2>
                    <p className="font-light text-black/60 tracking-wider text-center">“ Whether you're launching a new food spot, looking to boost your event’s visibility, or offering a hidden gem worth exploring—this is your chance to be seen and grow with us “</p>
                </div>
                <Image src={map_partnership} className="w-full bg-cover" alt="map partnership"></Image>
            </div>
            <div className="h-screen bg-lookabudaya_dark_blue relative">
                <Image src={bg_component_flower} className="z-10 absolute -top-20 -right-20" alt="bg component flower"></Image>
                <Image src={bg_component_circle} className="z-10 absolute bottom-30 right-20" alt="bg component flower"></Image>
                <Image src={bg_component_circle} className="z-10 absolute bottom-60 left-40 size-15" alt="bg component flower"></Image>
                <Image src={bg_component_radial} className="z-0 absolute bottom-0 -left-40" alt="bg component flower"></Image>
                <div className="py-16 w-full flex flex-col items-center gap-12 z-10 relative">
                    <div className="flex flex-col w-fit border-b-5 border-white">
                        <h2 className="text-center text-5xl font-semibold text-white mb-2">Join Our Platform To</h2>
                    </div>
                    <div className="w-full flex flex-col items-center gap-4">
                        <div className="flex gap-12 py-4 items-center bg-lokabudaya_partnership_blue w-1/2 px-8 rounded-2xl">
                            <h3 className="text-8xl bg-linear-to-b from-black to-gray-400 bg-clip-text text-transparent font-inter">01</h3>
                            <div className="text-xl font-medium">Reach a wider local audience</div>
                        </div>
                        <div className="flex gap-12 py-4 items-center bg-lokabudaya_partnership_yellow w-1/2 px-8 rounded-2xl">
                            <h3 className="text-8xl bg-linear-to-b from-black to-gray-400 bg-clip-text text-transparent font-inter">02</h3>
                            <div className="text-xl font-medium">Promote your event, place, or food easily</div>
                        </div>
                        <div className="flex gap-12 py-4 items-center bg-lokabudaya_partnership_blue w-1/2 px-8 rounded-2xl">
                            <h3 className="text-8xl bg-linear-to-b from-black to-gray-400 bg-clip-text text-transparent font-inter">03</h3>
                            <div className="text-xl font-medium">Get featured on our homepage and top ads</div>
                        </div>
                        <div className="flex gap-12 py-4 items-center bg-lokabudaya_partnership_yellow w-1/2 px-8 rounded-2xl">
                            <h3 className="text-8xl bg-linear-to-b from-black to-gray-400 bg-clip-text text-transparent font-inter">04</h3>
                            <div className="text-xl font-medium">Manage your listings anytime, anywhere</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-screen relative">
                <Image src={img_nature_partnership} alt="nature partnership" className="absolute -right-4 top-16"></Image>
                <div className="px-20 py-32 gap-16 flex flex-col relative">
                    <Image src={bg_component_text_1} alt="text 1 partnership"></Image>
                    <div className="border-s-8 border-lokabudaya_event ps-12 w-3/5">
                        <p className="font-light text-3xl tracking-widest">Be part of the movement — let’s spotlight what makes your place special !</p>
                    </div>
                    <div className="flex justify-start">
                        <Link href={'/register'} className="font-aboreto py-2 px-8 font-bold hover:bg-lookabudaya_dark_blue border-4 border-lookabudaya_dark_blue hover:text-white text-xl ms-14 transition-all duration-300">
                            REGISTER NOW &#8594;
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}