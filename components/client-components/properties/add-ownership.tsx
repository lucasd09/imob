import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { PlusIcon } from "@radix-ui/react-icons";

export default function AddOwnership({ visible }: { visible: boolean }) {
  return (
    <Dialog>
      <DialogTrigger hidden={visible}>
        <Button>
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
