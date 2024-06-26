// JSON-Datei mit allen Spielen laden
const loadSNESGames = async () => {
  return await fetch("src/libs/data/json/Updated_SNESGames.json")
    .then((response) => response.json())
    .then((data) => {
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Keine gültige Spielliste gefunden.");
      }
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
    acc[firstLetter] = [...(acc[firstLetter] || []), game];
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
          : "https://placehold.co/256x224";

        gameCard.innerHTML = `
        <h4>${game.Game}</h4>
        <img src="${finalImage}" alt="${game.Game}" loading="lazy">
        <p>${game.Dev || ""}</p>
        <p>${game.Publisher || ""}</p>
        <p>${game.Year || ""}</p>
        <a href="${
          game.GameLink || "#"
        }" target="_blank" rel="noopener noreferrer">Mehr erfahren</a>
      `;

        return gameCard;
      }),
    );
    gameCards.forEach((card) => gamesContainer.appendChild(card));
  }
};

// Funktion zum Filtern der Spiele basierend auf dem Suchbegriff
const filterGames = (games, searchTerm) => {
  const words = searchTerm.toLowerCase().split(/\s+/);
  return games.filter((game) =>
    words.every(
      (word) =>
        ["Game", "Dev", "Publisher"].some(
          (prop) =>
            game[prop] &&
            game[prop]
              .toLowerCase()
              .split(/\s+/)
              .some((term) => term.startsWith(word)),
        ) ||
        (game.Year && game.Year.toString().startsWith(word)),
    ),
  );
};

// Hauptfunktion zum Initialisieren der Seite
const init = async () => {
  try {
    const games = await loadSNESGames();

    if (games.length === 0) {
      throw new Error("Keine Spielliste gefunden.");
    }

    renderGames(games);

    const searchBar = document.getElementById("search-bar");
    searchBar.addEventListener("input", (event) => {
      const searchTerm = event.target.value.trim();
      renderGames(searchTerm ? filterGames(games, searchTerm) : games);
    });
  } catch (error) {
    console.error("Fehler beim Laden der Spielliste:", error.message);
    document.getElementById("games-grid").innerHTML = `
      <p>Fehler beim Laden der Spielliste: ${error.message}</p>
    `;
  }
};

export default init;
