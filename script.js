const tzDropdown = document.getElementById('tz-dropdown');
const toggleTzButton = document.getElementById('list-tz-btn');

toggleTzButton.addEventListener('click', function () {
	if (tzDropdown.style.display === 'block') {
		tzDropdown.style.display = 'none';
	} else {
		tzDropdown.style.display = 'block';
	}
});

tzDropdown.addEventListener('change', function (event) {
	updateTimeCard(event.target.value);
	updateAnalogClock(event.target.value);
});

/* Time Card */
const timeCardHeading = document.querySelector('.time-card--heading h1');

/* Analog Clock */
const clockDate = document.querySelector('.clock--date');
const clockSecond = document.querySelector('.clock--hand-second');
const clockMinute = document.querySelector('.clock--hand-minute');
const clockHour = document.querySelector('.clock--hand-hour');

/* Digital Clock */
const digitalTime = document.querySelector('.clock--digital-time');
const digitalSeconds = document.querySelector('.clock--digital-s');
const digitalAM = document.querySelector('.clock--am');
const digitalPM = document.querySelector('.clock--pm');

/* Card Info Section */
const dateInfoHeading = document.querySelector('.tz-data-wrapper h3');
const tzTimeDifference = document.getElementById('tz-difference');
const tzOfficialName = document.getElementById('tz-official-name');
const tzDayYear = document.getElementById('tz-day-year');
const tzRegion = document.getElementById('tz-region');
const tzGoogle = document.getElementById('tz-google');

let digitalClockInterval;
let analogClockInterval;

function updateTimeCard(tz) {
	localStorage.setItem('location', tz);
	clearInterval(digitalClockInterval);

	/* DIGITAL CLOCK */
	timeCardHeading.innerHTML = `${formatTzName(tz, 1)}`;
	digitalTime.innerHTML = `${moment.tz(tz).format('hh[:]mm')}`;
	digitalSeconds.innerHTML = `${moment.tz(tz).format('[:]ss')}`;

	digitalClockInterval = setInterval(() => {
		digitalTime.innerHTML = `${moment.tz(tz).format('hh[:]mm')}`;
		digitalSeconds.innerHTML = `${moment.tz(tz).format('[:]ss')}`;
	}, 1000);

	if (moment.tz(tz).format('A') === 'AM') {
		digitalAM.classList.add('active');
		digitalPM.classList.remove('active');
	} else {
		digitalAM.classList.remove('active');
		digitalPM.classList.add('active');
	}

	/* ADDITIONAL DATA/INFO SECTION */
	dateInfoHeading.innerHTML = `${moment
		.tz(tz)
		.format('dddd[,] MMMM Do[,] YYYY')}`;
	tzDayYear.innerHTML = `${moment.tz(tz).format('DDDo')}`;

	const abbrs = {
		EST: 'EST, Eastern Standard Time',
		EDT: 'EDT, Eastern Daylight Time',
		CST: 'CST, Central Standard Time',
		CDT: 'CDT, Central Daylight Time',
		MST: 'MST, Mountain Standard Time',
		MDT: 'MDT, Mountain Daylight Time',
		PST: 'PST, Pacific Standard Time',
		PDT: 'PDT, Pacific Daylight Time',
		ACDT: 'ACDT, Australian Central Daylight Time',
		EEST: 'EEST, Eastern European Summer Time',
		CEST: 'CEST, Central European Summer Time',
		AKDT: 'AKDT, Alaska Daylight Time',
		GMT: 'GMT, Greenwich Mean Time',
		ADT: 'ADT, Atlantic Daylight Time',
		IDT: 'IDT, Israel Daylight Time',
		MSK: 'MSK, Moscow Standard Time',
		AWST: 'AWST, Australian Western Standard Time',
		AST: 'AST, Atlantic Standard Time',
		WAT: 'WAT, West African Time',
		EAT: 'EAT, East African Time',
		NDT: 'NDT, Newfoundland Time',
		ACST: 'ACST, Australian Central Standard Time',
		SST: 'SST, Samoa Standard Time',
		HST: 'HST, Hawaii Standard Time',
		SAST: 'SAST, South African Standard Time',
		CAT: 'CAT, Central Africa Time',
		BST: 'BST, British Summer Time',
		AEDT: 'AEDT, Australian Eastern Daylight Time',
		HDT: 'HDT, Hawaii–Aleutian Daylight Time',
		WEST: 'WEST, Western European Summer Time',
		AEST: 'AEST, Australian Eastern Standard Time',
		NZDT: 'NZDT, New Zealand Daylight Time',
		WIB: 'WIB, Western Indonesian Time',
		EET: 'EET, Eastern European Time',
	};

	moment.fn.zoneName = function () {
		const abbr = this.zoneAbbr();
		return abbrs[abbr] || abbr;
	};

	if (
		moment.tz(tz).format('zz').includes('+') ||
		moment.tz(tz).format('zz').includes('-')
	) {
		tzOfficialName.innerHTML = `
        Time Offset: <span> ${moment.tz(tz).format('zz')}</span>`;
	} else {
		tzOfficialName.innerHTML = `
        Timezone: <span> ${moment.tz(tz).format('zz')}</span>`;
	}
	tzRegion.innerHTML = `${formatTzName(tz, 0)}`;
	tzGoogle.innerHTML = `<a
							href="https://www.google.com/search?q=${formatTzName(tz, 1)}"
							target="_blank"
							rel="noopener noreferrer"
							>Search on <i class="fa-brands fa-google"></i> about ${formatTzName(tz, 1)}</a
						>`;
	tzTimeDifference.innerHTML = 'Not yet...';
}

function updateAnalogClock(tz) {
	clearInterval(analogClockInterval);

	let seconds = (moment.tz(tz).format('s') / 60) * 360;
	let minutes = (moment.tz(tz).format('m') / 60) * 360;
	let hours = moment.tz(tz).format('h') * 30;

	clockDate.innerHTML = `${moment.tz(tz).format('MM[-]DD[-]YYYY')}`;
	clockSecond.style.transform = `rotate(${seconds}deg)`;
	clockMinute.style.transform = `rotate(${minutes}deg)`;
	clockHour.style.transform = `rotate(${hours}deg)`;

	analogClockInterval = setInterval(() => updateAnalogClock(tz), 1000);
}

const savedLocation = localStorage.getItem('location');
if (savedLocation) {
	updateTimeCard(savedLocation);
	updateAnalogClock(savedLocation);
} else {
	updateTimeCard(moment.tz.guess());
	updateAnalogClock(moment.tz.guess());
}

const allTz = moment.tz.names();
// Remove any timezones that do not have a region defined
const filteredTz = allTz.filter(
	timezone =>
		timezone.includes('/') && !timezone.includes('+') && !timezone.includes('-')
);

/* Get Random Index for Timezone */
function getRandomTz(array) {
	const randomIndex = Math.floor(Math.random() * array.length);
	return array[randomIndex];
}

/* Format Timezone Name */
function formatTzName(tz, i) {
	return tz.split('/')[i].replace(/_/g, ' ');
}

/* Add Dropdown Selection */
for (const timezone of filteredTz) {
	const option = document.createElement('option');
	option.value = timezone;
	option.textContent = timezone;
	tzDropdown.appendChild(option);
}

/* Generate 30 Random Buttons */
function generateRandomTzButtons() {
	const timezoneButtonWrapper = document.querySelector(
		'.timezone-button-group'
	);
	timezoneButtonWrapper.innerHTML = '';

	const uniqueTimezones = [];
	while (uniqueTimezones.length < 30) {
		const randomTz = getRandomTz(filteredTz);
		if (randomTz !== 'undefined') {
			uniqueTimezones.push(randomTz);
		}
	}

	for (const timezone of uniqueTimezones) {
		const button = document.createElement('button');
		button.innerHTML = `<p>${formatTzName(timezone, 1)}</p>
						<p>${formatTzName(timezone, 0)}</p>`;
		timezoneButtonWrapper.appendChild(button);

		button.addEventListener('click', () => {
			updateTimeCard(timezone);
			updateAnalogClock(timezone);
		});
	}
}

generateRandomTzButtons();

const shuffleButton = document.getElementById('shuffle-tz-btn');
shuffleButton.addEventListener('click', generateRandomTzButtons);
