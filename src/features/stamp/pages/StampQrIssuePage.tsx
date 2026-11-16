"use client";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

import { PageShell } from "@/shared/components/PageShell";
import { Button } from "@/shared/ui/Button";
import { ErrorIcon } from "@/shared/ui/icons";
import { useToast } from "@/shared/ui/Toast";

import { stampMutations, stampQueries } from "../api/stamp.queries";
import { StampQrCode } from "../components/StampQrCode";
import { StampQrStatus } from "../components/StampQrStatus";
import { useRemainingSeconds } from "../hooks/use-remaining-seconds";
import { getStampCollectUrl } from "../stamp.routes";

/** 부스 운영자가 스탬프 QR을 발급해 보여주는 화면 (STAMP-01-2) */
export function StampQrIssuePage() {
  const { data: booth } = useSuspenseQuery(stampQueries.operatorBooth());
  const issueToken = useMutation(stampMutations.issueToken());
  const token = issueToken.data ?? null;
  const remainingSeconds = useRemainingSeconds(token?.expiresAt ?? null);
  const toast = useToast();

  // 발급한 QR이 유효한 동안에는 다시 발급하지 않음
  const isValidQrShown = remainingSeconds !== null && remainingSeconds > 0;

  function showIssueFailed() {
    // TODO: 발급 실패 문구가 디자인에 없어 임시 문구
    toast.error("QR 코드를 발급하지 못했어요. 다시 시도해 주세요.", { data: { icon: <ErrorIcon /> } });
  }

  function handleIssue() {
    issueToken.mutate(undefined, { onError: showIssueFailed });
  }

  return (
    <PageShell
      footer={
        <Button className="w-full" disabled={isValidQrShown || issueToken.isPending} onClick={handleIssue}>
          스탬프 QR 발급
        </Button>
      }
    >
      <div className="flex min-h-full flex-col items-center justify-center gap-6 py-6">
        <section className="flex w-full max-w-80 flex-col items-center gap-6 rounded-lg bg-gray800 px-10 pt-8 pb-10">
          <h1 className="text-center text-title-sb-20 break-keep text-white">{booth.serviceName}</h1>
          {token ? (
            <StampQrCode
              value={getStampCollectUrl(window.location.origin, token.token)}
              label={`${booth.serviceName} 스탬프 QR 코드`}
            />
          ) : (
            <div className="grid size-60 place-items-center rounded-lg border-2 border-dashed border-gray700 text-title-sb-18 text-gray300">
              QR 코드를 발급해 주세요.
            </div>
          )}
        </section>
        {remainingSeconds !== null && <StampQrStatus remainingSeconds={remainingSeconds} />}
      </div>
    </PageShell>
  );
}
