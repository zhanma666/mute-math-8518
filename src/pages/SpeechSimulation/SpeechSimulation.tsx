import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExaminerPanel from '../../components/ExaminerPanel/ExaminerPanel';
import TopicDisplay from '../../components/TopicDisplay/TopicDisplay';
import Timer from '../../components/Timer/Timer';
import Modal from '../../components/Modal/Modal';
import { useSpeech } from '../../contexts/SpeechContext';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { useSpeechEvaluator } from '../../hooks/useSpeechEvaluator';
import { useSpeechHistory } from '../../hooks/useLocalStorage';
import type { SpeechRecord } from '../../types';
import './SpeechSimulation.css';

const SpeechSimulation: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useSpeech();
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { 
    transcript, 
    isListening, 
    startListening, 
    stopListening, 
    resetTranscript 
  } = useSpeechRecognition();
  
  const { 
    isRecording, 
    startRecording, 
    stopRecording, 
    audioBlob 
  } = useAudioRecorder();
  
  const { evaluateSpeech, calculateOverallScore } = useSpeechEvaluator();
  const { addSpeechRecord } = useSpeechHistory();

  useEffect(() => {
    if (state.isSpeaking) {
      if (!isListening) {
        startListening();
      }
      if (!isRecording) {
        startRecording();
      }
    } else {
      if (isListening) {
        stopListening();
      }
      if (isRecording) {
        stopRecording();
      }
    }
  }, [state.isSpeaking, isListening, isRecording, startListening, stopListening, startRecording, stopRecording]);

  const handleStartSpeech = () => {
    dispatch({ type: 'START_SPEAKING' });
    resetTranscript(); // 清空之前的转录内容
  };

  // 提取共同的演讲评估逻辑
  const processSpeechEvaluation = async (showModal: boolean = false) => {
    // 停止语音识别和录音
    stopListening();
    stopRecording();
    
    // 进行演讲评估
    setIsProcessing(true);
    setTimeout(async () => {
      const evaluation = evaluateSpeech(transcript, state.topic || '');
      const totalScore = calculateOverallScore(evaluation);
      setEvaluationResult({ ...evaluation, totalScore });
      
      // 保存演讲记录
      const speechRecord: SpeechRecord = {
        id: Date.now().toString(),
        topic: state.topic || '',
        duration: state.duration,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        transcript: transcript,
        evaluation: { ...evaluation, totalScore },
        audioUrl: audioBlob ? URL.createObjectURL(audioBlob) : null,
        score: totalScore
      };
      
      addSpeechRecord(speechRecord);
      setIsProcessing(false);
      
      if (showModal) {
        setShowTimeUpModal(true);
      }
    }, 1000); // 模拟评估处理时间
  };

  const handleStopSpeech = async () => {
    dispatch({ type: 'STOP_SPEAKING' });
    await processSpeechEvaluation(false);
  };

  const handleTimeUp = async () => {
    dispatch({ type: 'STOP_SPEAKING' });
    await processSpeechEvaluation(true);
  };

  const handleCloseTimeUpModal = () => {
    setShowTimeUpModal(false);
    navigate('/topic-generation'); // 返回上一页
  };

  return (
    <div className="speech-simulation-container">
      {/* 背景装饰元素 */}
      <div className="background-decorations">
        <div className="decoration decoration-1">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="55" stroke="var(--primary-light)" strokeWidth="1" opacity="0.08"/>
            <text x="60" y="65" fontSize="18" fill="var(--primary-light)" textAnchor="middle" fontWeight="bold" opacity="0.2">自信</text>
          </svg>
        </div>
        <div className="decoration decoration-2">
          <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="45" cy="45" r="40" stroke="var(--success-color)" strokeWidth="1" opacity="0.08"/>
            <text x="45" y="50" fontSize="15" fill="var(--success-color)" textAnchor="middle" fontWeight="bold" opacity="0.2">冷静</text>
          </svg>
        </div>
        <div className="decoration decoration-3">
          <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="35" cy="35" r="30" stroke="var(--warning-color)" strokeWidth="1" opacity="0.08"/>
            <text x="35" y="40" fontSize="13" fill="var(--warning-color)" textAnchor="middle" fontWeight="bold" opacity="0.2">流畅</text>
          </svg>
        </div>
      </div>

      <button className="back-button" onClick={() => navigate('/topic-generation')}>
        返回上一步
      </button>
      
      <h1 className="page-title">考研复试演讲</h1>
      
      {/* 顶部激励语 */}
      <div className="motivational-header">
        <p>💡 保持自信，<span className="highlight">一定上岸</span>！</p>
      </div>
      
      {/* 考官面板 */}
      <ExaminerPanel count={3} />
      
      {/* 演讲题目 */}
      <TopicDisplay topic={state.topic} />
      
      {/* 显示语音识别转录内容 */}
      <div className="transcript-display">
        <h3>语音转录:</h3>
        <div className="transcript-content">
          {transcript || <span className="placeholder-text">等待您的演讲...</span>}
        </div>
        {isListening && <div className="listening-indicator">正在聆听中...</div>}
      </div>
      
      {/* 计时器 */}
      <div className="timer-section">
        <Timer
          duration={state.duration}
          isRunning={state.isSpeaking}
          onTimeUp={handleTimeUp}
          onTimeUpdate={(time) => dispatch({ type: 'UPDATE_REMAINING_TIME', payload: time })}
        />
      </div>
      
      {/* 控制按钮 */}
      <div className="control-buttons">
        {!state.isSpeaking ? (
          <button className="start-speech-button" onClick={handleStartSpeech}>
            开始演讲
          </button>
        ) : (
          <button className="stop-speech-button" onClick={handleStopSpeech}>
            结束演讲
          </button>
        )}
      </div>

      {/* 底部提示语 */}
      <div className="speech-tips">
        <p>🎯 演讲技巧：保持眼神交流，语速适中，逻辑清晰</p>
      </div>
      
      {/* 处理中提示 */}
      {isProcessing && (
        <div className="processing-overlay">
          <div className="processing-content">
            <div className="spinner"></div>
            <p>正在分析您的演讲表现...</p>
          </div>
        </div>
      )}
      
      {/* 时间到弹窗 */}
      <Modal 
        isOpen={showTimeUpModal} 
        onClose={handleCloseTimeUpModal}
        title="时间到！演讲结束"
        type="info"
      >
        <div className="modal-evaluation-result">
          <h3>演讲评估结果</h3>
          {evaluationResult && (
            <div className="evaluation-details">
              <p><strong>总分:</strong> {evaluationResult.totalScore}/100</p>
              <p><strong>话题相关性:</strong> {evaluationResult.relevanceScore}/25</p>
              <p><strong>语言表达:</strong> {evaluationResult.languageScore}/25</p>
              <p><strong>逻辑结构:</strong> {evaluationResult.logicScore}/25</p>
              <p><strong>流畅度:</strong> {evaluationResult.fluencyScore}/25</p>
              <div className="evaluation-feedback">
                <p><strong>建议:</strong> {evaluationResult.feedback}</p>
              </div>
            </div>
          )}
          <div className="modal-actions">
            <button className="modal-primary-button" onClick={handleCloseTimeUpModal}>
              确定
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SpeechSimulation;
