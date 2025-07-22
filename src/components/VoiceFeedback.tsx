import React, { useEffect, useRef, useState } from "react";

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

  // Get user's browser language or use provided language
  const getLanguage = () => {
    if (language) return language;
    
    // Get browser language
    const browserLang = navigator.language || navigator.languages?.[0] || 'en-US';
    return browserLang;
  };

  // Get default button texts based on language
  const getButtonTexts = () => {
    if (buttonTexts) return buttonTexts;
    
    const lang = getLanguage();
    if (lang.startsWith('tr')) {
      return {
        start: '🎤 Sesli Geri Bildirim Başlat',
        stop: '🎙️ Dinleniyor...'
      };
    }
    return {
      start: '🎤 Start Voice Feedback',
      stop: '🎙️ Listening...'
    };
  };

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
      const errorMsg = getLanguageForEffect().startsWith('tr') 
        ? "Tarayıcınız Speech Recognition desteklemiyor." 
        : "Your browser doesn't support Speech Recognition.";
      
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
      console.log("Recognized text:", speechResult);
      
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

  const currentButtonTexts = getButtonTexts();

  return (
    <div>
      <button onClick={isListening ? stopListening : startListening}>
        {isListening ? currentButtonTexts.stop : currentButtonTexts.start}
      </button>
      {showTranscript && (
        <p>
          <b>{getLanguage().startsWith('tr') ? 'Metin:' : 'Text:'}</b> {transcript}
        </p>
      )}
    </div>
  );
};
