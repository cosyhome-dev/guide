import React from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GuideProvider, LocaleContext, DEFAULT_LOCALE, isLocale } from "@/hooks";
import type { Locale } from "@/hooks";
import GuideSkeleton from "@/components/GuideSkeleton";

/* Code-splitting : chaque page devient son propre chunk (React.lazy +
   import dynamique) au lieu d'un bundle monolithique. */
const GuideAccess = React.lazy(() => import("@/pages/GuideAccess"));
const Login = React.lazy(() => import("@/pages/Login"));
const GuideHome = React.lazy(() => import("@/pages/GuideHome"));
const GuideSection = React.lazy(() => import("@/pages/GuideSection"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));

/* Fallback Suspense discret pour les pages hors guide (attente/login/404) :
   fond neutre plein écran, pas de flash de layout. Les pages guide utilisent
   GuideSkeleton (même squelette que le chargement data de GuideProvider). */
function RouteFallback() {
  return <div className="min-h-screen bg-background" aria-busy="true" />;
}

const queryClient = new QueryClient();

function LocaleLayout() {
  const { locale: localeParam } = useParams<{ locale: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  if (!localeParam || !isLocale(localeParam)) {
    return <Navigate to={`/${DEFAULT_LOCALE}`} replace />;
  }

  const locale = localeParam as Locale;

  const setLocale = React.useCallback(
    (newLocale: Locale) => {
      const newPath = location.pathname.replace(`/${locale}`, `/${newLocale}`);
      navigate(newPath, { replace: true });
    },
    [locale, location.pathname, navigate],
  );

  const value = React.useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return (
    <LocaleContext value={value}>
      <Outlet />
    </LocaleContext>
  );
}

/**
 * Architecture URL guide (sécurité par double secret) :
 *
 *   /:locale/                       → GuideAccess (message d'attente,
 *                                      AUCUN formulaire — empêche le
 *                                      brute-force de codes)
 *   /:locale/:slug/                 → Login (form code, slug pré-bind
 *                                      à l'URL — la cliente partage
 *                                      l'URL avec slug aux voyageurs)
 *   /:locale/:slug/guide/           → Home guide (auth requise)
 *   /:locale/:slug/guide/:section/  → Section guide (auth requise)
 *
 * Anti-énumération : l'existence d'un slug ne se vérifie plus côté client
 * (l'ancien SlugGuard interrogeait GET /guides?fields=slug publiquement).
 * Le formulaire Login s'affiche pour tout slug ; c'est POST /guides/access
 * (slug + code, réponse générique, rate-limité) qui tranche côté serveur.
 */
function AnimatedRoutes() {
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div key={location.pathname} className="animate-fade-in">
      <React.Suspense fallback={<RouteFallback />}>
        <Routes location={location}>
          <Route path="/" element={<Navigate to={`/${DEFAULT_LOCALE}`} replace />} />
          <Route path="/:locale" element={<LocaleLayout />}>
            <Route index element={<GuideAccess />} />
            <Route path=":slug">
              <Route index element={<Login />} />
              <Route
                path="guide"
                element={
                  <GuideProvider>
                    <React.Suspense fallback={<GuideSkeleton />}>
                      <GuideHome />
                    </React.Suspense>
                  </GuideProvider>
                }
              />
              <Route
                path="guide/:section"
                element={
                  <GuideProvider>
                    <React.Suspense fallback={<GuideSkeleton />}>
                      <GuideSection />
                    </React.Suspense>
                  </GuideProvider>
                }
              />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </React.Suspense>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
