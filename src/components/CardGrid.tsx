import { CardItem } from "../types";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

interface CardGridProps {
  cards: CardItem[];
  onSelectCard: (card: CardItem) => void;
}

export default function CardGrid({ cards, onSelectCard }: CardGridProps) {
  // Animation variants for card entry
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-8 max-w-7xl mx-auto py-8"
      id="card-grid"
    >
      {cards.map((card) => {
        const isImageCard = card.type === "image";
        const isLinkCard = card.type === "link";

        return (
          <motion.div
            key={card.id}
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.2 } }}
            onClick={() => onSelectCard(card)}
            className={`relative min-h-[340px] flex flex-col justify-between overflow-hidden cursor-pointer shadow-xs transition-shadow duration-300 hover:shadow-md ${card.bgColor} ${card.textColor} rounded-none`}
            id={`card-${card.id}`}
          >
            {isImageCard ? (
              /* Image Card Layout */
              <div className="absolute inset-0 w-full h-full group" id={`card-img-container-${card.id}`}>
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 flex flex-col justify-end p-6">
                  {card.label && (
                    <span className="font-mono text-[10px] tracking-widest text-ds-lime font-bold mb-2 uppercase">
                      {card.label}
                    </span>
                  )}
                  <h3 className="font-display font-bold text-xl leading-tight text-white tracking-tight">
                    {card.title}
                  </h3>
                  {card.description && (
                    <p className="font-sans text-xs text-neutral-300 mt-2 line-clamp-2">
                      {card.description}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* Standard Card Layout */
              <div className="flex h-full w-full" id={`card-layout-${card.id}`}>
                {/* Side Rotated Label */}
                <div 
                  className="w-12 flex-shrink-0 flex items-center justify-center border-r border-black/5 font-mono text-[9px] tracking-[0.25em] select-none font-bold text-neutral-500 uppercase h-full py-4"
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                  id={`card-label-${card.id}`}
                >
                  {card.label}
                </div>

                {/* Card Content Area */}
                <div className="flex-1 p-6 flex flex-col justify-between" id={`card-inner-${card.id}`}>
                  {/* Top Text */}
                  <div className="space-y-3">
                    <h3 className="font-display font-extrabold text-xl leading-snug tracking-tight">
                      {card.title}
                    </h3>
                    
                    {card.description && (
                      <p className="font-sans text-xs leading-relaxed opacity-90 line-clamp-4">
                        {card.description}
                      </p>
                    )}

                    {card.details && (
                      <div className="font-mono text-[10px] tracking-wider leading-relaxed pt-2 space-y-1 opacity-80">
                        {card.details.split(" • ").map((detail, idx) => (
                          <div key={idx}>{detail}</div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Area (Badge or Action Indicator) */}
                  <div className="flex items-center justify-between mt-4">
                    {card.badge && (
                      <span className="inline-block font-mono text-[10px] font-bold tracking-widest px-2.5 py-1 border border-black/15 bg-white/10 text-black rounded-none uppercase">
                        {card.badge}
                      </span>
                    )}

                    {/* Arrow Button for specific cards */}
                    {(isLinkCard || card.id === "professional-education-link") && (
                      <div className="ml-auto w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xs text-black hover:scale-105 transition-transform" id={`card-arrow-${card.id}`}>
                        <ArrowUpRight className="w-5 h-5 text-neutral-800" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
