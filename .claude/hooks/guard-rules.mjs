// PreToolUse(Edit|Write|Bash): lint가 못 잡는 규칙 위반을 exit 2로 차단하고 stderr를 에이전트에게 돌려준다.
import { readFileSync } from "node:fs";

let payload;
try {
  payload = JSON.parse(readFileSync(0, "utf8"));
} catch {
  process.exit(0);
}

const input = payload.tool_input ?? {};
const filePath = input.file_path ?? "";
const content = input.new_string ?? input.content ?? "";
const command = input.command ?? "";

// heredoc 본문과 따옴표 안 문자열(커밋 메시지·스크립트 내용)은 명령이 아니므로 검사에서 뺀다.
const heredocAt = command.indexOf("<<");
const commandHead = (heredocAt === -1 ? command : command.slice(0, command.indexOf("\n", heredocAt) + 1 || undefined))
  .replace(/'[^']*'/g, "''")
  .replace(/"(?:[^"\\]|\\.)*"/g, '""');

function block(message) {
  console.error(message);
  process.exit(2);
}

if (/(^|&&|\|\||[;|(]|\$\()\s*(npm|yarn|npx|bunx?)(\s|$)/m.test(commandHead)) {
  block("이 프로젝트는 pnpm만 씁니다. (pnpm, pnpm exec, pnpm dlx)");
}

const isCommit = /\bgit\b[^;&|\n]*\bcommit\b/.test(commandHead);
const skipsHooks =
  /\bcommit\b[^;&|\n]*(\s--no-verify\b|\s-[a-zA-Z]*n[a-zA-Z]*\b)/.test(commandHead) ||
  /core\.hooksPath/.test(commandHead) ||
  /\bLEFTHOOK=0\b/.test(commandHead);
if (isCommit && skipsHooks) {
  block("커밋 훅을 건너뛰지 마세요. 실패 원인을 고친 뒤 다시 커밋합니다.");
}

if (
  /\.(ts|tsx|mts|cts|js|jsx|mjs|cjs)$/.test(filePath) &&
  !filePath.includes(".claude/hooks/") &&
  /oxlint-disable|eslint-disable/.test(content)
) {
  block("lint 규칙을 끄지 말고 코드를 고치세요. 레이어 규칙에 걸리면 코드 위치를 옮깁니다.");
}

if (/tailwind\.config\./.test(filePath) || /tailwind\.config\./.test(commandHead)) {
  block("Tailwind v4 프로젝트입니다. 설정은 src/styles/globals.css에 둡니다.");
}
