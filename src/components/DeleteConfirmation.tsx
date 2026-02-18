import { OctagonAlert, Trash, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import type { ReactNode } from "react";

interface IProps {
  children: ReactNode;
  onConfirm: () => void;
}
export function DeleteConfirmation({ children, onConfirm }: IProps) {
  const handleConfirm = () => {
    onConfirm();
    console.log("click");
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="overflow-hidden">
        <AlertDialogHeader className="pb-4">
          <AlertDialogTitle>
            <div className="mx-auto mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10 sm:mx-0">
              <OctagonAlert className="h-5 w-5 text-destructive" />
            </div>
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[15px]">
            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="-mx-6 -mb-6 border-t px-6 py-5">
          <AlertDialogCancel>
            <X /> Cancel
          </AlertDialogCancel>
          <AlertDialogAction className={buttonVariants({ variant: "destructive" })} onClick={handleConfirm}>
            <Trash />
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
