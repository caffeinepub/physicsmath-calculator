import Map "mo:core/Map";
import Array "mo:core/Array";
import Migration "migration";

(with migration = Migration.run)
actor {
  type UnitType = Text;
  type UnitCategory = Text;

  type UnitMetadata = {
    displayName : Text;
    symbol : Text;
    category : UnitCategory;
  };

  type ConversionResult = {
    fromUnit : UnitType;
    toUnit : UnitType;
    inputValue : Float;
    convertedValue : Float;
  };

  type AllUnitsConversion = {
    inputUnit : UnitType;
    inputValue : Float;
    conversions : [(UnitType, Float)];
  };

  let unitMetadata = Map.empty<UnitType, UnitMetadata>();
  let conversionFactors = Map.empty<UnitType, Float>();

  public shared ({ caller }) func initializeUnits() : async () {
    if (unitMetadata.isEmpty() or conversionFactors.isEmpty()) {
      addUnit("Bigha", "Bigha", "BGH", "Indian", 17424.0);
      addUnit("Kattha", "Kattha", "KTH", "Indian", 1360.0);
      addUnit("Dhur", "Dhur", "DHR", "Indian", 68.062);
      addUnit("Dhurki", "Dhurki", "DHK", "Indian", 1.3606);
      addUnit("Guniya", "Guniya", "GNY", "Indian", 34.031);
      addUnit("Latha", "Latha", "LTH", "Indian", 34.031);
      addUnit("Decimal", "Decimal", "DCM", "Indian", 435.6);
      addUnit("Cent", "Cent", "CNT", "Indian", 435.6);
      addUnit("Guntha", "Guntha", "GUN", "Indian", 1089.0);
      addUnit("Kanal", "Kanal", "KNL", "Indian", 5445.0);
      addUnit("Marla", "Marla", "MRL", "Indian", 272.25);
      addUnit("Biswa", "Biswa", "BSW", "Indian", 136.13);
      addUnit("Ground", "Ground", "GRD", "Indian", 2400.0);
      addUnit("Are", "Are", "International", "ARE", 1076.391);
      addUnit("SquareMillimeter", "sq mm", "mm²", "International", 0.000010764);
      addUnit("SquareCentimeter", "sq cm", "cm²", "International", 0.001076);
      addUnit("SquareMeter", "sq m", "m²", "International", 10.7639);
      addUnit("SquareKilometer", "sq km", "km²", "International", 10763910.417);
      addUnit("SquareFoot", "sq ft", "ft²", "International", 1.0);
      addUnit("SquareYard", "sq yd", "yd²", "International", 9.0);
      addUnit("Acre", "Acre", "AC", "International", 43560.0);
      addUnit("Hectare", "Hectare", "HA", "International", 107639.104);
    };
  };

  func addUnit(unitType : UnitType, displayName : Text, symbol : Text, category : UnitCategory, toSquareFeetFactor : Float) {
    unitMetadata.add(
      unitType,
      {
        displayName;
        symbol;
        category;
      },
    );
    conversionFactors.add(unitType, toSquareFeetFactor);
  };

  public query ({ caller }) func getUnitMetadata() : async [(UnitType, UnitMetadata)] {
    unitMetadata.toArray();
  };

  public query ({ caller }) func convertArea(fromUnit : UnitType, toUnit : UnitType, value : Float) : async ?ConversionResult {
    switch (conversionFactors.get(fromUnit), conversionFactors.get(toUnit)) {
      case (?fromFactor, ?toFactor) {
        let valueInSquareFeet = value * fromFactor;
        let convertedValue = valueInSquareFeet / toFactor;
        ?{
          fromUnit;
          toUnit;
          inputValue = value;
          convertedValue;
        };
      };
      case (_, _) { null };
    };
  };

  public query ({ caller }) func convertToAllUnits(inputUnit : UnitType, value : Float) : async ?AllUnitsConversion {
    switch (conversionFactors.get(inputUnit)) {
      case (?fromFactor) {
        let valueInSquareFeet = value * fromFactor;
        let conversions = conversionFactors.toArray().map(
          func((unit, toFactor)) {
            (unit, valueInSquareFeet / toFactor);
          }
        );
        ?{
          inputUnit;
          inputValue = value;
          conversions;
        };
      };
      case (null) { null };
    };
  };

  public shared ({ caller }) func clearUnitData() : async () {
    unitMetadata.clear();
    conversionFactors.clear();
  };

  public query ({ caller }) func getSupportedUnits() : async [UnitType] {
    unitMetadata.keys().toArray();
  };
};
