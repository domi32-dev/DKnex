import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const FeaturedApp = () => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>Featured App</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">
        Mental Health in the Digital Age: Navigating...
      </p>
      <p className="text-xs mt-2">The aroma of freshly brewed coffee filled the air…</p>
    </CardContent>
  </Card>
);