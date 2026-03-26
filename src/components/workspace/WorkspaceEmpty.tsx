export function WorkspaceEmpty() {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="text-center">
        <svg
          className="mx-auto mb-3 h-12 w-12 text-neutral-300"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
          />
        </svg>
        <p className="text-sm font-medium text-neutral-600">
          No strategies yet
        </p>
        <p className="mt-1 text-xs text-neutral-600">
          Set your grade band, setting, and support area in the left panel, then click
          &ldquo;Get Strategies&rdquo; or send a chat message to see evidence-based
          strategies here.
        </p>
      </div>
    </div>
  );
}
