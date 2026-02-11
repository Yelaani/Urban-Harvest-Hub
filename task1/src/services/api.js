// Task 1: This file is kept for external API calls only (e.g., weather)
// For Task 1, we use local JSON data, not backend API
// This file may not be needed, but is kept for consistency

import axios from 'axios';

// No baseURL - used only for external APIs (not our backend)
const api = axios.create();

export default api;
