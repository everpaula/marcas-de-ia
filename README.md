# marcas-de-ia

Acha as marcas que deixam um texto em português com cara de texto de IA: travessão, "não é X, é Y", "potencializar sua jornada", caso de cliente inventado, emoji e frase feita.

Não diz se um texto foi escrito por IA. Aponta os vícios de estilo que fazem o leitor desconfiar, para você corrigir antes de publicar. Zero dependências, funciona no Node 18 ou mais novo.

As regras saíram do [PostaGen](https://postagen.ia.br), que escreve posts para Instagram no tom de cada profissão e roda estas regras para revisar o que o modelo devolve. Em 12 posts de 4 profissões, os que tinham marca forte caíram de 9 para 1 depois que o prompt passou a evitar o que elas apontam.

## O que ele acha

| Marca | Peso | Exemplo |
|---|---|---|
| `travessao` | forte | "Treino de 20 minutos — sem equipamento." |
| `markdown` | forte | `**Atenção**` num texto que vai para o Instagram |
| `nao_e_x_e_y` | forte | "Não é sobre dieta. É sobre rotina." |
| `sem_sem_sem` | forte | "sem culpa, sem pressa, sem dor" |
| `anuncio` | forte | "O segredo está em…", "vamos mergulhar" |
| `vocabulario_ia` | forte | potencializar, jornada, desvendar, crucial, no cenário atual |
| `caso_inventado` | forte | "A Ana, uma paciente…", "perdeu 10 kg" |
| `emoji` | forte | 🙂 |
| `frase_feita` | leve | "faz toda a diferença", "abre portas" |
| `essencial_fundamental` | leve | "é essencial", "é fundamental" |

Uma marca forte basta para o texto ter cara de IA. As leves entram no total, mas sozinhas não condenam o texto. "Jornada de trabalho" e parentes ficam de fora, porque aí a palavra é termo da CLT.

## Uso

```bash
npm install github:everpaula/marcas-de-ia
```

```js
import { avaliar, encontrar } from "marcas-de-ia";

const r = avaliar("Não é sobre dieta. É sobre rotina — e isso faz toda a diferença.");
r.temMarcaForte; // true
r.porMarca;      // { nao_e_x_e_y: 1, travessao: 1, frase_feita: 1 }

encontrar("Bom dia 🙂");
// [{ marca: "emoji", descricao: "Emoji", forte: true, trecho: "🙂", inicio: 8 }]

// Seu público usa emoji? Tire a regra da conta:
avaliar("Bom dia 🙂", { ignorar: ["emoji"] }).total; // 0
```

As regras ficam expostas em `regras`, cada uma com `descricao`, `forte` e `regex`, se você quiser montar a sua lista.

## Linha de comando

```bash
npx github:everpaula/marcas-de-ia post.txt legenda.txt
cat post.txt | npx github:everpaula/marcas-de-ia
```

```
post.txt: 2 marcas
  linha 1  forte  nao_e_x_e_y  "Não é sobre dieta. É"
  linha 3  leve   frase_feita  "faz toda a diferença"
```

Sai com código 1 quando algum arquivo tem marca forte, então dá para usar num CI que revisa texto gerado.

## Limites

- É expressão regular, não modelo. Pega o padrão, não o sentido: "não é fácil, é trabalhoso" é contraste legítimo e vai ser apontado.
- `caso_inventado` não sabe se o caso é real. Ele marca o formato que modelo costuma inventar; se o caso existe e foi autorizado, ignore.
- Foi escrito para texto curto de rede social. Em texto longo, travessão e "fundamental" podem ser escolha de estilo.

## Testes

```bash
npm test
```

## Licença

MIT
