"use client"

import Image from 'next/image'
import img_article from '../../public/images/img_article.svg'
import img_1_article from '../../public/images/img-1_article.svg'
import pfp_user from '../../public/images/photoprofile-user_article.svg'

export default function ArticleContent() {
    return (
        <div className="w-screen">
            <div className='flex my-40'>
                <div className='flex-1 relative'>
                    <Image src={img_article} alt='image article' className='rounded-2xl absolute -left-20'></Image>
                </div>
                <div className='flex-1 flex-col pe-14'>
                    <div>
                        <h1 className='font-semibold text-7xl text-right tracking-wide leading-20 text-lookabudaya_dark_blue_hover'>Karimunjawa: Hidden Paradise yang Bikin <span className='italic'>Speechless</span></h1>
                    </div>
                    <div className='flex gap-4 items-center mt-4 justify-center'>
                        <Image src={pfp_user} alt='pfp user'></Image>
                        <div className='flex gap-4'>
                            <p className='font-semibold'>alya irgina</p>
                            <p>|</p>
                            <p className='font-light'>Last Updated on 12 july 2025</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex px-16 gap-12'>
                <div className='flex-5/7 tracking-wider text-xl'>
                    <h3 className='font-medium bold'>Guys, kalian tau nggak sih ada surga tersembunyi di Jawa Tengah yang literally bikin mata berbinar-binar? Namanya Karimunjawa! Baru aja balik dari sana dan masih belum move on sama keindahannya. Serius deh, tempat ini tuh kayak Maldives versi Indonesia banget!</h3>
                    <div className='py-12'>
                        <div>
                            <p className='font-semibold'>Perjalanan yang Bikin Deg-degan</p>
                            <br></br>
                        </div>
                        <div>
                            <p>Perjalanan ke Karimun dimulai dari Pelabuhan Kartini, Jepara. Naik kapal express sekitar 2 jam, dan trust me, perjalanannya udah seru banget! Awalnya sih agak nervous karena gelombangnya lumayan, tapi pas udah nyampe... OMG! Air lautnya biru banget</p>
                            <br></br>
                        </div>
                        <div>
                            <p className='font-semibold'>Island Hopping yang Epic Abis!</p>
                            <br></br>
                        </div>
                        <div>
                            <p>Yang paling memorable tuh pas island hopping-nya. Ada beberapa spot yang wajib banget dikunjungi:</p>
                            <br></br>

                            <p>Pulau Menjangan Besar
                            <br></br>
                            Ini dia yang bikin jatuh cinta! Pantainya bersih banget, pasir putihnya halus kayak tepung. Yang paling amazing tuh rusa-rusa liar yang berkeliaran bebas. Mereka jinak banget dan bisa difoto bareng. So cute!</p>
                            <br></br>

                            <p>Pulau Cemara Kecil
                            <br></br>
                            Literally pulau mini yang luasnya cuma 1.5 hektare. Tapi vibes-nya tuh romantis banget! Perfect buat yang mau foto aesthetic atau couple goals. Air lautnya jernih banget, bisa lihat dasar laut dari permukaan.</p>
                            <br></br>

                            <p>Pulau Cilik
                            <br></br>
                            Pulau yang satu ini hidden gem banget! Nggak banyak turis yang kesini, jadi masih pristine dan tenang. Cocok banget buat yang pengen me time atau sekadar nikmatin suara ombak.</p>
                        </div>
                    </div>

                    <Image src={img_1_article} alt='image 1 article' className='w-full'></Image>

                    <div className='py-12'>
                        <div>
                            <p className='font-semibold'>Snorkeling Experience yang Unforgettable</p>
                            <br></br>
                        </div>
                        <div>
                            <p>Yang bikin Karimun special banget tuh underwater-nya! Snorkeling di sini tuh kayak masuk akuarium raksasa. Terumbu karangnya masih colorful banget, ikan-ikannya beragam, ada yang warna-warni kayak pelangi!</p>
                            <br></br>
                            <p>Spot snorkeling terbaik menurut aku sih di sekitar Pulau Menjangan Kecil. Visibility-nya bagus, arus nggak terlalu kencang, jadi aman buat pemula. Aku yang biasanya takut air dalam, di sini malah betah berjam-jam!</p>
                            <br></br>
                        </div>
                        <div>
                            <p className='font-semibold'>Overall Experience</p>
                            <br></br>
                        </div>
                        <div>
                            <p>Karimunjawa tuh definitely masuk bucket list tempat yang wajib dikunjungi ulang! Nature-nya masih pristine, locals-nya ramah, dan yang paling penting harganya masih affordable. Perfect escape dari hiruk pikuk kota yang stressful.</p>
                            <br></br>
                            <p>So, kapan kalian mau kesini? Trust me, sekali kesini pasti bakal addicted dan pengen balik lagi. Karimun literally therapeutic* banget buat jiwa yang lagi butuh healing!</p>
                            <br></br>
                            <p>See you in paradise, guys!</p>
                        </div>
                    </div>
                </div>
                <div className='flex-2/7 border border-gray-300'></div>
            </div>
            
        </div>
    )
}