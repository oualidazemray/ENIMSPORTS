import React from "react";
import AdminDashboard from "./components/admin/AdminDashboard"; // Import your component
import StudentDashboard from "./components/student/StudentDashboard";
import OrganizerDashboard from "./components/organizer/page";
const Page = () => {
  return (
    <div>
      <h1>Organizer Dashboard</h1>
      <OrganizerDashboard />
      <h1>Admin Dashboard </h1>
      <AdminDashboard />
      <h1>Student Dashboard</h1>
      <StudentDashboard />
    </div>
  );
};

export default Page;
