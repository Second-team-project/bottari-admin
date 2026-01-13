import { useSelector } from 'react-redux';
import DriverView from './DirverView.jsx';
import DriverForm from './DriverForm.jsx';

export default function DirverPanel() {
  const { panel } = useSelector((state) => state.driver);
  const { isOpen, mode } = panel;

  if (!isOpen) return null;

  // 모드에 따라 컴포넌트 선택
  if (mode === 'show') {
    return <DriverView />;
  }

  // store 또는 update 모드
  return <DriverForm mode={mode} />;
}
