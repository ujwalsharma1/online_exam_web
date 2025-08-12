import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard"; 
import CreateTest from "./pages/teacher/CreateTest";
import EditTests from "./pages/teacher/EditTests";
import ViewResults from "./pages/teacher/ViewResults";
import ViewStudents from "./pages/teacher/ViewStudents";
import EditTestForm from "./pages/teacher/EditTestForm";
import Profile from "./pages/teacher/Profile";
import AttemptTest from './pages/student/AttemptTest'; 
import AvailableTests from './pages/student/AvailableTests';
import PastResults from './pages/student/PastResults';
import StudentProfile from './pages/student/StudentProfile';

const App = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/student-dashboard"
        element={
          isAuthenticated ? <StudentDashboard /> : <Navigate to="/login" />
        }
      >
        <Route path="available-tests" element={<AvailableTests />} />
        <Route path="past-results" element={<PastResults />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      <Route
        path="/test/:attemptId"
        element={isAuthenticated ? <AttemptTest /> : <Navigate to="/login" />}
      />

     
      <Route
        path="/teacher-dashboard"
        element={isAuthenticated ? <TeacherDashboard /> : <Navigate to="/login" />}
      >
        <Route path="create-test" element={<CreateTest />} />
        <Route path="edit-tests" element={<EditTests />} />
        <Route path="results" element={<ViewResults />} />
        <Route path="profile" element={<Profile />} />
        <Route path="students" element={<ViewStudents />} />
        <Route path="edit-test/:testId" element={<EditTestForm />} />

        
      </Route>
    </Routes>
  );
};

export default App;
