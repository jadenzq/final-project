document.addEventListener('DOMContentLoaded', () => {
  // --- Travelers Dropdown Logic (similar to stays, but with flights-specific IDs) ---
  const travelersSummaryInput = document.getElementById('flights-travelers-summary-input');
  const travelersDropdown = document.getElementById('flights-travelers-dropdown');
  const adultsInput = document.getElementById('flights-adults-input');
  const childrenInput = document.getElementById('flights-children-input');
  const infantsInput = document.getElementById('flights-infants-input'); // New for flights
  const quantityButtons = document.querySelectorAll('.flights-quantity-btn'); // Use specific class

  // --- Trip Type Logic ---
  const roundTripRadio = document.getElementById('round-trip');
  const oneWayRadio = document.getElementById('one-way');
  const returnDateSection = document.getElementById('return-date-section');

  // Function to update the summary text in the main input field
  function updateFlightsTravelersSummary() {
    const adults = parseInt(adultsInput.value);
    const children = parseInt(childrenInput.value);
    const infants = parseInt(infantsInput.value);
    let summary = `${adults} adult${adults !== 1 ? 's' : ''}`;
    if (children > 0) {
      summary += ` - ${children} child${children !== 1 ? 'ren' : ''}`;
    }
    if (infants > 0) {
      summary += ` - ${infants} infant${infants !== 1 ? 's' : ''}`;
    }
    travelersSummaryInput.value = summary;
  }

  // Function to toggle return date visibility based on trip type
  function toggleReturnDateVisibility() {
    if (oneWayRadio.checked) {
      returnDateSection.classList.add('hidden');
    } else {
      returnDateSection.classList.remove('hidden');
    }
  }

  // Toggle dropdown visibility
  travelersSummaryInput.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent click from propagating to document
    travelersDropdown.classList.toggle('hidden');
  });

  // Handle increment/decrement buttons
  quantityButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent form submission
      event.stopPropagation(); // Prevent click from propagating to document

      const targetInputId = 'flights-' + button.dataset.target + '-input'; // flights-adults-input, etc.
      const targetInput = document.getElementById(targetInputId);
      const action = button.dataset.action;
      let currentValue = parseInt(targetInput.value);

      if (action === 'increment') {
        currentValue++;
      } else if (action === 'decrement') {
        if (currentValue > parseInt(targetInput.min)) {
          currentValue--;
        }
      }
      targetInput.value = currentValue;
      updateFlightsTravelersSummary(); // Update summary after value changes
    });
  });

  // Hide dropdown when clicking outside
  document.addEventListener('click', (event) => {
    if (!travelersDropdown.contains(event.target) && !travelersSummaryInput.contains(event.target)) {
      travelersDropdown.classList.add('hidden');
    }
  });

  // Add event listeners for trip type radio buttons
  roundTripRadio.addEventListener('change', toggleReturnDateVisibility);
  oneWayRadio.addEventListener('change', toggleReturnDateVisibility);

  // Initialize summary text and return date visibility on page load
  updateFlightsTravelersSummary();
  toggleReturnDateVisibility();

  // --- flight_planner_switch.js logic merged here ---
  const vibeButtonsFlights = document.querySelectorAll('.vibe-btn-flights');
  const vibeContentAreasFlights = document.querySelectorAll('.vibe-content-flights');

  function showVibeContentFlights(vibe) {
    vibeContentAreasFlights.forEach(content => {
      content.classList.add('hidden');
    });

    const selectedContent = document.getElementById(`${vibe}-content`);
    if (selectedContent) {
      selectedContent.classList.remove('hidden');
    }
  }

  function setActiveVibeButtonFlights(clickedButton) {
    vibeButtonsFlights.forEach(button => {
      button.classList.remove('bg-blue-700', 'text-white');
      button.classList.add('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
    });

    clickedButton.classList.remove('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
    clickedButton.classList.add('bg-blue-700', 'text-white');
  }

  vibeButtonsFlights.forEach(button => {
    button.addEventListener('click', () => {
      const vibe = button.dataset.vibe;
      setActiveVibeButtonFlights(button);
      showVibeContentFlights(vibe);
    });
  });

  // Initialize with 'city-flights' content shown and 'City' button active
  const defaultVibeButtonFlights = document.querySelector('.vibe-btn-flights[data-vibe="city-flights"]');
  if (defaultVibeButtonFlights) {
    setActiveVibeButtonFlights(defaultVibeButtonFlights);
    showVibeContentFlights('city-flights');
  }
});

// The setActiveSort function is not part of the DOMContentLoaded listener as it's a global function called by onclick attributes.
function setActiveSort(btn) {
  document.querySelectorAll(".sort-btn").forEach((b) => {
    b.classList.remove(
      "font-semibold",
      "border-b-2",
      "border-sky-600",
      "pb-1",
      "text-sky-600"
    );
    b.classList.add("text-gray-500");
  });
  btn.classList.remove("text-gray-500");
  btn.classList.add(
    "font-semibold",
    "border-b-2",
    "border-sky-600",
    "pb-1",
    "text-sky-600"
  );
}
