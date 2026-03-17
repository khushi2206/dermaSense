import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="gradient-bg min-h-screen">
      <Navbar />
      <main className="container mx-auto px-6 py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-border bg-white p-10 text-center shadow-sm animate-fade-in">
          <div className="text-xs font-bold tracking-widest text-muted-foreground">DERMASENSE</div>
          <div className="mt-4 text-5xl font-extrabold text-foreground">404</div>
          <p className="mt-4 text-muted-foreground">
            This page doesn’t exist. Try heading back to the store.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/" className="btn-gradient px-6 py-3 text-sm">
              Go to Home
            </Link>
            <Link
              to="/products"
              className="rounded-md border border-border bg-white px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted/30"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
