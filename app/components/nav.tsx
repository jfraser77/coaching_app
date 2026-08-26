import Link from "next/link";

export function Nav() {
    return (
        <header className="border-b">
            <nav className="mx-auto flex  max-w-5xl items-center justify-between px-6 py-4">
                <Link href="/" className="font-semibold">
                    [Liz's Name] Coaching
                </Link>
                <div className="flex gap-6 text-sm">
                    <Link href="/services">Services</Link>
                    <Link href="/about">About</Link>
                    <Link href="/scan">Free Resume Scan</Link>
                    <Link href="/book">Book a Call</Link>
                </div>
            </nav>
        </header>
    );
}

