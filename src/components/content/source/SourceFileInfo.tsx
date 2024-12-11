interface SourceFileInfoProps {
  filePath: string;
  fileType: string;
  pageCount?: number;
  queueStatus?: Record<string, number>;
}

export function SourceFileInfo({ 
  filePath, 
  fileType, 
  pageCount, 
  queueStatus
}: SourceFileInfoProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-medium">File Information</h3>
      <p className="text-muted-foreground">
        Type: {fileType?.toUpperCase()}
      </p>
      {typeof pageCount !== 'undefined' && (
        <p className="text-muted-foreground">
          Extracted Pages: {pageCount}
        </p>
      )}
      {queueStatus && Object.keys(queueStatus).length > 0 && (
        <div className="text-sm text-muted-foreground">
          Queue Status:
          <ul className="list-disc list-inside">
            {Object.entries(queueStatus).map(([status, count]) => (
              <li key={status}>
                {status}: {count}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}