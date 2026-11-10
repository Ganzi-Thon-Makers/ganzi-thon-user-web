# 코드 스타일

포맷(따옴표·세미콜론·줄 길이·import 순서·Tailwind class 정렬)은 oxfmt가 단일 기준이다. 수동 포맷 규칙을 더하지 않는다. 파일 이름 규칙은 `architecture.md`.

## 함수와 export

- 컴포넌트와 모듈 수준의 이름 있는 함수는 `function` 선언으로 쓴다. 짧은 콜백·배열 변환만 화살표 함수를 쓴다.
- named export가 기본이다. `export default`는 Next가 요구하는 파일(`page`·`layout`·`loading`·`error`·`not-found` 등)에만 쓴다.

## 이름

| 대상          | 표기                           | 예                         |
| ------------- | ------------------------------ | -------------------------- |
| 변수·함수     | camelCase                      | `selectedPost`, `getPosts` |
| 컴포넌트·타입 | PascalCase                     | `PostList`, `PostDetail`   |
| 훅            | `use` + camelCase              | `usePostFilter`            |
| boolean       | `is`·`has`·`can`·`should` 접두 | `isOpen`, `hasNext`        |
| 이벤트        | prop은 `on`, 핸들러는 `handle` | `onSelect`, `handleSubmit` |
| 모듈 상수     | UPPER_SNAKE_CASE + 단위        | `RETRY_DELAY_MS`           |
| props 타입    | `<컴포넌트>Props`              | `ButtonProps`              |
| cva 변형      | `<컴포넌트 camelCase>Variants` | `buttonVariants`           |
| 쿼리 팩토리   | `<도메인>Queries`              | `postQueries`              |

- 의미에 맞는 영어 단어를 쓴다. 한글 발음 표기(`moohyungJasan`)는 쓰지 않는다. 고유명사(`ganzi`)는 예외.
- `a`, `data`, `temp`, `info`처럼 의미가 불분명한 이름을 피한다. 짧은 반복문 인덱스 `i`는 예외.
- 이름은 디자인 용어보다 사용자·도메인 의미를 우선한다. 부수 효과가 있는 함수는 동작을 이름에 드러낸다.
- 상수는 시간·개수·임계값처럼 조정 의미가 있는 모듈 값만 만든다. 자명한 0·1이나 지역 값은 상수화하지 않는다.

## 타입

- 타입 전용 import는 `import type` 또는 inline `type`.
- 외부 입력은 `any` 대신 `unknown`에서 시작해 쓰는 경계에서 좁힌다.
- `as` 단언은 검증 결과처럼 근거가 가까울 때만 쓴다. 이중 단언(`as unknown as`)과 non-null 단언(`!`)을 쓰지 않는다.
- 문자열 union이 여러 곳에서 반복되면 `as const` 배열에서 파생한다. 값별 설정은 `Record` + `satisfies`로 누락을 막는다.
- variant 값을 밖에서 써야 하면 cva에서 파생한다(`NonNullable<VariantProps<typeof buttonVariants>["variant"]>`).
- variant에 따라 props 조합이 달라지면 optional을 늘리지 말고 discriminated union으로 막는다.

  ```ts
  type ActionProps =
    | { type: "button"; onClick: () => void; href?: never }
    | { type: "link"; href: string; onClick?: never };
  ```

- controlled 입력은 Base UI 관례대로 `value`·`onValueChange`·`defaultValue`.
- 같은 종류의 함수는 반환 형태를 통일한다(검증 함수가 `boolean`과 `{ ok: false; reason }`을 섞지 않게).

## 제어 흐름과 JSX

- 예외·종료 조건을 먼저 반환해 중첩을 줄인다.
- 여러 규칙을 합친 조건식은 결과 의미가 드러나는 지역 변수로 뺀다. 자명한 조건까지 이름 붙이지 않는다.
- 범위 조건은 수직선 순서로 쓴다: `min <= value && value <= max`.
- 삼항은 두 갈래까지만 쓴다(중첩 삼항은 oxlint가 막는다). 그 이상은 조기 반환·작은 컴포넌트로 펼친다.
- JSX의 긴 문자열 결합·복잡한 계산은 지역 변수나 작은 함수로 뺀다. 선언과 사용 위치를 멀리 두지 않는다.
- 반복 렌더링 key는 데이터의 안정적인 id를 쓴다. 재정렬·삽입이 없는 정적 목록이 아니면 index를 쓰지 않는다.

## 기타

- `console.log`를 남기지 않는다(oxlint). `console.warn`·`console.error`도 목적을 검토한 경우에만 쓴다.
- App Router에서는 `next/router`·`next/document` 대신 `next/navigation`, `layout.tsx`, metadata API를 쓴다(oxlint).
- 주석은 코드가 하는 일을 반복하지 않고, 선택한 이유·제약·외부 근거만 1~2줄로 남긴다.
