import { useContext, useEffect, useState } from "react";
import { useLogin } from "../kontekst/loginContext";
import { Link, useNavigate } from "react-router-dom";
import Navigacija from "../components/Navigacija";
import Footer from "../components/Footer";
import { EndpointUrlContext } from "../kontekst/EndpointUrlContext";
import RibaTable from "../components/RibaTable";

function AdminPanel() {
  const { endpointUrl } = useContext(EndpointUrlContext);
  const { logout } = useLogin();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [choice, setChoice] = useState("ribe");

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/"); // No token, redirect
      return;
    }

    fetch(`${endpointUrl}/api/provjeri-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`, // send token in header
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Token nije važeći");
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error("Greška kod verifikacije tokena:", error);
        sessionStorage.removeItem("token");
        logout();
        navigate("/");
      });
  }, []);

  // Dok čekamo podatke
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigacija />
        <div className="flex items-center justify-center flex-1 text-white">
          Učitavanje...
        </div>
        <Footer />
      </div>
    );
  }

  // Ako korisnik nije admin
  if (user.uloga !== "admin") {
    navigate("/");
    return null;
  }

  const fishTableConfig = {
    columns: [
      {
        field: "ID",
        label: "ID",
        sortable: true,
      },
      {
        field: "ime",
        label: "ime",
        sortable: true,
      },
      {
        field: "ostali_nazivi",
        label: "ostali_nazivi",
        sortable: true,
        type: "truncate",
      },
      {
        field: "lat_ime",
        label: "lat_ime",
        sortable: true,
      },
      {
        field: "vrsta",
        label: "vrsta",
        sortable: true,
      },
      {
        field: "dubina",
        label: "dubina",
        type: "range",
        minField: "min_dubina",
        maxField: "max_dubina",
        unit: "m",
        cellClass: "w-auto text-nowrap",
        sortable: true,
      },
      {
        field: "max_duljina",
        label: "max_duljina",
        type: "unit",
        unit: "cm",
        sortable: true,
      },
      {
        field: "max_tezina",
        label: "max_tezina",
        type: "unit",
        unit: "kg",
        sortable: true,
      },
      {
        field: "opis",
        label: "opis",
        type: "truncate",
        truncateClass: "max-w-xs truncate",
        sortable: true,
      },
      {
        field: "slika",
        label: "slika",
        type: "image",
        alt: "ime",
        imageClass: "w-auto h-12",
        sortable: false,
      },
    ],
  };

  const korisnikTableConfig = {
    columns: [
      {
        field: "ID",
        label: "ID",
        sortable: true,
      },
      {
        field: "korisnicko_ime",
        label: "Korisničko ime",
        sortable: true,
      },
      {
        field: "email",
        label: "Email",
        sortable: true,
      },
      {
        field: "lozinka_hash",
        label: "Lozinka",
        type: "truncate",
        truncateClass: "max-w-xs truncate",
        sortable: false,
        render: (item) => "••••••••", // Hide password hash for security
      },
      {
        field: "datum_kreiranja",
        label: "Datum kreiranja",
        type: "datetime",
        sortable: true,
        render: (item) =>
          new Date(item.datum_kreiranja).toLocaleString("hr-HR"),
      },
      {
        field: "zadnja_imjena",
        label: "Zadnja izmjena",
        type: "datetime",
        sortable: true,
        render: (item) => new Date(item.zadnja_imjena).toLocaleString("hr-HR"),
      },
    ],
  };

  // Ako je admin
  return (
    <div className="flex flex-col min-h-screen">
      <Navigacija />
      <div className="flex justify-center flex-1 text-white">
        <div className="w-[90%] mt-6 ">
          <ul className="flex justify-center gap-5 text-lg font-glavno [&>li]:outline [&>li]:outline-2 [&>li]:outline-white [&>li]:w-[6rem] [&>li]:rounded-[11px] [&>li]:text-center [&>li]:py-1 [&>li:hover]:w-[6.5rem] [&>li]:cursor-pointer">
            <li
              onClick={() => {
                setChoice("ribe");
              }}
              className="form-btn-hover"
            >
              Ribe
            </li>
            <li
              onClick={() => {
                setChoice("korisnici");
              }}
              className="form-btn-hover"
            >
              Korisnici
            </li>
            <li
              onClick={() => {
                setChoice("članci");
              }}
              className="form-btn-hover"
            >
              članci
            </li>
            <li
              onClick={() => {
                setChoice("objave");
              }}
              className="form-btn-hover"
            >
              objave
            </li>
            <li
              onClick={() => {
                setChoice("oprema");
              }}
              className="form-btn-hover"
            >
              oprema
            </li>
            <li
              onClick={() => {
                setChoice("upiti");
              }}
              className="form-btn-hover"
            >
              upiti
            </li>
          </ul>
          {choice === "ribe" ? (
            <RibaTable
              tableConfig={fishTableConfig}
              endpoint="/"
              navigateUrlTemplate="/fish/{id}"
              searchField="ime"
              searchPlaceholder="Pretraži po imenu..."
              rowsPerPage={10}
              highlightCondition={(item) => item.otrovna}
              highlightClass="text-red-200"
            />
          ) : choice === "korisnici" ? (
            <RibaTable
              tableConfig={korisnikTableConfig}
              endpoint="/admin/korisnici" // Adjust to your API endpoint
              //navigateUrlTemplate="" // Optional: if you want clickable rows
              searchField="korisnicko_ime"
              searchPlaceholder="Pretraži po imenu"
              rowsPerPage={10}
              secure={true}
            />
          ) : (
            ""
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminPanel;
