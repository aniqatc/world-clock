/*************************
Elements *****************
*************************/

// Top buttons and search
const searchToggleButton = document.getElementById('search-toggle-btn');
const searchShortcut = document.getElementById('search-shortcut');
const searchWrapper = document.getElementById('search-wrapper');
const citySearch = document.getElementById('city-search');
const cityList = document.getElementById('city-list');
const userTzButton = document.getElementById('user-tz-btn');

// Shift time slider
const shiftRange = document.getElementById('shift-range');
const shiftLabel = document.getElementById('shift-label');
const shiftResetButton = document.getElementById('shift-reset-btn');

// City grids
const pinnedGroup = document.getElementById('pinned-group');
const pinnedCount = document.getElementById('pinned-count');
const exploreGroup = document.getElementById('explore-group');
const shuffleButton = document.getElementById('shuffle-tz-btn');

// Time Card General
const timeCard = document.getElementById('time-card');
const timeCardHeading = document.querySelector('.time-card--heading h1');
const timeCardSubheading = document.querySelector('.time-card--heading h2');

// Time Card Info Section
const dateInfoHeading = document.querySelector('.tz-data-wrapper h3');
const tzLabel = document.getElementById('tz-label');
const tzOfficialName = document.getElementById('tz-official-name');
const tzRelative = document.getElementById('tz-relative');
const tzStatus = document.getElementById('tz-status');
const tzDaylightSavings = document.getElementById('tz-daylight');
const tzGoogle = document.getElementById('tz-google');
const pinButton = document.getElementById('pin-btn');

// Time Card: Digital Clock
const digitalTime = document.querySelector('.clock--digital-time');
const digitalSeconds = document.querySelector('.clock--digital-s');
const digitalAM = document.querySelector('.clock--am');
const digitalPM = document.querySelector('.clock--pm');

// Time Card: Analog Clock
const clockSvg = document.querySelector('.clock--analog');
const clockDate = document.querySelector('.clock--date');
const clockSecond = document.querySelector('.clock--hand-second');
const clockMinute = document.querySelector('.clock--hand-minute');
const clockHour = document.querySelector('.clock--hand-hour');

/*************************
Time zone names **********
*************************/

// Popular Timezone Names
const abbrs = {
	ACDT: 'ACDT, Australian Central Daylight Time',
	ACST: 'ACST, Australian Central Standard Time',
	ADT: 'ADT, Atlantic Daylight Time',
	AEDT: 'AEDT, Australian Eastern Daylight Time',
	AEST: 'AEST, Australian Eastern Standard Time',
	AKDT: 'AKDT, Alaska Daylight Time',
	AKST: 'AKST, Alaska Standard Time',
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
	EAST: 'EAST, Easter Island Summer Time',
	EDT: 'EDT, Eastern Daylight Time',
	EEST: 'EEST, Eastern European Summer Time',
	EET: 'EET, Eastern European Time',
	EST: 'EST, Eastern Standard Time',
	GET: 'GET, Georgia Standard Time',
	GMT: 'GMT, Greenwich Mean Time',
	GST: 'GST, Gulf Standard Time',
	HDT: 'HDT, Hawaii–Aleutian Daylight Time',
	HKT: 'HKT, Hong Kong Time',
	HST: 'HST, Hawaii Standard Time',
	IDT: 'IDT, Israel Daylight Time',
	IRST: 'IRST, Iran Standard Time',
	IST: 'IST, Indian Standard Time',
	JST: 'JST, Japan Standard Time',
	KST: 'KST, Korean Standard Time',
	LHDT: 'LHDT, Lord Howe Daylight Time',
	LHST: 'LHST, Lord Howe Standard Time',
	MDT: 'MDT, Mountain Daylight Time',
	MSK: 'MSK, Moscow Standard Time',
	MST: 'MST, Mountain Standard Time',
	MT: 'MT, Mountain Time',
	MUT: 'MUT, Mauritius Time',
	MYT: 'MYT, Malaysia Time',
	NDT: 'NDT, Newfoundland Daylight Time',
	NPT: 'NPT, Nepal Time',
	NST: 'NST, Newfoundland Standard Time',
	NZDT: 'NZDT, New Zealand Daylight Time',
	NZST: 'NZST, New Zealand Standard Time',
	PDT: 'PDT, Pacific Daylight Time',
	PKT: 'PKT, Pakistan Standard Time',
	PST: 'PST, Pacific Standard Time',
	RET: 'RET, Reunion Time',
	SAST: 'SAST, South African Standard Time',
	SCT: 'SCT, Seychelles Time',
	SGT: 'SGT, Singapore Time',
	SLST: 'SLST, Sri Lanka Standard Time',
	SST: 'SST, Samoa Standard Time',
	TRT: 'TRT, Turkey Time',
	VET: 'VET, Venezuela Standard Time',
	WAT: 'WAT, West African Time',
	WEST: 'WEST, Western European Summer Time',
	WET: 'WET, Western European Time',
	WIB: 'WIB, Western Indonesian Time',
};

// Override Moment's default abbreviations once, so format('zz') uses the names above
moment.fn.zoneName = function () {
	const abbr = this.zoneAbbr();
	return abbrs[abbr] || abbr;
};

/*************************
State ********************
*************************/

const LOCAL_TZ = moment.tz.guess();
const DEFAULT_PINS = [
	LOCAL_TZ,
	'Europe/London',
	'Africa/Lagos',
	'Asia/Dhaka',
	'Asia/Tokyo',
	'America/Los_Angeles',
];
const MAX_PINS = 8;
const EXPLORE_COUNT = 24;

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

const savedLocation = readStorage('location');
let selectedTz = isValidTz(savedLocation) ? savedLocation : LOCAL_TZ;
let pinnedTzs = readPinnedTimezones();
let exploreTzs = [];
let shiftMinutes = 0;
let instant = moment();
let tiles = [];
const labelToTz = new Map();

/*************************
Helpers ******************
*************************/

// localStorage can throw in private windows, so every read and write is guarded
function readStorage(key) {
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
}

function writeStorage(key, value) {
	try {
		localStorage.setItem(key, value);
	} catch {
		// Storage unavailable: settings just won't persist
	}
}

function isValidTz(tz) {
	return typeof tz === 'string' && moment.tz.zone(tz) !== null;
}

function readPinnedTimezones() {
	try {
		const saved = JSON.parse(readStorage('pinned'));
		if (Array.isArray(saved)) {
			return [...new Set(saved.filter(isValidTz))].slice(0, MAX_PINS);
		}
	} catch {
		// Fall through to the defaults
	}
	return [...new Set(DEFAULT_PINS.filter(isValidTz))];
}

// "America/Argentina/Buenos_Aires" -> "Buenos Aires"
function cityName(tz) {
	const parts = tz.split('/');
	return parts[parts.length - 1].replace(/_/g, ' ');
}

// "America/Argentina/Buenos_Aires" -> "America"
function regionName(tz) {
	return tz.split('/')[0].replace(/_/g, ' ');
}

// Every clock reads from the same instant, so they all move together
function getTime(tz) {
	return instant.clone().tz(tz);
}

// 330 -> "+5h 30m", -240 -> "−4h"
function formatOffset(minutes) {
	const sign = minutes > 0 ? '+' : '−';
	const hours = Math.floor(Math.abs(minutes) / 60);
	const mins = Math.abs(minutes) % 60;
	return mins ? `${sign}${hours}h ${mins}m` : `${sign}${hours}h`;
}

function compareToLocal(tz) {
	const here = getTime(LOCAL_TZ);
	const there = getTime(tz);
	const hereDay = here.format('YYYY-MM-DD');
	const thereDay = there.format('YYYY-MM-DD');
	const diff = there.utcOffset() - here.utcOffset();

	let relative = diff === 0 ? 'Same time' : formatOffset(diff);
	if (tz === LOCAL_TZ) relative = 'Your time';

	let day = 'Today';
	if (thereDay > hereDay) day = 'Tomorrow';
	if (thereDay < hereDay) day = 'Yesterday';

	return { relative, day };
}

function statusFor(hour) {
	if (hour >= 9 && hour < 17) return 'Working hours';
	if (hour >= 6 && hour < 9) return 'Morning';
	if (hour >= 17 && hour < 22) return 'Evening';
	return 'Likely asleep';
}

// A zone observes DST if its offset differs between January and July
function daylightStatus(tz) {
	const time = getTime(tz);
	const january = moment.tz([time.year(), 0, 1], tz).utcOffset();
	const july = moment.tz([time.year(), 6, 1], tz).utcOffset();
	if (january === july) return 'Not observed';
	return time.isDST() ? 'Active' : 'Inactive';
}

// Fisher–Yates shuffle, so the grid never repeats a city
function pickRandomTimezones(count) {
	const pool = allTimezones.filter(tz => !pinnedTzs.includes(tz));
	for (let i = pool.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[pool[i], pool[j]] = [pool[j], pool[i]];
	}
	return pool.slice(0, count);
}

function prefersReducedMotion() {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/*************************
City tiles ***************
*************************/

// 24 hour blocks: night 8pm–6am, dusk at 6am and 7pm, day in between
const HOUR_SEGMENTS = Array.from({ length: 24 }, (_, hour) => {
	let kind = 'day';
	if (hour < 6 || hour >= 20) kind = 'night';
	else if (hour === 6 || hour === 19) kind = 'dusk';
	return `<span class="day-strip--hour day-strip--${kind}"></span>`;
}).join('');

function createTile(tz, isPinned) {
	const button = document.createElement('button');
	button.type = 'button';
	button.className = isPinned ? 'tz-tile tz-tile--pinned' : 'tz-tile';
	button.innerHTML = `
		<span class="tz-tile--city"></span>
		<span class="tz-tile--region"></span>
		<span class="tz-tile--time"><span class="tz-tile--clock"></span> <span class="tz-tile--ampm"></span></span>
		<span class="day-strip" aria-hidden="true">${HOUR_SEGMENTS}<span class="day-strip--marker"></span></span>
		<span class="tz-tile--relative"></span>
	`;
	button.querySelector('.tz-tile--city').textContent = cityName(tz);
	button.querySelector('.tz-tile--region').textContent =
		tz === LOCAL_TZ ? `You · ${regionName(tz)}` : regionName(tz);

	button.addEventListener('click', () => selectTimezone(tz, { scroll: true }));

	return {
		tz,
		el: button,
		clock: button.querySelector('.tz-tile--clock'),
		ampm: button.querySelector('.tz-tile--ampm'),
		marker: button.querySelector('.day-strip--marker'),
		relative: button.querySelector('.tz-tile--relative'),
	};
}

function renderTiles() {
	const pinnedTiles = pinnedTzs.map(tz => createTile(tz, true));
	const exploreTiles = exploreTzs.map(tz => createTile(tz, false));

	pinnedGroup.replaceChildren(...pinnedTiles.map(tile => tile.el));
	exploreGroup.replaceChildren(...exploreTiles.map(tile => tile.el));
	pinnedCount.textContent = `${pinnedTzs.length} of ${MAX_PINS}`;

	tiles = [...pinnedTiles, ...exploreTiles];
	markActiveTile();
	updateTiles();
}

function updateTiles() {
	for (const tile of tiles) {
		const time = getTime(tile.tz);
		const { relative, day } = compareToLocal(tile.tz);
		const dayProgress = (time.hours() + time.minutes() / 60) / 24;

		tile.clock.textContent = time.format('h:mm');
		tile.ampm.textContent = time.format('A');
		tile.relative.textContent = `${relative} · ${day}`;
		tile.marker.style.left = `${dayProgress * 100}%`;
	}
}

function markActiveTile() {
	for (const tile of tiles) {
		const isActive = tile.tz === selectedTz;
		tile.el.classList.toggle('active', isActive);
		tile.el.setAttribute('aria-pressed', isActive);
	}
}

/*************************
Time card ****************
*************************/

function updateTimeCard() {
	const time = getTime(selectedTz);
	const city = cityName(selectedTz);

	// Heading
	timeCardHeading.textContent = city;
	timeCardSubheading.textContent = shiftMinutes
		? `Shifted ${formatOffset(shiftMinutes)}`
		: 'Time Card';

	// Digital clock
	const isAM = time.format('A') === 'AM';
	digitalTime.textContent = time.format('hh[:]mm');
	digitalSeconds.textContent = time.format('[:]ss');
	digitalAM.classList.toggle('active', isAM);
	digitalPM.classList.toggle('active', !isAM);

	// Analog clock: the minute and hour hands creep between ticks
	const seconds = time.seconds() * 6;
	const minutes = (time.minutes() + time.seconds() / 60) * 6;
	const hours = ((time.hours() % 12) + time.minutes() / 60) * 30;
	clockDate.textContent = time.format('MM[-]DD[-]YYYY');
	clockSecond.style.transform = `rotate(${seconds}deg)`;
	clockMinute.style.transform = `rotate(${minutes}deg)`;
	clockHour.style.transform = `rotate(${hours}deg)`;
	clockSvg.setAttribute('aria-label', `${city}: ${time.format('h:mm A')}`);

	// Details
	const zone = time.format('zz');
	const { relative, day } = compareToLocal(selectedTz);
	dateInfoHeading.textContent = time.format('dddd[,] MMMM Do[,] YYYY');
	tzLabel.textContent = /[+-]/.test(zone) ? 'Time Offset' : 'Timezone';
	tzOfficialName.textContent = zone;
	tzRelative.textContent = `${relative}, ${day}`;
	tzStatus.textContent = statusFor(time.hours());
	tzDaylightSavings.textContent = daylightStatus(selectedTz);
}

// Parts of the card that only change when a different city is picked
function updateSelectionControls() {
	const city = cityName(selectedTz);
	const query = encodeURIComponent(`${city}, ${regionName(selectedTz)}`);
	tzGoogle.href = `https://www.google.com/search?q=${query}`;
	tzGoogle.textContent = `Search on Google about ${city}`;

	const isPinned = pinnedTzs.includes(selectedTz);
	const isFull = !isPinned && pinnedTzs.length >= MAX_PINS;
	pinButton.textContent = isPinned ? 'Unpin City' : 'Pin City';
	pinButton.setAttribute('aria-pressed', isPinned);
	pinButton.disabled = isFull;
	pinButton.title = isFull ? `You can pin up to ${MAX_PINS} cities` : '';
}

/*************************
Actions ******************
*************************/

function selectTimezone(tz, { scroll = false } = {}) {
	selectedTz = tz;
	writeStorage('location', tz);

	markActiveTile();
	updateSelectionControls();
	updateTimeCard();

	// On phones the grids sit below the card, so bring the card back into view
	if (scroll && window.matchMedia('(max-width: 820px)').matches) {
		timeCard.scrollIntoView({
			behavior: prefersReducedMotion() ? 'auto' : 'smooth',
		});
	}
}

function togglePin() {
	if (pinnedTzs.includes(selectedTz)) {
		pinnedTzs = pinnedTzs.filter(tz => tz !== selectedTz);
	} else {
		pinnedTzs = [...pinnedTzs, selectedTz];
		exploreTzs = exploreTzs.filter(tz => tz !== selectedTz);
	}
	writeStorage('pinned', JSON.stringify(pinnedTzs));

	renderTiles();
	updateSelectionControls();
}

function updateShiftControls() {
	const label = shiftMinutes ? formatOffset(shiftMinutes) : 'Now';
	shiftLabel.textContent = label;
	shiftRange.setAttribute('aria-valuetext', label);
	shiftResetButton.disabled = shiftMinutes === 0;
}

/*************************
Search *******************
*************************/

// "New York, America" -> "America/New_York"
function populateSearchList() {
	const fragment = document.createDocumentFragment();
	for (const tz of allTimezones) {
		let label = `${cityName(tz)}, ${regionName(tz)}`;
		if (labelToTz.has(label)) label = `${label} (${tz})`;
		labelToTz.set(label, tz);

		const option = document.createElement('option');
		option.value = label;
		fragment.appendChild(option);
	}
	cityList.appendChild(fragment);
}

function openSearch() {
	searchWrapper.hidden = false;
	searchToggleButton.setAttribute('aria-expanded', 'true');
	citySearch.focus();
}

function closeSearch() {
	searchWrapper.hidden = true;
	searchToggleButton.setAttribute('aria-expanded', 'false');
	citySearch.value = '';
}

/*************************
Clock loop ***************
*************************/

// One loop updates every clock on the page
function tick() {
	instant = moment().add(shiftMinutes, 'minutes');
	updateShiftControls();
	updateTimeCard();
	updateTiles();
}

// Line the loop up with the start of each second so the seconds never lag
function startClock() {
	tick();
	setTimeout(() => {
		tick();
		setInterval(tick, 1000);
	}, 1000 - (Date.now() % 1000));
}

/*************************
Event listeners **********
*************************/

searchToggleButton.addEventListener('click', () => {
	searchWrapper.hidden ? openSearch() : closeSearch();
});

citySearch.addEventListener('input', () => {
	const tz = labelToTz.get(citySearch.value.trim());
	if (!tz) return;
	closeSearch();
	selectTimezone(tz, { scroll: true });
	searchToggleButton.focus();
});

citySearch.addEventListener('keydown', event => {
	if (event.key === 'Escape') {
		closeSearch();
		searchToggleButton.focus();
	}
});

// Cmd+K or Ctrl+K opens the search from anywhere
document.addEventListener('keydown', event => {
	if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
		event.preventDefault();
		openSearch();
	}
});

userTzButton.addEventListener('click', () => {
	selectTimezone(LOCAL_TZ, { scroll: true });
});

shuffleButton.addEventListener('click', () => {
	exploreTzs = pickRandomTimezones(EXPLORE_COUNT);
	renderTiles();
});

pinButton.addEventListener('click', togglePin);

shiftRange.addEventListener('input', () => {
	shiftMinutes = Number(shiftRange.value);
	tick();
});

shiftResetButton.addEventListener('click', () => {
	shiftRange.value = 0;
	shiftMinutes = 0;
	tick();
	shiftRange.focus();
});

/*************************
Start ********************
*************************/

if (/Mac|iPhone|iPad/.test(navigator.userAgent)) {
	searchShortcut.textContent = '⌘K';
}

populateSearchList();
exploreTzs = pickRandomTimezones(EXPLORE_COUNT);
renderTiles();
selectTimezone(selectedTz);
startClock();
