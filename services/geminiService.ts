
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { NewsScript, VoiceConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateCelebScript(topic: string, tone: string): Promise<NewsScript> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Write a 100-word celebrity news script about "${topic}". The tone should be ${tone}. 
    Make it catchy, use celebrity slang where appropriate, and ensure it sounds like a broadcast script.`,
    config: {
      thinkingConfig: { thinkingBudget: 0 }
    }
  });

  const text = response.text || "";
  return {
    headline: topic,
    content: text,
    tone: tone
  };
}

export async function generateVoiceover(text: string, voice: VoiceConfig): Promise<Uint8Array> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Read this with a ${voice.style} style: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: voice.voiceName },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error("No audio data returned from Gemini TTS");
  }

  return decodeBase64(base64Audio);
}

// Utility to decode base64
function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Audio context helper for raw PCM playback
export async function playRawPcm(data: Uint8Array, audioCtx: AudioContext) {
  const dataInt16 = new Int16Array(data.buffer);
  const numChannels = 1;
  const sampleRate = 24000;
  const frameCount = dataInt16.length / numChannels;
  const buffer = audioCtx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);
  source.start();
  return source;
}
