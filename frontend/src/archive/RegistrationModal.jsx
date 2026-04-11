import '@/archive/RegistrationModal.css';

function RegistrationModal({ onClose, onConfirm }) {
  return (
    <div className="expo-modal__overlay">
      <div className="expo-modal">
        <h2>EXPO REGISTRATION</h2>
        <p>2026 AI 에이전트 엑스포 부스 참가 신청을 진행하시겠습니까?</p>
        <div className="expo-modal__actions">
          <button type="button" onClick={onClose} className="is-secondary">
            취소
          </button>
          <button type="button" onClick={onConfirm} className="is-primary">
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegistrationModal;
