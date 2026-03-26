export function TopBar() {
  return (
    <header className="flex items-center justify-between bg-gradient-to-r from-primary-700 to-primary-800 px-6 py-3.5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-accent-300 shadow-inner">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
        </div>
        <h1 className="text-xl font-bold tracking-wide text-white">
          EduNavigator
        </h1>
      </div>

      <div className="hidden items-center rounded-full bg-primary-900/30 px-4 py-1.5 shadow-inner sm:flex">
        <span className="text-sm font-medium text-primary-50">
          Evidence-Based Strategy Finder
        </span>
      </div>
    </header>
  );
}
