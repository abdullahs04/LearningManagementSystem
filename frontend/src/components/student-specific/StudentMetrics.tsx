import axios from 'axios';
import { useEffect, useState } from 'react';


export default function StudentMetrics() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    axios.get('http://193.203.162.232:10000/metrics/student_metrics', { params: { student_rfid: 6323678 } })
      .then(res => setMetrics(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!metrics) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-2 gap-6">
      <MetricCard title="Current Courses" value={metrics.current_courses} />
      <MetricCard title="Average Percentage" value={`${metrics.average_percentage} %`} />
      <MetricCard title="Pending Assignments" value={metrics.pending_assignments} />
      <MetricCard title="Average Attendance" value={`${metrics.average_attendance} %`} />
    </div>
  );
}


type MetricCardProps = {
  title: string;
  value: string;
};

function MetricCard({ title, value }: MetricCardProps) {
  return (
    <div className="flex h-32 rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-blue-300 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex-1 p-5 flex flex-col justify-center">
        <span className="text-base font-medium text-gray-600 dark:text-gray-300">
          {title}
        </span>
        <div className="mt-2 h-1.5 w-16 bg-blue-200 dark:bg-blue-600 rounded-full"></div>
      </div>
      <div className="w-2/5 p-5 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600">
        <h4 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          {value}
        </h4>
      </div>
    </div>
  );
}
