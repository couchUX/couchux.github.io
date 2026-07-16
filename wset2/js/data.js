// ─── WSET 2 STUDY DATA ──────────────────────────────────────────
// Static reference data for the study tabs. Quiz questions live in
// data/questions.json so they can be extended without touching code.

const EXAM_LOS = [
  { id: 1, name: "Vineyard & Viticulture", q: 5  },
  { id: 2, name: "Winemaking",             q: 4  },
  { id: 3, name: "Principal Varieties",    q: 19, priority: true },
  { id: 4, name: "Regional Varieties",     q: 12, priority: true },
  { id: 5, name: "Sparkling & Fortified",  q: 6  },
  { id: 6, name: "Storage & Service",      q: 4  },
];
const LO_COLORS = ["#4A7C5F","#5B8A6A","#1A3228","#2D5241","#7A5C3C","#6B7B5A"];

const VARIETIES = [
  { id:1, lo:3, name:"Merlot", type:"red", color:"#9B111E", tannin:"Medium", acid:"Medium", body:"Med-full", key:"Plum, blackberry, red cherry, chocolate, rounded and soft", style:"Softer and more approachable than Cab Sauv. Ripens earlier. Right Bank Bordeaux.", regions:[{r:"Saint-Émilion, Pomerol", c:"🇫🇷 France", n:"Right Bank"}, {r:"Napa Valley", c:"🇺🇸 USA"}, {r:"Central Valley", c:"🇨🇱 Chile"}], terms:["Grand Cru Classé ⭐⭐⭐"] },
  { id:2, lo:3, name:"Cabernet Sauvignon", type:"red", color:"#4A0404", tannin:"High", acid:"Med+", body:"Full", key:"Blackcurrant, cedar, green pepper (cool), cassis, tobacco", style:"Structured, ageworthy. Left Bank Bordeaux benchmark. Needs time to soften.", regions:[{r:"Haut-Médoc, Pauillac, Margaux", c:"🇫🇷 France", n:"Left Bank"}, {r:"Coonawarra, Margaret River", c:"🇦🇺 Australia"}, {r:"Stellenbosch", c:"🇿🇦 S. Africa"}], terms:["Cru Bourgeois ⭐⭐"] },
  { id:3, lo:3, name:"Syrah / Shiraz", type:"red", color:"#301934", tannin:"High", acid:"Medium", body:"Full", key:"Cool: black pepper, violet. Warm: jammy black fruit, chocolate", style:"N. Rhône = elegant, peppery. Barossa = powerful, jammy.", regions:[{r:"Hermitage, Côte Rôtie", c:"🇫🇷 France"}, {r:"Barossa Valley, Hunter Valley", c:"🇦🇺 Australia"}], terms:[] },
  { id:4, lo:3, name:"Pinot Noir", type:"red", color:"#B03060", tannin:"Low-med", acid:"High", body:"Light-med", key:"Red cherry, strawberry, forest floor with age", style:"Silky, climate-sensitive. Burgundy is gold standard.", regions:[{r:"Gevrey-Chambertin, Pommard", c:"🇫🇷 France"}, {r:"Sonoma, Oregon", c:"🇺🇸 USA"}, {r:"Central Otago", c:"🇳🇿 NZ"}], terms:["Premier Cru ⭐⭐", "Grand Cru ⭐⭐⭐"] },
  { id:5, lo:3, name:"Chardonnay", type:"white", color:"#E6C229", tannin:"None", acid:"Medium", body:"Med-full", key:"Cool: apple, mineral. Warm: peach, tropical. Oak: vanilla, cream.", style:"Enormous range — lean (Chablis) to opulent/buttery (Napa).", regions:[{r:"Chablis, Meursault, Pouilly-Fuissé", c:"🇫🇷 France"}, {r:"Sonoma, Napa", c:"🇺🇸 USA"}, {r:"Margaret River", c:"🇦🇺 Australia"}], terms:["Premier Cru ⭐⭐"] },
  { id:6, lo:3, name:"Sauvignon Blanc", type:"white", color:"#D4E157", tannin:"None", acid:"High", body:"Light-med", key:"Grass, gooseberry, green pepper, passion fruit", style:"Crisp, aromatic. Sancerre = mineral. Marlborough = tropical.", regions:[{r:"Sancerre, Pouilly-Fumé", c:"🇫🇷 France"}, {r:"Marlborough", c:"🇳🇿 NZ"}, {r:"Casablanca", c:"🇨🇱 Chile"}], terms:[] },
  { id:7, lo:3, name:"Riesling", type:"white", color:"#FDFD96", tannin:"None", acid:"High", body:"Light-med", key:"Green apple, floral. Petrol with bottle age.", style:"Bone dry to sweet. High acidity = exceptional aging.", regions:[{r:"Mosel, Rheingau", c:"🇩🇪 Germany"}, {r:"Alsace", c:"🇫🇷 France"}, {r:"Clare Valley, Eden Valley", c:"🇦🇺 Australia"}], terms:["Kabinett", "Spätlese"] },
  { id:8, lo:3, name:"Pinot Gris / Grigio", type:"white", color:"#FFFACD", tannin:"None", acid:"Medium", body:"Light-Full", key:"Stone fruit, pear, spice.", style:"Italian = light, crisp. Alsace = rich, off-dry to sweet, spicy.", regions:[{r:"Alsace", c:"🇫🇷 France"}, {r:"Delle Venezie", c:"🇮🇹 Italy"}], terms:["Grand Cru ⭐⭐⭐"] },
  { id:9, lo:4, name:"Gamay", type:"red", color:"#DDA0DD", tannin:"Low", acid:"High", body:"Light", key:"Red fruit, banana (carbonic maceration), bubblegum", style:"Light, fresh. Carbonic maceration amplifies fruit. Serve lightly chilled.", regions:[{r:"Beaujolais, Fleurie", c:"🇫🇷 France"}], terms:["Cru ⭐⭐"] },
  { id:10, lo:4, name:"Grenache / Garnacha", type:"red", color:"#E0115F", tannin:"Low-med", acid:"Low-med", body:"Medium", key:"Strawberry, spice, leather. High alcohol.", style:"Often blended (GSM). Priorat = very concentrated. Backbone of Provence rosé.", regions:[{r:"Châteauneuf-du-Pape", c:"🇫🇷 France"}, {r:"Priorat", c:"🇪🇸 Spain"}], terms:[] },
  { id:11, lo:4, name:"Tempranillo", type:"red", color:"#8B0000", tannin:"Medium", acid:"Medium", body:"Medium", key:"Red cherry, leather, vanilla (aged)", style:"Spain's flagship. Crianza → Gran Reserva ladder. American oak = coconut/vanilla.", regions:[{r:"Rioja, Ribera del Duero", c:"🇪🇸 Spain"}], terms:["Crianza ⏳", "Reserva ⏳⏳", "Gran Reserva ⭐⭐⭐"] },
  { id:12, lo:4, name:"Nebbiolo", type:"red", color:"#800000", tannin:"Very high", acid:"High", body:"Full", key:"Tar, rose, leather, dried fruit. Pale garnet color.", style:"Austere young; needs years. Barolo = King.", regions:[{r:"Barolo, Barbaresco", c:"🇮🇹 Italy"}], terms:[] },
  { id:13, lo:4, name:"Barbera", type:"red", color:"#660033", tannin:"Low-med", acid:"Very high", body:"Medium", key:"Red cherry, plum, spice. Very high acidity.", style:"High acidity + low tannin = food-friendly.", regions:[{r:"Barbera d'Asti", c:"🇮🇹 Italy"}], terms:[] },
  { id:14, lo:4, name:"Sangiovese", type:"red", color:"#A52A2A", tannin:"Med-high", acid:"High", body:"Medium", key:"Red cherry, dried herbs, leather", style:"Chianti = accessible. Brunello = powerhouse.", regions:[{r:"Chianti Classico, Brunello di Montalcino", c:"🇮🇹 Italy"}], terms:["Riserva ⭐⭐"] },
  { id:15, lo:4, name:"Corvina", type:"red", color:"#722F37", tannin:"Varies", acid:"Med-high", body:"Varies", key:"Red cherry → dried fruit, chocolate (Amarone)", style:"Valpolicella (light) → Amarone (appassimento/powerful).", regions:[{r:"Valpolicella, Amarone", c:"🇮🇹 Italy"}], terms:["Classico"] },
  { id:16, lo:4, name:"Malbec", type:"red", color:"#2E082A", tannin:"High", acid:"Medium", body:"Full", key:"Dark plum, blackberry, cocoa", style:"Argentina's flagship. Plush, velvety tannins. Thrives at altitude.", regions:[{r:"Mendoza", c:"🇦🇷 Argentina"}], terms:[] },
  { id:17, lo:4, name:"Carmenère", type:"red", color:"#3B0A18", tannin:"Med-high", acid:"Medium", body:"Full", key:"Black fruit, bell pepper, herbal, chocolate", style:"Chile's signature grape. Originally from Bordeaux. Needs full ripeness.", regions:[{r:"Central Valley, Colchagua", c:"🇨🇱 Chile"}], terms:[] },
  { id:18, lo:4, name:"Pinotage", type:"red", color:"#4B1220", tannin:"Med-high", acid:"Medium", body:"Full", key:"Red plum, blackberry, smoke", style:"South African crossing of Pinot Noir × Cinsaut.", regions:[{r:"Stellenbosch, Swartland", c:"🇿🇦 S. Africa"}], terms:[] },
  { id:19, lo:4, name:"Zinfandel / Primitivo", type:"red", color:"#5C1A2E", tannin:"Medium", acid:"Medium", body:"Full", key:"Blackberry jam, dried fruit, sweet spice. High alcohol.", style:"Same grape, two names. White Zinfandel = off-dry rosé.", regions:[{r:"California (Lodi)", c:"🇺🇸 USA"}, {r:"Puglia", c:"🇮🇹 Italy"}], terms:[] },
  { id:20, lo:4, name:"Chenin Blanc", type:"white", color:"#F0E68C", tannin:"None", acid:"Very high", body:"Variable", key:"Apple, quince, honey, wet wool with age.", style:"High acidity = immense range (dry, sweet, sparkling). Called Steen in SA.", regions:[{r:"Vouvray", c:"🇫🇷 France"}, {r:"Western Cape", c:"🇿🇦 S. Africa"}], terms:[] },
  { id:21, lo:4, name:"Gewurztraminer", type:"white", color:"#F4A46A", tannin:"None", acid:"Low-med", body:"Full", key:"Lychee, rose, Turkish delight, sweet spice", style:"Intensely aromatic, deep golden, high alcohol, low acidity.", regions:[{r:"Alsace", c:"🇫🇷 France"}], terms:["Grand Cru ⭐⭐⭐", "Vendanges Tardives"] },
  { id:22, lo:4, name:"Viognier", type:"white", color:"#FFDF00", tannin:"None", acid:"Low", body:"Full", key:"Peach, apricot, blossom, ginger.", style:"Aromatic, full-bodied, low acidity. Condrieu is benchmark.", regions:[{r:"Condrieu", c:"🇫🇷 France"}], terms:[] },
  { id:23, lo:4, name:"Albariño", type:"white", color:"#F5F5DC", tannin:"None", acid:"High", body:"Light-med", key:"Stone fruit, citrus, saline", style:"Spain's finest white. Atlantic coast. Pairs with seafood.", regions:[{r:"Rías Baixas", c:"🇪🇸 Spain"}], terms:[] },
  { id:24, lo:4, name:"Sémillon", type:"white", color:"#EEDC82", tannin:"None", acid:"Medium", body:"Medium-full", key:"Lemon, honey, toast (aged). Prone to botrytis.", style:"Backbone of Sauternes (sweet). Hunter Valley = ages into honey/toast.", regions:[{r:"Sauternes, Graves", c:"🇫🇷 France"}, {r:"Hunter Valley", c:"🇦🇺 Australia"}], terms:[] },
  { id:25, lo:4, name:"Furmint", type:"white", color:"#DAA520", tannin:"None", acid:"Very high", body:"Variable", key:"Citrus, ginger; honey, apricot (Aszú)", style:"Dry to lusciously sweet botrytis wine.", regions:[{r:"Tokaj", c:"🇭🇺 Hungary"}], terms:["Aszú 🍯"] }
];

const SPARKLING_DATA = [
  { name:"Champagne", flag:"🇫🇷", method:"Traditional Method", grapes:[{n:"Chardonnay",c:"#E6C229"}, {n:"Pinot Noir",c:"#B03060"}, {n:"Meunier",c:"#8B008B"}], styles:"Brut · Vintage · NV", note:"Autolysis = biscuit, toast. 2nd fermentation in bottle. Blanc de Blancs = 100% Chardonnay; Blanc de Noirs = black grapes only." },
  { name:"Cava", flag:"🇪🇸", method:"Traditional Method", grapes:[{n:"Macabeo, Parellada, Xarel·lo",c:"#D4E157"}], styles:"Mainly Brut.", note:"Identical method to Champagne, different terroir/grapes. Mostly from Penedès, Catalunya." },
  { name:"Crémant", flag:"🇫🇷", method:"Traditional Method", grapes:[{n:"Varies by region",c:"#E6C229"}], styles:"Mostly Brut.", note:"French traditional-method sparkling made outside Champagne (e.g. Crémant d'Alsace, de Loire, de Bourgogne)." },
  { name:"Prosecco", flag:"🇮🇹", method:"Tank Method", grapes:[{n:"Glera",c:"#FAFAD2"}], styles:"Brut to Demi-Sec.", note:"No autolysis = fresh, fruity (pear/apple). 2nd fermentation in tank. Note: 'Extra Dry' Prosecco is SWEETER than Brut." },
  { name:"Asti", flag:"🇮🇹", method:"Tank Method (One Fermentation)", grapes:[{n:"Moscato",c:"#FFDF00"}], styles:"Sweet, low alcohol (~7%).", note:"Intensely floral and grapey. Single fermentation stopped early to keep sweetness." }
];

const FORTIFIED_DATA = [
  { cat:"Sherry", name:"Fino / Manzanilla", aging:"Under Flor 🌼 (Biological)", grapes:[{n:"Palomino",c:"#F5F5DC"}], taste:"Bone dry, pale, almond, bread dough. Serve chilled. Manzanilla = aged in coastal Sanlúcar." },
  { cat:"Sherry", name:"Amontillado", aging:"Flor first, then Oxidative", grapes:[{n:"Palomino",c:"#F5F5DC"}], taste:"Amber, dry, nutty — starts as Fino, then flor dies and oxidative aging takes over." },
  { cat:"Sherry", name:"Oloroso", aging:"Oxidative 🤎 (No Flor)", grapes:[{n:"Palomino",c:"#F5F5DC"}], taste:"Amber-brown, dry, walnut, toffee, rich. Fortified to ~17% so flor never grows." },
  { cat:"Sherry", name:"PX", aging:"Oxidative (Sun-dried grapes)", grapes:[{n:"Pedro Ximénez",c:"#3E180C"}], taste:"Near-black, syrupy sweet, raisin, figs, coffee." },
  { cat:"Port", name:"Ruby & LBV", aging:"Short Oak 🪵 (Protective)", grapes:[{n:"Touriga Nacional etc",c:"#301934"}], taste:"Deep ruby, sweet, fresh dark fruit (blackberry). LBV = single year, 4–6 yrs in barrel." },
  { cat:"Port", name:"Tawny (aged)", aging:"Long Oak 🪵 (Oxidative)", grapes:[{n:"Touriga Nacional etc",c:"#301934"}], taste:"Amber, nutty, caramel, dried fruit. 10/20/30/40-year blends." },
  { cat:"Port", name:"Vintage", aging:"2 yrs Oak, then Bottle", grapes:[{n:"Touriga Nacional etc",c:"#301934"}], taste:"Only in declared years. Ages decades in bottle; throws sediment — decant." }
];

// Label terms grouped by country → region for the Labels tab.
const LABEL_DATA = [
  { country:"🇫🇷 France", groups:[
    { region:"Burgundy", terms:[
      { term:"Grand Cru ⭐⭐⭐", meaning:"Highest tier. Shows only the vineyard name (e.g. Montrachet)." },
      { term:"Premier Cru ⭐⭐", meaning:"Second tier. Shows village + vineyard name." },
      { term:"Village", meaning:"Wine from a single named village (e.g. Pommard, Chablis)." },
    ]},
    { region:"Bordeaux", terms:[
      { term:"Grand Cru Classé ⭐⭐⭐", meaning:"Estate ranked in the 1855 classification of top Médoc châteaux." },
      { term:"Cru Bourgeois ⭐⭐", meaning:"Quality Médoc estates below the 1855 classification." },
    ]},
    { region:"General", terms:[
      { term:"AOC / AC", meaning:"Appellation d'Origine Contrôlée — France's PDO tier, with strict rules on area, grapes and methods." },
      { term:"Vieilles Vignes", meaning:"Old vines — lower yields, more concentrated fruit." },
      { term:"Sur Lie", meaning:"Bottled directly off the dead yeast (lees) — adds texture. Classic on Muscadet." },
      { term:"Vendanges Tardives", meaning:"Late harvest (Alsace) — extra-ripe grapes, richer and often sweet." },
    ]},
  ]},
  { country:"🇩🇪 Germany", groups:[
    { region:"Prädikat ladder (by ripeness at harvest)", terms:[
      { term:"Kabinett 🍏", meaning:"Lightest Prädikat. Delicate, lowest alcohol, often off-dry." },
      { term:"Spätlese 🍂", meaning:"'Late harvest'. Riper, more concentrated than Kabinett." },
      { term:"Auslese 🍇", meaning:"'Selected harvest'. Very ripe bunches, often some botrytis. Usually sweet." },
      { term:"Beerenauslese (BA) 🍯", meaning:"Individually selected botrytized berries. Sweet, rare." },
      { term:"Eiswein ❄️", meaning:"Grapes frozen naturally on the vine. Sweet with high acidity." },
      { term:"Trockenbeerenauslese (TBA) 👑", meaning:"Shrivelled botrytized berries. Rarest, most lusciously sweet." },
    ]},
    { region:"Sweetness terms", terms:[
      { term:"Trocken", meaning:"Dry." },
      { term:"Halbtrocken", meaning:"Off-dry (half-dry)." },
    ]},
  ]},
  { country:"🇪🇸 Spain", groups:[
    { region:"Aging ladder (Rioja rules)", terms:[
      { term:"Joven", meaning:"Young wine, little or no oak. Released for early drinking." },
      { term:"Crianza ⏳", meaning:"Min. 2 years total aging, at least 1 year in oak." },
      { term:"Reserva ⏳⏳", meaning:"Min. 3 years total aging, at least 1 year in oak." },
      { term:"Gran Reserva ⭐⭐⭐", meaning:"Min. 5 years total aging, at least 2 years in oak. Top tier." },
    ]},
    { region:"Classification", terms:[
      { term:"DO / DOCa", meaning:"Denominación de Origen — Spain's PDO. DOCa (Calificada) is the elite tier: only Rioja and Priorat." },
    ]},
  ]},
  { country:"🇮🇹 Italy", groups:[
    { region:"Classification", terms:[
      { term:"DOCG 👑", meaning:"Top tier of Italian classification (Controllata e Garantita)." },
      { term:"DOC", meaning:"Standard PDO tier, below DOCG." },
      { term:"Classico 🏛️", meaning:"Wine from the original historical core zone (e.g. Chianti Classico, Soave Classico)." },
      { term:"Riserva", meaning:"Extended aging before release; requirements vary by DOC/DOCG." },
    ]},
  ]},
  { country:"🇭🇺 Hungary", groups:[
    { region:"Tokaj", terms:[
      { term:"Aszú 🍯", meaning:"Made with botrytis-affected (noble rot) berries. Lusciously sweet, high acidity." },
    ]},
  ]},
  { country:"🇪🇺 EU-wide", groups:[
    { region:"Geographic indication", terms:[
      { term:"PDO (AOC / DOC / DO)", meaning:"Protected Designation of Origin — small defined area, strict rules." },
      { term:"PGI / IGP", meaning:"Protected Geographical Indication — larger area, more flexible rules (grapes, yields)." },
      { term:"85% rule", meaning:"A labelled vintage or single variety must make up at least 85% of the blend (EU)." },
    ]},
  ]},
];

const SAT_DATA = [
  { tier:"PRIMARY 🌱 (Grape)", color:"#4A7C5F", items:[
    { i:"🌸", n:"Floral", d:"blossom, rose" },
    { i:"🍏", n:"Green fruit", d:"apple, pear, gooseberry" },
    { i:"🍋", n:"Citrus", d:"lemon, grapefruit" },
    { i:"🍑", n:"Stone fruit", d:"peach, apricot" },
    { i:"🍍", n:"Tropical", d:"lychee, passion fruit, melon" },
    { i:"🍓", n:"Red fruit", d:"cherry, strawberry, raspberry" },
    { i:"🫐", n:"Black fruit", d:"blackcurrant, blackberry" },
    { i:"🫑", n:"Herbaceous", d:"green bell pepper, grass" },
    { i:"🌿", n:"Herbal", d:"mint, eucalyptus" },
    { i:"🧂", n:"Spice", d:"black pepper, liquorice" }
  ]},
  { tier:"SECONDARY 🧈 (Winemaking)", color:"#5B8A6A", items:[
    { i:"🥖", n:"Yeast/Lees", d:"biscuit, pastry, bread" },
    { i:"🧈", n:"MLF", d:"butter, cream, cheese" },
    { i:"🪵", n:"Oak", d:"vanilla, clove, smoke, cedar" }
  ]},
  { tier:"TERTIARY ⏳ (Maturation)", color:"#1A3228", items:[
    { i:"🍂", n:"Red Age", d:"leather, earth, mushroom, tobacco" },
    { i:"🍯", n:"White Age", d:"petrol, ginger, honey, almond" }
  ]}
];

const PRODUCTION_STEPS = [
  { id:"red", title:"Red Wine 🍷", color:"#9B111E", items:[
    { icon:"🍇", n:"Crush", d:"Break skins to release juice." },
    { icon:"🫧", n:"Ferment", d:"Ferment WITH skins at warm temps to extract color and tannin." },
    { icon:"🗜️", n:"Press", d:"Press AFTER fermentation to separate liquid from skins." },
    { icon:"🧈", n:"MLF", d:"Almost always happens for reds." },
    { icon:"🛢️", n:"Mature", d:"Oak or stainless steel." }
  ]},
  { id:"white", title:"White Wine 🥂", color:"#C9952A", items:[
    { icon:"🍇", n:"Crush", d:"Gentle break." },
    { icon:"🗜️", n:"Press", d:"Press BEFORE fermentation (no skin contact)." },
    { icon:"🫧", n:"Ferment", d:"Ferment WITHOUT skins at cool temps to preserve fruit." },
    { icon:"🧈", n:"MLF", d:"Optional (Chardonnay yes, Sauv Blanc usually no)." }
  ]},
  { id:"rose", title:"Rosé Wine 🌸", color:"#D87093", items:[
    { icon:"🍇", n:"Crush", d:"Break black grape skins." },
    { icon:"⏳", n:"Short Maceration", d:"Skins soak in juice for just a few hours." },
    { icon:"🗜️", n:"Press", d:"Remove skins early." },
    { icon:"🫧", n:"Ferment", d:"Ferment like a white wine at cool temps." }
  ]},
  { id:"sweet", title:"Sweet Wine 🍯", color:"#B8860B", items:[
    { icon:"🛑", n:"Stop fermentation", d:"Kill/remove yeast before all sugar is eaten (e.g. fortify like Port)." },
    { icon:"🍄", n:"Noble rot (botrytis)", d:"Fungus shrivels grapes, concentrating sugar + acid (Sauternes, Tokaji)." },
    { icon:"❄️", n:"Freeze on vine", d:"Eiswein/Icewine — water freezes, sweet juice is pressed off." },
    { icon:"☀️", n:"Dry the grapes", d:"Appassimento (Amarone = dry; Recioto = sweet), or sun-dried PX." }
  ]}
];
