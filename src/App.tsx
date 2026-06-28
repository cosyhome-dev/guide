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
import GuideAccess from "@/pages/GuideAccess";
import Login from "@/pages/Login";
import GuideHome from "@/pages/GuideHome";
import GuideSection from "@/pages/GuideSection";
import NotFound from "@/pages/NotFound";
import SlugGuard from "@/components/SlugGuard";

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
 * SlugGuard vérifie que :slug existe Strapi avant de rendre Login —
 * sinon 404 direct (pas de leak d'info, pas de form vide).
 */
function AnimatedRoutes() {
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div key={location.pathname} className="animate-fade-in">
      <Routes location={location}>
        <Route path="/" element={<Navigate to={`/${DEFAULT_LOCALE}`} replace />} />
        <Route path="/:locale" element={<LocaleLayout />}>
          <Route index element={<GuideAccess />} />
          <Route path=":slug" element={<SlugGuard />}>
            <Route index element={<Login />} />
            <Route
              path="guide"
              element={
                <GuideProvider>
                  <GuideHome />
                </GuideProvider>
              }
            />
            <Route
              path="guide/:section"
              element={
                <GuideProvider>
                  <GuideSection />
                </GuideProvider>
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
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
