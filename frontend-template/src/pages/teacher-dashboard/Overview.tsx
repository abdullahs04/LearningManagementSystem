import ProfessorMetrics from "../../components/teacher-specific/ProfessorMetrics";
import AssignmentsList from "../../components/teacher-specific/AssignmentsList";
import CoursesCards from "../../components/teacher-specific/CoursesCards";
import PageMeta from "../../components/common/PageMeta";

export default function ProfessorOverview() {
  return (
    <>
      <PageMeta
        title="LGS Professor Dashboard"
        description="This is the Overview page for the LGS Professor Dashboard"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <h2 className="col-span-12 text-2xl font-bold mb-4 dark:text-white">Professor's Dashboard</h2>
        <div className="col-span-12 xl:col-span-8">
          <ProfessorMetrics />
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