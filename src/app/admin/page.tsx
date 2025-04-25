export default function AdminHome() {
  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="bg-white shadow-md rounded-xl p-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 animate-fade-in">
          👋 Welcome to the Admin Panel
        </h1>
        <p className="text-gray-600 text-lg">
          Use the navigation sidebar to manage your products and monitor API activity.
        </p>
      </div>
    </div>
  );
}
