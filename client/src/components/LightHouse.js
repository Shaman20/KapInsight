import React, { useState } from 'react';
import NavBar from './NavBar';
import lightHouse from '../constants/lighthouse.png';
import searchImage from '../constants/search.png';

const LightHouse = () => {
    const [domain, setDomain] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [htmlReport, setHtmlReport] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDomainChange = (event) => {
        console.log(event.target.value);
        setInputValue(event.target.value);
    };

    const urlRegex = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?$/;

    const handleSubmit = async (e) => {
        setHtmlReport(null);
        e.preventDefault();
        if (!urlRegex.test(inputValue)) {
            setError('Invalid URL format. Please enter a valid URL.');
            return;
        }
        setError('');
        setDomain(inputValue);
        setLoading(true);
        try {
            const response = await fetch("http://localhost:6060/api/lighthouse", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url: inputValue,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(`Error: ${errorData}`);
                throw new Error(
                    errorData.message || `HTTP error! status: ${response.status}`
                );
            }

            const htmlData = await response.text();
            setHtmlReport(htmlData);
            setLoading(false);
            setShowModal(true);
        } catch (error) {
            console.error("Error:", error);
            setLoading(false);
        }
    };

    const cancelModal = () => {
        setShowModal(false);
        setInputValue('');
        setDomain('')
    }
    const isSubmitDisabled = inputValue.length === 0 || !urlRegex.test(inputValue);

    const downloadReport = () => {
        const blob = new Blob([htmlReport], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'report.html';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleReset = () => {
        setDomain('');
        setInputValue('');
        setHtmlReport(null);
        setError('');
    }

    return (
        <>
            <div className="bg-gray-100 min-h-screen ">
                <NavBar />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-wrap  justify-center gap-4">
                        <h1 className="text-4xl text-center font-extrabold mb-8 text-gray-800 tracking-wide">
                            Get Your LightHouse Report Now!!
                        </h1>
                        <img
                            className="w-12 h-12 "
                            src={lightHouse}
                        ></img>
                    </div>
                    {!loading && !showModal && (
                        <div className="bg-slate-100 rounded-md shadow-md p-4 mb-6">
                            <form onSubmit={handleSubmit} className="flex items-center justify-center space-x-4">
                                <h5 className="text-2xl font-bold text-blue-700 flex-shrink-0">
                                    Domain
                                </h5>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={handleDomainChange}
                                    placeholder="Enter Domain or URL"
                                    className="border border-gray-200 rounded-md px-4 py-3 text-md w-2/4 placeholder:text-center cursor-text"
                                />
                                {error && <p className="text-red-500">{error}</p>}
                                <div className="flex items-center space-x-2 flex-shrink-0">
                                    <button
                                        type="submit"
                                        className="bg-transparent text-blue-700 font-semibold hover:text-white py-2 px-6 rounded-lg hover:bg-blue-600 border border-blue-500 hover:border-transparent transition duration-300"
                                        disabled={isSubmitDisabled}
                                    >
                                        Submit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="bg-transparent text-red-700 font-semibold hover:text-white py-2 px-6 rounded-lg hover:bg-red-600 border border-red-500 hover:border-transparent transition duration-300"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </form>
                        </div>

                    )}
                </div>
                {!domain && (
                    <>
                        <div className="bg-slate-50 w-2/4 rounded-md shadow-md p-10 m-10 flex flex-col items-center absolute right-96">
                            <img
                                className="w-24 h-24 mb-4"
                                src={searchImage}
                            ></img>
                            <div className="text-center text-lg text-gray-600 mt-4 font-bold">
                                "Ready to see how your website performs? Enter your domain for an in-depth Lighthouse analysis!"
                            </div>
                        </div>
                    </>
                )}
                {loading && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-slate-100 p-4 rounded-lg shadow-lg">
                            <div className="flex items-center space-x-2 m-5">
                                <div className="w-6 h-6 border-t-4 border-blue-500 border-solid border-r-transparent rounded-full animate-spin"></div>
                                <p>Generating Report for <a className='text-blue-600 hover:text-blue-800' target="_blank" href={domain}>{domain}
                                </a> ...</p>
                            </div>
                        </div>
                    </div>
                )}
                {showModal && !loading && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-80 flex items-center justify-center z-40">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl h-full ">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">LightHouse Report for
                                    <a className='text-blue-600 hover:text-blue-800 ml-2' target="_blank" href={domain}>{domain}
                                    </a></h2>
                                <div className="flex space-x-2">
                                    <button
                                        className='bg-green-500 text-white p-2 rounded-md hover:bg-green-600 flex items-center'
                                        onClick={downloadReport}
                                    >
                                        <svg className='w-6 h-6' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v6.75m0 0-3-3m3 3 3-3m-8.25 6a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                                        </svg>
                                    </button>
                                    <button
                                        className='bg-red-500 text-white p-2 rounded-md hover:bg-red-600 flex items-center'
                                        onClick={() => { cancelModal() }}
                                    >
                                        <svg className='w-6 h-6' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <iframe
                                srcDoc={htmlReport}
                                title="Report"
                                className="w-full h-full border border-gray-300"
                            ></iframe>
                        </div>
                    </div>
                )}
            </div>

        </>
    );
}

export default LightHouse;
