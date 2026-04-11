import { ChevronRight } from 'lucide-react';
import '@/shared/styles/expo/PageHeader.css';

function PageHeader({ title, showApplyButton, onApply }) {
  return (
    <header className="expo-header">
      <div>
        <span className="expo-header__eyebrow">EXPO APPLY</span>
        <h2 className="expo-header__title">{title}</h2>
      </div>
      {showApplyButton && (
        <button type="button" className="expo-header__button" onClick={onApply}>
          부스 참가 신청하기
          <ChevronRight size={18} />
        </button>
      )}
    </header>
  );
}

export default PageHeader;
