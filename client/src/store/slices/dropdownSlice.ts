import authAxios from "@/api/axios.config";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

type DropdownItem = { label: string; value: string } | any;

// Async Thunks
export const fetchRoles = createAsyncThunk(
  "dropdowns/fetchCountries",
  async () => {
    const response = await authAxios.get("settings/role"); // Your API call
    if (response.data.status) {
      return response.data.data;
    }
    return [];
  }
);

export const fetchContacts = createAsyncThunk(
  "dropdowns/fetchCategories",
  async () => {
    const response = await authAxios.get("contact/list"); // Your API call
    if (response.data.status) {
      return response.data.data;
    }
    return [];
  }
);

interface OptionsData<T = DropdownItem> {
  data: T[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

interface IDropdownSlice {
  roleList: OptionsData;
  contactList: OptionsData;
}

const initialState: IDropdownSlice = {
  roleList: {
    data: [],
    status: "idle",
    error: null,
  },
  contactList: {
    data: [],
    status: "idle",
    error: null,
  },
};

const dropdownsSlice = createSlice({
  name: "dropdowns",
  initialState,
  reducers: {
    // You might have reducers for clearing data if needed
    clearDropdownData: (
      state,
      action: PayloadAction<{ dropdownName: keyof IDropdownSlice }>
    ) => {
      const { dropdownName } = action.payload;
      state[dropdownName] = {
        data: [],
        status: "idle",
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    // Handle fetchCountries
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.roleList.status = "loading";
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.roleList.status = "succeeded";
        state.roleList.data = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.roleList.status = "failed";
        state.roleList.error = action.error.message ?? "Failed to fetch roles";
      });

    // Handle fetchCategories
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.contactList.status = "loading";
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.contactList.status = "succeeded";
        state.contactList.data = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.contactList.status = "failed";
        state.contactList.error =
          action.error.message ?? "Failed to fetch contacts";
      });

    // ... add cases for other async thunks
  },
});

export const { clearDropdownData } = dropdownsSlice.actions;
export default dropdownsSlice.reducer;
