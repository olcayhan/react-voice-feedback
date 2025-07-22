# React Voice Feedback

A React component library for voice feedback using the Speech Recognition API with multi-language support.

## Features

- 🎤 Voice recognition using Web Speech API
- 🌍 Auto-detection of user's browser language
- 🔧 Customizable language settings
- 📝 TypeScript support
- 🎨 Customizable UI texts
- 📦 Lightweight and easy to use

## Installation

```bash
npm install react-voice-feedback
```

## Usage

### Basic Usage

```tsx
import React from 'react';
import { VoiceFeedback } from 'react-voice-feedback';

function App() {
  const handleTranscript = (text: string) => {
    console.log('Voice input:', text);
  };

  return (
    <div>
      <VoiceFeedback onTranscript={handleTranscript} />
    </div>
  );
}
```

### Advanced Usage

```tsx
import React from 'react';
import { VoiceFeedback } from 'react-voice-feedback';

function App() {
  return (
    <div>
      {/* Auto-stop mode (default) - stops automatically after speech */}
      <VoiceFeedback
        language="en-US"
        onTranscript={(text) => console.log('Received:', text)}
        autoStop={true}
        continuous={false}
      />

      {/* Continuous mode - keeps listening until manually stopped */}
      <VoiceFeedback
        onTranscript={(text) => console.log('Received:', text)}
        continuous={true}
        autoStop={false}
        buttonTexts={{
          start: '🎤 Start Continuous Recording',
          stop: '🛑 Stop Recording'
        }}
      />

      {/* Custom configuration */}
      <VoiceFeedback
        language="tr-TR"
        onStart={() => console.log('Recording started')}
        onEnd={() => console.log('Recording ended')}
        onError={(error) => console.error('Error:', error)}
        showTranscript={true}
        continuous={false}
        autoStop={true}
      />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `language` | `string` | Auto-detected | Language code (e.g., 'en-US', 'tr-TR') |
| `onTranscript` | `(text: string) => void` | - | Callback when speech is recognized |
| `onStart` | `() => void` | - | Callback when recording starts |
| `onEnd` | `() => void` | - | Callback when recording ends |
| `onError` | `(error: string) => void` | - | Callback when an error occurs |
| `buttonTexts` | `{ start: string, stop: string }` | Auto-detected | Custom button texts |
| `showTranscript` | `boolean` | `true` | Whether to show transcript below button |
| `continuous` | `boolean` | `false` | If true, keeps listening until manually stopped |
| `autoStop` | `boolean` | `true` | If true, automatically stops after speech recognition |

## Recording Modes

### Auto-Stop Mode (Default)
- `continuous: false` and `autoStop: true`
- Automatically stops recording after the user finishes speaking
- Best for single commands or short phrases
- No manual intervention needed

### Continuous Mode
- `continuous: true` and `autoStop: false`
- Keeps listening until manually stopped by the user
- Best for longer dictation or multi-sentence input
- User must click stop button to end recording

### Manual Mode
- `continuous: false` and `autoStop: false`
- Stops only when the speech recognition API decides (usually after silence)
- Provides more control over when recording ends

## Language Support

The component automatically detects the user's browser language. If no language is specified, it will use the browser's primary language.

Supported languages include:
- English (en-US, en-GB, etc.)
- Turkish (tr-TR)
- Spanish (es-ES, es-MX, etc.)
- French (fr-FR)
- German (de-DE)
- And many more supported by the Web Speech API

## Browser Support

This component requires browsers that support the Web Speech API:
- Chrome (recommended)
- Edge
- Safari (limited support)
- Firefox (limited support)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build library
npm run build:lib

# Lint
npm run lint
```

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
