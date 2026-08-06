# Pathway beta — konfiguracja kanałów

Stan zweryfikowany przed migracją domeny: 2026-08-06.

## Aktualne adresy

- Landing: `https://yourpathway.app/`
- Ankieta: `https://yourpathway.app/#ankieta`
- Aplikacja: `https://fedorczakmichal-stack.github.io/pathway-live/`
- Instagram: `https://www.instagram.com/pathway.day/`
- Facebook: `https://www.facebook.com/pathway.day`
- Główny kontakt i odbiorca formularzy: `info@yourpathway.app`
- Wersja publicznego produktu komunikowana na stronie: `v80` (zrzuty w `img/` pochodzą z tego samego builda; przy podbiciu wersji zmienić RAZEM: badge, podpis galerii, stopkę, temat i treść maili, `app_version` w formularzu oraz `tests/landing-contract.test.mjs`)

`yourpathway.app` jest główną domeną strony beta. Wcześniejszy adres GitHub Pages pozostaje technicznym adresem źródłowym i powinien przekierowywać do domeny głównej.

## Linki organiczne

Instagram — aktualny link w bio (pole linku jest edytowalne tylko w aplikacji mobilnej):

```text
https://yourpathway.app/?lang=en&utm_source=ig&utm_medium=social&utm_content=link_in_bio
```

Facebook Page — zweryfikowany link profilu:

```text
https://yourpathway.app/?utm_source=facebook&utm_medium=organic_social&utm_campaign=open_beta_us&utm_content=page_link
```

Aktualny Instagram bio:

```text
Make progress you can see.
Each small next step grows your road—no streaks, no guilt.
Try the free browser beta ↓
```

Aktualny Facebook bio:

```text
Pathway helps you keep moving on one meaningful goal. Each finished next step grows a road on a living map, so progress becomes something you can see. No streaks. No guilt. Free browser beta—no account or install.
```

Post/Reel/Story: zmieniaj wyłącznie `utm_source` i `utm_content`, np. `reel_visible_progress`, `reel_no_guilt`, `story_one_next_move`.

Landing przepuszcza tylko: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`. Dodaje do linku aplikacji `landing_cta=header|hero|survey|phone|final|footer`. Parametry są przechowywane lokalnie i wychodzą tylko przy świadomym wysłaniu formularza.

## Formularze — etap przejściowy

Aktualny endpoint AJAX jest zbudowany w `index.html` z adresu `info@yourpathway.app`:

```text
https://formsubmit.co/ajax/info@yourpathway.app
```

Pierwsza kontrolowana wysyłka powoduje jednorazowy mail aktywacyjny FormSubmit. Dopóki właściciel skrzynki nie kliknie aktywacji, użytkownik ma dwa działające fallbacki: gotowy `mailto:` oraz kopię odpowiedzi.

Po migracji na firmową skrzynkę trzeba wywołać jednorazowy mail aktywacyjny FormSubmit dla `info@yourpathway.app`, kliknąć aktywację i ponownie wykonać test ankiety oraz waitlisty z publicznej strony.

Docelowa migracja:

1. Założyć zweryfikowany formularz Formspree albo własny backend na firmowym koncie.
2. Podmienić `FORM_ENDPOINT`, oba atrybuty `action`, adresy `mailto:` i treść `privacy.html`.
3. Ustawić ograniczenie domeny, ochronę antyspamową, retencję i test usunięcia danych.
4. Wysłać kontrolowany test survey oraz waitlist; sprawdzić Inbox i Spam.
5. Dopiero po tym usunąć oznaczenie tymczasowej skrzynki.

## Zasady

- Reklamy pozostają wyłączone do czasu działającego pomiaru activation/D7.
- Ankieta nie zapisuje automatycznie emaila na waitlistę.
- Nie wysyłamy tekstu celu ani identyfikatora osoby w UTM/analityce.
- Zatwierdzone tagi `v1-approved` i `v2-approved` pozostają nietknięte.
- Wdrożenie klientocentryczne: commit `1d64122`, tag `v3-client-facing`.
