import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CardGrid from "./components/CardGrid";
import CardDetailDrawer from "./components/CardDetailDrawer";
import AICoachWidget from "./components/AICoachWidget";
import NewsletterModal from "./components/NewsletterModal";
import { CARD_ITEMS } from "./data";
import { CardItem } from "./types";
import { ChevronDown, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("Everything");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);
  const [coachOpen, setCoachOpen] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [globalChallenge, setGlobalChallenge] = useState("");
  
  // Dropdown status
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  // Categories list
  const categories = [
    "Everything",
    "Educators",
    "Professionals",
    "Social Impact",
    "Alumni",
    "Futures",
    "Design Thinking",
    "AI"
  ];

  // Filtering cards
  const filteredCards = CARD_ITEMS.filter((card) => {
    // Filter by Category
    const categoryMatch =
      selectedCategory === "Everything" ||
      card.category.toLowerCase() === selectedCategory.toLowerCase();

    // Filter by Search term
    const searchMatch =
      !searchTerm ||
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (card.description && card.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      card.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.label.toLowerCase().includes(searchTerm.toLowerCase());

    return categoryMatch && searchMatch;
  });

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setCategoryDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans flex flex-col justify-between overflow-x-hidden relative" id="app-root">
      {/* Header */}
      <Header
        onSearch={setSearchTerm}
        onOpenCoach={() => setCoachOpen(true)}
        onSelectCategory={handleSelectCategory}
      />

      {/* Main Content */}
      <main className="flex-1 pb-20">
        
        {/* Dynamic Design Challenge Banner (if user sets a challenge via the Coach) */}
        <AnimatePresence>
          {globalChallenge && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-ds-lime text-black border-b border-black/10 py-3 px-4 sm:px-8 text-center"
              id="active-challenge-banner"
            >
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-sm font-sans">
                <Sparkles className="w-4 h-4 text-ds-red animate-pulse shrink-0" />
                <span>
                  Active Design Challenge: <strong>"{globalChallenge}"</strong>
                </span>
                <button
                  onClick={() => setCoachOpen(true)}
                  className="font-mono text-xs font-bold underline hover:text-ds-blue ml-2"
                  id="banner-coach-btn"
                >
                  GET COACHING
                </button>
                <button
                  onClick={() => setGlobalChallenge("")}
                  className="text-xs text-neutral-600 hover:text-black hover:scale-105 transition-transform ml-4 font-bold"
                  id="banner-clear-btn"
                >
                  [CLEAR]
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Category Filter Selector Section */}
        <section className="py-16 sm:py-24 px-4 text-center space-y-6" id="hero-selector-section">
          <div className="space-y-4 max-w-3xl mx-auto">
            <span className="font-serif italic text-lg sm:text-xl text-neutral-600 tracking-tight block">
              I'm curious about...
            </span>

            {/* Giant Dynamic Category Selector dropdown trigger */}
            <div className="relative inline-block" id="category-selector-wrapper">
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="group flex items-center justify-center gap-3 font-display font-black text-4xl sm:text-6xl md:text-7xl italic text-ds-red tracking-tight leading-none pb-2 cursor-pointer relative select-none"
                id="category-dropdown-btn"
              >
                <ChevronDown className="w-10 h-10 sm:w-14 sm:h-14 text-ds-red shrink-0 transition-transform duration-300 group-hover:translate-y-1" />
                <span className="relative">
                  {selectedCategory}
                  {/* Thick red underline typical of d.school style */}
                  <span className="absolute left-0 right-0 -bottom-3 sm:-bottom-4 h-2 bg-ds-red"></span>
                </span>
              </button>

              {/* Stylish category dropdown overlay */}
              <AnimatePresence>
                {categoryDropdownOpen && (
                  <>
                    {/* Click-out overlay */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setCategoryDropdownOpen(false)}
                      id="dropdown-clickout-overlay"
                    />

                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ type: "spring", damping: 20, stiffness: 250 }}
                      className="absolute left-1/2 -translate-x-1/2 mt-6 z-20 bg-black text-white w-72 max-w-sm py-4 border-2 border-neutral-800 shadow-2xl rounded-none grid grid-cols-1 gap-1"
                      id="category-dropdown-menu"
                    >
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => handleSelectCategory(cat)}
                          className={`w-full text-center px-6 py-3 font-display font-bold text-sm tracking-widest uppercase transition-colors hover:bg-neutral-900 ${
                            selectedCategory === cat
                              ? "text-ds-lime bg-neutral-950 border-l-4 border-ds-red"
                              : "text-gray-300 hover:text-white"
                          }`}
                          id={`dropdown-opt-${cat.toLowerCase().replace(" ", "-")}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Card Grid Area */}
        {filteredCards.length > 0 ? (
          <CardGrid
            cards={filteredCards}
            onSelectCard={setSelectedCard}
          />
        ) : (
          <div className="py-20 text-center space-y-4 px-4" id="empty-cards-view">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
              <AlertCircle className="w-6 h-6 text-neutral-400" />
            </div>
            <h4 className="font-display font-bold text-lg text-black">No matching d.school cards found</h4>
            <p className="font-sans text-xs text-neutral-500 max-w-sm mx-auto">
              Try resetting your search query or selecting another dynamic curiosity category above.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("Everything");
              }}
              className="font-mono text-xs font-bold border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-colors cursor-pointer"
              id="reset-grid-btn"
            >
              RESET ALL FILTERS
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenNewsletter={() => setNewsletterOpen(true)}
        onSelectCategory={handleSelectCategory}
      />

      {/* Card Details Slide-out Drawer */}
      <CardDetailDrawer
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
        challengeText={globalChallenge}
      />

      {/* AI Design Coach Slide-out Widget */}
      <AICoachWidget
        isOpen={coachOpen}
        onClose={() => setCoachOpen(false)}
        onSetGlobalChallenge={setGlobalChallenge}
      />

      {/* Newsletter Subscription Modal */}
      <NewsletterModal
        isOpen={newsletterOpen}
        onClose={() => setNewsletterOpen(false)}
      />
    </div>
  );
}
