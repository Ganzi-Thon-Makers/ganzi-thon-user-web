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

## Pattern: PageError·PageSkeleton

- 위치: `src/shared/components/PageError.tsx`, `src/shared/components/PageSkeleton.tsx`
- 용도: `PageBoundary`의 기본 에러 화면(`role="alert"`, 다시 시도 버튼)과 기본 로딩 화면(`aria-busy`)
- 사용 시점: `PageBoundary`가 대신 렌더한다. 직접 쓰는 일은 거의 없다
- 피해야 할 사용: 페이지 안 하위 영역의 로딩에 `PageSkeleton`을 쓰지 않는다. 실제 높이에 가까운 영역별 스켈레톤을 둔다(`component-guide.md` "성능"). 403·404 안내는 각 화면에서 한다(`data-fetching.md` "에러")
- 관련 검증: 쿼리 실패·지연 시 페이지 렌더 확인

## Pattern: BottomNavigation

- 위치: `src/shared/ui/BottomNavigation.tsx`. 앱 경로·라벨을 알아서 `architecture.md` 배치 기준으로는 `shared/components`로 옮길 대상이다(별도 작업)
- 용도: 하단 탭(타임라인·부스·프로젝트·마이)과 가운데 원형 버튼. 탭은 `next/link`와 `aria-current="page"`, 하단 safe-area와 가운데 홈 크기는 `globals.css`의 `bottom-navigation-metrics`가 맡는다
- 사용 시점: 탭 화면은 `app/(main)/(tabs)/layout.tsx`가 이미 렌더한다. 가운데 버튼을 스탬프 링크 대신 QR 동작으로 바꿔야 하는 화면만 `onQrClick`을 넘긴다(`features/stamp/components/StampNavigation.tsx`)
- 피해야 할 사용: 페이지에서 다시 렌더하지 않는다. 하단 탭이 없어야 하는 화면은 `app/(standalone)`에 둔다. 탭을 늘리면 가운데 홈 비율이 깨지므로 디자인을 먼저 확인한다
- 관련 검증: `src/shared/ui/BottomNavigation.test.tsx`, 좁은 화면과 iOS safe-area 확인

## Pattern: icons

- 위치: `src/shared/ui/icons/` (`index.ts`에서 export)
- 용도: Figma 아이콘을 `currentColor` SVG 컴포넌트로 둔 것. props는 `IconProps`(svg 속성, `children` 제외)
- 사용 시점: 색은 `text-*`로 바꾼다. 장식이면 `aria-hidden`을 주고, 아이콘만 있는 버튼은 버튼에 접근 가능한 이름을 준다
- 피해야 할 사용: 같은 모양을 feature에 다시 그리지 않는다. 새 아이콘은 Figma 에셋 그대로 이 폴더에 추가하고 `index.ts`에 export한다. 모양이 상태에 따라 바뀌면(위·아래 화살표) 에셋을 나눠 두고 상태로 고른다
- 관련 검증: 렌더된 크기가 원본 `width`·`height`와 같은지 확인

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
- 사용 시점: `TabRoot` 안에서 `TabList`, `TabTrigger`, `TabPanel`을 조합하고 Trigger와 Panel의 값을 연결. 선택 밑줄은 `TabList` 안에 `TabIndicator`로 배치
- 피해야 할 사용: 페이지 이동은 링크로 연결
- 관련 검증: 좁은 화면에서 선택 표시, 패널 전환, 키보드 이동 확인

## Pattern: ProgressBar

- 위치: `src/shared/ui/ProgressBar.tsx`
- 용도: Base UI Progress 래핑. `variant`(`black`·`red`)로 트랙·채움 색 조합을 고르고, `isComplete`로 채움 색을 완료 색으로 바꿈. 완료 기준이 `max`와 다를 수 있어(구역 수료 3/8 등) 사용처가 정함
- 사용 시점: 스탬프처럼 개수로 나타내는 진행률. `aria-label`(또는 보이는 라벨)을 주고, 숫자만으로 뜻이 안 드러나면 `getAriaValueText`로 읽을 문장을 넘김
- 피해야 할 사용: 끝을 알 수 없는 로딩 표시
- 관련 검증: `src/shared/ui/ProgressBar.test.tsx`
