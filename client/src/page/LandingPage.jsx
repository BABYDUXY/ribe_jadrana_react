import React, { useRef, useState } from "react";
import Navigacija from "../components/Navigacija";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import AnimatedWave from "../components/AnimatedWave";
import BouncingArrow from "../components/BouncingArrow";
import KarticaSaIkonom from "../components/KarticaSaIkonom";

function LandingPage() {
  const navigate = useNavigate();
  const lowerSectionRef = useRef(null);

  const ribe = {
    naslov: "Pregled riba",
    opis: "Istražite raznoliki svijet riba u jadranskome moru. Uz detaljne informacije koje se uvijek ažuriraju da budu točne i aktualne proširite svoje znanje. Podaci su prikupljeni iz raznih knjiga o živom svijetu jadranskoga mora i raznih online izvora. ",
    ikona: "riba_ikona.svg",
    cta: "Pregledaj katalog riba",
    link: "/ribe",
  };

  const zajednica = {
    naslov: "Zajednica ribolovaca",
    opis: "Dijelite svoje ulove, razmjenjujte iskustva i savjete s drugim članovima. Pregledajte objave drugih ribolovaca, komentirajte i budite dio aktivne zajednice. Imate ideju ili prijedlog za poboljšanje? Slobodno se obratite administratoru – zajednički gradimo bolje iskustvo za sve ljubitelje ribolova!",
    ikona: "zajednica_ikona.svg",
    cta: "Pogledaj objave",
    link: "/ulovi",
  };

  const novosti = {
    naslov: "Najnovije novosti",
    opis: "Saznajte sve o promjenama u zakonima, novim vrstama u Jadranu, lovostajima, ekološkim temama i drugim važnim informacijama koje bi svaki ribolovac trebao znati. Pratite novosti na vrijeme, budite informirani i spremni na sve što more donosi.",
    ikona: "novine_ikona.svg",
    cta: "Pogledaj novosti",
    link: "/novosti",
  };

  const privatni = {
    naslov: "Privatna galerija ulova",
    opis: "Spremite svoje ribolovne uspjehe na sigurno mjesto, potpuno privatno i dostupno samo vama. Pratite koliko ste napredovali, gdje ste bili najuspješniji i kako vam se sezona razvija iz godine u godinu. Pojedine ulove možete podijeliti s prijateljima putem posebnog linka – vi odlučujete što dijelite i s kim.",
    ikona: "slike_ikona.svg",
    cta: "Unesi novi ulov",
    link: "/mojiulovi",
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigacija />
      <div className="flex flex-col items-center justify-center w-1/2 m-[0_auto] mt-20 text-center text-white  glavno-nav">
        <h1 className="text-[1.7rem] font-bold mb-4">
          <span className="!text-[2rem]">Ribe Jadrana</span>: "Gdje more postaje
          strast"
        </h1>{" "}
        <h3 className="text-[1.15rem]">
          Vaš vodič kroz morski svijet Jadrana. Istražite ribe, podijelite svoje
          ulove, povežite se s ostalim ribolovcima i uhvatite val najnovijih
          vijesti iz morskog svijeta.
        </h3>
        <div
          onClick={() => {
            lowerSectionRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "end",
            });
          }}
          className="z-20 flex flex-col items-center justify-center mt-20 -mb-32 cursor-pointer"
        >
          <p className="mb-2 ">Otkrij Više</p>
          <BouncingArrow />
        </div>
      </div>
      <div className=" relative flex justify-center items-end min-h-[80rem]   mt-[3rem]">
        <div
          ref={lowerSectionRef}
          className="overflow-hidden w-[120%] max-h-[80rem]  absolute"
        >
          <AnimatedWave />
        </div>
        <div className="absolute z-20 w-auto mb-32 h-max">
          {" "}
          <div className="flex justify-between gap-12 mb-12">
            <KarticaSaIkonom objekt={ribe} />
            <KarticaSaIkonom objekt={zajednica} />
          </div>
          <div className="flex justify-between">
            <KarticaSaIkonom objekt={novosti} />
            <KarticaSaIkonom objekt={privatni} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default LandingPage;
