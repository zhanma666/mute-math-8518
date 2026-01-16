import { useState, useEffect, useRef, useCallback } from 'react';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event) => void;
  onend: () => void;
  onstart: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

export interface SpeechAnalysisResult {
  fluency: number; // 流畅度（1-5）
  content: number; // 内容完整性（1-5）
  logic: number; // 逻辑清晰度（1-5）
  professionalism: number; // 专业深度（1-5）
  confidence: number; // 自信心表现（1-5）
  suggestions: string; // 改进建议
}

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [finalTranscript, setFinalTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  

  // 检查浏览器支持
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'zh-CN'; // 设置中文识别

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setFinalTranscript(prev => prev + transcript + ' ');
            setTranscript('');
          } else {
            interimTranscript += transcript;
          }
        }
        setTranscript(interimTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        setError(`Speech recognition error: ${event.error}`);
        stopListening();
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          // 如果仍在聆听状态，则重新启动识别
          try {
            recognitionRef.current?.start();
          } catch (err) {
            // 忽略错误，如果已停止则不再重启
          }
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = useCallback(async () => {
    if (!isSupported) {
      setError('您的浏览器不支持语音识别功能');
      return;
    }

    try {
      // 请求麦克风权限
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // 立即停止，因为我们使用的是SpeechRecognition API

      setTranscript('');
      setFinalTranscript('');
      setError(null);
      setIsListening(true);
      
      recognitionRef.current?.start();
    } catch (err) {
      setError('无法访问麦克风，请检查权限设置');
      setIsListening(false);
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setFinalTranscript('');
    setError(null);
  }, []);

  // 合并最终和临时转录文本
  const fullTranscript = finalTranscript + transcript;

  // 分析演讲内容
  const analyzeSpeech = useCallback((transcriptText: string): SpeechAnalysisResult => {
    if (!transcriptText.trim()) {
      return {
        fluency: 1,
        content: 1,
        logic: 1,
        professionalism: 1,
        confidence: 1,
        suggestions: '未检测到语音内容，请尝试再次演讲。'
      };
    }

    // 计算字数
    const wordCount = transcriptText.trim().length;
    
    // 计算重复词比例（简单检测）
    const words = transcriptText.split(/[\s,，。！？；;]+/).filter(w => w.length > 0);
    const uniqueWords = new Set(words);
    const repetitionRate = 1 - (uniqueWords.size / Math.max(words.length, 1));
    
    // 流畅度评估 (基于重复率和字数)
    let fluency = 3; // 默认值
    if (wordCount < 50) {
      fluency = 1; // 字数太少
    } else if (repetitionRate > 0.3) {
      fluency = 1; // 重复率太高
    } else if (repetitionRate > 0.2) {
      fluency = 2;
    } else if (repetitionRate > 0.1) {
      fluency = 3;
    } else if (repetitionRate > 0.05) {
      fluency = 4;
    } else {
      fluency = 5; // 重复率很低
    }
    
    // 内容完整性评估 (基于字数和句子结构)
    const sentenceCount = transcriptText.split(/[。！？]/).filter(s => s.trim().length > 0).length;
    let content = 3; // 默认值
    if (wordCount < 100) {
      content = 1;
    } else if (wordCount < 200) {
      content = 2;
    } else if (wordCount < 400) {
      content = 3;
    } else if (wordCount < 600) {
      content = 4;
    } else {
      content = 5;
    }
    
    // 逻辑清晰度评估 (基于句子数量和关键词)
    let logic = 3; // 默认值
    if (sentenceCount < 3) {
      logic = 1;
    } else if (sentenceCount < 5) {
      logic = 2;
    } else if (sentenceCount < 8) {
      logic = 3;
    } else if (sentenceCount < 12) {
      logic = 4;
    } else {
      logic = 5;
    }
    
    // 专业深度评估 (简单评估，可以进一步优化)
    let professionalism = 3; // 默认值
    // 在实际应用中，这里可以根据专业词汇出现频率进行评估
    // 为了演示，我们根据句子长度和复杂度来估算
    
    // 自信度评估 (基于语句完整性和词汇丰富度)
    let confidence = 3; // 默认值
    if (repetitionRate < 0.1 && sentenceCount >= 3) {
      confidence = 4;
    } else if (repetitionRate < 0.05 && sentenceCount >= 5) {
      confidence = 5;
    } else if (repetitionRate > 0.25) {
      confidence = 1;
    }
    
    // 生成改进建议
    let suggestions = [];
    if (wordCount < 100) {
      suggestions.push('建议增加演讲内容的详细程度，目标至少100字以上。');
    }
    if (repetitionRate > 0.2) {
      suggestions.push('注意减少重复用词，尝试使用更多样化的表达方式。');
    }
    if (sentenceCount < 3) {
      suggestions.push('建议将内容组织成多个句子，提高逻辑性。');
    }
    if (suggestions.length === 0) {
      suggestions.push('演讲表现良好！继续保持这种水平。');
    }
    
    return {
      fluency,
      content,
      logic,
      professionalism,
      confidence,
      suggestions: suggestions.join(' ')
    };
  }, []);

  return {
    isListening,
    transcript: fullTranscript,
    interimTranscript: transcript,
    finalTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    analyzeSpeech
  };
};