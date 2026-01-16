import { useCallback } from 'react';

interface SpeechAnalysisResult {
  fluency: number;
  content: number;
  logic: number;
  professionalism: number;
  confidence: number;
  suggestions: string;
}

export const useSpeechEvaluator = () => {
  // 评估话题相关性（内部辅助函数）
  const evaluateTopicRelevance = useCallback((transcript: string, topic: string): number => {
    if (!transcript.trim() || !topic) {
      return 0;
    }
    
    // 计算话题相关性得分
    const topicWords = topic.toLowerCase().split(/\s+/);
    const transcriptLower = transcript.toLowerCase();
    
    let matchedWords = 0;
    topicWords.forEach(word => {
      if (transcriptLower.includes(word)) {
        matchedWords++;
      }
    });
    
    // 返回匹配比例 (0-1)
    return topicWords.length > 0 ? matchedWords / topicWords.length : 0;
  }, []);

  // 综合评估演讲质量
  const evaluateSpeech = useCallback((
    transcript: string, 
    topic: string
  ): SpeechAnalysisResult => {
    // 如果没有转录内容，返回基础分析
    if (!transcript.trim()) {
      return {
        fluency: 0,
        content: 0,
        logic: 0,
        professionalism: 0,
        confidence: 0,
        suggestions: '没有检测到演讲内容，请重试。'
      };
    }

    // 计算话题相关性
    const relevanceScore = evaluateTopicRelevance(transcript, topic);
    
    // 基于转录内容进行各项评分
    const wordCount = transcript.trim().split(/\s+/).length;
    
    // 流畅度评分：基于词数和语言流畅性
    const fluency = Math.min(5, Math.max(1, wordCount / 10));
    
    // 内容丰富度评分：基于词数和相关性
    const content = Math.min(5, Math.max(1, (wordCount / 15) * 0.7 + relevanceScore * 5 * 0.3));
    
    // 逻辑性评分：简单基于词数和结构
    const logic = Math.min(5, Math.max(1, (wordCount / 20) * 0.6 + relevanceScore * 5 * 0.4));
    
    // 专业性评分：基于词汇复杂度和相关性
    const professionalism = Math.min(5, Math.max(1, relevanceScore * 5 * 0.6 + 2 * 0.4));
    
    // 自信度评分：基于词数和表达稳定性
    const confidence = Math.min(5, Math.max(1, (wordCount / 12) * 0.5 + relevanceScore * 5 * 0.5));
    
    // 生成改进建议
    let suggestions = [];
    
    if (relevanceScore < 0.3) {
      suggestions.push(`话题相关性较低，建议更多围绕"${topic}"展开论述。`);
    } else if (relevanceScore < 0.7) {
      suggestions.push(`可以进一步加强与"${topic}"的关联性。`);
    } else {
      suggestions.push('很好地围绕话题展开演讲！');
    }
    
    if (wordCount < 20) {
      suggestions.push('演讲内容较短，建议增加详细阐述和例子。');
    } else if (wordCount > 100) {
      suggestions.push('演讲内容较长，注意保持重点突出。');
    }

    return {
      fluency: Math.round(fluency * 100) / 100,
      content: Math.round(content * 100) / 100,
      logic: Math.round(logic * 100) / 100,
      professionalism: Math.round(professionalism * 100) / 100,
      confidence: Math.round(confidence * 100) / 100,
      suggestions: suggestions.join(' ')
    };
  }, [evaluateTopicRelevance]);

  // 计算总评分
  const calculateOverallScore = useCallback((analysis: SpeechAnalysisResult): number => {
    const total = analysis.fluency + analysis.content + analysis.logic + 
                  analysis.professionalism + analysis.confidence;
    return Math.round((total / 5) * 100) / 100; // 保留两位小数
  }, []);

  return {
    evaluateSpeech,
    calculateOverallScore
  };
};