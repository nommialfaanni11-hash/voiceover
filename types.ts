
export interface VoiceConfig {
  id: string;
  name: string;
  voiceName: string;
  description: string;
  gender: 'male' | 'female';
  style: string;
}

export interface NewsScript {
  headline: string;
  content: string;
  tone: string;
}

export interface VoiceoverJob {
  id: string;
  timestamp: number;
  script: NewsScript;
  voice: VoiceConfig;
  audioUrl?: string;
  status: 'idle' | 'generating' | 'ready' | 'error';
}

export enum AppStatus {
  IDLE = 'idle',
  SCRIPTING = 'scripting',
  VOICING = 'voicing',
  ERROR = 'error'
}
