import StudentMetrics from "../../components/student-specific/StudentMetrics";
import AssignmentsList from "../../components/student-specific/AssignmentsList";
import CoursesCards from "../../components/student-specific/CoursesCards";
import PageMeta from "../../components/common/PageMeta";

export default function StudentOverview() {
  return (
    <>
      <PageMeta
        title="LGS Student Dashboard"
        description="This is the Overview page for the LGS Student Dashboard"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <h2 className="col-span-12 text-2xl font-bold mb-4 dark:text-white">Student Performance</h2>
        <div className="col-span-12 xl:col-span-8">
          <StudentMetrics />
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Your Courses</h2>
            <CoursesCards />
          </div>
        </div>
        <div className="col-span-12 xl:col-span-4">
          <AssignmentsList />
        </div>
      </div>
    </>
  );
}