import React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { EndpointUrlContext } from "../kontekst/EndpointUrlContext";
import { useState, useRef, useEffect } from "react";
import { useLogin } from "../kontekst/loginContext";

function ListObjava({ value, refreshPosts }) {
  const date = new Date(value.datum_kreiranja);
  const { endpointUrl } = useContext(EndpointUrlContext);
  const contentRef = useRef(null);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getUTCFullYear();
  const [isExpanded, setIsExpanded] = useState(false);
  const defaultLink = "#";
  const [height, setHeight] = useState("13rem");
  const formattedDate = `${day}.${month}.${year}.`;
  const [reaction, setReaction] = useState(null);
  const { user } = useLogin();
  const [reactionCount, setReactionCount] = useState({
    likes: value.broj_lajkova,
    dislikes: value.broj_dislajkova,
  });
  const [komentar, setKomentar] = useState("");
  const [komentari, setKomentari] = useState(value.komentari);
  const [loading, setLoading] = useState(false);
  const [toggleSharePost, setToggleSharePost] = useState(false);

  const handleloading = (time) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, time);
  };

  useEffect(() => {
    const fetchUserReaction = async () => {
      try {
        const res = await fetch(`${endpointUrl}/api/ocjene/${value.ID}`, {
          headers: {
            Authorization: `Token ${sessionStorage.getItem("token")}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.reaction === true) setReaction("like");
          else if (data.reaction === false) setReaction("dislike");
          else setReaction(null);
        }
      } catch (err) {
        console.error("Error fetching reaction:", err);
      }
    };
    if (user) {
      fetchUserReaction();
    }
  }, [user]);

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

  const handleMoreOptionsPost = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setTimeout(() => {
        setToggleSharePost(true);
      }, 300);
    } else {
      setToggleSharePost((prev) => !prev);
    }
  };

  const handleKomentar = async () => {
    try {
      const res = await fetch(`${endpointUrl}/api/komentar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          objava_id: value.ID,
          tekst: komentar,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(
          "Greška pri slanju komentara:",
          data.poruka || res.statusText
        );
        return;
      }

      if (data.poruka) {
        console.log("Server response:", data.poruka);
      }
      refreshPosts();
      setKomentar("");
    } catch (err) {
      console.error("Došlo je do greške:", err);
    }
  };

  const handleReaction = async (newReaction) => {
    const prevReaction = reaction; // Save before state change
    let method;
    let pozitivno;
    let updatedReaction;

    if (prevReaction === newReaction) {
      method = "DELETE";
      updatedReaction = null;
    } else if (prevReaction === null) {
      method = "POST";
      pozitivno = newReaction === "like";
      updatedReaction = newReaction;
    } else {
      method = "PUT";
      pozitivno = newReaction === "like";
      updatedReaction = newReaction;
    }

    setReactionCount((prev) => {
      let likes = prev.likes;
      let dislikes = prev.dislikes;

      if (prevReaction === "like") likes -= 1;
      if (prevReaction === "dislike") dislikes -= 1;

      if (updatedReaction === "like") likes += 1;
      if (updatedReaction === "dislike") dislikes += 1;

      return { likes, dislikes };
    });

    // Set new reaction state
    setReaction(updatedReaction);

    const res = await fetch(`${endpointUrl}/api/ocjene`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        objava_id: value.ID,
        pozitivno,
      }),
    });

    if (!res.ok) {
      console.error("Failed to send reaction");
    }
  };
  return value.naslov && value?.status === "pending" ? (
    <div
      ref={contentRef}
      style={{
        height: height,
        overflow: "hidden",
        transition: `height ${isExpanded ? "0.4s" : "0.3s"} ease-in`,
      }}
      className={` outline outline-[5px] outline-white  w-[50rem]  gap-7  grid text-white p-[1.5rem_3rem] font-glavno rounded-[22px] overflow-hidden `}
    >
      <div
        className={`flex flex-col  justify-between row-start-1   ${
          isExpanded ? "gap-4" : ""
        }`}
      >
        <h2 className=" glavno-nav"> Objavio/la: {value.autor}</h2>
        <div className={`flex flex-col `}>
          <div className="flex items-center justify-between">
            <div
              className={`bg-moja_plava-tamna w-[80%] grid p-4 ${
                isExpanded ? "grid-cols-[40%_60%] " : "grid-cols-2"
              }   rounded-[13px] outline outline-[2px] outline-white`}
            >
              <div className="self-start">
                <p>{formattedDate}</p>
                <h3 className="glavno-nav text-[1.3rem] font-bold ">
                  Naslov: {value.naslov}
                </h3>
              </div>
              {isExpanded ? (
                <h4 className="glavno-nav text-[1.3rem] font-semibold  col-start-1 row-start-2  text-center">
                  Sadržaj:
                </h4>
              ) : (
                ""
              )}
              <div
                className={`col-start-2 gap-2 overflow-auto ${
                  isExpanded ? "max-h-[15rem] row-span-2" : "max-h-[4.4rem]"
                }`}
              >
                {isExpanded ? (
                  ""
                ) : (
                  <h4 className="glavno-nav text-[1.3rem] font-semibold  ">
                    Sadržaj:
                  </h4>
                )}{" "}
                <p className="">{value.opis_objave}</p>
              </div>
            </div>
            <div
              onClick={() => {
                setIsExpanded((prev) => !prev);
                if (isExpanded) {
                  handleloading(400);
                }
              }}
              className={`w-[60px] h-[60px] hover:cursor-pointer hover:scale-105 transition-all duration-500 col-start-2  ease-in-out ${
                isExpanded ? "self-end" : ""
              }`}
            >
              <img
                className={`w-full h-full transition-transform duration-700 delay-200 ease-in-out ${
                  isExpanded ? "rotate-180" : ""
                }`}
                srcSet="logo/expand.svg"
                alt=""
              />
            </div>
          </div>
        </div>
        {isExpanded ? (
          ""
        ) : (
          <div className="flex gap-2 ">
            <img className="w-[20px]" srcSet="/logo/like.svg" alt="" />
            <p className="mb-[-0.3rem] ">{reactionCount.likes}</p>
          </div>
        )}
        {isExpanded && (
          <>
            <div className="w-[80%] h-max ">
              <h3 className="glavno-nav text-[1.3rem] mb-2">Komentari:</h3>
              <div className="bg-moja_plava-tamna outline outline-[2px] p-4 outline-white rounded-[13px]  ">
                <div className="overflow-auto max-h-28">
                  {komentari.map((komentar, index) => (
                    <p key={komentar.id || index} className="leading-relaxed ">
                      <span className="font-semibold">
                        {komentar.korisnicko_ime}:
                      </span>{" "}
                      {`"${komentar.tekst}"`}
                    </p>
                  ))}
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    className="w-full mt-1 text-sm text-white transition-all duration-300 ease-in-out bg-transparent border-b-2 opacity-70 placeholder:text-white focus:ring-0 focus:outline-none focus:opacity-100 focus:placeholder:text-gray-300 focus:mt-2 focus:text-base"
                    placeholder="Napiši komentar..."
                    onChange={(e) => setKomentar(e.target.value)}
                    value={komentar}
                  />
                  <img
                    className={`absolute right-0 top-0 cursor-pointer w-0 h-full opacity-0 transition-all duration-300 ease-in-out group-focus-within:w-[40px] group-focus-within:opacity-100 hover:translate-x-1 px-2.5 z-10 `}
                    alt=""
                    srcSet="logo/strelica-send.svg"
                    onClick={() => {
                      if (!user && komentar) {
                        alert("Moraš biti prijavljen!");
                        setKomentar("");
                      } else if (user && komentar) {
                        handleKomentar();
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div
        className={`flex    ${
          isExpanded ? "flex-col gap-4 justify-between" : " hidden"
        } `}
      >
        {isExpanded && (
          <div className="flex self-center gap-2 text-lg font-glavno">
            <img
              className="w-[27px] mt-[-0.7rem] cursor-pointer"
              srcSet={
                reaction === "like"
                  ? "/logo/full-like.svg"
                  : "/logo/empty-like.svg"
              }
              alt="Like"
              onClick={() => {
                if (user) {
                  handleReaction("like");
                } else {
                  alert("Moraš biti prijavljen!");
                }
              }}
            />
            <p className="mb-[-0.5rem] mr-4 ">{reactionCount.likes}</p>
            <img
              className="w-[27px] rotate-180 cursor-pointer"
              srcSet={
                reaction === "dislike"
                  ? "/logo/full-like.svg"
                  : "/logo/empty-like.svg"
              }
              alt="Dislike"
              onClick={() => {
                if (user) {
                  handleReaction("dislike");
                } else {
                  alert("Moraš biti prijavljen");
                }
              }}
            />
            <p className="mb-[0.3rem] ">{reactionCount.dislikes}</p>
          </div>
        )}
      </div>
    </div>
  ) : !value.naslov && value?.status === "pending" ? (
    <div
      ref={contentRef}
      style={{
        height: height,
        overflow: "hidden",
        transition: `height ${isExpanded ? "0.4s" : "0.3s"} ease-in `,
      }}
      className={` outline outline-[5px] outline-white   w-[50rem] grid grid-cols-[58%_41%] gap-7   text-white p-[1.5rem_3rem] font-glavno rounded-[22px] overflow-hidden`}
    >
      <div
        className={`flex flex-col justify-between row-start-1 ${
          isExpanded ? "gap-4" : ""
        }`}
      >
        <h2 className=" glavno-nav"> Objavio/la: {value.autor}</h2>
        <div className={`flex justify-between`}>
          <div className="bg-moja_plava-tamna w-[47%]  flex flex-col  justify-center rounded-[13px] outline outline-[2px] outlinr-white">
            <div className="py-2 ml-5">
              <Link
                to={`/fish/${value.id_ribe}`}
                className="glavno-nav text-[1.3rem] font-bold underline"
              >
                Riba: {value.ime_ribe}
              </Link>
              <p className="-mt-1 text-base font-medium">
                Težina: {value.tezina} kg
              </p>
            </div>
          </div>
          <div className="bg-moja_plava-tamna w-[47%]   flex flex-col  justify-center rounded-[13px] outline outline-[2px] outline-white">
            <div className="py-2 ml-5">
              <p className="text-lg font-medium">Lokacija: {value.mjesto}</p>
              <p className="-mt-1 text-sm ">{formattedDate}</p>
            </div>
          </div>
        </div>
        {isExpanded ? (
          ""
        ) : (
          <div className="flex gap-2 ">
            <img className="w-[20px]" srcSet="/logo/like.svg" alt="" />
            <p className="mb-[-0.3rem] ">{reactionCount.likes}</p>
          </div>
        )}
        {isExpanded && (
          <>
            <div className="w-full h-max">
              <h3 className="glavno-nav text-[1.3rem] mb-2">Oprema:</h3>
              <div className="bg-moja_plava-tamna outline outline-[2px] outline-white rounded-[13px]">
                <ul className="flex flex-col gap-2 p-4 glavno-small [&>li]:font-semibold [&>li>a]:ml-1">
                  <li>
                    Štap:{" "}
                    {value.link[0] != "#" ? (
                      <Link
                        className="font-normal underline"
                        to={value.link[0]}
                      >
                        {" "}
                        {value.kombinirani_model[0]}
                      </Link>
                    ) : (
                      <Link to={defaultLink} className="font-normal underline">
                        {value.kombinirani_model[0]}
                      </Link>
                    )}
                  </li>
                  <li>
                    Rola:{" "}
                    {value.link[1] ? (
                      <Link
                        className="font-normal underline"
                        to={value.link[1]}
                      >
                        {" "}
                        {value.kombinirani_model[1]}
                      </Link>
                    ) : (
                      <Link to={defaultLink} className="font-normal underline">
                        {value.kombinirani_model[1]}
                      </Link>
                    )}
                  </li>
                  <li>
                    Mamac:{" "}
                    {value.link[2] ? (
                      <Link
                        className="font-normal underline"
                        to={value.link[2]}
                      >
                        {" "}
                        {value.mamac}
                      </Link>
                    ) : (
                      <Link to={defaultLink} className="font-normal underline">
                        {value.mamac}
                      </Link>
                    )}
                  </li>
                  {value.opis ? (
                    <li className="overflow-auto max-h-32">
                      Opis:{" "}
                      <span className="ml-1 font-normal">{value.opis}</span>
                    </li>
                  ) : (
                    ""
                  )}
                </ul>
              </div>
            </div>
            <div className="w-full h-max ">
              <h3 className="glavno-nav text-[1.3rem] mb-2">Komentari:</h3>
              <div className="bg-moja_plava-tamna outline outline-[2px] p-4 outline-white rounded-[13px]  ">
                <div className="overflow-auto max-h-28">
                  {komentari.map((komentar, index) => (
                    <p key={index} className="leading-relaxed ">
                      <span className="font-semibold">
                        {komentar.korisnicko_ime}:
                      </span>{" "}
                      {`"${komentar.tekst}"`}
                    </p>
                  ))}
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    className="w-full mt-1 text-sm text-white transition-all duration-300 ease-in-out bg-transparent border-b-2 opacity-70 placeholder:text-white focus:ring-0 focus:outline-none focus:opacity-100 focus:placeholder:text-gray-300 focus:mt-2 focus:text-base"
                    placeholder="Napiši komentar..."
                    onChange={(e) => setKomentar(e.target.value)}
                    value={komentar}
                  />
                  <img
                    className={`absolute right-0 top-0 cursor-pointer w-0 h-full opacity-0 transition-all duration-300 ease-in-out group-focus-within:w-[40px] group-focus-within:opacity-100 hover:translate-x-1 px-2.5 z-10 `}
                    alt=""
                    srcSet="logo/strelica-send.svg"
                    onClick={() => {
                      if (!user && komentar) {
                        alert("Moraš biti prijavljen!");
                        setKomentar("");
                      } else if (user && komentar) {
                        handleKomentar(); // Make sure this is a function you're importing or defining
                      }
                      console.log(komentar);
                    }}
                  />
                </div>
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
              className={`object-cover transition-all duration-[250ms] ease-out w-full h-full `}
              srcSet={`${endpointUrl}${value.slika_direktorij}`}
              alt=""
            />
          </div>
          {isExpanded && (
            <div className="flex self-center gap-2 text-lg font-glavno">
              <img
                className="w-[27px] mt-[-0.7rem] cursor-pointer"
                srcSet={
                  reaction === "like"
                    ? "/logo/full-like.svg"
                    : "/logo/empty-like.svg"
                }
                alt="Like"
                onClick={() => {
                  if (user) {
                    handleReaction("like");
                  } else {
                    alert("Moraš biti prijavljen!");
                  }
                }}
              />
              <p className="mb-[-0.5rem] mr-4 ">{reactionCount.likes}</p>
              <img
                className="w-[27px] rotate-180 cursor-pointer"
                srcSet={
                  reaction === "dislike"
                    ? "/logo/full-like.svg"
                    : "/logo/empty-like.svg"
                }
                alt="Dislike"
                onClick={() => {
                  if (user) {
                    handleReaction("dislike");
                  } else {
                    alert("Moraš biti prijavljen");
                  }
                }}
              />
              <p className="mb-[0.3rem] ">{reactionCount.dislikes}</p>
            </div>
          )}
        </div>
        <div
          onClick={() => {
            setIsExpanded((prev) => !prev);
            if (isExpanded) {
              handleloading(400);
            }
          }}
          className={`w-[60px] h-[60px] hover:cursor-pointer hover:scale-105 transition-all duration-500  ease-in-out ${
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
  ) : !value?.status ? (
    <div
      ref={contentRef}
      style={{
        height: height,
        overflow: "hidden",
        transition: `height ${isExpanded ? "0.4s" : "0.3s"} ease-in`,
      }}
      className={` outline outline-[5px] outline-white  w-[50rem] grid grid-cols-[58%_41%] gap-7   text-white p-[1.5rem_3rem] font-glavno rounded-[22px] overflow-hidden`}
    >
      <div
        className={`flex flex-col justify-between row-start-1 ${
          isExpanded ? "gap-4" : ""
        }`}
      >
        <h2 className=" glavno-nav"> Objavio/la: {value.autor}</h2>
        <div className={`flex justify-between`}>
          <div className="bg-moja_plava-tamna w-[47%]  flex flex-col  justify-center rounded-[13px] outline outline-[2px] outlinr-white">
            <div className="py-2 ml-5">
              <Link
                to={`/fish/${value.id_ribe}`}
                className="glavno-nav text-[1.3rem] font-bold underline"
              >
                Riba: {value.ime_ribe}
              </Link>
              <p className="-mt-1 text-base font-medium">
                Težina: {value.tezina} kg
              </p>
            </div>
          </div>
          <div className="bg-moja_plava-tamna w-[47%]   flex flex-col  justify-center rounded-[13px] outline outline-[2px] outline-white">
            <div className="py-2 ml-5">
              <p className="text-lg font-medium">Lokacija: {value.mjesto}</p>
              <p className="-mt-1 text-sm ">{formattedDate}</p>
            </div>
          </div>
        </div>
        {isExpanded ? (
          ""
        ) : (
          <div className="flex gap-2 ">
            <img
              className={`w-[30px] hover:scale-110 transition-all duration-300 cursor-pointer ease-in-out ${
                toggleSharePost ? "rotate-90" : "rotate-0"
              }`}
              srcSet="/logo/three_dots.svg"
              alt=""
              onClick={() => {
                handleMoreOptionsPost();
              }}
            />
          </div>
        )}
        {isExpanded && (
          <>
            <div className="w-full h-max">
              <h3 className="glavno-nav text-[1.3rem] mb-2">Oprema:</h3>
              <div className="bg-moja_plava-tamna outline outline-[2px] outline-white rounded-[13px]">
                <ul className="flex flex-col gap-2 p-4 glavno-small [&>li]:font-semibold [&>li>a]:ml-1">
                  <li>
                    Štap:{" "}
                    {value.link[0] != "#" ? (
                      <Link
                        className="font-normal underline"
                        to={value.link[0]}
                      >
                        {" "}
                        {value.kombinirani_model[0]}
                      </Link>
                    ) : (
                      <Link to={defaultLink} className="font-normal underline">
                        {value.kombinirani_model[0]}
                      </Link>
                    )}
                  </li>
                  <li>
                    Rola:{" "}
                    {value.link[1] ? (
                      <Link
                        className="font-normal underline"
                        to={value.link[1]}
                      >
                        {" "}
                        {value.kombinirani_model[1]}
                      </Link>
                    ) : (
                      <Link to={defaultLink} className="font-normal underline">
                        {value.kombinirani_model[1]}
                      </Link>
                    )}
                  </li>
                  <li>
                    Mamac:{" "}
                    {value.link[2] ? (
                      <Link
                        className="font-normal underline"
                        to={value.link[2]}
                      >
                        {" "}
                        {value.mamac}
                      </Link>
                    ) : (
                      <Link to={defaultLink} className="font-normal underline">
                        {value.mamac}
                      </Link>
                    )}
                  </li>
                  {value.opis ? (
                    <li className="overflow-auto max-h-32">
                      Opis:{" "}
                      <span className="ml-1 font-normal">{value.opis}</span>
                    </li>
                  ) : (
                    ""
                  )}
                </ul>
              </div>
            </div>
            <div className="flex items-center w-full h-20 gap-10 py-10 ">
              <img
                className={`w-[30px] hover:scale-110 transition-all duration-300 cursor-pointer ease-in-out ${
                  toggleSharePost ? "rotate-90" : "rotate-0"
                }`}
                srcSet="/logo/three_dots.svg"
                alt=""
                onClick={() => {
                  handleMoreOptionsPost();
                }}
              />
              <div
                className={`bg-moja_plava-tamna outline outline-[2px] transition-all duration-700 ease-in-out p-4 px-8 outline-white rounded-[22px]  flex  items-center ${
                  toggleSharePost
                    ? "translate-x-0 opacity-100  h-10"
                    : "translate-x-20 opacity-0  h-0 cursor-default"
                }`}
              >
                <ul
                  draggable="false"
                  className="flex gap-4 [&>li:hover]:underline [&>li]:transition-all [&>li]:duration-300 [&>li]:ease-in-out [&>li]:cursor-pointer"
                >
                  {" "}
                  <li draggable="false">Uredi</li> <li>Pošalji</li>
                  <li draggable="false">Obriši</li>
                  <li draggable="false">Objavi</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
      <div
        className={`flex  row-start-1    ${
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
              className={`object-cover transition-all duration-[250ms] ease-out w-full h-full `}
              srcSet={`${endpointUrl}${value.slika_direktorij}`}
              alt=""
            />
          </div>
        </div>
        <div
          onClick={() => {
            setIsExpanded((prev) => !prev);
            if (isExpanded) {
              handleloading(600);
              setToggleSharePost(false);
            }
          }}
          className={`w-[60px] h-[60px] hover:cursor-pointer hover:scale-105 transition-all duration-500  ease-in-out ${
            isExpanded ? "self-end" : ""
          }`}
        >
          <img
            className={`w-full h-full transition-transform duration-700 delay-200 ease-in-out ${
              isExpanded ? "rotate-180" : ""
            }`}
            srcSet="logo/expand.svg"
            alt=""
          />
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}

export default ListObjava;
