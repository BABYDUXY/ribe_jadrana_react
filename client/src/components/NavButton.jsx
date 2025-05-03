import React from "react";

function NavButton({ naziv, url, pad }) {
  const [topBottom, leftRight] = pad.split("_");

  const paddingX = parseFloat(leftRight);
  const newpaddingX = `${paddingX + 0.3}rem`;
  console.log(newpaddingX);

  return (
    <a
      className={`p-[${pad}] text-white rounded-[32px] border-[3px] border-white glavno-nav ml-[1vw] nav-btn-hover`}
      href={url}
      onMouseEnter={(e) => {
        e.currentTarget.style.paddingLeft = newpaddingX;
        e.currentTarget.style.paddingRight = newpaddingX;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.paddingLeft = leftRight;
        e.currentTarget.style.paddingRight = leftRight;
      }}
    >
      {naziv}
    </a>
  );
}

export default NavButton;
