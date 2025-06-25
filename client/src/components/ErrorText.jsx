import React from "react";

function ErrorText({ tekst }) {
  return (
    <div className="relative inline-block">
      <p className="text-4xl">{tekst}</p>
      <span className="absolute left-0 bottom-0 w-full h-[3px] rounded-full overflow-hidden">
        <span className="block w-1/3 h-full bg-white rounded-full animate-underlinePingPong" />
      </span>
    </div>
  );
}

export default ErrorText;
