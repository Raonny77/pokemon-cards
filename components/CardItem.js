"use client";

import Link from "next/link";

function raridadeParaClasse(rarity) {
  return "rarity-" + (rarity || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

export default function CardItem({ card, onDelete }) {
  async function handleDelete() {
    const confirmar = confirm(`Excluir o card "${card.name}"?`);
    if (!confirmar) return;

    const res = await fetch(`/api/cards/${card.id}`, { method: "DELETE" });
    const resultado = await res.json();

    if (resultado.success) {
      onDelete(card.id);
    } else {
      alert("Erro ao excluir o card");
    }
  }

  return (
    <div className="card">
      <div className="card-image-wrap">
        <img src={card.image} alt={card.name} />
      </div>

      <div className="card-body">
        <div className="card-header-row">
          <h3>{card.name}</h3>
          <span className={`rarity-badge ${raridadeParaClasse(card.rarity)}`}>
            {card.rarity}
          </span>
        </div>

        <span className="card-tag">{card.type}</span>

        <div className="card-stats">
          <span>
            HP <strong>{card.hp}</strong>
          </span>
          <span>
            Ataque <strong>{card.attack}</strong>
          </span>
        </div>

        <p className="card-description">{card.description}</p>

        <div className="card-actions">
          <Link href={`/cards/${card.id}/editar`} className="btn btn-outline btn-small">
            Editar
          </Link>
          <button className="btn btn-danger btn-small" onClick={handleDelete}>
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
