import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";

export default function Feedback() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [feedbackType, setFeedbackType] = useState("");
  const { isOpen, openModal, closeModal } = useModal();
  const [rating, setRating] = useState({
    content: 0,
    instructor: 0,
    difficulty: 0,
    overall: 0,
  });

  // Sample courses data
  const courses = [
    { id: 1, code: "CS101", name: "Introduction to Computer Science", instructor: "Dr. Sarah Johnson", status: "ongoing", progress: 70 },
    { id: 2, code: "MATH201", name: "Calculus II", instructor: "Prof. Robert Chen", status: "ongoing", progress: 65 },
    { id: 3, code: "PHY102", name: "Physics for Engineers", instructor: "Dr. Michael Williams", status: "completed", progress: 100 },
  ];

  interface Course {
    id: number;
    code: string;
    name: string;
    instructor: string;
    status: string;
    progress: number;
  }

  const handleOpenModal = (course: Course, type: string) => {
    setSelectedCourse(course);
    setFeedbackType(type);
    openModal();
  };

  const handleRatingChange = (category: string, value: number) => {
    setRating({ ...rating, [category]: value });
  };

  const getCourseStatusBadge = (status: string) => {
    return status === "completed" 
      ? <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">Completed</span>
      : <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Ongoing</span>;
  };

  const StarRating = ({ category, value, onChange }: { category: string; value: number; onChange: (category: string, value: number) => void }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(category, star)}
            className={`h-8 w-8 focus:outline-none ${
              star <= value ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  const renderFeedbackForm = () => {
    if (!selectedCourse) return null;

    return (
      <div className="space-y-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {feedbackType === "feedback" ? "Course Feedback" : "Submit Complaint"}
          </h3>
          
          <div className="mt-2 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <div className="flex items-center">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">{selectedCourse.code}: {selectedCourse.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Instructor: {selectedCourse.instructor}</p>
                <div className="mt-1">{getCourseStatusBadge(selectedCourse.status)}</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder={feedbackType === "feedback" ? "Feedback title" : "Complaint title"}
          />
        </div>

        {feedbackType === "feedback" ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Overall Course Rating
              </label>
              <div className="mt-2 space-y-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Course Content</label>
                  <StarRating category="content" value={rating.content} onChange={handleRatingChange} />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Instructor Effectiveness</label>
                  <StarRating category="instructor" value={rating.instructor} onChange={handleRatingChange} />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Course Difficulty</label>
                  <StarRating category="difficulty" value={rating.difficulty} onChange={handleRatingChange} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Would you recommend this course?
              </label>
              <select className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm">
                <option value="">Select recommendation</option>
                <option value="strongly-agree">Strongly Agree</option>
                <option value="agree">Agree</option>
                <option value="neutral">Neutral</option>
                <option value="disagree">Disagree</option>
                <option value="strongly-disagree">Strongly Disagree</option>
              </select>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Complaint Type
              </label>
              <select className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm">
                <option value="">Select complaint category</option>
                <option value="technical">Technical Issues</option>
                <option value="content">Course Content</option>
                <option value="instruction">Instruction Quality</option>
                <option value="grading">Grading Concerns</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Urgency Level
              </label>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <label className="flex items-center space-x-2 rounded-lg border p-3 hover:border-blue-500">
                  <input type="radio" name="urgency" className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Normal (72h response)</span>
                </label>
                <label className="flex items-center space-x-2 rounded-lg border p-3 hover:border-blue-500">
                  <input type="radio" name="urgency" className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Urgent (24h response)</span>
                </label>
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {feedbackType === "feedback" ? "Detailed Feedback" : "Complaint Details"}
          </label>
          <textarea
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder={feedbackType === "feedback" 
              ? "What did you like or dislike about this course?"
              : "Please describe your complaint in detail..."}
          />
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button
            onClick={closeModal}
            className="rounded-md border border-gray-300 bg-gray px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:ring-gray-600"
          >
            Cancel
          </Button>
          <Button 
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            {feedbackType === "feedback" ? "Submit Feedback" : "Submit Complaint"}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <PageMeta
        title="Feedback and Reviews"
        description="This is the Feedback and Reviews page for the LGS Students Dashboard"
      />
      
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-5 lg:p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Your Courses</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Select a course to provide feedback or file a complaint
          </p>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {courses.map((course) => (
            <div key={course.id} className="p-5 lg:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                  <div className="flex items-center">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">
                      {course.code}: {course.name}
                    </h3>
                    <div className="ml-2">
                      {getCourseStatusBadge(course.status)}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Instructor: {course.instructor}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleOpenModal(course, "feedback")}
                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                  >
                    Feedback
                  </Button>
                  <Button
                    onClick={() => handleOpenModal(course, "complaint")}
                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                  >
                    Complaint
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedCourse && (
        <Modal isOpen={isOpen} onClose={closeModal}>
          <div className="max-h-[80vh] overflow-y-auto p-6">
            {renderFeedbackForm()}
          </div>
        </Modal>
      )}
    </>
  );
}