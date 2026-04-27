import { useEffect, useState } from "react";
import api, { API_URL } from "../services/api";
import Spinner from "../components/Spinner";

interface Inscription {
  id: number;
  nom: string;
  prenom: string;
  departement: string;
  groupes: string;
  profession: string | null;
  telephone: string | null;
  date_naissance: string | null;
  adresse: string | null;
  photo: string | null;
  date_ajout: string;
}

function parseGroupes(val: string | null | undefined): string[] {
  if (!val) return [];
  return val.split(",").filter(Boolean);
}

export default function Inscriptions() {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetch() {
    try {
      const { data } = await api.get<Inscription[]>("/inscriptions");
      setInscriptions(data);
    } catch {
      setError("Impossible de charger les inscriptions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetch();
  }, []);

  async function valider(id: number) {
    try {
      await api.put(`/inscriptions/${id}/valider`);
      fetch();
    } catch {
      alert("Erreur lors de la validation");
    }
  }

  async function rejeter(id: number) {
    if (!confirm("Rejeter cette inscription ?")) return;
    try {
      await api.delete(`/inscriptions/${id}`);
      fetch();
    } catch {
      alert("Erreur lors du rejet");
    }
  }

  if (loading) return <Spinner />;
  if (error)
    return (
      <div className="text-error text-sm bg-error/10 rounded px-3 py-2">
        {error}
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          Inscriptions en attente
          {inscriptions.length > 0 && (
            <span className="badge badge-sm badge-warning">
              {inscriptions.length}
            </span>
          )}
        </h2>
      </div>

      {inscriptions.length === 0 ? (
        <div className="bg-base-100 border border-base-300 rounded-lg p-8 text-center text-sm opacity-50">
          Aucune inscription en attente
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 stagger">
          {inscriptions.map((i) => (
            <div
              key={i.id}
              className="bg-base-100 border border-base-300 rounded-lg p-3 card-hover"
            >
              <div className="flex gap-3">
                {i.photo ? (
                  <img
                    src={`${API_URL}/uploads/${i.photo}`}
                    alt={i.nom}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-base-300 flex items-center justify-center text-lg font-semibold shrink-0">
                    {i.prenom[0]}
                    {i.nom[0]}
                  </div>
                )}
                <div className="grow min-w-0">
                  <h3 className="font-semibold text-sm">
                    {i.prenom} {i.nom}
                  </h3>
                  <div className="flex gap-1 flex-wrap mt-1 mb-1.5">
                    <span className="badge badge-xs badge-primary">
                      {i.departement}
                    </span>
                    {parseGroupes(i.groupes).map((g) => (
                      <span key={g} className="badge badge-xs badge-ghost">
                        {g}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs opacity-70 space-y-0.5">
                    {i.profession && <div>{i.profession}</div>}
                    {i.telephone && <div>{i.telephone}</div>}
                    {i.date_naissance && (
                      <div>
                        Ne(e) le{" "}
                        {new Date(i.date_naissance).toLocaleDateString("fr-FR")}
                      </div>
                    )}
                    {i.adresse && <div className="truncate">{i.adresse}</div>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => valider(i.id)}
                  className="btn btn-xs btn-success flex-1"
                >
                  Valider
                </button>
                <button
                  onClick={() => rejeter(i.id)}
                  className="btn btn-xs btn-ghost text-error flex-1"
                >
                  Rejeter
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
