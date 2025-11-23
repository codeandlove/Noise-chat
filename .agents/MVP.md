```
## Dane Aplikacji

Aplikacja: Noise chat
Nazwa projektu: noise_chat
Platforma: Mobile app

## Specyfikacja pomysłu aplikacji
Aplikacja Noise chat pozwala użytkownikom tworzyć krótkie wiadomości, które stają się widoczne wyłącznie podczas szybkiego poruszania ekranem telefonu. Przy wykorzystaniu efektu powidoku (pozostałości światła) aplikacja wyświetla słowo w taki sposób, aby utworzyć w powietrzu czytelną wiadomość. Intuicyjny interfejs umożliwia wpisanie wybranego słowa (do 10 znaków) i natychmiastowe uruchomienie trybu wyświetlania. Efekt można łatwo wykorzystać podczas spotkań, koncertów lub jako kreatywną komunikację wizualną na imprezach.

### Stack technologiczny
**Frontend:**
- React Native (expo) – szybki czas wdrożenia, jeden kod dla iOS i Androida
- UI bazujący na gotowych komponentach (np. React Native Paper lub podobna biblioteka)
- Obsługa animacji: react-native-reanimated, react-native-gesture-handler

**Backend:**
- Brak backendu – wszystkie funkcjonalności lokalnie na urządzeniu

### Ogólny pomysł
Aplikacja Noise chat to ultraminimalistyczny sposób na generowanie świetlnych, dynamicznych napisów widocznych podczas machania telefonem. Użytkownik wpisuje krótką wiadomość (do 10 znaków), a aplikacja prezentuje napis z dynamicznymi efektami światła do uzyskania czytelnych „powidoków” podczas ruchu urządzeniem. Główny ekran to szybki input oraz intuicyjny przycisk „start”. Noise chat oferuje błyskawiczną gotowość do użycia bez logowania, ustawień czy zbędnych kroków.

### Docelowi użytkownicy
Docelowymi użytkownikami są osoby młode, kreatywne, uczestniczące w wydarzeniach masowych takich jak koncerty, festiwale, imprezy domowe, spotkania plenerowe czy eventy. Aplikacja odpowiada na potrzeby komunikacji wizualnej w tłumie, zabawy światłem oraz szybkiego i efektownego przekazywania prostych wiadomości w hałaśliwym lub ciemnym otoczeniu. Skierowana także do użytkowników social mediów zainteresowanych tworzeniem krótkich, efektownych materiałów wideo oraz osób szukających oryginalnych sposobów komunikacji bez użycia dźwięku.

### Problem użytkownika
Problemem jest czasochłonność, niewygoda i niska skuteczność przekazywania wiadomości w głośnym, ciemnym miejscu – tam, gdzie werbalna komunikacja zawodzi, a klasyczne sygnały świetlne są monotonne i nieczytelne. Noise chat rozwiązuje go, umożliwiając bardzo szybkie, efektowne, dynamiczne wyświetlenie dowolnego krótkiego napisu – widocznego wyłącznie dzięki ruchowi telefonu. Eliminuje to konieczność korzystania z kartek, krzyczenia czy aplikacji wymagających wielu kroków konfiguracji.

### Zakres MVP

**Zawiera:**
- Input tekstowy z limitem znaków (10 znaków)
- Główny ekran z natychmiastowym trybem wyświetlania po wpisaniu napisu
- Dynamiczne wyświetlenie tekstu z efektem świetlnym (wysoki kontrast, jasne barwy)
- Instrukcja „jak używać” (grafika/krótki opis na ekranie startowym)
- Ready-do-use UI z dużymi przyciskami i czytelnym układem, bazujące na gotowych komponentach
- Tylko tryb poziomy lub automatyczne przełączenie do najwygodniejszego widoku podczas trybu wyświetlania

**Nie zawiera:**
- Brak jakiejkolwiek personalizacji (fonty, kolory, efekty inne niż standardowe)
- Brak historii wiadomości i zapisanych tekstów
- Brak kont, logowania i synchronizacji
- Brak opcji dzielenia się wygenerowanymi efektami w mediach społecznościowych
- Brak wsparcia dla dłuższych wiadomości, emoji czy niestandardowych animacji
- Brak reklam w MVP
- Brak płatnych funkcji dodatkowych na starcie

### Monetyzacja
Rekomendowana droga monetyzacji: model freemium. Bazowe funkcje (obejmujące MVP) pozostają zawsze za darmo, co napędza szybkie rozprzestrzenianie się i efekty viralowe. Monetyzacja poprzez jednorazową mikroopłatę lub subskrypcję w zamian za dodatkowe efekty świetlne, większy limit znaków, personalizację fontów/kolorów oraz tryby premium (np. różne style animacji). Możliwość usunięcia drobnej reklamy w wersji darmowej.
Do MVP monetyzacja nie jest konieczna – można wprowadzić ją później.

### Finalizacja
Noise chat to ultra-prosty, mobilny sposób na wizualne komunikowanie się w tłumie lub na imprezach poprzez dynamiczne napisy widoczne w powietrzu. MVP aplikacji skupia się wyłącznie na jednym, efektownym use-case: wpisz, wyświetl, użyj – wszystko bez konta, logowania i zbędnych dodatków. Minimalistyczny UI zgodny z trendami i brak potrzeby backendu gwarantują błyskawiczny czas wdrożenia oraz bezproblemową obsługę na wszystkich urządzeniach. Taki koncept pozwoli szybko sprawdzić popyt, zebrać feedback i rozwijać produkt w kierunku mocnej personalizacji oraz monetyzacji w przyszłości.
```