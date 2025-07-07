import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-[80vh] flex justify-center items-center">
      <div className="flex gap-4">
        <Link
          className="bg-blue-500 py-2 px-4 rounded-2xl"
          href={"/auth/register"}
        >
          Register
        </Link>
        <Link
          className="bg-blue-500 py-2 px-4 rounded-2xl"
          href={"/auth/login"}
        >
          Login
        </Link>
      </div>
    </div>
  );
}
