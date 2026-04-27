import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth, type Role } from "../context/AuthContext";
import Spinner from "../components/Spinner";

interface Admin {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
  date_creation: string;
}

export default function Administrateurs() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [role, setRole] = useState<Role>("diacre");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  async function fetchAdmins() {
    try {
      const { data } = await api.get<Admin[]>("/administrateurs");
      setAdmins(data);
    } catch {
      setError("Impossible de charger les administrateurs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAdmins();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    try {
      await api.post("/administrateurs", {
        nom,
        prenom,
        email,
        mot_de_passe: motDePasse,
        role,
      });
      setFormSuccess(`${role === "pasteur" ? "Pasteur" : "Diacre"} ajoute`);
      setNom("");
      setPrenom("");
      setEmail("");
      setMotDePasse("");
      setRole("diacre");
      fetchAdmins();
      setTimeout(() => {
        setFormSuccess("");
        setFormulaireOuvert(false);
      }, 1500);
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Erreur");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Supprimer cet administrateur ?")) return;
    try {
      await api.delete(`/administrateurs/${id}`);
      fetchAdmins();
    } catch (err: any) {
      alert(err.response?.data?.message || "Erreur");
    }
  }

  if (loading) return <Spinner />;
  if (error)
    return (
      <div className="text-error text-sm bg-error/10 rounded px-3 py-2">
        {error}
      </div>
    );

  const nbDiacres = admins.filter((a) => a.role === "diacre").length;
  const isPasteur = user?.role === "pasteur";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">Administrateurs</h2>
          <p className="text-xs opacity-60">
            {admins.length} enregistres &middot; {nbDiacres}/5 diacres
          </p>
        </div>
        {isPasteur && (
          <button
            onClick={() => setFormulaireOuvert(!formulaireOuvert)}
            className="btn btn-sm btn-primary"
          >
            {formulaireOuvert ? "Fermer" : "+ Ajouter"}
          </button>
        )}
      </div>

      {isPasteur && formulaireOuvert && (
        <form
          onSubmit={handleSubmit}
          className="bg-base-100 border border-base-300 rounded-lg p-4 mb-4 animate-slide-down"
        >
          <h3 className="font-semibold text-sm mb-3">
            Nouvel administrateur
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
            <input
              type="email"
              placeholder="Email *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-sm input-bordered"
              required
            />
            <input
              type="password"
              placeholder="Mot de passe *"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              className="input input-sm input-bordered"
              required
              minLength={6}
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="select select-sm select-bordered"
            >
              <option value="diacre">Diacre</option>
              <option value="pasteur">Pasteur</option>
            </select>
          </div>

          {formError && (
            <div className="text-xs text-error bg-error/10 rounded px-3 py-2 mt-3 animate-fade-in">
              {formError}
            </div>
          )}
          {formSuccess && (
            <div className="text-xs text-success bg-success/10 rounded px-3 py-2 mt-3 animate-fade-in">
              {formSuccess}
            </div>
          )}

          <div className="flex gap-2 mt-3">
            <button type="submit" className="btn btn-sm btn-primary">
              Ajouter
            </button>
            <button
              type="button"
              onClick={() => setFormulaireOuvert(false)}
              className="btn btn-sm btn-ghost"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="bg-base-100 border border-base-300 rounded-lg overflow-x-auto">
        <table className="table table-sm">
          <thead className="bg-base-200 text-xs">
            <tr>
              <th>Nom</th>
              <th>Prenom</th>
              <th>Email</th>
              <th>Role</th>
              <th>Cree le</th>
              {isPasteur && <th className="text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="stagger">
            {admins.map((a) => (
              <tr key={a.id} className="hover:bg-base-200/60 transition-colors">
                <td className="font-medium">{a.nom}</td>
                <td>{a.prenom}</td>
                <td className="text-xs">{a.email}</td>
                <td>
                  <span
                    className={`badge badge-xs ${
                      a.role === "pasteur" ? "badge-primary" : "badge-ghost"
                    }`}
                  >
                    {a.role}
                  </span>
                </td>
                <td className="text-xs opacity-70">
                  {new Date(a.date_creation).toLocaleDateString("fr-FR")}
                </td>
                {isPasteur && (
                  <td className="text-right">
                    {a.role !== "pasteur" && (
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="btn btn-xs btn-ghost text-error"
                      >
                        Supprimer
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
