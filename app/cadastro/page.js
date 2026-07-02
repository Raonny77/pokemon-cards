"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CadastroPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const resultado = await res.json();
    setCarregando(false);

    if (!resultado.success) {
      setErro(resultado.error);
      return;
    }

    router.push("/login");
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
        <h1>Criar Conta</h1>
        <p className="auth-subtitle">Comece a montar seu acervo de cards</p>

        {erro && <div className="erro">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              required
            />
          </div>

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
              placeholder="Mínimo de 6 caracteres"
              minLength={6}
              required
            />
          </div>

          <button type="submit" className="btn" disabled={carregando}>
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <p className="link">
          Já tem conta? <Link href="/login">Fazer login</Link>
        </p>
      </div>
    </div>
  );
}
