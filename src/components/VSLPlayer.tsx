import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Tv, 
  Bookmark, 
  Clock, 
  Compass, 
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function VSLPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<"video" | "outline">("video");
  const [copiedText, setCopiedText] = useState(false);

  // Source URL requested by the user
  const videoSrc = "https://assets.cdn.filesafe.space/nH6RXhbM4DOAIJBM547k/media/6a22b446f607d4002b8f41e2.mp4";

  // Watch video play/pause changes inside DOM
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(err => console.log("Video play interrupted:", err));
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 0;
    setCurrentTime(current);
    setProgress(dur > 0 ? (current / dur) * 100 : 0);
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current || !duration) return;
    const newProgress = Number(e.target.value);
    const newTime = (newProgress / 100) * duration;
    videoRef.current.currentTime = newTime;
    setProgress(newProgress);
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const muted = !isMuted;
    videoRef.current.muted = muted;
    setIsMuted(muted);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://ace-cpas.com/vsl-presentation");
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Format time strictly to MM:SS
  const formatTime = (timeInSecs: number) => {
    if (isNaN(timeInSecs) || !isFinite(timeInSecs)) return "00:00";
    const mins = Math.floor(timeInSecs / 60);
    const secs = Math.floor(timeInSecs % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Highlight transcripts matched over video progress intervals
  const transcriptData = [
    { start: 0, end: 12, text: "Welcome to Ace CPAs' Transaction Intelligence Room. In this session, we will walk through our core capital protection parameters." },
    { start: 12, end: 28, text: "Close to ninety percent of middle-market business acquisitions suffer from unverified seller add-backs and EBITDA anomalies." },
    { start: 28, end: 45, text: "We cross-examine transaction ledgers, monthly income statements, and cash controls to discover your true acquisition margins." },
    { start: 45, end: 68, text: "By isolating non-operating expenses, owner capitalizations, and supply chain windfalls, you construct watertight LOI buffers." },
    { start: 68, end: 9999, text: "Our certified Quality of Earnings (QofE) report packages are trusted by SBA lending institutions, buyers, and capital sponsors alike." }
  ];

  const currentTranscript = transcriptData.find(
    (t) => currentTime >= t.start && currentTime < t.end
  ) || transcriptData[0];

  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full">
      
      {/* Top Header tab bar for information */}
      <div className="bg-slate-950 border-b border-white/10 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <span className="flex h-2.5 w-2.5 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPlaying ? 'bg-emerald-400' : 'bg-ace-orange'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isPlaying ? 'bg-emerald-500' : 'bg-ace-orange'}`}></span>
          </span>
          <span className="text-[11px] font-mono font-bold tracking-wider text-slate-300 uppercase">
            {isPlaying ? "LIVE PRESENTATION STATUS: PLAYING" : "CASE STUDY: REVENUE & EBITDA DUE DILIGENCE"}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button 
            type="button"
            onClick={() => setActiveTab("video")} 
            className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition ${activeTab === "video" ? "bg-white/10 text-ace-orange" : "text-slate-400 hover:text-white"}`}
          >
            Video Player
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab("outline")} 
            className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition ${activeTab === "outline" ? "bg-white/10 text-ace-orange" : "text-slate-400 hover:text-white"}`}
          >
            Syllabus Outline
          </button>
        </div>
      </div>

      <div className="relative flex-1 bg-slate-950 flex flex-col justify-between overflow-hidden min-h-[350px]">
        {activeTab === "video" ? (
          <>
            {/* Main Video Presentation Stream Screen */}
            <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden group">
              <video
                ref={videoRef}
                src={videoSrc}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleVideoEnded}
                onClick={handlePlayPause}
                className="w-full h-full object-contain cursor-pointer aspect-video"
                playsInline
                referrerPolicy="no-referrer"
              />

              {/* Pulsing Watch Case study video cover when paused */}
              <AnimatePresence>
                {!isPlaying && (
                  <motion.div 
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handlePlayPause}
                    className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center text-center p-6 cursor-pointer backdrop-blur-[1px]"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-ace-orange/30 animate-ping"></div>
                      <div className="w-16 h-16 rounded-full bg-ace-orange flex items-center justify-center text-white border-4 border-white/5 hover:scale-105 transition-all shadow-xl relative z-10">
                        <Play className="w-7 h-7 text-white fill-current translate-x-0.5" />
                      </div>
                    </div>

                    <h4 className="font-display font-extrabold text-white text-base md:text-lg tracking-tight mt-5 max-w-sm">
                      Take our 6-Step EBITDA Protection Audit Walkthrough
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-1 max-w-xs leading-normal">
                      Click to unlock the real presentation for premium client integration.
                    </p>
                    
                    <div className="mt-4 inline-flex items-center space-x-1 bg-white/10 border border-white/10 px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-widest text-white">
                      <Clock className="w-3 h-3 text-ace-orange" />
                      <span>{duration > 0 ? formatTime(duration) : "4:15"} M&amp;A Presentation</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Simulated Live Captions bar synced with real video timeline */}
            <div className="bg-slate-950 px-5 py-3 border-t border-white/5 text-center flex items-center justify-center min-h-[54px]">
              <p className="text-[11px] text-slate-200 italic max-w-xl transition-all duration-300 leading-normal font-sans">
                &ldquo; {currentTranscript.text} &rdquo;
              </p>
            </div>

            {/* Video Player Controls bar */}
            <div className="bg-slate-950 border-t border-white/10 p-3.5 space-y-2">
              
              {/* Progress Slider */}
              <div className="flex items-center space-x-3">
                <span className="text-[10px] font-mono text-slate-400">
                  {formatTime(currentTime)}
                </span>
                
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="0.1"
                  value={progress}
                  onChange={handleSeek}
                  className="flex-1 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-ace-orange active:accent-dark-orange-hover"
                />

                <span className="text-[10px] font-mono text-slate-400">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Play buttons, volume controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button 
                    type="button"
                    onClick={handlePlayPause}
                    className="p-1 rounded text-slate-300 hover:text-white transition cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 text-ace-orange" /> : <Play className="w-4 h-4 text-white" />}
                  </button>

                  <button 
                    type="button"
                    onClick={toggleMute}
                    className="p-1 rounded text-slate-300 hover:text-white transition cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-slate-300" />}
                  </button>

                  <div className="hidden sm:flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <div 
                        key={v} 
                        className={`w-1 h-3 rounded-full ${isMuted ? 'bg-slate-800' : v <= 4 ? 'bg-ace-orange' : 'bg-slate-600'}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-[10px] text-slate-400 font-mono">
                  <span className="flex items-center space-x-1">
                    <Bookmark className="w-3.5 h-3.5 text-ace-orange fill-current" />
                    <span>SBA LENDER-READY</span>
                  </span>
                  
                  <span className="text-slate-600">|</span>

                  <button 
                    type="button"
                    className="text-slate-400 hover:text-white cursor-pointer" 
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.currentTime = 0;
                        setProgress(0);
                        setCurrentTime(0);
                      }
                    }}
                  >
                    Reset Video
                  </button>
                </div>
              </div>

            </div>
          </>
        ) : (
          <div className="flex-1 p-6 space-y-5 text-left text-slate-300 select-none overflow-y-auto max-h-[380px]">
            <h4 className="font-display font-extrabold text-sm text-white uppercase tracking-wider text-ace-orange flex items-center space-x-2">
              <Compass className="w-4 h-4" />
              <span>Diligence Video Master Course Agenda</span>
            </h4>
            
            <p className="text-xs text-slate-305 leading-relaxed">
              Below is the structural outline covered by our Lead Advisor in the Video Presentation. Confirm these checklist modules are active for your deal target.
            </p>

            <div className="space-y-3 pt-1">
              {[
                { time: "0:00 - 1:12", title: "Introduction & Scope Definition", text: "Establishing baseline deal objectives and setting the framework of transactional diligence reviews." },
                { time: "1:12 - 2:30", title: "General Ledger Deep Analysis", text: "Cross examination of double-entry journals to flag anomalies, windfalls, and owner add-back adjustments." },
                { time: "2:30 - 3:45", title: "Proof of Cash Validation", text: "Detailed description of raw cash-ledger audits utilizing primary financial feeds bypassing PDF logs." },
                { time: "3:45 - 4:15", title: "Final Certification Delivery", text: "How premium reports with multi-faceted net working capital thresholds facilitate frictionless closing parameters." }
              ].map((agenda, stepIdx) => (
                <div key={stepIdx} className="bg-slate-900 border border-white/5 rounded-lg p-3 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold text-ace-orange uppercase">{agenda.time}</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#EE5935]/15 text-ace-orange font-bold">MODULE {stepIdx + 1}</span>
                  </div>
                  <h5 className="font-bold text-xs text-white leading-normal">{agenda.title}</h5>
                  <p className="text-[10.5px] text-slate-400 leading-normal mt-1">{agenda.text}</p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button 
                type="button"
                onClick={handleCopyLink}
                className="w-full py-2 bg-white/5 hover:bg-white/10 text-xs font-semibold rounded border border-white/10 text-white transition text-center cursor-pointer"
              >
                {copiedText ? "Link copied to clipboard!" : "Share Presentation Access Link"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Trust warning sub footer inside the video */}
      <div className="bg-slate-950 border-t border-white/10 px-4 py-3 flex items-center justify-between text-[10px] text-slate-400">
        <span className="flex items-center space-x-1">
          <Info className="w-3 h-3 text-ace-orange" />
          <span>Interactive premium player environment.</span>
        </span>
        <span className="font-mono text-white">ACE Advisory Room #4</span>
      </div>

    </div>
  );
}
