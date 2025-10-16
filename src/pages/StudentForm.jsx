import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  createStudent,
  updateStudent,
  fetchStudents,
} from "../redux/slices/studentSlice";
import { ArrowLeft, Plus, Trash2, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const StudentForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: students, isLoading } = useSelector((state) => state.students);

  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
    batchYear: "",
    subjects: [{ name: "", marks: "" }],
  });

  useEffect(() => {
    if (isEdit && students.length === 0) {
      dispatch(fetchStudents());
    }
  }, [isEdit, students.length, dispatch]);

  useEffect(() => {
    if (isEdit && students.length > 0) {
      const student = students.find((s) => s._id === id);
      if (student) {
        setFormData({
          name: student.name,
          email: student.email,
          course: student.course,
          batchYear: student.batchYear,
          subjects: student.subjects.map((sub) => ({
            name: sub.name,
            marks: sub.marks.toString(),
          })),
        });
      }
    }
  }, [isEdit, id, students]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubjectChange = (index, field, value) => {
    const newSubjects = [...formData.subjects];
    newSubjects[index][field] = value;
    setFormData({
      ...formData,
      subjects: newSubjects,
    });
  };

  const addSubject = () => {
    setFormData({
      ...formData,
      subjects: [...formData.subjects, { name: "", marks: "" }],
    });
  };

  const removeSubject = (index) => {
    if (formData.subjects.length > 1) {
      const newSubjects = formData.subjects.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        subjects: newSubjects,
      });
    }
  };

  const validateForm = () => {
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.course.trim() ||
      !formData.batchYear
    ) {
      toast.error("Please fill in all required fields");
      return false;
    }

    // Validate batch year format (YYYY-YYYY)
    const batchYearRegex = /^\d{4}-\d{4}$/;
    if (!batchYearRegex.test(formData.batchYear)) {
      toast.error(
        "Please enter batch year in correct format: YYYY-YYYY (e.g., 2020-2024)"
      );
      return false;
    }

    // Validate that start year is less than end year
    const [startYear, endYear] = formData.batchYear.split("-").map(Number);
    if (startYear >= endYear) {
      toast.error("Start year must be less than end year");
      return false;
    }

    for (const subject of formData.subjects) {
      if (!subject.name.trim() || !subject.marks) {
        toast.error("Please fill in all subject fields");
        return false;
      }

      const marks = parseInt(subject.marks);
      if (isNaN(marks) || marks < 0 || marks > 100) {
        toast.error("Marks must be between 0 and 100");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submitData = {
      ...formData,
      subjects: formData.subjects.map((subject) => ({
        name: subject.name,
        marks: parseInt(subject.marks),
      })),
    };

    try {
      if (isEdit) {
        await dispatch(updateStudent({ id, studentData: submitData })).unwrap();
        toast.success("Student updated successfully");
      } else {
        await dispatch(createStudent(submitData)).unwrap();
        toast.success("Student created successfully");
      }
      navigate("/students");
    } catch (error) {
      toast.error(error || `Failed to ${isEdit ? "update" : "create"} student`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          to="/students"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? "Edit Student" : "Add New Student"}
          </h1>
          <p className="text-gray-600">
            {isEdit
              ? "Update student information"
              : "Create a new student record"}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
      >
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name *
                </label>
                <input
                  placeholder="Enter Full Name"
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address *
                </label>
                <input
                  placeholder="Enter Email ID of student"
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="course"
                  className="block text-sm font-medium text-gray-700"
                >
                  Course *
                </label>
                <input
                  type="text"
                  id="course"
                  name="course"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="e.g., MCA, MBA, B.Tech..."
                />
              </div>

              <div>
                <label
                  htmlFor="batchYear"
                  className="block text-sm font-medium text-gray-700"
                >
                  Batch Year *
                </label>
                <input
                  type="text"
                  id="batchYear"
                  name="batchYear"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  value={formData.batchYear}
                  onChange={handleChange}
                  placeholder="e.g., 2020-2024"
                  pattern="\d{4}-\d{4}"
                  title="Enter batch year in format: YYYY-YYYY"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter batch year in format: YYYY-YYYY (e.g., 2020-2024)
                </p>
              </div>
            </div>
          </div>

          {/* Subjects */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Subjects & Marks
              </h3>
              <button
                type="button"
                onClick={addSubject}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-primary-50 hover:bg-primary-100"
              >
                <Plus size={16} className="mr-1" />
                Add Subject
              </button>
            </div>

            <div className="space-y-4">
              {formData.subjects.map((subject, index) => (
                <div
                  key={index}
                  className="flex items-end space-x-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                      value={subject.name}
                      onChange={(e) =>
                        handleSubjectChange(index, "name", e.target.value)
                      }
                      placeholder="e.g., Mathematics, Physics, Computer Science"
                    />
                  </div>

                  <div className="w-32">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marks in %*
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      required
                      className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                      value={subject.marks}
                      onChange={(e) =>
                        handleSubjectChange(index, "marks", e.target.value)
                      }
                      placeholder="0-100"
                    />
                  </div>

                  {formData.subjects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSubject(index)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors mb-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Link
              to="/students"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader className="animate-spin h-4 w-4" />
              ) : isEdit ? (
                "Update Student"
              ) : (
                "Create Student"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
