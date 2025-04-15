import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Homepage from "./pages/Dashboard/Homepage";
import LandingPage from "./pages/admin-dashboard/Overview";

// Professor Pages
import ProfessorOverview from "./pages/teacher-dashboard/Overview";
import TimeTableProfessor from "./pages/teacher-dashboard/TimeTable";
import Grading from "./pages/teacher-dashboard/Grading";

// Student Pages
import StudentOverview from "./pages/student-specific/Overview";
import TimeTableStudent from "./pages/student-specific/TimeTable";
import AttendanceRecords from "./pages/student-specific/AttendanceRecords";
import Feedback from "./pages/student-specific/Feedback";
import Grades from "./pages/student-specific/Grades";

// TODO: this will read from the struct saved
const someOneLoggedIn = true;

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route
            element={someOneLoggedIn ? <AppLayout /> : null}
          >
            <Route
              index
              path="/"
              element={someOneLoggedIn ? <Home /> : <Homepage />}
            />
            <Route path="/landing-page" element={<LandingPage />} />

            {/* Dashboard Pages */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          
            {/* Professor Pages */}
            <Route path="/professor-overview" element={<ProfessorOverview />} />
            <Route path="/timetable-professor" element={<TimeTableProfessor />} />
            <Route path="/grading" element={<Grading />} />


            {/* Student Pages */}
            <Route path="/student-overview" element={<StudentOverview />} />
            <Route path="/timetable-student" element={<TimeTableStudent />} />
            <Route path="/attendance-records" element={<AttendanceRecords />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/grades" element={<Grades />} />

          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
