import { useState, FormEvent } from "react";
import { X, CheckCircle2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulate API registration
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setEmail("");
    setIsSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            id="newsletter-overlay"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg bg-ds-dark text-white p-8 rounded-none border-t-8 border-ds-red shadow-2xl z-10 overflow-hidden"
            id="newsletter-container"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              id="newsletter-close-btn"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Content states */}
            {!isSubmitted ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="font-mono text-xs text-ds-lime tracking-widest uppercase">UPDATES FROM THE D.SCHOOL</span>
                  <h3 className="font-serif font-bold text-3xl sm:text-4xl text-white tracking-tight leading-tight">
                    Want to learn more & get involved?
                  </h3>
                  <p className="font-sans text-sm text-gray-300">
                    Subscribe to our email newsletter for (kinda) regular updates, free design templates, and event invites.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="your.email@stanford.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-neutral-900 border-2 border-neutral-700 text-white font-sans text-sm px-4 py-3 focus:outline-none focus:border-ds-red transition-colors placeholder-neutral-500 rounded-none"
                      id="newsletter-email-input"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-white hover:bg-ds-lime text-black font-display font-bold text-sm tracking-wider py-3.5 px-6 transition-all duration-300 rounded-none cursor-pointer"
                    id="newsletter-submit-btn"
                  >
                    <span>{loading ? "SUBSCRIBING..." : "SUBSCRIBE NOW"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <p className="font-mono text-[10px] text-neutral-500 text-center">
                  By subscribing, you agree to our privacy policy and creative terms. You can unsubscribe anytime.
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
                id="newsletter-success-panel"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-ds-lime/20 rounded-full mb-2">
                  <CheckCircle2 className="w-10 h-10 text-ds-lime" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-white">You're on the list!</h3>
                <p className="font-sans text-sm text-gray-300 max-w-sm mx-auto">
                  We've sent a welcome d.school greeting to <strong className="text-ds-mint">{email}</strong>. Look out for our (kinda) regular updates!
                </p>
                <button
                  onClick={handleReset}
                  className="mt-6 border-2 border-neutral-700 hover:border-white text-gray-300 hover:text-white font-display font-bold text-xs tracking-widest px-6 py-2.5 rounded-none transition-colors"
                  id="newsletter-success-close-btn"
                >
                  CLOSE WINDOW
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
