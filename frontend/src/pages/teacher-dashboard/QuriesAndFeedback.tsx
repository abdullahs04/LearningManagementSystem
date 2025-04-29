import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";

// TODO remove inconsistency and also improve logc, just an basic template

interface Query {
    id: number;
    studentName: string;
    studentId: string;
    courseCode: string;
    courseName: string;
    subject: string;
    message: string;
    date: string;
    status: "pending" | "answered" | "closed";
    response?: string;
}

interface Feedback {
    id: number;
    courseCode: string;
    courseName: string;
    instructor: string;
    semester: string;
    submissionDate: string;
    aspects: string[];
    difficultyLevel: string;
    courseRating: number;
    instructorRating: number;
    comments: string;
    attachments?: string[];
}

export default function QueriesAndFeedback() {
    const [activeTab, setActiveTab] = useState<"queries" | "feedback">("queries");
    const { isOpen, openModal, closeModal } = useModal();
    const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
    const [response, setResponse] = useState("");
    const [viewMode, setViewMode] = useState<"list" | "detail">("list");

    // Sample queries data
    const queries: Query[] = [
        {
            id: 1,
            studentName: "Alice Johnson",
            studentId: "2021-CS-101",
            courseCode: "CS101",
            courseName: "Introduction to Computer Science",
            subject: "Assignment 3 Deadline Extension",
            message: "I would like to request an extension for Assignment 3 due to medical issues. I've attached my medical certificate for reference.",
            date: "2023-05-10",
            status: "pending"
        },
        {
            id: 2,
            studentName: "Bob Smith",
            studentId: "2021-CS-102",
            courseCode: "CS101",
            courseName: "Introduction to Computer Science",
            subject: "Clarification on Project Requirements",
            message: "I'm confused about the requirements for the final project. Could you please clarify what you meant by 'implement at least three design patterns'?",
            date: "2023-05-08",
            status: "answered",
            response: "Hello Bob, by 'implement at least three design patterns', I mean you should use design patterns like Singleton, Factory, Observer, etc. in your project. Please refer to Chapter 5 of our textbook for examples."
        },
        {
            id: 3,
            studentName: "Carol Williams",
            studentId: "2021-CS-103",
            courseCode: "CS202",
            courseName: "Data Structures",
            subject: "Error in Lab Manual",
            message: "I believe there's an error in this week's lab manual. On page 12, the algorithm for Red-Black Trees has incorrect balancing steps.",
            date: "2023-05-12",
            status: "closed",
            response: "Thank you for bringing this to our attention. You're right, there's an error in the balancing steps. We've updated the lab manual and uploaded a corrected version to the course website."
        }
    ];

    // Sample feedback data
    const feedback: Feedback[] = [
        {
            id: 1,
            courseCode: "CS101",
            courseName: "Introduction to Computer Science",
            instructor: "Dr. Sarah Johnson",
            semester: "Spring 2023",
            submissionDate: "2023-06-01",
            aspects: ["Course Content", "Teaching Methods", "Assignments & Tests"],
            difficultyLevel: "Moderate",
            courseRating: 4,
            instructorRating: 5,
            comments: "The course was well-structured and the professor explained complex concepts in a clear manner. The assignments were challenging but helpful for understanding the material."
        },
        {
            id: 2,
            courseCode: "CS202",
            courseName: "Data Structures",
            instructor: "Dr. James Wilson",
            semester: "Spring 2023",
            submissionDate: "2023-06-02",
            aspects: ["Course Content", "Course Pacing"],
            difficultyLevel: "Challenging",
            courseRating: 3,
            instructorRating: 4,
            comments: "The course moved too quickly through some important topics. More time spent on trees and graphs would have been helpful."
        }
    ];

    const handleOpenQueryResponse = (query: Query) => {
        setSelectedQuery(query);
        setResponse(query.response || "");
        openModal();
    };

    const handleViewFeedback = (feedback: Feedback) => {
        setSelectedFeedback(feedback);
        setViewMode("detail");
    };

    const handleSubmitResponse = () => {
        if (!selectedQuery) return;
        
        // In a real application, you would update this in your database
        // This is just a simulation for the UI
        const updatedQuery = {
            ...selectedQuery,
            status: "answered" as const,
            response: response
        };
        
        // Find and update the query in our local data
        const queryIndex = queries.findIndex(q => q.id === selectedQuery.id);
        if (queryIndex !== -1) {
            queries[queryIndex] = updatedQuery;
        }
        
        closeModal();
    };

    const handleBackToList = () => {
        setViewMode("list");
        setSelectedFeedback(null);
    };

    const renderStarRating = (rating: number, maxRating: number = 5) => {
        return (
            <div className="flex">
                {[...Array(maxRating)].map((_, index) => (
                    <svg 
                        key={index}
                        className={`h-5 w-5 ${index < rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                ))}
            </div>
        );
    };

    const getStatusBadge = (status: string) => {
        if (status === "answered") {
            return <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">Answered</span>;
        } else if (status === "closed") {
            return <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Closed</span>;
        } else {
            return <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Pending</span>;
        }
    };

    return (
        <>
            <PageMeta
                title="Queries & Feedback"
                description="Manage student queries and view course feedback"
            />
            
            {/* Header Section */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="space-y-6">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Queries & Feedback</h1>
                            <p className="mt-1 text-gray-600 dark:text-gray-400">
                                Respond to student queries and review course feedback
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab("queries")}
                        className={`whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium ${
                            activeTab === "queries"
                                ? "border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300"
                        }`}
                    >
                        Student Queries
                    </button>
                    <button
                        onClick={() => setActiveTab("feedback")}
                        className={`whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium ${
                            activeTab === "feedback"
                                ? "border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300"
                        }`}
                    >
                        Course Feedback
                    </button>
                </nav>
            </div>

            {activeTab === "queries" && (
                <div className="mt-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                    <div className="p-5 lg:p-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Student Queries</h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Respond to student questions and requests
                        </p>
                    </div>
                    
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Student</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Course</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Subject</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900/[0.025]">
                                {queries.map((query) => (
                                    <tr key={query.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex flex-col">
                                                <div className="font-medium text-gray-900 dark:text-white">{query.studentName}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{query.studentId}</div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">
                                            {query.courseCode}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                            <div className="max-w-xs truncate">{query.subject}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">
                                            {query.date}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            {getStatusBadge(query.status)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-center">
                                            <Button
                                                onClick={() => handleOpenQueryResponse(query)}
                                                className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                                            >
                                                {query.status === "pending" ? "Respond" : "View"}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === "feedback" && viewMode === "list" && (
                <div className="mt-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                    <div className="p-5 lg:p-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Course Feedback</h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Review end-of-semester student feedback for your courses
                        </p>
                    </div>
                    
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Course</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Semester</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Submitted</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Course Rating</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Instructor Rating</th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900/[0.025]">
                                {feedback.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex flex-col">
                                                <div className="font-medium text-gray-900 dark:text-white">{item.courseCode}: {item.courseName}</div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">
                                            {item.semester}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">
                                            {item.submissionDate}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            {renderStarRating(item.courseRating)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            {renderStarRating(item.instructorRating)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-center">
                                            <Button
                                                onClick={() => handleViewFeedback(item)}
                                                className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                                            >
                                                View Details
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === "feedback" && viewMode === "detail" && selectedFeedback && (
                <div className="mt-6 space-y-6">
                    <div className="flex justify-between">
                        <Button
                            onClick={handleBackToList}
                            className="inline-flex items-center rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to List
                        </Button>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-gray-200 pb-6 dark:border-gray-700 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedFeedback.courseCode}: {selectedFeedback.courseName}</h2>
                                <p className="mt-1 text-gray-600 dark:text-gray-400">{selectedFeedback.semester}</p>
                            </div>
                            <div className="text-right">
                                <span className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                    Submitted on {selectedFeedback.submissionDate}
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Aspects Reviewed</h3>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {selectedFeedback.aspects.map((aspect, index) => (
                                            <span key={index} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                                {aspect}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Course Difficulty</h3>
                                    <p className="mt-2 text-base text-gray-900 dark:text-white">{selectedFeedback.difficultyLevel}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ratings</h3>
                                    <div className="mt-2 space-y-3">
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700 dark:text-gray-300">Course Content</span>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedFeedback.courseRating}/5</span>
                                            </div>
                                            <div className="mt-1">{renderStarRating(selectedFeedback.courseRating)}</div>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700 dark:text-gray-300">Instructor</span>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedFeedback.instructorRating}/5</span>
                                            </div>
                                            <div className="mt-1">{renderStarRating(selectedFeedback.instructorRating)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Student Comments</h3>
                                <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                                    <p className="text-sm text-gray-900 dark:text-white whitespace-pre-line">
                                        {selectedFeedback.comments}
                                    </p>
                                </div>

                                {selectedFeedback.attachments && selectedFeedback.attachments.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Attachments</h3>
                                        <ul className="mt-2 space-y-2">
                                            {selectedFeedback.attachments.map((attachment, index) => (
                                                <li key={index} className="flex items-center rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800/50">
                                                    <svg className="mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                    </svg>
                                                    <span className="text-sm text-blue-600 hover:underline dark:text-blue-400">{attachment}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Query Response Modal */}
            {selectedQuery && (
                <Modal isOpen={isOpen} onClose={closeModal}>
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {selectedQuery.status === "pending" ? "Respond to Query" : "Query Details"}
                        </h3>
                        <div className="mt-4 space-y-4">
                            <div>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Student</div>
                                <div className="mt-1 text-sm text-gray-900 dark:text-white">{selectedQuery.studentName} ({selectedQuery.studentId})</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Course</div>
                                <div className="mt-1 text-sm text-gray-900 dark:text-white">{selectedQuery.courseCode}: {selectedQuery.courseName}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Subject</div>
                                <div className="mt-1 text-sm text-gray-900 dark:text-white">{selectedQuery.subject}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Message</div>
                                <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                                    {selectedQuery.message}
                                </div>
                            </div>
                            
                            {selectedQuery.status !== "pending" ? (
                                <div>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Your Response</div>
                                    <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                                        {selectedQuery.response}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label htmlFor="response" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Your Response
                                    </label>
                                    <textarea
                                        id="response"
                                        rows={5}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400 sm:text-sm"
                                        placeholder="Type your response here..."
                                        value={response}
                                        onChange={(e) => setResponse(e.target.value)}
                                    ></textarea>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 p-4 dark:border-gray-700">
                        <Button
                            onClick={closeModal}
                            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        >
                            Close
                        </Button>
                        {selectedQuery.status === "pending" && (
                            <Button
                                onClick={handleSubmitResponse}
                                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                                disabled={!response.trim()}
                            >
                                Submit Response
                            </Button>
                        )}
                    </div>
                </Modal>
            )}
        </>
    );
}