# Live Voice Session Setup

## 🎯 What's Implemented

Voice-based roleplay session where:
1. AI presents a scenario (speaks it out loud)
2. You respond via voice
3. AI transcribes your response
4. AI gives feedback and continues conversation
5. Different scenarios have different prompts

## 🔑 Required API Keys

### 1. ElevenLabs (Text-to-Speech)
- Get key: https://elevenlabs.io/
- Add to `.env.local`: `ELEVENLABS_API_KEY=your_key`

### 2. OpenAI Whisper (Speech-to-Text)
- Get key: https://platform.openai.com/api-keys
- Add to `.env.local`: `OPENAI_API_KEY=your_key`

### 3. Gemini (Already configured)
- For AI feedback

## 🚀 How to Use

1. Add API keys to `.env.local`
2. Restart dev server: `npm run dev`
3. Go to `/session?scenario=gender-bias`
4. Click "Start Session"
5. AI speaks the scenario
6. Click microphone to record your response
7. AI transcribes and gives feedback
8. Conversation continues

## 📁 Files Created

- `/session/page.tsx` - Voice session UI
- `/api/elevenlabs/route.ts` - Text-to-speech
- `/api/transcribe/route.ts` - Speech-to-text
- `/api/feedback/route.ts` - AI feedback with Gemini

## 🎨 Scenarios

Each scenario has a unique prompt:
- `gender-bias` - Colleague's idea gets stolen
- `racial-microaggressions` - Inappropriate joke
- `misgendering` - Wrong pronouns used

## 💡 Alternative: Browser Speech API

If you don't want to pay for APIs, you can use browser's built-in:
- `SpeechRecognition` for transcription (free, works in Chrome)
- `SpeechSynthesis` for text-to-speech (free, all browsers)

Let me know if you want the free browser-based version instead!
