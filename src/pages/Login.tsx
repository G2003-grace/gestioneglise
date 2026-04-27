import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, motDePasse);
      navigate("/membres");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="w-full max-w-sm bg-base-100 rounded-lg border border-base-300 p-6 animate-pop-in">
        <div className="text-center mb-5">
          <h1 className="text-xl font-bold">AD AKASSATO</h1>
          <p className="text-xs opacity-60">Connexion administrateur</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-sm input-bordered w-full"
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            className="input input-sm input-bordered w-full"
            required
          />

          {error && (
            <div className="text-xs text-error bg-error/10 rounded px-3 py-2 animate-fade-in">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-sm btn-primary"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <Link
            to="/inscription"
            className="text-center text-xs opacity-60 hover:opacity-100 hover:underline mt-1"
          >
            Nouveau membre ? S'inscrire
          </Link>
        </form>
      </div>
    </div>
  );
}
