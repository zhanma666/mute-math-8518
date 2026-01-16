import { useState } from 'react';
import type { SpeechRecord } from '../types';

export const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
  // 初始化状态
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // 获取本地存储的值
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 更新本地存储
  const setValue = (value: T) => {
    try {
      // 更新状态
      setStoredValue(value);
      // 保存到本地存储
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

export const useSpeechHistory = () => {
  const [speechHistory, setSpeechHistory] = useLocalStorage<SpeechRecord[]>('speechHistory', []);
  
  const addSpeechRecord = (record: SpeechRecord) => {
    const newHistory = [...speechHistory, record];
    setSpeechHistory(newHistory);
  };
  
  const clearSpeechHistory = () => {
    setSpeechHistory([]);
  };
  
  const removeSpeechRecord = (id: string) => {
    const newHistory = speechHistory.filter(record => record.id !== id);
    setSpeechHistory(newHistory);
  };

  return {
    speechHistory,
    addSpeechRecord,
    clearSpeechHistory,
    removeSpeechRecord
  };
};