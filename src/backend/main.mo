import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Order "mo:core/Order";

actor {
  type CalculationRecord = {
    id : Nat;
    calculatorName : Text;
    category : Text; // "physics" or "math"
    inputSummary : Text;
    resultSummary : Text;
    timestamp : Int;
  };

  type PopularCalculator = {
    calculatorName : Text;
    category : Text;
    usageCount : Nat;
  };

  module PopularCalculator {
    public func compareByUsageCount(a : PopularCalculator, b : PopularCalculator) : Order.Order {
      Nat.compare(b.usageCount, a.usageCount);
    };
  };

  let calculationHistory = Map.empty<Nat, CalculationRecord>();
  let calculatorUsage = Map.empty<Text, Nat>();
  var nextCalculationId = 0;

  public shared ({ caller }) func logCalculation(
    calculatorName : Text,
    category : Text,
    inputSummary : Text,
    resultSummary : Text,
  ) : async () {
    let record : CalculationRecord = {
      id = nextCalculationId;
      calculatorName;
      category;
      inputSummary;
      resultSummary;
      timestamp = Time.now();
    };

    calculationHistory.add(nextCalculationId, record);
    nextCalculationId += 1;

    let currentUsage = switch (calculatorUsage.get(calculatorName)) {
      case (?count) { count };
      case (null) { 0 };
    };
    calculatorUsage.add(calculatorName, currentUsage + 1);
  };

  public query ({ caller }) func getCalculationHistory(limit : Nat) : async [CalculationRecord] {
    let totalRecords = calculationHistory.size();
    if (totalRecords == 0) {
      return [];
    };

    let sortedRecords = calculationHistory.values().toArray();

    let recordsToReturn = Nat.min(limit, totalRecords);
    sortedRecords.sliceToArray(0, recordsToReturn);
  };

  public query ({ caller }) func getPopularCalculators(limit : Nat) : async [PopularCalculator] {
    let popularCalculators = calculationHistory.values().toArray().map(
      func(record) {
        {
          calculatorName = record.calculatorName;
          category = record.category;
          usageCount = switch (calculatorUsage.get(record.calculatorName)) {
            case (?count) { count };
            case (null) { 0 };
          };
        };
      }
    );

    let sorted = popularCalculators.sort(PopularCalculator.compareByUsageCount);

    let recordsToReturn = Nat.min(limit, sorted.size());
    sorted.sliceToArray(0, recordsToReturn);
  };

  public shared ({ caller }) func clearHistory() : async () {
    calculationHistory.clear();
    calculatorUsage.clear();
    nextCalculationId := 0;
  };
};
