"use client"

import Link from "next/link";

export default function YourDiscoveryFeed() {
    return (
        <div className="mt-24">
            <h1 className="font-semibold text-4xl">Your Discovery Feed</h1>
            <div className="flex flex-col gap-1.5">
                <Link href={'/Discover-Where-Everyones-Making-Memories'} className="border">
                    <h2 className="font-semibold">
                        Discover Where Everyone’s Making Memories
                    </h2>
                    <div>
                        <p>wow tempat ini sangat seru kalian harus datang kesini sama siapapun yang kalian mau cocok untuk semua orang</p>
                    </div>
                </Link>
                <Link href={'/Check-Out-What-Places-Are-Going-Viral-on-Instagram'} className="border">
                    <h2>
                        Check Out What Places Are Going Viral on Instagram
                    </h2>
                    <div>
                        <p>wow tempat ini sangat seru kalian harus datang kesini sama siapapun yang kalian mau cocok untuk semua orang</p>
                    </div>
                </Link>
                <Link href={'Taste-What-Seasonal-Flavors-Everyones-Enjoying'} className="border">
                    <h2>
                        Taste What Seasonal Flavors Everyone’s Enjoying 
                    </h2>
                    <div>
                        <p>wow tempat ini sangat seru kalian harus datang kesini sama siapapun yang kalian mau cocok untuk semua orang</p>
                    </div>
                </Link>
            </div>
        </div>
    );

    /* adika */
}