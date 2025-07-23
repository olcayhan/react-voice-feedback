import { VoiceFeedback } from "./components/VoiceFeedback";

function App() {
  return (
    <div className="App">
      <h1>Voice Feedback Example</h1>
      <VoiceFeedback
        showTranscript
        language="tr"
      />
    </div>
  );
}

export default App;