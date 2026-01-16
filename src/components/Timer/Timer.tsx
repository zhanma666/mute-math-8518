import React, { useEffect, useState } from 'react';
import type { TimerProps } from '../../types';
import './Timer.css';

const Timer: React.FC<TimerProps> = ({ duration, isRunning, onTimeUp, onTimeUpdate }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [progress, setProgress] = useState(100);

  // 重置计时器
  useEffect(() => {
    setTimeLeft(duration);
    setProgress(100);
  }, [duration]);

  // 计时器逻辑
  useEffect(() => {
    let timer: number;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          
          // 计算进度百分比
          const newProgress = (newTime / duration) * 100;
          setProgress(newProgress);

          // 更新父组件状态
          if (onTimeUpdate) {
            onTimeUpdate(newTime);
          }

          // 时间到
          if (newTime === 0) {
            clearInterval(timer);
            onTimeUp();
          }

          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      onTimeUp();
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isRunning, timeLeft, duration, onTimeUp, onTimeUpdate]);

  // 格式化时间为 mm:ss 格式
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 根据剩余时间获取颜色
  const getTimeColor = (): string => {
    const percentage = (timeLeft / duration) * 100;
    if (percentage > 50) return 'time-normal';
    if (percentage > 10) return 'time-warning';
    return 'time-danger';
  };

  return (
    <div className="timer-container">
      <div className={`timer-display ${getTimeColor()}`}>
        {formatTime(timeLeft)}
      </div>
      <div className="timer-progress-container">
        <div 
          className="timer-progress-bar" 
          style={{ 
            width: `${progress}%`,
            backgroundColor: getTimeColor() === 'time-normal' ? '#10B981' : 
                            getTimeColor() === 'time-warning' ? '#F59E0B' : '#EF4444'
          }}
        ></div>
      </div>
    </div>
  );
};

export default Timer;
