export function TopBar() {
  return (
    <header className="border-b border-neutral-200 bg-primary-700 px-6 py-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-white">EduNavigator</h1>
        <span className="text-xs text-primary-200">
          Evidence-Based Strategy Finder
        </span>
      </div>
    </header>
  );
}
