import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState: { bookmarkedJobs: [] },
  reducers: {
    setBookmarks: (state, action) => {
      state.bookmarkedJobs = action.payload;
    },
    addBookmark: (state, action) => {
      const existingJob = state.bookmarkedJobs.find(
        (job) => job.id === action.payload.id
      );
      
      if (!existingJob) {
        state.bookmarkedJobs.push(action.payload);
        AsyncStorage.setItem('bookmarks', JSON.stringify(state.bookmarkedJobs));
      }
    },
    removeBookmark: (state, action) => {
      state.bookmarkedJobs = state.bookmarkedJobs.filter(
        (job) => job.id !== action.payload.id
      );
      AsyncStorage.setItem('bookmarks', JSON.stringify(state.bookmarkedJobs));
    },
  },
});

// Async function to load bookmarks from AsyncStorage when the app starts
export const loadBookmarks = () => async (dispatch) => {
  try {
    const storedBookmarks = await AsyncStorage.getItem('bookmarks');
    if (storedBookmarks) {
      dispatch(setBookmarks(JSON.parse(storedBookmarks)));
    }
  } catch (error) {
    console.error("Failed to load bookmarks from AsyncStorage:", error);
  }
};

export const { setBookmarks, addBookmark, removeBookmark } = bookmarksSlice.actions;
export default bookmarksSlice.reducer;
