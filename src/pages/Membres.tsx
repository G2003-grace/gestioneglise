import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { API_URL } from "../services/api";
import Spinner from "../components/Spinner";

type Departement = "JAD" | "ASC" | "AHC" | "Enfants et ados";
type Groupe =
  | "Groupe musical"
  | "EDL"
  | "Chorale fon"
  | "Chorale francaise"
  | "Groupe de netoyage"
  | "Evangelisation"
  | "Mission";

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
  groupes: string;
  fonction: Fonction | null;
  profession: string | null;
  telephone: string | null;
  date_naissance: string | null;
  adresse: string | null;
  photo: string | null;
}

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

function parseGroupes(val: string | null | undefined): string[] {
  if (!val) return [];
  return val.split(",").filter(Boolean);
}

export default function Membres() {
  const [membres, setMembres] = useState<Membre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [departement, setDepartement] = useState<Departement>("JAD");
  const [groupesSel, setGroupesSel] = useState<Groupe[]>([]);
  const [profession, setProfession] = useState("");
  const [telephone, setTelephone] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [adresse, setAdresse] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  const [filtreDep, setFiltreDep] = useState<string>("");
  const [recherche, setRecherche] = useState("");

  async function fetchMembres() {
    try {
      const { data } = await api.get<Membre[]>("/membres");
      setMembres(data);
    } catch {
      setError("Impossible de charger les membres");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMembres();
  }, []);

  function toggleGroupe(g: Groupe) {
    setGroupesSel((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  }

  function resetForm() {
    setNom("");
    setPrenom("");
    setDepartement("JAD");
    setGroupesSel([]);
    setProfession("");
    setTelephone("");
    setDateNaissance("");
    setAdresse("");
    setPhoto(null);
    setEditId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nom || !prenom) return;
    if (groupesSel.length === 0) {
      alert("Selectionnez au moins un groupe");
      return;
    }

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
      if (editId !== null) {
        await api.put(`/membres/${editId}`, formData);
      } else {
        await api.post("/membres", formData);
      }
      resetForm();
      setFormulaireOuvert(false);
      fetchMembres();
    } catch (err: any) {
      alert(err.response?.data?.message || "Erreur lors de l'enregistrement");
    }
  }

  function editMembre(m: Membre) {
    setNom(m.nom);
    setPrenom(m.prenom);
    setDepartement(m.departement);
    setGroupesSel(parseGroupes(m.groupes) as Groupe[]);
    setProfession(m.profession || "");
    setTelephone(m.telephone || "");
    setDateNaissance(m.date_naissance ? m.date_naissance.substring(0, 10) : "");
    setAdresse(m.adresse || "");
    setPhoto(null);
    setEditId(m.id);
    setFormulaireOuvert(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteMembre(id: number) {
    if (!confirm("Supprimer ce membre ?")) return;
    try {
      await api.delete(`/membres/${id}`);
      fetchMembres();
    } catch {
      alert("Erreur lors de la suppression");
    }
  }

  const membresFiltres = membres.filter((m) => {
    const matchDep = !filtreDep || m.departement === filtreDep;
    const matchRech =
      !recherche ||
      `${m.nom} ${m.prenom}`.toLowerCase().includes(recherche.toLowerCase());
    return matchDep && matchRech;
  });

  if (loading) return <Spinner />;
  if (error)
    return (
      <div className="text-error text-sm bg-error/10 rounded px-3 py-2">
        {error}
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">Membres</h2>
          <p className="text-xs opacity-60">{membres.length} enregistres</p>
        </div>
        <button
          onClick={() => {
            if (formulaireOuvert) resetForm();
            setFormulaireOuvert(!formulaireOuvert);
          }}
          className="btn btn-sm btn-primary"
        >
          {formulaireOuvert ? "Fermer" : "+ Ajouter un membre"}
        </button>
      </div>

      {formulaireOuvert && (
        <form
          onSubmit={handleSubmit}
          className="bg-base-100 border border-base-300 rounded-lg p-4 mb-4 animate-slide-down"
        >
          <h3 className="font-semibold text-sm mb-3">
            {editId !== null ? "Modifier un membre" : "Nouveau membre"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              className="file-input file-input-sm file-input-bordered"
            />
          </div>

          <div className="mt-3">
            <p className="text-xs font-semibold opacity-70 mb-1.5">
              Groupes *
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

          <div className="flex gap-2 mt-4">
            <button type="submit" className="btn btn-sm btn-primary">
              {editId !== null ? "Enregistrer" : "Ajouter"}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setFormulaireOuvert(false);
              }}
              className="btn btn-sm btn-ghost"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        <input
          type="text"
          placeholder="Rechercher par nom ou prenom"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          className="input input-sm input-bordered grow"
        />
        <select
          value={filtreDep}
          onChange={(e) => setFiltreDep(e.target.value)}
          className="select select-sm select-bordered"
        >
          <option value="">Tous les departements</option>
          {DEPARTEMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-base-100 border border-base-300 rounded-lg overflow-x-auto">
        <table className="table table-sm">
          <thead className="bg-base-200 text-xs">
            <tr>
              <th></th>
              <th>Nom</th>
              <th>Prenom</th>
              <th>Dep.</th>
              <th>Groupes</th>
              <th>Profession</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="stagger">
            {membresFiltres.map((m) => (
              <tr key={m.id} className="hover:bg-base-200/60 transition-colors">
                <td>
                  {m.photo ? (
                    <img
                      src={`${API_URL}/uploads/${m.photo}`}
                      alt={m.nom}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center text-[10px] font-semibold">
                      {m.prenom[0]}
                      {m.nom[0]}
                    </div>
                  )}
                </td>
                <td className="font-medium">{m.nom}</td>
                <td>{m.prenom}</td>
                <td>
                  <span className="badge badge-xs badge-primary">
                    {m.departement}
                  </span>
                </td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {parseGroupes(m.groupes).map((g) => (
                      <span
                        key={g}
                        className="badge badge-xs badge-ghost"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="text-xs opacity-80">{m.profession || "-"}</td>
                <td>
                  <div className="flex gap-1 justify-end">
                    <Link
                      to={`/membres/${m.id}`}
                      className="btn btn-xs btn-ghost"
                    >
                      Profil
                    </Link>
                    <button
                      onClick={() => editMembre(m)}
                      className="btn btn-xs btn-ghost"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => deleteMembre(m.id)}
                      className="btn btn-xs btn-ghost text-error"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {membresFiltres.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-xs opacity-50">
                  Aucun membre
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
