const tzDropdown = document.getElementById('tz-dropdown');

const toggleTzButton = document.getElementById('list-tz-btn');

toggleTzButton.addEventListener('click', function () {
	if (tzDropdown.style.display === 'block') {
		tzDropdown.style.display = 'none';
	} else {
		tzDropdown.style.display = 'block';
	}
});
