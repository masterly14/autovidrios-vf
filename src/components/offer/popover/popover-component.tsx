import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  Trigger: String;
  Content: React.ReactNode;
};
export function PopoverDemo({ Trigger, Content }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild><Button variant={'outline'}>{Trigger}
        </Button></PopoverTrigger>
      <PopoverContent className="w-80">{Content}</PopoverContent>
    </Popover>
  );
}
