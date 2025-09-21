# Volleyball Team Creator - Web App

This is a React web application that interfaces with the FastAPI backend to manage volleyball teams and players.

## Features

- **Team Management**: View Team A and Team B with their average ratings
- **Player Management**: Add, edit, and delete players with gender information
- **Team Assignment**: Assign players to Team A or Team B
- **Player Ratings**: Track defense, offense, serve, and teamplay ratings for each player
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- The FastAPI backend running on port 8000

### Installation

1. Navigate to the web directory:
   ```bash
   cd web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### API Configuration

The app is configured to proxy API requests to `http://localhost:8000` where your FastAPI backend should be running. Make sure your FastAPI server is running on port 8000 before starting the React app.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/          # React components
│   ├── PlayerCard.js   # Individual player display
│   ├── PlayerForm.js   # Form for adding new players
│   └── TeamView.js     # Team display with players
├── services/           # API service layer
│   └── api.js         # FastAPI integration
├── App.js             # Main application component
├── index.js           # Application entry point
└── index.css          # Global styles
```

## Usage

1. **Adding Players**: Use the form at the top to add new players with their ratings and gender
2. **Assigning to Teams**: Click "Team A" or "Team B" buttons to assign unassigned players
3. **Removing from Teams**: Click "Remove from Team" to unassign players
4. **Viewing Team Ratings**: Team ratings are automatically calculated and displayed
5. **Deleting Players**: Use the "Delete" button to permanently remove players

## API Endpoints Used

- `GET /app/player/all` - Fetch all players
- `GET /app/player/get/team_rating/{team}` - Get team average rating
- `POST /app/player/new` - Create new player
- `PUT /app/player/assign-team/{player_id}` - Assign player to team
- `DELETE /app/player/delete/{player_id}` - Delete player

## Features

- Real-time team rating calculations
- Responsive grid layout for teams
- Form validation for player creation
- Error handling and user feedback
- Mobile-friendly design
