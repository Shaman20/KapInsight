import React from "react";
import Logout from "./Logout";
import { useAuth } from "./AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import wave from '../constants/wave.png';

const NavBar = () => {
    const { firstName } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleScraperNavigation = () => {
        navigate("/analysis");
    }

    const handleLightHouseNavigation = () => {
        navigate("/lighthouse");
    };

    const handleDashboardNavigation = () => {
        navigate("/dashboard");
    };

    return (
        <>
            <nav className="block w-full  mx-auto bg-slate-200 border shadow-md rounded-xl border-white/80 bg-opacity-80 backdrop-blur-2xl backdrop-saturate-200 lg:px-8 lg:py-4">
                <div className="max-w-screen-xl flex items-center">
                    <div className="flex items-center">
                        <img
                            alt=""
                            className="h-14 w-20 ml-4"
                            src="//images.ctfassets.net/gogvzi849aaj/1MrBZZm1sLbyHzlANcxGu0/7ce904f24320350f4762ec26f04c79a0/KAPLAN-logo.svg"
                        />
                    </div>
                    <h3 className="text-center mr-12 text-3xl font-bold text-blue-900 shadow-sm"
                        style={{ marginLeft: '640px' }}
                    >
                        Welcome to Kap-Insight
                    </h3>
                    <div
                        className="flex items-center text-blue-gray-900"
                        id="navbar-default "
                        style={{ position: "absolute", right: "10px" }}
                    >
                        {firstName && (
                            <>
                                <span className="mr-4 text-center text-m text-xl font-bold text-blue-700 flex-shrink-0">
                                    Hi, {firstName}!,
                                </span>
                                <img
                                    className="w-12 h-12 mr-4"
                                    src={wave}
                                ></img>
                            </>
                        )}
                        {location.pathname === "/dashboard" && (
                            <>
                                <button
                                    type="button"
                                    className="bg-transparent text-blue-700 font-semibold hover:text-white py-2 px-6 mr-3 rounded-lg hover:bg-blue-600 border border-blue-500 hover:border-transparent transition duration-300"
                                    onClick={handleLightHouseNavigation}
                                >
                                    Lighthouse
                                </button>
                                <button
                                    type="button"
                                    className="bg-transparent text-blue-700 font-semibold hover:text-white py-2 px-6 mr-3 rounded-lg hover:bg-blue-600 border border-blue-500 hover:border-transparent transition duration-300"
                                    onClick={handleScraperNavigation}
                                >
                                    NLP
                                </button>
                            </>
                        )}
                        {location.pathname === "/lighthouse" && (
                            <button
                                type="button"
                                className="bg-transparent text-blue-700 font-semibold hover:text-white py-2 px-6 mr-3 rounded-lg hover:bg-blue-600 border border-blue-500 hover:border-transparent transition duration-300"
                                onClick={handleDashboardNavigation}
                            >
                                Dashboard
                            </button>
                        )}

                        {location.pathname === "/analysis" && (
                            <button
                                type="button"
                                className="bg-transparent text-blue-700 font-semibold hover:text-white py-2 px-6 mr-3 rounded-lg hover:bg-blue-600 border border-blue-500 hover:border-transparent transition duration-300"
                                onClick={handleDashboardNavigation}
                            >
                                Dashboard
                            </button>
                        )}

                        <Logout />
                    </div>
                </div>
            </nav>

        </>
    );
};

export default NavBar;
