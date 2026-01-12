export default function OmPage() {
  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Om platformen</h1>

      <p className="text-gray-700 mb-8">
        Denne platform er et eksperimentelt værktøj til at undersøge,
        hvordan strukturerede afstemninger og argumenter kan give bedre
        overblik over holdninger til konkrete spørgsmål.
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Formål</h2>
        <p className="text-gray-700">
          Formålet er at skabe et neutralt rum, hvor spørgsmål kan stilles,
          stemmer afgives, og argumenter samles - uden fokus på debat,
          likes eller algoritmer.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Sådan fungerer det</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Hvert spørgsmål har en fast afstemningsperiode</li>
          <li>Du kan stemme Ja, Nej eller Uafklaret</li>
          <li>Resultater vises efter stemme eller når afstemningen lukker</li>
          <li>Argumenter kan tilføjes for og imod</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Afgrænsning</h2>
        <p className="text-gray-700">
          Platformen er ikke et socialt medie og har ingen kommentarer,
          profiler eller rangering af brugere. Fokus er på spørgsmål,
          ikke personer.
        </p>
      </section>

      <section className="mt-8 mb-6">
        <h2 className="text-xl font-semibold mb-2">Non-profit</h2>
        <p className="text-gray-700">
          Platformen drives som et non-profit projekt uden kommercielle
          interesser. Der vises ingen annoncer, og data anvendes ikke til
          markedsføring eller profilering.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Bidrag og kontakt</h2>
        <p className="text-gray-700">
          Forslag til spørgsmål, rettelser eller faglige bidrag er velkomne.
          Henvendelser kan sendes til:
        </p>

        <p className="mt-2 font-mono text-sm text-gray-800">
          kontakt@eksempel.dk
        </p>
      </section>
    </main>
  );
}
