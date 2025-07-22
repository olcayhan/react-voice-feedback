export { VoiceFeedback } from './components/VoiceFeedback';

// Export types for TypeScript users
export interface VoiceFeedbackProps {
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
