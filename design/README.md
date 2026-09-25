# Dream Store: mockups

Proposta visual da home antes do desenvolvimento.

- `mockup-desktop.svg`: home completa em 1440 px, com anotações das estratégias de marketing à direita
- `mockup-mobile.svg`: home, página de produto e sacola no celular
- `generate_mockup.py`: gera os dois arquivos (`python3 design/generate_mockup.py`)

Abra os SVGs no navegador para ver as animações (faixa rolando, selo girando, produtos flutuando, aviso de compra e frase de marca acendendo).

## Tokens

| Papel | Cor |
| --- | --- |
| Violeta (marca, hero) | `#6D3AF5` |
| Rosa | `#FF4F9A` |
| Ciano | `#2EC5E8` |
| Amarelo (CTA principal) | `#FFD23F` |
| Laranja | `#FF8A3D` |
| Tinta (texto) | `#1A0F3D` |
| Papel (fundo) | `#F6F3FF` |

Tipografia: Manrope (500 a 700). Todos os pares de texto e fundo passam em WCAG AA (mínimo 4,7:1).

## Mockup v2: referência Nike, loja só de roupas

- `mockup-v2-desktop.svg` e `mockup-v2-mobile.svg`, gerados por `generate_mockup_v2.py`
- Fundo branco, fotos grandes, títulos em Anton (caixa alta condensada) e textos em Geist
- Ícones reais: Phosphor Icons (MIT) e Simple Icons (CC0) para as bandeiras de pagamento
- Fontes: Anton e Geist (SIL Open Font License), embutidas no SVG

### Fotos

Cada espaço de foto está listado em `PHOTO_BRIEF` no gerador. Para colocar a foto real, salve o arquivo como
`design/photos/<espaço>.jpg` (por exemplo `design/photos/hero.jpg`) e rode o gerador de novo.
Use só fotos com licença livre para uso comercial (Unsplash ou Pexels) e sem logos de outras marcas.
