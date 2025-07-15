document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('search-flights-button').addEventListener('click', async function(event) {
        event.preventDefault(); // Prevent default form submission/redirection initially

        const leavingFrom = document.getElementById('leaving-from-input').value.trim();
        const goingTo = document.getElementById('going-to-input').value.trim();
        const departDateInput = document.getElementById('depart-date');
        const returnDateInput = document.getElementById('return-date');
        const flightsTravelersSummaryInput = document.getElementById('flights-travelers-summary-input');
        const oneWayRadio = document.getElementById('one-way');
        const roundTripRadio = document.getElementById('round-trip');

        const departDate = departDateInput.value.trim();
        const returnDate = returnDateInput.value.trim(); // Will be empty if one-way
        const travelers = flightsTravelersSummaryInput.value.trim();

        // Function to get today's date formatted as YYYY-MM-DD
        function getTodayFormatted() {
            const today = new Date();
            const year = today.getFullYear();
            const month = (today.getMonth() + 1).toString().padStart(2, '0');
            const day = today.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        // Basic validation for required fields
        // if (!leavingFrom || !goingTo || !departDate || !travelers) {
        //     alert("Please fill in all required flight search fields.");
        //     return;
        // }

        // Date Validation
        const todayString = getTodayFormatted();
        const todayObj = new Date(todayString);
        const departDateObj = new Date(departDate);

        if (departDateObj < todayObj) {
            alert("Departure date cannot be in the past.");
            return;
        }

        if (roundTripRadio.checked) {
            // if (!returnDate) {
            //     alert("Please select a return date for round trip.");
            //     return;
            // }
            const returnDateObj = new Date(returnDate);
            const minReturnDate = new Date(departDateObj);
            minReturnDate.setDate(minReturnDate.getDate() + 1);

            if (returnDateObj < minReturnDate) {
                alert("Return date must be at least one day after the departure date.");
                return;
            }
        }

        // Construct URL with query parameters
        const params = new URLSearchParams();
        params.append('leavingFrom', leavingFrom);
        params.append('goingTo', goingTo);
        params.append('departDate', departDate);
        if (roundTripRadio.checked) {
            params.append('returnDate', returnDate);
        }
        params.append('travelers', travelers);
        params.append('tripType', document.querySelector('input[name="trip-type"]:checked').value);

        console.log('Flight Search Parameters:', params.toString());

        window.location.href = 'pages/flight_search.html?' + params.toString();
    });
});
