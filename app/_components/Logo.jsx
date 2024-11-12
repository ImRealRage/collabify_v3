import Image from 'next/image';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/dashboard">
      <div className="flex items-center gap-2 cursor-pointer">
        <Image 
          src="/logo.png" 
          alt="logo"
          width={50}
          height={50}
        />
        <h2 className="font-bold text-xl">Collabify</h2>
      </div>
    </Link>
  );
};

export default Logo;
