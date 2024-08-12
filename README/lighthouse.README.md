# Lighthouse API Documentation

## Overview

This Express.js application provides an API endpoint for running Google Lighthouse performance audits on specified URLs. It uses the Lighthouse npm package to generate both HTML and JSON reports of the performance analysis.

## Key Components

1. **Express.js Server**: Handles HTTP requests and responses.
2. **Lighthouse**: Google's open-source, automated tool for improving web page quality.
3. **Chrome Launcher**: Used to launch Chrome in headless mode for Lighthouse audits.
4. **CORS**: Configured to allow requests from a specific origin (http://localhost:3000).

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/kna-core/ByteBenders.git
   cd ByteBenders/lighthouse
   ```

2. Install required packages:
   ```
   npm install
   ```

## Usage

1. Start the Express server:
   ```
   node app.js
   ```

2. Send a POST request to analyze a website:
   ```
   curl -X POST -H "Content-Type: application/json" -d '{"url": "https://example.com"}' http://localhost:6000/api/lighthouse
 


## API Endpoint

### POST /api/lighthouse

Runs a Lighthouse audit on the provided URL.

#### Request Body
```json
{
  "url": "https://example.com"
}
```

#### Response
```json
{
  "jsonReport": { /* Lighthouse JSON report */ },
  "htmlReport": "<!DOCTYPE html>..." // Lighthouse HTML report
}
```

## Key Takeaways

1. The API focuses on performance audits, specifically first-meaningful-paint, speed-index, and interactive metrics.
2. It provides both JSON and HTML reports for flexibility in data consumption.
3. Chrome is launched in headless mode for each request, which may impact performance under high load.
4. Error handling is implemented for both the Lighthouse run and Chrome process management.

## Scaling and Performance Improvement

To scale this application and improve its performance:

1. **Caching**: 
   - Implement a caching layer (e.g., Redis) to store recent audit results.
   - Set an appropriate expiration time for cached results.

2. **Queue System**: 
   - Implement a job queue (e.g., Bull) to handle incoming requests asynchronously.
   - This prevents long-running Lighthouse audits from blocking the server.

3. **Clustered Deployment**: 
   - Use Node.js cluster module or PM2 to run multiple instances of the application.

4. **Load Balancing**: 
   - Implement a load balancer (e.g., Nginx) to distribute requests across multiple server instances.

5. **Containerization**: 
   - Dockerize the application for easier deployment and scaling.

6. **Chrome Instance Pool**: 
   - Create a pool of Chrome instances instead of launching a new one for each request.
   - This can significantly reduce the overhead of starting Chrome for each audit.

7. **Parallel Processing**: 
   - If multiple URLs need to be audited, implement parallel processing to run audits concurrently.

## Performance Optimization

1. **Selective Audits**: 
   - Allow clients to specify which audits they want to run, reducing unnecessary computations.

2. **Resource Management**: 
   - Implement resource limits (CPU, memory) for Chrome instances to prevent resource exhaustion.

3. **Streaming Responses**: 
   - Implement streaming for large HTML reports to improve response times.

4. **Compression**: 
   - Use compression middleware (e.g., compression npm package) to reduce response payload size.

5. **Monitoring and Profiling**: 
   - Implement application monitoring (e.g., New Relic, Datadog) to identify performance bottlenecks.
   - Use Node.js profiling tools to optimize server-side code.

6. **Database Integration**: 
   - Store audit results in a database for better data management and quicker retrieval of historical data.

7. **API Rate Limiting**: 
   - Implement rate limiting to prevent abuse and ensure fair usage of resources.
