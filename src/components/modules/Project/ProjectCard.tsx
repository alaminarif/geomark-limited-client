/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

type Props = {
  item: any;
  onView: (id: string) => void;
};

const ProjectCard = ({ item, onView }: Props) => {
  return (
    <div className="border border-muted rounded-2xl p-4 bg-background/40">
      <div className="flex gap-4">
        <img src={item.picture} alt={item.name} className="w-28 h-20 rounded-xl object-cover shrink-0" />

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base leading-snug whitespace-normal break-words">{item.name}</h3>

          <div className="mt-2 text-sm text-muted-foreground space-y-1">
            <p>
              <span className="font-medium text-foreground">Period:</span> {item?.startDate ? format(new Date(item.startDate), "PPP") : "-"}
            </p>
            <p>
              <span className="font-medium text-foreground">Status:</span> {item.status || "-"}
            </p>
            <p className="whitespace-normal break-words">
              <span className="font-medium text-foreground">Sector:</span> {item.title || "-"}
            </p>
            <p>
              <span className="font-medium text-foreground">Client:</span> {item?.client?.name || "-"}
            </p>
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={() => onView(item?._id)} variant="outline" className="text-destructive">
              View
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
