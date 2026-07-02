"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CardForm({ cardInicial, cardId }) {
  const router = useRouter();
  const ehEdicao = Boolean(cardId);

  const [form, setForm] = useState({
    name: cardInicial?.name || "",
    type: cardInicial?.type || "",
    hp: cardInicial?.hp || "",
    attack: cardInicial?.attack || "",
    description: cardInicial?.description || "",
    image: cardInicial?.image || "",
    rarity: cardInicial?.rarity || "Comum",
  });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    const url = ehEdicao ? `/api/cards/${cardId}` : "/api/cards";
    const method = ehEdicao ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const resultado = await res.json();
    setCarregando(false);

    if (!resultado.success) {
      setErro(resultado.error || "Erro ao salvar o card");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="form-card">
      <h1>{ehEdicao ? "Editar Card" : "Novo Card"}</h1>
      <p className="form-subtitle">
        {ehEdicao
          ? "Atualize as informações do Pokémon abaixo."
          : "Preencha os dados do Pokémon para adicionar ao seu acervo."}
      </p>

      {erro && <div className="erro">{erro}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome do Pokémon</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Tipo</label>
            <input
              type="text"
              name="type"
              placeholder="Ex: Fogo, Água, Grama..."
              value={form.type}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>HP</label>
            <input
              type="number"
              name="hp"
              min="1"
              value={form.hp}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Ataque Principal</label>
          <input
            type="text"
            name="attack"
            value={form.attack}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Descrição</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>URL da Imagem</label>
          <input
            type="url"
            name="image"
            placeholder="https://..."
            value={form.image}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Raridade</label>
          <select
            name="rarity"
            value={form.rarity}
            onChange={handleChange}
            required
          >
            <option value="Comum">Comum</option>
            <option value="Incomum">Incomum</option>
            <option value="Rara">Rara</option>
            <option value="Ultra Rara">Ultra Rara</option>
            <option value="Lendaria">Lendária</option>
          </select>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => router.push("/dashboard")}
          >
            Cancelar
          </button>
          <button type="submit" className="btn" disabled={carregando}>
            {carregando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
