document.addEventListener('DOMContentLoaded', () => {
    // Get elements for the flights traveler dropdown
    const flightsTravelersSummaryInput = document.getElementById('flights-travelers-summary-input');
    const flightsTravelersDropdown = document.getElementById('flights-travelers-dropdown');
    const flightsAdultsInput = document.getElementById('flights-adults-input');
    const flightsChildrenInput = document.getElementById('flights-children-input');
    const flightsInfantsInput = document.getElementById('flights-infants-input');
    const flightsQuantityBtns = document.querySelectorAll('.flights-quantity-btn');

    // Function to update the summary input text
    function updateFlightsTravelersSummary() {
        const adults = parseInt(flightsAdultsInput.value);
        const children = parseInt(flightsChildrenInput.value);
        const infants = parseInt(flightsInfantsInput.value);
        let summaryText = '';

        if (adults > 0) {
            summaryText += `${adults} adult${adults > 1 ? 's' : ''}`;
        }
        if (children > 0) {
            if (summaryText !== '') summaryText += ', ';
            summaryText += `${children} child${children > 1 ? 'ren' : ''}`;
        }
        if (infants > 0) {
            if (summaryText !== '') summaryText += ', ';
            summaryText += `${infants} infant${infants > 1 ? 's' : ''}`;
        }

        if (summaryText === '') {
            flightsTravelersSummaryInput.value = '1 adult'; // Default if no travelers selected
        } else {
            flightsTravelersSummaryInput.value = summaryText;
        }
    }

    // Toggle the travelers dropdown visibility
    flightsTravelersSummaryInput.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent click from closing immediately
        flightsTravelersDropdown.classList.toggle('hidden');
    });

    // Close the dropdown when clicking outside
    document.addEventListener('click', (event) => {
        if (!flightsTravelersDropdown.contains(event.target) && event.target !== flightsTravelersSummaryInput) {
            flightsTravelersDropdown.classList.add('hidden');
        }
    });

    // Handle increment/decrement buttons
    flightsQuantityBtns.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent form submission if button is inside a form
            event.stopPropagation(); // Prevent click from bubbling up to document and closing dropdown

            const target = button.dataset.target;
            const action = button.dataset.action;
            let inputElement;

            if (target === 'adults') {
                inputElement = flightsAdultsInput;
            } else if (target === 'children') {
                inputElement = flightsChildrenInput;
            } else if (target === 'infants') {
                inputElement = flightsInfantsInput;
            }

            let currentValue = parseInt(inputElement.value);

            if (action === 'increment') {
                inputElement.value = currentValue + 1;
            } else if (action === 'decrement') {
                if (currentValue > parseInt(inputElement.min)) {
                    inputElement.value = currentValue - 1;
                }
            }
            updateFlightsTravelersSummary();
        });
    });

    // Initial update of the summary input
    updateFlightsTravelersSummary();

    // --- Date Handling Logic ---
    const departDateInput = document.getElementById('depart-date');
    const returnDateInput = document.getElementById('return-date');
    const returnDateSection = document.getElementById('return-date-section'); // The div containing the return date input

    // Function to get today's date in UTC+8 (or local time for consistency with input type='date')
    function getTodayFormatted() {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Set min date for depart date to today
    const todayString = getTodayFormatted();
    departDateInput.setAttribute('min', todayString);

    // Function to update min date for return date
    function updateReturnDateMinDate() {
        const departDateValue = departDateInput.value;
        if (departDateValue) {
            const departDate = new Date(departDateValue);
            // Set return date min to one day after depart date
            departDate.setDate(departDate.getDate() + 1);
            const nextDayString = departDate.toISOString().split('T')[0];
            returnDateInput.setAttribute('min', nextDayString);

            // If return date is before the new min date, clear it
            if (returnDateInput.value && new Date(returnDateInput.value) < departDate) {
                returnDateInput.value = '';
            }
        } else {
            // If depart date is empty, return date min date is today
            returnDateInput.setAttribute('min', todayString);
        }
    }

    // Add event listener to depart date input
    departDateInput.addEventListener('change', updateReturnDateMinDate);

    // Initial call to set min date for return date
    updateReturnDateMinDate();

    // Handle "One way" radio button to hide/show return date
    const oneWayRadio = document.getElementById('one-way');
    const roundTripRadio = document.getElementById('round-trip');

    function toggleReturnDateVisibility() {
        if (oneWayRadio.checked) {
            returnDateSection.classList.add('hidden');
            returnDateInput.value = ''; // Clear return date if one-way
        } else {
            returnDateSection.classList.remove('hidden');
        }
    }

    oneWayRadio.addEventListener('change', toggleReturnDateVisibility);
    roundTripRadio.addEventListener('change', toggleReturnDateVisibility);

    // Initial check for return date visibility
    toggleReturnDateVisibility();
});
