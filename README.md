## World Clock Dashboard

[https://clock.aniqa.dev/](https://clock.aniqa.dev/)

🕰️ A fully responsive, minimalistic and sleek analog and digital time dashboard that features over 550 global timezones. Users can choose from the randomly generated list of 30 timezones or they can search through the dropdown. Additional data points are included for each selected timezone.

## Design

<a href="https://clock.aniqa.dev/" target="_blank">
<img src="/assets/og-img.png" style="max-width: 100%;">
</a>

## Tech

- HTML5
- CSS3
- JavaScript
- Moment.js

## Key Features

**Design**

- Analog and digital clock drawn using SVG elements
- Minimalistic color scheme
- Fully responsive webpage utilizing a grid layout
- “Time Card” section designed to be focal point
- Subtle button animations and custom dropdown styling
- Grid layout showcasing different cities/regions
- Hover and active styling for timezone grid items

**Time Card**

- Seconds-hand moves around the analog clock every second
- Digital time is updated every second
- Current day and date
- Region, timezone, number of the day of the year (out of 365) and daylight savings time
- Option to search about the active region on Google

**Timezone Grid**

- Randomized timezones to choose from - labeled by city name and region
- Hover state shows the current time of that timezone
- Active state shows the current time on the selected timezone until another location is selected
- Selecting a timezone from the grid will update the Time Card

**Interactive Elements**

- “Shuffle Timezones” button randomizes the timezone grid
- “List of Timezones” button toggles the dropdown selector with every timezone
- Location marker button selects user’s current location

**Data**

- Moment.js library to get timezone data

**Behind-the-Scenes**

- Basic PWA
- String manipulation to format the timezone names
- Array transformations to filter out timezones without a continental affiliation
- Overwrite `moment.js` abbreviations to use my own abbreviations object
- DOM manipulation to generate random buttons and to add 500+ timezone names into dropdown
- Ensuring timezones show a random selection of timezones without repeating
- `localStorage` to save a user’s last selected location
- Activate smooth scrolling up to the Time Card on mobile devices
- `setInterval` in order to update time every second and `clearInterval` to avoid conflicts whenever a new timezone is selected
- Formatting time using only `moment.js` methods
