import { formatDate } from "@/lib/utils";

interface SourceMetadataProps {
  title: string;
  sourceType: string;
  createdAt: string;
}

export function SourceMetadata({ title, sourceType, createdAt }: SourceMetadataProps) {
  return (
    <>
      <div>
        <h3 className="font-medium">Source Type</h3>
        <p className="text-muted-foreground">{sourceType}</p>
      </div>

      <div>
        <h3 className="font-medium">Created At</h3>
        <p className="text-muted-foreground">
          {formatDate(createdAt)}
        </p>
      </div>
    </>
  );
}