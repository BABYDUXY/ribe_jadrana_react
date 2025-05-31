export default function AnimatedWave() {
  return (
    <svg
      id="background"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1920.2 1408.58"
      preserveAspectRatio="none"
      className="w-full h-auto"
    >
      <defs>
        <style>{`
          .wave {
            fill: #fff;
            animation: waveMotion 7s ease-in-out infinite alternate;
            transform-origin: center;
          }

          @keyframes waveMotion {
            0% {
              transform: translateX(0) translateY(0px);
            }
            100% {
              transform: translateX(120px) translateY(90px);
            }
          }
        `}</style>
      </defs>
      <g>
        <path
          className="wave"
          d="M0,159.46s375.25-111.3,648,0c272.75,111.3,453.05,19.34,603.86-96.17,252.81-185.63,668.34,96.17,668.34,96.17v1249.13H.71L0,159.46Z"
        />
      </g>
    </svg>
  );
}
