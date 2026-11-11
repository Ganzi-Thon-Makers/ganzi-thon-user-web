# 공용 UI 패턴

`shared/ui`·`shared/components`의 컴포넌트를 언제 쓰는지 기록한다. 아래 Pattern 항목 형식(위치·용도·사용 시점·피해야 할 사용·관련 검증)을 따른다.

## Pattern: Button

- 위치: `src/shared/ui/Button.tsx`
- 용도: Base UI Button 래핑. `variant`는 cva(`buttonVariants`)로 정의
- 사용 시점: 현재 화면의 동작(제출, 열기, 확인)
- 피해야 할 사용: 페이지 이동은 링크(`next/link`)로 한다
- 관련 검증: `src/shared/ui/Button.test.tsx`

## Pattern: PageBoundary

- 위치: `src/shared/components/PageBoundary.tsx`
- 용도: 페이지 기본 Suspense + ErrorBoundary + QueryErrorResetBoundary. 기본 fallback `PageSkeleton`, 에러 `PageError`
- 사용 시점: 모든 `app/**/page.tsx`에서 feature 페이지를 감쌀 때
- 피해야 할 사용: 페이지 안에서 독립적으로 실패해도 되는 영역은 별도 경계를 검토한다
- 관련 검증: 페이지 렌더 확인

## Pattern: Badge

- 위치: `src/shared/ui/Badge.tsx`
- 용도: 분류나 상태를 짧은 텍스트로 표시
- 사용 시점: 빨강, 아이보리, 보조 스타일의 라벨. 모든 크기에 세 스타일을 사용할 수 있음
- 피해야 할 사용: 클릭 동작은 Button을 사용
- 관련 검증: 세 크기와 세 색상 스타일의 조합을 브라우저 화면에서 확인

## Pattern: Tooltip

- 위치: `src/shared/ui/Tooltip.tsx`
- 용도: 트리거를 눌렀을 때 짧은 설명을 표시하는 말풍선
- 사용 시점: 모바일에서도 열고 닫을 수 있는 보조 설명에 사용. 위·아래 방향 및 중앙·왼쪽 정렬 지원
- 피해야 할 사용: 필수 안내나 팝업 안에서 조작해야 하는 콘텐츠
- 관련 검증: 모바일 뷰포트에서 트리거·바깥 터치 및 네 가지 배치 확인

## Pattern: Modal

- 위치: `src/shared/ui/Modal.tsx`
- 용도: Base UI Dialog와 같은 방식으로 조합하는 공용 모달
- 사용 시점: 화면 위에 콘텐츠를 표시할 때. `ModalRoot`, `ModalTrigger`, `ModalPortal`, `ModalBackdrop`, `ModalPopup`, `ModalTitle`, `ModalDescription`, `ModalClose`를 필요한 만큼 조합하고, 버튼이나 아이콘은 사용처에서 구성
- 피해야 할 사용: 짧은 상태 안내만 필요한 경우
- 관련 검증: `src/shared/ui/Modal.test.tsx`

## Pattern: Tab

- 위치: `src/shared/ui/Tab.tsx`
- 용도: 화면 내부에서 동일한 너비의 수평 탭을 선택하고 대응 패널을 전환
- 사용 시점: `Tab.Root` 안에 `Tab.List`, `Tab.Trigger`, `Tab.Panel`을 조합하고 Trigger와 Panel의 값을 연결하고 선택 밑줄은 List 안에 `Tab.Indicator`로 배치
- 피해야 할 사용: 페이지 이동은 링크로 연결
- 관련 검증: 좁은 화면에서 선택 표시, 패널 전환, 키보드 이동 확인
