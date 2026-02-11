import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface PlannedFeaturesProps {
  features: { name: string; description: string }[];
}

export function PlannedFeatures({ features }: PlannedFeaturesProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-muted-foreground">
        规划功能
      </h2>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Card key={f.name} className="border-dashed opacity-60">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{f.name}</span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      待开发
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {f.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
