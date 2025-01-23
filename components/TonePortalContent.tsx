import Button from "#components/common/Button"
import { useToneContext } from "#tone/ToneContextProvider"
import pkg from "#utils/pkg"

const TonePortalContent = () => {
  const { initTone } = useToneContext()

  return (
    <section className="flex justify-center">
      <div className="mt-16 p-3">
        <div className="text-5xl text-center mb-5">🚂🚃</div>
        <h1 className="text-4xl text-center font-black mb-6 uppercase">{pkg.name}</h1>
        <h2 className="text-xl md:w-3/4 mx-auto mb-6 text-center text-light">{pkg.description}</h2>
        <div className="text-center mb-6">
          <Button color="primary" onClick={() => initTone()}>
            Initialize Tone.js
          </Button>
        </div>
        <p className="text-center md:w-1/2 mx-auto text-gray">
          This button unlocks tone.js context for all following pages / components
        </p>
      </div>
    </section>
  )
}

export default TonePortalContent
