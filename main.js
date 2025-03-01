let City = "Cairo";
let timings = {};
async function getPTimesByCity(City) {
  let url = `http://api.aladhan.com/v1/timingsByCity?city=${City}&country=EG&method=5`;
  let response = await fetch(url);
  let responseData = await response.json();

  timings = responseData.data.timings;
  let readable = responseData.data.date.hijri.date;
  let month = responseData.data.date.hijri.month.ar;
  let day = responseData.data.date.hijri.weekday.ar;

  console.log(responseData);

  dateday.innerHTML =
    day +
    " - " +
    `<span style="color: #a26b00; font-size: 26px;">${month}</span>`;
  date.innerHTML = readable;
  fajrTime.innerHTML = convertTo12HourFormat(timings.Fajr);
  sunriseTime.innerHTML = convertTo12HourFormat(timings.Sunrise);
  dhuhrTime.innerHTML = convertTo12HourFormat(timings.Dhuhr);
  asrTime.innerHTML = convertTo12HourFormat(timings.Asr);
  maghribTime.innerHTML = convertTo12HourFormat(timings.Maghrib);
  ishaTime.innerHTML = convertTo12HourFormat(timings.Isha);

  updateTimeDifferences();
}
getPTimesByCity(City);

// Convert 24-hour format to 12-hour format
function convertTo12HourFormat(time) {
  let [hours, minutes] = time.split(":");
  hours = (hours % 12 || 12).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function updateTimeDifferences() {
  let now = new Date();
  let prayerTimes = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha", "Sunrise"];

  prayerTimes.forEach((prayer) => {
    let [hours, minutes] = timings[prayer].split(":").map(Number);
    let prayerDate = new Date(now);
    prayerDate.setHours(hours, minutes, 0, 0);
    let diff = prayerDate - now;
    if (diff < 0) {
      diff += 24 * 60 * 60 * 1000;
    }

    let totalMinutes = Math.floor(diff / (1000 * 60));
    let hoursDiff = Math.floor(totalMinutes / 60);
    let minutesDiff = totalMinutes % 60;

    let prayerElement = document.getElementById(`${prayer.toLowerCase()}Min`);
    if (prayerElement) {
      prayerElement.innerHTML = ` الوقت المتبقي :  ${hoursDiff} ساعة,  ${minutesDiff} دقيقة `;
    }
  });
}

// select the city
citySelect.addEventListener("change", function () {
  let selectedValue = citySelect.value;
  let selectedValueLabel = document.querySelector(`[value="${selectedValue}"]`);
  mainTitle.innerHTML = selectedValueLabel.innerText;
  getPTimesByCity(selectedValue);
});
