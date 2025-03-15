'use client';

export default function TestPage() {
  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Test Page</h1>
      <p>If you can see this text, your application is loading correctly on your mobile device.</p>
      <p style={{ marginTop: '20px' }}>Current time: {new Date().toLocaleTimeString()}</p>
      <button 
        style={{ 
          marginTop: '20px', 
          padding: '10px 15px', 
          backgroundColor: 'blue', 
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
        onClick={() => alert('Button click works!')}
      >
        Click Me
      </button>
    </div>
  );
} 