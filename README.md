# Is It Hot Chocolate?

A small React app that checks your local weather and gives you a hot-chocolate forecast. It also offers a cocoa-joy modal with a randomly selected local GIF.

## Requirements

- Node.js 22.12 or later
- npm

## Getting started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The Vite configuration uses `127.0.0.1:3000`. Open the local URL printed in your terminal.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## How it works

1. The app asks the browser for permission to access your location.
2. It uses the coordinates to look up the city with [BigDataCloud](https://www.bigdatacloud.com/).
3. It fetches current temperature, wind speed, and weather conditions from [Open-Meteo](https://open-meteo.com/).
4. The forecast says “Absolutely” when **all three** conditions are met:
   - Temperature is below 50°F.
   - Wind speed is at least 5 mph.
   - The weather code indicates precipitation or worse (code 51 or higher).
5. Select the cocoa-joy button to open a modal featuring a randomly chosen GIF from `src/assets/`.

Weather can be refreshed with the **Refresh** button. Location permission and an internet connection are required for live weather.

## Project structure

```text
.
├── public/             # Static public assets
├── src/
│   ├── assets/         # Cocoa GIFs
│   ├── App.jsx         # Main app and weather experience
│   ├── App.css         # App styles
│   ├── index.css       # Tailwind CSS entry point
│   └── main.jsx        # React entry point
├── index.html
├── package.json
└── vite.config.js
```

## Dependencies

The project uses React, Vite, Tailwind CSS, and Lucide icons. No API keys are required for the current weather and geocoding services.

The browser sends your location coordinates to BigDataCloud and Open-Meteo over HTTPS to provide the app’s features.