import { useEffect } from "react";

export default function BouncingArrow() {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes stretchBounce {
        0% {
          transform: translateY(0) scaleY(1);
        }
        50% {
          transform: translateY(80px) scaleY(1);
        }
        100% {
          transform: translateY(0) scaleY(1);
        }
      }

      .arrow-bounce {
        animation: stretchBounce 1.5s ease-in-out infinite;
        transform-origin: top;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <svg
      id="Isolation_Mode"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 350 500"
      className="w-10 h-10 cursor-pointer"
    >
      <path
        className="arrow-bounce"
        fill="#fff"
        d="M149.48,356.92c-5.27-.71-11-4.26-15.02-7.65C91.05,305.06,45.97,262.29,3.53,217.24c-13.89-26.68,16.07-50.74,39.57-31.18,22.6,25.32,51.62,48.08,73.61,73.57,1.15,1.33,2.81,3.22,3.77,4.6,2.77,3.98,4.19,9.03,7.37,12.5V20.45c0-1.2,3.4-8.33,4.3-9.65,10.67-15.57,34.46-13.94,43.27,2.55.74,1.38,3.36,8.1,3.36,9.19v254.18l7.51-13.06c18.64-20.78,39.06-40.1,59.13-59.44,13.08-12.61,24.14-30.94,45.17-23.57,15.73,5.51,20.23,26.95,9.59,39.26l-130.81,130.75c-3.31,2.72-8.7,5.69-12.92,6.26-1.59.22-5.39.21-6.98,0Z"
      />
    </svg>
  );
}
