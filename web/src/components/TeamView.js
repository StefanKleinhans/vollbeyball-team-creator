import React from 'react';
import PlayerCard from './PlayerCard';

const TeamView = ({ 
  teamName, 
  players, 
  teamRating, 
  onAssignToTeam, 
  onRemoveFromTeam, 
  onDeletePlayer,
  canEdit = false,
  canDelete = false
}) => {
  const teamPlayers = players.filter(player => player.assigned_team === teamName);

  return (
    <div className="team">
      <div className="team-header">
        <h2 className="team-title">Team {teamName}</h2>
        <div className="team-rating">
          Rating: {teamRating ? teamRating.toFixed(2) : 'N/A'}
        </div>
      </div>
      <div className="team-content">
        {teamPlayers.length === 0 ? (
          <div className="empty-team">No players assigned to this team</div>
        ) : (
          <div className="player-list">
            {teamPlayers.map(player => (
              <PlayerCard
                key={player.id}
                player={player}
                onAssignToTeam={onAssignToTeam}
                onRemoveFromTeam={onRemoveFromTeam}
                onDelete={onDeletePlayer}
                showTeamActions={canEdit}
                canDelete={canDelete}
              />
            ))}
          </div>
        )}
      </div>
      <div className="team-stats">
        <small>Players: {teamPlayers.length}/6</small>
      </div>
    </div>
  );
};

export default TeamView;
