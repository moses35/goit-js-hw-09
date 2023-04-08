import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const header = document.querySelector('head');
const btnStart = document.querySelector('button[data-start]');
const timeInput = document.querySelector('#datetime-picker');
const valueDays = document.querySelector('.value[data-days]');
const valueHours = document.querySelector('.value[data-hours]');
const valueMinutes = document.querySelector('.value[data-minutes]');
const valueSeconds = document.querySelector('.value[data-seconds]');

const styles =
  '<style> .timer {display: flex; gap: 10px} .field {display: flex; flex-direction: column; align-items: center; font-weight: 500}</style>';
header.insertAdjacentHTML('beforeend', styles);

btnStart.disabled = true;
btnStart.addEventListener('click', onBtnStartClick);

let timerId = null;
let startTime = 0;
const INTERVAL_DELAY = 1000;

//choose date
flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0].getTime() <= Date.now()) {
      Notiflix.Notify.failure('Please choose a date in the future');
    } else {
      startTime = selectedDates[0].getTime();
      btnStart.disabled = false;
    }
  },
});

//start timer
function onBtnStartClick() {
  btnStart.disabled = true;
  timeInput.disabled = true;

  timerId = setInterval(() => {
    const curentTime = Date.now();
    const deltaTime = startTime - curentTime;
    const timeComponents = convertMs(deltaTime);
    updateClock(timeComponents);

    if (deltaTime <= 0) {
      clearInterval(timerId);
      valueDays.textContent = '00';
      valueHours.textContent = '00';
      valueMinutes.textContent = '00';
      valueSeconds.textContent = '00';
      timeInput.disabled = false;
    }
  }, INTERVAL_DELAY);
}

//add '0' before value
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

//convert time
function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );

  return { days, hours, minutes, seconds };
}

//change text content
function updateClock({ days, hours, minutes, seconds }) {
  valueDays.textContent = days;
  valueHours.textContent = hours;
  valueMinutes.textContent = minutes;
  valueSeconds.textContent = seconds;
}
