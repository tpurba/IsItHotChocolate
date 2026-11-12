import { useCallback, useEffect, useMemo, useState } from 'react'
import privateMarshMellow from './assets/privateMarshMellow.gif'
import elfHotChoclate from './assets/elfHotChoclate.gif'
import fishingHotChoclate from './assets/fishingHotChoclate.gif'
import happyHotCocoaDay from './assets/happyHotCocoaDay.gif'
import marshMellowBath from './assets/marshmellowBath.gif'
import onsenHotChoclate from './assets/onsenHotChoclate.gif'
import {
  AlertCircle,
  Check,
  Cloud,
  CloudRain,
  CloudSun,
  Droplets,
  LocateFixed,
  MapPin,
  RefreshCw,
  Snowflake,
  Sun,
  Thermometer,
  Wind,
  X,
} from 'lucide-react'

const weatherCodes = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Rime fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Dense drizzle',
  56: 'Freezing drizzle',
  57: 'Freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Rain showers',
  81: 'Rain showers',
  82: 'Violent rain showers',
  85: 'Snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  97: 'Heavy thunderstorm',
  99: 'Thunderstorm with hail',
}

function weatherIcon(code, className = 'size-6') {
  if (code >= 71 && code <= 86) return <Snowflake className={className} />
  if ((code >= 51 && code <= 67) || code >= 80) return <CloudRain className={className} />
  if (code === 0 || code === 1) return <Sun className={className} />
  if (code === 2) return <CloudSun className={className} />
  return <Cloud className={className} />
}

function App() {
  const [weather, setWeather] = useState(null)
  const [location, setLocation] = useState({ city: '', state: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatedAt, setUpdatedAt] = useState(null)
  const [showCocoaJoy, setShowCocoaJoy] = useState(false)
  const [cocoaJoyImage, setCocoaJoyImage] = useState(null)

  const loadWeather = useCallback(() => {
    setLoading(true)
    setError('')

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const geoResponse = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`,
          )
          const geoData = await geoResponse.json()
          setLocation({
            city: geoData.city || geoData.locality || 'Your location',
            state: geoData.principalSubdivision || '',
          })

          const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,wind_speed_10m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph`,
          )
          if (!weatherResponse.ok) throw new Error('Weather unavailable')

          const weatherData = await weatherResponse.json()
          setWeather(weatherData.current)
          setUpdatedAt(new Date())
        } catch {
          setError('We could not fetch your weather right now. Please try again.')
        } finally {
          setLoading(false)
        }
      },
      (geoError) => {
        setError(
          geoError.code === geoError.PERMISSION_DENIED
            ? 'Location access is needed to check your cocoa forecast.'
            : 'We could not find your location.',
        )
        setLoading(false)
      },
    )
  }, [])

  useEffect(() => {
    loadWeather()
    //set the cocoa joy image to be random out of the imported images
    const images = [privateMarshMellow, elfHotChoclate, fishingHotChoclate, happyHotCocoaDay, marshMellowBath, onsenHotChoclate]
    const randomImage = images[Math.floor(Math.random() * images.length)]
    setCocoaJoyImage(randomImage)
  }, [loadWeather])

  const isHotChocolateDay = weather
    ? weather.temperature_2m < 50 && weather.wind_speed_10m >= 5 && weather.weather_code >= 51
    : false
  const reasons = useMemo(
    () =>
      weather
        ? [
            {
              icon: <Thermometer />,
              label: 'Temperature',
              value: `${Math.round(weather.temperature_2m)}°F`,
              pass: weather.temperature_2m < 50,
              hint: 'below 50°F',
            },
            {
              icon: <Wind />,
              label: 'Wind',
              value: `${Math.round(weather.wind_speed_10m)} mph`,
              pass: weather.wind_speed_10m >= 5,
              hint: '5 mph or more',
            },
            {
              icon: weatherIcon(weather.weather_code),
              label: 'Conditions',
              value: weatherCodes[weather.weather_code] || 'Current weather',
              pass: weather.weather_code >= 51,
              hint: 'rain, snow, or storms',
            },
          ]
        : [],
    [weather],
  )

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f3eb] text-[#34261f]">
      <div className="mx-auto max-w-6xl px-5 py-5 sm:px-8 sm:py-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-[#6d321c] text-[#f8d9a8] shadow-[0_8px_20px_rgba(109,50,28,.18)]">
              <span className="text-2xl" aria-hidden="true">☕</span>
            </div>
            <div>
              <p className="font-serif text-xl font-bold tracking-tight">Is it hot chocolate?</p>
              <p className="text-xs font-medium uppercase tracking-[.18em] text-[#97796b]">The cocoa forecast</p>
            </div>
          </div>
          <button
            onClick={loadWeather}
            className="flex items-center gap-2 rounded-full border border-[#e7dacb] bg-white/70 px-4 py-2.5 text-sm font-semibold text-[#6d321c] transition hover:bg-white"
            aria-label="Refresh weather"
          >
            <RefreshCw className={loading ? 'size-4 animate-spin' : 'size-4'} /> Refresh
          </button>
        </header>

        <section className="relative mt-0 grid gap-8 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:gap-16 lg:py-12">
          <div className="absolute -left-32 top-10 -z-0 size-72 rounded-full bg-[#f4dfbc]/50 blur-3xl" />
          <div className="relative z-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#f1e0c6] px-3.5 py-2 text-sm font-semibold text-[#80512b]">
              <MapPin className="size-4" />
              {location.city
                ? `${location.city}${location.state ? `, ${location.state}` : ''}`
                : 'Finding your location…'}
            </div>
            <h1 className="max-w-xl font-serif text-5xl font-bold leading-[.98] tracking-[-.045em] sm:text-7xl">
              A little weather wisdom, <span className="text-[#b65b2c]">served warm.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#725f54]">
              We check the skies so you can check the marshmallows. Here&apos;s whether today is calling for a cozy cup.
            </p>
          </div>

          <div
            className={`relative z-10 rounded-[2rem] p-7 shadow-[0_24px_70px_rgba(84,52,31,.13)] sm:p-9 ${
              isHotChocolateDay ? 'bg-[#6d321c] text-[#fff8ef]' : 'bg-[#f0d7ac] text-[#4d2f22]'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[.18em] opacity-70">Today&apos;s verdict</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-white/15 text-3xl" aria-hidden="true">
                    {isHotChocolateDay ? '☕' : '🌤️'}
                  </div>
                  <h2 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">
                    {loading ? 'Checking…' : isHotChocolateDay ? 'Absolutely.' : 'Maybe later.'}
                  </h2>
                </div>
              </div>
              <div className="rounded-full bg-white/15 p-3">
                {loading ? (
                  <RefreshCw className="size-5 animate-spin" />
                ) : isHotChocolateDay ? (
                  <Check className="size-5" />
                ) : (
                  <X className="size-5" />
                )}
              </div>
            </div>
            <p className="mt-8 max-w-sm text-lg leading-relaxed opacity-85">
              {loading
                ? 'Looking up the conditions around you…'
                : error
                  ? error
                  : isHotChocolateDay
                    ? 'The weather has officially given you permission. Grab your favorite mug.'
                    : "It's a little too pleasant out there for cocoa today. We'll keep watching."}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/20 pt-5 text-sm opacity-75">
              <button
                type="button"
                onClick={() => setShowCocoaJoy(true)}
                className="rounded-full border border-white px-4 py-2 font-semibold transition hover:text-white hover:bg-[#b65b2c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {isHotChocolateDay ? 'Click me for Cocoa Joy!' : 'Click me to cheer up!'}
              </button>
              <div className="flex items-center gap-3">
                <LocateFixed className="size-4" />
                Based on your local weather
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-[2rem] border border-[#e7dacb] bg-white/60 p-5 sm:p-7">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#b65b2c]">The cocoa checklist</p>
              <h2 className="mt-1 font-serif text-2xl font-bold">Why today gets the mug</h2>
            </div>
            <p className="text-sm text-[#97796b]">
              {updatedAt
                ? `Updated ${updatedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
                : 'Live conditions'}
            </p>
          </div>
          {error ? (
            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-[#fff2ed] p-4 text-sm text-[#9d4524]">
              <AlertCircle className="size-5 shrink-0" />
              Enable location access and tap refresh to see your local checklist.
            </div>
          ) : (
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {reasons.map((reason) => (
                <div key={reason.label} className="rounded-2xl bg-[#fbf7f1] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#8a6756]">
                      {reason.icon}
                      <span className="text-sm font-semibold">{reason.label}</span>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-bold ${
                        reason.pass ? 'bg-[#e4f1e5] text-[#337044]' : 'bg-[#f4e6d7] text-[#956143]'
                      }`}
                    >
                      {reason.pass ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <p className="mt-4 text-2xl font-bold tracking-tight">{reason.value}</p>
                  <p className="mt-1 text-sm text-[#97796b]">
                    {reason.pass ? `That's ${reason.hint}` : `Not ${reason.hint}`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer className="flex flex-col gap-2 py-4 text-sm text-[#97796b] sm:flex-row sm:items-center sm:justify-between">
          <p>Made for slow mornings and extra marshmallows.</p>
          <p className="flex items-center gap-1.5">
            <Droplets className="size-4" /> Weather data by Open-Meteo
          </p>
        </footer>
      </div>
      {/* modal for cocoa joy */}
      {showCocoaJoy && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#34261f]/50 p-3 sm:items-center sm:p-4"
          onClick={() => setShowCocoaJoy(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="cocoa-joy-title"
            className="w-full max-w-sm rounded-t-3xl border-2 border-[#6d321c] bg-[#fff8ed] p-5 text-center text-[#34261f] shadow-[0_0_32px_rgba(217,150,55,.35)] sm:rounded-3xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="cocoa-joy-title" className="font-serif text-2xl font-bold">
              A little warmth for your day
            </h2>

            <picture>
              <img
                src={cocoaJoyImage}
                alt="Cocoa Gif of Joy"
                className="mx-auto mt-4 max-h-56 w-full rounded-2xl object-contain"
              />
            </picture>

            <button
              type="button"
              onClick={() => setShowCocoaJoy(false)}
              className="mt-5 rounded-full bg-[#6d321c] px-5 py-2 text-sm font-semibold text-white hover:bg-[#80512b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Close cocoa joy
            </button>
          </section>
        </div>
      )}
    </main>
  )
}

export default App
