"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import CardForm from "@/components/CardForm";

export default function EditarCardPage({ params }) {
  const [card, setCard] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch(`/api/cards/${params.id}`)
      .then((res) => res.json())
      .then((resultado) => {
        if (resultado.success) setCard(resultado.data);
        setCarregando(false);
      });
  }, [params.id]);

  return (
    <>
      <Navbar />
      <div className="container form-page">
        {carregando && (
          <p className="carregando">
            <span className="pokebola pokebola-sm" style={{ marginRight: 10, verticalAlign: "middle" }} />
            Carregando...
          </p>
        )}
        {!carregando && card && <CardForm cardInicial={card} cardId={params.id} />}
        {!carregando && !card && <p className="vazio">Card não encontrado.</p>}
      </div>
    </>
  );
}
