import Sidebar from "@/components/sidebar";
import { Link } from "@heroui/link";
import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-col flex-grow ml-16">
        <Navbar />

        <main className="container mx-auto max-w-7xl px-6 flex-grow pt-4">
          {children}
        </main>

        <footer className="w-full flex items-center justify-center py-3">
          <Link
            isExternal
            className="flex items-center gap-1 text-current"
            href="https://www.xto10x.com/"
            title="xto10x homepage"
          >
            <span className="text-default-600">Powered by</span>
            <p className="text-primary">xto10x</p>
          </Link>
        </footer>
      </div>
    </div>
  );
}
