interface SourceUrlInfoProps {
  url: string;
}

export function SourceUrlInfo({ url }: SourceUrlInfoProps) {
  return (
    <div>
      <h3 className="font-medium">URL</h3>
      <p className="text-muted-foreground">{url}</p>
    </div>
  );
}