# 컴포넌트 가이드

Base UI(`@base-ui/react`) API는 `node_modules`의 README·docs로 먼저 확인한다. 컴포넌트를 어디에 둘지는 `architecture.md`의 "배치".

## 선택 순서

1. 시맨틱 HTML + Tailwind 토큰 클래스
2. 이미 있는 `shared/ui` 컴포넌트 (`.claude/references/component-patterns.md`)
3. Dialog·Popover·Menu·Select·Drawer·Toast처럼 포커스·키보드 제어가 필요한 UI는 Base UI를 `shared/ui`에 래핑해서 쓴다. 직접 만들지 않고, feature에서 `@base-ui/react`를 직접 import하지 않는다.

`shared/ui`·`shared/components`에 새 컴포넌트를 추가하면 `component-patterns.md`에 그 파일의 Pattern 형식으로 남긴다.

## 스타일

- className 병합은 `cn()`.
- 변형(variant·size)은 boolean prop을 늘리지 말고 `cva`로 정의하고 `VariantProps`로 props 타입을 만든다(`shared/ui/Button.tsx`).
- variant는 재사용 UI에 시각 상태가 2개 이상이고 같은 className 조합이 반복될 때만 만든다. 한 화면의 상태 한두 개는 `cn()` 조건부 클래스로 둔다. variant 이름은 색(`red`)이 아니라 의미(`primary`·`destructive`)로 짓는다.
- 색·간격·타이포는 `src/styles/globals.css`의 토큰 클래스만 쓴다. 임의 값(`bg-[#123456]`), 인라인 style, 디자인 근거 없는 그림자·카드 중첩을 넣지 않는다.
- Figma 값에 맞는 토큰이 없으면 컴포넌트에 값을 박지 않는다. Figma 변수로 정의된 값이면 `globals.css`에 토큰을 추가하고, 일회성 값이면 가장 가까운 토큰을 쓴 뒤 차이를 보고한다. 토큰 값 자체가 Figma와 다르면 토큰 정의를 고친다.

## 만드는 순서

1. 콘텐츠와 시맨틱 구조를 먼저 쓴다.
2. 반복되는 항목만 타입 있는 데이터 배열로 뺀다. 한 번만 쓰는 짧은 문구까지 데이터화하지 않는다.
3. 화면 변화가 필요할 때만 상태와 이벤트를 더한다. 상태를 전부 부모로 끌어올리거나, 공유할 상태를 자식마다 흩어두지 않는다.
   - 액션(버튼)은 영향을 주는 데이터 가까이에 둔다.
   - 로딩·에러는 `PageBoundary`가 맡는다. 빈 상태는 실제로 비어 있을 수 있는 목록에만 둔다.
4. 같은 목적·변경 주기의 다른 사용처가 생긴 뒤에 공용 추출을 검토한다.

## API 설계

- 현재 사용처가 요구하는 최소 API로 시작한다. 미래 레이아웃용 prop을 미리 만들지 않는다.
- `className`은 밖에서 레이아웃 조정이 실제로 필요한 재사용 UI에만 연다. `ref`는 focus·측정처럼 호출자가 DOM에 접근해야 할 때만 받는다(React 19는 prop으로 받는다).
- DOM 요소를 감싸는 UI는 기본 props(`ComponentProps<"button">`)를 펼쳐 전달하고, `type="button"`처럼 안전한 기본값은 명시한다.
- 한 위치만 바뀌면(아이콘·보조 텍스트·action) config 객체보다 `children`·slot prop을 쓴다. 행마다 다른 렌더는 render prop(`renderItem`).
- 구조가 고정이고 바뀌는 자리가 1~2개면 slot props, 3개 이상이거나 상태·aria가 연결되면(Tabs·Select) compound. Base UI 래퍼를 `items` 배열 prop으로 평탄화하지 않는다. 직접 만든 compound는 Context를 쓰고 밖에서 쓰면 throw한다.

  ```tsx
  // slot props: 배치는 컴포넌트가, 내용은 호출자가 정한다 (실제 예: app/(main)/NavigationLayout.tsx의 navigation)
  <PageShell header={<PageHeader title="부스" />} footer={<SubmitBar />}>{children}</PageShell>

  // compound: 하위 요소가 상태·aria를 공유한다. Base UI 래퍼는 부품을 그대로 노출한다
  <Tabs.Root defaultValue="all">
    <Tabs.List>
      <Tabs.Tab value="all">전체</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel value="all">...</Tabs.Panel>
  </Tabs.Root>

  // 피할 것: 부품을 배열 prop으로 평탄화하면 탭마다 다른 렌더·aria 조정이 막힌다
  <Tabs items={[{ value: "all", label: "전체", content: <List /> }]} />
  ```

  직접 만드는 compound는 Context가 없을 때 throw해서 잘못된 위치에서 쓰는 걸 바로 드러낸다.

  ```tsx
  const AccordionContext = createContext<AccordionState | null>(null);
  function useAccordion() {
    const value = use(AccordionContext);
    if (!value) throw new Error("Accordion 하위 컴포넌트는 <Accordion> 안에서만 쓴다");
    return value;
  }
  ```

- 다른 요소로 렌더할 때는 `as` 대신 Base UI `render` prop을 쓰되, button 시맨틱을 받을 수 있는 요소(`div` 등)에만 `nativeButton={false}`와 함께 쓴다. 링크를 Button으로 렌더하지 않는다(Base UI 문서 금지). 버튼처럼 보이는 링크는 `<Link href="/posts" className={buttonVariants()}>목록</Link>`.
- 입력은 부모와 상태를 공유하면 controlled, 내부에서만 쓰면 local state.
- 컴포넌트 안에서 컴포넌트를 선언하지 않는다(렌더마다 타입이 바뀌어 상태가 초기화된다).

## container와 presentational

- `pages/*Page.tsx`와 Suspense 단위로 데이터를 가진 컴포넌트가 `useRouter`·`useSuspenseQuery`·흐름 제어를 맡고, `components/`의 하위 UI는 props와 콜백만 받는다.
- 작은 화면은 억지로 나누지 않는다. 로직이 커지거나 50~80줄을 넘으면 나눈다.
- 상태 전이·검증·제출 분기가 JSX보다 커지면 `hooks/use-<name>-flow.ts`(`use<Name>Flow`)로 뺀다. 훅은 마크업을 모르고 상태와 동작만 반환한다. `useState` 1~2개짜리는 빼지 않는다.

## 접근성

- 의미에 맞는 `header`·`main`·`nav`·`section`·`footer`를 쓴다. 클릭 가능한 `div`·`span`을 만들지 않는다.
- 페이지 이동은 `a`(`next/link`), 현재 화면의 동작은 `button`. `onClick`을 받는 컴포넌트는 button 시맨틱으로 렌더하고, 동작이 없는 버튼은 `disabled`.
- 아이콘만 있는 버튼, input·textarea·select에는 접근 가능한 이름(보이는 label 우선)을 준다.
- 페이지마다 `h1` 하나, 섹션 제목은 이어지는 heading 계층. 시각 크기 때문에 레벨을 바꾸지 않는다.
- 장식 이미지는 빈 `alt`, 정보 이미지는 구체적인 `alt`.
- 키보드 포커스가 보여야 하고, focus 순서가 화면의 읽기·조작 순서와 같아야 한다.
- 색만으로, 또는 hover만으로 상태·정보·조작을 전달하지 않는다.
- 상태가 있는 UI(메뉴·탭)는 Base UI 래퍼가 주는 `aria-*`·`data-*`를 깨지 않는다.
- 목록 안의 현재 항목은 색과 함께 `aria-current`로 알린다(현재 페이지 링크 `"page"`, 진행 중인 일정 `"time"`).
- 외부 링크의 `target="_blank"`는 새 탭이 필요한 이유가 있을 때만.

## 반응형과 모바일

모바일 웹이 우선이다. Figma 모바일 폭을 기준으로 만들고, 넓은 화면은 최대 폭을 두어 깨지지 않게만 한다. 변경한 화면은 좁은 화면부터 확인한다.

- 확인: 한 열로 자연스럽게 읽히는가 / 제목·숫자·버튼 라벨이 잘리지 않는가 / 가로 스크롤·겹치는 버튼이 없는가 / 터치 간격과 포커스 순서가 맞는가.
- 줄바꿈 가능한 텍스트 컨테이너는 `min-w-0`을 검토한다. overflow를 실제로 막는 건 `truncate`·`line-clamp-*`다(`break-keep`은 아니다).
- 하단 고정 영역은 `env(safe-area-inset-bottom)`를 더하고, 바 높이만큼의 여백은 CSS 변수 하나로 묶는다.
- 높이는 고정 px 대신 `dvh`를 쓴다(주소창 변화 대응).
- input 글자는 16px 이상으로 둔다(iOS가 그보다 작으면 focus 시 확대한다). viewport의 `maximumScale`·`userScalable`로 확대를 막지 않는다.
- 핵심 정보와 조작 요소는 CSS로 숨기지 않는다. 방해되는 장식 요소만 축소·숨김·재배치한다.

## Figma 옮기기

- Figma에서 독립 컴포넌트이거나 자체 variant·state가 있는 요소는 코드에서도 컴포넌트로 나누는 후보로 본다. 화면 안 그룹(frame)은 나누지 않아도 된다.
- 고정 좌표 대신 최대 폭·여백·flex·grid로 의도를 재현한다. 간격은 부모의 `gap-*`로 주고 간격용 wrapper div를 만들지 않는다.
- 고정 높이(`h-*`)는 균일한 행에만 쓴다.
- 시안의 OS UI(status bar, home indicator)는 구현하지 않는다.
- 아이콘은 Figma SVG를 `shared/ui/icons/<Name>Icon.tsx` 컴포넌트로 옮기고(`fill="currentColor"`, `IconProps`) `index.ts`에서 export한다. 이미 있으면 다시 만들지 않는다. 일러스트·사진처럼 색이 고정된 이미지는 에셋 파일로 두고 import한다. 상태에 따라 색이 바뀌는 아이콘은 `text-*`로 제어하고 `<img>`로 쓰지 않는다. 모양이 바뀌면 에셋을 분리하고, 에셋이 없으면 임시 자리만 두고 보고한다. 아이콘 라이브러리·SVGR 도입은 먼저 묻는다.

## 모션

- 디자인·상호작용으로 설명되는 모션만 넣는다. CSS transition으로 충분하면 JS 애니메이션을 쓰지 않는다.
- `transform`·`opacity`를 우선한다. duration·delay는 단위가 드러나는 상수로 둔다.
- `motion-reduce:`에서 강한 이동을 줄이고, 모션이 없어도 콘텐츠와 조작은 그대로 남게 한다. 움직임만으로 정보를 전달하지 않는다.

## 성능

- `'use client'` 파일이 import하는 모듈은 전부 client bundle에 들어간다. 무거운 모듈을 클라이언트 경계로 끌어오지 않는다.
- 이미지는 비율·크기 제약을 둬서 레이아웃 이동을 막는다. `next/image`에는 크기 또는 비율·`sizes`를 준다. 첫 화면 LCP 이미지는 `fetchPriority="high"`(또는 `loading="eager"`), `preload`는 단일 hero에만 쓴다(`priority`는 Next 16에서 deprecated). 나머지는 기본 lazy.
- 페이지 경계 밖의 하위 비동기 영역은 실제 높이에 가까운 스켈레톤으로 공간을 예약한다. 로딩 중에도 헤더 같은 고정 셸은 렌더한다.
- 폰트는 `next/font`로 self-host한다. 초기 화면에 필요 없는 제3자 스크립트는 렌더링을 막지 않게 지연 로드한다.
- scroll·resize 리스너는 passive로 등록하고 cleanup한다. 같은 전역 리스너를 여러 곳에서 중복 등록하지 않는다.
- `useMemo`·`memo`·dynamic import는 측정된 병목이 있을 때만 쓴다. 더 깊은 점검은 `/react-performance`.
