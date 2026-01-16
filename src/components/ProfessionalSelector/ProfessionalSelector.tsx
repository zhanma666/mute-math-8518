import React from 'react';
import type { ProfessionalSelectorProps } from '../../types';
import './ProfessionalSelector.css';

const ProfessionalSelector: React.FC<ProfessionalSelectorProps> = ({
  professionals,
  selectedProfessional,
  onSelectProfessional,
  selectedDuration,
  onSelectDuration
}) => {
  // 时长选项（秒）
  const durationOptions = [
    { value: 180, label: '3分钟' },
    { value: 300, label: '5分钟' },
    { value: 600, label: '10分钟' }
  ];

  return (
    <div className="professional-selector">
      {/* 专业选择 */}
      <div className="selection-section">
        <h3 className="section-title">选择专业</h3>
        <div className="professional-grid">
          {professionals.map((professional) => (
            <div
              key={professional.id}
              className={`professional-card ${selectedProfessional === professional.id ? 'selected' : ''}`}
              onClick={() => onSelectProfessional(professional.id)}
            >
              <h4 className="professional-name">{professional.name}</h4>
              <p className="professional-description">{professional.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 时长选择 */}
      <div className="selection-section">
        <h3 className="section-title">选择演讲时长</h3>
        <div className="duration-options">
          {durationOptions.map((option) => (
            <button
              key={option.value}
              className={`duration-button ${selectedDuration === option.value ? 'selected' : ''}`}
              onClick={() => onSelectDuration(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalSelector;
