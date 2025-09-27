export function NotFound() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>😕 404</h1>
      <p>Sorry, the page you're looking for doesn't exist.</p>
      <div className="border px-5 py-2 my-1">
        <a href="/">← Go to Homepage</a>
      </div>
    </div>
  );
}
