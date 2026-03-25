interface SourceReferenceProps {
  excerpt: string;
  reference: string;
}

export function SourceReference({ excerpt, reference }: SourceReferenceProps) {
  return (
    <div className="rounded-md bg-neutral-50 p-3">
      <blockquote className="mb-2 border-l-2 border-neutral-300 pl-3 text-sm italic text-neutral-600">
        {excerpt}
      </blockquote>
      <cite className="text-xs not-italic text-neutral-500">{reference}</cite>
    </div>
  );
}
