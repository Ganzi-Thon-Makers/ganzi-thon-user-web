---
name: figma-screen
description: Figma 디자인을 이 프로젝트의 feature 화면·컴포넌트로 구현할 때 사용한다.
user-invocable: true
argument-hint: <figma-url-or-node>
---

# figma-screen

1. `CLAUDE.md`, `.claude/rules/architecture.md`, `.claude/rules/component-guide.md`, `.claude/rules/testing.md`, `.claude/rules/project-constraints.md`, `.claude/rules/visual-verification.md`, `.claude/rules/verification.md`, `src/styles/globals.css`를 읽는다. Figma MCP의 design-to-code 스킬이 있으면 그 절차를 함께 따른다.
2. 대상 노드를 분석한다.
   - 레이아웃 방식(flex·grid·form·modal), 반응형 기준(frame 크기, 모바일 디자인 유무)
   - 상태(default·hover·focus·disabled·loading·empty·error)
   - 데이터 의존성(정적 / API 조회 / 폼 제출)
   - 레이아웃·텍스트·에셋을 확인한다. 제공되지 않은 반응형·상태는 가정하지 않고 질문하거나 공백으로 남긴다.
3. 구현 전에 `| Figma 속성 | 값 | 프로젝트 매핑 |` 표를 만든다(Color·Typography → `globals.css` 토큰, Icon·이미지 → 에셋 파일, Radius·Spacing → Tailwind 값). Figma 색·타이포·간격을 토큰에 매핑한다. 우선순위: Tailwind 토큰 클래스 → `globals.css` CSS 변수 → 없으면 새 토큰을 제안하고 확인받는다. 레이아웃은 `component-guide.md`의 "Figma 옮기기"를 따른다. Figma의 component·variant 단위를 컴포넌트 분리 후보로 본다. 맞는 토큰이 없으면 임의 값을 쓰지 말고 토큰 추가가 필요한지 보고한다.
4. `shared/ui`에 이미 있는 컴포넌트(Button 등)를 먼저 재사용한다. 디자인 시스템 컴포넌트면 `shared/ui`에 `cva` variant로, 한 화면 전용이면 `features/<도메인>/components/`에 둔다.
5. 새 화면은 `architecture.md`의 새 기능 순서(`types` → `api` → `queries` → `components` → `pages` → `app/(main)/<경로>/page.tsx` + `PageBoundary`)를 따른다. API가 미확정이면 추측한 엔드포인트를 만들지 않고 정적 데이터로 화면만 구현한 뒤 그 사실을 보고한다.
6. 시맨틱 구조와 접근성(label, 버튼 이름, 포커스)을 먼저 맞추고, 데스크톱·모바일에서 줄바꿈·overflow·터치를 확인한다.
7. 상호작용 컴포넌트에는 역할·텍스트 기반 테스트를 추가한다.
8. `pnpm format`, `pnpm check`, `pnpm test:run`을 돌린다. 이어서 서브에이전트로(Claude Code는 Agent 도구, Codex는 같은 이름의 에이전트) `ganzi-ui-accessibility-reviewer`를 호출하고, Figma와 렌더 화면을 둘 다 볼 수 있으면 `ganzi-visual-verifier`도 병렬로 호출한다. `NEEDS_REVISION`이면 고친 뒤 다시 확인한다.

SVG path를 JSX에 인라인하지 않고 에셋 파일로 둔다. inline style을 쓰지 않는다.

셀프 체크: 하드코딩 색·px 없음, 토큰만 사용, variant는 cva.

보고 형식: 만든·고친 파일, 쓴 토큰 수와 새로 필요한 토큰(제안 값) / 쓴 디자인 자원(`shared/ui` 컴포넌트, 토큰, 에셋) / 토큰 근사가 있으면 원래 값과 근사 토큰 표 / 실행·미실행 검증.

Figma 노드가 없거나 에셋이 비어 있으면 추측으로 채우지 않는다. 확인한 범위, 구현한 범위, 남은 디자인 검증 공백을 구분해 보고한다.
