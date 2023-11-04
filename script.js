// Button to Toggle Dropdown of All Timezones Options
const tzDropdown = document.getElementById('tz-dropdown');
const toggleTzButton = document.getElementById('list-tz-btn');
const userTzButton = document.getElementById('user-tz-btn');

// Button to Generate Random Timezones
const shuffleButton = document.getElementById('shuffle-tz-btn');

// Timezone Button Wrapper - For Dynamically Generated Buttons
const timezoneButtonWrapper = document.querySelector('.timezone-button-group');

// Time Card General
const timeCardHeading = document.querySelector('.time-card--heading h1');

// Time Card Info Section
const dateInfoHeading = document.querySelector('.tz-data-wrapper h3');
const tzDaylightSavings = document.getElementById('tz-daylight');
const tzOfficialName = document.getElementById('tz-official-name');
const tzDayYear = document.getElementById('tz-day-year');
const tzRegion = document.getElementById('tz-region');
const tzGoogle = document.getElementById('tz-google');

// Time Card: Digital Clock
const digitalTime = document.querySelector('.clock--digital-time');
const digitalSeconds = document.querySelector('.clock--digital-s');
const digitalAM = document.querySelector('.clock--am');
const digitalPM = document.querySelector('.clock--pm');

// Time Card: Analog Clock
const clockDate = document.querySelector('.clock--date');
const clockSecond = document.querySelector('.clock--hand-second');
const clockMinute = document.querySelector('.clock--hand-minute');
const clockHour = document.querySelector('.clock--hand-hour');

// Variables To Be Used As IDs To Clear Intervals
let digitalClockInterval;
let analogClockInterval;

// Popular Timezone Names
const abbrs = {
	ACDT: 'ACDT, Australian Central Daylight Time',
	ACST: 'ACST, Australian Central Standard Time',
	ADT: 'ADT, Atlantic Daylight Time',
	AEDT: 'AEDT, Australian Eastern Daylight Time',
	AEST: 'AEST, Australian Eastern Standard Time',
	AKDT: 'AKDT, Alaska Daylight Time',
	AST: 'AST, Atlantic Standard Time',
	AWST: 'AWST, Australian Western Standard Time',
	BST: 'BST, British Summer Time',
	CAT: 'CAT, Central Africa Time',
	CDT: 'CDT, Central Daylight Time',
	CET: 'CET, Central European Time',
	CEST: 'CEST, Central European Summer Time',
	ChST: 'CHST, Chamorro Standard Time',
	CST: 'CST, Central Standard Time',
	EAT: 'EAT, East Africa Time',
	EAST: 'EAST, Eastern European Summer Time',
	EDT: 'EDT, Eastern Daylight Time',
	EEST: 'EEST, Eastern European Summer Time',
	EET: 'EET, Eastern European Time',
	EST: 'EST, Eastern Standard Time',
	GET: 'GET, Georgia Standard Time',
	GMT: 'GMT, Greenwich Mean Time',
	GST: 'GST, Gulf Standard Time',
	HDT: 'HDT, Hawaii–Aleutian Daylight Time',
	HST: 'HST, Hawaii Standard Time',
	IDT: 'IDT, Israel Daylight Time',
	IRST: 'IRST, Iran Standard Time',
	IST: 'IST, Indian Standard Time',
	JST: 'JST, Japan Standard Time',
	KST: 'KST, Korean Standard Time',
	LHDT: 'LHDT, Lord Howe Daylight Time',
	LHST: 'LHST, Lord Howe Standard Time',
	MSK: 'MSK, Moscow Standard Time',
	MST: 'MST, Mountain Standard Time',
	MSK: 'MSK, Moscow Standard Time',
	MT: 'MT, Mountain Time',
	MDT: 'MDT, Mountain Daylight Time',
	MUT: 'MUT, Mauritius Time',
	MYT: 'MYT, Malaysia Time',
	NDT: 'NDT, Newfoundland Time',
	NPT: 'NPT, Nepal Time',
	NST: 'NST, North Sumatra Time',
	NZDT: 'NZDT, New Zealand Daylight Time',
	PDT: 'PDT, Pacific Daylight Time',
	PKT: 'PKT, Pakistan Standard Time',
	PST: 'PST, Pacific Standard Time',
	SAST: 'SAST, South African Standard Time',
	SST: 'SST, Samoa Standard Time',
	RET: 'RET, Reunion Time',
	SCT: 'SCT, Seychelles Time',
	SLST: 'SLST, Sri Lanka Standard Time',
	SGT: 'SGT, Singapore Time',
	TRT: 'TRT, Turkey Time',
	VET: 'VET, Venezuela Standard Time',
	WAT: 'WAT, West African Time',
	WEST: 'WEST, Western European Summer Time',
	WET: 'WET, Western European Time',
	WIB: 'WIB, Western Indonesian Time',
};

/*************************
Functionality ************
*************************/

// Initial timezone
function renderUserLocation() {
	const savedLocation = localStorage.getItem('location');
	if (savedLocation) {
		updateTimeCard(savedLocation);
		updateAnalogClock(savedLocation);
	} else {
		updateTimeCard(moment.tz.guess());
		updateAnalogClock(moment.tz.guess());
	}
}

renderUserLocation();

// Timezone Dropdown List
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

// Shuffle Timezones Button
shuffleButton.addEventListener('click', function () {
	generateRandomTzButtons();

	document
		.querySelector('.timezone-wrapper')
		.scrollIntoView({ behavior: 'smooth' });
});

// Current Location Button
userTzButton.addEventListener('click', function () {
	updateTimeCard(moment.tz.guess());
	updateAnalogClock(moment.tz.guess());

	removeActiveTzButtons();
});

// Remove active from timezone buttons
function removeActiveTzButtons() {
	const newlyGeneratedBtns = timezoneButtonWrapper.querySelectorAll('button');
	newlyGeneratedBtns.forEach(el => el.classList.remove('active'));
}

/* All timezones into an array */
// Remove any timezones that do not have a region defined (e.g. GMT+100 should not be included)
const allTimezones = moment.tz
	.names()
	.filter(
		timezone =>
			timezone.includes('/') &&
			!timezone.includes('+') &&
			!timezone.includes('-')
	);

// Format timezone name
function formatTzName(tz, i) {
	return tz.split('/')[i].replace(/_/g, ' ');
}

// Random index for timezone array
function getRandomTz(array) {
	const randomIndex = Math.floor(Math.random() * array.length);
	return array[randomIndex];
}

// Add timezones to dropdown
for (const timezone of allTimezones) {
	const option = document.createElement('option');
	option.value = timezone;
	option.textContent = timezone;
	tzDropdown.appendChild(option);
}

// Generate 30 unique timezone buttons
function generateRandomTzButtons() {
	timezoneButtonWrapper.innerHTML = '';

	const uniqueTimezones = [];
	while (uniqueTimezones.length < 30) {
		const randomTz = getRandomTz(allTimezones);
		if (randomTz !== 'undefined') {
			uniqueTimezones.push(randomTz);
		}
	}

	for (const timezone of uniqueTimezones) {
		const button = document.createElement('button');
		function addButtonContent() {
			button.innerHTML = `
			<p>${formatTzName(timezone, 1)}</p><p>${formatTzName(timezone, 0)}</p>
			<span>${moment.tz(timezone).format('hh[:]mm[:]ss A')}</span>
			`;
		}
		addButtonContent();
		setInterval(addButtonContent, 1000);
		timezoneButtonWrapper.appendChild(button);

		button.addEventListener('click', () => {
			removeActiveTzButtons();

			button.classList.add('active');
			updateTimeCard(timezone);
			updateAnalogClock(timezone);

			document.querySelector('main').scrollIntoView({ behavior: 'smooth' });
		});
	}
}

generateRandomTzButtons();

// Update Time Card content
function updateTimeCard(tz) {
	localStorage.setItem('location', tz);

	clearInterval(digitalClockInterval);

	updateDigitalClock(tz);

	// Override Moment's default abbreviations
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

	dateInfoHeading.innerHTML = `${moment
		.tz(tz)
		.format('dddd[,] MMMM Do[,] YYYY')}`;
	tzDayYear.innerHTML = `${moment.tz(tz).format('DDDo')}`;
	tzRegion.innerHTML = `${formatTzName(tz, 0)}`;
	tzGoogle.innerHTML = `<a href="https://www.google.com/search?q=
		${formatTzName(tz, 1)}, ${formatTzName(tz, 0)}"
		target="_blank"
		rel="noopener noreferrer"
		>Search on <i class="fa-brands fa-google"></i> 
		about ${formatTzName(tz, 1)}</a>`;

	moment.tz(tz).isDST() === true
		? (tzDaylightSavings.innerHTML = `Active`)
		: (tzDaylightSavings.innerHTML = 'Inactive');
}

function updateDigitalClock(tz) {
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
