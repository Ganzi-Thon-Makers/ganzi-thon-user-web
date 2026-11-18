# AI·자동화 PR 기준

AI 지침, agent, skill, hook, lint, CI처럼 반복 작업의 실행 방식을 바꾸는 변경에만 적용한다. `무엇을 바꿨나요`에 실제로 바뀐 관점만 적는다.

- 진입점: Claude·Codex가 처음 읽는 파일과 작업 라우팅 (`CLAUDE.md`, `.claude/README.md`)
- 로딩 기준: 항상 읽는 문서와 작업별 rule·reference 선택 기준
- 실행 표면: skill, hook, script, workflow가 자동화하는 일과 실행 조건
- 생성물 관리: 직접 수정하면 안 되는 파일과 재생성 명령
- 리뷰 영향: 리뷰어가 확인할 자동화 결과, 권한, 트리거, 검증 범위

## 예시

```markdown
### 주요 변경사항

- AI 작업 지침과 실행 표면 정비
- lint 규칙 강화

### 세부 작업

- 진입점: `CLAUDE.md`를 부트로더로 줄이고 `.claude/README.md` 로딩 표로 rules 연결
- 실행 표면: `.codex/skills` → `.claude/skills` 심링크로 Claude·Codex 스킬 단일화, hook 적용 범위 명시
- 검증: `pnpm check`, `pnpm test:run` 통과
```

실행하지 않은 명령이나 존재하지 않는 자동화는 쓰지 않는다.
