import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleStartSpeech = () => {
    navigate('/professional-selection');
  };

  return (
    <div className="home-container">
      {/* 背景装饰元素 */}
      <div className="background-decorations">
        <div className="decoration decoration-1">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="var(--primary-light)" strokeWidth="1" opacity="0.1"/>
            <text x="50" y="55" fontSize="16" fill="var(--primary-light)" textAnchor="middle" fontWeight="bold" opacity="0.3">上岸</text>
          </svg>
        </div>
        <div className="decoration decoration-2">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="35" stroke="var(--success-color)" strokeWidth="1" opacity="0.1"/>
            <text x="40" y="45" fontSize="14" fill="var(--success-color)" textAnchor="middle" fontWeight="bold" opacity="0.3">加油</text>
          </svg>
        </div>
        <div className="decoration decoration-3">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="30" r="25" stroke="var(--warning-color)" strokeWidth="1" opacity="0.1"/>
            <text x="30" y="35" fontSize="12" fill="var(--warning-color)" textAnchor="middle" fontWeight="bold" opacity="0.3">必胜</text>
          </svg>
        </div>
      </div>

      <h1 className="home-title">考研复试演讲训练</h1>
      <p className="home-subtitle">提升你的复试演讲能力，增强自信心</p>
      
      {/* 激励话语 */}
      <div className="motivational-quote">
        <p className="quote-text">每一次练习都是向成功迈进的一步，<strong>一定上岸！</strong></p>
      </div>
      
      <div className="features-grid">
        <div className="feature-card">
          <h3 className="feature-title">真实场景模拟</h3>
          <p className="feature-description">模拟真实复试场景，让你提前适应</p>
        </div>
        <div className="feature-card">
          <h3 className="feature-title">智能题目生成</h3>
          <p className="feature-description">根据专业生成相关演讲题目</p>
        </div>
        <div className="feature-card">
          <h3 className="feature-title">实时时间提醒</h3>
          <p className="feature-description">清晰的时间显示，帮助你控制演讲节奏</p>
        </div>
      </div>

      <button className="start-button" onClick={handleStartSpeech}>
        开始演讲
      </button>

      {/* 底部激励语 */}
      <div className="motivational-banner">
        <p>💪 努力练习，<span className="highlight">一战成硕</span>！</p>
      </div>

      <div className="footer">
        <p>考研复试演讲训练平台 © {new Date().getFullYear()}</p>
      </div>
    </div>
  );
};

export default Home;
