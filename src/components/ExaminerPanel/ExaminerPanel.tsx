import React from 'react';
import type { ExaminerPanelProps } from '../../types';
import './ExaminerPanel.css';

const ExaminerPanel: React.FC<ExaminerPanelProps> = ({ count = 3 }) => {
  // 严肃考官头像图片URL列表
  const examinerAvatars = [
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=200&h=200&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces'
  ];

  // 生成考官数据
  const examiners = Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `考官${index + 1}`,
    role: index === 0 ? '主考官' : '考官',
    avatar: examinerAvatars[index % examinerAvatars.length]
  }));

  return (
    <div className="examiner-panel">
      <div className="examiner-list">
        {examiners.map((examiner) => (
          <div key={examiner.id} className="examiner-item">
            <div className="examiner-avatar">
              {/* 使用真实的严肃考官图片 */}
              <img
                src={examiner.avatar}
                alt={`${examiner.name}`}
                width="120"
                height="120"
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>
            <div className="examiner-info">
              <h4 className="examiner-name">{examiner.name}</h4>
              <p className="examiner-role">{examiner.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExaminerPanel;
