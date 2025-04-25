import Link from "next/link";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-4">
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
        <nav className="space-y-2">
          <Link href="/admin" className="block hover:underline">
            Dashboard Home
          </Link>
          <Link href="/admin/products" className="block hover:underline">
            Products
          </Link>
          <Link href="/admin/products/new" className="block hover:underline">
            Add Product
          </Link>
          <Link href="/admin/monitoring" className="block hover:underline">
            Error Monitoring
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}
