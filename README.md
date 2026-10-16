# World Clock Dashboard

An analog and digital clock for 500+ time zones. Pin the cities you care about, slide time forward or back to plan across zones, and see at a glance who's awake.

**[Live site](https://clock.aniqa.dev)**

<!-- TODO: retake assets/og-img.png with the redesign (time card, Shift Time slider and pinned tiles); it still shows the 2023 layout -->
<a href="https://clock.aniqa.dev"><img src="assets/og-img.png" alt="The world clock: an analog and digital time card for the selected city beside a grid of other cities" width="800"></a>

## Tech

- HTML, CSS and JavaScript, no build step
- [Moment Timezone](https://momentjs.com/timezone/) for time zone data and formatting
- An SVG analog clock with a digital readout
- A web app manifest and icons, so it can be added to your home screen

## Features

- **Time card:** analog and digital time, the date, the time zone, how far ahead of you it is, whether it's working hours there and its daylight saving status
- **Pinned cities:** up to 8, starting with your zone and five others; pin or unpin from the time card
- **Shift Time:** a slider that moves every clock up to 12 hours either way
- **Explore:** 24 random cities with "Shuffle Timezones" for a new set
- **Find a City:** search by name, or press Cmd+K / Ctrl+K; the location button jumps back to your zone
- Remembers your pinned cities and last selected city

## Design

- Keeps the original look: DM Sans and DM Mono, the white time card, red second hand and dark digital panel
- Every city tile shows its time, its offset from you ("+5h · Tomorrow") and a 24-hour day/night strip with a red marker for the current hour
- The time card stays in view on desktop while you scroll the grids; on phones it sits on top and picking a city scrolls back to it

## Accessibility

- Tiles and the pin button use `aria-pressed`, so screen readers announce the selected city
- The slider reads its value aloud as "+3h" rather than "180"
- The search has a label, and Escape closes it
- Animations and smooth scrolling are off when reduced motion is on

## Project structure

- `index.html`: the page, including the SVG clock face
- `src/script.js`: time zone list, search, tiles, time card and the clock loop
- `src/styles.css`: layout, tiles, day/night strips and two breakpoints
- `assets/` and `manifest.json`: icons, preview image and the app manifest

## Key concepts

- **One clock loop.** A single `setInterval` updates the time card and every tile from the same moment, lined up to the start of each second. The first version started a new interval for every tile on every shuffle and never cleared them.
- **Shifting time.** The slider adds minutes to that shared moment, so every clock and marker moves together.
- **Unique random cities.** A Fisher–Yates shuffle picks the Explore grid, so a city can't appear twice.
- **Spelled-out time zones.** My own abbreviation map overrides Moment's, so "EDT" reads as "EDT, Eastern Daylight Time"; zones without a name show their offset instead.

## Setup

No build step or API keys. Serve the folder locally, since the page loads its files from root paths:

```bash
git clone https://github.com/aniqatc/world-clock.git
cd world-clock
python3 -m http.server
```

## Changelog

### October 2026

- Redesigned around pinned cities, a Shift Time slider and day/night strips, keeping the original style
- Replaced the full dropdown with a city search and keyboard shortcut
- Fixed repeated cities in the grid, intervals piling up on every shuffle, cities like Buenos Aires showing as "Argentina" and an hour hand that only moved on the hour
- Removed Font Awesome in favor of one inline icon

### November 2023

- Added the app manifest and icons, and cleaned up the time card functions

### October 2023

- Initial release
