// app.js (frontend)
document.addEventListener('DOMContentLoaded', () => {
  const addGameForm = document.getElementById('addGameForm');
  const gamesList = document.getElementById('gamesList');
  const searchForm = document.getElementById('searchForm');

  const fetchAndDisplayGames = async () => {
    try {
      const response = await fetch('/games');
      const games = await response.json();

      gamesList.innerHTML = '';

      games.forEach(game => {
        const listItem = document.createElement('li');
        listItem.textContent = `${game.title} - ${game.platform} - ${game.genre} - ${new Date(game.releaseDate).toLocaleDateString()}`;
        gamesList.appendChild(listItem);
      });
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const searchGames = async (query) => {
    try {
      const response = await fetch(`/search?q=${query}`);
      const results = await response.json();

      gamesList.innerHTML = '';

      results.forEach(game => {
        const listItem = document.createElement('li');
        listItem.textContent = `${game.title} - ${game.platform} - ${game.genre} - ${new Date(game.releaseDate).toLocaleDateString()}`;
        gamesList.appendChild(listItem);
      });
    } catch (error) {
      console.error('Error searching games:', error);
    }
  };

  addGameForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const platform = document.getElementById('platform').value;
    const genre = document.getElementById('genre').value;
    const releaseDate = document.getElementById('releaseDate').value;

    try {
      await fetch('/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, platform, genre, releaseDate }),
      });

      fetchAndDisplayGames();
    } catch (error) {
      console.error('Error adding game:', error);
    }
  });

  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const query = document.getElementById('searchInput').value;

    if (query.trim() !== '') {
      searchGames(query);
    } else {
      // If the search input is empty, display all games
      fetchAndDisplayGames();
    }
  });

  fetchAndDisplayGames();
});