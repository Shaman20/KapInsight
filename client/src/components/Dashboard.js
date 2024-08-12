import React, { useState, useRef } from "react";
import NavBar from "./NavBar.js";
import CoreWebVitalsChart from "./BarChart";
import searchImage from '../constants/search.png';
import rocketImage from '../constants/startup.png';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Dashboard = () => {
  const [domain, setDomain] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [month, setMonth] = useState([]);
  const [device, setDevice] = useState([]);
  const chartRef = useRef(null);

   const handleDownloadPDF = async () => {
    if (chartRef.current) {
      try {
        const canvas = await html2canvas(chartRef.current);
        const imgData = canvas.toDataURL('image/png');
        console.log(canvas);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 185;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('report.pdf');
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    } else {
      console.error('Chart reference is not set');
    }
  };

  const handleDomainChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };
  const handleDeviceChange = (event) => {
    setDevice(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    setDomain(inputValue);
  };
  const handleReset = () => {
    setDomain('');
    setInputValue('');
    setMonth([]);
    setDevice([]);
  }

  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap  justify-center gap-4">
            <h1 className="text-4xl text-center font-extrabold mb-8 text-gray-800 tracking-wide">
              Get Your UX Report Now!!
            </h1>
            <img
              className="w-12 h-12 "
              src={rocketImage}
            ></img>
          </div>
          <div className="bg-slate-100 rounded-md shadow-md p-4 mb-6">
            <form
              onSubmit={handleSubmit}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <h5 className="text-2xl text-center font-bold mb-2 text-blue-700">
                Domain
              </h5>
              <input
                type="text"
                value={inputValue}
                onChange={handleDomainChange}
                placeholder="Enter Your Domain for Web Performance Pulse"
                className="border border-gray-200 rounded-md px-4 py-3 text-md flex text-left w-auto sm:w-3/4 md:w-1/2 lg:w-1/3 placeholder:text-center cursor-text"
              />
              <select
                value={month}
                onChange={handleMonthChange}
                className="border border-gray-200 rounded-md px-4 py-3 text-md"
              >
                <option value="">Select Month</option>
                {[
                  "Jun 2024",
                  "May 2024",
                  "Apr 2024",
                  "Mar 2024",
                  "Feb 2024",
                  "Jan 2024",
                ].map((monthOption) => (
                  <option key={monthOption} value={monthOption}>
                    {monthOption}
                  </option>
                ))}
              </select>
              <select
                value={device}
                onChange={handleDeviceChange}
                className="border border-gray-200 rounded-md px-4 py-3 text-md"
              >
                <option value="">Select Device</option>
                {["DESKTOP", "PHONE", "TABLET"].map((deviceOption) => (
                  <option key={deviceOption} value={deviceOption}>
                    {deviceOption}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-transparent text-blue-700 font-semibold hover:text-white py-2 px-6 rounded-lg hover:bg-blue-600 border border-blue-500 hover:border-transparent transition duration-300"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={handleReset}
                className='bg-transparent text-red-700 font-semibold hover:text-white py-2 px-6 rounded-lg hover:bg-red-600 border border-red-500 hover:border-transparent transition duration-300'
              >
                Reset
              </button>
            </form>
          </div>
          {!domain ? (
            <>
              <div className="bg-slate-50 w-2/4 rounded-md shadow-md p-10 m-10 flex flex-col items-center absolute right-96">
                <img
                  className="w-24 h-24 mb-4"
                  src={searchImage}
                ></img>
                <div className="text-center text-lg text-gray-600 mt-4 font-bold">
                  "Want to know how your site stacks up? Enter your domain for a quick and easy digital wellness!"
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="relative">
                <button
                  onClick={handleDownloadPDF}
                  className=" absolute right-5 top-4 bg-transparent text-green-700 font-semibold hover:text-white py-2 px-6 rounded-lg hover:bg-green-600 border border-green-500 hover:border-transparent transition duration-300 z-40"
                >
                  <svg className='w-6 h-6' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v6.75m0 0-3-3m3 3 3-3m-8.25 6a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                  </svg>
                </button>
                <div className="bg-slate-100 rounded-md shadow-md p-4 mb-6" ref={chartRef}>
                  <CoreWebVitalsChart domain={domain} month={month} device={device} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
