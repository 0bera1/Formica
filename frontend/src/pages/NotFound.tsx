function NotFound() {
    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-r from-gray-600 via-stone-500 to-gray-600">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-white mb-4">404 Not-Found</h1>
                <p className="text-2xl text-white mb-6">Oops! The page you're looking for can't be found.</p>
                <div className="hover:scale-125 transition-all duration-300 mt-10">
                    <a
                        href="/"
                        className="bg-white shadow-2xl text-gray-800 px-6 py-3 text-xl font-semibold rounded-full hover:bg-gray-200  transition-all duration-300"
                    >
                        Go Back Login
                    </a>
                </div>

            </div>
        </div>
    );
}

export default NotFound;
