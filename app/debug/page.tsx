export default function DebugPage() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '20px auto', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      <h1 style={{ color: '#333', fontSize: '24px' }}>Debug Page</h1>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '6px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Environment Information</h2>
        <p><strong>Current URL:</strong> <span id="current-url">(Will be filled by JavaScript)</span></p>
        <p><strong>User Agent:</strong> <span id="user-agent">(Will be filled by JavaScript)</span></p>
        <p><strong>Window Size:</strong> <span id="window-size">(Will be filled by JavaScript)</span></p>
        <p><strong>Render Time:</strong> {new Date().toISOString()}</p>
      </div>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>If you can see this, HTML rendering is working correctly!</p>
      </div>
      
      <script dangerouslySetInnerHTML={{ __html: `
        // Simple inline script to test JavaScript execution
        document.getElementById('current-url').textContent = window.location.href;
        document.getElementById('user-agent').textContent = navigator.userAgent;
        document.getElementById('window-size').textContent = \`\${window.innerWidth}×\${window.innerHeight}\`;
      `}} />
    </div>
  );
} 