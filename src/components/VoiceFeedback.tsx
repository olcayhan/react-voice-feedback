import React, { useEffect, useRef, useState } from "react";
import { Mic } from "lucide-react";

// Type definitions for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
}

declare const SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

interface VoiceFeedbackProps {
  language?: string;
  onTranscript?: (text: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  buttonTexts?: {
    start: string;
    stop: string;
  };
  showTranscript?: boolean;
  continuous?: boolean;
  autoStop?: boolean;
}

export const VoiceFeedback: React.FC<VoiceFeedbackProps> = ({
  language,
  onTranscript,
  onStart,
  onEnd,
  onError,
  buttonTexts,
  showTranscript = true,
  continuous = false,
  autoStop = true,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Get user's browser language or use provided language
    const getLanguageForEffect = () => {
      if (language) return language;

      // Get browser language
      const browserLang = navigator.language || navigator.languages?.[0] || 'en-US';
      return browserLang;
    };

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const errorMsg = "Your browser doesn't support Speech Recognition.";

      if (onError) {
        onError(errorMsg);
      } else {
        alert(errorMsg);
      }
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = getLanguageForEffect();
    recognitionRef.current.continuous = continuous;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      const speechResult = event.results[0][0].transcript;
      setTranscript(speechResult);

      // Call the callback if provided
      if (onTranscript) {
        onTranscript(speechResult);
      }

      // Auto stop after getting result if autoStop is enabled and not continuous
      if (autoStop && !continuous) {
        setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
        }, 100); // Small delay to ensure the result is processed
      }
    };

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      if (onStart) {
        onStart();
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      if (onEnd) {
        onEnd();
      }
    };

    recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
      const errorMsg = `Speech recognition error: ${event.error}`;
      if (onError) {
        onError(errorMsg);
      } else {
        console.error(errorMsg);
      }
    };
  }, [language, onTranscript, onStart, onEnd, onError, continuous, autoStop]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setTranscript("");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, position: 'absolute', right: 16, bottom: 16 }}>
      {showTranscript && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            background: '#fff',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            padding: '8px 12px',
            maxWidth: 320,
            width: '100%',
            marginBottom: 8,
          }}
        >
          <textarea
            value={transcript}
            readOnly
            placeholder="Your message will appear here..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: 15,
              background: 'transparent',
              color: '#111',
              padding: '4px 0',
              resize: 'none',
              minHeight: 32,
            }}
          />
        </div>
      )}
      {transcript ? (
        <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
          <button
            type="button"
            onClick={() => {
              if (onTranscript) onTranscript(transcript);
              setTranscript("");
            }}
            style={{
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '8px 20px',
              fontSize: 15,
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'opacity 0.2s',
            }}
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => setTranscript("")}
            style={{
              background: '#e5e7eb',
              color: '#111',
              border: 'none',
              borderRadius: 6,
              padding: '8px 16px',
              fontSize: 15,
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'opacity 0.2s',
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={isListening ? stopListening : startListening}
          style={{
            background: isListening ? '#e11d48' : '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            transition: 'background 0.2s',
            outline: isListening ? '2px solid #fbbf24' : 'none'
          }}
          aria-label={isListening ? (buttonTexts?.stop || 'Stop Listening') : (buttonTexts?.start || 'Start Listening')}
          title={isListening ? (buttonTexts?.stop || 'Stop Listening') : (buttonTexts?.start || 'Start Listening')}
        >
          <Mic style={{ width: 28, height: 28 }} />
        </button>
      )}
    </div>
  );
};
