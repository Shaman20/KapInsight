import React, { useEffect, useState, useRef } from "react";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import MetricDescription from "./MetrixDescription";

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const CoreWebVitalsChart = ({ domain, month, device }) => {
  const chartRefs = useRef([]);
  const chartInstances = useRef([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = "AIzaSyBK6SS71kPzGIOLINfSmyiseUdM4B7YNqA"; // Replace with your actual API key
        const url = `https://chromeuxreport.googleapis.com/v1/records:queryHistoryRecord?key=${apiKey}`;
        const formFactorMap = {
          DESKTOP: "DESKTOP",
          PHONE: "PHONE",
          TABLET: "TABLET",
        };
        const formFactor = formFactorMap[device] || "ALL_FORM_FACTORS";
        const requestBody = {
          origin: `${domain}`,
          formFactor: formFactor, // Use the first device from the array
          metrics: [
            "cumulative_layout_shift",
            "first_contentful_paint",
            "interaction_to_next_paint",
            "navigation_types",
            "largest_contentful_paint",
            "experimental_time_to_first_byte",
            "first_input_delay",
          ],
        };
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
        const data = await response.json();
        console.log(data); // Check the response structure
        if (data && data.record && data.record.metrics) {
          const metrics = data.record.metrics;
          // Process the data as needed
          const processedData = {
            labels: ["CLS", "FCP", "INP", "LCP", "TTFB", "FID"],
            datasets: [
              {
                label: "Core Web Vitals",
                data: [
                  metrics.cumulative_layout_shift?.percentilesTimeseries
                    ?.p75s?.[0] || 0,
                  metrics.first_contentful_paint?.percentilesTimeseries
                    ?.p75s?.[0] || 0,
                  metrics.interaction_to_next_paint?.percentilesTimeseries
                    ?.p75s?.[0] || 0,
                  metrics.largest_contentful_paint?.percentilesTimeseries
                    ?.p75s?.[0] || 0,
                  metrics.experimental_time_to_first_byte?.percentilesTimeseries
                    ?.p75s?.[0] || 0,
                  metrics.first_input_delay?.percentilesTimeseries?.p75s?.[0] ||
                    0,
                ],
                backgroundColor: [
                  "rgba(33, 150, 243, 0.8)", // Material Blue
                  "rgba(244, 67, 54, 0.8)", // Material Red
                  "rgba(255, 193, 7, 0.8)", // Material Amber
                  "rgba(76, 175, 80, 0.8)", // Material Green
                  "rgba(156, 39, 176, 0.8)", // Material Purple
                  "rgba(255, 87, 34, 0.8)", // Material Deep Orange
                ],
                borderColor: [
                  "rgba(33, 150, 243, 1)", // Material Blue
                  "rgba(244, 67, 54, 1)", // Material Red
                  "rgba(255, 193, 7, 1)", // Material Amber
                  "rgba(76, 175, 80, 1)", // Material Green
                  "rgba(156, 39, 176, 1)", // Material Purple
                  "rgba(255, 87, 34, 1)", // Material Deep Orange
                ],
                borderWidth: 1,
                borderSkipped: false,
                hoverBackgroundColor: "rgba(255, 255, 255, 0.7)",
                hoverBorderWidth: 2,
              },
            ],
          };
          setChartData(processedData);
        } else {
          console.error("Unexpected API response format");
        }
      } catch (error) {
        console.error("Error fetching Core Web Vitals data:", error);
      }
    };
    if (domain && month.length && device.length) {
      fetchData();
    }
  }, [domain, month, device]);
  useEffect(() => {
    if (chartData) {
      // Create a copy of chartInstances.current to be used in the cleanup function
      const localChartInstances = chartInstances.current;
      chartData.labels.forEach((label, index) => {
        const ctx = chartRefs.current[index]?.getContext("2d");
        // Destroy the previous chart instance if it exists
        if (localChartInstances[index]) {
          localChartInstances[index].destroy();
        }
        // Create a new chart instance
        localChartInstances[index] = new Chart(ctx, {
          type: "bar",
          data: {
            labels: [label],
            datasets: [
              {
                label: label,
                data: [chartData.datasets[0].data[index]],
                backgroundColor: chartData.datasets[0].backgroundColor[index],
                borderColor: chartData.datasets[0].borderColor[index],
                borderWidth: 1,
                // Adding shadow to bars
                borderSkipped: false,
                hoverBackgroundColor: "rgba(255, 255, 255, 0.7)",
                hoverBorderColor: chartData.datasets[0].borderColor[index],
                hoverBorderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: `${label} for ${domain}`,
                color: "#444", // Darker title color
                font: {
                  size: 18,
                  weight: "bold",
                  family: "Arial, sans-serif",
                },
              },
              tooltip: {
                mode: "index",
                intersect: false,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                titleFont: {
                  size: 14,
                  weight: "bold",
                  family: "Arial, sans-serif",
                },
                bodyFont: {
                  size: 12,
                  family: "Arial, sans-serif",
                },
              },
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                type: "category",
                title: {
                  display: true,
                  text: "Metric",
                  color: "#555",
                  font: {
                    size: 14,
                    weight: "bold",
                    family: "Arial, sans-serif",
                  },
                },
                grid: {
                  display: false, // Hide vertical grid lines
                },
              },
              y: {
                type: "linear",
                title: {
                  display: true,
                  text: "Value",
                  color: "#555",
                  font: {
                    size: 14,
                    weight: "bold",
                    family: "Arial, sans-serif",
                  },
                },
                beginAtZero: true,
                grid: {
                  color: "rgba(200, 200, 200, 0.2)", // Lighter grid lines
                },
              },
            },
            layout: {
              padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
              },
            },
            // Background color for the chart area
            plugin: {
              background: {
                beforeDraw: (chart, args, options) => {
                  const { ctx, chartArea } = chart;
                  ctx.save();
                  ctx.fillStyle = "rgba(240, 240, 240, 0.7)"; // Light gray background
                  ctx.fillRect(
                    chartArea.left,
                    chartArea.top,
                    chartArea.right - chartArea.left,
                    chartArea.bottom - chartArea.top
                  );
                  ctx.restore();
                },
              },
            },
          },
        });
      });

      Chart.register({
        id: "background",
        beforeDraw: (chart, args, options) => {
          const { ctx } = chart;
          ctx.save();
          ctx.fillStyle = "rgba(255, 255, 255, 0.7)"; // Light background for the whole chart
          ctx.fillRect(0, 0, chart.width, chart.height);
          ctx.restore();
        },
      });
      // Cleanup function to destroy charts when the component is unmounted
      return () => {
        localChartInstances.forEach((chart) => {
          if (chart) {
            chart.destroy();
          }
        });
      };
    }
  }, [chartData, domain]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {chartData &&
        chartData.labels.map((label, index) => (
          <div key={label} className="bg-white rounded-lg shadow-md p-6">
            <MetricDescription metric={label} />
            <div className="h-64 mt-4">
              <canvas
                ref={(el) => (chartRefs.current[index] = el)}
                className="w-full h-full"
              />
            </div>
          </div>
        ))}
    </div>
  );
};
export default CoreWebVitalsChart;
