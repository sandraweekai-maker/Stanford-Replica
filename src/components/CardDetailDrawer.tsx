import React, { useState } from "react";
import { CardItem } from "../types";
import { X, Play, Clock, Sparkles, Send, RefreshCw, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CardDetailDrawerProps {
  card: CardItem | null;
  onClose: () => void;
  challengeText?: string;
}

export default function CardDetailDrawer({ card, onClose, challengeText = "" }: CardDetailDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [activityOutput, setActivityOutput] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [userSubmission, setUserSubmission] = useState("");
  const [feedbackOutput, setFeedbackOutput] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  // Creative booster states
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [timerActive, setTimerActive] = useState(false);
  const [timerIntervalId, setTimerIntervalId] = useState<any>(null);

  if (!card) return null;

  // Initialize options based on tool
  const getOptionsForTool = () => {
    if (card.id === "secret-handshake") {
      return ["silly", "futuristic", "secret-agent", "heavy-metal", "intellectual"];
    }
    if (card.id === "portrait-descendant") {
      return ["50 years", "100 years", "250 years", "1000 years"];
    }
    if (card.id === "ai-easy-button") {
      return ["Education", "Healthcare", "Transportation", "Dating & Romance", "E-Commerce"];
    }
    return [];
  };

  const handleGenerateActivity = async () => {
    setLoading(true);
    setActivityOutput("");
    setFeedbackOutput("");
    setUserSubmission("");
    try {
      const optionVal = selectedOption || getOptionsForTool()[0] || "";
      const payload: any = { toolName: "", options: {} };

      if (card.id === "secret-handshake") {
        payload.toolName = "Secret Handshake";
        payload.options.vibe = optionVal;
      } else if (card.id === "portrait-descendant") {
        payload.toolName = "Portrait of a Descendant";
        payload.options.year = optionVal;
      } else if (card.id === "ai-easy-button") {
        payload.toolName = "AI Easy Button";
        payload.options.industry = optionVal;
      }

      const res = await fetch("/api/generate-activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.error) {
        setActivityOutput(`Error: ${data.error}`);
      } else {
        setActivityOutput(data.text);
      }
    } catch (err: any) {
      setActivityOutput(`Failed to fetch custom workspace activity. Make sure the server is fully running.`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitUserWork = async () => {
    if (!userSubmission.trim()) return;
    setFeedbackLoading(true);
    setFeedbackOutput("");
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Here is my work or answer to the challenge: "${userSubmission}". Please give me d.school coaching, advice, and a wild encouragement based on this.`,
          stage: card.title,
          challenge: challengeText || "d.school Learning Exploration",
        }),
      });
      const data = await res.json();
      if (data.error) {
        setFeedbackOutput(`Error: ${data.error}`);
      } else {
        setFeedbackOutput(data.text);
      }
    } catch (err: any) {
      setFeedbackOutput("Failed to connect to the d.school AI Coach.");
    } finally {
      setFeedbackLoading(false);
    }
  };

  const startTimer = () => {
    if (timerActive) {
      clearInterval(timerIntervalId);
      setTimerActive(false);
    } else {
      setTimerActive(true);
      const id = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(id);
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerIntervalId(id);
    }
  };

  const resetTimer = () => {
    if (timerIntervalId) clearInterval(timerIntervalId);
    setTimerActive(false);
    setTimerSeconds(300);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const options = getOptionsForTool();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          id="drawer-overlay"
        />

        {/* Slide-out drawer content */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto"
          id="drawer-container"
        >
          {/* Header */}
          <div className={`p-6 sm:p-8 ${card.bgColor} ${card.textColor} relative border-b border-black/10`} id="drawer-header">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/10 transition-colors cursor-pointer"
              id="drawer-close-btn"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="font-mono text-xs font-bold tracking-widest uppercase opacity-75">
              {card.label} {card.badge ? `• ${card.badge}` : ""}
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl tracking-tight leading-tight mt-2 max-w-lg">
              {card.title}
            </h2>
            {card.details && (
              <p className="font-mono text-xs mt-3 tracking-wide opacity-90">{card.details}</p>
            )}
          </div>

          {/* Body Content */}
          <div className="flex-1 p-6 sm:p-8 space-y-8" id="drawer-body">
            {/* Description */}
            <div className="prose prose-sm font-sans text-neutral-800 leading-relaxed space-y-4" id="drawer-description">
              {card.description && (
                <p className="font-medium text-base text-neutral-900 border-l-4 border-ds-red pl-4">
                  {card.description}
                </p>
              )}
              {card.fullContent ? (
                <div className="space-y-4 pt-2">
                  {card.fullContent.split("\n\n").map((para, i) => {
                    if (para.startsWith("###")) {
                      return (
                        <h4 key={i} className="font-display font-bold text-lg text-black mt-6">
                          {para.replace("###", "").trim()}
                        </h4>
                      );
                    }
                    if (para.startsWith("*") || para.startsWith("-")) {
                      return (
                        <ul key={i} className="list-disc pl-5 space-y-2">
                          {para.split("\n").map((li, liIdx) => (
                            <li key={liIdx}>{li.replace(/^[\s*-]+/, "").trim()}</li>
                          ))}
                        </ul>
                      );
                    }
                    return <p key={i}>{para}</p>;
                  })}
                </div>
              ) : (
                <p>Learn more and start taking action on campus or online.</p>
              )}
            </div>

            {/* INTERACTIVE WORKSPACE SECTION */}
            <div className="border-t-2 border-dashed border-gray-200 pt-8" id="drawer-workspace-section">
              <div className="bg-ds-gray p-6 rounded-none space-y-6 border border-gray-200">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-ds-red" />
                  <h3 className="font-display font-black text-lg text-black uppercase tracking-wide">
                    d.school Sandbox Workspace
                  </h3>
                </div>

                {options.length > 0 ? (
                  /* AI Powered Activity Generators */
                  <div className="space-y-4">
                    <p className="font-sans text-xs text-neutral-600">
                      Co-create a personalized d.school design experiment with our AI. Select a parameter to begin:
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xs font-bold text-neutral-500 uppercase">
                        {card.id === "secret-handshake" ? "Vibe:" : card.id === "portrait-descendant" ? "Timeframe:" : "Industry:"}
                      </span>
                      {options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setSelectedOption(opt)}
                          className={`font-mono text-xs px-3 py-1.5 border transition-all ${
                            (selectedOption || options[0]) === opt
                              ? "bg-black text-white border-black"
                              : "bg-white text-black border-neutral-300 hover:border-black"
                          }`}
                        >
                          {opt.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleGenerateActivity}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 bg-ds-red hover:bg-black text-white font-display font-bold text-xs tracking-widest px-5 py-3 transition-colors cursor-pointer w-full"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>COLLABORATING WITH COACH...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-ds-lime" />
                          <span>GENERATE CUSTOM WORKSPACE ACTIVITY</span>
                        </>
                      )}
                    </button>

                    {activityOutput && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border-2 border-black p-5 font-sans text-sm space-y-4 relative shadow-sm"
                      >
                        <div className="absolute top-2 right-2 bg-ds-lime text-black font-mono text-[9px] px-1.5 py-0.5 font-bold">
                          AI ACTIVE
                        </div>
                        <div className="prose prose-sm text-neutral-800 whitespace-pre-line leading-relaxed">
                          {activityOutput}
                        </div>

                        {/* Interactive response input for the activity */}
                        <div className="border-t border-gray-100 pt-4 space-y-3">
                          <label className="block font-mono text-[10px] font-bold text-neutral-500 uppercase">
                            Your Speculative Answer / Reflection:
                          </label>
                          <textarea
                            value={userSubmission}
                            onChange={(e) => setUserSubmission(e.target.value)}
                            placeholder="Type your d.school sketch, idea description, or reflection here..."
                            rows={3}
                            className="w-full bg-neutral-50 border border-neutral-300 font-sans text-xs p-3 focus:outline-none focus:border-black"
                          />
                          <button
                            onClick={handleSubmitUserWork}
                            disabled={feedbackLoading || !userSubmission.trim()}
                            className="flex items-center justify-center gap-1.5 bg-black hover:bg-ds-blue text-white font-mono text-[10px] font-bold tracking-widest px-4 py-2 transition-all cursor-pointer disabled:opacity-50"
                          >
                            {feedbackLoading ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Send className="w-3.5 h-3.5" />
                            )}
                            <span>SUBMIT ENTRY FOR COACH FEEDBACK</span>
                          </button>
                        </div>

                        {feedbackOutput && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-ds-lime/10 border-l-4 border-ds-lime p-4 mt-3 space-y-2"
                          >
                            <span className="font-display font-black text-xs text-black block tracking-wider uppercase">
                              COACH FEEDBACK:
                            </span>
                            <p className="font-sans text-xs text-neutral-800 leading-relaxed italic whitespace-pre-line">
                              {feedbackOutput}
                            </p>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </div>
                ) : (
                  /* Standard Sprint Timer Workspace */
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 border border-gray-200">
                      <div className="flex items-center gap-3">
                        <Clock className="w-8 h-8 text-ds-blue" />
                        <div>
                          <span className="font-mono text-[10px] font-bold text-neutral-400 block uppercase">
                            d.school SPRINT TIMER
                          </span>
                          <span className="font-display font-black text-2xl text-black">
                            {formatTime(timerSeconds)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={startTimer}
                          className="bg-black hover:bg-ds-blue text-white font-mono text-xs font-bold px-4 py-2 transition-colors cursor-pointer"
                        >
                          {timerActive ? "PAUSE" : "START SPRINT"}
                        </button>
                        <button
                          onClick={resetTimer}
                          className="bg-gray-200 hover:bg-gray-300 text-black font-mono text-xs font-bold px-3 py-2 transition-colors cursor-pointer"
                        >
                          RESET
                        </button>
                      </div>
                    </div>

                    <p className="font-sans text-xs text-neutral-600 italic">
                      Use this timer to scope a rapid 5-minute ideation session! Challenge yourself to draw or write at least 5 different solutions on paper before the clock runs down.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
