import type { IconProps } from "./icon-props";

export function ChevronRightIcon(props: IconProps) {
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
      <path d="M8.43451 17.4345C8.12209 17.7469 8.12209 18.253 8.43451 18.5654C8.74693 18.8778 9.25295 18.8778 9.56537 18.5654L15.5654 12.5654C15.8778 12.2529 15.8778 11.7469 15.5654 11.4345L9.56537 5.43451C9.25295 5.12209 8.74693 5.12209 8.43451 5.43451C8.12209 5.74693 8.12209 6.25295 8.43451 6.56537L13.8691 11.9999L8.43451 17.4345Z" />
    </svg>
  );
}
