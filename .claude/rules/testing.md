# 테스트 규칙

## 도구와 위치

- Vitest + React Testing Library + `@testing-library/user-event`(`fireEvent`보다 우선). jest-dom matcher는 `vitest.setup.ts`에서 전역 등록되어 있다.
- 테스트 파일은 대상 옆에 `*.test.ts(x)`로 둔다.
- `pnpm test`는 감시 모드, `pnpm test:run`은 단발 실행(CI와 같음). 커밋 시 lefthook이 관련 테스트만 돌린다.

## 무엇을 테스트할까

| 대상                                  | 기본 판단                     |
| ------------------------------------- | ----------------------------- |
| 순수 유틸·데이터 변환                 | 분기나 경계값이 있으면 테스트 |
| 쿼리를 쓰는 컴포넌트                  | 성공·에러 렌더                |
| 상태 전이·타이머·observer를 쓰는 hook | 테스트 권장                   |
| 폼·메뉴·탭 등 인터랙티브 UI           | 사용자 흐름과 접근성          |
| 폼                                    | 검증 메시지와 제출 호출       |
| mutation을 쓰는 UI                    | 성공 후 화면 전환·무효화 호출 |
| 낙관적 업데이트                       | 실패 시 롤백                  |
| 정적 문구·정적 마크업                 | 강제하지 않음                 |
| 실제 브라우저 동작·시각 일치          | 화면 확인으로 검증            |

- 사용자에게 보이는 계약과 실패할 수 있는 로직을 우선한다. 렌더 성공, props·variant 동작, 상호작용 결과, 접근성 속성, 실제로 생기는 로딩·빈 상태·에러를 본다.
- 테스트가 없다는 사실을 완료로 표현하지 않는다. `--passWithNoTests` 통과는 검증이 아니다.

## 렌더와 mock

- 쿼리를 쓰는 컴포넌트는 `@/shared/test/render`의 `renderWithProviders`로 렌더한다.
- 네트워크 경계는 `../api/<도메인>.api`만 `vi.mock`한다. `shared/api/client`·ky·fetch는 mock하지 않는다.
- `next/navigation`·타이머·observer·브라우저 API는 필요할 때 mock하고, 테스트 뒤 복구한다(`vi.useRealTimers()`, `vi.restoreAllMocks()`).
- `vi.fn`에는 타입 파라미터를 준다(`vi.fn<() => void>()`). mock factory에서 바깥 변수를 참조하면 `vi.hoisted`로 선언한다.
- 훅은 `renderHook` + `act`. 타이머는 `vi.useFakeTimers()` 후 `act(() => vi.advanceTimersByTime(ms))`.
- API 계층은 `src/shared/api/error.test.ts`처럼 가짜 `fetch`를 넣은 `ky.create({ fetch })`로 4xx/5xx·네트워크·타임아웃을 테스트한다.

## 찾기와 단언

- 쿼리 우선순위: `getByRole` → `getByLabelText` → `getByText` → `getByTestId`(마지막 수단). 비동기는 `findBy*`·`waitFor`.
- `it()` 하나에는 동작 하나.
- className·내부 state·private 함수·깊은 selector(`container.querySelector`)를 검사하지 않는다. variant 확인 정도는 예외.
- 스냅샷만으로 검증하지 않는다. 외부 라이브러리 내부 동작(`twMerge`, `clsx`)을 검증하지 않는다. 페이지 전체 흐름은 단위 테스트가 아니라 화면 확인으로 한다.
- 실패하는 테스트를 남기거나 숨기지 않는다(`.only`·`.skip`은 oxlint가 막는다).
