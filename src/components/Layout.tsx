import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [nbAttente, setNbAttente] = useState(0);

  useEffect(() => {
    let active = true;
    async function charger() {
      try {
        const { data } = await api.get<unknown[]>("/inscriptions");
        if (active) setNbAttente(data.length);
      } catch {
        // silencieux
      }
    }
    charger();
    const id = setInterval(charger, 30000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-2 py-1 rounded text-sm transition ${
      isActive ? "bg-white/20 font-semibold" : "hover:bg-white/10"
    }`;

  return (
    <div className="min-h-screen w-full flex flex-col bg-base-200 text-sm">
      <header className="bg-primary text-primary-content px-4 py-2 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/membres" className="flex items-center gap-2.5 font-bold tracking-wide">
            <span className="bg-white rounded-md p-1 shadow-sm">
              <img
                src="/logo-ad.jpeg"
                alt="Logo AD"
                className="h-7 w-7 object-contain"
              />
            </span>
            AD AKASSATO
          </Link>
          <nav className="flex gap-1">
            <NavLink to="/membres" className={linkClass}>
              Membres
            </NavLink>
            <NavLink to="/inscriptions" className={linkClass}>
              <span className="flex items-center gap-1.5">
                Inscriptions
                {nbAttente > 0 && (
                  <span className="badge badge-xs badge-warning">
                    {nbAttente}
                  </span>
                )}
              </span>
            </NavLink>
            <NavLink to="/comite" className={linkClass}>
              Comite
            </NavLink>
            <NavLink to="/galerie" className={linkClass}>
              Galerie
            </NavLink>
            {user?.role === "pasteur" && (
              <NavLink to="/administrateurs" className={linkClass}>
                Administrateurs
              </NavLink>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="opacity-90">
            {user?.prenom} {user?.nom}
            <span className="opacity-60"> &middot; {user?.role}</span>
          </span>
          <button
            onClick={handleLogout}
            className="btn btn-xs btn-ghost text-primary-content"
          >
            Deconnexion
          </button>
        </div>
      </header>
      <main key={location.pathname} className="grow px-4 py-5 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
}
