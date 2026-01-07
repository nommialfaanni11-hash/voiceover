
import React, { useState, useCallback, useRef } from 'react';
import Layout from './components/Layout';
import { VOICES, INITIAL_SCRIPT } from './constants';
import { VoiceConfig, NewsScript, AppStatus } from './types';
import { generateCelebScript, generateVoiceover, playRawPcm } from './services/geminiService';
import { 
  Sparkles, 
  Play, 
  Download, 
  Share2, 
  Mic, 
  Zap, 
  PenTool, 
  ChevronRight,
  Info
} from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Excited and Gossipy');
  const [script, setScript] = useState<string>(INITIAL_SCRIPT);
  const [selectedVoice, setSelectedVoice] = useState<VoiceConfig>(VOICES[1]); // Default to Puck
  const [error, setError] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const handleGenerateScript = async () => {
    if (!topic.trim()) return;
    setStatus(AppStatus.SCRIPTING);
    setError(null);
    try {
      const newScript = await generateCelebScript(topic, tone);
      setScript(newScript.content);
    } catch (err: any) {
      setError(err.message || 'Failed to generate script');
    } finally {
      setStatus(AppStatus.IDLE);
    }
  };

  const handlePreviewVoice = async () => {
    if (!script.trim()) return;
    setStatus(AppStatus.VOICING);
    setError(null);
    initAudioContext();
    
    try {
      if (currentAudioSourceRef.current) {
        currentAudioSourceRef.current.stop();
      }
      
      const audioData = await generateVoiceover(script, selectedVoice);
      const source = await playRawPcm(audioData, audioContextRef.current!);
      currentAudioSourceRef.current = source;
    } catch (err: any) {
      setError(err.message || 'Failed to generate voiceover');
    } finally {
      setStatus(AppStatus.IDLE);
    }
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
        
        {/* Left Column: Scripting Engine */}
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-orange-500">
              <Sparkles size={18} />
              <h2 className="font-semibold text-lg">Script Engine</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Headline / Topic</label>
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Harry Styles at the Oscars..."
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Narrative Tone</label>
                  <select 
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  >
                    <option>Excited and Gossipy</option>
                    <option>Serious Investigative</option>
                    <option>Fashion Enthusiast</option>
                    <option>Breaking News Alert</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={handleGenerateScript}
                    disabled={status !== AppStatus.IDLE || !topic}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                  >
                    {status === AppStatus.SCRIPTING ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                    ) : (
                      <>
                        <PenTool size={18} />
                        Draft Script
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-[400px]">
             <div className="px-6 py-4 bg-zinc-800/20 border-b border-zinc-800 flex justify-between items-center">
                <span className="text-sm font-medium text-zinc-400">Editor</span>
                <div className="flex gap-2">
                  <button className="text-zinc-500 hover:text-white transition-colors"><Info size={16}/></button>
                </div>
             </div>
             <textarea 
               value={script}
               onChange={(e) => setScript(e.target.value)}
               className="flex-1 bg-transparent p-6 text-zinc-100 font-mono text-sm leading-relaxed focus:outline-none resize-none"
               placeholder="Write or generate your celeb news script here..."
             />
          </section>
        </div>

        {/* Right Column: Voice Selection & Mastering */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl shadow-xl">
             <div className="flex items-center gap-2 mb-6 text-yellow-500">
                <Mic size={18} />
                <h2 className="font-semibold text-lg">Voice Lab</h2>
             </div>

             <div className="grid grid-cols-1 gap-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                {VOICES.map((voice) => (
                  <button
                    key={voice.id}
                    onClick={() => setSelectedVoice(voice)}
                    className={`group relative p-4 rounded-xl border transition-all text-left flex items-start gap-4 ${
                      selectedVoice.id === voice.id 
                      ? 'bg-zinc-800/80 border-orange-500/50 shadow-lg shadow-orange-500/5' 
                      : 'bg-zinc-800/30 border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-700'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                      selectedVoice.id === voice.id ? 'bg-orange-500 text-black' : 'bg-zinc-700 text-zinc-400 group-hover:bg-zinc-600'
                    }`}>
                      <Zap size={22} fill={selectedVoice.id === voice.id ? "currentColor" : "none"} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <p className={`font-bold text-sm ${selectedVoice.id === voice.id ? 'text-white' : 'text-zinc-300'}`}>{voice.name}</p>
                        <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-500 font-bold uppercase tracking-tighter">
                          {voice.gender}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 leading-tight">{voice.description}</p>
                    </div>
                  </button>
                ))}
             </div>

             <div className="mt-8 pt-6 border-t border-zinc-800 space-y-4">
               {error && (
                 <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                   {error}
                 </div>
               )}
               
               <button 
                  onClick={handlePreviewVoice}
                  disabled={status !== AppStatus.IDLE || !script}
                  className="w-full bg-white text-black py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-orange-500 hover:text-white transition-all disabled:opacity-50"
               >
                 {status === AppStatus.VOICING ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-black/30 border-t-black" />
                 ) : (
                    <>
                      <Play size={20} fill="currentColor" />
                      Generate & Preview
                    </>
                 )}
               </button>

               <div className="flex gap-3">
                 <button className="flex-1 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all border border-zinc-700/50">
                    <Download size={18} />
                    <span className="text-xs font-bold uppercase">Export MP3</span>
                 </button>
                 <button className="flex-1 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all border border-zinc-700/50">
                    <Share2 size={18} />
                    <span className="text-xs font-bold uppercase">Share</span>
                 </button>
               </div>
             </div>
          </section>

          {/* Social Proof Mini Widget */}
          <div className="p-6 bg-gradient-to-br from-indigo-900/20 to-zinc-900/50 rounded-2xl border border-zinc-800/50 flex items-center gap-4">
             <div className="h-10 w-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
               <ChevronRight size={24} />
             </div>
             <div>
               <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Pro Tip</p>
               <p className="text-sm text-zinc-400">Try combining <b>Puck</b> for intros and <b>Kore</b> for the main body for high retention.</p>
             </div>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default App;
