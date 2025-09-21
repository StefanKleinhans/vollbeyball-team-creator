import React, { useState } from 'react';

const PlayerForm = ({ onCreatePlayer, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    defence_rating: '',
    offense_rating: '',
    serve_rating: '',
    teamplay_rating: '',
    available: true,
    assigned_team: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert string numbers to actual numbers
    const playerData = {
      ...formData,
      age: parseInt(formData.age),
      defence_rating: parseFloat(formData.defence_rating),
      offense_rating: parseFloat(formData.offense_rating),
      serve_rating: parseFloat(formData.serve_rating),
      teamplay_rating: parseFloat(formData.teamplay_rating)
    };
    
    onCreatePlayer(playerData);
    
    // Reset form
    setFormData({
      name: '',
      age: '',
      gender: '',
      defence_rating: '',
      offense_rating: '',
      serve_rating: '',
      teamplay_rating: '',
      available: true,
      assigned_team: ''
    });
  };

  return (
    <div className="player-form">
      <h2>Add New Player</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              min="1"
              max="100"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="defence_rating">Defense Rating (1-10)</label>
            <input
              type="number"
              id="defence_rating"
              name="defence_rating"
              value={formData.defence_rating}
              onChange={handleInputChange}
              min="1"
              max="10"
              step="0.1"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="offense_rating">Offense Rating (1-10)</label>
            <input
              type="number"
              id="offense_rating"
              name="offense_rating"
              value={formData.offense_rating}
              onChange={handleInputChange}
              min="1"
              max="10"
              step="0.1"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="serve_rating">Serve Rating (1-10)</label>
            <input
              type="number"
              id="serve_rating"
              name="serve_rating"
              value={formData.serve_rating}
              onChange={handleInputChange}
              min="1"
              max="10"
              step="0.1"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="teamplay_rating">Teamplay Rating (1-10)</label>
            <input
              type="number"
              id="teamplay_rating"
              name="teamplay_rating"
              value={formData.teamplay_rating}
              onChange={handleInputChange}
              min="1"
              max="10"
              step="0.1"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="assigned_team">Assign to Team (Optional)</label>
            <select
              id="assigned_team"
              name="assigned_team"
              value={formData.assigned_team}
              onChange={handleInputChange}
            >
              <option value="">No Team</option>
              <option value="A">Team A</option>
              <option value="B">Team B</option>
            </select>
          </div>
        </div>
        
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Player'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlayerForm;
