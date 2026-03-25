import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/hero-guide.jpg";
import cosyhomeLogo from "@/assets/logo-cosyhome.png";
import logoCopyright from "@/assets/logo-copyright-blanc.png";

const Login = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: any code works
    if (code.trim().length > 0) {
      navigate("/guide");
    } else {
      setError("Veuillez entrer votre code d'accès");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left - Image */}
      <div className="relative h-[40vh] md:h-screen md:w-1/2">
        <img
          src={heroImage}
          alt="CosyHome Conciergerie"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/40" />
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.25]">
          <img src={cosyhomeLogo} alt="" className="w-[250px] md:w-[320px] h-auto" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <img src={logoCopyright} alt="CosyHome Conciergerie" className="h-[100px] md:h-[150px] w-auto" />
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 bg-background">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <h1 className="text-2xl mb-3">Guide de séjour</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Entrez le code d'accès fourni dans votre confirmation de réservation pour accéder au guide de votre logement.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">
                Code d'accès
              </label>
              <Input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError("");
                }}
                placeholder="Entrez votre code"
                className="bg-card border-border"
              />
              {error && <p className="text-destructive text-small mt-1.5">{error}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Accéder au guide
            </Button>
          </form>

          <p className="text-small text-muted-foreground mt-8 text-center">
            Vous n'avez pas reçu de code ? Contactez votre concierge.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
