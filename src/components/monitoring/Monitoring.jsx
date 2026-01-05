import Reservation from './Reservation';
import Statistics from './Statistics';
import './Monitoring.css';

export default function Monitoring() {
  return (
    <>
      <div className="monitoring-container">
        <Statistics />
        <Reservation />
      </div>
    </>
  )
}