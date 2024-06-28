const COUNTRY_LANGUAGE_MAP = {
  de: 'de',       // Ländercode für Deutschland
  gb: 'en-GB',    // Ländercode für Großbritannien
  us: 'en-US',    // Ländercode für die Vereinigten Staaten
};

function getBrowserLanguage() {
  // Holt die Sprache des Browsers
  return navigator.language || navigator.userLanguage;
}

function getGeolocation() {
  // Holt die Geolocation des Benutzers
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.')); // Fehler, falls Geolocation nicht unterstützt wird
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords), // Gibt die Koordinaten zurück, falls erfolgreich
      (error) => reject(error) // Gibt den Fehler zurück, falls fehlgeschlagen
    );
  });
}

function reverseGeocode(lat, lng) {
  // Führt eine Rückwärts-Geokodierung durch, um den Ländercode zu erhalten
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
  return fetch(url).then(response => response.json());
}

export default async function setLanguageByLocation() {
  try {
    const browserLanguage = getBrowserLanguage(); // Holt die Sprache des Browsers
    const { latitude, longitude } = await getGeolocation(); // Holt die Geolocation des Benutzers
    const { address } = await reverseGeocode(latitude, longitude); // Führt eine Rückwärts-Geokodierung durch, um die Adresse zu erhalten
    const countryCode = address.country_code; // Holt den Ländercode aus der Adresse

    let language;
    if (countryCode in COUNTRY_LANGUAGE_MAP) {
      language = COUNTRY_LANGUAGE_MAP[countryCode]; // Setzt die Sprache basierend auf dem Ländercode
    } else if (countryCode === 'de' && browserLanguage.startsWith('de')) {
      language = 'de'; // Setzt die Sprache auf Deutsch, wenn der Ländercode "de" ist und die Browsersprache mit "de" beginnt
    } else {
      language = `${browserLanguage}-${countryCode}`; // Setzt die Sprache basierend auf der Browsersprache und dem Ländercode
    }

    document.documentElement.lang = language; // Setzt die Sprache des Dokuments
  } catch (error) {
    console.error('Der Fehler ist aufgetreten:', error); // Gibt einen Fehler aus, falls etwas schiefgeht
    document.documentElement.lang = getBrowserLanguage(); // Setzt die Sprache auf die Browsersprache als Fallback
  }
}