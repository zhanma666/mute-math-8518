import React from 'react';
import type { TopicDisplayProps } from '../../types';
import './TopicDisplay.css';

const TopicDisplay: React.FC<TopicDisplayProps> = ({ topic, isCustom = false, onCustomChange }) => {
  return (
    <div className="topic-container">
      <h3 className="topic-title">演讲题目：</h3>
      {isCustom ? (
        <textarea
          className="topic-input"
          value={topic}
          onChange={(e) => {
            if (onCustomChange) {
              onCustomChange(e.target.value);
            }
          }}
          placeholder="请输入自定义演讲题目"
          rows={3}
        />
      ) : (
        <p className="topic-content">{topic}</p>
      )}
      {!isCustom && topic && (
        <div className="topic-tip">
          <p>💡 提示：请围绕主题展开，注意时间控制</p>
        </div>
      )}
    </div>
  );
};

export default TopicDisplay;
