import Map "mo:core/Map";

module {
  type OldActor = {
    calculationHistory : Map.Map<Nat, { id : Nat; calculatorName : Text; category : Text; inputSummary : Text; resultSummary : Text; timestamp : Int }>;
    calculatorUsage : Map.Map<Text, Nat>;
    nextCalculationId : Nat;
  };

  type NewActor = {
    unitMetadata : Map.Map<Text, { displayName : Text; symbol : Text; category : Text }>;
    conversionFactors : Map.Map<Text, Float>;
  };

  public func run(old : OldActor) : NewActor {
    {
      unitMetadata = Map.empty<Text, { displayName : Text; symbol : Text; category : Text }>();
      conversionFactors = Map.empty<Text, Float>();
    };
  };
};
