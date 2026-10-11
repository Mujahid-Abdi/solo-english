import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function ErrorState({ message }: { message: string }) {
  return (
    <Card className="border-destructive/40">
      <CardContent className="flex items-center gap-3 p-5 text-destructive">
        <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        <p className="font-semibold">{message}</p>
      </CardContent>
    </Card>
  );
}
