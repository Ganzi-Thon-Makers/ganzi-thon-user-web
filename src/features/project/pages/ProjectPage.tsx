"use client";

import { Suspense } from "@suspensive/react";

import { AppBar } from "@/shared/components/AppBar";
import { PageShell } from "@/shared/components/PageShell";
import { Button } from "@/shared/ui/Button";
import { TabIndicator, TabList, TabPanel, TabRoot, TabTrigger } from "@/shared/ui/Tab";

import { ProjectList, ProjectListSkeleton } from "../components/ProjectList";
import { ZONE_LABELS, ZONES } from "../types";

export function ProjectPage() {
  return (
    // 탭 목록(header)과 패널(본문)이 같은 탭 상태를 써서 셸 바깥을 TabRoot로 감쌈
    <TabRoot defaultValue={ZONES[0]} className="flex min-h-0 flex-1 flex-col">
      <PageShell
        header={
          <div className="bg-gray800">
            <AppBar title="프로젝트" withProfile className="bg-gray800" />
            <TabList>
              {ZONES.map((zone) => (
                <TabTrigger key={zone} value={zone}>
                  {ZONE_LABELS[zone]}
                </TabTrigger>
              ))}
              <TabIndicator />
            </TabList>
          </div>
        }
        footer={
          // 인기투표 목적지가 정해지기 전이라 동작 없이 비활성
          <Button disabled className="w-full">
            인기투표
          </Button>
        }
      >
        {ZONES.map((zone) => (
          <TabPanel key={zone} value={zone} className="pt-5.5">
            <h2 className="sr-only">{ZONE_LABELS[zone]} 프로젝트</h2>
            <Suspense fallback={<ProjectListSkeleton />}>
              <ProjectList zone={zone} />
            </Suspense>
          </TabPanel>
        ))}
      </PageShell>
    </TabRoot>
  );
}
