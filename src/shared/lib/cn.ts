import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const typographyToken = /^(display|title|body|caption)-(sb|m|r)-\d+$/;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [(value: string) => typographyToken.test(value)] }],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// className이 함수면 Base UI의 상태를 넘겨 호출하고, 반환값을 기본 클래스와 병합한다.
export function mergeStateClassName<State>(
  baseClassName: string,
  className: string | ((state: State) => string | undefined) | undefined,
) {
  return (state: State) => {
    const customClassName = typeof className === "function" ? className(state) : className;
    return cn(baseClassName, customClassName);
  };
}
