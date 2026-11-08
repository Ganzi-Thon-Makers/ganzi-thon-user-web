// NEXT_PUBLIC_* 값은 빌드 시 인라인되므로 process.env.XXX 형태로 정적으로 참조해야 한다.
function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`환경변수 ${name}가 설정되지 않았습니다. .env.development 또는 .env.local을 확인해 주세요.`);
  }
  return value;
}

export const env = {
  NEXT_PUBLIC_API_URL: required("NEXT_PUBLIC_API_URL", process.env.NEXT_PUBLIC_API_URL),
} as const;
