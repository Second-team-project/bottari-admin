import './Monitoring.css';
import Reservation from './Reservation';
import Statistics from './Statistics';

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