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

/////////////////////////////////////////
// Slider functionality for hairstyles
const slider = document.querySelector('.hairstyle-slider');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
let scrollAmount = 0;

// Event listeners for next and previous buttons
nextBtn.addEventListener('click', () => slideNext());
prevBtn.addEventListener('click', () => slidePrev());

function slideNext() {
  const sliderWidth = slider.scrollWidth;
  const containerWidth = slider.parentElement.offsetWidth;
  const maxScroll = sliderWidth - containerWidth;

  scrollAmount = Math.min(scrollAmount + containerWidth, maxScroll);
  slider.style.transform = `translateX(-${scrollAmount}px)`;
}

function slidePrev() {
  scrollAmount = Math.max(scrollAmount - slider.parentElement.offsetWidth, 0);
  slider.style.transform = `translateX(-${scrollAmount}px)`;
}

// Swiping functionality for mobile
let startX,
  startY,
  currentX,
  currentY,
  isSwiping = false;

slider.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
  isSwiping = false;
});

slider.addEventListener('touchmove', e => {
  currentX = e.touches[0].clientX;
  currentY = e.touches[0].clientY;

  const diffX = currentX - startX;
  const diffY = currentY - startY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    isSwiping = true;
    e.preventDefault();
    if (diffX > 50) {
      slidePrev();
      startX = currentX;
    } else if (diffX < -50) {
      slideNext();
      startX = currentX;
    }
  }
});

slider.addEventListener('touchend', () => {
  if (isSwiping) {
    isSwiping = false;
  }
});

// Hairstyle selection functionality
const hairstyleCards = document.querySelectorAll('.hairstyle-card');
const selectedHairstyleDisplay = document.getElementById('selected-hairstyle');

hairstyleCards.forEach(card => {
  card.addEventListener('click', () => {
    hairstyleCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');

    const hairstyleImage = card.querySelector('img').src;
    const hairstyleInfo = card.querySelector('p').textContent;

    selectedHairstyleDisplay.innerHTML = `
      <div class="selected-info-box">
        <img src="${hairstyleImage}" alt="Selected Hairstyle" />
        <span>${hairstyleInfo}</span>
      </div>
    `;

    const selectedHairstyle = {
      image: hairstyleImage,
      text: hairstyleInfo,
    };

    // Using sessionStorage to store the selected hairstyle
    sessionStorage.setItem(
      'selectedHairstyle',
      JSON.stringify(selectedHairstyle)
    );

    updateConfirmButtonState();
  });
});

/////////////////////////////////////////////
// Calendar Elements
const calendarTitle = document.getElementById('calendarTitle');
const calendarGrid = document.getElementById('calendarGrid');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const summaryText = document.getElementById('summaryText');

const morningSlotsContainer = document.getElementById('morningSlots');
const afternoonSlotsContainer = document.getElementById('afternoonSlots');

let currentDate = new Date();
let selectedDate = null;
let selectedSlot = null;

// Generate time slots
const timeSlots = {
  morning: generateTimeSlots(9, 12),
  afternoon: generateTimeSlots(12, 17),
};

function generateTimeSlots(startHour, endHour) {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(`${formatTime(hour, 0)}`);
    slots.push(`${formatTime(hour, 30)}`);
  }
  return slots;
}

function formatTime(hour, minutes) {
  const period = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour > 12 ? hour - 12 : hour;
  return `${formattedHour}:${minutes === 0 ? '00' : minutes} ${period}`;
}
function renderCalendar() {
  calendarGrid.innerHTML = '';
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const today = new Date();

  calendarTitle.textContent = firstDayOfMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  let dayOfWeek = firstDayOfMonth.getDay();

  // Skip Sundays
  dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

  // Adjust the starting empty cells to align properly (skip Sundays)
  for (let i = 1; i < dayOfWeek; i++) {
    const emptyCell = document.createElement('div');
    calendarGrid.appendChild(emptyCell);
  }

  // Iterate over the days of the month
  for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
    const date = new Date(year, month, day);
    const button = document.createElement('button');
    button.textContent = day;

    // Disable past dates
    if (date < today.setHours(0, 0, 0, 0)) {
      button.classList.add('past');
      button.disabled = true;
    }

    // Check if it's a weekend (Sunday) and skip adding the button for Sundays
    if (date.getDay() === 0) {
      continue;
    }

    button.addEventListener('click', () => {
      if (selectedDate) selectedDate.classList.remove('selected');
      button.classList.add('selected');
      selectedDate = button;
      updateSummary();
    });

    calendarGrid.appendChild(button);
  }
}

function renderTimeSlots() {
  renderSlots(morningSlotsContainer, timeSlots.morning);
  renderSlots(afternoonSlotsContainer, timeSlots.afternoon);
}

function renderSlots(container, slots) {
  container.innerHTML = '';
  slots.forEach(slot => {
    const button = document.createElement('button');
    button.textContent = slot;
    button.addEventListener('click', () => {
      handleSlotSelection(button);
    });
    container.appendChild(button);
  });
}

function handleSlotSelection(selectedButton) {
  if (selectedSlot) selectedSlot.classList.remove('selected');
  selectedButton.classList.add('selected');
  selectedSlot = selectedButton;
  updateSummary();
}

function updateSummary() {
  const dateText = selectedDate
    ? `${formatSelectedDate()}`
    : 'No date selected';
  const timeText = selectedSlot
    ? `${selectedSlot.textContent}`
    : 'No time selected';

  summaryText.innerHTML = `Date: <b>${dateText}</b> | Time: <b>${timeText}</b>`;
  updateConfirmButtonState();
}

function updateConfirmButtonState() {
  const selectedHairstyle = sessionStorage.getItem('selectedHairstyle');
  confirmBtn.disabled = !(selectedDate && selectedSlot && selectedHairstyle);
}

function formatSelectedDate() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const day = parseInt(selectedDate.textContent);
  return new Date(year, month, day).toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

const confirmBtn = document.getElementById('confirmBtn');
confirmBtn.disabled = true;

confirmBtn.addEventListener('click', () => {
  if (selectedDate && selectedSlot) {
    sessionStorage.setItem('selectedDate', formatSelectedDate());
    sessionStorage.setItem('selectedTime', selectedSlot.textContent);
    window.location.href = 'confirmation.html';
  }
});

prevMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

renderCalendar();
renderTimeSlots();
