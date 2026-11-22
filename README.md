# Mission: Impenguinable

Planner zadań dla studentów od drużyny **Pingwinki**, przygotowany na zadanie eliminacyjne SmartApp.

**Otwórz aplikację:** https://jpolchowska.github.io/pingwinki-planner/

Student jest pingwinem na misji. Aplikacja podpowiada, czym zająć się dziś, pilnuje terminów i nagradza skupioną pracę.

To strona internetowa zaprojektowana jak aplikacja na telefon. Na komputerze wyświetla się w ramce telefonu, a na telefonie zajmuje cały ekran.

## Jak uruchomić

Potrzebny jest Node.js w wersji 20.19+ lub 22.12+.

```bash
npm install
npm run dev
```

Aplikacja otworzy się pod adresem podanym w terminalu, domyślnie `http://localhost:5173`.

Przy pierwszym uruchomieniu wczytują się przykładowe zadania z [`public/zadania.json`](public/zadania.json). Własny plik można wczytać w zakładce **Plik**.

## Co działa

Wymagania z zadania:

- [x] lista zadań,
- [x] dodawanie zadania,
- [x] edycja zadania,
- [x] wykreślanie zadania jako zrobione i cofanie tego,
- [x] usuwanie zadania,
- [x] wczytywanie zadań z pliku JSON,
- [x] zapis zadań do pliku JSON w tym samym formacie.

## Czego nie ma w tej wersji

- **Widok tygodnia w kalendarzu.** Dostępny jest widok miesiąca.
- **Zdejmowanie kupionych rzeczy z pingwina.** Po zakupie zostają na nim na stałe.
- **Tryb stada, czyli planowanie z innymi osobami.** Pomysł na kolejny etap, wymagałby kont użytkowników i serwera.
- **Plan ataku, czyli rozkładanie nauki do kolokwium na kilka dni.** Funkcja powstała w trakcie prac, ale została usunięta z wersji końcowej, ponieważ wymagała zbyt dużo ręcznego ustawiania. Większy nacisk położono na regularność, czyli budowę igloo.

## Własny wkład i uzasadnienie

### Pomoc w wyborze

| Funkcja | Co robi | Dlaczego |
| --- | --- | --- |
| **Widok Dziś** | Wybiera misję główną i dwie poboczne, a przy każdej podaje powód. | Przy dwudziestu zadaniach student potrzebuje decyzji, od czego zacząć, a nie kolejnej listy. |
| **Kra** | Pasek lodu przy zadaniu topnieje wraz ze zbliżaniem się terminu. | Pilność widać od razu, bez czytania daty. |
| **Akcja ratunkowa** | Zaległe zadania można jednym kliknięciem przenieść na jutro lub na weekend. | Zaległość dostaje nowy termin zamiast wisieć na liście i demotywować. |
| **Cienki lód** | Ostrzega, gdy ważne terminy są blisko siebie, i mówi, od czego zacząć. | Student dowiaduje się o trudnym tygodniu przed terminami, a nie po nich. |
| **Kalendarz** | Pokazuje zadania w miesiącu, ich priorytety i dni z cienkim lodem. | Łatwiej zobaczyć, kiedy robi się tłoczno. |

Misje w widoku Dziś są wybierane na podstawie punktów za priorytet (wysoki 3, średni 2, niski 1) i pilność terminu (dziś 4, do 2 dni 3, do 7 dni 2, później 0).

### Motywacja i tożsamość drużyny

| Funkcja | Co robi | Dlaczego |
| --- | --- | --- |
| **Nurkowanie** | 25 minut skupienia nad jedną misją, potem przerwa „na lodzie”. | Duże zadanie łatwiej zacząć, gdy to tylko jedno krótkie nurkowanie. |
| **Ryby** | Nagroda za nurkowanie i złota rybka za ważną misję. | Przerwanie nurkowania niczego nie odbiera, bo planner nie powinien karać za gorszy dzień. |
| **Igloo** | Za ryby można kupić rzeczy na półki i dla pingwina, np. okulary agenta. | Postęp jest widoczny i daje powód, żeby wracać. |
| **Budowa igloo** | Każdy dzień z nurkowaniem dokłada blok lodu. | Pokazuje regularność, która przy nauce liczy się bardziej niż jeden długi zryw. |
| **Pingwin** | Własna maskotka w pixel-arcie, która zmienia pozy. | Nawiązuje do nazwy drużyny i spina wszystkie funkcje w jeden świat. |

Przycisk **Pomiń do końca (podgląd)** przy nurkowaniu jest trybem pokazowym, żeby można było sprawdzić nagrody bez czekania 25 minut.

## Technologie

React, TypeScript i Vite. Aplikacja nie ma backendu, a dane trzyma w `localStorage`.
