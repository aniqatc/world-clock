/**************
All Necessary Declarations 
**************/

/* Time Card General */
const timeCardHeading = document.querySelector('.time-card--heading h1');

/* Time Card: Analog Clock */
const clockDate = document.querySelector('.clock--date');
const clockSecond = document.querySelector('.clock--hand-second');
const clockMinute = document.querySelector('.clock--hand-minute');
const clockHour = document.querySelector('.clock--hand-hour');

/* Time Card: Digital Clock */
const digitalTime = document.querySelector('.clock--digital-time');
const digitalSeconds = document.querySelector('.clock--digital-s');
const digitalAM = document.querySelector('.clock--am');
const digitalPM = document.querySelector('.clock--pm');

/* Time Card Info Section */
const dateInfoHeading = document.querySelector('.tz-data-wrapper h3');
const tzDaylightSavings = document.getElementById('tz-daylight');
const tzOfficialName = document.getElementById('tz-official-name');
const tzDayYear = document.getElementById('tz-day-year');
const tzRegion = document.getElementById('tz-region');
const tzGoogle = document.getElementById('tz-google');

/* Variables To Be Used As IDs To Clear Intervals */
let digitalClockInterval;
let analogClockInterval;

/* Button to Toggle Dropdown of All Timezones Options */
const tzDropdown = document.getElementById('tz-dropdown');
const toggleTzButton = document.getElementById('list-tz-btn');

/* Button to Generate 30 New Timezones */
const shuffleButton = document.getElementById('shuffle-tz-btn');

/*************************
 Main Functionality
*************************/

/* Generate content based on last selected timezone
or generate content based on user's current timezone */
const savedLocation = localStorage.getItem('location');
if (savedLocation) {
	updateTimeCard(savedLocation);
	updateAnalogClock(savedLocation);
} else {
	updateTimeCard(moment.tz.guess());
	updateAnalogClock(moment.tz.guess());
}

/* Generate content based on user's selected option on dropdown menu */
tzDropdown.addEventListener('change', function (event) {
	updateTimeCard(event.target.value);
	updateAnalogClock(event.target.value);
});

/* Toggle dropdown menu of timezones */
toggleTzButton.addEventListener('click', function () {
	if (tzDropdown.style.display === 'block') {
		tzDropdown.style.display = 'none';
	} else {
		tzDropdown.style.display = 'block';
	}
});

/* Shuffle button that generates 30 new timezones */
shuffleButton.addEventListener('click', generateRandomTzButtons);

/* Get all timezones into an array */
// Remove any timezones that do not have a region defined (e.g. GMT+100 should not be included)
const filteredTz = moment.tz
	.names()
	.filter(
		timezone =>
			timezone.includes('/') &&
			!timezone.includes('+') &&
			!timezone.includes('-')
	);

/* Format timezone name */
function formatTzName(tz, i) {
	return tz.split('/')[i].replace(/_/g, ' ');
}

/* Get random index to be used in timezone array */
function getRandomTz(array) {
	const randomIndex = Math.floor(Math.random() * array.length);
	return array[randomIndex];
}

/* Add timezones to dropdown selection (tzDropdown) */
for (const timezone of filteredTz) {
	const option = document.createElement('option');
	option.value = timezone;
	option.textContent = timezone;
	tzDropdown.appendChild(option);
}

/* Generate 30 random buttons that represent 30 different timezones */
function generateRandomTzButtons() {
	const timezoneButtonWrapper = document.querySelector(
		'.timezone-button-group'
	);
	/* Clear it everytime new buttons need to be generated */
	timezoneButtonWrapper.innerHTML = '';

	/* Get 30 unique timezones into a single array */
	const uniqueTimezones = [];
	while (uniqueTimezones.length < 30) {
		const randomTz = getRandomTz(filteredTz);
		if (randomTz !== 'undefined') {
			uniqueTimezones.push(randomTz);
		}
	}

	/* For each unique timezone, a button is generated */
	for (const timezone of uniqueTimezones) {
		const button = document.createElement('button');
		button.innerHTML = `<p>${formatTzName(timezone, 1)}</p>
						<p>${formatTzName(timezone, 0)}</p>`;
		timezoneButtonWrapper.appendChild(button);

		/* Button functionality to update Time Card content + add/remove active class */
		button.addEventListener('click', () => {
			newlyGeneratedBtns = timezoneButtonWrapper.querySelectorAll('button');
			newlyGeneratedBtns.forEach(el => el.classList.remove('active'));

			button.classList.add('active');
			updateTimeCard(timezone);
			updateAnalogClock(timezone);
		});
	}
}

/* Generate 30 random timezones by default */
generateRandomTzButtons();

/* Update all content in Time Card except analog clock */
function updateTimeCard(tz) {
	/* Save location to retrieve on next visit */
	localStorage.setItem('location', tz);

	/* Clear previous location's interval to prevent conflicts with new intervals */
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
	/* Popular Timezone Names */
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
		PKT: 'PKT, Pakistan Standard Time',
	};

	/* Override Moment's default abbreviations */
	moment.fn.zoneName = function () {
		const abbr = this.zoneAbbr();
		return abbrs[abbr] || abbr;
	};

	/* Show Time Offset OR Timezone depending on the information available */
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

	/* Readable date */
	dateInfoHeading.innerHTML = `${moment
		.tz(tz)
		.format('dddd[,] MMMM Do[,] YYYY')}`;

	/* Current # of day in the year (out of 365) */
	tzDayYear.innerHTML = `${moment.tz(tz).format('DDDo')}`;

	/* Timezone Region */
	tzRegion.innerHTML = `${formatTzName(tz, 0)}`;

	/* Link to search more about the selected location on Google */
	tzGoogle.innerHTML = `<a
							href="https://www.google.com/search?q=${formatTzName(tz, 1)}"
							target="_blank"
							rel="noopener noreferrer"
							>Search on <i class="fa-brands fa-google"></i> about ${formatTzName(tz, 1)}</a
						>`;

	/* Prints whether or not that location is currently in daylight savings */
	if (moment.tz(tz).isDST() === true) {
		tzDaylightSavings.innerHTML = `Active`;
	} else {
		tzDaylightSavings.innerHTML = 'Inactive';
	}
}

/* Animate analog clock with current timezone's time */
function updateAnalogClock(tz) {
	/* Clear previous location's interval to prevent conflicts with new intervals */
	clearInterval(analogClockInterval);

	/* Time converted to match movement around a circle */
	let seconds = (moment.tz(tz).format('s') / 60) * 360;
	let minutes = (moment.tz(tz).format('m') / 60) * 360;
	let hours = moment.tz(tz).format('h') * 30;

	clockDate.innerHTML = `${moment.tz(tz).format('MM[-]DD[-]YYYY')}`;
	clockSecond.style.transform = `rotate(${seconds}deg)`;
	clockMinute.style.transform = `rotate(${minutes}deg)`;
	clockHour.style.transform = `rotate(${hours}deg)`;

	analogClockInterval = setInterval(() => updateAnalogClock(tz), 1000);
}
