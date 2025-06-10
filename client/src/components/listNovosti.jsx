import React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { EndpointUrlContext } from "../kontekst/EndpointUrlContext";
import { useState, useRef, useEffect } from "react";
import { useLogin } from "../kontekst/loginContext";

function ListNovosti({ value, refreshPosts }) {
  const date = new Date(value.datum);
  const { endpointUrl } = useContext(EndpointUrlContext);
  const contentRef = useRef(null);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getUTCFullYear();
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState("13rem");
  const formattedDate = `${day}.${month}.${year}.`;
  const { user } = useLogin();

  const [loading, setLoading] = useState(false);

  const handleloading = (time) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, time);
  };

  useEffect(() => {
    if (!contentRef.current) return;

    const scrollHeight = contentRef.current.scrollHeight;

    if (isExpanded) {
      setHeight(`${scrollHeight}px`);
    } else {
      setHeight(`${scrollHeight}px`);

      setTimeout(() => {
        setHeight("13rem");
      }, 10);
    }
  }, [isExpanded]);

  return (
    <div
      ref={contentRef}
      style={{
        height: height,
        overflow: "hidden",
        transition: `height ${isExpanded ? "0.4s" : "0.3s"} ease-in `,
      }}
      className={` outline  outline-[5px] outline-white w-[50rem] grid grid-cols-[58%_41%] gap-7  text-white p-[1.5rem_3rem] font-glavno rounded-[22px] overflow-hidden`}
    >
      <div
        className={`flex flex-col  justify-between row-start-1  ${
          isExpanded ? "gap-4 h-[60%]" : ""
        }`}
      >
        <h2 className=" glavno-nav"> Objavio/la: {value.autor}</h2>
        <div className={`flex justify-between`}>
          <div className="bg-moja_plava-tamna w-[100%]  flex flex-col  justify-center rounded-[13px] outline outline-[2px] outlinr-white">
            <h2
              className={`glavno-nav text-[1.25rem] w-[80%] ml-4 p-[0.5rem_0.7rem]  ${
                isExpanded ? "h-max" : "max-h-[4.5rem] "
              }overflow-hidden`}
            >
              {" "}
              {value.naslov}
            </h2>
          </div>
        </div>
        {isExpanded ? (
          ""
        ) : (
          <div className="flex gap-2 ">
            <p>{formattedDate}</p>
          </div>
        )}
        {isExpanded && (
          <>
            <div className="w-full h-max min-h-72 ">
              <h3 className="glavno-nav text-[1.3rem] mb-2">Sadržaj</h3>
              <div className="bg-moja_plava-tamna min-h-32 max-h-96 overflow-auto p-4 outline outline-[2px] outline-white rounded-[13px]">
                <p>{value.sadrzaj}</p>
              </div>
              <div className="mt-5">
                <p>{formattedDate}</p>
              </div>
            </div>
          </>
        )}
      </div>
      <div
        className={`flex  row-start-1   ${
          isExpanded ? "flex-col  gap-5 justify-between" : "items-center gap-7 "
        } `}
      >
        <div
          className={`flex    ${
            isExpanded ? "flex-col  gap-4 justify-between" : " h-full "
          } `}
        >
          <div
            className={`rounded-[13px] overflow-hidden outline outline-[2px] outline-white transition-[margin] delay-100 duration-700 ${
              isExpanded
                ? "w-full aspect-square max-h-[22rem] mt-2"
                : loading
                ? "w-[11rem] max-h-[10rem]"
                : "w-[11rem] h-full"
            }`}
            style={
              isExpanded
                ? {
                    transitionProperty: "width, max-height",
                    transitionDuration: "500ms, 300ms",
                    transitionTimingFunction: "ease-in-out",
                    transitionDelay: "100ms, 100ms",
                  }
                : {
                    transitionProperty: "width, max-height",
                    transitionDuration: "100ms, 100ms",
                    transitionTimingFunction: "ease-out",
                    transitionDelay: "0, 0",
                  }
            }
          >
            <img
              className={`object-cover transition-all duration-[250ms] mb-8 ease-out w-full h-full `}
              srcSet={`${endpointUrl}${value.slika}`}
              alt=""
            />
          </div>
        </div>
        <div
          onClick={() => {
            setIsExpanded((prev) => !prev);
            if (isExpanded) {
              handleloading(400);
            }
          }}
          className={`w-[60px] h-[60px]  hover:cursor-pointer hover:scale-105 transition-all duration-500  ease-in-out ${
            isExpanded ? "self-end" : ""
          }`}
        >
          <img
            className={`w-full h-full transition-transform duration-[700ms] delay-200 ease-in-out ${
              isExpanded ? "rotate-180" : ""
            }`}
            srcSet="logo/expand.svg"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default ListNovosti;
