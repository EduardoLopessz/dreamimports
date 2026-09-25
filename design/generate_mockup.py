"""Gera os mockups SVG da home (desktop) e das telas mobile da Dream Store.

Uso: python3 design/generate_mockup.py
"""
from pathlib import Path

OUT = Path(__file__).parent

# Tokens de cor (contraste medido: todos os pares de texto >= 4.5:1)
INK = "#1A0F3D"
PAPER = "#F6F3FF"
LAVENDER = "#ECE7FA"
LINE = "#DDD5F5"
MUTED = "#5B5478"
VIOLET = "#6D3AF5"
VIOLET_SOFT = "#E9E2FF"
PINK = "#FF4F9A"
CYAN = "#2EC5E8"
YELLOW = "#FFD23F"
ORANGE = "#FF8A3D"
WHITE = "#FFFFFF"

STYLE = f"""
<style>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&amp;display=swap');
text {{ font-family: Manrope, Poppins, 'Segoe UI', sans-serif; }}
.w4 {{ font-weight: 400; }} .w5 {{ font-weight: 500; }} .w6 {{ font-weight: 600; }} .w7 {{ font-weight: 700; }}
@keyframes marquee {{ from {{ transform: translateX(0); }} to {{ transform: translateX(-1500px); }} }}
.marquee {{ animation: marquee 22s linear infinite; }}
@keyframes spin {{ to {{ transform: rotate(360deg); }} }}
.spin {{ transform-box: fill-box; transform-origin: center; animation: spin 14s linear infinite; }}
@keyframes float {{ 0%,100% {{ transform: translateY(0); }} 50% {{ transform: translateY(-10px); }} }}
.float {{ animation: float 5s cubic-bezier(0.32,0.72,0,1) infinite; }}
.float2 {{ animation: float 6s cubic-bezier(0.32,0.72,0,1) infinite 1.2s; }}
@keyframes pulse {{ 0%,100% {{ opacity: 1; }} 50% {{ opacity: .25; }} }}
.pulse {{ animation: pulse 1.6s ease-in-out infinite; }}
@keyframes toast {{ 0%,8% {{ transform: translateY(24px); opacity: 0; }} 16%,84% {{ transform: translateY(0); opacity: 1; }} 92%,100% {{ transform: translateY(24px); opacity: 0; }} }}
.toast {{ animation: toast 7s cubic-bezier(0.32,0.72,0,1) infinite; }}
@keyframes lit {{ 0%,20% {{ opacity: .28; }} 45%,100% {{ opacity: 1; }} }}
.lit {{ animation: lit 4s cubic-bezier(0.32,0.72,0,1) infinite alternate; }}
@media (prefers-reduced-motion: reduce) {{ .marquee,.spin,.float,.float2,.pulse,.toast,.lit {{ animation: none; }} }}
</style>
"""


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def t(x, y, s, size=16, fill=INK, w=5, anchor="start", extra=""):
    return (f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" class="w{w}" '
            f'text-anchor="{anchor}" {extra}>{esc(s)}</text>')


def rect(x, y, w, h, fill, r=0, extra=""):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" {extra}/>'


def g(inner, x=0, y=0, s=1, cls=""):
    c = f' class="{cls}"' if cls else ""
    return f'<g transform="translate({x} {y}) scale({s})"><g{c}>{inner}</g></g>'


# ---------- Ilustrações (desenhadas numa caixa de 200x200) ----------
def hoodie(c, dark, accent):
    return (f'<path d="M58 66 L26 150 Q24 160 34 163 L50 166 L66 104 Z" fill="{dark}"/>'
            f'<path d="M142 66 L174 150 Q176 160 166 163 L150 166 L134 104 Z" fill="{dark}"/>'
            f'<rect x="54" y="60" width="92" height="120" rx="14" fill="{c}"/>'
            f'<path d="M68 64 Q100 14 132 64 Q100 86 68 64 Z" fill="{dark}"/>'
            f'<path d="M78 62 Q100 34 122 62 Q100 74 78 62 Z" fill="{INK}" opacity=".55"/>'
            f'<rect x="70" y="128" width="60" height="30" rx="10" fill="{dark}"/>'
            f'<path d="M92 72 L91 92 M108 72 L109 92" stroke="{WHITE}" stroke-width="3" stroke-linecap="round"/>'
            f'<circle cx="100" cy="102" r="0" />'
            f'<path d="M110 114 a11 11 0 1 1 -7 -10 a8.5 8.5 0 1 0 7 10 Z" fill="{accent}"/>'
            f'<rect x="54" y="168" width="92" height="12" rx="4" fill="{dark}"/>')


def tee(c, dark, accent):
    return (f'<path d="M62 48 L86 40 Q100 54 114 40 L138 48 L172 80 L152 102 L138 90 L138 172 L62 172 L62 90 L48 102 L28 80 Z" fill="{c}"/>'
            f'<path d="M86 40 Q100 54 114 40" stroke="{dark}" stroke-width="5" fill="none"/>'
            f'<rect x="78" y="92" width="44" height="44" rx="6" fill="{accent}"/>'
            + "".join(f'<rect x="{82 + (i % 4) * 10}" y="{96 + (i // 4) * 10}" width="8" height="8" fill="{INK}" opacity="{0.9 if (i * 7) % 3 else 0.2}"/>' for i in range(16)))


def headset(c, dark, accent):
    return (f'<path d="M48 112 Q48 36 100 36 Q152 36 152 112" stroke="{dark}" stroke-width="14" fill="none" stroke-linecap="round"/>'
            f'<rect x="30" y="96" width="40" height="66" rx="18" fill="{c}"/>'
            f'<rect x="130" y="96" width="40" height="66" rx="18" fill="{c}"/>'
            f'<rect x="38" y="112" width="8" height="34" rx="4" fill="{accent}"/>'
            f'<rect x="154" y="112" width="8" height="34" rx="4" fill="{accent}"/>'
            f'<path d="M50 160 Q58 184 92 180" stroke="{dark}" stroke-width="6" fill="none" stroke-linecap="round"/>'
            f'<circle cx="96" cy="180" r="7" fill="{accent}"/>')


def mouse(c, dark, accent):
    return (f'<path d="M100 26 C142 26 152 70 152 112 C152 162 130 184 100 184 C70 184 48 162 48 112 C48 70 58 26 100 26 Z" fill="{c}"/>'
            f'<path d="M100 26 L100 88 M50 88 L150 88" stroke="{dark}" stroke-width="4"/>'
            f'<rect x="94" y="44" width="12" height="26" rx="6" fill="{dark}"/>'
            f'<path d="M62 150 Q100 172 138 150" stroke="{accent}" stroke-width="6" fill="none" stroke-linecap="round"/>')


def keyboard(c, dark, accent, keys=WHITE):
    s = f'<rect x="12" y="58" width="176" height="96" rx="14" fill="{c}"/>'
    palette = [accent, keys, keys, keys, keys, keys, keys, keys, keys, keys, keys, accent]
    for row in range(4):
        for col in range(11):
            s += f'<rect x="{22 + col * 15}" y="{68 + row * 17}" width="12" height="12" rx="3" fill="{palette[(col + row) % 12]}" opacity="{1 if row < 3 else 0.9}"/>'
    s += f'<rect x="58" y="136" width="84" height="10" rx="3" fill="{dark}"/>'
    return s


def cap(c, dark, accent):
    return (f'<path d="M44 122 Q44 58 104 58 Q160 58 160 122 Z" fill="{c}"/>'
            f'<path d="M36 122 L178 122 Q186 140 160 142 L36 134 Q30 128 36 122 Z" fill="{dark}"/>'
            f'<circle cx="104" cy="58" r="7" fill="{dark}"/>'
            f'<path d="M112 98 a12 12 0 1 1 -8 -11 a9 9 0 1 0 8 11 Z" fill="{accent}"/>')


def mousepad(c, dark, accent):
    return (f'<rect x="14" y="62" width="172" height="92" rx="16" fill="{c}"/>'
            f'<rect x="14" y="62" width="172" height="92" rx="16" fill="none" stroke="{accent}" stroke-width="4"/>'
            f'<path d="M150 104 a18 18 0 1 1 -11 -17 a14 14 0 1 0 11 17 Z" fill="{accent}"/>')


# ---------- Ícones (traço estilo Phosphor) ----------
def icon(name, x, y, color=INK, sw=2, s=1):
    p = {
        "search": '<circle cx="11" cy="11" r="7"/><path d="M16 16 L21 21"/>',
        "heart": '<path d="M12 20 C4 14 2 10 4.5 6.5 C7 3.5 10.5 4.5 12 7.5 C13.5 4.5 17 3.5 19.5 6.5 C22 10 20 14 12 20 Z"/>',
        "bag": '<rect x="4" y="7" width="16" height="14" rx="2.5"/><path d="M8.5 10 V6.5 a3.5 3.5 0 0 1 7 0 V10"/>',
        "user": '<circle cx="12" cy="8" r="4"/><path d="M4 21 C5 16 8.5 14 12 14 C15.5 14 19 16 20 21"/>',
        "menu": '<path d="M4 7 H20 M4 12 H20 M4 17 H20"/>',
        "truck": '<path d="M2 6 H14 V17 H2 Z M14 10 H19 L22 13 V17 H14"/><circle cx="6.5" cy="18" r="2"/><circle cx="17.5" cy="18" r="2"/>',
        "card": '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10 H21.5 M6 15 H10"/>',
        "pix": '<path d="M12 2.5 L21.5 12 L12 21.5 L2.5 12 Z"/><path d="M8 12 L12 8 L16 12 L12 16 Z"/>',
        "swap": '<path d="M4 8 H18 M14 4 L18 8 L14 12 M20 16 H6 M10 12 L6 16 L10 20"/>',
        "home": '<path d="M4 11 L12 4 L20 11 V20 H4 Z"/><path d="M10 20 V14 H14 V20"/>',
        "check": '<path d="M5 12.5 L10 17 L19 7"/>',
        "chat": '<path d="M4 18.5 L5.4 14.5 A8 8 0 1 1 9 18.2 Z"/>',
        "chev": '<path d="M9 5 L16 12 L9 19"/>',
        "chevl": '<path d="M15 5 L8 12 L15 19"/>',
        "close": '<path d="M6 6 L18 18 M18 6 L6 18"/>',
        "gift": '<rect x="3" y="9" width="18" height="12" rx="2"/><path d="M12 9 V21 M3 13 H21 M12 9 C9 3 5 6 8 9 M12 9 C15 3 19 6 16 9"/>',
        "ig": '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6"/>',
        "tiktok": '<path d="M14 3 V15 a4 4 0 1 1 -4 -4 M14 3 C14.5 6 16.5 8 19.5 8.2"/>',
        "yt": '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9 L15 12 L10 15 Z"/>',
    }[name]
    return (f'<g transform="translate({x} {y}) scale({s})" fill="none" stroke="{color}" stroke-width="{sw}" '
            f'stroke-linecap="round" stroke-linejoin="round">{p}</g>')


def star(cx, cy, r, fill=YELLOW):
    import math
    pts = []
    for i in range(10):
        a = math.pi / 2 + i * math.pi / 5
        rr = r if i % 2 == 0 else r * 0.45
        pts.append(f"{cx + rr * math.cos(a):.1f},{cy - rr * math.sin(a):.1f}")
    return f'<polygon points="{" ".join(pts)}" fill="{fill}"/>'


def stars(x, y, n=5, r=8, gap=19, fill=YELLOW):
    return "".join(star(x + i * gap, y, r, fill) for i in range(n))


def logo(x, y, dark=INK, size=24):
    m = size / 24
    return (f'<g transform="translate({x} {y}) scale({m})">'
            f'<rect x="0" y="-22" width="30" height="30" rx="9" fill="{VIOLET}"/>'
            f'<path d="M21 -3 a9 9 0 1 1 -5.5 -12.5 a7 7 0 1 0 5.5 12.5 Z" fill="{YELLOW}"/>'
            f'<circle cx="22" cy="-14" r="1.8" fill="{PINK}"/>'
            f'<text x="40" y="0" font-size="24" fill="{dark}" class="w7" letter-spacing="-0.5">dream</text>'
            f'<text x="112" y="0" font-size="24" fill="{dark}" class="w5" letter-spacing="-0.5">store</text></g>')


def button(x, y, w, h, label, bg=YELLOW, fg=INK, size=16, r=None):
    r = h / 2 if r is None else r
    return rect(x, y, w, h, bg, r) + t(x + w / 2, y + h / 2 + size * 0.36, label, size, fg, 6, "middle")


# ============================================================
# DESKTOP
# ============================================================
def desktop():
    W, PAGE = 1840, 1440
    out = []
    add = out.append

    # ---- 1. Barra de anúncio
    add(rect(0, 0, PAGE, 40, INK))
    add(icon("truck", 404, 8, YELLOW, 1.8, 1))
    add(t(436, 26, "Frete grátis para todo o Brasil acima de R$ 299", 14, WHITE, 5))
    add(star(800, 20, 6, PINK))
    add(t(818, 26, "Use DREAM10 e ganhe 10% na primeira compra", 14, WHITE, 5))

    # ---- 2. Navegação flutuante
    add(rect(120, 60, 1200, 64, WHITE, 32, f'stroke="{LINE}" stroke-width="1" filter="url(#soft)"'))
    add(logo(156, 102))
    links = [("Novidades", True), ("Roupas", False), ("Periféricos", False), ("Drops", False), ("Outlet", False)]
    lx = 520
    for name, active in links:
        wdt = len(name) * 8.6 + 32
        if active:
            add(rect(lx, 76, wdt, 32, VIOLET_SOFT, 16))
        add(t(lx + wdt / 2, 97, name, 14, PINK if name == "Outlet" else INK, 6 if active else 5, "middle"))
        lx += wdt + 8
    for i, ic in enumerate(["search", "heart", "user", "bag"]):
        add(icon(ic, 1136 + i * 44, 80, INK, 2))
    add('<circle cx="1284" cy="80" r="9" fill="%s"/>' % PINK)
    add(t(1284, 84.5, "2", 12, INK, 7, "middle"))

    # ---- 3. Hero
    add(rect(40, 150, 1360, 680, VIOLET, 40))
    # pílula de status
    add(rect(96, 206, 236, 36, "#7F52F7", 18))
    add(f'<circle cx="118" cy="224" r="5" fill="{YELLOW}" class="pulse"/>')
    add(t(132, 229, "Drop Nebula já disponível", 14, WHITE, 6))
    add(t(96, 326, "Vista o jogo.", 72, WHITE, 7, extra='letter-spacing="-2"'))
    add(t(96, 406, "Domine o setup.", 72, WHITE, 7, extra='letter-spacing="-2"'))
    add(t(96, 462, "Moletons, camisetas e periféricos gamer em drops semanais.", 20, VIOLET_SOFT, 5))
    add(t(96, 490, "Peças limitadas, 10x sem juros e 5% off no Pix.", 20, VIOLET_SOFT, 5))
    add(t(96, 546, "O drop termina em", 14, VIOLET_SOFT, 6))
    for i, (num, lab) in enumerate([("02", "dias"), ("14", "horas"), ("37", "min"), ("08", "seg")]):
        bx = 96 + i * 84
        add(rect(bx, 560, 72, 64, INK, 16))
        add(('<g class="pulse">%s</g>' if i == 3 else '%s') % t(bx + 36, 596, num, 30, WHITE, 7, "middle"))
        add(t(bx + 36, 614, lab, 12, "#B9B0D9", 5, "middle"))
    add(button(96, 660, 220, 56, "Comprar o drop"))
    add(stars(348, 680, 5, 8, 19))
    add(t(340, 708, "4,8 de 5 em 12.384 avaliações", 14, WHITE, 5))
    add(t(96, 790, "38 mil pedidos entregues em 2026", 14, VIOLET_SOFT, 5))
    for i, c in enumerate([PINK, CYAN, YELLOW, ORANGE]):
        add(f'<circle cx="{352 + i * 22}" cy="785" r="13" fill="{c}" stroke="{VIOLET}" stroke-width="3"/>')
        add(t(352 + i * 22, 790, "LBTA"[i], 12, INK, 7, "middle"))

    # colagem
    add(rect(800, 190, 300, 340, PINK, 28))
    add(g(hoodie(VIOLET, "#5028C9", YELLOW), 826, 220, 1.25, "float"))
    add(rect(824, 486, 128, 28, WHITE, 14))
    add(t(888, 505, "R$ 289,90", 14, INK, 7, "middle"))
    add(rect(1116, 190, 244, 220, CYAN, 28))
    add(g(headset(INK, "#2A1B5C", PINK), 1158, 206, 0.8, "float2"))
    add(rect(1116, 426, 244, 364, YELLOW, 28))
    add(g(mouse(INK, "#2A1B5C", CYAN), 1138, 500, 1.0, "float"))
    add(t(1140, 462, "Mouse Orbit", 18, INK, 7))
    add(t(1140, 484, "26.000 DPI, 58 g", 14, INK, 5))
    add(rect(800, 546, 300, 244, INK, 28))
    add(g(keyboard("#2A1B5C", VIOLET, PINK, CYAN), 830, 560, 1.2))
    # selo giratório
    add(f'<g transform="translate(1108 538)"><g class="spin"><circle r="58" fill="{ORANGE}"/>'
        f'<path id="ring" d="M -40 0 a 40 40 0 1 1 80 0 a 40 40 0 1 1 -80 0" fill="none"/>'
        f'<text font-size="12" class="w7" fill="{INK}" letter-spacing="1.5"><textPath href="#ring">10x sem juros ✦ 5% no Pix ✦ </textPath></text></g>'
        f'<text y="8" font-size="24" class="w7" fill="{INK}" text-anchor="middle">10x</text></g>')
    # toast de prova social
    add(f'<g class="toast">' + rect(860, 746, 380, 64, WHITE, 20, 'filter="url(#soft)"')
        + rect(872, 758, 40, 40, CYAN, 12) + g(headset(INK, "#2A1B5C", PINK), 874, 760, 0.18)
        + t(924, 776, "Ana, de Curitiba, comprou o Headset Pulse", 14, INK, 6)
        + t(924, 796, "há 3 minutos", 12, MUTED, 5) + "</g>")

    # ---- 4. Marquee
    add(rect(0, 860, PAGE, 60, INK))
    items = [("Drop Nebula", YELLOW), ("Frete grátis acima de R$ 299", WHITE), ("10x sem juros", PINK),
             ("5% off no Pix", CYAN), ("Troca grátis em 30 dias", ORANGE), ("Clube Dream", WHITE)]
    mq, mx = "", 0
    for rep in range(2):
        for s, c in items:
            mq += t(mx, 898, s, 24, c, 7)
            mx += len(s) * 13.2 + 24
            mq += star(mx, 890, 8, VIOLET)
            mx += 40
    add(f'<clipPath id="mclip"><rect x="0" y="860" width="{PAGE}" height="60"/></clipPath>')
    add(f'<g clip-path="url(#mclip)"><g class="marquee">{mq}</g></g>')

    # ---- 5. Categorias
    add(t(40, 1012, "Compre por categoria", 36, INK, 7, extra='letter-spacing="-1"'))
    add(t(1400, 1008, "Ver todas", 16, VIOLET, 6, "end"))
    add(icon("chev", 1404, 994, VIOLET, 2, 0.8))
    cats = [("Moletons", "148 produtos", VIOLET, hoodie(PINK, "#E0357F", YELLOW), WHITE),
            ("Camisetas", "236 produtos", PINK, tee(WHITE, VIOLET, CYAN), INK),
            ("Bonés", "64 produtos", YELLOW, cap(INK, VIOLET, PINK), INK),
            ("Headsets", "41 produtos", CYAN, headset(INK, VIOLET, YELLOW), INK),
            ("Teclados", "57 produtos", INK, keyboard(VIOLET, PINK, YELLOW), WHITE),
            ("Mouses", "73 produtos", ORANGE, mouse(INK, VIOLET, CYAN), INK)]
    tw = (1360 - 80) / 6
    for i, (name, count, bg, ill, fg) in enumerate(cats):
        x = 40 + i * (tw + 16)
        add(rect(x, 1044, tw, 300, bg, 28))
        add(t(x + 24, 1084, name, 24, fg, 7))
        add(t(x + 24, 1108, count, 14, fg, 5, extra='opacity=".85"'))
        add(g(ill, x + tw / 2 - 72, 1170, 0.72))

    # ---- 6. Drop da semana
    add(t(40, 1440, "Drop da semana", 36, INK, 7, extra='letter-spacing="-1"'))
    add(t(40, 1472, "Estoque limitado. Quando acaba, não volta.", 18, MUTED, 5))
    chips = ["Tudo", "Roupas", "Periféricos", "Mais vendidos", "Até R$ 200"]
    cx = 1400 - 820 - sum(len(c) * 8.4 + 44 for c in chips) + 8
    for i, chip in enumerate(chips):
        wdt = len(chip) * 8.4 + 36
        add(rect(cx + 820, 1418, wdt, 40, INK if i == 0 else WHITE, 20,
                 "" if i == 0 else f'stroke="{LINE}"'))
        add(t(cx + 820 + wdt / 2, 1443, chip, 14, WHITE if i == 0 else INK, 6, "middle"))
        cx += wdt + 8
    prods = [
        ("Moletom Nebula Oversized", "R$ 289,90", None, "R$ 275,40", "10x de R$ 28,99", "4,9 (1.284)", VIOLET_SOFT,
         hoodie(VIOLET, "#5028C9", YELLOW), ("Novo", YELLOW), [VIOLET, INK, PINK]),
        ("Headset Pulse 7.1 Wireless", "R$ 384,90", "R$ 499,90", "R$ 365,66", "10x de R$ 38,49", "4,8 (2.917)", CYAN,
         headset(INK, "#2A1B5C", PINK), ("23% off", PINK), [INK, WHITE]),
        ("Camiseta Pixel Heavy", "R$ 139,90", None, "R$ 132,91", "10x de R$ 13,99", "4,7 (864)", YELLOW,
         tee(WHITE, VIOLET, PINK), ("Últimas 7 unidades", ORANGE), [WHITE, INK, YELLOW]),
        ("Mouse Orbit 26K", "R$ 219,90", None, "R$ 208,91", "10x de R$ 21,99", "4,9 (3.402)", PINK,
         mouse(INK, "#2A1B5C", CYAN), ("Mais vendido", CYAN), [INK, WHITE, PINK]),
    ]
    pw = (1360 - 3 * 24) / 4
    for i, (name, price, old, pix, inst, rating, bg, ill, badge, swatches) in enumerate(prods):
        x = 40 + i * (pw + 24)
        add(rect(x, 1500, pw, 380, bg, 28))
        add(g(ill, x + pw / 2 - 110, 1570, 1.1, "float" if i % 2 == 0 else "float2"))
        bw = len(badge[0]) * 7.6 + 24
        add(rect(x + 16, 1516, bw, 30, badge[1], 15))
        add(t(x + 16 + bw / 2, 1536, badge[0], 12, INK, 7, "middle"))
        add(f'<circle cx="{x + pw - 36}" cy="1536" r="20" fill="{WHITE}"/>')
        add(icon("heart", x + pw - 48, 1524, INK, 2))
        if i == 1:  # hover state mostrado
            add(button(x + 16, 1816, pw - 32, 48, "Adicionar à sacola", INK, WHITE, 14, 16))
        for j, sc in enumerate(swatches):
            add(f'<circle cx="{x + 12 + j * 24}" cy="1906" r="8" fill="{sc}" stroke="{LINE}" stroke-width="1.5"/>')
        add(stars(x + pw - 110, 1906, 1, 7, 0))
        add(t(x + pw - 98, 1911, rating, 14, MUTED, 5))
        add(t(x, 1942, name, 18, INK, 6))
        if old:
            add(t(x, 1972, old, 14, MUTED, 5, extra='text-decoration="line-through"'))
            add(t(x + 90, 1972, price, 20, INK, 7))
        else:
            add(t(x, 1972, price, 20, INK, 7))
        add(t(x, 1998, f"{pix} no Pix", 14, "#0E7C5A", 6))
        add(t(x, 2020, f"ou {inst} sem juros", 14, MUTED, 5))

    # ---- 7. Kit / bundle
    add(rect(40, 2090, 1360, 470, INK, 40))
    add(rect(88, 2138, 200, 32, "#2A1B5C", 16))
    add(icon("gift", 100, 2142, YELLOW, 1.8, 1))
    add(t(130, 2159, "Kit Nebula Setup", 14, YELLOW, 6))
    for k, ln in enumerate(["Monte seu kit.", "Leve os três e", "pague 15% menos."]):
        add(t(88, 2226 + k * 54, ln, 48, WHITE, 7, extra='letter-spacing="-1"'))
    add(t(88, 2376, "Moletom, headset e mousepad que combinam de verdade.", 18, "#B9B0D9", 5))
    add(t(88, 2420, "De R$ 802,70", 16, "#B9B0D9", 5, extra='text-decoration="line-through"'))
    add(t(88, 2460, "R$ 682,30", 36, WHITE, 7))
    add(rect(290, 2434, 196, 32, "#0E7C5A", 16))
    add(t(388, 2455, "Economize R$ 120,40", 14, WHITE, 6, "middle"))
    add(button(88, 2484, 240, 48, "Adicionar o kit", YELLOW, INK, 16))
    kit = [(PINK, hoodie(VIOLET, "#5028C9", YELLOW), "Moletom Nebula"),
           (CYAN, headset(INK, "#2A1B5C", PINK), "Headset Pulse"),
           (ORANGE, mousepad(INK, VIOLET, YELLOW), "Mousepad Void XL")]
    for i, (bg, ill, name) in enumerate(kit):
        x = 720 + i * 224
        add(rect(x, 2170, 200, 240, bg, 24))
        add(g(ill, x + 20, 2186, 0.8))
        add(rect(x + 16, 2360, 168, 34, WHITE, 17))
        add(icon("check", x + 24, 2365, "#0E7C5A", 2.4, 1))
        add(t(x + 50, 2382, name, 14, INK, 6))
        if i < 2:
            add(f'<circle cx="{x + 216}" cy="2290" r="16" fill="{VIOLET}"/>')
            add(t(x + 216, 2298, "+", 24, WHITE, 7, "middle"))
    add(t(720, 2460, "Combina com o seu estilo? 1.912 pessoas montaram este kit.", 14, "#B9B0D9", 5))

    # ---- 8. Tagline reveal (palavras acendem com o scroll)
    ts = "".join(f'<tspan opacity="{1 if k < 4 else 0.28}">{w} </tspan>' for k, w in enumerate(["Seu", "setup", "diz", "quem", "você", "é."]))
    add(f'<text x="720" y="2690" font-size="60" class="w7" fill="{INK}" text-anchor="middle" letter-spacing="-1.5">{ts}</text>')
    ts = "".join(f'<tspan class="lit" opacity="0.28" style="animation-delay:{k * 0.4}s">{w} </tspan>' for k, w in enumerate(["Seu", "estilo", "também."]))
    add(f'<text x="720" y="2766" font-size="60" class="w7" fill="{INK}" text-anchor="middle" letter-spacing="-1.5">{ts}</text>')
    add(t(720, 2830, "Roupas e periféricos pensados juntos, drop após drop.", 18, MUTED, 5, "middle"))

    # ---- 9. Prova social + UGC
    add(t(40, 2950, "Quem joga, veste Dream", 36, INK, 7, extra='letter-spacing="-1"'))
    add(t(1400, 2944, "4,8", 48, INK, 7, "end"))
    add(stars(1200, 2918, 5, 9, 21))
    add(t(1296, 2966, "12.384 avaliações verificadas", 14, MUTED, 5, "end"))
    reviews = [
        ("Larissa Okamoto", "São Paulo, SP", "O moletom Nebula é pesado do jeito certo e o caimento oversized ficou perfeito. Chegou em 3 dias.", "Moletom Nebula, tam. G", PINK),
        ("Thiago Brandão", "Recife, PE", "Troquei meu headset antigo pelo Pulse e a diferença no Valorant é absurda. Bateria dura a semana.", "Headset Pulse 7.1", CYAN),
        ("Beatriz Nunes", "Belo Horizonte, MG", "Montei o kit completo e economizei. A caixa veio caprichada, parece presente.", "Kit Nebula Setup", YELLOW),
    ]
    rw = (1360 - 48) / 3
    for i, (nm, city, txt, prod, col) in enumerate(reviews):
        x = 40 + i * (rw + 24)
        add(rect(x, 2996, rw, 236, WHITE, 28, f'stroke="{LINE}"'))
        add(f'<circle cx="{x + 48}" cy="3044" r="24" fill="{col}"/>')
        add(t(x + 48, 3051, "".join(p[0] for p in nm.split()), 16, INK, 7, "middle"))
        add(t(x + 84, 3038, nm, 16, INK, 6))
        add(t(x + 84, 3060, city, 14, MUTED, 5))
        add(stars(x + rw - 110, 3040, 5, 7, 16))
        words, line, ly = txt.split(), "", 3110
        for wd in words:
            if len(line + " " + wd) > 46:
                add(t(x + 24, ly, line.strip(), 16, INK, 5)); ly += 26; line = ""
            line += " " + wd
        add(t(x + 24, ly, line.strip(), 16, INK, 5))
        add(icon("check", x + 24, 3190, "#0E7C5A", 2.2, 0.8))
        add(t(x + 48, 3205, f"Compra verificada: {prod}", 14, "#0E7C5A", 6))
    ugc = [(VIOLET, keyboard("#2A1B5C", PINK, YELLOW, CYAN), "@kaue.plays"),
           (PINK, hoodie(INK, "#2A1B5C", CYAN), "@maju.gg"),
           (CYAN, mouse(VIOLET, INK, YELLOW), "@setupdotiago"),
           (ORANGE, cap(VIOLET, INK, YELLOW), "@lari.okamoto"),
           (YELLOW, headset(VIOLET, INK, PINK), "@renan.fps"),
           (INK, tee(PINK, YELLOW, CYAN), "@bia.nunes")]
    uw = (1360 - 5 * 16) / 6
    for i, (bg, ill, handle) in enumerate(ugc):
        x = 40 + i * (uw + 16)
        add(rect(x, 3260, uw, uw, bg, 24))
        add(g(ill, x + uw / 2 - 64, 3260 + uw / 2 - 72, 0.64))
        add(rect(x + 12, 3260 + uw - 44, len(handle) * 7.4 + 24, 32, WHITE, 16))
        add(t(x + 24, 3260 + uw - 23, handle, 12, INK, 6))
    add(t(40, 3520, "Poste seu setup com #dreamsetup e apareça aqui.", 16, MUTED, 5))

    # ---- 10. Benefícios
    add(rect(40, 3560, 1360, 128, WHITE, 28, f'stroke="{LINE}"'))
    bens = [("truck", "Frete grátis", "Acima de R$ 299 para todo o Brasil", VIOLET),
            ("card", "10x sem juros", "Em todos os cartões", PINK),
            ("pix", "5% off no Pix", "Aprovação na hora", "#0E7C5A"),
            ("swap", "Troca grátis", "Em até 30 dias, sem burocracia", ORANGE)]
    for i, (ic, h, s, c) in enumerate(bens):
        x = 80 + i * 336
        add(rect(x, 3596, 56, 56, c, 16))
        add(icon(ic, x + 14, 3610, WHITE, 2, 1.17))
        add(t(x + 76, 3620, h, 18, INK, 7))
        add(t(x + 76, 3644, s, 14, MUTED, 5))

    # ---- 11. Clube Dream / newsletter
    add(rect(40, 3728, 1360, 320, PINK, 40))
    add(t(96, 3812, "Ganhe 10% na primeira compra", 48, INK, 7, extra='letter-spacing="-1"'))
    add(t(96, 3856, "Entre no Clube Dream: acesso antecipado aos drops,", 18, INK, 5))
    add(t(96, 3882, "cupons exclusivos e pontos em cada pedido.", 18, INK, 5))
    add(rect(96, 3920, 420, 56, WHITE, 28))
    add(t(124, 3954, "Seu melhor email", 16, MUTED, 5))
    add(button(528, 3920, 200, 56, "Quero meu cupom", INK, WHITE))
    add(t(96, 4010, "Sem spam. Você cancela quando quiser.", 14, INK, 5))
    add(g(hoodie(VIOLET, "#5028C9", YELLOW), 900, 3730, 1.5, "float"))
    add(g(cap(YELLOW, ORANGE, VIOLET), 1150, 3820, 1.0, "float2"))

    # ---- 12. Rodapé
    add(rect(0, 4100, PAGE, 340, INK))
    add(logo(40, 4180, WHITE, 28))
    add(t(40, 4220, "Streetwear e periféricos gamer em drops semanais.", 14, "#B9B0D9", 5))
    for i, ic in enumerate(["ig", "tiktok", "yt"]):
        add(rect(40 + i * 52, 4244, 40, 40, "#2A1B5C", 12))
        add(icon(ic, 48 + i * 52, 4252, WHITE, 1.8, 1))
    cols = [("Loja", ["Novidades", "Roupas", "Periféricos", "Drops", "Outlet"]),
            ("Ajuda", ["Rastrear pedido", "Trocas e devoluções", "Prazos de entrega", "Fale com a gente"]),
            ("Dream", ["Sobre a marca", "Clube Dream", "Trabalhe conosco", "Blog"])]
    for i, (h, ls) in enumerate(cols):
        x = 560 + i * 220
        add(t(x, 4168, h, 16, WHITE, 7))
        for j, l in enumerate(ls):
            add(t(x, 4204 + j * 30, l, 14, "#B9B0D9", 5))
    add(t(1220, 4168, "Pagamento", 16, WHITE, 7))
    for i, p in enumerate(["Pix", "Visa", "Master", "Elo", "Boleto", "Amex"]):
        x, y = 1220 + (i % 3) * 62, 4188 + (i // 3) * 40
        add(rect(x, y, 54, 30, "#2A1B5C", 8))
        add(t(x + 27, y + 20, p, 12, WHITE, 6, "middle"))
    add(rect(40, 4360, 1360, 1, "#2A1B5C"))
    add(t(40, 4404, "© 2026 Dream Store. Todos os direitos reservados.", 14, "#B9B0D9", 5))
    for lbl, xx in [("Política de privacidade", 1100), ("Termos de uso", 1276), ("Cookies", 1400)]:
        add(t(xx, 4404, lbl, 14, "#B9B0D9", 5, "end"))

    # botão de chat flutuante

    # ---- Coluna de anotações
    ann = []
    ann.append(rect(1440, 0, W - 1440, 4440, LAVENDER))
    ann.append(t(1480, 64, "Dream Store", 30, INK, 7))
    ann.append(t(1480, 92, "Mockup da home, desktop 1440 px", 14, MUTED, 5))
    ann.append(t(1480, 112, "Abra no navegador para ver as animações", 14, MUTED, 5))
    y0 = 2250
    ann.append(rect(1480, y0, 320, 124, WHITE, 16))
    for i, (c, n) in enumerate([(VIOLET, "Violeta"), (PINK, "Rosa"), (CYAN, "Ciano"), (YELLOW, "Amarelo"), (ORANGE, "Laranja"), (INK, "Tinta")]):
        x = 1496 + (i % 3) * 100
        y = y0 + 16 + (i // 3) * 52
        ann.append(rect(x, y, 32, 32, c, 10))
        ann.append(t(x + 40, y + 21, n, 12, INK, 6))
    notes = [
        (130, "Barra de anúncio", ["Frete grátis e cupom de 1ª compra", "sempre visíveis no topo"]),
        (244, "Hero com drop", ["Contagem regressiva gera urgência", "Um único CTA, prova social ao lado", "Toast \"alguém comprou há 3 min\""]),
        (860, "Faixa animada", ["Reforça as vantagens em loop"]),
        (980, "Categorias em cores", ["Cada categoria tem uma cor fixa", "que se repete no site todo"]),
        (1400, "Drop da semana", ["Selos: novo, % off, últimas unidades", "Preço no Pix e parcelamento", "Estado de hover: adicionar à sacola"]),
        (2090, "Kit com desconto", ["Aumenta o ticket médio (bundle)", "Mostra a economia em reais"]),
        (2600, "Frase de marca", ["Palavras acendem uma a uma", "conforme a página rola"]),
        (2900, "Prova social", ["Nota média, compras verificadas", "e fotos de clientes (#dreamsetup)"]),
        (3560, "Garantias", ["Reduz o risco antes da compra"]),
        (3728, "Clube Dream", ["Captura de email com cupom de 10%", "Programa de pontos e acesso antecipado"]),
        (4100, "Rodapé", ["Ajuda, pagamentos e links legais"]),
    ]
    for i, (yy, h, lines) in enumerate(notes):
        ann.append(rect(1480, yy, 320, 40 + 22 * len(lines), WHITE, 16))
        ann.append(f'<circle cx="1504" cy="{yy + 24}" r="12" fill="{VIOLET}"/>')
        ann.append(t(1504, yy + 29, str(i + 1), 12, WHITE, 7, "middle"))
        ann.append(t(1526, yy + 29, h, 16, INK, 7))
        for j, l in enumerate(lines):
            ann.append(t(1496, yy + 54 + j * 22, l, 14, MUTED, 5))
    # marcadores nas seções
    for i, (yy, _, _) in enumerate(notes):
        ann.append(f'<circle cx="1440" cy="{yy + 24}" r="4" fill="{VIOLET}"/>')

    body = "".join(out) + "".join(ann)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} 4440" width="{W}" height="4440">'
            f'<title>Dream Store, mockup da home</title>{STYLE}'
            f'<defs><filter id="soft" x="-20%" y="-20%" width="140%" height="160%">'
            f'<feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="{VIOLET}" flood-opacity=".14"/></filter></defs>'
            f'{rect(0, 0, 1440, 4440, PAPER)}{body}</svg>')


# ============================================================
# MOBILE (3 telas)
# ============================================================
def phone(x0, title, inner):
    return (f'<g transform="translate({x0} 120)">'
            f'<rect x="-12" y="-12" width="414" height="868" rx="56" fill="{INK}"/>'
            f'<clipPath id="clip{x0}"><rect width="390" height="844" rx="44"/></clipPath>'
            f'<g clip-path="url(#clip{x0})">{rect(0, 0, 390, 844, PAPER)}{inner}'
            f'{t(28, 34, "9:41", 14, INK, 7)}{rect(330, 22, 28, 14, INK, 4)}</g>'
            f'<rect x="135" y="10" width="120" height="30" rx="15" fill="{INK}"/>'
            f'</g>{t(x0 + 195, 1020, title, 18, INK, 7, "middle")}')


def mobile():
    s1 = []
    a = s1.append
    a(rect(0, 50, 390, 30, INK))
    a(t(195, 70, "Frete grátis acima de R$ 299", 12, WHITE, 6, "middle"))
    a(icon("menu", 20, 94, INK, 2))
    a(logo(108, 118, INK, 22))
    a(icon("search", 306, 94, INK, 2))
    a(icon("bag", 346, 94, INK, 2))
    a(f'<circle cx="368" cy="96" r="8" fill="{PINK}"/>' + t(368, 100, "2", 11, INK, 7, "middle"))
    a(rect(16, 136, 358, 568, VIOLET, 32))
    a(rect(36, 164, 206, 30, "#7F52F7", 15))
    a(f'<circle cx="54" cy="179" r="4" fill="{YELLOW}" class="pulse"/>')
    a(t(66, 184, "Drop Nebula já disponível", 12, WHITE, 6))
    a(t(36, 240, "Vista o jogo.", 36, WHITE, 7, extra='letter-spacing="-1"'))
    a(t(36, 280, "Domine o setup.", 36, WHITE, 7, extra='letter-spacing="-1"'))
    a(t(36, 312, "Drops semanais, 10x sem juros e 5% no Pix.", 14, VIOLET_SOFT, 5))
    for i, (n, l) in enumerate([("02", "dias"), ("14", "h"), ("37", "min"), ("08", "s")]):
        a(rect(36 + i * 60, 332, 52, 48, INK, 12))
        a(t(62 + i * 60, 358, n, 20, WHITE, 7, "middle"))
        a(t(62 + i * 60, 373, l, 11, "#B9B0D9", 5, "middle"))
    a(rect(36, 400, 150, 180, PINK, 20))
    a(g(hoodie(VIOLET, "#5028C9", YELLOW), 43, 415, 0.68, "float"))
    a(rect(198, 400, 156, 84, CYAN, 20))
    a(g(headset(INK, "#2A1B5C", PINK), 246, 404, 0.38))
    a(rect(198, 496, 156, 84, YELLOW, 20))
    a(g(mouse(INK, "#2A1B5C", CYAN), 246, 500, 0.38))
    a(button(36, 600, 318, 52, "Comprar o drop"))
    a(stars(92, 678, 5, 6, 14))
    a(t(162, 683, "4,8 de 5 em 12.384 avaliações", 12, WHITE, 5))
    a(t(16, 734, "Compre por categoria", 18, INK, 7))
    for i, (n, c) in enumerate([("Moletons", VIOLET), ("Camisetas", PINK), ("Headsets", CYAN), ("Teclados", YELLOW)]):
        a(rect(16 + i * 92, 744, 84, 28, c, 14))
        a(t(58 + i * 92, 762, n, 12, WHITE if c == VIOLET else INK, 6, "middle"))
    # tab bar
    a(rect(0, 780 + 0, 390, 64, WHITE, 0, f'stroke="{LINE}"'))
    for i, (ic, l) in enumerate([("home", "Início"), ("search", "Buscar"), ("heart", "Favoritos"), ("bag", "Sacola"), ("user", "Conta")]):
        cx = 39 + i * 78
        a(icon(ic, cx - 12, 790, VIOLET if i == 0 else MUTED, 2))
        a(t(cx, 830, l, 11, VIOLET if i == 0 else MUTED, 6, "middle"))

    s2 = []
    a = s2.append
    a(rect(0, 0, 390, 430, PINK))
    a(f'<circle cx="36" cy="80" r="20" fill="{WHITE}"/>' + icon("chevl", 24, 68, INK, 2))
    a(f'<circle cx="354" cy="80" r="20" fill="{WHITE}"/>' + icon("heart", 342, 68, INK, 2))
    a(g(hoodie(VIOLET, "#5028C9", YELLOW), 55, 110, 1.4, "float"))
    for i in range(4):
        a(rect(163 + i * 18, 404, 12 if i else 24, 6, INK if i == 0 else WHITE, 3) if i == 0 else
          rect(175 + i * 18, 404, 12, 6, WHITE, 3))
    a(rect(16, 446, 58, 26, YELLOW, 13) + t(45, 463, "Novo", 12, INK, 7, "middle"))
    a(rect(82, 446, 168, 26, WHITE, 13, f'stroke="{LINE}"'))
    a(f'<circle cx="96" cy="459" r="4" fill="{PINK}" class="pulse"/>')
    a(t(106, 463, "23 pessoas vendo agora", 12, INK, 6))
    a(t(16, 504, "Moletom Nebula Oversized", 24, INK, 7))
    a(stars(24, 528, 5, 7, 16))
    a(t(104, 533, "4,9 (1.284 avaliações)", 12, MUTED, 5))
    a(t(16, 574, "R$ 289,90", 30, INK, 7))
    a(t(16, 598, "R$ 275,40 no Pix ou 10x de R$ 28,99", 14, "#0E7C5A", 6))
    a(t(16, 636, "Tamanho", 14, INK, 7))
    a(t(374, 636, "Guia de medidas", 12, VIOLET, 6, "end"))
    for i, sz in enumerate(["P", "M", "G", "GG", "XG"]):
        x = 16 + i * 72
        sel, out_ = sz == "G", sz == "XG"
        a(rect(x, 648, 64, 44, INK if sel else WHITE, 14, "" if sel else f'stroke="{LINE}"'))
        a(t(x + 32, 676, sz, 14, WHITE if sel else (MUTED if out_ else INK), 6, "middle"))
        if out_:
            a(f'<path d="M{x + 8} 686 L{x + 56} 654" stroke="{MUTED}" stroke-width="1.5"/>')
    a(t(16, 716, "Só restam 4 no tamanho G", 12, ORANGE, 7))
    a(rect(0, 740, 390, 104, WHITE, 0, f'stroke="{LINE}"'))
    a(button(16, 756, 358, 52, "Adicionar à sacola", VIOLET, WHITE))
    a(icon("truck", 88, 814, MUTED, 1.8, 0.8))
    a(t(112, 830, "Chega entre 29/09 e 02/10", 12, MUTED, 5))

    s3 = []
    a = s3.append
    a(rect(0, 0, 390, 844, "#1A0F3D", 0, 'opacity=".45"'))
    a(rect(0, 60, 390, 784, WHITE, 28))
    a(t(20, 104, "Sua sacola (2)", 20, INK, 7))
    a(icon("close", 346, 86, INK, 2))
    a(rect(20, 124, 350, 68, LAVENDER, 16))
    a(t(36, 150, "Faltam R$ 39,20 para o frete grátis", 14, INK, 6))
    a(rect(36, 166, 318, 10, WHITE, 5))
    a(rect(36, 166, 276, 10, VIOLET, 5))
    items = [(YELLOW, tee(WHITE, VIOLET, PINK), "Camiseta Pixel Heavy", "Branca, M", "R$ 139,90"),
             (ORANGE, cap(INK, VIOLET, PINK), "Boné Dream Classic", "Preto, único", "R$ 119,90")]
    for i, (bg, ill, n, v, p) in enumerate(items):
        y = 212 + i * 108
        a(rect(20, y, 88, 88, bg, 16))
        a(g(ill, 24, y + 4, 0.4))
        a(t(124, y + 24, n, 16, INK, 6))
        a(t(124, y + 46, v, 12, MUTED, 5))
        a(rect(124, y + 58, 92, 30, WHITE, 15, f'stroke="{LINE}"'))
        a(t(140, y + 78, "−", 14, INK, 7) + t(170, y + 78, "1", 14, INK, 7, "middle") + t(200, y + 78, "+", 14, INK, 7, "middle"))
        a(t(370, y + 78, p, 16, INK, 7, "end"))
    a(t(20, 460, "Complete o look", 16, INK, 7))
    a(rect(20, 474, 350, 84, PAPER, 16))
    a(rect(32, 486, 60, 60, CYAN, 12))
    a(g(mousepad(INK, VIOLET, YELLOW), 32, 486, 0.3))
    a(t(104, 508, "Mousepad Void XL", 14, INK, 6))
    a(t(104, 530, "R$ 127,90", 14, INK, 7))
    a(rect(290, 498, 68, 36, VIOLET, 18) + t(324, 521, "Incluir", 12, WHITE, 7, "middle"))
    a(rect(20, 574, 350, 48, WHITE, 24, f'stroke="{LINE}"'))
    a(t(40, 603, "Cupom de desconto", 14, MUTED, 5))
    a(t(350, 603, "Aplicar", 14, VIOLET, 7, "end"))
    a(t(20, 660, "Subtotal", 16, MUTED, 5) + t(370, 660, "R$ 259,80", 16, INK, 7, "end"))
    a(t(20, 686, "No Pix (5% off)", 14, "#0E7C5A", 6) + t(370, 686, "R$ 246,81", 14, "#0E7C5A", 7, "end"))
    a(t(20, 710, "ou 10x de R$ 25,98 sem juros", 12, MUTED, 5))
    a(button(20, 736, 350, 56, "Finalizar compra", VIOLET, WHITE))
    a(t(195, 816, "Pagamento seguro e troca grátis em 30 dias", 12, MUTED, 5, "middle"))

    W = 1500
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} 1080" width="{W}" height="1080">'
            f'<title>Dream Store, mockup mobile</title>{STYLE}'
            f'{rect(0, 0, W, 1080, LAVENDER)}'
            f'{t(60, 64, "Dream Store no celular", 30, INK, 7)}'
            f'{t(60, 92, "Home, página de produto e sacola com barra de frete grátis", 16, MUTED, 5)}'
            f'{phone(90, "Home", "".join(s1))}{phone(555, "Produto", "".join(s2))}{phone(1020, "Sacola", "".join(s3))}'
            f'</svg>')


if __name__ == "__main__":
    (OUT / "mockup-desktop.svg").write_text(desktop(), encoding="utf-8")
    (OUT / "mockup-mobile.svg").write_text(mobile(), encoding="utf-8")
    print("ok")
