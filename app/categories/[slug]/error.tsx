"use client";

type CategoryErrorProps = {
  reset: () => void;
};

export default function CategoryError({ reset }: CategoryErrorProps) {
  return (
    <main className="page-shell">
      <div className="empty-state" role="alert">
        <h1>Collection unavailable</h1>
        <p>Try opening it again.</p>
        <button className="load-more" type="button" onClick={reset}>
          Try again
        </button>
      </div>
    </main>
  );
}
