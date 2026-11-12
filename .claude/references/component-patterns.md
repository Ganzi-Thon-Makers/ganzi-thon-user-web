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
