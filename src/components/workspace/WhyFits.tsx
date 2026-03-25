interface WhyFitsProps {
  text: string;
}

export function WhyFits({ text }: WhyFitsProps) {
  return (
    <div>
      <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-secondary-700">
        Why This Fits
      </h4>
      <p className="text-sm leading-relaxed text-neutral-700">{text}</p>
    </div>
  );
}
