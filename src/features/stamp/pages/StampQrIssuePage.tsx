"use client";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useEffectEvent, useState } from "react";

import { PageShell } from "@/shared/components/PageShell";
import { Button } from "@/shared/ui/Button";
import { ErrorIcon } from "@/shared/ui/icons";
import { useToast } from "@/shared/ui/Toast";

import { stampMutations, stampQueries } from "../api/stamp.queries";
import { StampQrCode } from "../components/StampQrCode";
import { StampQrStatus } from "../components/StampQrStatus";
import { useRemainingSeconds } from "../hooks/use-remaining-seconds";
import { getStampCollectUrl } from "../stamp.routes";
import type { StampToken } from "../types";

/** 부스 운영자가 스탬프 QR을 발급해 보여주는 화면 (STAMP-01-2) */
export function StampQrIssuePage() {
  const { data: booth } = useSuspenseQuery(stampQueries.operatorBooth());
  const issueToken = useMutation(stampMutations.issueToken());
  // 재발급이 실패해도 만료 안내를 보이도록 마지막으로 받은 토큰을 유지
  const [token, setToken] = useState<StampToken | null>(null);
  // 받을 때부터 만료된 토큰(기기 시계·타임존 차이)은 자동 교체하지 않음. 무한 재발급 방지
  const [canAutoRenew, setCanAutoRenew] = useState(false);
  const remainingSeconds = useRemainingSeconds(token?.expiresAt ?? null);
  const toast = useToast();

  // 발급한 QR이 유효한 동안에는 다시 발급하지 않음
  const isValidQrShown = remainingSeconds !== null && remainingSeconds > 0;
  // 만료되면 새 QR로 자동 교체. 실패하면 멈추고 만료 안내 + 직접 발급으로 되돌림
  const shouldRenew = remainingSeconds === 0 && issueToken.isSuccess && canAutoRenew;
  const isExpired = remainingSeconds === 0 && !shouldRenew && !issueToken.isPending;

  function showIssueFailed() {
    // TODO: 발급 실패 문구가 디자인에 없어 임시 문구
    toast.error("QR 코드를 발급하지 못했어요. 다시 시도해 주세요.", { data: { icon: <ErrorIcon /> } });
  }

  function handleIssue() {
    issueToken.mutate(undefined, {
      onSuccess: (issued) => {
        setToken(issued);
        setCanAutoRenew(new Date(issued.expiresAt).getTime() > Date.now());
      },
      onError: showIssueFailed,
    });
  }

  const renewToken = useEffectEvent(handleIssue);

  // 서버가 이전 토큰을 만료 후 10초 더 받아 주므로 만료 시점에 교체해도 스캔 중인 참가자가 실패하지 않음
  useEffect(() => {
    if (shouldRenew) renewToken();
  }, [shouldRenew]);

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
        {remainingSeconds !== null && <StampQrStatus remainingSeconds={remainingSeconds} isExpired={isExpired} />}
      </div>
    </PageShell>
  );
}
