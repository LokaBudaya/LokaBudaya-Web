import Link from 'next/link';
import Image from 'next/image';
import wayang404 from "../../public/images/wayang_404.svg";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <Image src={wayang404} alt='wayang 404'></Image>
      <p className="text-2xl mb-4">Halaman ga ada pakde.</p>
      <div className='relative flex items-center'>
          <Link href='/' className='m-auto cursor-pointer relative border-4 border-lookabudaya_dark_blue text-xl font-medium py-1 px-4 hover:bg-lookabudaya_dark_blue hover:text-white transition-all duration-300'>
              Back Home
          </Link>
        </div>
      </div>
  );
}
