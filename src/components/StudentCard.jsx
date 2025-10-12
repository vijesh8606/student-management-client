import React from "react";
import { Link } from "react-router-dom";
import { Edit2, Trash2, User } from "lucide-react";

const StudentCard = ({ student, onDelete }) => {
  const getGradeColor = (grade) => {
    const colors = {
      "A+": "bg-green-100 text-green-800",
      A: "bg-green-50 text-green-700",
      B: "bg-blue-100 text-blue-800",
      C: "bg-yellow-100 text-yellow-800",
      D: "bg-orange-100 text-orange-800",
      F: "bg-red-100 text-red-800",
    };
    return colors[grade] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="text-primary-600" size={24} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {student.name}
            </h3>
            <p className="text-sm text-gray-500">{student.email}</p>
            <p className="text-sm font-medium text-primary-600">
              {student.course}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <Link
            to={`/students/edit/${student._id}`}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
          >
            <Edit2 size={16} />
          </Link>
          <button
            onClick={() => onDelete(student._id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">
            Subjects & Marks
          </h4>
          <div className="space-y-1">
            {student.subjects.map((subject, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">{subject.name}</span>
                <span className="font-medium text-gray-900">
                  {subject.marks}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">
            Performance
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Marks:</span>
              <span className="font-medium">{student.totalMarks}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Average:</span>
              <span className="font-medium">
                {student.average?.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Grade:</span>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getGradeColor(
                  student.grade
                )}`}
              >
                {student.grade}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
