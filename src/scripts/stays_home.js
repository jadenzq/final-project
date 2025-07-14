document.addEventListener('DOMContentLoaded', () => {
  // --- Travelers Dropdown Logic for Stays Home Page ---
  const travelersSummaryInput = document.getElementById('travelers-summary-input');
  const travelersDropdown = document.getElementById('travelers-dropdown');
  const adultsInput = document.getElementById('adults-input');
  const childrenInput = document.getElementById('children-input');
  const roomsInput = document.getElementById('rooms-input');
  const quantityButtons = document.querySelectorAll('.quantity-btn');

  // Function to update the summary text in the main input field
  function updateTravelersSummary() {
    const adults = parseInt(adultsInput.value);
    const children = parseInt(childrenInput.value);
    const rooms = parseInt(roomsInput.value);
    travelersSummaryInput.value = `${adults} adult${adults !== 1 ? 's' : ''} - ${children} child${children !== 1 ? 'ren' : ''} - ${rooms} room${rooms !== 1 ? 's' : ''}`;
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

      const targetInputId = button.dataset.target + '-input';
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
      updateTravelersSummary(); // Update summary after value changes
    });
  });

  // Hide dropdown when clicking outside
  document.addEventListener('click', (event) => {
    if (!travelersDropdown.contains(event.target) && !travelersSummaryInput.contains(event.target)) {
      travelersDropdown.classList.add('hidden');
    }
  });

  // Initialize summary text on page load
  updateTravelersSummary();


  // --- Vibe Buttons and Content Logic for Stays Home Page ---
  const vibeButtons = document.querySelectorAll('.vibe-btn');
  const vibeContentAreas = document.querySelectorAll('.vibe-content');

  function showVibeContent(vibe) {
    // Hide all content areas
    vibeContentAreas.forEach(content => {
      content.classList.add('hidden');
    });

    // Show the selected content area
    const selectedContent = document.getElementById(`${vibe}-content`);
    if (selectedContent) {
      selectedContent.classList.remove('hidden');
    }
  }

  function setActiveVibeButton(clickedButton) {
    // Remove active styles and add inactive styles (including hover)
    vibeButtons.forEach(button => {
      button.classList.remove('bg-blue-700', 'text-white');
      button.classList.add('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300'); // Ensure hover is present for inactive
    });

    // Add active styles to the clicked button and remove its hover effect
    clickedButton.classList.remove('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300'); // Remove hover
    clickedButton.classList.add('bg-blue-700', 'text-white');
  }

  // Add click listeners to vibe buttons
  vibeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const vibe = button.dataset.vibe;
      setActiveVibeButton(button);
      showVibeContent(vibe);
    });
  });

  // Initialize with 'city' content shown and 'City' button active
  const defaultVibeButton = document.querySelector('.vibe-btn[data-vibe="city"]');
  if (defaultVibeButton) {
    setActiveVibeButton(defaultVibeButton);
    showVibeContent('city');
  }
});
