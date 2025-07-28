import { useEffect, useRef, useState } from 'react';

interface AudioAnalyzerOptions {
  fftSize?: number;
  smoothingTimeConstant?: number;
  updateInterval?: number;
}

export const useAudioAnalyzer = (
  audioElement?: HTMLAudioElement | null,
  options: AudioAnalyzerOptions = {}
) => {
  const {
    fftSize = 256,
    smoothingTimeConstant = 0.8,
    updateInterval = 50
  } = options;

  const [volumeLevel, setVolumeLevel] = useState(0);
  const [frequency, setFrequency] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzerRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number>();
  const dataArrayRef = useRef<Uint8Array>();

  // Initialize audio analyzer
  useEffect(() => {
    if (!audioElement) return;

    const initializeAnalyzer = async () => {
      try {
        // Create audio context
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;

        // Create analyzer node
        const analyzer = audioContext.createAnalyser();
        analyzer.fftSize = fftSize;
        analyzer.smoothingTimeConstant = smoothingTimeConstant;
        analyzerRef.current = analyzer;

        // Create source from audio element
        const source = audioContext.createMediaElementSource(audioElement);
        sourceRef.current = source;

        // Connect nodes
        source.connect(analyzer);
        analyzer.connect(audioContext.destination);

        // Create data array for frequency data
        const bufferLength = analyzer.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);

        console.log('🎵 Audio analyzer initialized successfully');
        setIsAnalyzing(true);
      } catch (error) {
        console.error('❌ Error initializing audio analyzer:', error);
      }
    };

    initializeAnalyzer();

    return () => {
      // Cleanup
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      setIsAnalyzing(false);
    };
  }, [audioElement, fftSize, smoothingTimeConstant]);

  // Analyze audio data
  const analyzeAudio = () => {
    if (!analyzerRef.current || !dataArrayRef.current) return;

    const analyzer = analyzerRef.current;
    const dataArray = dataArrayRef.current;

    // Get frequency data
    analyzer.getByteFrequencyData(dataArray);

    // Calculate volume level (RMS)
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i] * dataArray[i];
    }
    const rms = Math.sqrt(sum / dataArray.length);
    const volume = rms / 255; // Normalize to 0-1

    // Calculate dominant frequency
    let maxIndex = 0;
    let maxValue = 0;
    for (let i = 0; i < dataArray.length; i++) {
      if (dataArray[i] > maxValue) {
        maxValue = dataArray[i];
        maxIndex = i;
      }
    }
    const dominantFreq = (maxIndex * audioContextRef.current!.sampleRate) / (2 * dataArray.length);

    setVolumeLevel(volume);
    setFrequency(dominantFreq);

    // Continue analyzing
    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  };

  // Start/stop analysis based on audio playback
  useEffect(() => {
    if (!audioElement || !isAnalyzing) return;

    const handlePlay = () => {
      console.log('🎵 Starting audio analysis');
      analyzeAudio();
    };

    const handlePause = () => {
      console.log('⏸️ Stopping audio analysis');
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setVolumeLevel(0);
      setFrequency(0);
    };

    const handleEnded = () => {
      console.log('🔚 Audio ended, stopping analysis');
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setVolumeLevel(0);
      setFrequency(0);
    };

    audioElement.addEventListener('play', handlePlay);
    audioElement.addEventListener('pause', handlePause);
    audioElement.addEventListener('ended', handleEnded);

    return () => {
      audioElement.removeEventListener('play', handlePlay);
      audioElement.removeEventListener('pause', handlePause);
      audioElement.removeEventListener('ended', handleEnded);
    };
  }, [audioElement, isAnalyzing]);

  return {
    volumeLevel,
    frequency,
    isAnalyzing,
    analyzer: analyzerRef.current
  };
};