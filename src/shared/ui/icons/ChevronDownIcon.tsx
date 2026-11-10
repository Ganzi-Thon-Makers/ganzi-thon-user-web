import type { IconProps } from "./icon-props";

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      color="#DADBDA"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M17.4345 8.43451C17.7469 8.12209 18.253 8.12209 18.5654 8.43451C18.8778 8.74693 18.8778 9.25295 18.5654 9.56537L12.5654 15.5654C12.2529 15.8778 11.7469 15.8778 11.4345 15.5654L5.43451 9.56537C5.12209 9.25295 5.12209 8.74693 5.43451 8.43451C5.74693 8.12209 6.25295 8.12209 6.56537 8.43451L11.9999 13.8691L17.4345 8.43451Z" />
    </svg>
  );
}
