export default function setLanguageByLocation() {
  const language = navigator.language || navigator.userLanguage;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const countryCode = data.address.country_code;

          switch (countryCode) {
            case "de":
              document.documentElement.lang = language.startsWith("de")
                ? "de"
                : `de-${countryCode}`;
              break;
            case "gb":
              document.documentElement.lang = "en-GB";
              break;
            case "us":
              document.documentElement.lang = "en-US";
              break;
            default:
              document.documentElement.lang = `${language}-${countryCode}`;
              break;
          }
        })
        .catch((error) => {
          console.error("Geolocation error:", error);
        });
    });
  } else {
    console.error("Geolocation is not supported by this browser.");
    document.documentElement.lang = language;
  }
}
