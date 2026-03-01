/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const ServiceModal = ({ open, setOpen, service }: any) => {
  if (!service) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        className={[
          // width
          "w-[92vw] sm:w-[80vw] lg:w-[50vw] max-w-none",

          "border-0 bg-muted/40 backdrop-blur-xl rounded-2xl p-6",

          // ✅ hide the default close (X) button that shadcn adds
          "[&>button]:hidden",

          // next-level animation
          "will-change-transform",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[state=closed]:slide-out-to-bottom-6 data-[state=open]:slide-in-from-bottom-6",
          "data-[state=open]:duration-300 data-[state=closed]:duration-200",
          "data-[state=open]:ease-out data-[state=closed]:ease-in",
        ].join(" ")}
      >
        <DialogHeader>
          <img src={service?.picture} alt={service?.name} className="h-64 w-full rounded-xl object-cover" />

          <DialogTitle className="text-2xl font-semibold ">{service?.name}</DialogTitle>

          <DialogDescription className="text-sm text-justify leading-relaxed">{service?.description}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
