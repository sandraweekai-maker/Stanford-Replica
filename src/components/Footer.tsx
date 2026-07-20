import { motion } from "motion/react";

interface FooterProps {
  onOpenNewsletter: () => void;
  onSelectCategory: (category: string) => void;
}

export default function Footer({ onOpenNewsletter, onSelectCategory }: FooterProps) {
  return (
    <footer className="bg-black text-white py-16 px-4 sm:px-8 border-t border-neutral-800" id="ds-footer">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* About d.school Column */}
          <div className="space-y-4 lg:col-span-1" id="footer-col-about">
            <h4 className="font-serif font-bold text-2xl tracking-tight text-white leading-tight">
              About the d.school
            </h4>
            <p className="font-sans text-sm text-neutral-400 leading-relaxed">
              We are a creative place at Stanford where people discover & build new possibilities.
            </p>
          </div>

          {/* D.SCHOOL INFO Column */}
          <div className="space-y-4" id="footer-col-info">
            <h5 className="font-display font-bold text-xs tracking-widest text-neutral-500 uppercase">
              D.SCHOOL INFO
            </h5>
            <ul className="space-y-2.5 font-sans text-sm text-neutral-300">
              <li>
                <button 
                  onClick={() => onSelectCategory("Everything")}
                  className="hover:text-ds-blue transition-colors text-left"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory("Design Thinking")}
                  className="hover:text-ds-blue transition-colors text-left"
                >
                  Our Space
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory("Alumni")}
                  className="hover:text-ds-blue transition-colors text-left"
                >
                  Stories
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory("Everything")}
                  className="hover:text-ds-blue transition-colors text-left"
                >
                  News
                </button>
              </li>
            </ul>
          </div>

          {/* STUDY Column */}
          <div className="space-y-4" id="footer-col-study">
            <h5 className="font-display font-bold text-xs tracking-widest text-neutral-500 uppercase">
              STUDY
            </h5>
            <ul className="space-y-2.5 font-sans text-sm text-neutral-300">
              <li>
                <button 
                  onClick={() => onSelectCategory("Educators")}
                  className="hover:text-ds-blue transition-colors text-left"
                >
                  Undergraduate Degree
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory("Alumni")}
                  className="hover:text-ds-blue transition-colors text-left"
                >
                  Graduate Degree
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory("Professionals")}
                  className="hover:text-ds-blue transition-colors text-left"
                >
                  University-Wide Electives
                </button>
              </li>
            </ul>
          </div>

          {/* INNOVATE Column */}
          <div className="space-y-4" id="footer-col-innovate">
            <h5 className="font-display font-bold text-xs tracking-widest text-neutral-500 uppercase">
              INNOVATE
            </h5>
            <ul className="space-y-2.5 font-sans text-sm text-neutral-300">
              <li>
                <button 
                  onClick={() => onSelectCategory("Professionals")}
                  className="hover:text-ds-blue transition-colors text-left"
                >
                  Professional Education
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory("Design Thinking")}
                  className="hover:text-ds-blue transition-colors text-left"
                >
                  Shop
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory("Futures")}
                  className="hover:text-ds-blue transition-colors text-left"
                >
                  Tools
                </button>
              </li>
            </ul>
          </div>

          {/* Updates Block (Red Card) */}
          <div className="lg:col-span-1 bg-[#ff3333] text-white p-6 rounded-none space-y-4" id="footer-red-card">
            <span className="font-display font-bold text-[10px] tracking-wider uppercase text-neutral-100">
              UPDATES FROM THE D.SCHOOL
            </span>
            <h5 className="font-serif font-bold text-lg leading-snug">
              Want to learn more & get involved?
            </h5>
            <p className="font-sans text-xs text-neutral-100 leading-relaxed">
              Subscribe to our email newsletter for (kinda) regular updates.
            </p>
            <button
              onClick={onOpenNewsletter}
              className="w-full bg-white hover:bg-black hover:text-white text-black font-display font-bold text-xs tracking-widest py-3 px-4 transition-all duration-300 rounded-full flex items-center justify-center cursor-pointer"
              id="footer-newsletter-btn"
            >
              Get the latest
            </button>
          </div>
        </div>

        {/* Bottom Socials & Engineering */}
        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo stamp */}
          <div className="flex items-center space-x-4" id="footer-logo-stamp">
            <span className="font-display font-black text-3xl tracking-tighter text-white">d.</span>
            <span className="font-display font-bold text-xs tracking-widest text-neutral-400">
              STANFORD ENGINEERING
            </span>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap justify-center gap-6 font-display font-bold text-xs tracking-wider text-neutral-400" id="footer-social-links">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LINKEDIN</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">INSTAGRAM</a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">X</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">FACEBOOK</a>
            <a href="https://medium.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">MEDIUM</a>
          </div>
        </div>

        {/* Legal Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[10px] text-neutral-500">
          <p>© 2026 Hasso Plattner Institute of Design at Stanford University. All Rights Reserved.</p>
          <a href="#" className="hover:text-neutral-300 transition-colors">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
