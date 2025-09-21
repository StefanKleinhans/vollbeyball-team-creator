import axios from 'axios';

const API_BASE_URL = '/app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userProfile');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Login
  login: async (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await api.post('/auth/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userProfile');
  },
};

export const playerService = {
  // Get all players
  getAllPlayers: async () => {
    const response = await api.get('/player/all');
    return response.data;
  },

  // Get a specific player
  getPlayer: async (playerId) => {
    const response = await api.get(`/player/get/${playerId}`);
    return response.data;
  },

  // Get team rating
  getTeamRating: async (teamName) => {
    const response = await api.get(`/player/get/team_rating/${teamName}`);
    return response.data;
  },

  // Create a new player
  createPlayer: async (playerData) => {
    const response = await api.post('/player/new', playerData);
    return response.data;
  },

  // Update player
  updatePlayer: async (playerId, playerData) => {
    const response = await api.put(`/player/update/${playerId}`, playerData);
    return response.data;
  },

  // Update player availability
  updatePlayerAvailability: async (playerId, availability) => {
    const response = await api.put(`/player/available/${playerId}/${availability}`);
    return response.data;
  },

  // Assign player to team
  assignPlayerToTeam: async (playerId, teamName) => {
    const response = await api.put(`/player/assign-team/${playerId}`, {
      assigned_team: teamName
    });
    return response.data;
  },

  // Delete player
  deletePlayer: async (playerId) => {
    const response = await api.delete(`/player/delete/${playerId}`);
    return response.data;
  },
};

export default playerService;
