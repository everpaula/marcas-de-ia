import { test } from "node:test";
import assert from "node:assert/strict";
import { avaliar, encontrar } from "./index.js";

const marcas = (texto) => encontrar(texto).map((a) => a.marca);

test("acha cada marca forte", () => {
  assert.deepEqual(marcas("Treino de 20 minutos — sem equipamento."), ["travessao"]);
  assert.deepEqual(marcas("**Atenção** ao prazo."), ["markdown", "markdown"]);
  assert.deepEqual(marcas("Não é sobre dieta. É sobre rotina."), ["nao_e_x_e_y"]);
  assert.deepEqual(marcas("Treino sem culpa, sem pressa, sem dor."), ["sem_sem_sem"]);
  assert.deepEqual(marcas("O segredo está em dormir cedo."), ["anuncio"]);
  assert.deepEqual(marcas("Vamos potencializar seus resultados."), ["vocabulario_ia"]);
  assert.deepEqual(marcas("A Ana, uma paciente, chegou cansada."), ["caso_inventado"]);
  assert.deepEqual(marcas("Ela perdeu 10 kg em dois meses."), ["caso_inventado"]);
  assert.deepEqual(marcas("Bom dia 🙂"), ["emoji"]);
});

test("leves contam, mas não fazem o texto ter marca forte", () => {
  const r = avaliar("Dormir bem faz toda a diferença e é essencial.");
  assert.equal(r.temMarcaForte, false);
  assert.deepEqual(r.porMarca, { frase_feita: 1, essencial_fundamental: 1 });
});

test("não acusa texto comum", () => {
  assert.equal(avaliar("Clareamento sem avaliação pode causar sensibilidade. Agende sua avaliação.").total, 0);
  assert.equal(avaliar("A jornada de trabalho é de 8 horas por dia.").total, 0);
  assert.equal(avaliar("São 6h40, a sala ainda está escura e o tapete virou colchonete.").total, 0);
});

test("ignorar tira a marca da conta", () => {
  assert.equal(avaliar("Bom dia 🙂", { ignorar: ["emoji"] }).total, 0);
});

test("achados saem na ordem do texto", () => {
  const r = encontrar("Bom dia 🙂 — vamos mergulhar no tema.");
  assert.deepEqual(r.map((a) => a.marca), ["emoji", "travessao", "anuncio", "vocabulario_ia"]);
});
