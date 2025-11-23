```markdown
# Dokument wymagań produktu (PRD) - Noise chat

## 1. Przegląd produktu

Noise chat to mobilna aplikacja wyświetlająca krótkie, zdefiniowane przez użytkownika komunikaty tekstowe za pomocą efektu przewijania bądź adaptacyjnego efektu „powidoku”, automatycznie synchronizowanego z ruchem ręki (IMU). Produkt umożliwia szybkie, wyraziste przekazy tekstowe „na odległość” (np. podczas koncertów, w klubie, na wydarzeniach sportowych czy innych sytuacjach wymagających komunikacji bez użycia głosu). Wyróżnia się prostotą, bezpieczeństwem (m.in. ochrona przed niezdrowym flickerem), responsywnością i czytelnością nawet w trudnych warunkach oświetleniowych.

Noise chat powstaje jako aplikacja w React Native (Expo), działa offline i nie wymaga backendu poza opt-in analityką. Wersja MVP obsługuje podstawowy efekt przewijania, adaptację ruchu z IMU, kalibrację tempa, wsparcie dla PL/EN, onboarding, zachowania bezpieczeństwa oraz skalowanie do wielu rozmiarów ekranów i częstotliwości odświeżania.

Produkt celuje w młode osoby (10–30 lat), uczestników wydarzeń masowych, imprez, osób szukających nowych form cyfrowej ekspresji, a także rodziny i grupy znajomych używające mikro-wyzwań i narzędzi party game.

## 2. Problem użytkownika

Wielu użytkowników spotyka się z problemem szybkiego i widocznego komunikowania konkretnego przekazu do innych osób na dystans lub w tłumie, szczególnie w sytuacjach:

- wysokiego poziomu hałasu (koncert, stadion, klub, komunikacja miejska),
- utrudnionego kontaktu głosowego (impreza, wydarzenie masowe, ciemność),
- potrzeby efektownej, krótkiej cyfrowej ekspresji wyjętej „z kieszeni”.

Obecne narzędzia (np. aplikacje do wyświetlania napisów LED lub fontów, kartki, gesty) są mało responsywne, niedostosowane do dynamiki ruchu lub niewidoczne w ciemności. Brakuje rozwiązań łączących efektowny, bezpieczny efekt „powidoku”, prostotę obsługi oraz natychmiastowy feedback — przy zachowaniu zasad bezpieczeństwa (fotosensytywność, wygaszenie, jasność, kontrola interakcji itd.).

Noise chat rozwiązuje ten problem przez:

- natychmiastowe przetwarzanie tekstu na efekt ruchomego przewijania,
- skalowanie jasności, kontrastu i częstotliwości do warunków w danym momencie,
- obsługę kalibracji i trybu adaptacyjnego bezpośrednio z IMU urządzenia,
- wskaźniki tempa i czytelności oraz wyraźny onboarding,
- ochronę użytkownika przed potencjalnie szkodliwym migotaniem i przegrzewaniem ekranu,
- zgodność z polityką prywatności i bezpieczeństwa platform sklepowych.

## 3. Wymagania funkcjonalne

1. Treść i jej edycja
    - Wprowadzanie tekstu: limit do 10 grafemów (A–Z, 0–9, spacja, .,!?-, polskie diakrytyki), wszystko UPPERCASE, monospaced sans‑serif, automatyczna walidacja szerokości renderu.
    - Podpowiedzi zamienników znaków (jeśli niewspierane).
    - Pre-podgląd renderu ze wskaźnikiem mieści/nie mieści.

2. Tryb wyświetlania / efekt powidoku
    - Adaptacyjny algorytm przewijania (synchro z ruchami, IMU), fallback: stabilny auto-scroll z prostą kalibracją tempo.
    - Szybka kalibracja (<1s) na początku trybu, zapisywana per urządzenie/sesję; powtórna kalibracja po detekcji zmiany Hz.
    - Domyślny tryb lustrzany (Mirror) + szybki toggle Mirror/Flip.
    - Auto-detekcja kierunku przewijania L↔R (0,5 s na początku).
    - Tryb immersyjny (ukryty status/nav bar); blokada landscape; poziome marginesy 8–10%.
    - Odliczanie startu 1–2 s z podglądem; duży przycisk Stop (na UI, pod vol– na Androidzie, długie przytrzymanie ekranu na iOS/fallback).
    - Blokada dotyku poza przycisk Stop.
    - Opcjonalny wskaźnik tempa (za wolno/OK/za szybko), metronom hapticzny/audio podczas wyświetlania.
    - Maks. jasność ekranu na start trybu (po wyrażeniu zgody), automatyczny powrót do poprzednich ustawień po stop/pause/onBlur/crash; opcja „pamiętaj na 24h”.
    - Blokada usypiania ekranu wyłącznie w trybie wyświetlania, automatyczne przywracanie.
    - Monitorowanie stanu termicznego (przegrzanie/tryb oszczędzania energii); automatyczne przełączenie w tryb safe/fallback.
    - Tryb safe flicker: ochrona przed niebezpieczną częstotliwością (15–25 Hz), łagodniejsza modulacja.

3. Onboarding/BHP
    - Ekran startowy z ostrzeżeniami (flicker, fotosensytywność, zakaz użycia w ruchu).
    - Trzystopniowa instrukcja (tekst/animacja); najważniejsze zasady bezpieczeństwa; onboarding skipowalny.

4. Uprawnienia i fallback
    - Prośba o dostęp do czujników ruchu (przed startem wyświetlania); w razie odmowy tryb demo (auto-scroll), z podpowiedzią jak nadać zgodę.
    - Logowanie przypadków użycia fallbacku.

5. Analityka i prywatność
    - Opt-in do podstawowych metryk oraz survey czytelności/NPS.
    - Rejestrowane eventy: start/stop/time_in_display, brightness_accepted, orientation_locked, used_fallback, refresh_rate, device_model, calibration_count, mirror_on.
    - Retencja danych 13 miesięcy, tylko anonimizowane device_id.

6. Lokalizacja, branding, sklep
    - Obsługa PL/EN (i18n), teksty systemowe i onboardingowe, sklepowe assety min.: ikona, wideo, opis, rating 12+, polityka prywatności/EULA.

7. Platforma/stack
    - React Native (Expo); Reanimated, Gesture Handler, natywne uprawnienia i sensory; fallback: bare RN przy wykryciu progu wydajności/latencji.
    - Obsługa iOS 15+ i Android 8+; layotowanie i efekty targetowane pod 60/90/120 Hz.

## 4. Granice produktu

Zakres MVP (wersja 1.0):

- Tylko podstawowy, pojedynczy tryb wyświetlania przewijanego napisu (bez trybów specjalnych/animacji).
- Brak kont/profilu użytkownika, logowania, rejestracji.
- Brak prób synchronizacji/backup do chmury czy rankingów online.
- Brak sieciowego social sharing czy rozgrywek wieloosobowych.
- Brak reklam i monetyzacji w pierwszej wersji.
- Brak personalizacji motywu kolorystycznego UI.
- Brak zaawansowanych statystyk, progresu, historii poza lokalnym survey i anon. metrykami.
- Tylko wsparcie poziomego efektu przewijania (brak trajektorii pionowych/złożonych).
- Tylko obsługa bazowej matrycy znaków i fontów (w przyszłości możliwa rozbudowa).
- Ograniczony zestaw testowych urządzeń (start: ok. 4 głównych modele, docelowo rozbudowa wraz z popularnością).
- Plan A/B testowania trybów efektu przez zamiany buildów lub prosty statyczny remote config (bez backendu).
- Ochrona bezpieczeństwa użytkownika (jasność, flicker, auto-off po 2–3 min).
- Weryfikacja i zatwierdzenie znaku towarowego oraz poprawnego brandingu.

## 5. Historyjki użytkowników

### US-001: Edycja napisu
- Tytuł: Edycja napisu do wyświetlenia
- Opis: Jako użytkownik chcę wpisać własny tekst (max 10 znaków/grafemów) ze wsparciem polskich diakrytyków (A–Z, 0–9, . , ! ? - oraz spacja) i mieć pewność, że wybrany napis zmieści się i będzie czytelny w wyznaczonym polu.
- Kryteria akceptacji:
    - Aplikacja pozwala wprowadzić tekst z ograniczeniami na dozwolone znaki i długość.
    - W momencie wpisywania napisu widoczny jest podgląd na żywo.
    - Weryfikacja ostrzega użytkownika lub proponuje zamiennik, jeśli tekst jest za długi lub zawiera niewspierane znaki.
    - Wszystkie znaki są automatycznie zamieniane na UPPERCASE.

### US-002: Pre-podgląd czytelności
- Tytuł: Podgląd widoczności napisu przed wyświetleniem
- Opis: Jako użytkownik chcę zobaczyć podgląd efektu przewijania mojego napisu i informację czy zmieści się na ekranie, zanim rozpocznę wyświetlanie.
- Kryteria akceptacji:
    - Po wpisaniu tekstu widoczny jest dynamiczny pre-podgląd efektu, z oznaczeniem „mieści się/nie mieści się”.
    - Jeśli napis się nie mieści, aplikacja podpowiada co zmienić.

### US-003: Start trybu wyświetlania
- Tytuł: Rozpoczęcie wyświetlania napisu
- Opis: Jako użytkownik chcę łatwo przejść do trybu wyświetlania za pomocą jednego przycisku (Start).
- Kryteria akceptacji:
    - Na ekranie napisu widoczny duży przycisk „Start”.
    - Po kliknięciu następuje prośba o jasność (z akceptacją/odmową) i ew. onboarding, a następnie przejście do trybu wyświetlania.
    - Aplikacja wykonuje krótkie odliczanie (1–2s) i informuje, gdy wystartuje (efekt ruchomy/start animacji/feedback haptic).

### US-004: Synchronizacja efektu z ruchem ręki (IMU)
- Tytuł: Powidok sterowany ruchem (IMU)
- Opis: Jako użytkownik chcę, aby efekt przewijania był automatycznie zsynchronizowany z ruchem mojego telefonu, aby zwiększyć czytelność napisu podczas machania.
- Kryteria akceptacji:
    - Podczas wyświetlania napis przewija się adaptacyjnie według pomiaru IMU.
    - Kalibracja odbywa się automatycznie na starcie lub na żądanie.
    - Gdy brak czujników ruchu lub odmowa zgody, tryb automatyczny zostaje zastąpiony przez stały przewijany scroll (wyraźna informacja/fallback).

### US-005: Kalibracja tempa efektu
- Tytuł: Kalibracja tempa scrollowania efektu
- Opis: Jako użytkownik chcę szybko skalibrować tempo przewijania do moich nawyków ruchowych, by efekt był klarowny.
- Kryteria akceptacji:
    - Po uruchomieniu wyświetlania aplikacja wykonuje krótką kalibrację (<1s).
    - Zostaje pokazany wskaźnik tempa (za wolno/OK/za szybko), ew. metronom (audio/haptic).
    - Kalibracja jest automatycznie powtarzana przy zmianie odświeżania (Hz) lub na żądanie.
    - Ustawienie jest pamiętane w urządzeniu na czas danej sesji.

### US-006: Bezpieczeństwo — jasność, flicker i auto-off
- Tytuł: Bezpieczne ustawienia i ostrzeżenie o zagrożeniach
- Opis: Jako użytkownik chcę mieć pewność, że aplikacja nie narazi mnie na niebezpieczne efekty takie jak szkodliwe migotanie, przegrzanie czy zbyt długą ekspozycję na jasny ekran.
- Kryteria akceptacji:
    - Aplikacja proponuje ustawienie maksymalnej jasności przed wejściem w tryb (z możliwością odmowy).
    - Blokada wygaszania ekranu aktywuje się wyłącznie w trybie wyświetlania.
    - Tryb „safe mode” eliminuje wibracje 15–25 Hz i informuje o wejściu w tryb zabezpieczeń termicznych lub oszczędzania energii.
    - Auto‑wyłączenie po 2–3 minutach aktywnego wyświetlania (z ostrzeżeniem i informacją o warunkach).
    - Na starcie każdego użycia wyświetlany jest ekran ostrzegawczy (flicker warning, fotosensytywność, BHP).

### US-007: Szybkie i pewne zatrzymanie efektu
- Tytuł: Natychmiastowe zatrzymanie wyświetlania napisu
- Opis: Jako użytkownik chcę móc szybko zatrzymać wyświetlanie (efekt powidoku) za pomocą jednego dużego przycisku, skrótu pod przyciskiem „volume–” (Android), lub długiego przytrzymania ekranu (iOS/fallback), aby mieć pełną kontrolę nawet bez patrzenia na ekran.
- Kryteria akceptacji:
    - W trybie wyświetlania obecny jest duży, łatwo dostępny przycisk „Stop”.
    - Na Androidzie działa skrót pod „volume–”, na iOS nie zawsze dostępny — fallback: długie przytrzymanie ekranu (min. 1,5s, konfigurowalne).
    - Po zatrzymaniu efektu jasność ekranu jest natychmiast resetowana do wartości sprzed wejścia w tryb i aplikacja wraca na ekran edycji/podglądu.

### US-008: Mirror/Flip i auto-detekcja kierunku
- Tytuł: Lustrzany tekst i wykrywanie kierunku machania
- Opis: Jako użytkownik chcę wybrać czy napis wyświetli się lustrzanie, oraz by kierunek wyświetlania automatycznie dopasował się do mojego stylu machania, dla wygody i wyrazistości efektu.
- Kryteria akceptacji:
    - W trybie wyświetlania obecny szybki przełącznik „Mirror/Flip”.
    - Kierunek przewijania automatycznie wykrywany na starcie lub zmieniany przez użytkownika.
    - Ustawienie „Mirror” zapamiętywane per sesja.

### US-009: Interfejs i skalowanie
- Tytuł: Adaptacja UI do urządzenia i tryb immersyjny
- Opis: Jako użytkownik chcę, aby aplikacja wyglądała dobrze i była czytelna niezależnie od wielkości mojego ekranu i częstotliwości odświeżania.
- Kryteria akceptacji:
    - UI skaluje się do maksymalnej wysokości ekranu, marginesy boczne 8–10%.
    - Font i efekt przewijania są renderowane czytelnie przy 60/90/120 Hz.
    - Tryb immersyjny (ukrycie status bar/nav bar) aktywowany automatycznie przy wyświetlaniu.

### US-010: Onboarding i pomoc kontekstowa
- Tytuł: Szybki onboarding i czytelna pomoc
- Opis: Jako nowy użytkownik chcę otrzymać przystępną instrukcję obsługi z podglądem oraz szybkie wskazówki na ekranie głównym.
- Kryteria akceptacji:
    - Onboarding składa się z max. 3 prostych kroków/animacji.
    - Możliwość pominięcia po 10 s.
    - Skrócona wersja pomocy widoczna na ekranie głównym po zakończeniu onboardingu.
    - Pomoc dostępna również z menu/ikony.

### US-011: Opt-in do analityki i polityka prywatności
- Tytuł: Zgoda na podstawową analitykę (opt-in)
- Opis: Jako użytkownik chcę samodzielnie zadecydować, czy zgadzam się na zbieranie zanonimizowanych danych dotyczących użycia i udział w krótkiej ankiecie.
- Kryteria akceptacji:
    - Na pierwszym uruchomieniu aplikacja pyta o zgodę na anonimizowaną analitykę; odrzucenie nie pogarsza funkcji aplikacji.
    - Jest widoczny link do polityki prywatności i przetwarzania danych.
    - Survey (krótka ankieta) o czytelności wyświetla się po 2–3 użyciach, ale nie częściej niż raz na 30 dni; można zrezygnować trwale.

### US-012: Tryb demo/fallback bez zgody na sensory
- Tytuł: Użycie aplikacji przy braku zgody na ruch/żyroskop
- Opis: Jako użytkownik, który nie zgodził się na udostępnienie Motion/IMU, chcę nadal wypróbować efekt (scroll), nawet w trybie demo.
- Kryteria akceptacji:
    - Przy odmowie zgody aplikacja automatycznie przełącza w tryb demo (scroll bez adaptacji); prezentuje krótką instrukcję.
    - Możliwy powrót do pełnej funkcjonalności po nadaniu zgody (bez konieczności ponownej instalacji).

### US-013: Lokalizacja PL/EN i branding sklepowy
- Tytuł: Wielojęzykowość i zgodność brandingu
- Opis: Jako użytkownik chcę korzystać z aplikacji w języku polskim lub angielskim i widzieć spójny branding w sklepie (ikona, krótkie wideo, zgodność z politykami).
- Kryteria akceptacji:
    - Cały UI, onboarding, teksty pomocnicze i zgód dostępne min. po polsku i angielsku (automatyczna detekcja/zmiana ręczna).
    - W sklepie opis, grafika i polityka zgodne z brandingiem Noise chat; rating aplikacji 12+.

### US-014: Stabilność i zgodność z wymaganiami sklepu
- Tytuł: Stabilność działania, bezpieczeństwo, legalność w sklepach
- Opis: Jako operator sklepu i użytkownik chcę, żeby produkt spełniał wymagania Apple App Store i Google Play (kategorii, EULA, rating, disclaimer, jasność).
- Kryteria akceptacji:
    - Aplikacja nie zachęca do ryzykownych zachowań, zawiera ekrany ostrzegawcze, nie przekracza norm częstotliwości migotania.
    - EULA dostępna w aplikacji/sklepie wraz z polityką bezpieczeństwa.
    - Monitoring błędów/crashy i szybka auto-rekacja w razie awarii (przywracanie jasności, safe mode).
    - Weryfikacja znaku towarowego „Noise chat” przed wypuszczeniem produkcyjnym.

### US-015: Przerwania/przypadki skrajne
- Tytuł: Co się dzieje gdy coś pójdzie nie tak
- Opis: Jako użytkownik chcę, by po rozładowaniu, wyjściu z aplikacji, przegrzaniu lub crashu urządzenia aplikacja automatycznie resetowała jasność oraz pozostawała w bezpiecznym stanie.
- Kryteria akceptacji:
    - Aplikacja wykrywa przegrzanie/low power mode i automatycznie przełącza tryb na safe/fallback, z widocznym komunikatem.
    - Po wyjściu z trybu lub awarii ustawienia ekranu powracają do wartości sprzed uruchomienia wyświetlania.
    - Po powrocie z przerwanego działania użytkownik wraca na ekran edycji z zachowanym napisem.

### US-016: Brak osobnego uwierzytelniania (informacyjne)
- Tytuł: Użycie aplikacji bez konta/logowania
- Opis: Jako użytkownik chcę korzystać z aplikacji bez konieczności rejestracji lub logowania, zachowując prywatność i prostotę obsługi.
- Kryteria akceptacji:
    - Przy pierwszym i każdym kolejnym uruchomieniu nie jest wymagane tworzenie konta, podawanie emaila czy haseł.
    - Anonimowe device_id generowane lokalnie dla celów statystyk, nie jest powiązane z danymi osobowymi.

## 6. Metryki sukcesu

- Mediana liczby uruchomień głównego trybu/sesję: ≥3.
- Mediana czasu wyświetlania napisu: ≥30 s.
- Retencja D7: ≥15% (powrót 7 dnia od pierwszego użycia).
- Odsetek zaakceptowanych próśb jasności: ≥70%.
- Crash-free rate: ≥99% w skali 90-dniowej (wg crash reporting).
- Wyniki ślepego testu czytelności: ≥80% poprawnych odczytów (na min. 12 osobach, każda 20 prób, 3 zakresy prędkości).
- Wydajność: P90 FPS ≥55 przy 60/90/120 Hz; spadek jasności <5% przez 3 min.; brak tearingu/gittering artefaktów.
- Latencja (end-to-end): 30–60 ms (z pomiarem wewnętrznym i na wideo).
- Wynik survey o czytelności treści/efektu: min. 70% pozytywnych odpowiedzi po 2–3 użyciach.
- Udział błędów technicznych (np. fallback na scroll, safe mode itp.): <15% wszystkich sesji.
- Opt-in rate do analityki: min. 50% nowych użytkowników.
- Wynik ratingu i sklepowa NPS: min. 4.0 (przed monetyzacją/reklamami).

---
PRD podlega cyklicznej rewizji przed każdym kolejnym kamieniem milowym MVP i wersjami 1.x.
```
