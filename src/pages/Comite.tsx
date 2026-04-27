import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { API_URL } from "../services/api";
import Spinner from "../components/Spinner";

type Departement = "JAD" | "ASC" | "AHC" | "Enfants et ados";
type Fonction =
  | "president"
  | "vice_president"
  | "secretaire"
  | "tresorier"
  | "organisateur";

interface Membre {
  id: number;
  nom: string;
  prenom: string;
  departement: Departement;
  fonction: Fonction | null;
  profession: string | null;
  telephone: string | null;
  photo: string | null;
}

const DEPARTEMENTS: Departement[] = ["JAD", "ASC", "AHC", "Enfants et ados"];
const FONCTIONS: Fonction[] = [
  "president",
  "vice_president",
  "secretaire",
  "tresorier",
  "organisateur",
];

const LIBELLE_FONCTION: Record<Fonction, string> = {
  president: "President",
  vice_president: "Vice-President",
  secretaire: "Secretaire",
  tresorier: "Tresorier",
  organisateur: "Organisateur",
};

export default function Comite() {
  const [membres, setMembres] = useState<Membre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<Membre[]>("/membres")
      .then((r) => setMembres(r.data))
      .catch(() => setError("Impossible de charger les membres"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error)
    return (
      <div className="text-error text-sm bg-error/10 rounded px-3 py-2">
        {error}
      </div>
    );

  const responsables = membres.filter((m) => m.fonction);
  const total = DEPARTEMENTS.length * FONCTIONS.length;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Comite elargi</h2>
        <p className="text-xs opacity-60">
          {responsables.length} / {total} postes pourvus
        </p>
      </div>

      <div className="space-y-4 stagger">
        {DEPARTEMENTS.map((dep) => {
          const parFonction = FONCTIONS.map((f) => ({
            fonction: f,
            membre: membres.find(
              (m) => m.departement === dep && m.fonction === f
            ),
          }));

          return (
            <div
              key={dep}
              className="bg-base-100 border border-base-300 rounded-lg p-4"
            >
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <span>{dep}</span>
                <span className="text-xs opacity-50 font-normal">
                  {parFonction.filter((p) => p.membre).length} /{" "}
                  {FONCTIONS.length}
                </span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {parFonction.map(({ fonction, membre }) => (
                  <div
                    key={fonction}
                    className="border border-base-300 rounded-lg p-2.5 flex flex-col items-center text-center card-hover"
                  >
                    <div className="text-[10px] uppercase opacity-50 font-semibold tracking-wide mb-1.5">
                      {LIBELLE_FONCTION[fonction]}
                    </div>
                    {membre ? (
                      <Link
                        to={`/membres/${membre.id}`}
                        className="flex flex-col items-center group w-full"
                      >
                        {membre.photo ? (
                          <img
                            src={`${API_URL}/uploads/${membre.photo}`}
                            alt={membre.nom}
                            className="w-12 h-12 rounded-full object-cover mb-1.5"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-base-300 flex items-center justify-center text-xs font-semibold mb-1.5">
                            {membre.prenom[0]}
                            {membre.nom[0]}
                          </div>
                        )}
                        <div className="text-xs font-medium group-hover:underline truncate w-full">
                          {membre.prenom} {membre.nom}
                        </div>
                        {membre.telephone && (
                          <div className="text-[10px] opacity-60 truncate w-full">
                            {membre.telephone}
                          </div>
                        )}
                      </Link>
                    ) : (
                      <div className="opacity-30 text-xs py-3">Vacant</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
