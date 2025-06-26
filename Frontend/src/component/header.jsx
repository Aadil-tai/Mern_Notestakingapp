import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../utils/userAction';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery } from '../actions/searchActions';
import { FaUserCircle } from 'react-icons/fa';

const navLinks = [{ name: 'My Notes', path: '/mynotes' }];

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { userInfo } = useSelector((state) => state.userLogin);
    const globalSearch = useSelector((state) => state.searchQuery);
    const [input, setInput] = useState(globalSearch || '');

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    useEffect(() => {
        const delay = setTimeout(() => {
            dispatch(setSearchQuery(input));
        }, 400);
        return () => clearTimeout(delay);
    }, [input, dispatch]);

    return (
        <header className="bg-gray-900 text-white shadow-md">
            <nav className="mx-auto flex items-center justify-between px-4 py-3">
                {/* Logo + Name */}
                <Link to="/" className="flex items-center space-x-2">
                    <img
                        src="https://flowbite.com/docs/images/logo.svg"
                        className="h-8 w-8"
                        alt="QuickNote Logo"
                    />
                    <span className="text-xl font-bold">Quick Note</span>
                </Link>

                {/* Search Bar */}
                {userInfo && (
                    <div className="flex-1 mx-4 max-w-md hidden md:flex">
                        <input
                            type="text"
                            placeholder="Search notes..."
                            className="w-full px-4 py-2 text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </div>
                )}

                {/* Right Side */}
                <div className="flex items-center space-x-4">
                    {/* Navigation Links */}
                    <div className="hidden lg:flex items-center space-x-6 text-sm font-medium">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="transition-all duration-200 hover:text-blue-400"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Auth / Profile */}
                    {userInfo ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-white hover:text-blue-400"
                            >
                                <FaUserCircle size={26} />
                            </button>
                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-md shadow-lg z-50 overflow-hidden">
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="hidden md:inline-block px-4 py-2 text-sm bg-transparent border border-white rounded hover:bg-white hover:text-gray-900 transition-all duration-200"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/signup"
                                className="hidden md:inline-block px-4 py-2 text-sm bg-primary rounded hover:bg-primary transition-all duration-200"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="inline-flex lg:hidden p-2 text-white rounded hover:bg-gray-700 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            {isMenuOpen ? (
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            ) : (
                                <path
                                    fillRule="evenodd"
                                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                    clipRule="evenodd"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="lg:hidden bg-gray-800 text-white px-4 pb-4 space-y-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="block py-2 border-b border-gray-700 hover:text-blue-400"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* 👇 Add this: login/signup buttons for mobile */}
                    {!userInfo && (
                        <div className="pt-2 space-y-2">
                            <Link
                                to="/login"
                                className="block w-full text-center px-4 py-2 text-sm bg-transparent border border-white rounded hover:bg-white hover:text-gray-900 transition-all duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Log in
                            </Link>
                            <Link
                                to="/signup"
                                className="block w-full text-center px-4 py-2 text-sm bg-primary rounded hover:bg-primary transition-all duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            )}

        </header>
    );
};

export default Header;
