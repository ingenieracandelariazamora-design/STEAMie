import { useState, useCallback, useRef, useEffect } from 'react';

interface UseTTSOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  autoSpeak?: boolean;
}

export const useTTS = (options: UseTTSOptions = {}) => {
  const { lang = 'es-MX', rate = 0.85, pitch = 1.15 } = options;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const lastTextRef = useRef<string>('');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window) || !isEnabled) return;
    
    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
    // Clean text for speech (remove emojis and markdown)
    const cleanText = text
      .replace(/[🎮🔒💬👋🌟⭐🛡️✅❌🔴🟢🎉💜💖🏆📧🌐📝🎨🏠🍕🏫🎬🔑🐱📱⚽🕵️🔍🚨]/g, '')
      .replace(/[*_#]/g, '')
      .trim();
    
    lastTextRef.current = cleanText;
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    // Try to find a Spanish voice
    const voices = speechSynthesis.getVoices();
    const spanishVoice = voices.find(v => v.lang.startsWith('es') && v.name.includes('female')) 
      || voices.find(v => v.lang.startsWith('es'));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [isEnabled, lang, rate, pitch]);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const repeat = useCallback(() => {
    if (lastTextRef.current) {
      speak(lastTextRef.current);
    }
  }, [speak]);

  const toggle = useCallback(() => {
    setIsEnabled(prev => {
      if (prev) {
        stop();
      }
      return !prev;
    });
  }, [stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  // Load voices
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.getVoices();
      speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
    }
  }, []);

  return {
    speak,
    stop,
    repeat,
    toggle,
    isSpeaking,
    isEnabled,
    setIsEnabled,
  };
};
