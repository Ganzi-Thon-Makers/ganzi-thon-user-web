# 간지톤 사용자 웹

간지톤 사용자용 웹 프론트엔드. Next.js 16 · TanStack Query · Base UI · TailwindCSS 4

## 시작하기

```bash
nvm use            # Node 22
corepack enable    # pnpm
pnpm install
pnpm dev           # http://localhost:3000
```

환경변수: 공개 값은 `.env.development`·`.env.production`에 커밋되어 있다. 비밀값만 `.env.local`에 둔다. (`.env.example` 참고)

## 스크립트

| 명령            | 설명                                         |
| --------------- | -------------------------------------------- |
| `pnpm dev`      | 개발 서버                                    |
| `pnpm build`    | 프로덕션 빌드                                |
| `pnpm test:run` | 테스트                                       |
| `pnpm format`   | 포맷 자동 수정                               |
| `pnpm check`    | 타입체크 + 린트 + 포맷 검사 (CI와 같은 검사) |

## 문서

- 팀원용 안내: [docs/](./docs/README.md) — 구조, 개발 가이드, Git 흐름, AI 에이전트 사용법
- AI 에이전트용 규칙: [CLAUDE.md](./CLAUDE.md) → [.claude/README.md](./.claude/README.md)

커밋 메시지는 Conventional Commits(`feat: 로그인 화면 추가`)를 따르고, 커밋 시 lefthook이 포맷·린트·타입체크·테스트를 돌린다.

## 백엔드 확정 후 바꿀 곳

| 항목                  | 바꿀 파일                                               |
| --------------------- | ------------------------------------------------------- |
| API 주소              | `.env.development`, `.env.production`, GitHub Variables |
| 토큰 방식 (쿠키 전환) | `shared/api/client.ts`, `shared/api/token.ts` 삭제      |
| 에러 응답 형식        | `shared/api/error.ts`의 `ErrorBody`                     |
