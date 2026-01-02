import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import './MonthlyChart.css';

// Chart.js 모듈 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function MonthlyChart() {
  const { monthlyStats } = useSelector((state) => state.stats);

  // 차트에 들어갈 데이터 가공
  // monthlyStats가 없으면 빈 배열로 처리해서 에러 방지
  const labels = monthlyStats.map((data) => {
    // 2025-01 -> "1월" 로 변환
    return `${parseInt(data.month.split('-')[1])}월`;
  });

  const chartData = {
    labels,
    datasets: [
      {
        type: 'line', // 선 그래프 (매출)
        label: '월 매출 (원)',
        data: monthlyStats.map((data) => data.totalRevenue),
        borderColor: '#F59E0B', // 노란/골드색
        backgroundColor: '#F59E0B',
        yAxisID: 'y_revenue', // 오른쪽 축 사용
        tension: 0.3, // 곡선 부드럽게
        borderWidth: 2,
      },
      {
        type: 'bar', // 막대 그래프 (배송)
        label: '배송 건수',
        data: monthlyStats.map((data) => data.totalDelivery),
        backgroundColor: '#3B82F6', // 파란색
        stack: 'Stack 0', // 배송+보관을 하나의 막대로 쌓기 위함
        yAxisID: 'y_count', // 왼쪽 축 사용
      },
      {
        type: 'bar', // 막대 그래프 (보관)
        label: '보관 건수',
        data: monthlyStats.map((data) => data.totalStorage),
        backgroundColor: '#10B981', // 초록색
        stack: 'Stack 0', // 같은 스택 그룹
        yAxisID: 'y_count', // 왼쪽 축 사용
      },
    ],
  };

  // 2. 차트 옵션 설정 (축, 툴팁 등)
  const options = {
    responsive: true,
    maintainAspectRatio: false, // 컨테이너 크기에 맞춤
    interaction: {
      mode: 'index', // 마우스 올리면 해당 월의 데이터 다 보여줌
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      // 왼쪽 축 (건수)
      y_count: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: '예약 건수 (건)',
        },
        grid: {
          display: false, // 격자 숨김 (깔끔하게)
        },
      },
      // 오른쪽 축 (매출)
      y_revenue: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: '매출 (원)',
        },
        grid: {
          drawOnChartArea: true, // 오른쪽 축 기준 격자 표시
        },
        ticks: {
          // 축에 '원' 단위 붙이기 등 커스텀 가능
          callback: function (value) {
            return value.toLocaleString();
          },
        },
      },
    },
  };

  return (
    <div className="monthly-chart-container">
      <h2 className="monthly-chart-title">월별 상세 그래프</h2>
      <div className="chart-wrapper">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}