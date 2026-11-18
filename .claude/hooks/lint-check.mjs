// PostToolUse(Edit|Write): 편집한 TS/TSX 파일 하나만 oxlint로 검사하고, 실패하면 exit 2로 결과를 에이전트에게 돌려준다.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

let payload;
try {
  payload = JSON.parse(readFileSync(0, "utf8"));
} catch {
  process.exit(0);
}

const filePath = payload.tool_input?.file_path ?? "";
// cwd가 하위 폴더로 바뀌어도 루트의 oxlint·.oxlintrc.json을 쓴다.
const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const oxlint = join(root, "node_modules/.bin/oxlint");
// 의존성 설치 전에는 검사를 건너뛴다.
if (!/\.(ts|tsx)$/.test(filePath) || !existsSync(oxlint)) process.exit(0);

try {
  execFileSync(oxlint, ["--quiet", filePath], { cwd: root, encoding: "utf8", timeout: 30_000 });
} catch (error) {
  const output = `${error.stdout ?? ""}${error.stderr ?? ""}`.trimEnd();
  console.error(output.split("\n").slice(-20).join("\n"));
  process.exit(2);
}
