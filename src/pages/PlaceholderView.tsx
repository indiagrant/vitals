import { Eyebrow } from "@/components/vitals/Eyebrow";

interface PlaceholderViewProps {
  title: string;
  description?: string;
}

export function PlaceholderView({ title, description }: PlaceholderViewProps) {
  return (
    <div className="flex flex-col gap-3 max-w-xl">
      <Eyebrow>Coming soon</Eyebrow>
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
