import React from "react";

export const Ico = ({ d, s = 18 }) => (
  <svg
    width={s}
    height={s}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

export const HomeIcon = () => <Ico d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10" />;
export const StarIcon = () => <Ico d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />;
export const BldgIcon = () => <Ico d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4" />;
export const CheckIcon = () => <Ico d="M20 6L9 17l-5-5" />;
export const LogOutIcon = () => <Ico d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />;
export const BackIcon = () => <Ico d="M19 12H5M12 19l-7-7 7-7" />;
