import { useState, FormEvent, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Singularity } from './components/Singularity';
import { offerToVoid } from './services/void';
import { audio } from './services/audio';
import { Send } from 'lucide-react';

export default function App() {
  const [mass, setMass] = useState(1);
  const [color, setColor] = useState('#ffffff'); // Initial white as per screenshot
  const [spin, setSpin] = useState(1);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [voidMessage, setVoidMessage] = useState('THE MIRROR GASPS AT LIGHT.');
  const [flyingText, setFlyingText] = useState<string | null>(null);
  const [pulse, setPulse] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  useEffect(() => {
    // Start ambient sound on first interaction to bypass browser restrictions
    const handleFirstInteraction = () => {
      if (isAudioEnabled) {
        audio.playAmbient();
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [isAudioEnabled]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (isAudioEnabled) audio.playType();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;

    if (isAudioEnabled) audio.playWhoosh();
    const textToOffer = inputText;
    setInputText('');
    setIsProcessing(true);
    setFlyingText(textToOffer);
    setVoidMessage('The void is listening...');

    try {
      const reaction = await offerToVoid(textToOffer);

      // Wait for the "flying" animation to finish before absorbing
      setTimeout(() => {
        setMass(prev => Math.min(prev + reaction.massIncrease, 4)); // Cap mass at 4x
        setColor(reaction.auraColor);
        setSpin(prev => prev + reaction.spinChange);
        setVoidMessage(reaction.voidResponse);
        setFlyingText(null);
        setIsProcessing(false);
        setPulse(p => p + 1);
        if (isAudioEnabled) audio.playImpact();
      }, 2500);

    } catch (error) {
      console.error(error);
      setVoidMessage('The void rejected your offering.');
      setFlyingText(null);
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#030303] overflow-hidden flex flex-col items-center justify-center font-sans text-white">
      {/* The Singularity */}
      <div className="absolute inset-0 z-0">
        <Singularity mass={mass} color={color} spin={spin} isProcessing={isProcessing} pulse={pulse} />
      </div>

      {/* Flying Text Animation */}
      <AnimatePresence>
        {flyingText && (
          <motion.div
            className="absolute z-20 text-xl md:text-3xl font-light tracking-widest text-white/80 pointer-events-none text-center px-4 max-w-2xl flex flex-wrap justify-center"
          >
            {flyingText.split('').map((char, index) => (
              <motion.span
                key={`${flyingText}-${index}`}
                initial={{ opacity: 1, scale: 1, y: 250, x: 0 }}
                animate={{ 
                  opacity: 0, 
                  scale: 0, 
                  y: 0,
                  x: (Math.random() - 0.5) * 100 // Random horizontal jitter for "sucking" effect
                }}
                transition={{ 
                  duration: 1.2, 
                  delay: index * 0.02, // Staggered delay for "one by one" effect
                  ease: "anticipate" 
                }}
                className="inline-block"
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* UI Overlay */}
      <div className="absolute bottom-0 w-full p-8 z-30 flex flex-col items-center gap-8 bg-gradient-to-t from-black via-black/80 to-transparent">
        <motion.div 
          className="border border-white/20 px-12 py-6 backdrop-blur-sm"
          animate={{ borderColor: isProcessing ? color : `${color}40` }}
          transition={{ duration: 1 }}
        >
          <motion.p
            key={voidMessage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs md:text-sm uppercase tracking-[0.3em] text-white/50 font-mono text-center"
          >
            {voidMessage}
          </motion.p>
        </motion.div>

        <form onSubmit={handleSubmit} className="w-full max-w-xl relative group">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            disabled={isProcessing}
            placeholder="Type a memory, a secret, a fear..."
            className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all backdrop-blur-md disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isProcessing || !inputText.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all disabled:opacity-0 disabled:scale-90"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
