export default function Loading() {
  return (
    <main className="page-shell" aria-busy="true" aria-label="Loading collection">
      <section className="page-heading">
        <div>
          <p>Loading local entries</p>
          <h1>Opening collection</h1>
        </div>
      </section>
      <div className="loading-state">Preparing the name index</div>
    </main>
  )
}
