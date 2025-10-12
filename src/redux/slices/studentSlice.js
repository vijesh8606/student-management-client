import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { studentAPI } from "../../services/api";

export const fetchStudents = createAsyncThunk(
  "students/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await studentAPI.getAll();
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createStudent = createAsyncThunk(
  "students/create",
  async (studentData, { rejectWithValue }) => {
    try {
      const response = await studentAPI.create(studentData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateStudent = createAsyncThunk(
  "students/update",
  async ({ id, studentData }, { rejectWithValue }) => {
    try {
      const response = await studentAPI.update(id, studentData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteStudent = createAsyncThunk(
  "students/delete",
  async (id, { rejectWithValue }) => {
    try {
      await studentAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const studentSlice = createSlice({
  name: "students",
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all students
      .addCase(fetchStudents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create student
      .addCase(createStudent.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update student
      .addCase(updateStudent.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (student) => student._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete student
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (student) => student._id !== action.payload
        );
      });
  },
});

export const { clearError } = studentSlice.actions;
export default studentSlice.reducer;
