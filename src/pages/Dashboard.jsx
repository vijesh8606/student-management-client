import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudents, deleteStudent } from "../redux/slices/studentSlice";
import StudentCard from "../components/StudentCard";
import {
  Search,
  Users,
  BookOpen,
  Filter,
  Loader,
  Plus,
  GraduationCap,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Dashboard = () => {
  const dispatch = useDispatch();
  const {
    items: students,
    isLoading,
    error,
  } = useSelector((state) => state.students);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("");

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await dispatch(deleteStudent(id)).unwrap();
        toast.success("Student deleted successfully");
      } catch (error) {
        toast.error("Failed to delete student");
      }
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = !filterCourse || student.course === filterCourse;
    return matchesSearch && matchesCourse;
  });

  const courses = [...new Set(students.map((student) => student.course))];

  // Calculate average performance
  const averagePerformance =
    students.length > 0
      ? (
          students.reduce((acc, student) => acc + student.average, 0) /
          students.length
        ).toFixed(1)
      : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text ">
            Student Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and track student performance analytics
          </p>
        </div>

        <Link
          to="/students/new"
          className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <Plus size={20} className="mr-2" />
          Add New Student
        </Link>
      </div>

      {/* Stats Cards - Only 3 cards as requested */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-sm border border-blue-200 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-sm">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-blue-700 uppercase tracking-wide">
                Total Students
              </h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {students.length}
              </p>
              <p className="text-xs text-blue-600 mt-1">Registered in system</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl shadow-sm border border-green-200 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-sm">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-green-700 uppercase tracking-wide">
                Active Courses
              </h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {courses.length}
              </p>
              <p className="text-xs text-green-600 mt-1">Across all students</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl shadow-sm border border-purple-200 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-sm">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-purple-700 uppercase tracking-wide">
                Avg Performance
              </h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {averagePerformance}%
              </p>
              <p className="text-xs text-purple-600 mt-1">Overall average</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search students by name, email, or course..."
                className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 placeholder-gray-500 transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white w-full sm:w-48 transition-all duration-200"
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
              >
                <option value="">All Courses</option>
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-4">
              <span className="text-sm text-gray-500 whitespace-nowrap">
                Showing {filteredStudents.length} of {students.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Students Grid */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white p-16 rounded-2xl shadow-sm border border-gray-200 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">
            {students.length === 0
              ? "Welcome to Student Management"
              : "No students found"}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            {students.length === 0
              ? "Get started by adding your first student to the system."
              : "No students match your search criteria. Try adjusting your filters."}
          </p>
          {students.length === 0 && (
            <Link
              to="/students/new"
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
            >
              <Plus size={20} className="mr-2" />
              Add Your First Student
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student._id}
              student={student}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
