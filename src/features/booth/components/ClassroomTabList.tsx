import { TabList, TabTrigger } from "@/shared/ui/Tab";

interface ClassroomTabListProps {
  roomNumbers: number[];
}

export function ClassroomTabList({ roomNumbers }: ClassroomTabListProps) {
  return (
    <TabList aria-label="호실" className="mx-auto w-fit rounded-full bg-gray700">
      {roomNumbers.map((number) => (
        <TabTrigger
          key={number}
          value={number}
          className="h-auto flex-none rounded-full px-3 py-1.5 text-white data-active:bg-gray500"
        >
          {number}호
        </TabTrigger>
      ))}
    </TabList>
  );
}
