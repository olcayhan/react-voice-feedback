import { useState } from "react";
import { VoiceFeedback } from "./components/VoiceFeedback";

function App() {
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h1>React Voice Feedback - Development Test</h1>
      
      <div style={{ margin: '20px 0' }}>
        <h2>Auto-Stop Mode (Default)</h2>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Konuşma bitince otomatik kapanır
        </p>
        <VoiceFeedback 
          onTranscript={(text) => addLog(`Auto-Stop: ${text}`)}
          onStart={() => addLog('Auto-stop recording started')}
          onEnd={() => addLog('Auto-stop recording ended')}
          onError={(error) => addLog(`Error: ${error}`)}
          autoStop={true}
          continuous={false}
        />
      </div>

      <div style={{ margin: '20px 0' }}>
        <h2>Continuous Mode</h2>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Sürekli dinleme (Manuel olarak durdurmanız gerekir)
        </p>
        <VoiceFeedback 
          onTranscript={(text) => addLog(`Continuous: ${text}`)}
          onStart={() => addLog('Continuous recording started')}
          onEnd={() => addLog('Continuous recording ended')}
          onError={(error) => addLog(`Error: ${error}`)}
          continuous={true}
          autoStop={false}
          buttonTexts={{
            start: '🎤 Sürekli Dinleme Başlat',
            stop: '🛑 Dinlemeyi Durdur'
          }}
        />
      </div>

      <div style={{ margin: '20px 0' }}>
        <h3>Event Logs:</h3>
        <div style={{ 
          height: '200px', 
          overflow: 'auto', 
          border: '1px solid #ccc', 
          padding: '10px',
          background: '#f9f9f9',
          fontSize: '12px'
        }}>
          {logs.length === 0 ? (
            <div style={{ color: '#666' }}>No events yet...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} style={{ marginBottom: '5px' }}>
                {log}
              </div>
            ))
          )}
        </div>
        <button 
          onClick={() => setLogs([])}
          style={{ marginTop: '10px', padding: '5px 10px' }}
        >
          Clear Logs
        </button>
      </div>
    </div>
  );
}

export default App;