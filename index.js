// Marcas de texto de IA em português, contadas por expressão regular. As regras são as que o
// PostaGen (https://postagen.ia.br) usa para revisar os posts que gera.
// Sem \b colado em letra acentuada: em JS sem /u, "É" e "ç" não são caractere de palavra.

/** Fortes: uma basta para o texto ter cara de IA. Leves: contam no total, mas sozinhas não condenam. */
export const regras = {
  travessao: { descricao: "Travessão (— ou –) no meio da frase", forte: true, regex: /[—–]/g },
  markdown: { descricao: "Negrito ou título em Markdown num texto que vai para rede social", forte: true, regex: /\*\*|^#{1,6} /gm },
  nao_e_x_e_y: { descricao: "Contraste “não é X, é Y” e parentes (“não se trata de”, “não é só”)", forte: true, regex: /(^|[\s(])não (é|são|foi|era|precisa|está|tem)\s[^.!?\n]{0,80}[.!?]\s+(é|são|foi|era|precisa|está|tem)(?=\s)|não (é|são) (só|apenas|somente|sobre)(?=\s)|não se trata|, não (um|uma|o|a) [^,.!?\n]{1,25}[.!?]/gim },
  sem_sem_sem: { descricao: "Lista “sem X, sem Y, sem Z”", forte: true, regex: /(^|\s)sem [^,.!?\n]{1,30}, sem [^,.!?\n]{1,30}, sem\s/gim },
  anuncio: { descricao: "Frase que anuncia em vez de dizer (“o segredo está em”, “vamos mergulhar”)", forte: true, regex: /um detalhe importante|aqui vai (um|uma)|o segredo est(á|a) em|neste post (você )?vai|confira (a seguir|abaixo)|vamos mergulhar/gi },
  // "jornada de trabalho" é termo da CLT, não metáfora de IA
  vocabulario_ia: { descricao: "Vocabulário que denuncia IA (potencializar, jornada, desvendar, crucial, no cenário atual)", forte: true, regex: /\b(jornada(?! (de trabalho|de \d|padrão|diária|semanal|contratada))|potencializ\w*|transformador\w*|desvend\w*|mergulh\w*|desbloque\w*|alavancar|alavanque\w*|alavancando|revolucion\w*|crucia(l|is)|divisor de águas|no cenário atual|nos dias de hoje|em um mundo cada vez|é importante ressaltar|vale ressaltar|em suma|holístic\w*|sinergia|ecossistema|empoder\w*)/gi },
  caso_inventado: { descricao: "Caso ou depoimento com cara de inventado (“A Ana, uma paciente…”, “perdeu 10 kg”)", forte: true, regex: /\b(A|O) [A-ZÁÉÍÓÚ][a-záéíóúâêôãõç]+, (uma|um|minha|meu) (aluna|aluno|paciente|cliente)|\b([Nn]ossos|[Mm]eus|[Mm]inhas|[Nn]ossas) (pacientes|alunos|alunas|clientes) (costumam |sempre )?(dizer|dizem|contam|falam)|\b(perdeu|perdi|eliminou) \d+ ?(kg|quilos)/g },
  emoji: { descricao: "Emoji", forte: true, regex: /\p{Extended_Pictographic}/gu },
  frase_feita: { descricao: "Frase feita (“faz toda a diferença”, “abre portas”, “novo capítulo”)", forte: false, regex: /faz(er)? toda a diferença|muda(r)? tudo|abre(m)? portas|novo capítulo|\bmerece(m)?\s|é um investimento em|está a poucos/gi },
  essencial_fundamental: { descricao: "“Essencial” e “fundamental”, que quase sempre sobram", forte: false, regex: /\b(essencia(l|is)|fundamenta(l|is))\b/gi },
};

/**
 * Lista cada marca encontrada no texto, na ordem em que aparece.
 * @param {string} texto
 * @param {{ ignorar?: string[] }} [opcoes]
 */
export function encontrar(texto, opcoes = {}) {
  const ignorar = new Set(opcoes.ignorar ?? []);
  const achados = [];
  for (const [marca, r] of Object.entries(regras)) {
    if (ignorar.has(marca)) continue;
    const flags = r.regex.flags.includes("g") ? r.regex.flags : r.regex.flags + "g";
    for (const m of texto.matchAll(new RegExp(r.regex.source, flags))) {
      achados.push({ marca, descricao: r.descricao, forte: r.forte, trecho: m[0].trim(), inicio: m.index });
    }
  }
  return achados.sort((a, b) => a.inicio - b.inicio);
}

/**
 * Resumo do texto: total por marca e se tem pelo menos uma marca forte.
 * @param {string} texto
 * @param {{ ignorar?: string[] }} [opcoes]
 */
export function avaliar(texto, opcoes) {
  const achados = encontrar(texto, opcoes);
  const porMarca = {};
  for (const a of achados) porMarca[a.marca] = (porMarca[a.marca] ?? 0) + 1;
  return { temMarcaForte: achados.some((a) => a.forte), total: achados.length, porMarca, achados };
}
