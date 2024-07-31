export const menuItems = [
  {
    link: "/member/inbox/unassigned",
    content: "Unassigned",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><title>account-alert</title><path d="M10 4A4 4 0 0 1 14 8A4 4 0 0 1 10 12A4 4 0 0 1 6 8A4 4 0 0 1 10 4M10 14C14.42 14 18 15.79 18 18V20H2V18C2 15.79 5.58 14 10 14M20 12V7H22V13H20M20 17V15H22V17H20Z" /></svg>
    ),
  },
  {
    link: "/member/inbox/queued",
    content: "Queued",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><title>tray-full</title><path d="M18 5H6V7H18M6 9H18V11H6M2 12H4V17H20V12H22V17A2 2 0 0 1 20 19H4A2 2 0 0 1 2 17M18 13H6V15H18Z" /></svg>
    ),
  },
  {
    link: "/member/inbox/progress",
    content: "In Progress",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><title>progress-star-four-points</title><path d="M13 4V2C17.66 2.5 21.33 6.19 21.85 10.85C22.45 16.34 18.5 21.28 13 21.88V19.88C16.64 19.43 19.5 16.56 19.96 12.92C20.5 8.53 17.39 4.54 13 4M5.67 4.2C7.19 2.95 9.04 2.18 11 2V4.06C9.57 4.26 8.22 4.84 7.1 5.74L5.67 4.2M2.05 11C2.24 9.04 3 7.19 4.26 5.67L5.69 7.1C4.8 8.23 4.24 9.58 4.05 11H2.05M4.27 18.33C3.03 16.81 2.26 14.96 2.06 13H4.06C4.24 14.42 4.81 15.77 5.69 16.9L4.27 18.33M5.67 19.74L7.06 18.37H7.1C8.23 19.25 9.58 19.82 11 20V22C9.04 21.79 7.18 21 5.67 19.74M12 17L13.56 13.58L17 12L13.56 10.44L12 7L10.43 10.44L7 12L10.43 13.58L12 17Z" /></svg>
    ),
  },
  {
    link: "/member/inbox/resolved",
    content: "Resolved",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><title>check-decagram</title><path d="M23,12L20.56,9.22L20.9,5.54L17.29,4.72L15.4,1.54L12,3L8.6,1.54L6.71,4.72L3.1,5.53L3.44,9.21L1,12L3.44,14.78L3.1,18.47L6.71,19.29L8.6,22.47L12,21L15.4,22.46L17.29,19.28L20.9,18.46L20.56,14.78L23,12M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" /></svg>
    ),
  }
];