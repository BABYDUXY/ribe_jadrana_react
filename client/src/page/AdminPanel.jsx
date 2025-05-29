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
  const [user, setUser] = useState(null); // ✅ useState instead of let

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
        console.log("KORISNIK:", data);
        setUser(data); // ✅ Update state
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

  // Ako je admin
  return (
    <div className="flex flex-col min-h-screen">
      <Navigacija />
      <div className="flex justify-center flex-1 text-white">
        <div className="w-[90%] mt-6 ">
          <ul className="flex justify-center gap-5 text-lg font-glavno [&>li]:outline [&>li]:outline-2 [&>li]:outline-white [&>li]:w-[6rem] [&>li]:rounded-[11px] [&>li]:text-center [&>li]:py-1 [&>li:hover]:w-[6.5rem] [&>li]:cursor-pointer">
            <li className="form-btn-hover">Ribe</li>
            <li className="form-btn-hover">Korisnici</li>
            <li className="form-btn-hover">članci</li>
            <li className="form-btn-hover">objave</li>
            <li className="form-btn-hover">oprema</li>
            <li className="form-btn-hover">upiti</li>
          </ul>
          <RibaTable />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminPanel;
