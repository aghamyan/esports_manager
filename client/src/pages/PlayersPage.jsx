import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const PLAYERS_URL = `${API_BASE_URL}/api/players`;

const emptyForm = {
  fullName: '',
  nickname: '',
  psnId: '',
};

async function parseApiResponse(response) {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || 'Request failed');
  }

  return payload;
}

function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadPlayers() {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const response = await fetch(PLAYERS_URL);
      const payload = await parseApiResponse(response);
      setPlayers(payload.data || []);
    } catch (error) {
      setErrorMessage(error.message || 'Could not load players');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPlayers();
  }, []);

  function onInputChange(event) {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function resetForm() {
    setFormData(emptyForm);
    setEditingPlayerId(null);
  }

  function validateForm() {
    if (!formData.fullName.trim()) {
      return 'Full name is required';
    }

    if (!formData.nickname.trim()) {
      return 'Nickname is required';
    }

    return null;
  }

  async function onSubmit(event) {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      setSuccessMessage('');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');

      const method = editingPlayerId ? 'PUT' : 'POST';
      const url = editingPlayerId ? `${PLAYERS_URL}/${editingPlayerId}` : PLAYERS_URL;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const payload = await parseApiResponse(response);

      setSuccessMessage(payload.message || 'Player saved');
      resetForm();
      await loadPlayers();
    } catch (error) {
      setErrorMessage(error.message || 'Could not save player');
    } finally {
      setIsSubmitting(false);
    }
  }

  function startEditing(player) {
    setEditingPlayerId(player.id);
    setFormData({
      fullName: player.fullName || '',
      nickname: player.nickname || '',
      psnId: player.psnId || '',
    });
    setSuccessMessage('');
    setErrorMessage('');
  }

  async function onDelete(player) {
    const didConfirm = window.confirm(`Delete player "${player.nickname}"?`);
    if (!didConfirm) {
      return;
    }

    try {
      setErrorMessage('');
      setSuccessMessage('');

      const response = await fetch(`${PLAYERS_URL}/${player.id}`, {
        method: 'DELETE',
      });

      const payload = await parseApiResponse(response);
      setSuccessMessage(payload.message || 'Player deleted');

      if (editingPlayerId === player.id) {
        resetForm();
      }

      await loadPlayers();
    } catch (error) {
      setErrorMessage(error.message || 'Could not delete player');
    }
  }

  return (
    <section>
      <h2>Players</h2>

      <form className="players-form" onSubmit={onSubmit}>
        <h3>{editingPlayerId ? 'Edit player' : 'Add player'}</h3>

        <label htmlFor="fullName">Full name *</label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={onInputChange}
          placeholder="Cristiano Ronaldo"
        />

        <label htmlFor="nickname">Nickname *</label>
        <input
          id="nickname"
          name="nickname"
          type="text"
          value={formData.nickname}
          onChange={onInputChange}
          placeholder="CR7"
        />

        <label htmlFor="psnId">PSN ID (optional)</label>
        <input
          id="psnId"
          name="psnId"
          type="text"
          value={formData.psnId}
          onChange={onInputChange}
          placeholder="player_psn"
        />

        <div className="players-form-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : editingPlayerId ? 'Update player' : 'Create player'}
          </button>

          {editingPlayerId && (
            <button type="button" onClick={resetForm}>
              Cancel edit
            </button>
          )}
        </div>
      </form>

      {errorMessage && <p className="message error">{errorMessage}</p>}
      {successMessage && <p className="message success">{successMessage}</p>}

      {isLoading ? (
        <p>Loading players...</p>
      ) : (
        <table className="players-table">
          <thead>
            <tr>
              <th>Full name</th>
              <th>Nickname</th>
              <th>PSN ID</th>
              <th>Created at</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.length === 0 ? (
              <tr>
                <td colSpan="5">No players yet.</td>
              </tr>
            ) : (
              players.map((player) => (
                <tr key={player.id}>
                  <td>{player.fullName}</td>
                  <td>{player.nickname}</td>
                  <td>{player.psnId || '-'}</td>
                  <td>{new Date(player.createdAt).toLocaleString()}</td>
                  <td>
                    <div className="players-row-actions">
                      <button type="button" onClick={() => startEditing(player)}>
                        Edit
                      </button>
                      <button type="button" onClick={() => onDelete(player)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default PlayersPage;
