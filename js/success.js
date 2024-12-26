'use strict';

/////////////////////////////////////
//Dropdown function
function updateStatus() {
  const now = new Date();
  const hours = now.getHours();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const closedOpenText = document.querySelector('.closed-open');
  const openTimeText = document.querySelector('.open-time');

  const openingHour = 9; // 8:00 AM
  const closingHour = 17; // 5:00 PM

  const daysOfWeek = [
    'Sunday', // Sunday as "Tuday"
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const dropdownContent = document.querySelector('.dropdown-content');
  dropdownContent.innerHTML = ''; // Clear previous content

  // Helper function to format 24-hour time to 12-hour time
  function formatTime(hour) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12; // Convert 0 to 12 for midnight
    return `${formattedHour}:00 ${period}`;
  }

  // Generate the dropdown dynamically
  daysOfWeek.forEach((dayName, index) => {
    const isToday = index === day ? '<b>Today<b/>' : dayName;
    const status =
      index === 0
        ? 'Closed' // Sunday is closed
        : `${formatTime(openingHour)} - ${formatTime(closingHour)}`;

    dropdownContent.innerHTML += `
        <div class="dropdown-item"><span>${isToday}:</span> <span>${status}</span></div>
      `;
  });

  // Update closed/open status
  if (day === 0 || hours < openingHour || hours >= closingHour) {
    // If it's Sunday or outside business hours
    closedOpenText.textContent = 'Closed';

    if (day === 0) {
      openTimeText.textContent = `Opens tomorrow at ${formatTime(openingHour)}`;
    } else if (hours >= closingHour) {
      openTimeText.textContent = `Opens tomorrow at ${formatTime(openingHour)}`;
    } else {
      openTimeText.textContent = `Opens today at ${formatTime(openingHour)}`;
    }
  } else {
    // During business hours
    closedOpenText.textContent = `Open until ${formatTime(closingHour)}`;
    openTimeText.textContent = ''; // Hide open-time
  }
}

function toggleDropdown() {
  const dropdown = document.querySelector('.dropdown-content');
  const arrow = document.querySelector('.dropdown-arrow');

  dropdown.classList.toggle('show');
  arrow.classList.toggle('rotate');
}

// Initialize the status when the page loads
updateStatus();

////////////////////////////////////////////////
// Retrieve the hairstyle data from sessionStorage
const selectedHairstyle = JSON.parse(
  sessionStorage.getItem('selectedHairstyle')
);

// Check if data exists and display the selected hairstyle
const confirmationDetails = document.getElementById('confirmation-details');

if (selectedHairstyle) {
  confirmationDetails.innerHTML = `
    <img src="${selectedHairstyle.image}" alt="Selected Hairstyle" class="selected-hairstyle-img" style="max-width: 150px; border-radius: 8px;">
    <p class="selected-hairstyle-text"><b>${selectedHairstyle.text}</b></p>
  `;
} else {
  confirmationDetails.innerHTML = `
    <p>No hairstyle selected.</p>
  `;
}

////////////////////////////////////////
// Display selected date and time
const selectedDate = sessionStorage.getItem('selectedDate');
const selectedTime = sessionStorage.getItem('selectedTime');

// Check if date and time are available, and display them
if (selectedDate && selectedTime) {
  document.getElementById('selectedInfo').innerHTML = `
    <div class="success-date-time-info">
      <div class="success-date-time">
        <span class="bold-date">${selectedDate}</span> <br/>
        <span class="success-time-container">
          <ion-icon name="time-outline" class="time-icon"></ion-icon>
          ${selectedTime}
        </span>
      </div>
    </div>
  `;
}

////////////////////////////////////////
// Handle the success button click event
const successDoneBtn = document.querySelector('.success-done-button');
successDoneBtn.addEventListener('click', function () {
  // Remove the hairstyle data from localStorage
  localStorage.removeItem('selectedHairstyle');

  // Redirect to the home page
  window.location.href = 'index.html';
});
