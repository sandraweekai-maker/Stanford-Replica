import React, { useState, useEffect, useRef } from "react";
import { CoachMessage } from "../types";
import { X, Send, Sparkles, RefreshCw, Smile, Compass, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AICoachWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onSetGlobalChallenge: (challenge: string) => void;
}

export default function AICoachWidget({ isOpen, onClose, onSetGlobalChallenge }: AICoachWidgetProps) {
  const [challenge, setChallenge] = useState("");
  const [currentStage, setCurrentStage] = useState("General Coaching");
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const stagesList = [
    "General Coaching",
    "Empathize (Observe & Interview)",
    "Define (POV Statements)",
    "Ideate (Go Wild)",
    "Prototype (Build to Think)",
    "Test (Share & Iterate)"
  ];

  const suggestedChallenges = [
    "Redesign morning routines for remote parents",
    "Encourage neighborhood recycling & composting",
    "Make algebra fun for 8th graders",
    "Improve airport layover experiences"
  ];

  // Initialize with welcome message when opened
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          sender: "coach",
          text: "Welcome to the d.school! 👋 I'm your AI Design Thinking Coach.\n\nDesign is a team sport, and I'm here to help you scope challenges, brainstorm wild ideas, and design simple, low-fidelity prototypes.\n\nTo get started, tell me what creative challenge you're exploring, or select one of the ideas below!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    }
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    if (!textToSend) {
      setInputText("");
    }

    const userMsg: CoachMessage = {
      id: Math.random().toString(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          stage: currentStage,
          challenge: challenge,
        }),
      });

      const data = await response.json();
      
      const coachMsg: CoachMessage = {
        id: Math.random().toString(),
        sender: "coach",
        text: data.error ? `Error: ${data.error}` : data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, coachMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "coach",
          text: "I couldn't reach the d.school workshop server. Make sure you are in development mode with a running Node backend!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const selectSuggestedChallenge = (sugg: string) => {
    setChallenge(sugg);
    onSetGlobalChallenge(sugg);
    handleSend(`I want to work on this design challenge: "${sugg}"`);
  };

  const handleChallengeChange = (val: string) => {
    setChallenge(val);
    onSetGlobalChallenge(val);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/55 backdrop-blur-xs"
            id="coach-overlay"
          />

          {/* Sidebar Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-lg bg-ds-dark text-white h-full shadow-2xl flex flex-col z-10"
            id="coach-container"
          >
            {/* Top Bar */}
            <div className="p-6 border-b border-neutral-800 bg-black flex items-center justify-between" id="coach-top-bar">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#ff3333] flex items-center justify-center text-white font-display font-black text-xl tracking-tighter">
                  d.
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-sm tracking-wider uppercase text-white flex items-center gap-1.5">
                    <span>AI DESIGN COACH</span>
                    <Sparkles className="w-3.5 h-3.5 text-ds-lime animate-pulse" />
                  </h3>
                  <p className="font-mono text-[9px] text-neutral-400">BIAS TOWARD ACTION • PROTOTYPE TO THINK</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-900 transition-colors cursor-pointer"
                id="coach-close-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Design Challenge Config Bar */}
            <div className="p-4 bg-neutral-950 border-b border-neutral-900 space-y-3" id="coach-config-bar">
              <div className="space-y-1">
                <label className="block font-mono text-[9px] text-neutral-500 font-bold uppercase tracking-widest">
                  YOUR ACTIVE DESIGN CHALLENGE
                </label>
                <input
                  type="text"
                  placeholder="e.g. Redesign dental visits for toddlers"
                  value={challenge}
                  onChange={(e) => handleChallengeChange(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-3 py-1.5 text-xs text-white font-sans focus:outline-none focus:border-ds-red transition-colors"
                  id="coach-challenge-input"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] text-neutral-500 font-bold uppercase tracking-widest">
                  STAGE:
                </span>
                <select
                  value={currentStage}
                  onChange={(e) => setCurrentStage(e.target.value)}
                  className="bg-neutral-900 border border-neutral-800 text-xs text-ds-lime font-mono py-1 px-2 rounded-none focus:outline-none focus:border-ds-lime cursor-pointer"
                  id="coach-stage-selector"
                >
                  {stagesList.map((stg) => (
                    <option key={stg} value={stg} className="bg-neutral-950 text-white">
                      {stg.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-900/50" id="coach-messages-area">
              <AnimatePresence initial={false}>
                {messages.map((msg) => {
                  const isCoach = msg.sender === "coach";
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isCoach ? "justify-start" : "justify-end"}`}
                      id={`msg-wrap-${msg.id}`}
                    >
                      <div
                        className={`max-w-[85%] p-4 rounded-none border leading-relaxed ${
                          isCoach
                            ? "bg-neutral-900 text-white border-neutral-800 rounded-tr-lg"
                            : "bg-ds-blue text-white border-ds-blue rounded-tl-lg"
                        }`}
                        id={`msg-bubble-${msg.id}`}
                      >
                        {/* Sender handle */}
                        <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-1 mb-2 font-mono text-[9px] opacity-60">
                          <span>{isCoach ? "D.SCHOOL COACH" : "DESIGNER"}</span>
                          <span>{msg.timestamp}</span>
                        </div>

                        {/* Text */}
                        <p className="font-sans text-xs whitespace-pre-line leading-relaxed">
                          {msg.text}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Suggestions Overlay when no challenge is set and only welcome message exists */}
              {messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3 pt-4 border-t border-neutral-800"
                  id="coach-suggestions-panel"
                >
                  <span className="block font-mono text-[9px] text-neutral-500 font-bold uppercase tracking-wider">
                    TAP A POPULAR d.school SPRINT PROMPT TO TEST:
                  </span>
                  <div className="flex flex-col gap-2">
                    {suggestedChallenges.map((sugg, i) => (
                      <button
                        key={i}
                        onClick={() => selectSuggestedChallenge(sugg)}
                        className="text-left bg-neutral-950 border border-neutral-800 hover:border-ds-lime p-3 text-xs font-sans text-neutral-300 hover:text-white transition-all flex items-center justify-between group cursor-pointer"
                        id={`suggested-challenge-${i}`}
                      >
                        <span>{sugg}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-ds-lime transition-colors" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {loading && (
                <div className="flex justify-start animate-pulse" id="coach-loading-indicator">
                  <div className="bg-neutral-900 text-neutral-400 border border-neutral-800 p-4 font-mono text-[10px] flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-ds-lime" />
                    <span>COACH IS THINKING...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-4 border-t border-neutral-800 bg-black flex gap-2"
              id="coach-input-form"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask the coach... (e.g., 'How do I test my prototype?')"
                className="flex-1 bg-neutral-900 border border-neutral-800 px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-ds-red"
                id="coach-chat-input"
              />
              <button
                type="submit"
                disabled={loading || !inputText.trim()}
                className="bg-[#ff3333] hover:bg-ds-blue disabled:opacity-40 text-white p-3 transition-colors cursor-pointer"
                id="coach-send-btn"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
