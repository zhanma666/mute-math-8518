// 专业类型
export interface Professional {
  id: string;
  name: string;
  description: string;
}

// 演讲题目类型
export interface Topic {
  id: string;
  content: string;
  category: 'professional' | 'experience' | 'research' | 'hot' | 'pressure';
  professional: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// 评估类型
export interface Evaluation {
  fluency: number; // 流畅度（1-5）
  content: number; // 内容完整性（1-5）
  logic: number; // 逻辑清晰度（1-5）
  professionalism: number; // 专业深度（1-5）
  confidence: number; // 自信心表现（1-5）
}

// 演讲记录类型
export interface SpeechRecord {
  id: string;
  topic: string;
  duration: number; // 演讲时长（秒）
  startTime: string;
  endTime: string;
  transcript: string;
  evaluation: any; // 评估结果
  audioUrl?: string | null; // 音频文件URL
  score: number; // 总分
}

// 演讲状态类型
export interface SpeechState {
  currentStep: 'home' | 'professional' | 'topic' | 'simulation' | 'evaluation';
  professional: string;
  duration: number; // 秒
  topic: string;
  isSpeaking: boolean;
  remainingTime: number;
  history: SpeechRecord[];
  preferences: {
    defaultProfessional: string;
    defaultDuration: number;
    theme: 'light' | 'dark';
  };
}

// 演讲状态操作类型
export type SpeechAction =
  | { type: 'SET_CURRENT_STEP'; payload: SpeechState['currentStep'] }
  | { type: 'SET_PROFESSIONAL'; payload: string }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_TOPIC'; payload: string }
  | { type: 'START_SPEAKING' }
  | { type: 'STOP_SPEAKING' }
  | { type: 'UPDATE_REMAINING_TIME'; payload: number }
  | { type: 'ADD_RECORD'; payload: SpeechRecord }
  | { type: 'SET_PREFERENCE'; payload: Partial<SpeechState['preferences']> };

// 计时器属性类型
export interface TimerProps {
  duration: number;
  isRunning: boolean;
  onTimeUp: () => void;
  onTimeUpdate?: (remainingTime: number) => void;
}

// 题目显示属性类型
export interface TopicDisplayProps {
  topic: string;
  isCustom?: boolean;
  onCustomChange?: (topic: string) => void;
}

// 考官面板属性类型
export interface ExaminerPanelProps {
  count?: number;
}

// 专业选择器属性类型
export interface ProfessionalSelectorProps {
  professionals: Professional[];
  selectedProfessional: string;
  onSelectProfessional: (professional: string) => void;
  selectedDuration: number;
  onSelectDuration: (duration: number) => void;
}
