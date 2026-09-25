"""Mockup v2 da Dream Store, com referência no layout da Nike.

Fotos: coloque arquivos JPG em design/photos/<slot>.jpg (veja PHOTOS abaixo).
Enquanto uma foto não existir, o espaço aparece marcado com a descrição da foto.

Uso: python3 design/generate_mockup_v2.py
"""
import base64
import re
from pathlib import Path

ROOT = Path(__file__).parent
ASSETS = ROOT / "assets"
PHOTOS = ROOT / "photos"

INK = "#111111"
GRAY = "#707072"
SURFACE = "#F5F5F5"
LINE = "#E5E5E5"
WHITE = "#FFFFFF"
ACCENT = "#6D3AF5"   # violeta Dream, usado só em selos e na marca
SALE = "#D43F3A"
PIX = "#0E7C5A"

# slot -> descrição da foto real que vai no lugar
PHOTO_BRIEF = {
    "hero": "Modelo com moletom preto oversized, rua à noite com luz neon",
    "feat-roupas": "Dupla vestindo streetwear, fundo urbano",
    "feat-setup": "Setup gamer com luz RGB, teclado e headset",
    "p-moletom": "Moletom preto em fundo cinza claro",
    "p-headset": "Headset sem fio em fundo cinza claro",
    "p-camiseta": "Camiseta branca em fundo cinza claro",
    "p-mouse": "Mouse gamer em fundo cinza claro",
    "p-bone": "Boné preto em fundo cinza claro",
    "p-teclado": "Teclado mecânico em fundo cinza claro",
    "setup": "Pessoa jogando no PC, quarto escuro, luz colorida",
    "c-moletons": "Modelo de moletom, corpo inteiro",
    "c-camisetas": "Modelo de camiseta, meio corpo",
    "c-headsets": "Pessoa usando headset",
    "c-teclados": "Mãos no teclado mecânico",
    "m-drops": "Fila de loja ou caixa de produto sendo aberta",
    "m-cupom": "Sacola de compras em mãos",
    "m-frete": "Caixa de entrega na porta",
}


def b64(path):
    return base64.b64encode(path.read_bytes()).decode()


def font_css():
    return (f"@font-face{{font-family:'Anton';src:url(data:font/woff2;base64,{b64(ASSETS / 'anton.woff2')}) format('woff2');}}"
            f"@font-face{{font-family:'Geist';font-weight:100 900;src:url(data:font/woff2;base64,{b64(ASSETS / 'geist.woff2')}) format('woff2');}}")


STYLE_EXTRA = """
text { font-family: Geist, 'Helvetica Neue', Arial, sans-serif; }
.d { font-family: Anton, Impact, sans-serif; text-transform: uppercase; }
.w4 { font-weight: 400; } .w5 { font-weight: 500; } .w6 { font-weight: 600; }
"""


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def t(x, y, s, size=16, fill=INK, w=5, anchor="start", cls="", extra=""):
    return (f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" class="w{w} {cls}" '
            f'text-anchor="{anchor}" {extra}>{esc(s)}</text>')


def rect(x, y, w, h, fill, r=0, extra=""):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" {extra}/>'


_icon_cache = {}


def icon(name, x, y, size=24, color=INK):
    if name not in _icon_cache:
        src = (ASSETS / "icons" / f"{name}.svg").read_text()
        vb = re.search(r'viewBox="([^"]+)"', src).group(1)
        inner = re.sub(r"^.*?<svg[^>]*>|</svg>\s*$", "", src, flags=re.S)
        inner = re.sub(r"<title>.*?</title>", "", inner)
        _icon_cache[name] = (vb, inner)
    vb, inner = _icon_cache[name]
    return f'<svg x="{x}" y="{y}" width="{size}" height="{size}" viewBox="{vb}" fill="{color}">{inner}</svg>'


_clip = [0]


def photo(slot, x, y, w, h, r=0, dark_overlay=False):
    """Foto real se existir em design/photos, senão um espaço marcado."""
    _clip[0] += 1
    cid = f"c{_clip[0]}"
    out = f'<clipPath id="{cid}"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}"/></clipPath>'
    f = PHOTOS / f"{slot}.jpg"
    if f.exists():
        out += (f'<image href="data:image/jpeg;base64,{b64(f)}" x="{x}" y="{y}" width="{w}" height="{h}" '
                f'preserveAspectRatio="xMidYMid slice" clip-path="url(#{cid})"/>')
        if dark_overlay:
            out += (f'<rect x="{x}" y="{y + h * 0.45}" width="{w}" height="{h * 0.55}" fill="url(#fade)" '
                    f'clip-path="url(#{cid})"/>')
    else:
        out += rect(x, y, w, h, "#DADADA" if not dark_overlay else "#CFCFCF", r)
        out += (f'<g clip-path="url(#{cid})"><path d="M{x} {y + h} L{x + w} {y}" stroke="#C4C4C4" stroke-width="1.5"/>'
                f'<path d="M{x} {y} L{x + w} {y + h}" stroke="#C4C4C4" stroke-width="1.5"/></g>')
        label = PHOTO_BRIEF[slot]
        lw = min(len(label) * 7.2 + 32, w - 24)
        cx, cy = x + w / 2, y + h / 2
        out += rect(cx - lw / 2, cy - 30, lw, 60, WHITE, 12)
        out += t(cx, cy - 6, "Foto real", 12, GRAY, 6, "middle")
        size = 13 if len(label) * 7.2 + 32 <= w - 24 else 11
        out += t(cx, cy + 14, label, size, INK, 5, "middle")
    return out


def pill(x, y, label, bg=INK, fg=WHITE, size=16, h=48, pad=24, border=None):
    w = len(label) * size * 0.56 + pad * 2
    b = f'stroke="{border}" stroke-width="1.5"' if border else ""
    return rect(x, y, w, h, bg, h / 2, b) + t(x + w / 2, y + h / 2 + size * 0.35, label, size, fg, 5, "middle"), w


def logo(x, y, color=INK, scale=1.0):
    return (f'<g transform="translate({x} {y}) scale({scale})">'
            f'<circle cx="16" cy="-12" r="16" fill="{color}"/>'
            f'<circle cx="23" cy="-17" r="13" fill="{WHITE if color == INK else INK}"/>'
            f'<circle cx="26" cy="-24" r="2.4" fill="{ACCENT}"/>'
            f'<text x="42" y="0" font-size="30" fill="{color}" class="d" letter-spacing="0.5">Dream</text>'
            f'<text x="126" y="0" font-size="30" fill="{ACCENT}" class="d" letter-spacing="0.5">Store</text></g>')


def section_title(y, title, right_arrows=False, link=None):
    s = t(48, y, title, 24, INK, 5)
    if right_arrows:
        x = 1392
        s += f'<circle cx="{x - 24}" cy="{y - 8}" r="24" fill="{SURFACE}"/>' + icon("caret-right", x - 36, y - 20, 24)
        s += f'<circle cx="{x - 84}" cy="{y - 8}" r="24" fill="{SURFACE}"/>' + icon("caret-left", x - 96, y - 20, 24, "#BDBDBD")
        if link:
            s += t(x - 128, y - 2, link, 16, INK, 5, "end", extra='text-decoration="underline"')
    return s


def product_card(x, y, w, slot, badge, badge_color, name, cat, colors, price, old=None, pix=None, inst=None):
    s = rect(x, y, w, w, SURFACE) + photo(slot, x, y, w, w)
    s += f'<circle cx="{x + w - 32}" cy="{y + 32}" r="20" fill="{WHITE}"/>' + icon("heart", x + w - 44, y + 20, 24)
    yy = y + w + 32
    if badge:
        s += t(x, yy, badge, 16, badge_color, 5)
        yy += 24
    s += t(x, yy, name, 16, INK, 5)
    s += t(x, yy + 24, cat, 16, GRAY, 4)
    s += t(x, yy + 48, colors, 16, GRAY, 4)
    if old:
        s += t(x, yy + 80, price, 16, INK, 5) + t(x + 96, yy + 80, old, 16, GRAY, 4, extra='text-decoration="line-through"')
        s += t(x + 186, yy + 80, "23% off", 16, PIX, 5)
    else:
        s += t(x, yy + 80, price, 16, INK, 5)
    if pix:
        s += t(x, yy + 104, f"{pix} no Pix ou {inst}", 14, GRAY, 4)
    return s


# ============================================================
def desktop():
    W = 1440
    o = []
    a = o.append

    # barra utilitária
    a(rect(0, 0, W, 36, SURFACE))
    a(logo(48, 26, INK, 0.5))
    ux = 1392
    for k, lbl in enumerate(["Entrar", "Cadastre-se", "Ajuda", "Rastrear pedido"]):
        if k:
            a(t(ux, 23, "|", 12, INK, 4, "end"))
            ux -= 16
        a(t(ux, 23, lbl, 12, INK, 5, "end"))
        ux -= len(lbl) * 6.6 + 16

    # navegação
    a(logo(48, 80, INK, 0.9))
    x = 520
    for i, n in enumerate(["Lançamentos", "Roupas", "Periféricos", "Setup", "Outlet"]):
        a(t(x, 74, n, 16, INK, 5))
        if i == 0:
            a(rect(x, 92, len(n) * 8.9, 2, INK))
        x += len(n) * 8.9 + 32
    a(rect(1132, 46, 180, 40, SURFACE, 20))
    a(icon("magnifying-glass", 1142, 54, 24))
    a(t(1176, 72, "Buscar", 16, GRAY, 4))
    a(icon("heart", 1328, 54, 24))
    a(icon("handbag", 1368, 54, 24))
    a(f'<circle cx="1388" cy="72" r="0"/>' + t(1380, 74, "2", 9, INK, 6, "middle"))

    # faixa promocional
    a(rect(0, 100, W, 56, SURFACE))
    a(t(W / 2, 126, "Frete grátis para membros Dream em compras acima de R$ 299", 15, INK, 5, "middle"))
    a(t(W / 2, 145, "Seja membro", 12, INK, 5, "middle", extra='text-decoration="underline"'))

    # hero
    a(photo("hero", 48, 180, 1344, 760))
    a(t(W / 2, 992, "Drop Nebula", 16, INK, 5, "middle"))
    a(t(W / 2, 1090, "Vista o jogo", 96, INK, 4, "middle", "d"))
    a(t(W / 2, 1134, "Moletons pesados e periféricos de precisão. Peças limitadas, só até domingo.", 16, INK, 4, "middle"))
    p1, w1 = pill(0, 0, "Comprar o drop")
    p2, w2 = pill(0, 0, "Ver lookbook", WHITE, INK, border=INK)
    gx = W / 2 - (w1 + 8 + w2) / 2
    a(f'<g transform="translate({gx} 1162)">{p1}</g><g transform="translate({gx + w1 + 8} 1162)">{p2}</g>')

    # destaques
    y = 1300
    a(section_title(y, "Em destaque"))
    for i, (slot, eyebrow, title, cta) in enumerate([
        ("feat-roupas", "Coleção Nebula", "Streetwear para quem vive online", "Comprar roupas"),
        ("feat-setup", "Periféricos", "Setup que acompanha seu ritmo", "Comprar periféricos"),
    ]):
        x = 48 + i * 684
        a(photo(slot, x, y + 32, 660, 820, dark_overlay=True))
        a(t(x + 48, y + 32 + 820 - 160, eyebrow, 16, WHITE, 5))
        a(t(x + 48, y + 32 + 820 - 124, title, 24, WHITE, 5))
        p, _ = pill(0, 0, cta, WHITE, INK, 16, 40, 20)
        a(f'<g transform="translate({x + 48} {y + 32 + 820 - 96})">{p}</g>')

    # mais vendidos
    y = 2240
    a(section_title(y, "Os mais vendidos", True, "Ver tudo"))
    cards = [
        ("p-moletom", "Mais vendido", ACCENT, "Moletom Nebula Oversized", "Moletom unissex", "3 cores", "R$ 289,90", None, "R$ 275,40", "10x de R$ 28,99"),
        ("p-headset", "23% off", SALE, "Headset Pulse 7.1 Wireless", "Periférico", "2 cores", "R$ 384,90", "R$ 499,90", "R$ 365,66", "10x de R$ 38,49"),
        ("p-camiseta", "Últimas unidades", SALE, "Camiseta Pixel Heavy", "Camiseta unissex", "4 cores", "R$ 139,90", None, "R$ 132,91", "10x de R$ 13,99"),
        ("p-mouse", "Novo", ACCENT, "Mouse Orbit 26K", "Periférico", "2 cores", "R$ 219,90", None, "R$ 208,91", "10x de R$ 21,99"),
    ]
    cw = 424
    a(f'<clipPath id="carousel"><rect x="48" y="{y + 20}" width="1392" height="700"/></clipPath><g clip-path="url(#carousel)">')
    for i, c in enumerate(cards):
        a(product_card(48 + i * (cw + 12), y + 32, cw, *c))
    a("</g>")

    # setup completo (banner largo)
    y = 2980
    a(section_title(y, "Kit Nebula Setup"))
    a(photo("setup", 48, y + 32, 1344, 700))
    a(t(W / 2, y + 850, "Monte seu kit", 96, INK, 4, "middle", "d"))
    a(t(W / 2, y + 894, "Moletom, headset e mousepad juntos por R$ 682,30. Você economiza R$ 120,40.", 16, INK, 4, "middle"))
    p, pw = pill(0, 0, "Montar meu kit")
    a(f'<g transform="translate({W / 2 - pw / 2} {y + 922})">{p}</g>')

    # categorias
    y = 4040
    a(section_title(y, "Compre por categoria", True))
    for i, (slot, lab) in enumerate([("c-moletons", "Moletons"), ("c-camisetas", "Camisetas"),
                                     ("c-headsets", "Headsets"), ("c-teclados", "Teclados")]):
        x = 48 + i * (330 + 8)
        a(photo(slot, x, y + 32, 330, 440))
        p, _ = pill(0, 0, lab, WHITE, INK, 16, 40, 20)
        a(f'<g transform="translate({x + 24} {y + 32 + 440 - 64})">{p}</g>')

    # membros
    y = 4640
    a(section_title(y, "Vantagens de membro"))
    for i, (slot, h, s) in enumerate([
        ("m-drops", "Acesso antecipado aos drops", "Compre 24 horas antes de todo mundo."),
        ("m-cupom", "10% na primeira compra", "Cupom liberado assim que você se cadastra."),
        ("m-frete", "Frete grátis acima de R$ 299", "Para todo o Brasil, em qualquer pedido."),
    ]):
        x = 48 + i * (443 + 7.5)
        a(photo(slot, x, y + 32, 443, 540, dark_overlay=True))
        a(t(x + 32, y + 32 + 540 - 120, h, 24, WHITE, 5))
        a(t(x + 32, y + 32 + 540 - 90, s, 16, WHITE, 4))
        p, _ = pill(0, 0, "Seja membro", WHITE, INK, 16, 40, 20)
        a(f'<g transform="translate({x + 32} {y + 32 + 540 - 72})">{p}</g>')

    # garantias
    y = 5310
    a(rect(48, y, 1344, 1, LINE))
    for i, (ic, h, s) in enumerate([("truck", "Frete grátis", "Acima de R$ 299"),
                                     ("credit-card", "10x sem juros", "Em todos os cartões"),
                                     ("pix", "5% off no Pix", "Aprovação na hora"),
                                     ("arrows-left-right", "Troca grátis", "Em até 30 dias")]):
        x = 48 + i * 336
        a(icon("si-pix" if ic == "pix" else ic, x, y + 40, 28))
        a(t(x + 44, y + 52, h, 16, INK, 5))
        a(t(x + 44, y + 74, s, 14, GRAY, 4))
    a(rect(48, y + 112, 1344, 1, LINE))

    # rodapé
    y = 5480
    cols = [("Recursos", ["Encontre um drop", "Guia de tamanhos", "Clube Dream", "Blog"]),
            ("Ajuda", ["Rastrear pedido", "Trocas e devoluções", "Prazos de entrega", "Formas de pagamento", "Fale com a gente"]),
            ("Empresa", ["Sobre a Dream", "Trabalhe conosco", "Imprensa", "Sustentabilidade"]),
            ("Siga a Dream", [])]
    for i, (h, ls) in enumerate(cols):
        x = 48 + i * 260
        a(t(x, y, h, 16, INK, 5))
        for j, l in enumerate(ls):
            a(t(x, y + 36 + j * 28, l, 14, GRAY, 5))
    for i, ic in enumerate(["instagram-logo", "tiktok-logo", "youtube-logo", "x-logo"]):
        a(icon(ic, 828 + i * 40, y + 20, 24, GRAY))
    a(icon("globe-simple", 1300, y - 16, 20, GRAY) + t(1392, y, "Brasil", 14, GRAY, 5, "end"))
    for i, ic in enumerate(["si-pix", "si-visa", "si-mastercard", "si-americanexpress"]):
        a(icon(ic, 1224 + i * 44, y + 32, 28, GRAY))
    a(rect(48, y + 196, 1344, 1, LINE))
    a(t(48, y + 236, "© 2026 Dream Store. Todos os direitos reservados.", 12, GRAY, 5))
    for lbl, xx in [("Política de privacidade", 1172), ("Termos de uso", 1288), ("Cookies", 1392)]:
        a(t(xx, y + 236, lbl, 12, GRAY, 5, "end"))

    H = y + 280
    return svg(W, H, "Dream Store, mockup v2 da home", "".join(o), rect(0, 0, W, H, WHITE))


# ============================================================
def phone(x0, title, inner):
    return (f'<g transform="translate({x0} 110)">'
            f'<rect x="-12" y="-12" width="414" height="868" rx="56" fill="{INK}"/>'
            f'<clipPath id="ph{x0}"><rect width="390" height="844" rx="44"/></clipPath>'
            f'<g clip-path="url(#ph{x0})">{rect(0, 0, 390, 844, WHITE)}{inner}'
            f'{t(28, 34, "9:41", 14, INK, 6)}{rect(334, 22, 26, 13, INK, 4)}</g>'
            f'<rect x="135" y="10" width="120" height="30" rx="15" fill="{INK}"/></g>'
            f'{t(x0 + 195, 1010, title, 18, INK, 5, "middle")}')


def mobile():
    s = []
    a = s.append
    a(logo(20, 92, INK, 0.62))
    for i, ic in enumerate(["magnifying-glass", "handbag", "list"]):
        a(icon(ic, 270 + i * 40, 70, 24))
    a(rect(0, 110, 390, 48, SURFACE))
    a(t(195, 132, "Frete grátis para membros acima de R$ 299", 12, INK, 5, "middle"))
    a(t(195, 148, "Seja membro", 11, INK, 5, "middle", extra='text-decoration="underline"'))
    a(photo("hero", 0, 158, 390, 440))
    a(t(24, 632, "Drop Nebula", 14, INK, 5))
    a(t(24, 690, "Vista o jogo", 56, INK, 4, "", "d"))
    a(t(24, 720, "Peças limitadas, só até domingo.", 14, INK, 4))
    p, _ = pill(0, 0, "Comprar o drop", INK, WHITE, 14, 40, 20)
    a(f'<g transform="translate(24 740)">{p}</g>')
    a(rect(0, 796, 390, 48, WHITE, 0, f'stroke="{LINE}"'))
    for i, ic in enumerate(["house", "magnifying-glass", "heart", "handbag", "user"]):
        a(icon(ic, 27 + i * 78, 806, 24, INK if i == 0 else GRAY))

    q = []
    b = q.append
    b(icon("caret-left", 20, 70, 24) + t(195, 88, "Moletom Nebula", 16, INK, 5, "middle") + icon("handbag", 346, 70, 24))
    b(rect(0, 108, 390, 390, SURFACE) + photo("p-moletom", 0, 108, 390, 390))
    for i in range(4):
        b(rect(155 + i * 22, 478, 16, 3, INK if i == 0 else "#BDBDBD", 1.5))
    b(t(20, 532, "Mais vendido", 14, ACCENT, 5))
    b(t(20, 560, "Moletom Nebula Oversized", 22, INK, 5))
    b(t(20, 584, "Moletom unissex", 14, GRAY, 4))
    b(t(20, 618, "R$ 289,90", 18, INK, 5))
    b(t(20, 640, "R$ 275,40 no Pix ou 10x de R$ 28,99", 13, PIX, 5))
    b(t(20, 676, "Selecione o tamanho", 14, INK, 5) + t(370, 676, "Guia de tamanhos", 13, GRAY, 4, "end"))
    for i, sz in enumerate(["P", "M", "G", "GG", "XG"]):
        x = 20 + i * 71
        b(rect(x, 688, 64, 44, WHITE, 6, f'stroke="{INK if sz == "G" else LINE}" stroke-width="{1.5 if sz == "G" else 1}"'))
        b(t(x + 32, 715, sz, 14, "#BDBDBD" if sz == "XG" else INK, 5, "middle"))
    b(t(20, 752, "Só restam 4 no tamanho G", 12, SALE, 5))
    p, _ = pill(0, 0, "Adicionar à sacola", INK, WHITE, 16, 52, 0)
    b(rect(20, 768, 350, 52, INK, 26) + t(195, 800, "Adicionar à sacola", 16, WHITE, 5, "middle"))

    W = 1000
    return svg(W, 1060, "Dream Store, mockup v2 mobile",
               t(60, 60, "Dream Store no celular", 30, INK, 4, cls="d") + phone(90, "Home", "".join(s)) + phone(520, "Produto", "".join(q)),
               rect(0, 0, W, 1060, SURFACE))


def svg(W, H, title, body, bg):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">'
            f'<title>{title}</title><style>{font_css()}{STYLE_EXTRA}</style>'
            f'<defs><linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">'
            f'<stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/>'
            f'</linearGradient></defs>{bg}{body}</svg>')


if __name__ == "__main__":
    (ROOT / "mockup-v2-desktop.svg").write_text(desktop(), encoding="utf-8")
    (ROOT / "mockup-v2-mobile.svg").write_text(mobile(), encoding="utf-8")
    missing = [k for k in PHOTO_BRIEF if not (PHOTOS / f"{k}.jpg").exists()]
    print(f"ok. fotos faltando: {len(missing)} de {len(PHOTO_BRIEF)}")
