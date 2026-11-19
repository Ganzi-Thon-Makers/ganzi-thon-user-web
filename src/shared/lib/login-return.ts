// 로그인 뒤 돌아갈 수 있는 경로. 임의 경로로 보내는 open redirect를 막으려고 정확히 일치하는 경로만 허용
const LOGIN_RETURN_PATHS = ["/stamp/collect"];
const LOGIN_RETURN_PARAM = "next";
const DEFAULT_AFTER_LOGIN_PATH = "/timeline";

function isLoginReturnPath(path: string | null | undefined): path is string {
  return LOGIN_RETURN_PATHS.some((allowed) => allowed === path);
}

/** 로그인이 풀린 화면에서 보낼 로그인 주소. 허용한 경로면 돌아올 경로만 담고 쿼리는 버린다 */
export function getLoginHref(pathname: string | undefined): string {
  if (!isLoginReturnPath(pathname)) return "/";
  return `/?${new URLSearchParams({ [LOGIN_RETURN_PARAM]: pathname })}`;
}

/** 로그인 화면 주소 쿼리에서 로그인 뒤 이동할 경로를 정한다 */
export function getAfterLoginPath(search: string): string {
  const next = new URLSearchParams(search).get(LOGIN_RETURN_PARAM);
  return isLoginReturnPath(next) ? next : DEFAULT_AFTER_LOGIN_PATH;
}
