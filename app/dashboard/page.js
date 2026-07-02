"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CardItem from "@/components/CardItem";

export default function DashboardPage() {
  const [usuario, setUsuario] = useState(null);
  const [cards, setCards] = useState([]);
  const [busca, setBusca] = useState("");
  const [raridadeFiltro, setRaridadeFiltro] = useState("");
  const [ordenacao, setOrdenacao] = useState("recentes");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((resultado) => {
        if (resultado.success) setUsuario(resultado.data);
      });

    carregarCards();
  }, []);

  async function carregarCards(nome = "") {
    setCarregando(true);
    const url = nome
      ? `/api/cards?nome=${encodeURIComponent(nome)}`
      : "/api/cards";

    const res = await fetch(url);
    const resultado = await res.json();

    if (resultado.success) setCards(resultado.data);
    setCarregando(false);
  }

  function handleBuscar(e) {
    e.preventDefault();
    carregarCards(busca);
  }

  function handleDelete(id) {
    setCards(cards.filter((card) => card.id !== id));
  }

  // Estatisticas calculadas a partir dos cards carregados
  const stats = useMemo(() => {
    const total = cards.length;
    const somaHp = cards.reduce((soma, c) => soma + Number(c.hp || 0), 0);
    const mediaHp = total > 0 ? Math.round(somaHp / total) : 0;
    const lendarios = cards.filter((c) => c.rarity === "Lendaria").length;

    const contagemTipos = {};
    cards.forEach((c) => {
      contagemTipos[c.type] = (contagemTipos[c.type] || 0) + 1;
    });
    const tipoMaisComum =
      Object.entries(contagemTipos).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

    return { total, mediaHp, lendarios, tipoMaisComum };
  }, [cards]);

  // Filtro por raridade + ordenacao, aplicados sobre os cards ja carregados
  const cardsExibidos = useMemo(() => {
    let lista = [...cards];

    if (raridadeFiltro) {
      lista = lista.filter((c) => c.rarity === raridadeFiltro);
    }

    if (ordenacao === "hp") {
      lista.sort((a, b) => b.hp - a.hp);
    } else if (ordenacao === "nome") {
      lista.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      lista.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return lista;
  }, [cards, raridadeFiltro, ordenacao]);

  return (
    <>
      <Navbar nomeUsuario={usuario?.name} />

      <div className="container">
        <div className="dashboard-hero">
          <div>
            <h2 className="page-title">Meu acervo</h2>
            <p className="page-subtitle">
              Gerencie seus cards Pokémon cadastrados
            </p>
          </div>
          <Link href="/cards/novo" className="btn btn-small">
            + Novo Card
          </Link>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon i-total">📦</div>
            <div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total de Cards</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon i-rare">⭐</div>
            <div>
              <div className="stat-value">{stats.lendarios}</div>
              <div className="stat-label">Lendários</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon i-hp">❤️</div>
            <div>
              <div className="stat-value">{stats.mediaHp}</div>
              <div className="stat-label">HP Médio</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon i-type">🍃</div>
            <div>
              <div className="stat-value">{stats.tipoMaisComum}</div>
              <div className="stat-label">Tipo Mais Comum</div>
            </div>
          </div>
        </div>

        <div className="toolbar">
          <form className="search-bar" onSubmit={handleBuscar}>
            <input
              type="text"
              placeholder="Buscar card por nome..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <button type="submit" className="btn btn-small">
              Buscar
            </button>
          </form>

          <div className="toolbar-filters">
            <select
              className="filter-select"
              value={raridadeFiltro}
              onChange={(e) => setRaridadeFiltro(e.target.value)}
            >
              <option value="">Todas as raridades</option>
              <option value="Comum">Comum</option>
              <option value="Incomum">Incomum</option>
              <option value="Rara">Rara</option>
              <option value="Ultra Rara">Ultra Rara</option>
              <option value="Lendaria">Lendária</option>
            </select>

            <select
              className="filter-select"
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
            >
              <option value="recentes">Mais recentes</option>
              <option value="nome">Nome (A-Z)</option>
              <option value="hp">Maior HP</option>
            </select>
          </div>
        </div>

        {!carregando && cards.length > 0 && (
          <p className="results-count">
            Mostrando <strong>{cardsExibidos.length}</strong> de{" "}
            <strong>{cards.length}</strong> cards
          </p>
        )}

        {carregando && (
          <p className="carregando">
            <span
              className="pokebola pokebola-sm"
              style={{ marginRight: 10, verticalAlign: "middle" }}
            />
            Carregando cards...
          </p>
        )}

        {!carregando && cards.length === 0 && (
          <div className="vazio">
            <span className="pokebola pokebola-lg" />
            <div>
              <strong>Nenhum card cadastrado ainda</strong>
              <p>Comece adicionando o primeiro Pokémon ao seu acervo.</p>
            </div>
            <Link href="/cards/novo" className="btn btn-small">
              + Cadastrar primeiro card
            </Link>
          </div>
        )}

        {!carregando && cards.length > 0 && cardsExibidos.length === 0 && (
          <p className="vazio">Nenhum card encontrado com esse filtro.</p>
        )}

        <div className="cards-grid">
          {cardsExibidos.map((card) => (
            <CardItem key={card.id} card={card} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </>
  );
}
