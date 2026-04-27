import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import { cloudinaryUrl } from "../utils/cloudinary";
import Spinner from "../components/Spinner";

interface Media {
  id: number;
  type: "image" | "video";
  fichier: string;
  titre: string | null;
  uploade_par: number | null;
  date_ajout: string;
}

export default function Galerie() {
  const [medias, setMedias] = useState<Media[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  const [fichier, setFichier] = useState<File | null>(null);
  const [titre, setTitre] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [apercu, setApercu] = useState<Media | null>(null);

  async function charger() {
    try {
      const { data } = await api.get<Media[]>("/galerie");
      setMedias(data);
    } catch {
      setErreur("Impossible de charger la galerie");
    } finally {
      setChargement(false);
    }
  }

  useEffect(() => {
    charger();
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!fichier) return;

    const formData = new FormData();
    formData.append("fichier", fichier);
    if (titre.trim()) formData.append("titre", titre.trim());

    setEnvoi(true);
    setErreur(null);
    try {
      const { data } = await api.post<Media>("/galerie", formData);
      setMedias((prev) => [data, ...prev]);
      setFichier(null);
      setTitre("");
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Echec de l'envoi";
      setErreur(msg);
    } finally {
      setEnvoi(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Supprimer ce media ?")) return;
    try {
      await api.delete(`/galerie/${id}`);
      setMedias((prev) => prev.filter((m) => m.id !== id));
    } catch {
      setErreur("Suppression impossible");
    }
  }

  const srcDe = (m: Media) => cloudinaryUrl(m.fichier, m.type);
  const images = medias.filter((m) => m.type === "image");
  const videos = medias.filter((m) => m.type === "video");

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Galerie</h1>
        <p className="text-sm opacity-70">
          Photos et videos des activites de l'eglise.
        </p>
      </div>

      <form
        onSubmit={handleUpload}
        className="bg-base-100 rounded shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-end"
      >
        <div className="flex-1 w-full">
          <label className="block text-xs font-medium mb-1">Fichier (image ou video)</label>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setFichier(e.target.files?.[0] ?? null)}
            className="file-input file-input-sm file-input-bordered w-full"
          />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-xs font-medium mb-1">Titre (optionnel)</label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder="Ex : Culte du dimanche"
            className="input input-sm input-bordered w-full"
          />
        </div>
        <button
          type="submit"
          disabled={!fichier || envoi}
          className="btn btn-sm btn-primary"
        >
          {envoi ? "Envoi..." : "Ajouter"}
        </button>
      </form>

      {erreur && (
        <div className="alert alert-error mb-4 text-sm py-2">{erreur}</div>
      )}

      {chargement ? (
        <Spinner />
      ) : medias.length === 0 ? (
        <div className="border border-dashed rounded p-10 text-center opacity-70">
          Aucun media pour le moment.
        </div>
      ) : (
        <>
          {images.length > 0 && (
            <section className="mb-10">
              <h2 className="text-lg font-semibold mb-3">Photos</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((m) => (
                  <div
                    key={m.id}
                    className="group relative aspect-square overflow-hidden rounded bg-base-300"
                  >
                    <button
                      type="button"
                      onClick={() => setApercu(m)}
                      className="w-full h-full"
                    >
                      <img
                        src={srcDe(m)}
                        alt={m.titre ?? "photo"}
                        className="w-full h-full object-cover transition group-hover:scale-105"
                        loading="lazy"
                      />
                    </button>
                    {m.titre && (
                      <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none">
                        {m.titre}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(m.id)}
                      className="absolute top-1 right-1 btn btn-xs btn-error opacity-0 group-hover:opacity-100 transition"
                      title="Supprimer"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {videos.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3">Videos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((m) => (
                  <div
                    key={m.id}
                    className="relative bg-base-100 rounded shadow-sm overflow-hidden group"
                  >
                    <video
                      src={srcDe(m)}
                      controls
                      preload="metadata"
                      className="w-full aspect-video bg-black"
                    />
                    <div className="flex items-center justify-between px-3 py-2 text-sm">
                      <span className="font-medium truncate">
                        {m.titre ?? "Video"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDelete(m.id)}
                        className="btn btn-xs btn-error"
                        title="Supprimer"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {apercu && apercu.type === "image" && (
        <div
          onClick={() => setApercu(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <img
            src={srcDe(apercu)}
            alt={apercu.titre ?? "apercu"}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}
