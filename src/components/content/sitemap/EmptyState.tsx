import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EmptyState() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Map</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center py-8">
          No pages have been crawled yet
        </p>
      </CardContent>
    </Card>
  );
}