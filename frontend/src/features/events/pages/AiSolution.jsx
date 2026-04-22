import '@/features/events/styles/AiSolution.css';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PageSectionHeader from '@/shared/components/PageSectionHeader';

function AiSolution() {

  return (
    <div className="ai-solution-page">
      <PageSectionHeader
        title="AI 추천받기"
        description="관심사와 상황에 맞는 행사를 AI 기반으로 추천받아 빠르게 탐색해보세요."
      />
      AiSolution 페이지
    </div>
  );
}

export default AiSolution;
