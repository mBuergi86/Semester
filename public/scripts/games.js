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

// Funktion zum Gruppieren von Spielen nach A-Z und 0-9
const groupGamesByAlphabet = (games) => {
  return games.reduce((acc, game) => {
    const firstLetter = (game.Game || "").charAt(0).toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(game);
    return acc;
  }, {});
};

// Update der Alphabet-Navigation basierend auf den gruppierten Spielen
const createAlphabetNav = (groupedGames) => {
  const navContainer = document.querySelector('#alphabet-nav');
  if (!navContainer) {
    console.error("Alphabet navigation container not found");
    return;
  }
  navContainer.innerHTML = "";

  // Create 'All' button
  const allLink = document.createElement("a");
  allLink.textContent = "All";
  allLink.href = "?filter=all";
  allLink.classList.add("active");
  allLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = allLink.href;
  });
  navContainer.appendChild(allLink);

  const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  alphabet.forEach(char => {
    const link = document.createElement("a");
    link.textContent = char;
    link.href = `?filter=${char}`;

    link.classList.add(groupedGames[char] ? "active" : "inactive");

    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = link.href;
    });

    navContainer.appendChild(link);
  });
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

let currentPage = 1;
const gamesPerPage = 25;

// Funktion zum Rendern der Spiele
const renderGames = async (groupedGames) => {
  const gamesContainer = document.getElementById("games-grid");
  const paginationContainer = document.getElementById("pagination-container");

  if (!gamesContainer || !paginationContainer) {
    console.error("Required containers not found");
    return;
  }

  gamesContainer.innerHTML = "";
  paginationContainer.innerHTML = "";

  const totalGames = Object.values(groupedGames).flat().length;

  if (totalGames === 0) {
    const notFoundMessage = document.createElement("p");
    notFoundMessage.textContent = "Keine Spielliste gefunden.";
    notFoundMessage.style.gridColumn = "1 / -1";
    gamesContainer.appendChild(notFoundMessage);
    createAlphabetNav({});  // Create empty nav when no games found
    return;
  }

  createAlphabetNav(groupedGames);

  const startIndex = (currentPage - 1) * gamesPerPage;
  const endIndex = startIndex + gamesPerPage;

  let gamesRendered = 0;
  for (const [letter, letterGames] of Object.entries(groupedGames)) {
    if (gamesRendered >= endIndex) break;

    const sectionHeader = document.createElement("h3");
    sectionHeader.textContent = letter;
    sectionHeader.id = `section-${letter}`;
    sectionHeader.style.gridColumn = "1 / -1";
    gamesContainer.appendChild(sectionHeader);

    const gameCards = await Promise.all(
      letterGames.slice(Math.max(0, startIndex - gamesRendered), endIndex - gamesRendered).map(async (game) => {
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
          <a href="${game.GameLink || "#"}" target="_blank" rel="noopener noreferrer">Mehr erfahren</a>
        `;

        return gameCard;
      })
    );
    gameCards.forEach((card) => gamesContainer.appendChild(card));
    gamesRendered += letterGames.length;
  }

  // Add pagination controls
  const totalPages = Math.ceil(totalGames / gamesPerPage);
  const prevButton = document.createElement("button");
  prevButton.textContent = "Vorherige";
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderGames(groupedGames);
    }
  });

  const nextButton = document.createElement("button");
  nextButton.textContent = "Nächste";
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderGames(groupedGames);
    }
  });

  const pageInfo = document.createElement("span");
  pageInfo.textContent = `Seite ${currentPage} von ${totalPages}`;

  paginationContainer.appendChild(prevButton);
  paginationContainer.appendChild(pageInfo);
  paginationContainer.appendChild(nextButton);
};

// Funktion zum Filtern der Spiele basierend auf dem Suchbegriff and Buchstabenfilter
const filterGames = (games, searchTerm, alphabetFilter = '') => {
  let filteredGames = games;

  // Alphabet-Filterung
  if (alphabetFilter) {
    filteredGames = filteredGames.filter(game =>
      game.Game.charAt(0).toUpperCase() === alphabetFilter
    );
  }

  // Suchbegriff-Filterung
  if (searchTerm.trim()) {
    const words = searchTerm.toLowerCase().split(/\s+/);
    filteredGames = filteredGames.filter((game) =>
      words.every(
        (word) =>
          ["Game", "Dev", "Publisher"].some(
            (prop) => game[prop] && game[prop].toLowerCase().includes(word)
          ) ||
          (game.Year && game.Year.toString().includes(word))
      )
    );
  }

  return groupGamesByAlphabet(filteredGames);
};

// Hauptfunktion zum Initialisieren der Seite
const init = async () => {
  try {
    const games = await loadSNESGames();

    if (games.length === 0) {
      throw new Error("Keine Spielliste gefunden.");
    }

    let groupedGames = groupGamesByAlphabet(games);
    const urlParams = new URLSearchParams(window.location.search);
    const filterChar = urlParams.get('filter');

    if (filterChar && filterChar !== 'all') {
      groupedGames = { [filterChar]: groupedGames[filterChar] || [] };
    }

    createAlphabetNav(groupedGames);
    renderGames(groupedGames);

    const searchBar = document.getElementById("search-bar");
    if (!searchBar) {
      console.error("Search bar not found");
      return;
    }

    let searchTimeout;

    searchBar.addEventListener("input", (event) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const searchTerm = event.target.value.trim();
        groupedGames = filterGames(games, searchTerm);
        currentPage = 1; // Reset to first page on new search
        renderGames(groupedGames);
      }, 1000);
    });
  } catch (error) {
    console.error("Fehler beim Laden der Spielliste:", error.message);
    const gamesContainer = document.getElementById("games-grid");
    if (gamesContainer) {
      gamesContainer.innerHTML = `
        <p>Fehler beim Laden der Spielliste: ${error.message}</p>
      `;
    }
    createAlphabetNav({});
  }
};

export default init;
