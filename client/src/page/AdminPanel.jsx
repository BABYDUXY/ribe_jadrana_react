import { useContext, useEffect, useState } from "react";
import { useLogin } from "../kontekst/loginContext";
import { Link, useNavigate } from "react-router-dom";
import Navigacija from "../components/Navigacija";
import Footer from "../components/Footer";
import { EndpointUrlContext } from "../kontekst/EndpointUrlContext";
import RibaTable from "../components/RibaTable";
import AdminObjave from "../components/AdminObjave";
import DodavanjeStavkiAdmin from "../components/DodavanjeStavkiAdmin";
import OdabirRibe from "../components/OdabirRibe";

function AdminPanel() {
  const { endpointUrl, backendData } = useContext(EndpointUrlContext);
  const { logout } = useLogin();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [choice, setChoice] = useState("ribe");
  const [izmjena, setIzmjena] = useState(null);
  const [ribaId, setRibaId] = useState(null);
  const [ribaData, setRibaData] = useState(null);
  const [clanakData, setClanakData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [urediId, setUrediId] = useState(null);
  const [selectedItemData, setSelectedItemData] = useState(null);

  useEffect(() => {
    setUrediId(null);
    setSelectedItemData(null);
  }, [choice]);

  useEffect(() => {
    if (!urediId) {
      setSelectedItemData(null);
      return;
    }

    const getEndpointForChoice = (choice) => {
      switch (choice) {
        case "članci":
          return `/clanci`;
        case "oprema":
          return `/admin/oprema/${urediId}`;
        default:
          return null;
      }
    };

    const endpoint = getEndpointForChoice(choice);
    if (!endpoint) return;

    setLoading(true);

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    if ((choice !== "ribe", choice !== "članci")) {
      const token = sessionStorage.getItem("token");
      if (token) {
        requestOptions.headers["Authorization"] = `Token ${token}`;
      }
    }

    fetch(`${endpointUrl}${endpoint}`, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setSelectedItemData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(`Greška kod dohvata podataka za ${choice}:`, err);
        setSelectedItemData(null);
        setLoading(false);
      });
  }, [urediId, choice, endpointUrl]);

  useEffect(() => {
    if (!ribaId || !Array.isArray(backendData) || izmjena !== "uredi") return;

    const odabranaRiba = backendData.find((r) => r.ID === Number(ribaId));
    setRibaData(odabranaRiba || null);
  }, [ribaId, backendData, izmjena]);

  useEffect(() => {
    if (!urediId || !Array.isArray(selectedItemData) || izmjena !== "uredi")
      return;

    const odabranClanak = selectedItemData.find(
      (r) => r.ID === Number(urediId)
    );
    setClanakData(odabranClanak || null);
  }, [urediId, selectedItemData]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    fetch(`${endpointUrl}/api/provjeri-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
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

  function convertTableToFormFields(columns) {
    return columns.map((col) => {
      let type = "text";

      if (col.type === "unit") {
        type = "number";
      }

      if (col.type === "range") {
        type = "text";
      }

      if (col.field === "slika") {
        type = "file";
      }

      if (col.field === "opis") {
        type = "textarea";
      }

      if (col.field === "sadrzaj") {
        type = "textarea";
      }

      return {
        name: col.field,
        label: col.label || col.field,
        type,
      };
    });
  }

  const handleChoiceChange = (newChoice) => {
    setChoice(newChoice);
    setIzmjena(null); // Reset izmjena when changing choice
  };

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

  if (user && user.uloga !== "admin") {
    navigate("/");
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
        field: "min_dubina",
        label: "min_dubina",
        unit: "m",
        cellClass: "w-auto text-nowrap",
        sortable: true,
      },
      {
        field: "max_dubina",
        label: "max_dubina",
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
        render: (item) => "••••••••",
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

  const opremaTableConfig = {
    columns: [
      {
        field: "brend",
        label: "Brend",
        sortable: true,
      },
      {
        field: "model",
        label: "Model",
        sortable: true,
      },
      {
        field: "tip",
        label: "Tip",
        sortable: true,
      },
      {
        field: "link",
        label: "Link",
        type: "link",
        sortable: false,
        render: (item) => (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="underline "
          >
            {item.link}
          </a>
        ),
      },
    ],
  };

  const clanciTableConfig = {
    columns: [
      {
        field: "ID",
        label: "ID",
        sortable: true,
      },
      {
        field: "autor",
        label: "Autor",
        sortable: true,
      },
      {
        field: "kategorija",
        label: "Kategorija",
        sortable: true,
      },
      {
        field: "naslov",
        label: "Naslov",
        sortable: true,
      },
      {
        field: "sadrzaj",
        label: "Sadržaj",
        type: "truncate",
        truncateClass: "max-w-md truncate",
        sortable: false,
      },
      {
        field: "slika",
        label: "Slika",
        type: "image",
        sortable: false,
        render: (item) => (
          <img
            src={`${endpointUrl}${item.slika}`}
            alt="slika"
            className="object-cover w-24 h-16 rounded-md shadow"
          />
        ),
      },
      {
        field: "datum",
        label: "Datum",
        type: "datetime",
        sortable: true,
        render: (item) => new Date(item.datum).toLocaleString("hr-HR"),
      },
    ],
  };

  const formFieldsRibe = convertTableToFormFields(fishTableConfig.columns);
  const formFieldsClanci = convertTableToFormFields(clanciTableConfig.columns);
  const formFieldsKorisnici = convertTableToFormFields(
    korisnikTableConfig.columns
  );
  const formFieldsOprema = convertTableToFormFields(opremaTableConfig.columns);

  formFieldsRibe.push({
    name: "otrovna",
    label: "Otrovna",
    type: "checkbox",
  });

  const getFormFieldsAndUrl = () => {
    switch (choice) {
      case "ribe":
        return {
          fields: formFieldsRibe,
          submitUrl: "/api/novariba",
        };
      case "članci":
        return {
          fields: formFieldsClanci,
          editUrl: `/admin/clanci/${urediId}/`,
          submitUrl: "/admin/noviclanak",
          data: selectedItemData,
        };
      case "korisnici":
        return {
          fields: formFieldsKorisnici,
          editUrl: `/admin/korisnici/${urediId}/`,
          submitUrl: "/admin/korisnici",
          data: selectedItemData,
        };
      case "oprema":
        return {
          fields: formFieldsOprema,
          editUrl: `/admin/oprema/${urediId}/`,
          submitUrl: "/admin/oprema",
          data: selectedItemData,
        };
      default:
        return { fields: [], editUrl: "", submitUrl: "", data: null };
    }
  };

  const { fields, editUrl, submitUrl, data } = getFormFieldsAndUrl();

  return (
    <div className="flex flex-col min-h-screen">
      <Navigacija />
      <div className="flex justify-center flex-1 text-white">
        <div className="w-[90%] mt-6 ">
          <ul className="flex justify-center gap-5 text-lg font-glavno [&>li]:outline [&>li]:outline-2 [&>li]:outline-white [&>li]:w-[6rem] [&>li]:rounded-[11px] [&>li]:text-center [&>li]:py-1 [&>li:hover]:w-[6.5rem] [&>li]:cursor-pointer">
            <li
              onClick={() => handleChoiceChange("ribe")}
              className="form-btn-hover"
            >
              Ribe
            </li>
            <li
              onClick={() => handleChoiceChange("korisnici")}
              className="form-btn-hover"
            >
              Korisnici
            </li>
            <li
              onClick={() => handleChoiceChange("članci")}
              className="form-btn-hover"
            >
              članci
            </li>
            <li
              onClick={() => handleChoiceChange("objave")}
              className="form-btn-hover"
            >
              objave
            </li>
            <li
              onClick={() => handleChoiceChange("oprema")}
              className="form-btn-hover"
            >
              oprema
            </li>
            <li
              onClick={() => handleChoiceChange("upiti")}
              className="form-btn-hover"
            >
              upiti
            </li>
          </ul>
          {choice === "ribe" ? (
            <>
              <RibaTable
                tableConfig={fishTableConfig}
                endpoint="/"
                navigateUrlTemplate="/fish/{id}"
                searchField="ime"
                searchPlaceholder="Pretraži po imenu..."
                rowsPerPage={10}
                highlightCondition={(item) => item.otrovna}
                highlightClass="text-red-200"
                setUrediId={setUrediId}
              />
              <div className="flex items-center justify-center w-full gap-12 [&>button:hover]:underline my-8">
                <button
                  onClick={() => {
                    setIzmjena("novo");
                  }}
                  className="glavno-nav"
                >
                  Dodaj Novu
                </button>
                <button
                  onClick={() => {
                    setIzmjena("uredi");
                  }}
                  className="glavno-nav"
                >
                  {" "}
                  Uredi
                </button>
              </div>
              <div className="flex justify-center mb-10 align-center">
                {izmjena === "novo" ? (
                  <DodavanjeStavkiAdmin
                    title="Ribu"
                    submitUrl={submitUrl}
                    fields={fields}
                  />
                ) : (
                  ""
                )}{" "}
                {izmjena === "uredi" && (
                  <div className="flex flex-col items-center gap-6">
                    <OdabirRibe onSelect={setRibaId} defaultValue={null} />
                    {ribaId && (
                      <DodavanjeStavkiAdmin
                        title="Ribu"
                        editUrl={`/api/updateribe/${ribaId}`}
                        isEdit={true}
                        defaultValues={ribaData}
                        fields={formFieldsRibe}
                      />
                    )}
                  </div>
                )}
              </div>
            </>
          ) : choice === "korisnici" ? (
            <>
              <RibaTable
                tableConfig={korisnikTableConfig}
                endpoint="/admin/korisnici"
                searchField="korisnicko_ime"
                searchPlaceholder="Pretraži po imenu"
                rowsPerPage={10}
                secure={true}
                setUrediId={setUrediId}
              />

              <div className="flex justify-center mb-10 align-center">
                {izmjena === "novo" ? (
                  <DodavanjeStavkiAdmin
                    title="Korisnika"
                    submitUrl={submitUrl}
                    fields={fields}
                  />
                ) : (
                  ""
                )}
                {izmjena === "uredi" && (
                  <div className="flex flex-col items-center gap-6">
                    {urediId ? (
                      loading ? (
                        <p>Učitavanje...</p>
                      ) : (
                        <DodavanjeStavkiAdmin
                          title="Korisnika"
                          editUrl={editUrl}
                          isEdit={true}
                          defaultValues={data}
                          fields={fields}
                        />
                      )
                    ) : (
                      <p>Pritisni na korisnika u tablici za uređivanje</p>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : choice === "članci" ? (
            <>
              <RibaTable
                tableConfig={clanciTableConfig}
                endpoint="/admin/clanci"
                searchField="kategorija"
                searchPlaceholder="Pretraži po kategoriji"
                rowsPerPage={10}
                secure={true}
                setUrediId={setUrediId}
              />
              <div className="flex items-center justify-center w-full gap-12 [&>button:hover]:underline my-8">
                <button
                  onClick={() => {
                    setIzmjena("novo");
                  }}
                  className="glavno-nav"
                >
                  Dodaj Novi
                </button>
                <button
                  onClick={() => {
                    setIzmjena("uredi");
                  }}
                  className="glavno-nav"
                >
                  Uredi
                </button>
              </div>
              <div className="flex justify-center mb-10 align-center">
                {izmjena === "novo" ? (
                  <DodavanjeStavkiAdmin
                    title="članak"
                    submitUrl={submitUrl}
                    fields={fields}
                  />
                ) : (
                  ""
                )}
                {izmjena === "uredi" && (
                  <div className="flex flex-col items-center gap-6">
                    {urediId ? (
                      loading ? (
                        <p>Učitavanje...</p>
                      ) : (
                        <DodavanjeStavkiAdmin
                          title="članak"
                          editUrl={editUrl}
                          isEdit={true}
                          defaultValues={clanakData}
                          fields={fields}
                        />
                      )
                    ) : (
                      <p>Pritisni na članak u tablici za uređivanje</p>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : choice === "objave" ? (
            <AdminObjave />
          ) : choice === "oprema" ? (
            <>
              <RibaTable
                tableConfig={opremaTableConfig}
                endpoint="/admin/oprema"
                searchField="model"
                searchPlaceholder="Pretraži po modelu"
                rowsPerPage={10}
                secure={true}
                setUrediId={setUrediId}
              />
              <div className="flex items-center justify-center w-full gap-12 [&>button:hover]:underline my-8">
                <button
                  onClick={() => {
                    setIzmjena("novo");
                  }}
                  className="glavno-nav"
                >
                  Dodaj Novu
                </button>
                <button
                  onClick={() => {
                    setIzmjena("uredi");
                  }}
                  className="glavno-nav"
                >
                  Uredi
                </button>
              </div>
              <div className="flex justify-center mb-10 align-center">
                {izmjena === "novo" ? (
                  <DodavanjeStavkiAdmin
                    title="Opremu"
                    submitUrl={submitUrl}
                    fields={fields}
                  />
                ) : (
                  ""
                )}
                {izmjena === "uredi" && (
                  <div className="flex flex-col items-center gap-6">
                    {urediId ? (
                      loading ? (
                        <p>Učitavanje...</p>
                      ) : (
                        <DodavanjeStavkiAdmin
                          title="Opremu"
                          editUrl={editUrl}
                          isEdit={true}
                          defaultValues={data}
                          fields={fields}
                        />
                      )
                    ) : (
                      <p>Pritisni na opremu u tablici za uređivanje</p>
                    )}
                  </div>
                )}
              </div>
            </>
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
