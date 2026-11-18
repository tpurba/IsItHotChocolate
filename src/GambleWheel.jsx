import { useEffect, useState } from 'react'

function GambleWheel({ yesPercentage, onClose }) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [spinResult, setSpinResult] = useState(null)
  const [wheelRotation, setWheelRotation] = useState(0)

  useEffect(() => {
    if (!isSpinning) return undefined

    const timeoutId = window.setTimeout(() => setIsSpinning(false), 4500)
    return () => window.clearTimeout(timeoutId)
  }, [isSpinning])

  const spinWheel = () => {
    if (isSpinning) return

    const landingAngle = Math.random() * 360
    const yesAngle = yesPercentage * 3.6
    setSpinResult(landingAngle < yesAngle ? 'yes' : 'no')

    const desiredRotation = (360 - landingAngle) % 360
    const currentRotation = ((wheelRotation % 360) + 360) % 360
    const rotationToLanding = (desiredRotation - currentRotation + 360) % 360
    setWheelRotation(wheelRotation + 5 * 360 + rotationToLanding)
    setIsSpinning(true)
  }

  const closeWheel = () => {
    if (isSpinning) return
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#34261f]/60 p-4"
      onClick={closeWheel}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="cocoa-wheel-title"
        className="w-full max-w-sm rounded-3xl border-2 border-[#6d321c] bg-[#fff8ed] p-6 text-center text-[#34261f] shadow-[0_0_32px_rgba(217,150,55,.35)]"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="cocoa-wheel-title" className="font-serif text-2xl font-bold">
          Test your luck for a cup
        </h2>
        <p className="mt-2 text-sm text-[#725f54]">
          The wheel reflects today&apos;s weather-based odds.
        </p>

        <div className="relative mx-auto mt-6 size-64">
          <div className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 border-x-[10px] border-x-transparent border-t-[18px] border-t-[#34261f]" />
          <div
            className="flex size-full items-center justify-center rounded-full border-4 border-white shadow-lg"
            style={{
              background: `conic-gradient(from 0deg, #6d321c 0deg ${yesPercentage * 3.6}deg, #f0d7ac ${yesPercentage * 3.6}deg 360deg)`,
              transform: `rotate(${wheelRotation}deg)`,
              transition: isSpinning ? 'transform 4.5s cubic-bezier(0.12, 0.72, 0.12, 1)' : 'none',
            }}
          >
            <span className="flex size-16 items-center justify-center rounded-full border-4 border-white bg-[#fff8ed] text-3xl shadow">
              ☕
            </span>
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-5 text-sm font-semibold">
          <span className="text-[#6d321c]">Yes: {yesPercentage}%</span>
          <span className="text-[#80512b]">No: {100 - yesPercentage}%</span>
        </div>

        {spinResult && !isSpinning && (
          <p className="mt-4 font-serif text-xl font-bold" role="status">
            {spinResult === 'yes' ? 'Yes! It’s cocoa time.' : 'Not this time—save the marshmallows!'}
          </p>
        )}

        <div className="mt-5 flex justify-center gap-3">
          <button
            type="button"
            onClick={spinWheel}
            disabled={isSpinning}
            className="rounded-full bg-[#6d321c] px-5 py-2.5 text-sm font-semibold text-white transition hover:cursor-pointer hover:bg-[#80512b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSpinning ? 'Spinning…' : 'Spin the wheel'}
          </button>
          <button
            type="button"
            onClick={closeWheel}
            disabled={isSpinning}
            className="rounded-full border border-[#e7dacb] px-5 py-2.5 text-sm font-semibold text-[#6d321c] transition hover:cursor-pointer hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Close
          </button>
        </div>
      </section>
    </div>
  )
}

export default GambleWheel
