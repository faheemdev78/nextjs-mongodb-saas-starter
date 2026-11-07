import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS, type ProjectStatus } from "@/lib/constants";

const variants: Record<ProjectStatus, "default" | "secondary" | "outline"> = {
  planned: "secondary",
  active: "default",
  completed: "outline",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return <Badge variant={variants[status]}>{STATUS_LABELS[status]}</Badge>;
}
