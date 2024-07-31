import Link from "next/link";
import { auth } from "../_lib/auth";

export default async function Navigation() {
  const session = await auth();

  return (
    <nav className="z-10 text-xl">
      <ul className="flex gap-16 items-center">
        <li>
          <Link
            href="/cabins"
            className="hover:text-accent-400 transition-colors"
          >
            Cabins
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="hover:text-accent-400 transition-colors"
          >
            About
          </Link>
        </li>
        <li>
          <Link
            href="/account"
            className="hover:text-accent-400 transition-colors flex gap-2.5 items-center"
          >
            {session?.user ? (
              <img
                className="h-8 rounded-full"
                src={session.user.image}
                referrerPolicy="no-referrer"
                alt={session.user.name + " image"}
              />
            ) : null}
            Guest area
          </Link>
        </li>
      </ul>
    </nav>
  );
}
