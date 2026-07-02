"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const resultado = await res.json();
    setCarregando(false);

    if (!resultado.success) {
      setErro(resultado.error);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="auth-page">
      <div className="auth-watermark">
        <span>POKÉMON</span>
      </div>
      <div className="pokebola pokebola-float p1" />
      <div className="pokebola pokebola-float p2" />

      <div className="auth-box">
        <div className="auth-brand">
          <span className="pokebola pokebola-lg" />
        </div>
        <h1>Pokemon Cards</h1>
        <p className="auth-subtitle">Entre para gerenciar seu acervo de cards</p>

        {erro && <div className="erro">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="link">
          Não tem conta? <Link href="/cadastro">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}
