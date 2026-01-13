import { useSelector } from 'react-redux';
import ReservationView from './ReservationView';
import ReservationForm from './ReservationForm';

export default function ReservationPanel() {
  const { panel } = useSelector((state) => state.reservation);
  const { isOpen, mode } = panel;

  if (!isOpen) return null;

  // 모드에 따라 컴포넌트 선택
  if (mode === 'show') {
    return <ReservationView />;
  }

  // store 또는 update 모드
  return <ReservationForm mode={mode} />;
}
