"use client";

import { useRouter } from "next/navigation";

export default function Navbar({ nomeUsuario }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="pokebola pokebola-sm" />
        <h1>Pokemon Cards</h1>
      </div>
      <div className="navbar-right">
        {nomeUsuario && <span className="saudacao">Olá, {nomeUsuario}</span>}
        <button className="btn btn-secondary btn-small" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </nav>
  );
}
