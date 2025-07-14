// hotel_autocomplete.js
// Replace 'YOUR_GOOGLE_API_KEY' with your actual Google Places API key below.

let selectedPlace = null;

function initHotelAutocomplete() {
  const input = document.getElementById("hotel-location-input");
  if (!input) return;
  const autocomplete = new google.maps.places.Autocomplete(input, {
    types: ["(cities)"],
  });
  autocomplete.addListener("place_changed", function () {
    selectedPlace = autocomplete.getPlace();
  });
}

window.initHotelAutocomplete = initHotelAutocomplete;

// Fetch hotels near the selected place when Search is clicked
function fetchHotelsNearLocation(event) {
  event.preventDefault();
  if (!selectedPlace || !selectedPlace.geometry) {
    alert("Please select a location from the dropdown.");
    return;
  }
  const lat = selectedPlace.geometry.location.lat();
  const lng = selectedPlace.geometry.location.lng();
  console.log("Fetching hotels near:", lat, lng);
}

// Show Google Static Map in a popup when 'Show on map' is clicked
function showStaticMapPopup() {
  if (!selectedPlace || !selectedPlace.geometry) {
    alert("Please select a location from the dropdown first.");
    return;
  }
  const lat = selectedPlace.geometry.location.lat();
  const lng = selectedPlace.geometry.location.lng();
  const apiKey = "AIzaSyCLxYn-Dgp1r1Qp2HbIubEc-egYC1_xb9E";
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=13&size=600x400&markers=color:red%7C${lat},${lng}&key=${apiKey}`;

  // Create popup
  const popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.top = "0";
  popup.style.left = "0";
  popup.style.width = "100vw";
  popup.style.height = "100vh";
  popup.style.background = "rgba(0,0,0,0.5)";
  popup.style.display = "flex";
  popup.style.alignItems = "center";
  popup.style.justifyContent = "center";
  popup.style.zIndex = "9999";
  popup.innerHTML = `<div style="background:#fff;padding:16px;border-radius:8px;position:relative;"><img src='${mapUrl}' alt='Map' style='max-width:100%;border-radius:8px;'/><button id='closeMapPopup' style='position:absolute;top:8px;right:8px;font-size:20px;background:none;border:none;cursor:pointer;'>&times;</button></div>`;
  document.body.appendChild(popup);
  document.getElementById("closeMapPopup").onclick = function () {
    document.body.removeChild(popup);
  };
}

// Show Google Static Map in a popup when 'Show on map' is clicked (for any hotel card)
function showStaticMapPopupForHotel(event) {
  const btn = event.currentTarget;
  const lat = btn.getAttribute("data-lat");
  const lng = btn.getAttribute("data-lng");
  if (!lat || !lng) {
    alert("No location found for this hotel.");
    return;
  }
  const apiKey = "AIzaSyCLxYn-Dgp1r1Qp2HbIubEc-egYC1_xb9E";
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=13&size=600x400&markers=color:red%7C${lat},${lng}&key=${apiKey}`;

  // Create popup
  const popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.top = "0";
  popup.style.left = "0";
  popup.style.width = "100vw";
  popup.style.height = "100vh";
  popup.style.background = "rgba(0,0,0,0.5)";
  popup.style.display = "flex";
  popup.style.alignItems = "center";
  popup.style.justifyContent = "center";
  popup.style.zIndex = "9999";
  popup.innerHTML = `<div style="background:#fff;padding:16px;border-radius:8px;position:relative;"><img src='${mapUrl}' alt='Map' style='max-width:100%;border-radius:8px;'/><button id='closeMapPopup' style='position:absolute;top:8px;right:8px;font-size:20px;background:none;border:none;cursor:pointer;'>&times;</button></div>`;
  document.body.appendChild(popup);
  document.getElementById("closeMapPopup").onclick = function () {
    document.body.removeChild(popup);
  };
}

// Attach the event listener after DOM is loaded
window.addEventListener("DOMContentLoaded", function () {
  const searchBtn = document.querySelector("button.bg-blue-600");
  if (searchBtn) {
    searchBtn.addEventListener("click", fetchHotelsNearLocation);
  }
  const showMapBtn = document.querySelector("button.text-blue-600");
  if (showMapBtn) {
    showMapBtn.addEventListener("click", showStaticMapPopup);
  }
  // Attach to all hotel card map buttons
  document.querySelectorAll(".hotel-show-map-btn").forEach((btn) => {
    btn.addEventListener("click", showStaticMapPopupForHotel);
  });
});
