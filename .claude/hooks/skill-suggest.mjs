// UserPromptSubmit: 프롬프트 키워드에 맞는 로컬 스킬을 안내한다. (stdout이 컨텍스트로 들어간다)
import { readFileSync } from "node:fs";

let payload;
try {
  payload = JSON.parse(readFileSync(0, "utf8"));
} catch {
  process.exit(0);
}

const prompt = (payload.prompt ?? "").toLowerCase();
const rules = [
  [/\bcommit\b|커밋/, "/commit - 커밋 메시지·명령 제안"],
  [/\bissue\b|이슈/, "/issue - 이슈 폼에 맞춘 이슈 초안"],
  [/\bpr\b|pull request|풀리퀘|피알/, "/pull-request - PR 제목·본문 초안"],
  [/\brefactor|리팩터|리팩토/, "/refactor - 동작 유지 리팩터링"],
  [/\breview\b|리뷰/, "/self-review - 변경 코드 리뷰"],
  [/swagger|openapi|엔드포인트|api 연동|scaffold/, "/scaffold-api - 명세 기반 types·api·queries 생성"],
  [/\btests?\b|테스트|vitest/, "/gen-test - 대상 파일 테스트 작성"],
  [/성능|performance|리렌더|rerender|번들|bundle|lighthouse/, "/react-performance - 성능 점검"],
  [/버그|\bbug\b|에러|안 ?돼|안 ?됨/, "ganzi-debugger 에이전트 - 재현·근본 원인 조사"],
  [/figma|피그마/, "/figma-screen - Figma 기반 화면 구현"],
];

const suggestions = rules.filter(([pattern]) => pattern.test(prompt)).map(([, s]) => `- ${s}`);
if (suggestions.length > 0) process.stdout.write(`추천 로컬 스킬:\n${suggestions.join("\n")}\n`);
