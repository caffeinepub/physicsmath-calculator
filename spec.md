# Land Survey Unit Converter

## Current State
No existing app. Starting fresh.

## Requested Changes (Diff)

### Add
- Land survey unit converter with all Indian local and international area units
- Input field for numeric value
- "From Unit" and "To Unit" dropdowns
- Instant conversion result display
- Conversion table showing the input value converted to all units simultaneously
- Mobile-responsive layout

### Modify
N/A

### Remove
N/A

## Implementation Plan

### Units to Support

**Indian Local Units (Bihar/UP/Jharkhand amin units):**
- Bigha (1 Bigha = 27220 sq ft)
- Kattha (1 Kattha = 1361 sq ft)
- Dhur (1 Dhur = 68.0625 sq ft)
- Dhurki (1 Dhurki = 17.015625 sq ft, i.e., 1/4 Dhur)
- Guniya (1 Guniya = 1361 sq ft, same as Kattha in Bihar context)
- Latha (1 Latha = 68.0625 sq ft, same as Dhur)
- Decimal / Dismil (1 Decimal = 435.6 sq ft)
- Cent (1 Cent = 435.6 sq ft)
- Guntha (1 Guntha = 1089 sq ft)
- Kanal (1 Kanal = 5445 sq ft)
- Marla (1 Marla = 272.25 sq ft)
- Biswa (1 Biswa = 1361 sq ft)
- Ground (1 Ground = 2400 sq ft)
- Are (1 Are = 1076.39 sq ft)

**International / Standard Units:**
- Square Millimeter (1 sq ft = 92903.04 mm²)
- Square Centimeter (1 sq ft = 929.0304 cm²)
- Square Meter (1 sq ft = 0.0929 m²)
- Square Kilometer (1 sq ft = 0.0000000929 km²)
- Square Foot (base unit)
- Square Yard (1 sq yd = 9 sq ft)
- Acre (1 Acre = 43560 sq ft)
- Hectare (1 Hectare = 107639.1 sq ft)

### Backend
- Single canister with a `convert(value: Float, fromUnit: Text, toUnit: Text) -> async Float` function
- Store conversion factors relative to square feet as base unit
- Return converted value

### Frontend
- Header with app name and tagline
- Converter card: value input, from/to unit selects, swap button, result display
- "Convert to All Units" table showing the entered value in every unit
- Clean, professional design with clear typography
