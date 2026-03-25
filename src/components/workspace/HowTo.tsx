interface HowToProps {
  text: string;
}

export function HowTo({ text }: HowToProps) {
  return (
    <div>
      <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-secondary-700">
        How to Implement
      </h4>
      <div className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
        {text}
      </div>
    </div>
  );
}
