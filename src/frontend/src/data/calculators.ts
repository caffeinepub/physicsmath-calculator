export interface CalculatorField {
  id: string;
  label: string;
  unit?: string;
  placeholder?: string;
  type?: "number" | "text";
  hint?: string;
}

export interface CalculatorDef {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  formula: string;
  formulaLatex?: string;
  fields: CalculatorField[];
  calculate: (inputs: Record<string, string>) => CalculatorResult;
}

export interface CalculatorResult {
  value: string;
  unit: string;
  explanation: string;
  inputSummary: string;
}

// ─── Constants ────────────────────────────────────────────────────────────
const G = 6.674e-11; // gravitational constant
const c = 3e8; // speed of light m/s
const h = 6.626e-34; // Planck constant
const hbar = 1.0546e-34; // reduced Planck
const k = 8.988e9; // Coulomb constant
const R = 8.314; // gas constant
const g = 9.81; // gravitational acceleration
const eV = 1.602e-19; // electron volt in joules

function fmt(n: number, decimals = 4): string {
  if (!Number.isFinite(n)) return "undefined";
  if (Math.abs(n) === 0) return "0";
  if (Math.abs(n) >= 1e6 || (Math.abs(n) < 0.001 && Math.abs(n) > 0)) {
    return n.toExponential(decimals);
  }
  return Number.parseFloat(n.toFixed(decimals)).toString();
}

function deg2rad(d: number) {
  return (d * Math.PI) / 180;
}
function rad2deg(r: number) {
  return (r * 180) / Math.PI;
}

// ─── Physics Calculators ──────────────────────────────────────────────────

const physicsCalculators: CalculatorDef[] = [
  // ── Kinematics ────────────────────────────────────────────────────────
  {
    id: "kinematics-velocity",
    name: "Final Velocity (v = u + at)",
    category: "Physics",
    subcategory: "Kinematics",
    description:
      "Calculate the final velocity of an object under constant acceleration.",
    formula: "v = u + at",
    fields: [
      { id: "u", label: "Initial Velocity (u)", unit: "m/s", placeholder: "0" },
      { id: "a", label: "Acceleration (a)", unit: "m/s²", placeholder: "9.81" },
      { id: "t", label: "Time (t)", unit: "s", placeholder: "5" },
    ],
    calculate({ u, a, t }) {
      const uu = Number.parseFloat(u);
      const aa = Number.parseFloat(a);
      const tt = Number.parseFloat(t);
      const v = uu + aa * tt;
      return {
        value: fmt(v),
        unit: "m/s",
        explanation: `With initial velocity ${uu} m/s, acceleration ${aa} m/s², over ${tt} s, the final velocity is ${fmt(v)} m/s.`,
        inputSummary: `u=${uu} m/s, a=${aa} m/s², t=${tt} s`,
      };
    },
  },
  {
    id: "kinematics-displacement",
    name: "Displacement (s = ut + ½at²)",
    category: "Physics",
    subcategory: "Kinematics",
    description: "Calculate displacement under constant acceleration.",
    formula: "s = ut + ½at²",
    fields: [
      { id: "u", label: "Initial Velocity (u)", unit: "m/s", placeholder: "0" },
      { id: "a", label: "Acceleration (a)", unit: "m/s²", placeholder: "9.81" },
      { id: "t", label: "Time (t)", unit: "s", placeholder: "5" },
    ],
    calculate({ u, a, t }) {
      const uu = Number.parseFloat(u);
      const aa = Number.parseFloat(a);
      const tt = Number.parseFloat(t);
      const s = uu * tt + 0.5 * aa * tt * tt;
      return {
        value: fmt(s),
        unit: "m",
        explanation: `Displacement = ${uu}×${tt} + ½×${aa}×${tt}² = ${fmt(s)} m.`,
        inputSummary: `u=${uu} m/s, a=${aa} m/s², t=${tt} s`,
      };
    },
  },
  {
    id: "kinematics-v2",
    name: "Final Velocity Squared (v² = u² + 2as)",
    category: "Physics",
    subcategory: "Kinematics",
    description: "Find final velocity using displacement instead of time.",
    formula: "v² = u² + 2as",
    fields: [
      {
        id: "u",
        label: "Initial Velocity (u)",
        unit: "m/s",
        placeholder: "10",
      },
      { id: "a", label: "Acceleration (a)", unit: "m/s²", placeholder: "2" },
      { id: "s", label: "Displacement (s)", unit: "m", placeholder: "50" },
    ],
    calculate({ u, a, s }) {
      const uu = Number.parseFloat(u);
      const aa = Number.parseFloat(a);
      const ss = Number.parseFloat(s);
      const v2 = uu * uu + 2 * aa * ss;
      if (v2 < 0)
        return {
          value: "No real solution",
          unit: "",
          explanation:
            "v² is negative — object cannot reach this displacement.",
          inputSummary: `u=${uu}, a=${aa}, s=${ss}`,
        };
      const v = Math.sqrt(v2);
      return {
        value: fmt(v),
        unit: "m/s",
        explanation: `v² = ${uu}² + 2×${aa}×${ss} = ${fmt(v2)}, so v = ${fmt(v)} m/s.`,
        inputSummary: `u=${uu} m/s, a=${aa} m/s², s=${ss} m`,
      };
    },
  },

  // ── Newton's Laws ─────────────────────────────────────────────────────
  {
    id: "newton-force",
    name: "Newton's Second Law (F = ma)",
    category: "Physics",
    subcategory: "Newton's Laws",
    description: "Calculate the net force acting on an object.",
    formula: "F = m × a",
    fields: [
      { id: "m", label: "Mass (m)", unit: "kg", placeholder: "10" },
      { id: "a", label: "Acceleration (a)", unit: "m/s²", placeholder: "9.81" },
    ],
    calculate({ m, a }) {
      const mm = Number.parseFloat(m);
      const aa = Number.parseFloat(a);
      const F = mm * aa;
      return {
        value: fmt(F),
        unit: "N",
        explanation: `Force = ${mm} kg × ${aa} m/s² = ${fmt(F)} N.`,
        inputSummary: `m=${mm} kg, a=${aa} m/s²`,
      };
    },
  },
  {
    id: "newton-weight",
    name: "Weight (W = mg)",
    category: "Physics",
    subcategory: "Newton's Laws",
    description: "Calculate the gravitational weight of an object on Earth.",
    formula: "W = m × g",
    fields: [
      { id: "m", label: "Mass (m)", unit: "kg", placeholder: "70" },
      {
        id: "gv",
        label: "Gravitational Acceleration (g)",
        unit: "m/s²",
        placeholder: "9.81",
        hint: "9.81 on Earth",
      },
    ],
    calculate({ m, gv }) {
      const mm = Number.parseFloat(m);
      const gg = Number.parseFloat(gv) || g;
      const W = mm * gg;
      return {
        value: fmt(W),
        unit: "N",
        explanation: `Weight = ${mm} kg × ${fmt(gg)} m/s² = ${fmt(W)} N.`,
        inputSummary: `m=${mm} kg, g=${fmt(gg)} m/s²`,
      };
    },
  },
  {
    id: "newton-friction",
    name: "Friction Force (f = μN)",
    category: "Physics",
    subcategory: "Newton's Laws",
    description: "Calculate the friction force between two surfaces.",
    formula: "f = μ × N",
    fields: [
      {
        id: "mu",
        label: "Coefficient of Friction (μ)",
        placeholder: "0.3",
        hint: "0.1–1.0 typical",
      },
      { id: "N", label: "Normal Force (N)", unit: "N", placeholder: "100" },
    ],
    calculate({ mu, N }) {
      const mmu = Number.parseFloat(mu);
      const NN = Number.parseFloat(N);
      const f = mmu * NN;
      return {
        value: fmt(f),
        unit: "N",
        explanation: `Friction = ${mmu} × ${NN} N = ${fmt(f)} N.`,
        inputSummary: `μ=${mmu}, N=${NN} N`,
      };
    },
  },

  // ── Energy & Work ─────────────────────────────────────────────────────
  {
    id: "energy-kinetic",
    name: "Kinetic Energy (KE = ½mv²)",
    category: "Physics",
    subcategory: "Energy & Work",
    description: "Calculate the kinetic energy of a moving object.",
    formula: "KE = ½mv²",
    fields: [
      { id: "m", label: "Mass (m)", unit: "kg", placeholder: "10" },
      { id: "v", label: "Velocity (v)", unit: "m/s", placeholder: "20" },
    ],
    calculate({ m, v }) {
      const mm = Number.parseFloat(m);
      const vv = Number.parseFloat(v);
      const KE = 0.5 * mm * vv * vv;
      return {
        value: fmt(KE),
        unit: "J",
        explanation: `KE = ½ × ${mm} × ${vv}² = ${fmt(KE)} J.`,
        inputSummary: `m=${mm} kg, v=${vv} m/s`,
      };
    },
  },
  {
    id: "energy-potential",
    name: "Potential Energy (PE = mgh)",
    category: "Physics",
    subcategory: "Energy & Work",
    description: "Calculate gravitational potential energy.",
    formula: "PE = mgh",
    fields: [
      { id: "m", label: "Mass (m)", unit: "kg", placeholder: "10" },
      { id: "gv", label: "Gravity (g)", unit: "m/s²", placeholder: "9.81" },
      { id: "h", label: "Height (h)", unit: "m", placeholder: "100" },
    ],
    calculate({ m, gv, h }) {
      const mm = Number.parseFloat(m);
      const gg = Number.parseFloat(gv) || g;
      const hh = Number.parseFloat(h);
      const PE = mm * gg * hh;
      return {
        value: fmt(PE),
        unit: "J",
        explanation: `PE = ${mm} × ${fmt(gg)} × ${hh} = ${fmt(PE)} J.`,
        inputSummary: `m=${mm} kg, g=${fmt(gg)}, h=${hh} m`,
      };
    },
  },
  {
    id: "energy-work",
    name: "Work Done (W = Fd·cosθ)",
    category: "Physics",
    subcategory: "Energy & Work",
    description: "Calculate work done by a force at an angle.",
    formula: "W = F × d × cos(θ)",
    fields: [
      { id: "F", label: "Force (F)", unit: "N", placeholder: "100" },
      { id: "d", label: "Displacement (d)", unit: "m", placeholder: "50" },
      {
        id: "theta",
        label: "Angle (θ)",
        unit: "°",
        placeholder: "30",
        hint: "Angle between force and motion",
      },
    ],
    calculate({ F, d, theta }) {
      const FF = Number.parseFloat(F);
      const dd = Number.parseFloat(d);
      const th = Number.parseFloat(theta);
      const W = FF * dd * Math.cos(deg2rad(th));
      return {
        value: fmt(W),
        unit: "J",
        explanation: `W = ${FF} × ${dd} × cos(${th}°) = ${fmt(W)} J.`,
        inputSummary: `F=${FF} N, d=${dd} m, θ=${th}°`,
      };
    },
  },
  {
    id: "energy-power",
    name: "Power (P = W/t)",
    category: "Physics",
    subcategory: "Energy & Work",
    description: "Calculate power as rate of work done.",
    formula: "P = W / t",
    fields: [
      { id: "W", label: "Work Done (W)", unit: "J", placeholder: "1000" },
      { id: "t", label: "Time (t)", unit: "s", placeholder: "10" },
    ],
    calculate({ W, t }) {
      const WW = Number.parseFloat(W);
      const tt = Number.parseFloat(t);
      const P = WW / tt;
      return {
        value: fmt(P),
        unit: "W",
        explanation: `P = ${WW} J / ${tt} s = ${fmt(P)} W.`,
        inputSummary: `W=${WW} J, t=${tt} s`,
      };
    },
  },

  // ── Thermodynamics ────────────────────────────────────────────────────
  {
    id: "thermo-ideal-gas",
    name: "Ideal Gas Law (PV = nRT)",
    category: "Physics",
    subcategory: "Thermodynamics",
    description:
      "Relate pressure, volume, moles, and temperature of an ideal gas.",
    formula: "PV = nRT",
    fields: [
      { id: "n", label: "Moles of Gas (n)", unit: "mol", placeholder: "1" },
      { id: "T", label: "Temperature (T)", unit: "K", placeholder: "300" },
      { id: "V", label: "Volume (V)", unit: "m³", placeholder: "0.0245" },
    ],
    calculate({ n, T, V }) {
      const nn = Number.parseFloat(n);
      const TT = Number.parseFloat(T);
      const VV = Number.parseFloat(V);
      const P = (nn * R * TT) / VV;
      return {
        value: fmt(P),
        unit: "Pa",
        explanation: `P = nRT/V = ${nn}×8.314×${TT}/${VV} = ${fmt(P)} Pa.`,
        inputSummary: `n=${nn} mol, T=${TT} K, V=${VV} m³`,
      };
    },
  },
  {
    id: "thermo-carnot",
    name: "Carnot Efficiency (η = 1 − Tc/Th)",
    category: "Physics",
    subcategory: "Thermodynamics",
    description: "Maximum theoretical efficiency of a heat engine.",
    formula: "η = 1 − Tc/Th",
    fields: [
      {
        id: "Tc",
        label: "Cold Reservoir Temp (Tc)",
        unit: "K",
        placeholder: "300",
      },
      {
        id: "Th",
        label: "Hot Reservoir Temp (Th)",
        unit: "K",
        placeholder: "600",
      },
    ],
    calculate({ Tc, Th }) {
      const tc = Number.parseFloat(Tc);
      const th = Number.parseFloat(Th);
      const eta = 1 - tc / th;
      return {
        value: fmt(eta * 100),
        unit: "%",
        explanation: `η = 1 − ${tc}/${th} = ${fmt(eta)} = ${fmt(eta * 100)}%.`,
        inputSummary: `Tc=${tc} K, Th=${th} K`,
      };
    },
  },
  {
    id: "thermo-heat",
    name: "Heat Transfer (Q = mcΔT)",
    category: "Physics",
    subcategory: "Thermodynamics",
    description: "Calculate heat absorbed or released by a substance.",
    formula: "Q = m × c × ΔT",
    fields: [
      { id: "m", label: "Mass (m)", unit: "kg", placeholder: "2" },
      {
        id: "csp",
        label: "Specific Heat (c)",
        unit: "J/(kg·K)",
        placeholder: "4186",
        hint: "Water: 4186 J/(kg·K)",
      },
      {
        id: "dT",
        label: "Temperature Change (ΔT)",
        unit: "K",
        placeholder: "20",
      },
    ],
    calculate({ m, csp, dT }) {
      const mm = Number.parseFloat(m);
      const cc = Number.parseFloat(csp);
      const dTT = Number.parseFloat(dT);
      const Q = mm * cc * dTT;
      return {
        value: fmt(Q),
        unit: "J",
        explanation: `Q = ${mm} × ${cc} × ${dTT} = ${fmt(Q)} J.`,
        inputSummary: `m=${mm} kg, c=${cc} J/(kg·K), ΔT=${dTT} K`,
      };
    },
  },

  // ── Waves ─────────────────────────────────────────────────────────────
  {
    id: "waves-speed",
    name: "Wave Speed (v = fλ)",
    category: "Physics",
    subcategory: "Waves",
    description: "Calculate the speed of a wave from frequency and wavelength.",
    formula: "v = f × λ",
    fields: [
      { id: "f", label: "Frequency (f)", unit: "Hz", placeholder: "440" },
      {
        id: "lambda",
        label: "Wavelength (λ)",
        unit: "m",
        placeholder: "0.773",
      },
    ],
    calculate({ f, lambda }) {
      const ff = Number.parseFloat(f);
      const ll = Number.parseFloat(lambda);
      const v = ff * ll;
      return {
        value: fmt(v),
        unit: "m/s",
        explanation: `v = ${ff} Hz × ${ll} m = ${fmt(v)} m/s.`,
        inputSummary: `f=${ff} Hz, λ=${ll} m`,
      };
    },
  },
  {
    id: "waves-period",
    name: "Wave Period (T = 1/f)",
    category: "Physics",
    subcategory: "Waves",
    description: "Calculate the period of oscillation from frequency.",
    formula: "T = 1 / f",
    fields: [
      { id: "f", label: "Frequency (f)", unit: "Hz", placeholder: "60" },
    ],
    calculate({ f }) {
      const ff = Number.parseFloat(f);
      const T = 1 / ff;
      return {
        value: fmt(T),
        unit: "s",
        explanation: `T = 1/${ff} = ${fmt(T)} s.`,
        inputSummary: `f=${ff} Hz`,
      };
    },
  },
  {
    id: "waves-wavelength",
    name: "Wavelength (λ = v/f)",
    category: "Physics",
    subcategory: "Waves",
    description: "Calculate wavelength from wave speed and frequency.",
    formula: "λ = v / f",
    fields: [
      {
        id: "v",
        label: "Wave Speed (v)",
        unit: "m/s",
        placeholder: "343",
        hint: "Sound in air: ~343 m/s",
      },
      { id: "f", label: "Frequency (f)", unit: "Hz", placeholder: "440" },
    ],
    calculate({ v, f }) {
      const vv = Number.parseFloat(v);
      const ff = Number.parseFloat(f);
      const lambda = vv / ff;
      return {
        value: fmt(lambda),
        unit: "m",
        explanation: `λ = ${vv}/${ff} = ${fmt(lambda)} m.`,
        inputSummary: `v=${vv} m/s, f=${ff} Hz`,
      };
    },
  },

  // ── Electromagnetism ──────────────────────────────────────────────────
  {
    id: "em-ohm",
    name: "Ohm's Law (V = IR)",
    category: "Physics",
    subcategory: "Electromagnetism",
    description: "Relate voltage, current, and resistance in a circuit.",
    formula: "V = I × R",
    fields: [
      { id: "I", label: "Current (I)", unit: "A", placeholder: "2" },
      { id: "R", label: "Resistance (R)", unit: "Ω", placeholder: "50" },
    ],
    calculate({ I, R }) {
      const II = Number.parseFloat(I);
      const RR = Number.parseFloat(R);
      const V = II * RR;
      return {
        value: fmt(V),
        unit: "V",
        explanation: `V = ${II} A × ${RR} Ω = ${fmt(V)} V.`,
        inputSummary: `I=${II} A, R=${RR} Ω`,
      };
    },
  },
  {
    id: "em-coulomb",
    name: "Coulomb's Law (F = kq₁q₂/r²)",
    category: "Physics",
    subcategory: "Electromagnetism",
    description: "Calculate the electrostatic force between two point charges.",
    formula: "F = k × q₁ × q₂ / r²",
    fields: [
      { id: "q1", label: "Charge q₁", unit: "C", placeholder: "1e-6" },
      { id: "q2", label: "Charge q₂", unit: "C", placeholder: "1e-6" },
      { id: "r", label: "Separation (r)", unit: "m", placeholder: "0.1" },
    ],
    calculate({ q1, q2, r }) {
      const qq1 = Number.parseFloat(q1);
      const qq2 = Number.parseFloat(q2);
      const rr = Number.parseFloat(r);
      const F = (k * qq1 * qq2) / (rr * rr);
      return {
        value: fmt(F),
        unit: "N",
        explanation: `F = 8.988×10⁹ × ${qq1} × ${qq2} / ${rr}² = ${fmt(F)} N.`,
        inputSummary: `q₁=${qq1} C, q₂=${qq2} C, r=${rr} m`,
      };
    },
  },
  {
    id: "em-capacitance",
    name: "Capacitance (C = Q/V)",
    category: "Physics",
    subcategory: "Electromagnetism",
    description: "Calculate electrical capacitance from charge and voltage.",
    formula: "C = Q / V",
    fields: [
      { id: "Q", label: "Charge (Q)", unit: "C", placeholder: "0.001" },
      { id: "V", label: "Voltage (V)", unit: "V", placeholder: "100" },
    ],
    calculate({ Q, V }) {
      const QQ = Number.parseFloat(Q);
      const VV = Number.parseFloat(V);
      const C = QQ / VV;
      return {
        value: fmt(C),
        unit: "F",
        explanation: `C = ${QQ} C / ${VV} V = ${fmt(C)} F.`,
        inputSummary: `Q=${QQ} C, V=${VV} V`,
      };
    },
  },

  // ── Optics ────────────────────────────────────────────────────────────
  {
    id: "optics-snell",
    name: "Snell's Law (n₁sinθ₁ = n₂sinθ₂)",
    category: "Physics",
    subcategory: "Optics",
    description: "Find the refraction angle when light passes between media.",
    formula: "n₁ × sin(θ₁) = n₂ × sin(θ₂)",
    fields: [
      {
        id: "n1",
        label: "Refractive Index n₁",
        placeholder: "1",
        hint: "Air ≈ 1.0",
      },
      {
        id: "theta1",
        label: "Incident Angle θ₁",
        unit: "°",
        placeholder: "45",
      },
      {
        id: "n2",
        label: "Refractive Index n₂",
        placeholder: "1.5",
        hint: "Glass ≈ 1.5",
      },
    ],
    calculate({ n1, theta1, n2 }) {
      const nn1 = Number.parseFloat(n1);
      const t1 = Number.parseFloat(theta1);
      const nn2 = Number.parseFloat(n2);
      const sinT2 = (nn1 * Math.sin(deg2rad(t1))) / nn2;
      if (Math.abs(sinT2) > 1)
        return {
          value: "Total internal reflection",
          unit: "",
          explanation:
            "The angle exceeds the critical angle — total internal reflection occurs.",
          inputSummary: `n₁=${nn1}, θ₁=${t1}°, n₂=${nn2}`,
        };
      const theta2 = rad2deg(Math.asin(sinT2));
      return {
        value: fmt(theta2),
        unit: "°",
        explanation: `θ₂ = arcsin(${nn1}×sin(${t1}°)/${nn2}) = ${fmt(theta2)}°.`,
        inputSummary: `n₁=${nn1}, θ₁=${t1}°, n₂=${nn2}`,
      };
    },
  },
  {
    id: "optics-lens",
    name: "Lens Equation (1/f = 1/v + 1/u)",
    category: "Physics",
    subcategory: "Optics",
    description:
      "Find focal length, image or object distance using the thin lens formula.",
    formula: "1/f = 1/v + 1/u",
    fields: [
      {
        id: "u",
        label: "Object Distance (u)",
        unit: "m",
        placeholder: "0.3",
        hint: "Negative for real object",
      },
      { id: "v", label: "Image Distance (v)", unit: "m", placeholder: "0.6" },
    ],
    calculate({ u, v }) {
      const uu = Number.parseFloat(u);
      const vv = Number.parseFloat(v);
      const f = 1 / (1 / vv + 1 / uu);
      return {
        value: fmt(f),
        unit: "m",
        explanation: `1/f = 1/${vv} + 1/${uu} → f = ${fmt(f)} m.`,
        inputSummary: `u=${uu} m, v=${vv} m`,
      };
    },
  },

  // ── Relativity ────────────────────────────────────────────────────────
  {
    id: "relativity-time-dilation",
    name: "Time Dilation (t' = t/√(1−v²/c²))",
    category: "Physics",
    subcategory: "Relativity",
    description:
      "Time experienced by a moving observer relative to a stationary frame.",
    formula: "t′ = t / √(1 − v²/c²)",
    fields: [
      { id: "t", label: "Proper Time (t)", unit: "s", placeholder: "1" },
      {
        id: "v",
        label: "Velocity (v)",
        unit: "m/s",
        placeholder: "2.6e8",
        hint: "Must be < 3×10⁸ m/s",
      },
    ],
    calculate({ t, v }) {
      const tt = Number.parseFloat(t);
      const vv = Number.parseFloat(v);
      const beta = vv / c;
      if (Math.abs(beta) >= 1)
        return {
          value: "Invalid",
          unit: "",
          explanation: "Velocity must be less than the speed of light.",
          inputSummary: `t=${tt}, v=${vv}`,
        };
      const gamma = 1 / Math.sqrt(1 - beta * beta);
      const tPrime = tt * gamma;
      return {
        value: fmt(tPrime),
        unit: "s",
        explanation: `γ = ${fmt(gamma)}, t′ = ${tt}×${fmt(gamma)} = ${fmt(tPrime)} s (dilated time).`,
        inputSummary: `t=${tt} s, v=${vv} m/s`,
      };
    },
  },
  {
    id: "relativity-mass-energy",
    name: "Mass-Energy Equivalence (E = mc²)",
    category: "Physics",
    subcategory: "Relativity",
    description: "Calculate energy equivalent of a given mass.",
    formula: "E = m × c²",
    fields: [{ id: "m", label: "Mass (m)", unit: "kg", placeholder: "0.001" }],
    calculate({ m }) {
      const mm = Number.parseFloat(m);
      const E = mm * c * c;
      return {
        value: fmt(E),
        unit: "J",
        explanation: `E = ${mm} × (3×10⁸)² = ${fmt(E)} J = ${fmt(E / 1e6)} MJ.`,
        inputSummary: `m=${mm} kg`,
      };
    },
  },
  {
    id: "relativity-length-contraction",
    name: "Length Contraction (L = L₀√(1−v²/c²))",
    category: "Physics",
    subcategory: "Relativity",
    description: "Contracted length observed for a moving object.",
    formula: "L = L₀ × √(1 − v²/c²)",
    fields: [
      { id: "L0", label: "Proper Length (L₀)", unit: "m", placeholder: "10" },
      { id: "v", label: "Velocity (v)", unit: "m/s", placeholder: "2.4e8" },
    ],
    calculate({ L0, v }) {
      const LL0 = Number.parseFloat(L0);
      const vv = Number.parseFloat(v);
      const beta = vv / c;
      if (Math.abs(beta) >= 1)
        return {
          value: "Invalid",
          unit: "",
          explanation: "Velocity must be < speed of light.",
          inputSummary: `L₀=${LL0}, v=${vv}`,
        };
      const L = LL0 * Math.sqrt(1 - beta * beta);
      return {
        value: fmt(L),
        unit: "m",
        explanation: `L = ${LL0} × √(1 − (${vv}/c)²) = ${fmt(L)} m.`,
        inputSummary: `L₀=${LL0} m, v=${vv} m/s`,
      };
    },
  },

  // ── Quantum Mechanics ─────────────────────────────────────────────────
  {
    id: "quantum-de-broglie",
    name: "de Broglie Wavelength (λ = h/mv)",
    category: "Physics",
    subcategory: "Quantum Mechanics",
    description: "Wave-particle duality: wavelength of a moving particle.",
    formula: "λ = h / (mv)",
    fields: [
      {
        id: "m",
        label: "Mass (m)",
        unit: "kg",
        placeholder: "9.11e-31",
        hint: "Electron: 9.11×10⁻³¹ kg",
      },
      { id: "v", label: "Velocity (v)", unit: "m/s", placeholder: "1e6" },
    ],
    calculate({ m, v }) {
      const mm = Number.parseFloat(m);
      const vv = Number.parseFloat(v);
      const lambda = h / (mm * vv);
      return {
        value: fmt(lambda),
        unit: "m",
        explanation: `λ = 6.626×10⁻³⁴ / (${mm}×${vv}) = ${fmt(lambda)} m.`,
        inputSummary: `m=${mm} kg, v=${vv} m/s`,
      };
    },
  },
  {
    id: "quantum-hydrogen-energy",
    name: "Hydrogen Energy Levels (Eₙ = −13.6/n² eV)",
    category: "Physics",
    subcategory: "Quantum Mechanics",
    description: "Energy of the nth energy level of the hydrogen atom.",
    formula: "Eₙ = −13.6 / n² eV",
    fields: [
      {
        id: "n",
        label: "Principal Quantum Number (n)",
        placeholder: "2",
        hint: "Integer ≥ 1",
      },
    ],
    calculate({ n }) {
      const nn = Number.parseFloat(n);
      const E = -13.6 / (nn * nn);
      return {
        value: fmt(E),
        unit: "eV",
        explanation: `E${nn} = −13.6 / ${nn}² = ${fmt(E)} eV = ${fmt(E * eV)} J.`,
        inputSummary: `n=${nn}`,
      };
    },
  },
  {
    id: "quantum-heisenberg",
    name: "Heisenberg Uncertainty (ΔxΔp ≥ ℏ/2)",
    category: "Physics",
    subcategory: "Quantum Mechanics",
    description:
      "Minimum uncertainty in momentum given uncertainty in position.",
    formula: "Δp ≥ ℏ / (2 × Δx)",
    fields: [
      {
        id: "dx",
        label: "Position Uncertainty (Δx)",
        unit: "m",
        placeholder: "1e-10",
        hint: "Atomic scale: ~10⁻¹⁰ m",
      },
    ],
    calculate({ dx }) {
      const dxx = Number.parseFloat(dx);
      const dp = hbar / (2 * dxx);
      return {
        value: fmt(dp),
        unit: "kg·m/s",
        explanation: `Δp_min = ℏ/(2×${dxx}) = ${fmt(dp)} kg·m/s.`,
        inputSummary: `Δx=${dxx} m`,
      };
    },
  },

  // ── Gravitation ───────────────────────────────────────────────────────
  {
    id: "gravity-force",
    name: "Gravitational Force (F = Gm₁m₂/r²)",
    category: "Physics",
    subcategory: "Gravitation",
    description: "Newton's law of universal gravitation.",
    formula: "F = G × m₁ × m₂ / r²",
    fields: [
      {
        id: "m1",
        label: "Mass m₁",
        unit: "kg",
        placeholder: "5.972e24",
        hint: "Earth: 5.972×10²⁴ kg",
      },
      { id: "m2", label: "Mass m₂", unit: "kg", placeholder: "70" },
      {
        id: "r",
        label: "Separation (r)",
        unit: "m",
        placeholder: "6.371e6",
        hint: "Earth radius: 6.371×10⁶ m",
      },
    ],
    calculate({ m1, m2, r }) {
      const mm1 = Number.parseFloat(m1);
      const mm2 = Number.parseFloat(m2);
      const rr = Number.parseFloat(r);
      const F = (G * mm1 * mm2) / (rr * rr);
      return {
        value: fmt(F),
        unit: "N",
        explanation: `F = 6.674×10⁻¹¹ × ${mm1} × ${mm2} / ${rr}² = ${fmt(F)} N.`,
        inputSummary: `m₁=${mm1} kg, m₂=${mm2} kg, r=${rr} m`,
      };
    },
  },
  {
    id: "gravity-escape",
    name: "Escape Velocity (v = √(2GM/R))",
    category: "Physics",
    subcategory: "Gravitation",
    description:
      "Minimum speed to escape a celestial body's gravitational pull.",
    formula: "v = √(2GM / R)",
    fields: [
      {
        id: "M",
        label: "Mass of Body (M)",
        unit: "kg",
        placeholder: "5.972e24",
      },
      {
        id: "R",
        label: "Radius of Body (R)",
        unit: "m",
        placeholder: "6.371e6",
      },
    ],
    calculate({ M, R }) {
      const MM = Number.parseFloat(M);
      const RR = Number.parseFloat(R);
      const v = Math.sqrt((2 * G * MM) / RR);
      return {
        value: fmt(v),
        unit: "m/s",
        explanation: `v = √(2 × 6.674×10⁻¹¹ × ${MM} / ${RR}) = ${fmt(v)} m/s ≈ ${fmt(v / 1000)} km/s.`,
        inputSummary: `M=${MM} kg, R=${RR} m`,
      };
    },
  },
  {
    id: "gravity-orbital-period",
    name: "Orbital Period (T = 2π√(r³/GM))",
    category: "Physics",
    subcategory: "Gravitation",
    description: "Period of a circular orbit around a massive body.",
    formula: "T = 2π × √(r³ / GM)",
    fields: [
      {
        id: "r",
        label: "Orbital Radius (r)",
        unit: "m",
        placeholder: "3.844e8",
        hint: "Moon: 3.844×10⁸ m",
      },
      {
        id: "M",
        label: "Central Body Mass (M)",
        unit: "kg",
        placeholder: "5.972e24",
      },
    ],
    calculate({ r, M }) {
      const rr = Number.parseFloat(r);
      const MM = Number.parseFloat(M);
      const T = 2 * Math.PI * Math.sqrt((rr * rr * rr) / (G * MM));
      return {
        value: fmt(T),
        unit: "s",
        explanation: `T = 2π√(${rr}³/(G×${MM})) = ${fmt(T)} s ≈ ${fmt(T / 86400)} days.`,
        inputSummary: `r=${rr} m, M=${MM} kg`,
      };
    },
  },
];

// ─── Math Calculators ─────────────────────────────────────────────────────

const mathCalculators: CalculatorDef[] = [
  // ── Algebra ───────────────────────────────────────────────────────────
  {
    id: "algebra-quadratic",
    name: "Quadratic Formula",
    category: "Mathematics",
    subcategory: "Algebra",
    description: "Solve ax² + bx + c = 0 for x.",
    formula: "x = (−b ± √(b² − 4ac)) / 2a",
    fields: [
      { id: "a", label: "Coefficient a", placeholder: "1" },
      { id: "b", label: "Coefficient b", placeholder: "-5" },
      { id: "c", label: "Coefficient c", placeholder: "6" },
    ],
    calculate({ a, b, c }) {
      const aa = Number.parseFloat(a);
      const bb = Number.parseFloat(b);
      const cc = Number.parseFloat(c);
      const disc = bb * bb - 4 * aa * cc;
      if (disc < 0) {
        const re = -bb / (2 * aa);
        const im = Math.sqrt(-disc) / (2 * aa);
        return {
          value: `${fmt(re)} ± ${fmt(im)}i`,
          unit: "",
          explanation: `Complex roots: x = ${fmt(re)} + ${fmt(im)}i and x = ${fmt(re)} − ${fmt(im)}i.`,
          inputSummary: `a=${aa}, b=${bb}, c=${cc}`,
        };
      }
      const x1 = (-bb + Math.sqrt(disc)) / (2 * aa);
      const x2 = (-bb - Math.sqrt(disc)) / (2 * aa);
      return {
        value: disc === 0 ? fmt(x1) : `${fmt(x1)}, ${fmt(x2)}`,
        unit: "",
        explanation:
          disc === 0
            ? `One repeated root: x = ${fmt(x1)}.`
            : `Two roots: x₁ = ${fmt(x1)}, x₂ = ${fmt(x2)}.`,
        inputSummary: `a=${aa}, b=${bb}, c=${cc}`,
      };
    },
  },
  {
    id: "algebra-linear",
    name: "Linear Equation (ax + b = c)",
    category: "Mathematics",
    subcategory: "Algebra",
    description: "Solve a linear equation for x.",
    formula: "x = (c − b) / a",
    fields: [
      { id: "a", label: "Coefficient a", placeholder: "3" },
      { id: "b", label: "Constant b", placeholder: "5" },
      { id: "cc", label: "Right-hand side c", placeholder: "20" },
    ],
    calculate({ a, b, cc }) {
      const aa = Number.parseFloat(a);
      const bb = Number.parseFloat(b);
      const ccc = Number.parseFloat(cc);
      if (aa === 0)
        return {
          value: "No solution",
          unit: "",
          explanation: "Coefficient a cannot be zero.",
          inputSummary: `a=${aa}, b=${bb}, c=${ccc}`,
        };
      const x = (ccc - bb) / aa;
      return {
        value: fmt(x),
        unit: "",
        explanation: `x = (${ccc} − ${bb}) / ${aa} = ${fmt(x)}.`,
        inputSummary: `a=${aa}, b=${bb}, c=${ccc}`,
      };
    },
  },

  // ── Geometry ──────────────────────────────────────────────────────────
  {
    id: "geometry-circle",
    name: "Circle (Area & Circumference)",
    category: "Mathematics",
    subcategory: "Geometry",
    description: "Calculate area and circumference of a circle.",
    formula: "A = πr²,  C = 2πr",
    fields: [{ id: "r", label: "Radius (r)", unit: "units", placeholder: "5" }],
    calculate({ r }) {
      const rr = Number.parseFloat(r);
      const A = Math.PI * rr * rr;
      const C = 2 * Math.PI * rr;
      return {
        value: `A=${fmt(A)}, C=${fmt(C)}`,
        unit: "units², units",
        explanation: `Area = π×${rr}² = ${fmt(A)} sq units. Circumference = 2π×${rr} = ${fmt(C)} units.`,
        inputSummary: `r=${rr}`,
      };
    },
  },
  {
    id: "geometry-rectangle",
    name: "Rectangle (Area & Perimeter)",
    category: "Mathematics",
    subcategory: "Geometry",
    description: "Calculate area and perimeter of a rectangle.",
    formula: "A = l × w,  P = 2(l + w)",
    fields: [
      { id: "l", label: "Length (l)", unit: "units", placeholder: "8" },
      { id: "w", label: "Width (w)", unit: "units", placeholder: "5" },
    ],
    calculate({ l, w }) {
      const ll = Number.parseFloat(l);
      const ww = Number.parseFloat(w);
      const A = ll * ww;
      const P = 2 * (ll + ww);
      return {
        value: `A=${fmt(A)}, P=${fmt(P)}`,
        unit: "units², units",
        explanation: `Area = ${ll}×${ww} = ${fmt(A)}. Perimeter = 2×(${ll}+${ww}) = ${fmt(P)}.`,
        inputSummary: `l=${ll}, w=${ww}`,
      };
    },
  },
  {
    id: "geometry-sphere",
    name: "Sphere (Volume & Surface Area)",
    category: "Mathematics",
    subcategory: "Geometry",
    description: "Calculate volume and surface area of a sphere.",
    formula: "V = (4/3)πr³,  A = 4πr²",
    fields: [{ id: "r", label: "Radius (r)", unit: "units", placeholder: "3" }],
    calculate({ r }) {
      const rr = Number.parseFloat(r);
      const V = (4 / 3) * Math.PI * rr * rr * rr;
      const A = 4 * Math.PI * rr * rr;
      return {
        value: `V=${fmt(V)}, A=${fmt(A)}`,
        unit: "units³, units²",
        explanation: `Volume = (4/3)π×${rr}³ = ${fmt(V)}. Surface area = 4π×${rr}² = ${fmt(A)}.`,
        inputSummary: `r=${rr}`,
      };
    },
  },
  {
    id: "geometry-cylinder",
    name: "Cylinder (Volume & Surface Area)",
    category: "Mathematics",
    subcategory: "Geometry",
    description: "Calculate volume and surface area of a cylinder.",
    formula: "V = πr²h,  A = 2πr(r+h)",
    fields: [
      { id: "r", label: "Radius (r)", unit: "units", placeholder: "4" },
      { id: "h", label: "Height (h)", unit: "units", placeholder: "10" },
    ],
    calculate({ r, h }) {
      const rr = Number.parseFloat(r);
      const hh = Number.parseFloat(h);
      const V = Math.PI * rr * rr * hh;
      const A = 2 * Math.PI * rr * (rr + hh);
      return {
        value: `V=${fmt(V)}, A=${fmt(A)}`,
        unit: "units³, units²",
        explanation: `Volume = π×${rr}²×${hh} = ${fmt(V)}. Surface area = 2π×${rr}×(${rr}+${hh}) = ${fmt(A)}.`,
        inputSummary: `r=${rr}, h=${hh}`,
      };
    },
  },
  {
    id: "geometry-triangle",
    name: "Triangle (Area & Hypotenuse)",
    category: "Mathematics",
    subcategory: "Geometry",
    description: "Area of triangle and hypotenuse of right triangle.",
    formula: "A = ½bh,  c = √(a²+b²)",
    fields: [
      { id: "base", label: "Base (b)", unit: "units", placeholder: "6" },
      { id: "height", label: "Height (h)", unit: "units", placeholder: "4" },
      {
        id: "a",
        label: "Leg a (for hypotenuse)",
        unit: "units",
        placeholder: "3",
      },
    ],
    calculate({ base, height, a }) {
      const bb = Number.parseFloat(base);
      const hh = Number.parseFloat(height);
      const aa = Number.parseFloat(a);
      const A = 0.5 * bb * hh;
      const c = Math.sqrt(aa * aa + bb * bb);
      return {
        value: `A=${fmt(A)}, c=${fmt(c)}`,
        unit: "units², units",
        explanation: `Area = ½×${bb}×${hh} = ${fmt(A)}. Hypotenuse = √(${aa}²+${bb}²) = ${fmt(c)}.`,
        inputSummary: `base=${bb}, h=${hh}, a=${aa}`,
      };
    },
  },

  // ── Trigonometry ──────────────────────────────────────────────────────
  {
    id: "trig-basic",
    name: "Sin / Cos / Tan",
    category: "Mathematics",
    subcategory: "Trigonometry",
    description: "Calculate all basic trig functions for an angle.",
    formula: "sin(θ), cos(θ), tan(θ)",
    fields: [{ id: "theta", label: "Angle (θ)", unit: "°", placeholder: "45" }],
    calculate({ theta }) {
      const th = Number.parseFloat(theta);
      const s = Math.sin(deg2rad(th));
      const co = Math.cos(deg2rad(th));
      const ta = Math.tan(deg2rad(th));
      return {
        value: `sin=${fmt(s)}, cos=${fmt(co)}, tan=${fmt(ta)}`,
        unit: "",
        explanation: `sin(${th}°) = ${fmt(s)}, cos(${th}°) = ${fmt(co)}, tan(${th}°) = ${fmt(ta)}.`,
        inputSummary: `θ=${th}°`,
      };
    },
  },
  {
    id: "trig-law-sines",
    name: "Law of Sines",
    category: "Mathematics",
    subcategory: "Trigonometry",
    description: "Find side b using the law of sines: a/sin(A) = b/sin(B).",
    formula: "b = a × sin(B) / sin(A)",
    fields: [
      { id: "a", label: "Side a", unit: "units", placeholder: "10" },
      { id: "A", label: "Angle A", unit: "°", placeholder: "45" },
      { id: "B", label: "Angle B", unit: "°", placeholder: "60" },
    ],
    calculate({ a, A, B }) {
      const aa = Number.parseFloat(a);
      const AA = Number.parseFloat(A);
      const BB = Number.parseFloat(B);
      const b = (aa * Math.sin(deg2rad(BB))) / Math.sin(deg2rad(AA));
      return {
        value: fmt(b),
        unit: "units",
        explanation: `b = ${aa} × sin(${BB}°) / sin(${AA}°) = ${fmt(b)}.`,
        inputSummary: `a=${aa}, A=${AA}°, B=${BB}°`,
      };
    },
  },
  {
    id: "trig-law-cosines",
    name: "Law of Cosines",
    category: "Mathematics",
    subcategory: "Trigonometry",
    description: "Find side c using: c² = a² + b² − 2ab·cos(C).",
    formula: "c = √(a² + b² − 2ab·cos(C))",
    fields: [
      { id: "a", label: "Side a", unit: "units", placeholder: "5" },
      { id: "b", label: "Side b", unit: "units", placeholder: "7" },
      { id: "C", label: "Included Angle C", unit: "°", placeholder: "60" },
    ],
    calculate({ a, b, C }) {
      const aa = Number.parseFloat(a);
      const bb = Number.parseFloat(b);
      const CC = Number.parseFloat(C);
      const c2 = aa * aa + bb * bb - 2 * aa * bb * Math.cos(deg2rad(CC));
      const c = Math.sqrt(c2);
      return {
        value: fmt(c),
        unit: "units",
        explanation: `c = √(${aa}²+${bb}²−2×${aa}×${bb}×cos(${CC}°)) = ${fmt(c)}.`,
        inputSummary: `a=${aa}, b=${bb}, C=${CC}°`,
      };
    },
  },

  // ── Calculus ──────────────────────────────────────────────────────────
  {
    id: "calculus-power-derivative",
    name: "Power Rule Derivative",
    category: "Mathematics",
    subcategory: "Calculus",
    description: "Find the derivative of xⁿ at a given x value.",
    formula: "d/dx(xⁿ) = n × xⁿ⁻¹",
    fields: [
      { id: "n", label: "Exponent (n)", placeholder: "3" },
      { id: "x", label: "Evaluate at x", placeholder: "2" },
    ],
    calculate({ n, x }) {
      const nn = Number.parseFloat(n);
      const xx = Number.parseFloat(x);
      const deriv = nn * xx ** (nn - 1);
      return {
        value: fmt(deriv),
        unit: "",
        explanation: `d/dx(x^${nn}) = ${nn}x^${nn - 1}. At x=${xx}: ${nn}×${xx}^${nn - 1} = ${fmt(deriv)}.`,
        inputSummary: `n=${nn}, x=${xx}`,
      };
    },
  },
  {
    id: "calculus-power-integral",
    name: "Power Rule Integral",
    category: "Mathematics",
    subcategory: "Calculus",
    description: "Calculate the definite integral of xⁿ from a to b.",
    formula: "∫xⁿdx = xⁿ⁺¹/(n+1) + C",
    fields: [
      { id: "n", label: "Exponent (n)", placeholder: "2", hint: "n ≠ -1" },
      { id: "a", label: "Lower Bound (a)", placeholder: "0" },
      { id: "b", label: "Upper Bound (b)", placeholder: "3" },
    ],
    calculate({ n, a, b }) {
      const nn = Number.parseFloat(n);
      const aa = Number.parseFloat(a);
      const bb = Number.parseFloat(b);
      if (nn === -1)
        return {
          value: "ln|b/a|",
          unit: "",
          explanation: "For n=−1, use ln(|b|) − ln(|a|).",
          inputSummary: `n=${nn}`,
        };
      const integral = (bb ** (nn + 1) - aa ** (nn + 1)) / (nn + 1);
      return {
        value: fmt(integral),
        unit: "",
        explanation: `∫[${aa} to ${bb}] x^${nn}dx = [x^${nn + 1}/${nn + 1}] = ${fmt(bb ** (nn + 1) / (nn + 1))} − ${fmt(aa ** (nn + 1) / (nn + 1))} = ${fmt(integral)}.`,
        inputSummary: `n=${nn}, from ${aa} to ${bb}`,
      };
    },
  },

  // ── Statistics ────────────────────────────────────────────────────────
  {
    id: "stats-mean-median-mode",
    name: "Mean, Median & Mode",
    category: "Mathematics",
    subcategory: "Statistics",
    description: "Calculate central tendency measures for a dataset.",
    formula: "Mean = Σx/n,  Median = middle value",
    fields: [
      {
        id: "data",
        label: "Data Values",
        type: "text",
        placeholder: "4, 7, 2, 9, 5, 7, 3",
        hint: "Comma-separated numbers",
      },
    ],
    calculate({ data }) {
      const vals = data
        .split(",")
        .map((s) => Number.parseFloat(s.trim()))
        .filter((v) => !Number.isNaN(v));
      if (vals.length === 0)
        return {
          value: "No valid data",
          unit: "",
          explanation: "Enter comma-separated numbers.",
          inputSummary: "empty",
        };
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
      const sorted = [...vals].sort((a, b) => a - b);
      const n = sorted.length;
      const median =
        n % 2 === 0
          ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
          : sorted[Math.floor(n / 2)];
      const freq: Record<string, number> = vals.reduce(
        (acc, v) => {
          acc[v] = (acc[v] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );
      const maxF = Math.max(...Object.values(freq));
      const modes = Object.keys(freq).filter((k) => freq[k] === maxF);
      return {
        value: `Mean=${fmt(mean)}, Median=${fmt(median)}, Mode=${modes.join(",")}`,
        unit: "",
        explanation: `n=${n}. Mean=${fmt(mean)}, Median=${fmt(median)}, Mode=${modes.join(", ")} (each appears ${maxF}×).`,
        inputSummary: `data: ${data.slice(0, 40)}`,
      };
    },
  },
  {
    id: "stats-std-dev",
    name: "Standard Deviation & Variance",
    category: "Mathematics",
    subcategory: "Statistics",
    description: "Measure spread of data around the mean.",
    formula: "σ = √(Σ(x−μ)²/n)",
    fields: [
      {
        id: "data",
        label: "Data Values",
        type: "text",
        placeholder: "2, 4, 4, 4, 5, 5, 7, 9",
        hint: "Comma-separated numbers",
      },
    ],
    calculate({ data }) {
      const vals = data
        .split(",")
        .map((s) => Number.parseFloat(s.trim()))
        .filter((v) => !Number.isNaN(v));
      if (vals.length < 2)
        return {
          value: "Need ≥ 2 values",
          unit: "",
          explanation: "Enter at least two numbers.",
          inputSummary: "insufficient",
        };
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
      const variance =
        vals.reduce((sum, v) => sum + (v - mean) ** 2, 0) / vals.length;
      const std = Math.sqrt(variance);
      return {
        value: `σ=${fmt(std)}, σ²=${fmt(variance)}`,
        unit: "",
        explanation: `Mean=${fmt(mean)}, Variance=${fmt(variance)}, Std Dev=${fmt(std)}.`,
        inputSummary: `n=${vals.length} values`,
      };
    },
  },

  // ── Unit Converter ────────────────────────────────────────────────────
  {
    id: "convert-length",
    name: "Length Converter",
    category: "Mathematics",
    subcategory: "Unit Converter",
    description: "Convert between meters, km, feet, and miles.",
    formula: "m ↔ km ↔ ft ↔ mi",
    fields: [
      { id: "value", label: "Value", placeholder: "1" },
      {
        id: "from",
        label: "From Unit",
        type: "text",
        placeholder: "m",
        hint: "m, km, ft, mi",
      },
    ],
    calculate({ value, from }) {
      const v = Number.parseFloat(value);
      const toMeters: Record<string, number> = {
        m: 1,
        km: 1000,
        ft: 0.3048,
        mi: 1609.344,
      };
      const f = from.trim().toLowerCase();
      if (!toMeters[f])
        return {
          value: "Unknown unit",
          unit: "",
          explanation: "Valid units: m, km, ft, mi.",
          inputSummary: `${v} ${f}`,
        };
      const inM = v * toMeters[f];
      const results = Object.entries(toMeters).map(
        ([u, factor]) => `${fmt(inM / factor)} ${u}`,
      );
      return {
        value: results
          .filter((r) => !r.startsWith(`${fmt(v)} ${f}`))
          .slice(0, 3)
          .join(", "),
        unit: "",
        explanation: `${v} ${f} = ${results.join(" = ")}.`,
        inputSummary: `${v} ${f}`,
      };
    },
  },
  {
    id: "convert-temperature",
    name: "Temperature Converter",
    category: "Mathematics",
    subcategory: "Unit Converter",
    description: "Convert between Celsius, Fahrenheit, and Kelvin.",
    formula: "°C ↔ °F ↔ K",
    fields: [
      { id: "value", label: "Temperature", placeholder: "100" },
      {
        id: "from",
        label: "From Unit",
        type: "text",
        placeholder: "C",
        hint: "C, F, or K",
      },
    ],
    calculate({ value, from }) {
      const v = Number.parseFloat(value);
      const f = from.trim().toUpperCase();
      let celsius: number;
      if (f === "C") celsius = v;
      else if (f === "F") celsius = ((v - 32) * 5) / 9;
      else if (f === "K") celsius = v - 273.15;
      else
        return {
          value: "Unknown unit",
          unit: "",
          explanation: "Use C, F, or K.",
          inputSummary: `${v} ${f}`,
        };
      const F = (celsius * 9) / 5 + 32;
      const K = celsius + 273.15;
      return {
        value: `${fmt(celsius)}°C = ${fmt(F)}°F = ${fmt(K)} K`,
        unit: "",
        explanation: `${v}${f} = ${fmt(celsius)}°C = ${fmt(F)}°F = ${fmt(K)} K.`,
        inputSummary: `${v}${f}`,
      };
    },
  },
  {
    id: "convert-mass",
    name: "Mass Converter",
    category: "Mathematics",
    subcategory: "Unit Converter",
    description: "Convert between kg, g, pounds, and ounces.",
    formula: "kg ↔ g ↔ lb ↔ oz",
    fields: [
      { id: "value", label: "Mass Value", placeholder: "1" },
      {
        id: "from",
        label: "From Unit",
        type: "text",
        placeholder: "kg",
        hint: "kg, g, lb, oz",
      },
    ],
    calculate({ value, from }) {
      const v = Number.parseFloat(value);
      const toKg: Record<string, number> = {
        kg: 1,
        g: 0.001,
        lb: 0.453592,
        oz: 0.0283495,
      };
      const f = from.trim().toLowerCase();
      if (!toKg[f])
        return {
          value: "Unknown unit",
          unit: "",
          explanation: "Valid: kg, g, lb, oz.",
          inputSummary: `${v} ${f}`,
        };
      const inKg = v * toKg[f];
      const results = Object.entries(toKg).map(
        ([u, factor]) => `${fmt(inKg / factor)} ${u}`,
      );
      return {
        value: results
          .filter((r) => !r.startsWith(`${fmt(v)} ${f}`))
          .slice(0, 3)
          .join(", "),
        unit: "",
        explanation: `${v} ${f} = ${results.join(" = ")}.`,
        inputSummary: `${v} ${f}`,
      };
    },
  },
  {
    id: "convert-speed",
    name: "Speed Converter",
    category: "Mathematics",
    subcategory: "Unit Converter",
    description: "Convert between m/s, km/h, and mph.",
    formula: "m/s ↔ km/h ↔ mph",
    fields: [
      { id: "value", label: "Speed Value", placeholder: "60" },
      {
        id: "from",
        label: "From Unit",
        type: "text",
        placeholder: "kmh",
        hint: "ms, kmh, mph",
      },
    ],
    calculate({ value, from }) {
      const v = Number.parseFloat(value);
      const toMs: Record<string, number> = {
        ms: 1,
        kmh: 1 / 3.6,
        mph: 0.44704,
      };
      const f = from.trim().toLowerCase().replace("/", "");
      if (!toMs[f])
        return {
          value: "Unknown unit",
          unit: "",
          explanation: "Valid: ms, kmh, mph.",
          inputSummary: `${v} ${f}`,
        };
      const inMs = v * toMs[f];
      return {
        value: `${fmt(inMs)} m/s, ${fmt(inMs * 3.6)} km/h, ${fmt(inMs / 0.44704)} mph`,
        unit: "",
        explanation: `${v} ${f} = ${fmt(inMs)} m/s = ${fmt(inMs * 3.6)} km/h = ${fmt(inMs / 0.44704)} mph.`,
        inputSummary: `${v} ${f}`,
      };
    },
  },
];

export const allCalculators: CalculatorDef[] = [
  ...physicsCalculators,
  ...mathCalculators,
];

export const physicsSubcategories = [
  "Kinematics",
  "Newton's Laws",
  "Energy & Work",
  "Thermodynamics",
  "Waves",
  "Electromagnetism",
  "Optics",
  "Relativity",
  "Quantum Mechanics",
  "Gravitation",
];

export const mathSubcategories = [
  "Algebra",
  "Geometry",
  "Trigonometry",
  "Calculus",
  "Statistics",
  "Unit Converter",
];

export function getCalculatorsBySubcategory(sub: string) {
  return allCalculators.filter((c) => c.subcategory === sub);
}
