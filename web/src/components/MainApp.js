import React, { useState, useEffect } from 'react';
import { playerService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import TeamView from './TeamView';
import PlayerForm from './PlayerForm';
import PlayerCard from './PlayerCard';

function MainApp() {
  const [players, setPlayers] = useState([]);
  const [teamRatings, setTeamRatings] = useState({ A: null, B: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user, hasRole } = useAuth();

  // Fetch all players
  const fetchPlayers = async () => {
    try {
      const data = await playerService.getAllPlayers();
      setPlayers(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch players');
      console.error('Error fetching players:', err);
    }
  };

  // Fetch team ratings
  const fetchTeamRatings = async () => {
    try {
      const [teamAResponse, teamBResponse] = await Promise.allSettled([
        playerService.getTeamRating('A'),
        playerService.getTeamRating('B')
      ]);

      setTeamRatings({
        A: teamAResponse.status === 'fulfilled' ? teamAResponse.value.A : null,
        B: teamBResponse.status === 'fulfilled' ? teamBResponse.value.B : null
      });
    } catch (err) {
      console.error('Error fetching team ratings:', err);
    }
  };

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchPlayers();
      await fetchTeamRatings();
      setLoading(false);
    };
    
    loadData();
  }, []);

  // Create new player (Admin and Editor only)
  const handleCreatePlayer = async (playerData) => {
    if (!hasRole('Editor')) {
      setError('You do not have permission to create players');
      return;
    }

    try {
      setLoading(true);
      await playerService.createPlayer(playerData);
      await fetchPlayers();
      await fetchTeamRatings();
      setSuccess('Player created successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to create player');
      console.error('Error creating player:', err);
    } finally {
      setLoading(false);
    }
  };

  // Assign player to team (Admin and Editor only)
  const handleAssignToTeam = async (playerId, teamName) => {
    if (!hasRole('Editor')) {
      setError('You do not have permission to assign players to teams');
      return;
    }

    try {
      await playerService.assignPlayerToTeam(playerId, teamName);
      await fetchPlayers();
      await fetchTeamRatings();
      setSuccess(`Player assigned to Team ${teamName}!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to assign player to team');
      console.error('Error assigning player:', err);
    }
  };

  // Remove player from team (Admin and Editor only)
  const handleRemoveFromTeam = async (playerId) => {
    if (!hasRole('Editor')) {
      setError('You do not have permission to remove players from teams');
      return;
    }

    try {
      await playerService.assignPlayerToTeam(playerId, '');
      await fetchPlayers();
      await fetchTeamRatings();
      setSuccess('Player removed from team!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to remove player from team');
      console.error('Error removing player from team:', err);
    }
  };

  // Delete player (Admin only)
  const handleDeletePlayer = async (playerId) => {
    if (!hasRole('Admin')) {
      setError('You do not have permission to delete players');
      return;
    }

    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        await playerService.deletePlayer(playerId);
        await fetchPlayers();
        await fetchTeamRatings();
        setSuccess('Player deleted successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError('Failed to delete player');
        console.error('Error deleting player:', err);
      }
    }
  };

  const unassignedPlayers = players.filter(player => !player.assigned_team);

  if (loading && players.length === 0) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container">
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {/* Show user role info */}
      <div className="user-role-info">
        <p>
          Welcome, <strong>{user?.firstName} {user?.lastName}</strong>! 
          Your role: <strong>{user?.role}</strong>
        </p>
        {user?.role === 'Viewer' && (
          <p className="role-notice">
            <em>You have view-only access. Contact an administrator for editing permissions.</em>
          </p>
        )}
      </div>

      {/* Player Form - Only show for Editor and Admin */}
      {hasRole('Editor') && (
        <PlayerForm onCreatePlayer={handleCreatePlayer} loading={loading} />
      )}

      <div className="teams-container">
        <TeamView
          teamName="A"
          players={players}
          teamRating={teamRatings.A}
          onAssignToTeam={handleAssignToTeam}
          onRemoveFromTeam={handleRemoveFromTeam}
          onDeletePlayer={handleDeletePlayer}
          canEdit={hasRole('Editor')}
          canDelete={hasRole('Admin')}
        />
        <TeamView
          teamName="B"
          players={players}
          teamRating={teamRatings.B}
          onAssignToTeam={handleAssignToTeam}
          onRemoveFromTeam={handleRemoveFromTeam}
          onDeletePlayer={handleDeletePlayer}
          canEdit={hasRole('Editor')}
          canDelete={hasRole('Admin')}
        />
      </div>

      {unassignedPlayers.length > 0 && (
        <div className="available-players">
          <h2>Available Players ({unassignedPlayers.length})</h2>
          <div className="player-list">
            {unassignedPlayers.map(player => (
              <PlayerCard
                key={player.id}
                player={player}
                onAssignToTeam={handleAssignToTeam}
                onRemoveFromTeam={handleRemoveFromTeam}
                onDelete={handleDeletePlayer}
                showTeamActions={hasRole('Editor')}
                canDelete={hasRole('Admin')}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MainApp;
