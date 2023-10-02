const tzDropdown = document.getElementById('tz-dropdown');
const toggleTzButton = document.getElementById('list-tz-btn');

toggleTzButton.addEventListener('click', function () {
	if (tzDropdown.style.display === 'block') {
		tzDropdown.style.display = 'none';
	} else {
		tzDropdown.style.display = 'block';
	}
});

/* Format Timezone Name */
function formatTzName(tz) {
	return tz.split('/')[1].replace('_', ' ');
}

/* Time Card */
const timeCardHeading = document.querySelector('.time-card--heading h1');
const clockDate = document.querySelector('.clock--date');
const digitalTime = document.querySelector('.clock--digital-time');
const digitalSeconds = document.querySelector('.clock--digital-s');
const digitalAM = document.querySelector('.clock--am');
const digitalPM = document.querySelector('.clock--pm');
const dateInfoHeading = document.querySelector('.tz-data-wrapper h3');

const tzTimeDifference = document.getElementById('tz-difference');
const tzOfficialName = document.getElementById('tz-official-name');
const tzDayYear = document.getElementById('tz-day-year');

function updateTimeCard(tz) {
	timeCardHeading.innerHTML = `${formatTzName(tz)}`;
	clockDate.innerHTML = `${moment.tz(tz).format('MM[-]DD[-]YYYY')}`;
	digitalTime.innerHTML = `${moment.tz(tz).format('hh[:]mm')}`;
	digitalSeconds.innerHTML = `${moment.tz(tz).format('[:]ss')}`;

	setInterval(() => {
		digitalTime.innerHTML = `${moment.tz(tz).format('hh[:]mm')}`;
		digitalSeconds.innerHTML = `${moment.tz(tz).format('[:]ss')}`;
	}, 1000);

	if (moment.tz(tz).format('A') === 'AM') {
		digitalAM.classList.add('active');
	} else digitalPM.classList.add('active');

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
	};

	moment.fn.zoneName = function () {
		const abbr = this.zoneAbbr();
		return abbrs[abbr] || abbr;
	};

	tzOfficialName.innerHTML = `${moment.tz(tz).format('zz')}`;
	tzTimeDifference.innerHTML = 'Not yet...';
}

updateTimeCard(moment.tz.guess());
