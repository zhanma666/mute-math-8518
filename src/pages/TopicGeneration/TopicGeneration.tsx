import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopicDisplay from '../../components/TopicDisplay/TopicDisplay';
import { useSpeech } from '../../contexts/SpeechContext';
import topicsData from '../../data/topics.json';
import type { Topic } from '../../types';
import './TopicGeneration.css';

const TopicGeneration: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useSpeech();
  const [relatedTopics, setRelatedTopics] = useState<Topic[]>([]);
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    // 从数据文件中获取与所选专业相关的题目
    if (state.professional) {
      const filteredTopics = (topicsData.topics as Topic[]).filter(
        (topic) => topic.professional === state.professional
      );
      setRelatedTopics(filteredTopics);
      
      // 如果没有自定义题目，生成一个随机题目
      if (!state.topic || state.topic === '') {
        generateRandomTopic(filteredTopics);
      }
    }
  }, [state.professional]);

  // 生成随机题目
  const generateRandomTopic = (topics: Topic[]) => {
    if (topics.length > 0) {
      const randomIndex = Math.floor(Math.random() * topics.length);
      const randomTopic = topics[randomIndex];
      dispatch({ type: 'SET_TOPIC', payload: randomTopic.content });
    }
  };

  const handleGenerateTopic = () => {
    generateRandomTopic(relatedTopics);
    setIsCustom(false);
  };

  const handleStartSpeech = () => {
    if (state.topic) {
      navigate('/speech-simulation');
    } else {
      alert('请先生成或输入一个演讲题目');
    }
  };

  return (
    <div className="topic-generation-container">
      {/* 背景装饰元素 */}
      <div className="background-decorations">
        <div className="decoration decoration-1">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="var(--primary-light)" strokeWidth="1" opacity="0.1"/>
            <text x="50" y="55" fontSize="16" fill="var(--primary-light)" textAnchor="middle" fontWeight="bold" opacity="0.3">思考</text>
          </svg>
        </div>
        <div className="decoration decoration-2">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="35" stroke="var(--success-color)" strokeWidth="1" opacity="0.1"/>
            <text x="40" y="45" fontSize="14" fill="var(--success-color)" textAnchor="middle" fontWeight="bold" opacity="0.3">创新</text>
          </svg>
        </div>
        <div className="decoration decoration-3">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="30" r="25" stroke="var(--warning-color)" strokeWidth="1" opacity="0.1"/>
            <text x="30" y="35" fontSize="12" fill="var(--warning-color)" textAnchor="middle" fontWeight="bold" opacity="0.3">表达</text>
          </svg>
        </div>
      </div>

      <h1 className="page-title">演讲题目生成</h1>
      
      {/* 顶部激励语 */}
      <div className="motivational-message">
        <p>🧠 精心准备，<span className="highlight">自信演讲</span>！</p>
      </div>
      
      <div className="topic-options">
        <div className="option-buttons">
          <button 
            className={`option-button ${!isCustom ? 'active' : ''}`}
            onClick={() => {
              setIsCustom(false);
              generateRandomTopic(relatedTopics);
            }}
          >
            随机生成题目
          </button>
          <button 
            className={`option-button ${isCustom ? 'active' : ''}`}
            onClick={() => setIsCustom(true)}
          >
            自定义题目
          </button>
        </div>
        
        {!isCustom && (
          <button className="generate-button" onClick={handleGenerateTopic}>
            重新生成
          </button>
        )}
      </div>
      
      <TopicDisplay
        topic={state.topic}
        isCustom={isCustom}
        onCustomChange={(topic) => dispatch({ type: 'SET_TOPIC', payload: topic })}
      />

      {/* 演讲建议 */}
      <div className="speech-advice">
        <p>📝 建议：<span className="tip">先整理思路，再开始演讲。保持逻辑清晰，重点突出。</span></p>
      </div>

      <div className="navigation-buttons">
        <button className="back-button" onClick={() => navigate('/professional-selection')}>
          返回上一步
        </button>
        <button className="start-speech-button" onClick={handleStartSpeech}>
          开始演讲
        </button>
      </div>
    </div>
  );
};

export default TopicGeneration;
