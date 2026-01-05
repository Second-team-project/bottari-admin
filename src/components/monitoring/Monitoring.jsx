import { useDispatch } from 'react-redux';
import './Monitoring.css';
import MonthlyChart from './MonthlyChart.jsx';
import MonthlyStats from './MonthlyStats.jsx';
import Statistics from './Statistics';
import { useEffect } from 'react';
import { getMonthlyStatsThunk } from '../../store/thunks/statsThunk.js';

export default function Monitoring() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 페이지 들어오면 '올해' 연도 기준으로 월별 데이터 요청
    const currentYear = new Date().getFullYear();
    dispatch(getMonthlyStatsThunk(currentYear));
    }, []);

  return (
    <>
      <div className="monitoring-container">
        <Statistics />
        <MonthlyStats />
        <MonthlyChart />
      </div>
    </>
  )
}