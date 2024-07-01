const initializeForum = () => {
  const initialIssues = [
    {
      title: "Geheimer Gang in Super Metroid",
      content:
        "Ich habe Gerüchte über einen versteckten Gang in Norfair gehört, der zu einem ultra-mächtigen Strahl-Upgrade führt. Hat das schon jemand gefunden?",
    },
    {
      title: "Zelda: A Link to the Past - Rätsel um Herzcontainer",
      content:
        "Es soll angeblich einen Herzcontainer geben, der nur erscheint, wenn man bei Vollmond an einem bestimmten Ort Okarina spielt. Ist das wahr oder nur ein Mythos?",
    },
    {
      title: "Marios verlorenes Level in Super Mario World",
      content:
        "Mein Onkel, der bei Nintendo arbeitet, hat mir von einem geheimen Level erzählt, in dem Mario auf Yoshi in den Weltraum reiten kann. Wie kann man das freischalten?",
    },
    {
      title: "Donkey Kong Country - Bananen-Hort Glitch",
      content:
        "Ich habe einen Weg gefunden, unendlich viele Bananen in DKC zu bekommen! Stellt euch auf das dritte Fass in Coral Capers, springt dreimal und drückt Select. Hat das schon jemand anders probiert?",
    },
    {
      title: "Chrono Trigger - Theorie über alternatives Ende",
      content:
        "Wenn man Lavos besiegt, ohne Charaktere zu retten, gibt es die Theorie, dass man ein geheimes Ende freischaltet, in dem Crono zum Zeitverschlinger wird. Kann das jemand bestätigen?",
    },
    {
      title: "F-Zero - Versteckte Boost-Felder",
      content:
        "Ich schwöre, es gibt unsichtbare Boost-Felder in Mute City. Wenn man sie genau richtig trifft, kann man das ganze Feld überrunden. Hat das noch jemand bemerkt?",
    },
    {
      title: "EarthBound - Giygas wahre Gestalt",
      content:
        "Wenn man PK Blitz genau 13 Mal gegen Giygas einsetzt, ändert sich der Kampf und man sieht seine wahre Alien-Gestalt. Es ist furchteinflössend!",
    },
    {
      title: "Street Fighter II Turbo - Akumas geheime Technik",
      content:
        "Ich habe gehört, dass man mit einer bestimmten Tastenkombination bei Akuma einen Move ausführen kann, der jeden Gegner sofort K.O. schlägt. Weiss jemand die Kombination?",
    },
    {
      title: "Mega Man X - Zeros Überleben",
      content:
        "Es gibt das Gerücht, dass Zero sein Opfer überlebt, wenn man alle Mavericks besiegt, ohne Schaden zu nehmen. Hat das schon jemand geschafft?",
    },
    {
      title: "Star Fox - Geheimer Mehrspielermodus",
      content:
        "Mein Freund sagt, es gibt einen Cheat-Code, um einen 4-Spieler-Kampfmodus in Star Fox freizuschalten. Kennt jemand den Code?",
    },
  ];

  let issues = JSON.parse(localStorage.getItem("issues")) || initialIssues;

  const saveIssues = () => {
    localStorage.setItem("issues", JSON.stringify(issues));
  };

  const displayIssues = () => {
    const container = document.getElementById("issues-container");

    container.innerHTML = issues
      .map(
        (issue, index) => `
        <div class="issue">
            <h3 style="text-decoration: underline;">${issue.title}</h3>
            <p>${issue.content}</p>
            <small style="color: white">Thema #${index + 1}</small>
        </div>
    `,
      )
      .join("");
  };

  const addIssue = (title, content) => {
    issues.unshift({ title, content });
    saveIssues();
    displayIssues();
  };

  document.getElementById("issue-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = document.getElementById("issue-form");

    const formData = new FormData(form);
    const formDataObject = Object.fromEntries(formData.entries());

    addIssue(formDataObject.title, formDataObject.content);

    form.reset();
  });

  displayIssues();
};

export default initializeForum;
