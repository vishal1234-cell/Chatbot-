import { useState, useCallback, useRef, useEffect } from 'react';
import { ai, MODELS } from '../services/geminiService';
import { LiveServerMessage, Modality } from '@google/genai';

export function useLiveAPI() {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [callHistory, setCallHistory] = useState<{ id: string; timestamp: number; duration: number }[]>(() => {
    const saved = localStorage.getItem('ss_call_history');
    return saved ? JSON.parse(saved) : [];
  });
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const callStartTimeRef = useRef<number>(0);

  const stopCall = useCallback(() => {
    if (isActive && callStartTimeRef.current > 0) {
      const duration = Math.floor((Date.now() - callStartTimeRef.current) / 1000);
      const newCall = {
        id: Date.now().toString(),
        timestamp: callStartTimeRef.current,
        duration
      };
      setCallHistory(prev => {
        const updated = [newCall, ...prev].slice(0, 50);
        localStorage.setItem('ss_call_history', JSON.stringify(updated));
        return updated;
      });
    }

    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsActive(false);
    setIsConnecting(false);
    nextStartTimeRef.current = 0;
    callStartTimeRef.current = 0;
  }, [isActive]);

  const startCall = useCallback(async () => {
    setIsConnecting(true);
    try {
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const session = await ai.live.connect({
        model: MODELS.LIVE,
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            callStartTimeRef.current = Date.now();
            console.log("Live session opened");
            
            // Start capturing audio
            startAudioCapture();
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.modelTurn?.parts) {
              const part = message.serverContent.modelTurn.parts[0];
              if (part.inlineData?.data) {
                playAudioChunk(part.inlineData.data);
              }
            }

            if (message.serverContent?.interrupted) {
              // Handle interruption
              nextStartTimeRef.current = audioContextRef.current?.currentTime || 0;
            }

            if (message.serverContent?.turnComplete) {
              console.log("Turn complete");
            }
          },
          onclose: () => {
            stopCall();
          },
          onerror: (err) => {
            console.error("Live session error:", err);
            stopCall();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: "You are the SecureShield Insurance Support Voice Agent. Speak professionally, clearly, and empathetically. You assist customers with insurance queries and policy guidance in real-time. Keep responses concise and easy to understand over voice.",
        }
      });

      sessionRef.current = session;
    } catch (err) {
      console.error("Error starting call:", err);
      setIsConnecting(false);
      stopCall();
    }
  }, [stopCall]);

  const startAudioCapture = async () => {
    if (!audioContextRef.current || !mediaStreamRef.current || !sessionRef.current) return;

    const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
    const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);

    processor.onaudioprocess = (e) => {
      if (!isActive || !sessionRef.current) return;
      
      const inputData = e.inputBuffer.getChannelData(0);
      // Convert Float32 to Int16
      const pcmData = new Int16Array(inputData.length);
      for (let i = 0; i < inputData.length; i++) {
        pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
      }
      
      // Convert to Base64
      const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
      
      sessionRef.current.sendRealtimeInput({
        audio: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
      });
    };

    source.connect(processor);
    processor.connect(audioContextRef.current.destination);
  };

  const playAudioChunk = (base64Data: string) => {
    if (!audioContextRef.current) return;

    const binary = atob(base64Data);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      buffer[i] = binary.charCodeAt(i);
    }

    const int16Array = new Int16Array(buffer.buffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 0x7FFF;
    }

    const audioBuffer = audioContextRef.current.createBuffer(1, float32Array.length, 24000);
    audioBuffer.getChannelData(0).set(float32Array);

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);

    const currentTime = audioContextRef.current.currentTime;
    if (nextStartTimeRef.current < currentTime) {
      nextStartTimeRef.current = currentTime;
    }

    source.start(nextStartTimeRef.current);
    nextStartTimeRef.current += audioBuffer.duration;
  };

  const clearCallHistory = useCallback(() => {
    setCallHistory([]);
    localStorage.removeItem('ss_call_history');
  }, []);

  return {
    isActive,
    isConnecting,
    callHistory,
    startCall,
    stopCall,
    clearCallHistory,
  };
}
