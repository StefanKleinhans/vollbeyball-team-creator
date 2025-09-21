import React from 'react';

const PlayerCard = ({ 
  player, 
  onAssignToTeam, 
  onRemoveFromTeam, 
  onDelete, 
  showTeamActions = true,
  canDelete = false
}) => {
  const calculateAverageRating = (player) => {
    const total = player.defence_rating + player.offense_rating + player.serve_rating + player.teamplay_rating;
    return (total / 4).toFixed(2);
  };

  const getGenderDisplay = (gender) => {
    return gender === 'M' ? 'Male' : gender === 'F' ? 'Female' : gender;
  };

  return (
    <div className="player-item">
      <div className="player-info">
        <div className="player-name">{player.name}</div>
        <div className="player-details">
          Age: {player.age} | Gender: {getGenderDisplay(player.gender)} | Avg Rating: {calculateAverageRating(player)} |
          Defense: {player.defence_rating} | Offense: {player.offense_rating} |
          Serve: {player.serve_rating} | Teamplay: {player.teamplay_rating}
          {player.assigned_team && ` | Team: ${player.assigned_team}`}
        </div>
      </div>
      <div className="player-actions">
        {showTeamActions && (
          <>
            {!player.assigned_team && (
              <>
                <button
                  className="btn btn-primary"
                  onClick={() => onAssignToTeam(player.id, 'A')}
                >
                  Team A
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => onAssignToTeam(player.id, 'B')}
                >
                  Team B
                </button>
              </>
            )}
            {player.assigned_team && (
              <button
                className="btn btn-secondary"
                onClick={() => onRemoveFromTeam(player.id)}
              >
                Remove from Team
              </button>
            )}
          </>
        )}
        {canDelete && (
          <button
            className="btn btn-danger"
            onClick={() => onDelete(player.id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default PlayerCard;
