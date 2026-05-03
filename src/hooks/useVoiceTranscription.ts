import { useState, useCallback, useRef } from 'react';
import { ai, MODELS } from '../services/geminiService';

export function useVoiceTranscription() {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  }, []);

  const stopRecording = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current) {
        reject("No media recorder available");
        return;
      }

      mediaRecorderRef.current.onstop = async () => {
        setIsRecording(false);
        setIsTranscribing(true);
        
        try {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          const base64 = await blobToBase64(blob);
          
          const response = await ai.models.generateContent({
            model: MODELS.CHAT,
            contents: [
              {
                inlineData: {
                  data: base64.split(',')[1],
                  mimeType: 'audio/webm'
                }
              },
              { text: "Transcribe this audio accurately. Return ONLY the transcribed text, nothing else. If there is no speech, return an empty string." }
            ]
          });

          const text = response.text || "";
          resolve(text.trim());
        } catch (err) {
          console.error("Transcription error:", err);
          reject(err);
        } finally {
          setIsTranscribing(false);
          // Stop all tracks to release microphone
          mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorderRef.current.stop();
    });
  }, []);

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
  };
}
