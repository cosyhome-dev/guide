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
import Login from "@/pages/Login";
import GuideHome from "@/pages/GuideHome";
import GuideSection from "@/pages/GuideSection";
import NotFound from "@/pages/NotFound";

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
          <Route index element={<Login />} />
          <Route
            path="guide/:slug"
            element={
              <GuideProvider>
                <GuideHome />
              </GuideProvider>
            }
          />
          <Route
            path="guide/:slug/:section"
            element={
              <GuideProvider>
                <GuideSection />
              </GuideProvider>
            }
          />
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
