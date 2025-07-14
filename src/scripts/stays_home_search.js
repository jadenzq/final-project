let selectedPlace = null;
let geocoder; // Declare geocoder globally

function initHotelAutocomplete() {
  const input = document.getElementById("hotel-location-input");
  if (!input) return;

  // Initialize Geocoder
  geocoder = new google.maps.Geocoder();

  const autocomplete = new google.maps.places.Autocomplete(input, {
    types: ["(cities)"],
  });
  autocomplete.addListener("place_changed", function () {
    selectedPlace = autocomplete.getPlace();
  });

  // Get location from URL parameters and auto-select if available
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

// Function to handle redirection and pass data
document.getElementById('search-hotels-button').addEventListener('click', async function(event) {
  event.preventDefault(); // Prevent default form submission/redirection initially

  const locationInput = document.getElementById('hotel-location-input');
  const checkInInput = document.getElementById('check-in-date');
  const checkOutInput = document.getElementById('check-out-date');
  const travelersInput = document.getElementById('travelers-summary-input');

  const location = locationInput.value.trim();
  const checkIn = checkInInput.value.trim();
  const checkOut = checkOutInput.value.trim();
  const travelers = travelersInput.value.trim();

  // Perform initial validation for all fields
  if (!location || !checkIn || !checkOut || !travelers) {
    alert("Please fill in all search fields.");
    return; // Stop the function execution
  }

  // If selectedPlace is not set or doesn't have geometry, try to geocode the current input value
  // This ensures that even if the user types a location without selecting from the dropdown,
  // we attempt to validate it.
  if (!selectedPlace || !selectedPlace.geometry) {
    try {
      const geocodeResults = await new Promise((resolve, reject) => {
        geocoder.geocode({ 'address': location }, function(results, status) {
          if (status === 'OK' && results[0]) {
            resolve(results[0]);
          } else {
            reject(new Error('Geocode was not successful for the input location: ' + status));
          }
        });
      });
      selectedPlace = geocodeResults; // Update selectedPlace with the geocoded result
    } catch (error) {
      console.error(error);
      alert("Please select a valid location from the dropdown suggestions or ensure the entered location is recognizable.");
      return; // Stop if geocoding fails
    }
  }

  // Final check after potentially geocoding: ensure a valid place with geometry is available
  if (!selectedPlace || !selectedPlace.geometry) {
      alert("Please select a valid location from the dropdown suggestions.");
      return;
  }

  // Construct URL with query parameters
  const params = new URLSearchParams();
  params.append('location', location);
  params.append('checkIn', checkIn);
  params.append('checkOut', checkOut);
  params.append('travelers', travelers);

  // Redirect to hotel_search.html with parameters
  window.location.href = 'pages/hotel_search.html?' + params.toString();
});
