import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Sparkles, Moon, User, Check, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import './personality-selector.css';

interface PersonalitySelectorProps {
  selectedAvatar: string | null;
  onAvatarSelect: (avatarId: string) => void;
  onConfirm: () => void;
}

const PersonalitySelector = ({ selectedAvatar, onAvatarSelect, onConfirm }: PersonalitySelectorProps) => {
  const [showTypewriter, setShowTypewriter] = useState<string | null>(null);

  const avatars = [
    {
      id: 'luna',
      name: 'Luna',
      personality: 'Playful & Energetic',
      description: 'Your bubbly companion who makes studying fun and exciting',
      traits: ['Enthusiastic', 'Creative', 'Adventurous', 'Inspiring'],
      color: 'purple',
      icon: Sparkles,
      gradient: 'from-purple-400 to-purple-600',
      bgGradient: 'from-purple-100 to-purple-200',
      quote: "Let's turn your study session into an amazing adventure! ✨"
    },
    {
      id: 'aria',
      name: 'Aria',
      personality: 'Calm & Wise',
      description: 'Your serene companion who brings peace and wisdom to learning',
      traits: ['Thoughtful', 'Peaceful', 'Wise', 'Balanced'],
      color: 'indigo',
      icon: Moon,
      gradient: 'from-indigo-400 to-indigo-600',
      bgGradient: 'from-indigo-100 to-indigo-200',
      quote: "Together, we'll find harmony in learning and growth. 🌙"
    }
  ];

  return (
    <div className="space-y-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 animated-gradient-bg" />
      
      {/* Floating particles */}
      <div className="fixed inset-0 -z-5 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 8,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2 
          className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent"
          animate={{ 
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Choose Your Perfect Companion
        </motion.h2>
        <motion.p 
          className="text-muted-foreground max-w-2xl mx-auto text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Each companion has a unique personality designed to support different aspects of your learning journey. 
          Choose the one that resonates with you most.
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto items-stretch">
        {avatars.map((avatar, index) => {
          const IconComponent = avatar.icon;
          const isSelected = selectedAvatar === avatar.id;
          
          return (
            <motion.div
              key={avatar.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.2, 
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer relative overflow-hidden backdrop-blur-sm border-2 transition-all duration-500 group h-full min-h-[600px] flex flex-col ${
                  isSelected 
                    ? `ring-4 ring-${avatar.color}-400/50 shadow-2xl shadow-${avatar.color}-500/25 bg-gradient-to-br ${avatar.bgGradient} border-${avatar.color}-300` 
                    : 'hover:shadow-2xl bg-white/90 dark:bg-gray-900/90 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                }`}
                onClick={() => {
                  onAvatarSelect(avatar.id);
                  setShowTypewriter(avatar.id);
                }}
              >
              {/* Animated background elements */}
              <div className="absolute inset-0 opacity-10">
                {avatar.id === 'luna' && (
                  <div className="absolute inset-0">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute"
                        animate={{
                          rotate: 360,
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 4 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                        }}
                        style={{
                          left: `${20 + Math.random() * 60}%`,
                          top: `${20 + Math.random() * 60}%`,
                        }}
                      >
                        <Star className="w-4 h-4 text-purple-400" />
                      </motion.div>
                    ))}
                  </div>
                )}
                {avatar.id === 'aria' && (
                  <div className="absolute inset-0">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute"
                        animate={{
                          y: [-10, 10, -10],
                          opacity: [0.3, 0.7, 0.3],
                        }}
                        transition={{
                          duration: 3 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 3,
                        }}
                        style={{
                          left: `${10 + Math.random() * 80}%`,
                          top: `${10 + Math.random() * 80}%`,
                        }}
                      >
                        <Moon className="w-3 h-3 text-indigo-400" />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selection indicator */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div 
                    className="absolute top-4 right-4 z-10"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r from-${avatar.color}-400 to-${avatar.color}-600 flex items-center justify-center shadow-lg`}>
                      <Check className="w-6 h-6 text-white" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <CardHeader className="text-center pb-4 relative">
                {/* Floating icon animation */}
                <motion.div
                  className="absolute top-2 left-1/2 transform -translate-x-1/2"
                  animate={{
                    y: [-5, 5, -5],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <IconComponent className={`w-6 h-6 text-${avatar.color}-400`} />
                </motion.div>

                {/* Avatar representation */}
                <motion.div 
                  className={`w-36 h-36 mx-auto rounded-full bg-gradient-to-br ${avatar.gradient} p-1 mb-4 shadow-2xl relative overflow-hidden group-hover:shadow-3xl transition-all duration-500`}
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: `0 20px 40px rgba(147, 51, 234, 0.3)`,
                  }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {/* Animated ring */}
                  <motion.div
                    className={`absolute inset-0 rounded-full border-2 border-${avatar.color}-300`}
                    animate={{
                      rotate: 360,
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  <div className="w-full h-full rounded-full bg-white/95 flex items-center justify-center overflow-hidden relative">
                    <motion.img 
                      src={`/images/avatars/${avatar.id}-avatar.png`}
                      alt={`${avatar.name} avatar`}
                      className="w-full h-full object-cover rounded-full"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full rounded-full bg-white/90 items-center justify-center hidden">
                      <User className="w-12 h-12 text-gray-700" />
                    </div>
                    
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-center"
                >
                  <CardTitle className="text-3xl flex items-center justify-center gap-3 mb-4">
                    <motion.span
                      className={`font-bold text-gray-800 dark:text-gray-100 drop-shadow-sm`}
                      style={{
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {avatar.name}
                    </motion.span>
                  </CardTitle>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Badge 
                      variant="secondary" 
                      className={`bg-gradient-to-r from-${avatar.color}-100 to-${avatar.color}-200 text-${avatar.color}-800 border border-${avatar.color}-300 px-6 py-2 text-base font-semibold shadow-sm`}
                    >
                      {avatar.personality}
                    </Badge>
                  </motion.div>
                </motion.div>
              </CardHeader>

              <CardContent className="space-y-6 flex-1 flex flex-col justify-between p-6">
                <div className="flex-1 space-y-6">
                  <motion.p 
                    className="text-base text-gray-600 dark:text-gray-300 text-center leading-relaxed font-medium min-h-[3rem] flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    {avatar.description}
                  </motion.p>

                  {/* Personality traits */}
                  <motion.div 
                    className="flex flex-wrap gap-3 justify-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    {avatar.traits.map((trait, traitIndex) => (
                      <motion.div
                        key={trait}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 + traitIndex * 0.05 }}
                        whileHover={{ scale: 1.1, y: -2 }}
                      >
                        <Badge 
                          variant="outline" 
                          className={`text-sm px-4 py-2 font-medium transition-all duration-300 ${
                            isSelected 
                              ? `border-${avatar.color}-400 bg-${avatar.color}-50 text-${avatar.color}-700` 
                              : 'hover:border-purple-300 hover:bg-purple-50 border-gray-300 text-gray-700'
                          }`}
                        >
                          {trait}
                        </Badge>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Sample quote with typewriter effect */}
                  <motion.div 
                    className={`p-5 rounded-xl bg-gradient-to-r from-${avatar.color}-50 to-${avatar.color}-100 dark:from-${avatar.color}-950/20 dark:to-${avatar.color}-900/30 border border-${avatar.color}-200 dark:border-${avatar.color}-800 relative overflow-hidden`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Quote background decoration */}
                    <div className="absolute top-2 left-2 text-4xl opacity-20 font-serif text-gray-400">"</div>
                    <div className="absolute bottom-2 right-2 text-4xl opacity-20 font-serif text-gray-400 rotate-180">"</div>
                    
                    <p className="text-base italic text-center relative z-10 min-h-[3rem] flex items-center justify-center text-gray-700 dark:text-gray-300 font-medium">
                      {showTypewriter === avatar.id ? (
                        <Typewriter
                          words={[avatar.quote]}
                          loop={1}
                          cursor
                          cursorStyle='|'
                          typeSpeed={50}
                          deleteSpeed={0}
                          delaySpeed={1000}
                        />
                      ) : (
                        `"${avatar.quote}"`
                      )}
                    </p>
                  </motion.div>
                </div>

                <div className="mt-auto">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      variant={isSelected ? "default" : "outline"}
                      className={`w-full py-4 text-lg font-semibold transition-all duration-300 ${
                        isSelected 
                          ? `bg-gradient-to-r from-${avatar.color}-500 to-${avatar.color}-600 hover:from-${avatar.color}-600 hover:to-${avatar.color}-700 text-white shadow-lg shadow-${avatar.color}-500/25` 
                          : `border-2 border-${avatar.color}-300 text-${avatar.color}-600 hover:bg-gradient-to-r hover:from-${avatar.color}-50 hover:to-${avatar.color}-100 hover:border-${avatar.color}-400`
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAvatarSelect(avatar.id);
                        setShowTypewriter(avatar.id);
                      }}
                    >
                      <motion.span
                        initial={false}
                        animate={{ scale: isSelected ? 1.05 : 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {isSelected ? '✨ Selected' : `Choose ${avatar.name}`}
                      </motion.span>
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Confirm button */}
      <AnimatePresence>
        {selectedAvatar && (
          <motion.div 
            className="text-center pt-8"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                onClick={onConfirm}
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-700 text-white px-16 py-4 text-xl font-bold shadow-2xl shadow-purple-500/25 rounded-full relative overflow-hidden group"
              >
                {/* Button shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                />
                <motion.span
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="relative z-10"
                >
                  ✨ Start Your Journey Together ✨
                </motion.span>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PersonalitySelector;