import { TabList, TabTrigger } from "@/shared/ui/Tab";

const CLASSROOMS = ["A", "B"] as const;

// TabRoot 안에서 사용. 선택 안 된 칸은 "강의실"을 화면에서만 숨김
export function ClassroomTabList() {
  return (
    <TabList className="w-fit rounded-full bg-gray700">
      {CLASSROOMS.map((classroom) => (
        <TabTrigger
          key={classroom}
          value={classroom}
          className="group h-auto flex-none rounded-full px-3 py-1.5 text-white data-active:bg-gray500"
        >
          <span className="sr-only group-data-active:not-sr-only">강의실</span> {classroom}
        </TabTrigger>
      ))}
    </TabList>
  );
}
