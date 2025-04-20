import React from "react";

function NavButton({ naziv, url, pad }) {
  return (
    <a
      className={`p-[${pad}] text-white rounded-[32px] border-[3px] border-white glavno-nav ml-[1vw]`}
      href={url}
    >
      {naziv}
    </a>
  );
}

export default NavButton;
