import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
        Inventory Management System
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        Welcome to the Inventory Management System. Use the sidebar to navigate between:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Link href="/items" className="block">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-primary-600 dark:text-primary-400 mb-2">
              Inventory Items
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Add, edit, and manage your inventory items. View stock levels and update quantities.
            </p>
          </div>
        </Link>
        <Link href="/orders" className="block">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-primary-600 dark:text-primary-400 mb-2">
              Orders
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Create and process orders. Assemble items and manage order status.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
