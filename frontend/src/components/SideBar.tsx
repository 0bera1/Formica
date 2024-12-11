import React from 'react'
import { MdExitToApp, MdGroup, MdMenu, MdOutlineClose, MdOutlinePlaylistAdd } from 'react-icons/md'
import { RxDashboard } from 'react-icons/rx';
import { Link, useNavigate } from 'react-router-dom'

function SideBar() {

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const navigate = useNavigate();
    const handleLogout = () => {
        // Logout işlemi (örneğin token silme ve yönlendirme)
        localStorage.removeItem('token');
        navigate('/'); // react-router kullanıyorsanız yönlendirme
    };
    return (
        <>

            <div
                className={`space-y-3 fixed top-0 left-0 w-64 h-screen bg-gradient-to-br from-blue-500 to-teal-400 text-white p-6 flex flex-col 
      justify-center lg:justify-between rounded-r-sm shadow-lg transform ${isMenuOpen ? 'translate-x-0 ' : '-translate-x-full'} transition-transform duration-300 
      ease-in-out md:block md:relative md:translate-x-0 z-50`}>

                <div className='justify-center items-center flex flex-col'>
                    <h2 className="text-2xl font-semibold text-white mb-10">Management App</h2>
                    <nav className="flex flex-col space-y-3">
                        <Link
                            to="/task/create"
                            className="flex items-center space-x-4 text-lg text-gray-200 hover:text-indigo-400 transition-all font-medium p-2 rounded-md hover:bg-gray-700">
                            <MdOutlinePlaylistAdd size={24} />
                            <span>Create Task</span>
                        </Link>
                        <Link
                            to="/users"
                            className="flex items-center space-x-4 text-lg text-gray-200 hover:text-indigo-400 transition-all font-medium p-2 rounded-md hover:bg-gray-700">
                            <MdGroup size={24} />
                            <span>User Management</span>
                        </Link>
                        <Link
                            to={'/dashboard'}
                            className="flex items-center space-x-4 text-lg text-gray-200 hover:text-indigo-400 transition-all font-medium p-2 rounded-md hover:bg-gray-700">
                            <RxDashboard size={24} />
                            <span>Dashboard</span>

                        </Link>
                        <Link
                            to={'/tasks/completed'}
                            className="flex items-center space-x-4 text-lg text-gray-200 hover:text-indigo-400 transition-all font-medium p-2 rounded-md hover:bg-gray-700">
                            <RxDashboard size={24} />
                            <span>Completed Tasks</span>

                        </Link>
                    </nav>
                </div>

                {/* Logout Button */}
                <div className="flex items-center space-x-4 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-4 text-lg text-gray-200 hover:text-red-500 transition-all font-medium p-2 rounded-md hover:bg-gray-700">
                        <MdExitToApp size={24} />
                        <span>Logout</span>
                    </button>
                </div>
            </div >

            {/* Mobile Hamburger Menu Button */}
            < button
                className="lg:hidden p-2 absolute top-4 bg-white rounded-full left-4 z-50"
                onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <MdOutlineClose size={30} className="text-blue-500" /> : <MdMenu size={30} className="text-blue-500" />}
            </button >
        </>
    )
}

export default SideBar
