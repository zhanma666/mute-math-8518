import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { SpeechState, SpeechAction } from '../types';

// 初始状态
const initialState: SpeechState = {
  currentStep: 'home',
  professional: '',
  duration: 180, // 默认3分钟
  topic: '',
  isSpeaking: false,
  remainingTime: 180,
  history: [],
  preferences: {
    defaultProfessional: '',
    defaultDuration: 180,
    theme: 'light'
  }
};

// 状态reducer
const speechReducer = (state: SpeechState, action: SpeechAction): SpeechState => {
  switch (action.type) {
    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStep: action.payload
      };
    case 'SET_PROFESSIONAL':
      return {
        ...state,
        professional: action.payload,
        preferences: {
          ...state.preferences,
          defaultProfessional: action.payload
        }
      };
    case 'SET_DURATION':
      return {
        ...state,
        duration: action.payload,
        remainingTime: action.payload,
        preferences: {
          ...state.preferences,
          defaultDuration: action.payload
        }
      };
    case 'SET_TOPIC':
      return {
        ...state,
        topic: action.payload
      };
    case 'START_SPEAKING':
      return {
        ...state,
        isSpeaking: true
      };
    case 'STOP_SPEAKING':
      return {
        ...state,
        isSpeaking: false
      };
    case 'UPDATE_REMAINING_TIME':
      return {
        ...state,
        remainingTime: action.payload
      };
    case 'ADD_RECORD':
      return {
        ...state,
        history: [...state.history, action.payload]
      };
    case 'SET_PREFERENCE':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.payload
        }
      };
    default:
      return state;
  }
};

// 创建Context
interface SpeechContextType {
  state: SpeechState;
  dispatch: React.Dispatch<SpeechAction>;
}

const SpeechContext = createContext<SpeechContextType | undefined>(undefined);

// Provider组件
export const SpeechProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(speechReducer, initialState);

  return (
    <SpeechContext.Provider value={{ state, dispatch }}>
      {children}
    </SpeechContext.Provider>
  );
};

// 自定义hook，用于访问Context
export const useSpeech = () => {
  const context = useContext(SpeechContext);
  if (context === undefined) {
    throw new Error('useSpeech must be used within a SpeechProvider');
  }
  return context;
};
