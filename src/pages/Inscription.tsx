import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../services/api";

type Departement = "JAD" | "ASC" | "AHC" | "Enfants et ados";
type Groupe =
  | "Groupe musical"
  | "EDL"
  | "Chorale fon"
  | "Chorale francaise"
  | "Groupe de netoyage"
  | "Evangelisation"
  | "Mission";

const DEPARTEMENTS: Departement[] = ["JAD", "ASC", "AHC", "Enfants et ados"];
const GROUPES: Groupe[] = [
  "Groupe musical",
  "EDL",
  "Chorale fon",
  "Chorale francaise",
  "Groupe de netoyage",
  "Evangelisation",
  "Mission",
];

export default function Inscription() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [departement, setDepartement] = useState<Departement>("JAD");
  const [groupesSel, setGroupesSel] = useState<Groupe[]>([]);
  const [profession, setProfession] = useState("");
  const [telephone, setTelephone] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [adresse, setAdresse] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function toggleGroupe(g: Groupe) {
    setGroupesSel((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (groupesSel.length === 0) {
      setError("Selectionnez au moins un groupe");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("nom", nom);
    formData.append("prenom", prenom);
    formData.append("departement", departement);
    formData.append("groupes", groupesSel.join(","));
    formData.append("profession", profession);
    formData.append("telephone", telephone);
    formData.append("date_naissance", dateNaissance);
    formData.append("adresse", adresse);
    if (photo) formData.append("photo", photo);

    try {
      const { data } = await axios.post(
        `${API_URL}/api/inscriptions`,
        formData
      );
      setSuccess(data.message);
      setNom("");
      setPrenom("");
      setDepartement("JAD");
      setGroupesSel([]);
      setProfession("");
      setTelephone("");
      setDateNaissance("");
      setAdresse("");
      setPhoto(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-base-200 py-6 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-5">
          <h1 className="text-2xl font-bold">AD AKASSATO</h1>
          <p className="text-xs opacity-60">Inscription d'un nouveau membre</p>
        </div>

        <div className="bg-base-100 rounded-lg border border-base-300 p-5 animate-pop-in">
          <p className="text-xs opacity-70 mb-4">
            Remplissez ce formulaire. Votre inscription sera validee par un
            administrateur.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Nom *"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="input input-sm input-bordered"
                required
              />
              <input
                type="text"
                placeholder="Prenom *"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className="input input-sm input-bordered"
                required
              />

              <select
                value={departement}
                onChange={(e) => setDepartement(e.target.value as Departement)}
                className="select select-sm select-bordered"
              >
                {DEPARTEMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Profession"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="input input-sm input-bordered"
              />
              <input
                type="tel"
                placeholder="Telephone"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className="input input-sm input-bordered"
              />
              <input
                type="date"
                value={dateNaissance}
                onChange={(e) => setDateNaissance(e.target.value)}
                className="input input-sm input-bordered"
              />
              <input
                type="text"
                placeholder="Adresse"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                className="input input-sm input-bordered sm:col-span-2"
              />
            </div>

            <div className="mt-1">
              <p className="text-xs font-semibold opacity-70 mb-2">
                Groupes * (plusieurs possibles)
              </p>
              <div className="flex flex-wrap gap-1.5">
                {GROUPES.map((g) => (
                  <label
                    key={g}
                    className={`cursor-pointer px-2.5 py-1 rounded-full border text-xs transition ${
                      groupesSel.includes(g)
                        ? "bg-primary text-primary-content border-primary"
                        : "bg-base-100 border-base-300 hover:bg-base-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={groupesSel.includes(g)}
                      onChange={() => toggleGroupe(g)}
                    />
                    {g}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold opacity-70 mb-1">
                Photo (facultatif)
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                className="file-input file-input-sm file-input-bordered w-full"
              />
            </div>

            {error && (
              <div className="text-xs text-error bg-error/10 rounded px-3 py-2 animate-fade-in">
                {error}
              </div>
            )}
            {success && (
              <div className="text-xs text-success bg-success/10 rounded px-3 py-2 animate-fade-in">
                {success}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-sm btn-primary mt-1"
              disabled={loading}
            >
              {loading ? "Envoi..." : "Envoyer ma demande"}
            </button>

            <Link
              to="/login"
              className="text-center text-xs opacity-60 hover:opacity-100 hover:underline"
            >
              Espace administrateur
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
