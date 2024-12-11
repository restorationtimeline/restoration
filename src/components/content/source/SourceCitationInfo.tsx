interface SourceCitationInfoProps {
  citation: string;
}

export function SourceCitationInfo({ citation }: SourceCitationInfoProps) {
  return (
    <div>
      <h3 className="font-medium">Citation</h3>
      <p className="text-muted-foreground">{citation}</p>
    </div>
  );
}