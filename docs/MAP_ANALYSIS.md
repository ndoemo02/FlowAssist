# 🗺️ Analiza Modelu Mapy - Dokumentacja

## 📌 Przegląd

System automatycznej ekstrakcji danych z modelu GLTF miasta (`map_lviv_ukraine.glb`). Po załadowaniu widoku mapy, wszystkie obiekty typu Mesh są automatycznie analizowane i dostępne do inspekcji.

## 🚀 Jak używać

### 1. Uruchom widok mapy

Przejdź do: `http://localhost:3000/?view=map`

### 2. Otwórz konsolę przeglądarki

Naciśnij **F12** (Chrome/Edge) lub **Cmd+Option+I** (Mac) i przejdź do zakładki **Console**.

### 3. Sprawdź wyniki automatycznej analizy

Po załadowaniu modelu zobaczysz:

```
🚀 Model załadowany! Rozpoczynam ekstrakcję danych...
📦 Scena: Object3D {...}
🔍 Rozpoczynam analizę sceny...
📦 Całkowita liczba dzieci w scenie: X
✅ Znaleziono Y obiektów typu Mesh

📊 EKSTRAKCJA DANYCH MAPY
════════════════════════════════════════════════════════════
[Tabela z danymi]

📋 DANE W FORMACIE JSON:
[JSON array]

💾 Eksport do zmiennej:
window.mapData = [...]
✅ Dane zapisane w window.mapData
```

## 🔧 Dostępne Funkcje (w konsoli)

### `window.mapData`
Wszystkie wyekstrahowane dane w formacie tablicy obiektów.

```javascript
// Przykładowa struktura:
[
  {
    id: "building_01",
    pos: { x: 123.45, y: 0.00, z: -67.89 },
    type: "Mesh",
    boundingBox: {
      min: { x: 100, y: 0, z: -80 },
      max: { x: 150, y: 50, z: -50 }
    }
  },
  // ...
]
```

### `window.downloadMapData()`
Pobiera wszystkie dane jako plik JSON.

```javascript
window.downloadMapData();
// Pobierze plik: map_data.json
```

### `window.filterByName(pattern)`
Filtruje obiekty po nazwie (regex, case-insensitive).

```javascript
// Znajdź wszystkie budynki
window.filterByName("building");

// Znajdź drogi
window.filterByName("road");

// Znajdź wszystko zaczynające się na "tree"
window.filterByName("^tree");
```

### `window.filterByArea(minX, maxX, minZ, maxZ)`
Filtruje obiekty w określonym obszarze na płaszczyźnie XZ.

```javascript
// Znajdź wszystkie obiekty w obszarze
window.filterByArea(-100, 100, -100, 100);

// Kwadrant północno-wschodni
window.filterByArea(0, 1000, 0, 1000);
```

## 🎨 Interfejs Użytkownika

W prawym dolnym rogu widoku mapy znajdziesz panel narzędzi:

### 📥 Pobierz Dane
Kliknij przycisk z ikoną **Download**, aby pobrać plik JSON ze wszystkimi danymi.

### 🔍 Szukaj
1. Kliknij przycisk **Szukaj**
2. Wpisz wzorzec nazwy (np. "building", "road")
3. Naciśnij Enter lub kliknij "Szukaj"
4. Wyniki pojawią się w konsoli jako tabela

### 📍 Obszar
1. Kliknij przycisk **Obszar**
2. Wprowadź współrzędne obszaru (Min X, Max X, Min Z, Max Z)
3. Kliknij "Filtruj"
4. Wyniki pojawią się w konsoli jako tabela

## 📊 Struktura Danych

Każdy obiekt zawiera:

| Pole | Typ | Opis |
|------|-----|------|
| `id` | string | Nazwa obiektu z modelu (lub UUID jeśli brak nazwy) |
| `pos` | {x, y, z} | Pozycja centrum obiektu w przestrzeni świata |
| `type` | string | Typ obiektu Three.js (zazwyczaj "Mesh") |
| `boundingBox` | {min, max} | Granice obiektu (bounding box) |

## 💡 Przykłady Użycia

### Znalezienie wszystkich budynków
```javascript
const buildings = window.filterByName("building");
console.log(`Znaleziono ${buildings.length} budynków`);
```

### Analiza rozkładu obiektów
```javascript
const allObjects = window.mapData;
const avgX = allObjects.reduce((sum, obj) => sum + obj.pos.x, 0) / allObjects.length;
const avgZ = allObjects.reduce((sum, obj) => sum + obj.pos.z, 0) / allObjects.length;
console.log(`Środek mapy: X=${avgX.toFixed(2)}, Z=${avgZ.toFixed(2)}`);
```

### Eksport wybranych obiektów
```javascript
const selected = window.filterByName("important");
const json = JSON.stringify(selected, null, 2);
console.log(json);
// Możesz skopiować i zapisać ręcznie
```

### Utworzenie mapy kategorii
```javascript
const categories = {};
window.mapData.forEach(obj => {
  const category = obj.id.split('_')[0]; // Pierwsza część nazwy
  if (!categories[category]) categories[category] = [];
  categories[category].push(obj);
});
console.table(
  Object.entries(categories).map(([name, items]) => ({
    Kategoria: name,
    Liczba: items.length
  }))
);
```

## 🔨 Integracja z Bazą Danych

### Krok 1: Pobierz dane
```javascript
window.downloadMapData();
```

### Krok 2: Przetwórz JSON
Możesz teraz:
- Zaimportować do MongoDB/PostgreSQL
- Stworzyć API endpoint do zapytań
- Zbudować system spatial queries
- Zintegrować z Google Maps API

### Przykład struktury dla backendu
```typescript
interface MapObjectDB {
  id: string;
  name: string;
  coordinates: {
    type: 'Point',
    coordinates: [number, number] // [longitude, latitude] lub [x, z]
  };
  height: number; // pos.y
  boundingBox: {
    type: 'Polygon',
    coordinates: [...]
  };
  metadata: {
    type: string;
    category: string;
  };
}
```

## 🐛 Debugowanie

### Problem: Brak danych w konsoli
- Sprawdź, czy model się załadował (brak błędów w konsoli)
- Odśwież stronę (Ctrl+R)
- Upewnij się, że jesteś na `?view=map`

### Problem: Puste nazwy obiektów
- To normalne - niektóre obiekty w GLTF nie mają nazw
- System automatycznie przypisuje UUID: `unnamed_<uuid>`

### Problem: Dziwne współrzędne
- Pamiętaj, że model jest skalowany 1000x (line 43 w MapModel)
- Współrzędne są już przeliczone z uwzględnieniem skali

## 📝 Notatki

- System ekstrahuje tylko obiekty typu **Mesh** (pomija światła, kamery, itp.)
- Pozycje są obliczane w **world space** (uwzględniają transformacje)
- Dane są obliczane **tylko raz** po załadowaniu (wydajność)
- Wszystkie funkcje są dostępne tylko w przeglądarce (nie SSR)

## 🎯 Następne Kroki

Po ekstrakcji danych możesz:
1. ✅ Zapisać do bazy danych
2. ✅ Stworzyć backend API dla spatial queries
3. ✅ Zbudować system znaczników/POI
4. ✅ Dodać interaktywne klikanie obiektów
5. ✅ Integracja z Google Calendar/Sheets (już zrobione!)

---

**Utworzono**: 2026-01-18  
**Wersja**: 1.0  
**Autor**: Antigravity AI Assistant
