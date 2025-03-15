const http = require('http');
const os = require('os');

// Get network interfaces
const getNetworkInterfaces = () => {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  
  for (const iface in interfaces) {
    for (const config of interfaces[iface]) {
      // Skip internal and non-ipv4 addresses
      if (config.internal === false && config.family === 'IPv4') {
        addresses.push({
          interface: iface,
          address: config.address,
          netmask: config.netmask
        });
      }
    }
  }
  
  return addresses;
};

// Start a test server
const startTestServer = (port = 3001) => {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    
    // Get all local IPs
    const networkInterfaces = getNetworkInterfaces();
    
    // Create HTML response
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Server Test</title>
        <style>
          body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #333; }
          .card { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { text-align: left; padding: 8px; border-bottom: 1px solid #ddd; }
          .success { color: green; }
          .warning { color: orange; }
        </style>
      </head>
      <body>
        <h1>Server Test Results</h1>
        <div class="card">
          <h2>Network Information</h2>
          <p><strong>Server Time:</strong> ${new Date().toISOString()}</p>
          <p><strong>Hostname:</strong> ${os.hostname()}</p>
          <p><strong>Platform:</strong> ${os.platform()} ${os.release()}</p>
        </div>
        
        <div class="card">
          <h2>Network Interfaces</h2>
          <p>You should be able to access your Next.js app using any of these IP addresses followed by port 3000:</p>
          <table>
            <tr>
              <th>Interface</th>
              <th>IP Address</th>
              <th>Test Link</th>
            </tr>
    `;
    
    // Add each network interface to the table
    for (const iface of networkInterfaces) {
      html += `
        <tr>
          <td>${iface.interface}</td>
          <td>${iface.address}</td>
          <td><a href="http://${iface.address}:3000" target="_blank">http://${iface.address}:3000</a></td>
        </tr>
      `;
    }
    
    html += `
          </table>
        </div>
        
        <div class="card">
          <h2>Troubleshooting Steps</h2>
          <ol>
            <li>Make sure your Next.js server is running with <code>npm run dev:network</code></li>
            <li>Check that your phone and computer are on the same network</li>
            <li>Try disabling any VPN or firewall software temporarily</li>
            <li>On Windows, check Windows Defender Firewall settings</li>
          </ol>
        </div>
      </body>
      </html>
    `;
    
    res.end(html);
  });
  
  server.listen(port, '0.0.0.0', () => {
    const networkInterfaces = getNetworkInterfaces();
    console.log('\x1b[32m%s\x1b[0m', '✅ Server test is running!');
    console.log('\x1b[36m%s\x1b[0m', `🔍 You can access the test page at:`);
    
    for (const iface of networkInterfaces) {
      console.log(`   http://${iface.address}:${port}`);
    }
    
    console.log('\n\x1b[33m%s\x1b[0m', '⚠️  Keep this terminal window open and try accessing the URL from your phone browser');
  });
  
  // Handle errors and shutdown
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\x1b[31m%s\x1b[0m`, `❌ Error: Port ${port} is already in use.`);
      console.log(`Try running with a different port: node scripts/check-server.js ${port + 1}`);
    } else {
      console.error(`\x1b[31m%s\x1b[0m`, `❌ Server error:`, err.message);
    }
    process.exit(1);
  });
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n\x1b[33m%s\x1b[0m', '👋 Shutting down server test...');
    server.close();
    process.exit(0);
  });
};

// Start the server with optional port from command line
const port = process.argv[2] ? parseInt(process.argv[2]) : 3001;
startTestServer(port); 