-- ============================================================
-- Sportsbyttet — Migration 002: Realistic listing seed data
-- Run in Supabase SQL Editor
-- Updates all 12 existing listings with real Norwegian product
-- data and high-quality Unsplash sports images.
-- ============================================================

UPDATE listings AS l
SET
  title        = v.title,
  description  = v.description,
  price        = v.price::int,
  category     = v.category,
  condition    = v.condition,
  images       = v.images,
  specs        = v.specs::jsonb,
  listing_type = 'regular',
  is_sold      = false,
  views        = v.views::int
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn
  FROM listings
) ranked
JOIN (VALUES

  -- 1. Alpine skis
  (1,
   'Salomon QST 106 ski — 180 cm',
   'Allround fjellski i veldig god stand. Brukt 2 sesonger på variert føre — fra harde pistekanter til mykt sidespor. Binding medfølger. Selges da jeg har gått opp en størrelse.',
   2400,
   'Alpint', 'Pent brukt',
   ARRAY[
     'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80&auto=format&fit=crop',
     'https://images.unsplash.com/photo-1508193893451-b8e7c22b5ac6?w=800&q=80&auto=format&fit=crop'
   ],
   '{"Lengde": "180 cm", "Merke": "Salomon", "Modell": "QST 106", "Binding": "Salomon Z12 GW", "Radius": "17 m", "Bredde (topp/midje/hæl)": "136/106/122 mm"}',
   52),

  -- 2. Alpine skis 2
  (2,
   'Rossignol Experience 82 ski — 176 cm',
   'Terrengorienterte pisteski for mellomkjører til viderekommen. Lite brukt, fin stand uten skrubbmerker av betydning. Komplett med binding.',
   1800,
   'Alpint', 'Godt brukt',
   ARRAY[
     'https://images.unsplash.com/photo-1508193893451-b8e7c22b5ac6?w=800&q=80&auto=format&fit=crop',
     'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80&auto=format&fit=crop'
   ],
   '{"Lengde": "176 cm", "Merke": "Rossignol", "Modell": "Experience 82 Basalt", "Binding": "SPX 12 Konect GW", "Radius": "14 m", "Bredde midje": "82 mm"}',
   38),

  -- 3. Ski boots
  (3,
   'Nordica TSX 80W alpinskistøvler — str 25.5 (ca. 39–40)',
   'Dameskistøvler i veldig god stand. Brukt kun én sesong av lett kjører. Mykt flex (80) gir god komfort på lange dager. Passer bred fot.',
   1200,
   'Alpint', 'Pent brukt',
   ARRAY[
     'https://images.unsplash.com/photo-1565992441121-4367e2f28be8?w=800&q=80&auto=format&fit=crop'
   ],
   '{"Størrelse": "25.5 (ca. str 39–40)", "Kjønn": "Dame", "Merke": "Nordica", "Modell": "TSX 80W", "Flex": "80", "Lest": "98 mm", "Farge": "Hvit/mintgrønn"}',
   29),

  -- 4. Cross-country skis
  (4,
   'Fischer Twin Skin Pro langrennsski — 195 cm',
   'Klisterfrie klassiskski av toppkvalitet. Brukt én sesong med veldig god glid. Twin Skin-festesone i perfekt stand. Passer skiløper fra ca. 75–90 kg.',
   1600,
   'Langrenn', 'Pent brukt',
   ARRAY[
     'https://images.unsplash.com/photo-1517166665-b0fc07a2f1d3?w=800&q=80&auto=format&fit=crop'
   ],
   '{"Lengde": "195 cm", "Merke": "Fischer", "Modell": "Twin Skin Pro Stiff", "Stil": "Klassisk", "Festesone": "Twin Skin (klisterfri)", "Binding medfølger": "Nei", "Anbefalt vekt": "75–90 kg"}',
   44),

  -- 5. XC ski shoes + binding
  (5,
   'Salomon S/Race langrennssko str 42 + Rottefella NNN binding',
   'Komplett pakke — lette klassisksko og matchende NNN-binding. Sko og binding montert og tilpasset, klar til bruk. Godt egnet for trim og mosjonsløp.',
   550,
   'Langrenn', 'Godt brukt',
   ARRAY[
     'https://images.unsplash.com/photo-1516715094483-75da7dee9758?w=800&q=80&auto=format&fit=crop'
   ],
   '{"Størrelse sko": "42 (EU)", "Bindingssystem": "NNN", "Merke sko": "Salomon", "Merke binding": "Rottefella", "Stil": "Klassisk", "Selges samlet": "Ja"}',
   21),

  -- 6. Hockey skates
  (6,
   'Bauer Vapor 3X hockeyskøyter — str 8.5 (ca. 42–43)',
   'Lette og responsive hockeyskøyter i veldig god stand. Bladene er nyslipte hos skomaker. Brukt én sesong i juniorhockey. Passer smal til normal fot.',
   1900,
   'Ishockey', 'Pent brukt',
   ARRAY[
     'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800&q=80&auto=format&fit=crop'
   ],
   '{"Størrelse": "8.5 (ca. 42–43 EU)", "Merke": "Bauer", "Modell": "Vapor 3X", "Blad": "Tuuk Lightspeed Edge", "Stivhet": "Stiff", "Vekt": "190 g (pr. skøyte)"}',
   67),

  -- 7. Hockey stick
  (7,
   'Bauer Supreme ADV hockeykølle — Senior, venstre, flex 77',
   'Lett karbonkølle med god touch og stikkraft. Lite chip ytterst på bladet — påvirker ikke spill. Originalt blad, ikke omviklet.',
   850,
   'Ishockey', 'Godt brukt',
   ARRAY[
     'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=800&q=80&auto=format&fit=crop'
   ],
   '{"Lengde": "87 cm (uten tape)", "Merke": "Bauer", "Modell": "Supreme ADV", "Slag": "Venstre", "Flex": "77 Senior", "Materiale": "100 % karbon", "Blad": "P92 Crosby"}',
   33),

  -- 8. Football boots
  (8,
   'Nike Mercurial Vapor 15 Academy fotballsko — str 44, AG',
   'Raske og lette AG-sko for kunstgress. Normal sesongslitasje på sålen, øvre del i fin stand. Brukt én sesong. Selges da jeg gikk opp en størrelse.',
   480,
   'Fotball', 'Pent brukt',
   ARRAY[
     'https://images.unsplash.com/photo-1556906781-9b34044bd6b6?w=800&q=80&auto=format&fit=crop'
   ],
   '{"Størrelse": "44 EU / US 10", "Merke": "Nike", "Modell": "Mercurial Vapor 15 Academy", "Underlag": "AG (kunstgress)", "Materiale øvre": "Tekstil", "Farge": "Blå/hvit/svart"}',
   58),

  -- 9. Football boots 2
  (9,
   'Adidas Predator Elite FG fotballsko — str 43, nesten ubrukt',
   'Kjøpt feil størrelse og aldri brukt i kamp. Prøvd én gang på treningsbane. Komplett med original boks og ekstra snørebånd. Nydelig passform.',
   1100,
   'Fotball', 'Som ny',
   ARRAY[
     'https://images.unsplash.com/photo-1528965611171-ebce2dba0ef9?w=800&q=80&auto=format&fit=crop'
   ],
   '{"Størrelse": "43 EU / US 9.5", "Merke": "Adidas", "Modell": "Predator Elite FG", "Underlag": "FG (naturgress)", "Soner": "Controlframe + Hybrid touch", "Ganger brukt": "1–2"}',
   41),

  -- 10. Running shoes
  (10,
   'Nike Pegasus 40 løpesko — str 42.5',
   'Allround treningssko for vei og bane. Brukt ca. 200 km, ReactX-demping fortsatt i god form. Selger fordi jeg har byttet til annen lest. Ingen merker etter stein.',
   700,
   'Løping', 'Pent brukt',
   ARRAY[
     'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80&auto=format&fit=crop'
   ],
   '{"Størrelse": "42.5 EU / US 9", "Merke": "Nike", "Modell": "Pegasus 40", "Såletype": "Nøytral", "Demping": "ReactX skum", "Ca. km brukt": "~200 km", "Farge": "Svart/grå"}',
   76),

  -- 11. Cycling jersey
  (11,
   'Castelli Climber''s 3.0 Race sykkeltrøye — str M, herre',
   'Lett klatretrøye laget for varme dager og lange oppstigninger. Brukt én sesong, ingen flekker eller skader. 3 bak-lommer + glidelåslomme.',
   420,
   'Sykling', 'Som ny',
   ARRAY[
     'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop'
   ],
   '{"Størrelse": "M", "Merke": "Castelli", "Modell": "Climber''s 3.0 Race", "Kjønn": "Herre", "Lommer": "3 bak + 1 glidelås", "Materiale": "KISS Air 2", "Farge": "Rød/sort"}',
   29),

  -- 12. Hiking boots
  (12,
   'Salomon X Ultra 4 GTX tursko — str 44',
   'Vanntette, lette tursko for sti og fjellterreng. Gore-Tex-membran holder deg tørr. OrthoLite innleggssåle medfølger. Brukt på 3 turer, meget god stand.',
   1100,
   'Friluftsliv', 'Pent brukt',
   ARRAY[
     'https://images.unsplash.com/photo-1544015501-7dbf9b5b2fde?w=800&q=80&auto=format&fit=crop'
   ],
   '{"Størrelse": "44 EU / UK 9.5", "Merke": "Salomon", "Modell": "X Ultra 4 GTX", "Membran": "Gore-Tex", "Vekt": "330 g pr. sko", "Såle": "Contagrip MA", "Farge": "Svart/brun"}',
   35)

) AS v(rn, title, description, price, category, condition, images, specs, views)
ON ranked.rn = v.rn
WHERE l.id = ranked.id;
