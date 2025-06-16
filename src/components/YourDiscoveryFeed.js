"use client"

import Link from "next/link";
import Image from "next/image";
import { Eye } from "lucide-react";
import bg_big_component_blue_thing from "../../public/images/bg-big-component_blue-thing.svg"
import bg_big_component_radial from "../../public/images/bg-big-component_radial.svg"
import bg_big_component_radial_yellow from "../../public/images/bg-big-component_radial-yellow.svg"

import article_img from '../../public/images/article-img.svg';

export default function YourDiscoveryFeed() {
    return (
        <div className="mt-24 relative">
            <Image src={bg_big_component_radial} alt="bg big component" className="absolute -top-1/4 z-0"></Image>
            <Image src={bg_big_component_radial_yellow} alt="bg big component" className="absolute -right-1/5 top-1/3 z-0"></Image>
            <div className="p-14 mx-36 flex flex-col gap-12 items-center bg-white/50 backdrop-blur-md rounded-3xl z-10 relative">
                <h1 className="font-semibold text-5xl">Your Discovery Feed</h1>

                <div className="flex gap-8">
                    <Link href={'/article'} className="flex-[2]">
                        <div className="flex flex-col items-center">
                            <Image src={article_img} alt="article" className="w-full rounded-xl"></Image>
                            <h2 className="font-semibold text-2xl mt-4 mb-1">
                                Find Out What Destinations Are Trending Now
                            </h2>
                            <div className="font-light text-xs text-gray-600">
                                <p>wow tempat ini sangat seru kalian harus datang kesini sama siapapun yang kalian mau cocok untuk semua orang</p>
                                <div className="my-2">
                                    <span className="px-4 border rounded-full">Tour</span>
                                </div>
                                <div className="flex justify-between">
                                    <p>20 September 2025</p>
                                    <div className="flex items-center gap-1"><Eye></Eye>11k</div>
                                </div>
                            </div>
                        </div>
                    </Link>

                    <div className="flex flex-col gap-1.5 flex-[3]">

                        <Link href={'/article'}>
                            <div className="flex gap-4 items-center">
                                <div className="flex-[2]">
                                    <Image src={article_img} alt="article" className="w-full rounded-xl"></Image>
                                </div>
                                <div className="flex-[5]">
                                    <div className="flex flex-col">
                                        <h2 className="font-semibold text-2xl mt-4 mb-1">
                                            Discover Where Everyone’s Making Memories
                                        </h2>
                                        <div className="font-light text-xs text-gray-600">
                                            <p>wow tempat ini sangat seru kalian harus datang kesini sama siapapun yang kalian mau cocok untuk semua orang</p>
                                            <div className="my-2">
                                                <span className="px-4 border rounded-full">Tour</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <p>20 September 2025</p>
                                                <div className="flex items-center gap-1"><Eye></Eye>11k</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link href={'/article'}>
                            <div className="flex gap-4 items-center">
                                <div className="flex-[2]">
                                    <Image src={article_img} alt="article" className="w-full rounded-xl"></Image>
                                </div>
                                <div className="flex-[5]">
                                    <div className="flex flex-col">
                                        <h2 className="font-semibold text-2xl mt-4 mb-1">
                                            Discover Where Everyone’s Making Memories
                                        </h2>
                                        <div className="font-light text-xs text-gray-600">
                                            <p>wow tempat ini sangat seru kalian harus datang kesini sama siapapun yang kalian mau cocok untuk semua orang</p>
                                            <div className="my-2">
                                                <span className="px-4 border rounded-full">Tour</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <p>20 September 2025</p>
                                                <div className="flex items-center gap-1"><Eye></Eye>11k</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link href={'/article'}>
                            <div className="flex gap-4 items-center">
                                <div className="flex-[2]">
                                    <Image src={article_img} alt="article" className="w-full rounded-xl"></Image>
                                </div>
                                <div className="flex-[5]">
                                    <div className="flex flex-col">
                                        <h2 className="font-semibold text-2xl mt-4 mb-1">
                                            Discover Where Everyone’s Making Memories
                                        </h2>
                                        <div className="font-light text-xs text-gray-600">
                                            <p>wow tempat ini sangat seru kalian harus datang kesini sama siapapun yang kalian mau cocok untuk semua orang</p>
                                            <div className="my-2">
                                                <span className="px-4 border rounded-full">Tour</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <p>20 September 2025</p>
                                                <div className="flex items-center gap-1"><Eye></Eye>11k</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}