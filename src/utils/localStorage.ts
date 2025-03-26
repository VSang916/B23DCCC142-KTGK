import { AppState } from '../types';

const STORAGE_KEY = 'study_tracker_data';

export const loadState = (): AppState => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (!serializedState) {
      return {
        subjects: [
          { id: '1', name: 'Toán' },
          { id: '2', name: 'Văn' },
          { id: '3', name: 'Anh' },
          { id: '4', name: 'Khoa học' },
          { id: '5', name: 'Công nghệ' },
        ],
        studySessions: [],
        monthlyGoals: [],
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state:', err);
    return {
      subjects: [],
      studySessions: [],
      monthlyGoals: [],
    };
  }
};

export const saveState = (state: AppState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error('Error saving state:', err);
  }
};