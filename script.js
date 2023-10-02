const toggleTzButton = document.getElementById('list-tz-btn');
const tzDropdown = document.getElementById('tz-dropdown');

toggleTzButton.addEventListener('click', function () {
	if (tzDropdown.style.display === 'block') {
		tzDropdown.style.display = 'none';
	} else {
		tzDropdown.style.display = 'block';
	}
});
