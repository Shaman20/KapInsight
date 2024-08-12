import React, { useState, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import NavBar from './NavBar';
import searchImage from '../constants/search.png';
import dashboard from '../constants/dashboard.png';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DataAnalysisCharts = () => {
  const [domain, setDomain] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const chartRef = useRef(null);

  const handleDomainChange = (event) => {
    setInputValue(event.target.value);
  };

  const fetchData = async (e) => {
    e.preventDefault();
    setAnalysisData(null);
    setDomain(inputValue);
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: inputValue }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setError(`Error: ${errorData}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setError('');
      setAnalysisData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

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

  const handleReset = () => {
    setDomain('');
    setInputValue('');
    setAnalysisData(null);
    setError('');
  }

  // content_analysis
  const commonWords = analysisData?.content_analysis?.common_words || [];
  const sentiment = analysisData?.content_analysis?.sentiment || { neg: 0, neu: 0, pos: 0, compound: 0 };
  const topics = analysisData?.content_analysis?.topics || [];
  //core vitals
  const core_web_vitals = analysisData?.core_web_vitals;
  //compilance_analysis
  const aria_labels_count = analysisData?.compliance_analysis?.aria_labels_count;
  //seo
  const seo_analysis = analysisData?.seo_analysis;
  //structure_analysis
  const structure_analysis = analysisData?.structure_analysis;
  //technical_analysis
  const technical_analysis = analysisData?.technical_analysis
  const loadTimeIndicator = `${technical_analysis?.load_time}`;

  const technologyBadges = technical_analysis?.technologies.map(tech => (
    <span key={tech} className="inline-block  ml-2 bg-blue-100 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">
      {tech}
    </span>
  ));

  const commonWordsData = {
    labels: commonWords.map(item => item[0]),
    datasets: [
      {
        label: 'Frequency of Common Words',
        data: commonWords.map(item => item[1]),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(231, 233, 237, 0.6)',
          'rgba(248, 159, 102, 0.6)',
          'rgba(102, 255, 159, 0.6)',
          'rgba(159, 102, 255, 0.6)',
        ].slice(0, commonWords.length),
        borderColor: 'rgba(0, 0, 0, 0.2)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0,0,0,0.7)',
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
      },
    },
  };

  const sentimentData = {
    labels: ['Negative', 'Neutral', 'Positive', 'Compound'],
    datasets: [
      {
        data: [
          sentiment.neg,
          sentiment.neu,
          sentiment.pos,
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FFCF59'],
      },
    ],
  };

  const headingsData = {
    labels: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    datasets: [
      {
        label: 'Number of Headings',
        data: [
          seo_analysis?.headings.h1.length || 0,
          seo_analysis?.headings.h2.length || 0,
          seo_analysis?.headings.h3.length || 0,
          seo_analysis?.headings.h4.length || 0,
          seo_analysis?.headings.h5.length || 0,
          seo_analysis?.headings.h6.length || 0,
        ],
        backgroundColor: [
          'rgba(175, 192, 192, 0.6)',
          'rgba(123, 132, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(175, 192, 192, 1)',
          'rgba(123, 132, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const designPatterns = {
    labels: ['Footer', 'Header', 'Sidebar'],
    datasets: [
      {
        label: 'Design Patterns',
        data: [
          structure_analysis?.design_patterns?.has_footer ? 1 : 0,
          structure_analysis?.design_patterns?.has_header ? 1 : 0,
          structure_analysis?.design_patterns?.has_sidebar ? 1 : 0,
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap  justify-center gap-4">
          <h1 className="text-4xl text-center font-extrabold mb-8 text-gray-800 tracking-wide">
            Get Your Data Analysis Report Now!
          </h1>
          <img
            className="w-12 h-12"
            src={dashboard}
          ></img>
        </div>
        <div className="chart-container">
          {!loading && (
            <div className="bg-slate-100 rounded-md shadow-md p-4 mb-6">
              <form onSubmit={fetchData} className='flex items-center justify-center space-x-4'>
                <h5 className="text-2xl font-bold text-blue-700 flex-shrink-0">
                  Domain
                </h5>
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleDomainChange}
                  placeholder="Enter Domain or URL"
                  className='border border-gray-200 rounded-md px-4 py-3 text-md w-2/4 placeholder:text-center cursor-text'
                />
                {error && <p className="text-red-500 text-center">{error}</p>}
                <div className='flex items-center space-x-2 flex-shrink-0'>
                  <button
                    type="submit"
                    className="bg-transparent text-blue-700 font-semibold hover:text-white py-2 px-6 rounded-lg hover:bg-blue-600 border border-blue-500 hover:border-transparent transition duration-300"
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
                "Unlock the Insights hidden in your data,Enter your domain to for an comprehensive data analysis dashboard!"
              </div>
            </div>
          </>
        )}
        {loading && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-100 p-4 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2 m-5">
                <div className="w-6 h-6 border-t-4 border-blue-500 border-solid border-r-transparent rounded-full animate-spin"></div>
                <p>Generating Dashboard for <a className='text-blue-600 hover:text-blue-800' target="_blank" href={domain}>{domain}
                </a> ...</p>
              </div>
            </div>
          </div>
        )}
        {analysisData && (
          <>
            <div className="space-y-6 mt-5 ">
              <h2 className="text-xl font-semibold text-center">Dashboard for <a className='text-blue-600 hover:text-blue-800' target="_blank" href={domain}>{domain}
              </a>
              </h2>
              <div className="relative">
              <button
                onClick={handleDownloadPDF}
                className="  absolute right-5 top-3 bg-transparent text-green-700 font-semibold hover:text-white py-2 px-6 rounded-lg hover:bg-green-600 border border-green-500 hover:border-transparent transition duration-300 z-40"
              >
                <svg className='w-6 h-6' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v6.75m0 0-3-3m3 3 3-3m-8.25 6a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                </svg>
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" ref={chartRef} >
                <div className="chart-container bg-white rounded-lg shadow-md overflow-hidden">
                  <h3 className="text-xl font-semibold mb-4 p-4 bg-gray-200">Common Words Analysis</h3>
                  <div className="relative h-64">
                    <Pie data={commonWordsData} options={chartOptions} />
                  </div>
                </div>
                <div className="chart-container bg-white rounded-lg shadow-md overflow-hidden">
                  <h3 className="text-xl font-semibold mb-4 p-4 bg-gray-200">Sentiment Analysis</h3>
                  <div className="relative h-64">
                    <Pie data={sentimentData} options={chartOptions} />
                  </div>
                </div>
                <div className="chart-container bg-white rounded-lg shadow-md overflow-hidden">
                  <h3 className="text-xl font-semibold mb-4 p-4 bg-gray-200">Structural Analysis</h3>
                  <div className="relative h-64">
                    <Pie data={headingsData} options={chartOptions} />
                  </div>
                  <div className="p-4">
                    <div className="mb-2"><strong>Images with Alt Text:</strong> {seo_analysis.images_with_alt}</div>
                    <div className="mb-2"><strong>Meta Description:</strong> {seo_analysis.meta_description}</div>
                    <div><strong>Title:</strong> {seo_analysis.title}</div>
                  </div>
                </div>
                <div className="chart-container bg-white rounded-lg shadow-md overflow-hidden">
                  <h3 className="text-xl font-semibold mb-4 p-4 bg-gray-200">Design Patterns</h3>
                  <div className="relative h-64">
                    <Pie data={designPatterns} options={chartOptions} />
                  </div>
                  <div className="p-4">
                    <div className="mb-2">
                      <strong>Navigation Links:</strong>
                    </div>
                    <textarea
                      className="w-full h-32 p-2 border border-gray-300 rounded-md mt-2"
                      readOnly
                      value={structure_analysis.nav_links.join('\n')}
                    />
                  </div>
                </div>
                <div className="chart-container bg-white rounded-lg shadow-md overflow-hidden">
                  <h3 className="text-xl font-semibold mb-4 p-4 bg-gray-200">Topics Used</h3>
                  <textarea
                    className="w-full h-60 p-2 border border-gray-300 rounded-md"
                    readOnly
                    value={topics.join('\n')}
                  />
                </div>
                <div className="chart-container bg-white rounded-lg shadow-md overflow-hidden">
                  <h3 className="text-xl font-semibold mb-4 p-4 bg-gray-200">Technical Analysis</h3>
                  <div className="p-4">
                    <div className="mb-2"> <strong>Load Time :
                      <span className="inline-block ml-2 bg-blue-100 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">
                        {loadTimeIndicator}    </span>
                    </strong></div>

                    <div className="mb-2"><strong>Technologies Used: {technologyBadges}</strong></div>
                    <div className="mb-2"><strong>Scripts Loaded:</strong></div>
                    <textarea
                      className="w-full h-32 p-2 border border-gray-300 rounded-md mt-2"
                      readOnly
                      value={technical_analysis.scripts.join('\n')}
                    />
                  </div>
                </div>
                <div className="chart-container bg-white rounded-lg shadow-md overflow-hidden">
                  <h3 className="text-xl font-semibold mb-4 p-4 bg-gray-200">Compilance Analysis</h3>
                  <div className="flex justify-between items-center m-2">
                    <span className="font-medium">ARIA Labels Count:
                      <span className="inline-block ml-2 bg-blue-100 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">
                        {aria_labels_count}    </span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center m-2">
                    <span className="font-medium">Has Privacy Policy:
                      <span className="inline-block ml-2 bg-blue-100 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">
                        YES   </span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center m-2">
                    <span className="font-medium">Has Terms of Service:
                      <span className="inline-block ml-2 bg-blue-100 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">
                        YES   </span>
                    </span>
                  </div>
                </div>
                <div className="chart-container bg-white rounded-lg shadow-md overflow-hidden">
                  <h3 className="text-xl font-semibold mb-4 p-4 bg-gray-200">Core Web Vitals</h3>
                  <div className="flex justify-between items-center m-2">
                    <span className="font-medium">Cumilative Layout Shift:
                      <span className="inline-block ml-2 bg-blue-100 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">
                        {core_web_vitals?.CLS}
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center m-2">
                    <span className="font-medium">First Input Delay:
                      <span className="inline-block ml-2 bg-blue-100 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">
                        {core_web_vitals?.FID}
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center m-2">
                    <span className="font-medium">Largest Contenful Paint:
                      <span className="inline-block ml-2 bg-blue-100 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">
                        {core_web_vitals?.LCP}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>            
            </div>
          </>
        )}
      </div>
    </>
  );
};

const AnalyzeChart = () => {

  return (
    <>
      <div className="bg-gray-100 min-h-screen ">
        <NavBar />
        <DataAnalysisCharts />
      </div>
    </>
  );
};

export default AnalyzeChart;
