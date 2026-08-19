interface ComingSoonProps {
  title: string;
  description: string;
  phase: string;
}

export function ComingSoon({ title, description, phase }: ComingSoonProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <span className="eyebrow inline-block rounded-full bg-blueprint-50 px-3 py-1">
        {phase}
      </span>
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{title}</h1>
      <p className="mt-4 text-ink-soft">{description}</p>
      <p className="mt-8 text-sm text-ink-soft">
        This tool is being built in a later phase of the roadmap. Check back soon.
      </p>
    </div>
  );
}
