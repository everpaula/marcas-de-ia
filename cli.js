#!/usr/bin/env node
// Uso: marcas-de-ia arquivo.txt [outro.txt ...]   ou   cat texto.txt | marcas-de-ia
// Sai com código 1 quando algum texto tem marca forte, para dar para usar em CI.
import { readFileSync } from "node:fs";
import { avaliar } from "./index.js";

const arquivos = process.argv.slice(2);
const textos = arquivos.length
  ? arquivos.map((a) => [a, readFileSync(a, "utf8")])
  : [["entrada", readFileSync(0, "utf8")]];

let algumForte = false;
for (const [nome, texto] of textos) {
  const r = avaliar(texto);
  algumForte ||= r.temMarcaForte;
  console.log(`${nome}: ${r.total === 0 ? "nenhuma marca" : `${r.total} ${r.total === 1 ? "marca" : "marcas"}`}`);
  for (const a of r.achados) {
    const linha = texto.slice(0, a.inicio).split("\n").length;
    console.log(`  linha ${linha}  ${a.forte ? "forte" : "leve "}  ${a.marca}  "${a.trecho}"`);
  }
}
process.exitCode = algumForte ? 1 : 0;
