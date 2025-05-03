export default function ProfessorMetrics() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <MetricCard title="Active Courses" value="4" />
      <MetricCard title="Total Students" value="120" />
      <MetricCard title="Next Lecture In" value="2h 45m" />
      <MetricCard title="Assignments Due" value="8" />
      <MetricCard title="Pending Grading Items" value="15" />
      <MetricCard title="Student Queries" value="12" />
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
