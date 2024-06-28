// JSON-Datei mit allen Spielen laden
const loadSNESGames = async () => {
  return await fetch("src/libs/data/json/Updated_SNESGames.json")
    .then((response) => response.json())
    .then((data) => {
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Keine gültige Spielliste gefunden.");
      }
      // Sortiert die Spiele alphabetisch nach dem Spielnamen
      return data.sort((a, b) => a.Game.localeCompare(b.Game));
    })
    .catch((error) => {
      console.error("Fehler beim Laden der Spielliste:", error.message);
      return [];
    });
};

// Funktion zum Gruppieren von Spielen nach A-Z
const groupGamesByAlphabet = (games) => {
  return games.reduce((acc, game) => {
    const firstLetter = (game.Game || "").charAt(0).toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(game);
    return acc;
  }, {});
};

// Funktion zum Überprüfen, ob ein Bild existiert
const checkImageExists = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
};

// Funktion zum Rendern der Spiele
const renderGames = async (games) => {
  const gamesContainer = document.getElementById("games-grid");
  gamesContainer.innerHTML = "";

  if (games.length === 0) {
    const notFoundMessage = document.createElement("p");
    notFoundMessage.textContent = "Keine Spiele gefunden.";
    notFoundMessage.style.gridColumn = "1 / -1";
    gamesContainer.appendChild(notFoundMessage);
    return;
  }

  const groupedGames = groupGamesByAlphabet(games);

  for (const [letter, letterGames] of Object.entries(groupedGames)) {
    const letterHeader = document.createElement("h3");
    letterHeader.textContent = letter;
    letterHeader.style.gridColumn = "1 / -1";
    gamesContainer.appendChild(letterHeader);

    const gameCards = await Promise.all(
      letterGames.map(async (game) => {
        const gameCard = document.createElement("div");
        gameCard.className = "game-card";

        const imageExists = await checkImageExists(game.GamePicture);
        const finalImage = imageExists
          ? game.GamePicture
          : "https://placehold.co/256x224"; // Platzhalterbild, wenn das Originalbild nicht existiert

        gameCard.innerHTML = `
          <h4>${game.Game}</h4>
          <img src="${finalImage}" alt="${game.Game}" loading="lazy">
          <p>${game.Dev || ""}</p>
          <p>${game.Publisher || ""}</p>
          <p>${game.Year || ""}</p>
          <a href="${game.GameLink || "#"}" target="_blank" rel="noopener noreferrer">Mehr erfahren</a>
        `;

        return gameCard;
      })
    );
    gameCards.forEach((card) => gamesContainer.appendChild(card));
  }
};

// Funktion zum Filtern der Spiele basierend auf dem Suchbegriff
const filterGames = (games, searchTerm) => {
  // Wenn das Suchbegriff leer ist, gib alle Spiele zurück
  if (!searchTerm.trim()) {
    return games.slice().sort((a, b) => a.Game.localeCompare(b.Game));
  }

  const words = searchTerm.toLowerCase().split(/\s+/);
  const filteredGames = games.filter((game) =>
    words.every(
      (word) =>
        ["Game", "Dev", "Publisher"].some(
          (prop) => game[prop] && game[prop].toLowerCase().includes(word)
        ) ||
        (game.Year && game.Year.toString().includes(word))
    )
  );

  return filteredGames.sort((a, b) => a.Game.localeCompare(b.Game));
};

// Hauptfunktion zum Initialisieren der Seite
const init = async () => {
  try {
    const games = await loadSNESGames(); // Laden der Spiele

    if (games.length === 0) {
      throw new Error("Keine Spielliste gefunden.");
    }

    renderGames(filterGames(games, "")); // Spiele rendern

    const searchBar = document.getElementById("search-bar");
    let searchTimeout;

    searchBar.addEventListener("input", (event) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const searchTerm = event.target.value.trim();
        const filteredAndSortedGames = filterGames(games, searchTerm);
        renderGames(filteredAndSortedGames);
      }, 1000); // Debounce-Zeit von 1 Sekunde
    });
  } catch (error) {
    console.error("Fehler beim Laden der Spielliste:", error.message);
    document.getElementById("games-grid").innerHTML = `
      <p>Fehler beim Laden der Spielliste: ${error.message}</p>
    `;
  }
};

export default init;