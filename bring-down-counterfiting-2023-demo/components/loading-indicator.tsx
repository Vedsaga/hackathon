export function LoadingIndicator() {
  return (
    <div role="status">
      <svg
        className="animate-spin h-5 w-5 mr-3"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeDasharray="47.1 62.83"
        />
      </svg>
    </div>
  );
}
