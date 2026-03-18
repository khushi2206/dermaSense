import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Home",     path: "/" },
  { label: "Products", path: "/products" },
  { label: "Profile",  path: "/profile" },
];

const Navbar = () => {
  const location   = useLocation();
  const [open, setOpen] = useState(false);
  const isActive = (p: string) => location.pathname === p;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">

        {/* Desktop left nav */}
        <nav className="hidden md:flex flex-1 items-center gap-10">
          {navItems.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              className={`font-body text-[11px] font-medium uppercase tracking-[0.2em] transition-colors ${
                isActive(path) ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Logo */}
        <div className="flex flex-1 justify-start md:justify-center">
          <Link to="/" className="font-display text-xl font-semibold text-foreground tracking-tight">
            DermaSense
          </Link>
        </div>

        {/* Right actions */}
        <div className="flex flex-1 items-center justify-end gap-4">
          <Link
            to="/login"
            className="border border-border px-4 py-2 font-body text-[11px] uppercase tracking-[0.18em] text-foreground hover:border-primary hover:text-primary transition-colors"
          >
            Login
          </Link>
          {/* Mobile hamburger */}
          <button className="md:hidden text-muted-foreground" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background border-t border-border/40 px-6 py-6 flex flex-col gap-6">
          {navItems.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setOpen(false)}
              className={`font-body text-sm font-medium uppercase tracking-widest ${isActive(path) ? "text-primary" : "text-muted-foreground"}`}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="font-body text-sm font-medium uppercase tracking-widest text-primary"
          >
            Login
          </Link>
          <Link
            to="/auth"
            onClick={() => setOpen(false)}
            className="font-body text-sm font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            Register
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
