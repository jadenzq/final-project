// Global variables for map functionality
let selectedPlace = null;
let geocoder;

function initHotelAutocomplete() {
  const input = document.getElementById("hotel-location-input");
  if (!input) return;

  geocoder = new google.maps.Geocoder();

  const autocomplete = new google.maps.places.Autocomplete(input, {
    types: ["(cities)"],
  });
  autocomplete.addListener("place_changed", function () {
    selectedPlace = autocomplete.getPlace();
  });

  const urlParams = new URLSearchParams(window.location.search);
  const initialLocation = urlParams.get('location');

  if (initialLocation) {
    // Attempt to geocode the initial location to get a full PlaceResult object
    geocoder.geocode({ 'address': decodeURIComponent(initialLocation) }, function(results, status) {
      if (status === 'OK' && results[0]) {
        selectedPlace = results[0]; // Set the selectedPlace for future use
        input.value = selectedPlace.formatted_address; // Update the input field with the formatted address
      } else {
        console.error('Geocode was not successful for initial location: ' + status);
        // Fallback: if geocoding fails, just set the input value from the URL string
        input.value = decodeURIComponent(initialLocation);
      }
    });
  }
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

// Helper to show the embedded Google Map modal
function showEmbeddedMapModal(lat, lng, title = "Location") {
  const modal = document.getElementById("map-modal");
  const mapContainer = document.getElementById("map-container");
  modal.classList.remove("hidden");
  // Clear previous map instance
  mapContainer.innerHTML = "";
  // Create the map
  const map = new google.maps.Map(mapContainer, {
    center: { lat: parseFloat(lat), lng: parseFloat(lng) },
    zoom: 15,
  });
  new google.maps.Marker({
    position: { lat: parseFloat(lat), lng: parseFloat(lng) },
    map,
    title,
  });
}

// Close modal logic
window.addEventListener("DOMContentLoaded", function () {
  const closeBtn = document.getElementById("close-map-modal");
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      document.getElementById("map-modal").classList.add("hidden");
    });
  }
  const modal = document.getElementById("map-modal");
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        this.classList.add("hidden");
      }
    });
  }
});

// Attach the event listener after DOM is loaded
window.addEventListener("DOMContentLoaded", function () {
  const searchBtn = document.querySelector("button.bg-blue-600");
  if (searchBtn) {
    searchBtn.addEventListener("click", fetchHotelsNearLocation);
  }
  const showMapBtn = document.querySelector("button.text-blue-600");
  if (showMapBtn) {
    showMapBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (selectedPlace && selectedPlace.geometry) {
        const lat = selectedPlace.geometry.location.lat();
        const lng = selectedPlace.geometry.location.lng();
        const name = selectedPlace.name || "Location";
        showEmbeddedMapModal(lat, lng, name);
      } else {
        alert("Please select a location from the dropdown first.");
      }
    });
  }
  document.querySelectorAll(".hotel-show-map-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const lat = this.getAttribute("data-lat");
      const lng = this.getAttribute("data-lng");
      const title =
        this.closest(".flex-1")?.querySelector("h2")?.textContent || "Hotel";
      showEmbeddedMapModal(lat, lng, title);
    });
  });
});
