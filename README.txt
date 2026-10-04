# Separate Weather Dashboard Task

This task is designed to be added to the existing project without replacing
the existing Task Manager or portfolio files.

Files:
- weather.html  -> Weather Dashboard page
- weather.css   -> CSS only for this task
- weather.js    -> Async JavaScript + REST API functionality

How to add:
1. Copy all 3 files into the same folder as your existing index.html.
2. Open weather.html using Live Server.
3. Enter a city such as Nashik or Mumbai.
4. The dashboard fetches city coordinates and current weather.

To add it to your existing navigation, add:
<a href="weather.html">Weather</a>

The task uses the Open-Meteo Geocoding API and Weather API.
No API key is required for non-commercial use.
