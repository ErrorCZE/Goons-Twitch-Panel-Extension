const socket = new WebSocket('wss://tarkovbot.eu:443');
const reportedLocation = document.querySelector('.reportedlocation');
const pozadiImage = document.querySelector('.pozadi');
const reportedAgo = document.querySelector('.reportedago');

let timeAgo = 0;
let dataReceived = false;
let data = null; // Define data in the outer scope

socket.addEventListener('message', (event) => {
  data = JSON.parse(event.data); // Update data
  reportedLocation.textContent = data.location;
  pozadiImage.src = `./public/img/${data.location}.webp`;

  if (data.reported) {
    timeAgo = calculateTimeAgo(data.reported);
    dataReceived = true;
  } else {
    dataReceived = false;
  }

  updateReportedAgo();
});

function calculateTimeAgo(reportedTimestamp) {
  const currentUtcTime = new Date().toUTCString();
  const currentTime = new Date(currentUtcTime).getTime();
  const reportTime = new Date(reportedTimestamp).getTime();
  const timeDifference = currentTime - reportTime;
  return formatTimeDifference(timeDifference);
}

function formatTimeDifference(timeDifference) {
  const seconds = Math.floor(timeDifference / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  let formattedTime = '';

  if (hours > 0) {
    formattedTime += hours + 'h ';
  }
  if (minutes > 0 || (hours === 0 && remainingSeconds === 0)) {
    formattedTime += minutes + 'm ';
  }
  if (remainingSeconds > 0 || (hours === 0 && minutes === 0)) {
    formattedTime += remainingSeconds + 's ';
  }

  return formattedTime.trim() || '0s';
}

function updateReportedAgo() {
  if (dataReceived) {
    reportedAgo.textContent = timeAgo + ' ago';
  } else {
    reportedAgo.textContent = 'No Data';
  }
}

updateReportedAgo();

setInterval(() => {
  if (dataReceived && data.reported) {
    timeAgo = calculateTimeAgo(data.reported);
  }
  updateReportedAgo();
}, 1000);
