import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfessionalSelector from '../../components/ProfessionalSelector/ProfessionalSelector';
import { useSpeech } from '../../contexts/SpeechContext';
import topicsData from '../../data/topics.json';
import type { Professional } from '../../types';
import './ProfessionalSelection.css';

const ProfessionalSelection: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useSpeech();
  const [professionals, setProfessionals] = useState<Professional[]>([]);

  useEffect(() => {
    // 从数据文件中获取专业列表
    setProfessionals(topicsData.professionals as Professional[]);
  }, []);

  const handleNext = () => {
    if (state.professional) {
      navigate('/topic-generation');
    } else {
      alert('请先选择一个专业');
    }
  };

  return (
    <div className="professional-selection-container">
      {/* 背景装饰元素 */}
      <div className="background-decorations">
        <div className="decoration decoration-1">
          <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="45" cy="45" r="40" stroke="var(--primary-light)" strokeWidth="1" opacity="0.1"/>
            <text x="45" y="50" fontSize="15" fill="var(--primary-light)" textAnchor="middle" fontWeight="bold" opacity="0.3">选择</text>
          </svg>
        </div>
        <div className="decoration decoration-2">
          <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="35" cy="35" r="30" stroke="var(--success-color)" strokeWidth="1" opacity="0.1"/>
            <text x="35" y="40" fontSize="13" fill="var(--success-color)" textAnchor="middle" fontWeight="bold" opacity="0.3">准备</text>
          </svg>
        </div>
        <div className="decoration decoration-3">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="30" r="25" stroke="var(--warning-color)" strokeWidth="1" opacity="0.1"/>
            <text x="30" y="35" fontSize="12" fill="var(--warning-color)" textAnchor="middle" fontWeight="bold" opacity="0.3">成功</text>
          </svg>
        </div>
      </div>

      <h1 className="page-title">专业与时长选择</h1>
      
      {/* 顶部激励语 */}
      <div className="motivational-message">
        <p>🎯 选择你的专业方向，<span className="highlight">开启上岸之旅</span>！</p>
      </div>
      
      <ProfessionalSelector
        professionals={professionals}
        selectedProfessional={state.professional}
        onSelectProfessional={(profId) => dispatch({ type: 'SET_PROFESSIONAL', payload: profId })}
        selectedDuration={state.duration}
        onSelectDuration={(duration) => dispatch({ type: 'SET_DURATION', payload: duration })}
      />

      <div className="navigation-buttons">
        <button className="back-button" onClick={() => navigate('/')}>
          返回首页
        </button>
        <button className="next-button" onClick={handleNext}>
          下一步
        </button>
      </div>

      {/* 底部提示语 */}
      <div className="selection-tips">
        <p>💡 建议选择与你考研方向一致的专业，演讲时长建议为3-5分钟</p>
      </div>
    </div>
  );
};

export default ProfessionalSelection;
