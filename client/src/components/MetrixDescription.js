import React from 'react';
const MetricDescription = ({ metric }) => {
  const descriptions = {
    LCP: "Largest Contentful Paint (LCP) reports the render time of the largest content element that is visible within the viewport.",
    FCP: "First Contentful Paint (FCP) measures the time from when the page starts loading to when any part of the page's content is rendered on the screen.",
    CLS: "Cumulative Layout Shift (CLS) measures the sum total of all individual layout shift scores for every unexpected layout shift that occurs during the entire lifespan of the page.",
    INP: "Interaction to Next Paint (INP) measures the time it takes for a page to respond to user interactions.",
    TTFB: "Time to First Byte (TTFB) measures the time taken from the request for a resource until the first byte of a response begins to arrive.",
    FID: "First Input Delay (FID) measures the time from when a user first interacts with your site to the time when the browser is actually able to begin processing event handlers in response to that interaction."
  };
  const links={
    LCP:''
  }
  return (
    <div>
      <h3 className="text-blue-700 font-bold text-2xl mb-2">{metric}</h3>
      <p className="text-blue-500 text-lg italic">{descriptions[metric]}</p>
    </div>
  );
};
export default MetricDescription;
