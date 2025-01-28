import Button from "#components/common/Button"
import useTone from "#tone/useTone"
import pkg from "#utils/pkg"

const TonePortalContent = () => {
  const { initTone } = useTone()

  return (
    <section className="flex justify-center">
      <div className="mt-16 p-3">
        <div className="text-5xl text-center mb-5">🚂🚃</div>
        <h1 className="text-4xl text-center font-black mb-6 uppercase">{pkg.name}</h1>
        <p className="text-xl md:w-3/4 mx-auto mb-6 text-center text-light max-w-xl">{pkg.description}</p>
        <div className="text-center mb-6">
          <Button size="lg" color="success" onClick={() => initTone()}>
            Okay, bring me to the Sequencer!
          </Button>
        </div>
        <p className="text-center md:w-1/2 mx-auto text-gray">
          This button unlocks tone.js context for all following pages / components of this application. If you
          reload the context must be confirmed again.
        </p>
      </div>
    </section>
  )
}

export default TonePortalContent
