import React, { useState, useRef } from 'react';
import { Camera, Sparkles, Upload, RotateCcw, Loader2 } from 'lucide-react';
import { analyzeStyle } from '../services/geminiService';
import { StyleRecommendation, LoadingState } from '../types';

const StyleAdvisor: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [recommendations, setRecommendations] = useState<StyleRecommendation[]>([]);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!description && !image) return;

    setStatus(LoadingState.LOADING);
    setRecommendations([]);

    try {
      const results = await analyzeStyle(image, description);
      setRecommendations(results);
      setStatus(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(LoadingState.ERROR);
    }
  };

  const reset = () => {
    setImage(null);
    setDescription('');
    setRecommendations([]);
    setStatus(LoadingState.IDLE);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <section id="consult" className="py-24 bg-gradient-to-b from-black to-zinc-950 relative overflow-hidden">
      {/* Decorative bg elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Content */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="text-gold-500" size={24} />
              <span className="text-gold-500 font-bold tracking-[0.2em] uppercase text-sm">AI Powered</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
              Virtual Style <br/>
              <span className="text-gold-400">Consultant</span>
            </h2>
            <p className="text-zinc-400 mb-8 leading-relaxed text-lg">
              Not sure what look suits you best? Upload a selfie or describe your hair type, 
              and our AI stylist will analyze your face shape and texture to recommend 
              the perfect bespoke cuts for you.
            </p>

            <div className="space-y-6 bg-zinc-900/50 p-6 rounded-lg border border-zinc-800">
              {/* Image Input */}
              <div>
                <label className="block text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  1. Upload a Photo (Optional)
                </label>
                <div className="flex items-center gap-4">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer w-full h-32 border-2 border-dashed border-zinc-700 hover:border-gold-500 rounded-md flex flex-col items-center justify-center text-zinc-500 hover:text-gold-500 transition-colors bg-black/50"
                  >
                    {image ? (
                      <img src={image} alt="Preview" className="h-full object-contain p-2" />
                    ) : (
                      <>
                        <Camera size={32} className="mb-2" />
                        <span className="text-xs uppercase">Click to Upload</span>
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload} 
                  />
                </div>
              </div>

              {/* Text Input */}
              <div>
                <label className="block text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  2. Describe your hair & goals
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. I have thick wavy hair and an oval face. I want something professional but low maintenance."
                  className="w-full bg-black border border-zinc-700 rounded-md p-3 text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all resize-none h-24"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={status === LoadingState.LOADING || (!image && !description)}
                  className={`flex-1 py-3 px-6 rounded-sm font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all
                    ${status === LoadingState.LOADING || (!image && !description)
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                      : 'bg-gold-500 hover:bg-gold-400 text-black shadow-lg shadow-gold-500/20'}`}
                >
                  {status === LoadingState.LOADING ? (
                    <>
                      <Loader2 className="animate-spin" size={18} /> Analyzing...
                    </>
                  ) : (
                    'Get Recommendations'
                  )}
                </button>
                {(status === LoadingState.SUCCESS || status === LoadingState.ERROR) && (
                  <button 
                    onClick={reset}
                    className="p-3 border border-zinc-700 text-zinc-400 hover:text-white hover:border-white rounded-sm transition-colors"
                  >
                    <RotateCcw size={20} />
                  </button>
                )}
              </div>
              
              {status === LoadingState.ERROR && (
                <p className="text-red-400 text-sm mt-2 text-center">Something went wrong. Please try again.</p>
              )}
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="relative">
             {status === LoadingState.SUCCESS && recommendations.length > 0 ? (
               <div className="space-y-4 animate-fade-in-up">
                 <h3 className="text-xl text-white font-serif border-b border-zinc-800 pb-2 mb-4">Your Custom Profile</h3>
                 {recommendations.map((rec, idx) => (
                   <div key={idx} className="bg-zinc-900 p-5 rounded-sm border-l-4 border-gold-500 shadow-xl">
                     <h4 className="text-gold-400 font-bold text-lg mb-1">{rec.styleName}</h4>
                     <p className="text-zinc-300 text-sm mb-3">{rec.description}</p>
                     <div className="text-xs text-zinc-500 font-mono bg-black/50 p-2 rounded inline-block">
                       Why: {rec.suitability}
                     </div>
                   </div>
                 ))}
                 <div className="mt-6 text-center">
                    <p className="text-zinc-400 text-sm mb-2">Like one of these?</p>
                    <a href="#book" className="inline-block text-gold-500 border-b border-gold-500 hover:text-white hover:border-white transition-colors uppercase text-xs font-bold tracking-widest pb-1">
                      Book this style
                    </a>
                 </div>
               </div>
             ) : (
               <div className="hidden lg:flex flex-col items-center justify-center h-full min-h-[400px] border-2 border-dashed border-zinc-800 rounded-lg bg-zinc-900/30 text-zinc-600">
                 <Sparkles size={48} className="mb-4 opacity-20" />
                 <p className="uppercase tracking-widest text-sm font-bold opacity-40">Results will appear here</p>
               </div>
             )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default StyleAdvisor;