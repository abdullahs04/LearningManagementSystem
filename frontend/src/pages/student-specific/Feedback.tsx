import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";

// TODO make only 2 options for review and submission and rest for  and fix UI problems
// TODO import data form the local storage

export default function Feedback() {
  const [selectedCourse, setSelectedCourse] = useState(null);
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
    { id: 4, code: "ENG105", name: "Technical Writing", instructor: "Prof. Emily Rodriguez", status: "completed", progress: 100 },
    { id: 5, code: "CHEM101", name: "General Chemistry", instructor: "Dr. James Thompson", status: "ongoing", progress: 45 },
  ];

  const handleOpenModal = (course, type) => {
    setSelectedCourse(course);
    setFeedbackType(type);
    openModal();
  };

  const handleRatingChange = (category, value) => {
    setRating({ ...rating, [category]: value });
  };

  const getCourseStatusBadge = (status) => {
    if (status === "completed") {
      return <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">Completed</span>;
    } else {
      return <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Ongoing</span>;
    }
  };

  // Star rating component
  const StarRating = ({ category, value, onChange }) => {
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

  // Custom feedback form based on feedback type
  const renderFeedbackForm = () => {
    if (!selectedCourse) return null;

    return (
      <div className="space-y-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {feedbackType === "review" && "Course Review"}
            {feedbackType === "complaint" && "Submit Complaint"}
            {feedbackType === "feedback" && "Course Feedback"}
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

        {/* Common fields for all feedback types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder="Enter a brief title"
          />
        </div>

        {/* Feedback type specific fields */}
        {feedbackType === "review" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                What aspects of the course are you reviewing?
              </label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    id="course-content"
                    name="review-aspect"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-400"
                  />
                  <label htmlFor="course-content" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Course Content
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="teaching-methods"
                    name="review-aspect"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-400"
                  />
                  <label htmlFor="teaching-methods" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Teaching Methods
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="assignments"
                    name="review-aspect"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-400"
                  />
                  <label htmlFor="assignments" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Assignments & Tests
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="course-pacing"
                    name="review-aspect"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-400"
                  />
                  <label htmlFor="course-pacing" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Course Pacing
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                How would you rate the difficulty of this course so far?
              </label>
              <div className="mt-2">
                <select className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm">
                  <option value="">Select difficulty level</option>
                  <option value="very-easy">Very Easy</option>
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="difficult">Difficult</option>
                  <option value="very-difficult">Very Difficult</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Rate your experience so far
              </label>
              <div className="mt-2 grid grid-cols-1 gap-y-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Course Content</label>
                  <StarRating category="content" value={rating.content} onChange={handleRatingChange} />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Instructor</label>
                  <StarRating category="instructor" value={rating.instructor} onChange={handleRatingChange} />
                </div>
              </div>
            </div>
          </>
        )}

        {feedbackType === "complaint" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Complaint Category
              </label>
              <select className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm">
                <option value="">Select a category</option>
                <option value="technical">Technical Issues</option>
                <option value="grading">Grading Concerns</option>
                <option value="course-material">Course Material Problems</option>
                <option value="communication">Communication Issues</option>
                <option value="schedule">Scheduling Conflicts</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Priority Level
              </label>
              <div className="mt-2">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      id="priority-low"
                      name="priority"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-400"
                    />
                    <label htmlFor="priority-low" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Low
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="priority-medium"
                      name="priority"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-400"
                    />
                    <label htmlFor="priority-medium" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Medium
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="priority-high"
                      name="priority"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-400"
                    />
                    <label htmlFor="priority-high" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      High
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="priority-urgent"
                      name="priority"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-400"
                    />
                    <label htmlFor="priority-urgent" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Urgent
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                When did this issue occur?
              </label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
              />
            </div>
          </>
        )}

        {feedbackType === "feedback" && (
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
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Overall Experience</label>
                  <StarRating category="overall" value={rating.overall} onChange={handleRatingChange} />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                What aspects of the course were most valuable to your learning?
              </label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    id="value-lectures"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-400"
                  />
                  <label htmlFor="value-lectures" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Lectures
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="value-assignments"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-400"
                  />
                  <label htmlFor="value-assignments" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Assignments
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="value-discussions"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-400"
                  />
                  <label htmlFor="value-discussions" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Class Discussions
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="value-materials"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-400"
                  />
                  <label htmlFor="value-materials" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Course Materials
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="value-group"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-400"
                  />
                  <label htmlFor="value-group" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Group Projects
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Would you recommend this course to other students?
              </label>
              <div className="mt-2">
                <select className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm">
                  <option value="">Select an option</option>
                  <option value="definitely">Definitely</option>
                  <option value="probably">Probably</option>
                  <option value="unsure">Unsure</option>
                  <option value="probably-not">Probably Not</option>
                  <option value="definitely-not">Definitely Not</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* Description field for all types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {feedbackType === "review" && "Share your thoughts about the course"}
            {feedbackType === "complaint" && "Describe the issue in detail"}
            {feedbackType === "feedback" && "Additional comments or suggestions"}
          </label>
          <textarea
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder="Please provide details..."
          />
        </div>

        {/* File upload for all types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Attachments (Optional)
          </label>
          <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 dark:border-gray-700">
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, PDF up to 10MB
              </p>
            </div>
          </div>
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
            Submit
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
      
      {/* Courses List */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-5 lg:p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Your Courses</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Select a course to provide feedback, submit a review, or file a complaint.
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
                  {course.status === "ongoing" && (
                    <>
                      <Button
                        onClick={() => handleOpenModal(course, "review")}
                        className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                      >
                        Review
                      </Button>
                      <Button
                        onClick={() => handleOpenModal(course, "complaint")}
                        className="rounded-md bg-yellow-600 px-3 py-2 text-sm font-medium text-white hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600"
                      >
                        Complaint
                      </Button>
                    </>
                  )}
                  {course.status === "completed" && (
                    <Button
                      onClick={() => handleOpenModal(course, "feedback")}
                      className="rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                    >
                      Submit Feedback
                    </Button>
                  )}
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