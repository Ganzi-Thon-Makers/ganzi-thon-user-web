# 에이전트 검증 하네스

프로젝트 에이전트는 구현을 대신하지 않는다. 메인 세션의 변경을 독립된 관점으로 점검하는 읽기 전용 검증 경계다. 역할이 겹치면 더 많이 부르기보다 변경 위험과 필요한 증거로 고른다.

## 실행 계약

0. 변경이 아래 역할 선택표의 어느 행에 해당하면, 메인 세션은 완료로 보고하기 전에 해당 에이전트를 최소 한 번 호출한다. 사용자가 실시간으로 결과를 확인해준 경우에도 생략하지 않는다.
1. 메인 세션은 변경 범위, 확인할 사용자 결과, 사용할 근거(Figma 노드·명령·재현 절차)를 정해서 넘긴다.
2. 에이전트는 자기 지침과 필요한 규칙만 읽고, 작업 트리와 관련 diff를 확인한다.
3. 에이전트는 파일을 수정하지 않는다. 코드·명령·렌더 결과에서 직접 확인한 내용과 추론을 구분한다.
4. 결과는 `확인 범위`, `발견 사항`, `근거`, `미검증 공백` 순으로 반환한다. 발견 사항에는 `파일:줄` 또는 확인한 화면·viewport를 붙인다.
5. 수정·재검증·최종 결론은 메인 세션만 책임진다. 근거가 부족하면 통과라고 쓰지 않고 `BLOCKED` 또는 검증 공백으로 남긴다.

## 역할 선택

| 변경 또는 질문                                            | 우선 역할                       | 필요할 때 함께                              |
| --------------------------------------------------------- | ------------------------------- | ------------------------------------------- |
| route·layout·`PageBoundary`·feature 레이어·쿼리·상태 위치 | ganzi-architecture-reviewer     | ganzi-reviewer, ganzi-verifier              |
| 화면·컴포넌트 UI, 반응형, 접근성                          | ganzi-ui-accessibility-reviewer | ganzi-visual-verifier                       |
| 렌더 결과와 Figma 비교                                    | ganzi-visual-verifier           | ganzi-ui-accessibility-reviewer             |
| API 연동·쿼리·mutation·에러 처리                          | ganzi-api-contract-reviewer     | ganzi-architecture-reviewer, ganzi-verifier |
| 버그 재현과 원인 추적                                     | ganzi-debugger                  | ganzi-verifier                              |
| 변경 완료 전 명령과 증거 확인                             | ganzi-verifier                  | 해당 전문 리뷰어                            |
| 전체 diff의 실제 회귀 위험                                | ganzi-reviewer                  | 변경 성격에 맞는 리뷰어                     |

## 판정

- **PASS**: 필요한 근거와 검증 결과가 있고, 고칠 발견 사항이 없다.
- **NEEDS_REVISION**: 근거가 있는 결함이나 디자인·접근성·규칙 불일치가 있다.
- **BLOCKED**: Figma 노드, 렌더 화면, 재현 입력, 권한처럼 판정에 필요한 입력이 없다.

리뷰 형식(`/self-review`)의 Verdict는 이렇게 대응한다: Request changes = `NEEDS_REVISION`, Comment·Approve = `PASS`. 스킬은 이 세 값으로 재작업 여부를 정한다.

시각 검증은 Figma와 브라우저 접근이 실제로 가능할 때만 PASS/NEEDS_REVISION을 판정한다. 코드만 읽은 결과는 시각 검증을 대신하지 않는다.
