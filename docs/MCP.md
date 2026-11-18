# MCP 연결

AI 에이전트가 외부 도구를 쓰도록 저장소 루트의 [`.mcp.json`](../.mcp.json)에 팀 공통 MCP 서버를 등록해 두었다. 인증 정보는 각자 계정으로 받고 저장소에는 넣지 않는다.

## Figma (팀 공통)

Figma가 호스팅하는 Remote MCP다. 로컬 앱 실행이나 Desktop Dev Mode가 필요 없다.

```json
{
  "mcpServers": {
    "figma": { "type": "http", "url": "https://mcp.figma.com/mcp" }
  }
}
```

1. Claude Code를 저장소에서 처음 열면 `.mcp.json`의 `figma` 서버를 쓸지 묻는다. 허용한다.
2. 브라우저에서 자신의 Figma 계정으로 OAuth 인증을 마친다. (`/mcp`에서 상태 확인)
3. 구현할 frame·layer에서 **Copy link to selection**으로 URL을 복사해 요청에 붙인다. 예) `/figma-screen <URL>`

팀원 모두 같은 서버와 같은 노드 URL을 쓰므로 같은 디자인 컨텍스트로 구현한다. 이미 Figma 플러그인을 전역으로 설치했다면 같은 도구가 두 번 보일 수 있으니, 둘 중 하나만 켠다(개인 설정은 `.claude/settings.local.json`).

### 선택: Figma Desktop Dev Mode MCP

선택한 레이어를 바로 컨텍스트로 보내고 싶을 때만 Figma Desktop의 Dev Mode에서 MCP Server를 켠다. 각 컴퓨터에서만 도는 서버라 개인 전역 설정에만 추가하고 저장소 설정에는 넣지 않는다.

```text
http://127.0.0.1:3845/mcp
```

## Chrome DevTools + React (팀 공통, 개발 서버 전용)

[Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp)가 브라우저를 띄워 성능 trace·콘솔·네트워크를 보고, 앱에 넣어 둔 [`react-devtools-cdt-mcp`](https://react.dev/reference/dev-tools/react-devtools-cdt-mcp)가 React 컴포넌트 트리·props·hooks·렌더 시간을 같은 MCP로 노출한다.

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest", "--categoryExperimentalThirdParty=true"]
    }
  }
}
```

- `--categoryExperimentalThirdParty=true`가 있어야 React 도구가 보인다(chrome-devtools-mcp 1.3.0+).
- 실행기는 공식 문서대로 `npx`다. MCP 클라이언트가 띄우는 실행기라 프로젝트 의존성 관리(pnpm)와는 별개다.
- React 쪽은 `next.config.ts`의 `instrumentationClientInject`가 **개발 모드에서만** `react-devtools-cdt-mcp/register`를 React보다 먼저 실행한다. 프로덕션 번들에는 들어가지 않는다.

쓰는 법:

1. `pnpm dev`를 켠다.
2. 에이전트에게 Chrome DevTools MCP로 `http://localhost:3000`을 열게 한다.
3. `list_3p_developer_tools`로 React 도구를 확인하고 `execute_3p_developer_tool`로 쓴다. 자주 쓰는 도구:

| 도구                                                    | 용도                                      |
| ------------------------------------------------------- | ----------------------------------------- |
| `react_get_component_tree` / `react_find_components`    | 트리 스냅샷, 이름으로 찾기(`HomePage` 등) |
| `react_get_component_by_uid`                            | props·hooks 값                            |
| `react_start_profiling` → 조작 → `react_stop_profiling` | 렌더 기록                                 |
| `react_get_trace_overview` / `react_get_commit_report`  | 커밋별 렌더된 컴포넌트와 걸린 시간        |

React 도구는 props·hooks 값을 그대로 보여주므로 로컬 개발 서버에서만 쓴다. 실험 기능이라 도구 이름이 바뀔 수 있다.

## 작업 규칙

- 디자인 구현 요청에는 파일 URL 또는 선택 노드 URL을 함께 준다.
- Figma에서 확인되지 않은 문구·수치는 추측해 넣지 않는다(`.claude/rules/project-constraints.md`).
- MCP 연결이 안 되면 링크와 Dev Mode inspect 정보를 기준으로 진행하고, 확인하지 못한 항목을 PR에 남긴다.
