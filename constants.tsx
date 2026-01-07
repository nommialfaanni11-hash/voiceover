
import { VoiceConfig } from './types';

export const VOICES: VoiceConfig[] = [
  {
    id: 'kore',
    name: 'Kore (The Professional)',
    voiceName: 'Kore',
    description: 'Crisp, authoritative, and fast-paced. Perfect for hard news.',
    gender: 'male',
    style: 'Breaking News'
  },
  {
    id: 'puck',
    name: 'Puck (The Insider)',
    voiceName: 'Puck',
    description: 'Playful, gossipy, and high-energy. Ideal for red carpet tea.',
    gender: 'female',
    style: 'Celebrity Gossip'
  },
  {
    id: 'zephyr',
    name: 'Zephyr (The Smooth)',
    voiceName: 'Zephyr',
    description: 'Cool, calm, and collected. Best for fashion reviews.',
    gender: 'male',
    style: 'Lifestyle'
  },
  {
    id: 'charon',
    name: 'Charon (The Deep)',
    voiceName: 'Charon',
    description: 'Gravelly and serious. Perfect for celebrity scandals.',
    gender: 'male',
    style: 'Investigation'
  },
  {
    id: 'fenrir',
    name: 'Fenrir (The Youth)',
    voiceName: 'Fenrir',
    description: 'Young, energetic, and relatable. Great for TikTok news.',
    gender: 'female',
    style: 'Trending'
  }
];

export const INITIAL_SCRIPT = "Breaking news from the hills! Last night at the Met Gala, a certain superstar made a surprise appearance that has everyone talking. Let's dive into the details of the dress that broke the internet.";
