import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { API_URL } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

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
  departement: string;
  groupes: string;
  fonction: Fonction | null;
  profession: string | null;
  telephone: string | null;
  date_naissance: string | null;
  adresse: string | null;
  photo: string | null;
  date_ajout: string;
}

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

function parseGroupes(val: string | null | undefined): string[] {
  if (!val) return [];
  return val.split(",").filter(Boolean);
}

export default function MembreProfil() {
  const { id } = useParams();
  const { user } = useAuth();
  const [membre, setMembre] = useState<Membre | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get(`/membres/${id}`)
      .then((r) => setMembre(r.data))
      .catch(() => setError("Membre introuvable"))
      .finally(() => setLoading(false));
  }, [id]);

  async function changerFonction(nouvelle: Fonction | "") {
    if (!membre) return;
    setSaving(true);
    setMessage("");
    try {
      const { data } = await api.put(`/membres/${membre.id}/fonction`, {
        fonction: nouvelle,
      });
      setMembre(data);
      setMessage("Fonction mise a jour");
      setTimeout(() => setMessage(""), 2500);
    } catch (err: any) {
      alert(err.response?.data?.message || "Erreur");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner />;
  if (error || !membre)
    return (
      <div className="text-error text-sm bg-error/10 rounded px-3 py-2">
        {error || "Erreur"}
      </div>
    );

  const isPasteur = user?.role === "pasteur";

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/membres" className="btn btn-xs btn-ghost mb-3">
        &larr; Retour
      </Link>

      <div className="bg-base-100 border border-base-300 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="shrink-0">
            {membre.photo ? (
              <img
                src={`${API_URL}/uploads/${membre.photo}`}
                alt={membre.nom}
                className="w-28 h-28 rounded-lg object-cover"
              />
            ) : (
              <div className="w-28 h-28 rounded-lg bg-base-300 flex items-center justify-center text-2xl font-bold">
                {membre.prenom[0]}
                {membre.nom[0]}
              </div>
            )}
          </div>

          <div className="grow">
            <h2 className="text-xl font-bold">
              {membre.prenom} {membre.nom}
            </h2>
            <div className="flex gap-1 flex-wrap mt-1.5 mb-4">
              <span className="badge badge-sm badge-primary">
                {membre.departement}
              </span>
              {parseGroupes(membre.groupes).map((g) => (
                <span key={g} className="badge badge-sm badge-ghost">
                  {g}
                </span>
              ))}
              {membre.fonction && (
                <span className="badge badge-sm badge-accent">
                  {LIBELLE_FONCTION[membre.fonction]}
                </span>
              )}
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <InfoRow label="Profession" value={membre.profession} />
              <InfoRow label="Telephone" value={membre.telephone} />
              <InfoRow
                label="Date de naissance"
                value={
                  membre.date_naissance
                    ? new Date(membre.date_naissance).toLocaleDateString(
                        "fr-FR"
                      )
                    : null
                }
              />
              <InfoRow label="Adresse" value={membre.adresse} />
              <InfoRow
                label="Enregistre le"
                value={new Date(membre.date_ajout).toLocaleDateString("fr-FR")}
              />
            </dl>
          </div>
        </div>

        {isPasteur && (
          <div className="mt-5 pt-4 border-t border-base-300">
            <h3 className="text-sm font-semibold mb-1">
              Comite elargi - {membre.departement}
            </h3>
            <p className="text-xs opacity-60 mb-2">
              Designer {membre.prenom} comme responsable
            </p>
            <div className="flex flex-wrap gap-2 items-center">
              <select
                value={membre.fonction || ""}
                onChange={(e) =>
                  changerFonction(e.target.value as Fonction | "")
                }
                disabled={saving}
                className="select select-sm select-bordered"
              >
                <option value="">Aucune fonction</option>
                {FONCTIONS.map((f) => (
                  <option key={f} value={f}>
                    {LIBELLE_FONCTION[f]}
                  </option>
                ))}
              </select>
              {message && (
                <span className="text-success text-xs animate-fade-in">
                  {message}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs opacity-50">{label}</dt>
      <dd className="font-medium">{value || "-"}</dd>
    </div>
  );
}
