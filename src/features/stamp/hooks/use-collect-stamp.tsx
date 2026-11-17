"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { ErrorIcon, SuccessIcon } from "@/shared/ui/icons";
import { useToast } from "@/shared/ui/Toast";

import { stampMutations } from "../api/stamp.queries";
import { getStampBoardHref } from "../stamp.routes";

// 같은 QR을 계속 비추는 동안 실패 토스트가 쌓이지 않게 같은 id로 갱신
const SCAN_FAILED_TOAST_ID = "stamp-scan-failed";
const COLLECT_FAILED_TOAST_ID = "stamp-collect-failed";

interface CollectStampOptions {
  /** 응답을 받은 시점에 이 요청이 아직 유효한지. false면 화면을 옮기지 않는다 */
  isCurrent?: () => boolean;
}

/** 스탬프 QR 토큰으로 적립하고 결과를 토스트와 스탬프판 구역 펼침으로 안내한다 (STAMP-03) */
export function useCollectStamp() {
  const router = useRouter();
  const toast = useToast();
  const { mutateAsync } = useMutation(stampMutations.collect());

  function showScanFailed() {
    toast.error("QR 코드를 인식 못했어요. 다시 스캔해 주세요.", {
      id: SCAN_FAILED_TOAST_ID,
      data: { icon: <ErrorIcon /> },
    });
  }

  /** 적립을 끝냈으면 true. 인식 실패·요청 실패면 false라 스캔을 이어갈 수 있다 */
  async function collectStamp(
    token: string | null,
    { isCurrent = () => true }: CollectStampOptions = {},
  ): Promise<boolean> {
    if (!token) {
      showScanFailed();
      return false;
    }

    const result = await mutateAsync(token).catch(() => null);
    if (!result) {
      // TODO: 요청 실패 문구가 디자인에 없어 임시 문구. 서버 에러 형식이 정해지면 원인별로 나눔
      toast.error("스탬프를 받지 못했어요. 잠시 후 다시 시도해 주세요.", {
        id: COLLECT_FAILED_TOAST_ID,
        data: { icon: <ErrorIcon /> },
      });
      return false;
    }

    if (result.status === "invalid-token") {
      showScanFailed();
      return false;
    }

    if (result.status === "collected") {
      toast.success("스탬프를 받았어요!", { data: { icon: <SuccessIcon /> } });
    } else {
      toast.error("이미 수집한 스탬프입니다.", { data: { icon: <ErrorIcon /> } });
    }
    // 요청 중 모달을 닫거나 화면을 떠났으면 결과만 알리고 이동하지 않음
    if (isCurrent()) router.replace(getStampBoardHref(result.boothId, Date.now()));
    return true;
  }

  return { collectStamp };
}
