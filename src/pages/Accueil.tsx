import { Link } from "react-router-dom";

export default function Accueil() {
  return (
    <div className="min-h-screen bg-base-200 animate-fade-in">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-900 via-purple-900 to-fuchsia-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15),transparent_50%)]" />

        <div className="relative max-w-5xl mx-auto px-6 py-20 sm:py-28 text-center text-white">
          <img
            src="/logo-ad.jpeg"
            alt="Logo AD AKASSATO"
            className="h-28 sm:h-36 w-auto mx-auto mb-6 drop-shadow-2xl animate-fade-in"
          />

          <div className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs uppercase tracking-widest mb-6 animate-fade-in">
            Assemblees de Dieu
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight animate-fade-in">
            Bienvenue a l'eglise des Assemblees de Dieu
            <br />
            Temple la{" "}
            <span className="text-amber-300">&laquo; BENEDICTION &raquo;</span>
            <br />
            d'<span className="text-amber-300">AKASSATO</span>
          </h1>

          <div className="mt-6 animate-fade-in">
            <p className="italic text-amber-200/90 text-lg sm:text-xl font-semibold tracking-wide">
              &laquo; Toujours en avant, jamais en arriere &raquo;
            </p>
            <p className="text-xs uppercase tracking-[0.3em] opacity-60 mt-1">
              Notre devise
            </p>
          </div>

          <p className="mt-8 text-base sm:text-lg max-w-2xl mx-auto opacity-90 animate-fade-in">
            Ici nous formons une famille unie en Jesus-Christ,
            <br className="hidden sm:block" /> ou l'amour regne.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center animate-fade-in">
            <Link
              to="/inscription"
              className="btn btn-lg bg-amber-400 hover:bg-amber-300 text-purple-900 border-0 shadow-lg hover:scale-105 transition-transform"
            >
              Devenir membre
            </Link>
            <Link
              to="/login"
              className="btn btn-lg btn-ghost text-white border border-white/30 hover:bg-white/10"
            >
              Espace administrateur
            </Link>
          </div>
        </div>

        {/* vague blanche en bas */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
        >
          <path
            d="M0,32 C360,80 1080,0 1440,48 L1440,80 L0,80 Z"
            className="fill-base-200"
          />
        </svg>
      </section>

      {/* VERSET */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <svg
          className="w-10 h-10 mx-auto text-primary opacity-30 mb-4"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
        </svg>
        <p className="text-xl sm:text-2xl italic font-light leading-relaxed">
          Car la ou deux ou trois sont assembles en mon nom,
          <br className="hidden sm:block" />
          je suis au milieu d'eux.
        </p>
        <p className="mt-4 text-sm opacity-60 tracking-widest uppercase">
          Matthieu 18:20
        </p>
      </section>

      {/* DEPARTEMENTS */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Nos departements</h2>
          <p className="opacity-60 mt-2">
            Quatre familles, une seule eglise
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 stagger">
          <DepartementCard
            nom="JAD"
            titre="Jeunesse Assemblee de Dieu"
            phrase="Jeune force, jeune espoir. Nous relevons les defis de notre temps en comptant sur Christ."
            couleur="from-purple-600 to-indigo-600"
            icone={
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            }
          />
          <DepartementCard
            nom="ASC"
            titre="Association des Servantes de Christ"
            phrase="Nous sommes des femmes, meres dans l'eglise, et le Seigneur compte sur nous."
            couleur="from-pink-500 to-rose-500"
            icone={
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            }
          />
          <DepartementCard
            nom="AHC"
            titre="Association des Hommes en Christ"
            phrase="Hommes, piliers de l'eglise."
            couleur="from-blue-700 to-cyan-600"
            icone={
              <path d="M12 2L4 6v6c0 5 3.4 9.4 8 10 4.6-.6 8-5 8-10V6l-8-4z" />
            }
          />
          <DepartementCard
            nom="Enfants & Ados"
            titre="La releve de l'eglise"
            phrase="La releve qui grandit dans la sagesse et dans la grace."
            couleur="from-amber-500 to-orange-500"
            icone={
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            }
          />
        </div>
      </section>

      {/* VALEURS */}
      <section className="bg-base-100 border-y border-base-300">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Ce que vous trouverez</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 stagger">
            <Valeur
              titre="Communion fraternelle"
              phrase="Partagez la foi avec une famille qui vous accueille a bras ouverts."
              icone={
                <path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              }
            />
            <Valeur
              titre="Chorales & groupes"
              phrase="Musique, evangelisation, mission : trouvez le groupe qui vous inspire."
              icone={
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              }
            />
            <Valeur
              titre="Croissance spirituelle"
              phrase="Etudiez la Parole et grandissez dans la foi au sein d'une communaute vivante."
              icone={
                <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1z" />
              }
            />
          </div>
        </div>
      </section>

      {/* CONTACT PASTEUR */}
      <section className="max-w-3xl mx-auto px-6 py-14">
        <div className="relative rounded-2xl overflow-hidden bg-linear-to-br from-indigo-900 via-purple-900 to-fuchsia-900 text-white p-8 sm:p-10 text-center shadow-xl card-hover">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.12),transparent_60%)] pointer-events-none" />
          <div className="relative">
            <div className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] uppercase tracking-widest mb-4">
              Besoin d'ecoute ?
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Le pasteur est a votre ecoute
            </h2>
            <p className="mt-3 opacity-90 max-w-xl mx-auto text-sm sm:text-base">
              Une priere, une question, un soutien ? N'hesitez pas a l'appeler,
              il sera heureux de vous repondre.
            </p>

            <a
              href="tel:+22996945655"
              className="mt-6 inline-flex items-center gap-3 bg-amber-400 hover:bg-amber-300 text-purple-900 font-bold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.1-.03-.21-.05-.31-.05-.26 0-.51.1-.71.29l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.27.36-.66.25-1.01C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z" />
              </svg>
              +229 96 94 56 55
            </a>

            <p className="mt-3 text-xs opacity-70">
              Appuyez sur le numero pour appeler directement
            </p>
          </div>
        </div>
      </section>

      {/* APPEL FINAL */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold">
          Votre place vous attend.
        </h2>
        <p className="mt-3 opacity-70">
          Rejoignez des aujourd'hui la grande famille AD AKASSATO.
        </p>
        <div className="mt-8">
          <Link
            to="/inscription"
            className="btn btn-lg btn-primary shadow-lg hover:scale-105 transition-transform"
          >
            Rejoindre la famille
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-base-300 text-center py-5 text-xs opacity-70">
        <div className="flex items-center justify-center gap-2">
          <img
            src="/logo-ad.jpeg"
            alt="Logo AD"
            className="h-6 w-6 object-contain"
          />
          <p className="font-semibold">AD AKASSATO &middot; Toujours en avant</p>
        </div>
        <p className="opacity-70 mt-1">
          &copy; {new Date().getFullYear()} Tous droits reserves &middot;{" "}
          <Link to="/login" className="hover:underline">
            Admin
          </Link>
        </p>
      </footer>
    </div>
  );
}

function DepartementCard({
  nom,
  titre,
  phrase,
  couleur,
  icone,
}: {
  nom: string;
  titre: string;
  phrase: string;
  couleur: string;
  icone: React.ReactNode;
}) {
  return (
    <div className="card-hover bg-base-100 rounded-xl border border-base-300 overflow-hidden">
      <div className={`h-1.5 bg-linear-to-r ${couleur}`} />
      <div className="p-5">
        <div className="flex items-center gap-3 mb-2">
          <div
            className={`w-10 h-10 rounded-lg bg-linear-to-br ${couleur} flex items-center justify-center text-white`}
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              {icone}
            </svg>
          </div>
          <div>
            <div className="font-bold text-lg leading-tight">{nom}</div>
            <div className="text-xs opacity-60">{titre}</div>
          </div>
        </div>
        <p className="text-sm leading-relaxed opacity-80 italic">
          &laquo; {phrase} &raquo;
        </p>
      </div>
    </div>
  );
}

function Valeur({
  titre,
  phrase,
  icone,
}: {
  titre: string;
  phrase: string;
  icone: React.ReactNode;
}) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          {icone}
        </svg>
      </div>
      <h3 className="font-semibold">{titre}</h3>
      <p className="text-sm opacity-70 mt-1">{phrase}</p>
    </div>
  );
}
