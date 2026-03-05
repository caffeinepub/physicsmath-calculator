# PhysicsMath Calculator

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Physics calculator modules:
  - Kinematics (velocity, acceleration, displacement, time)
  - Newton's Laws (force, mass, acceleration)
  - Energy & Work (kinetic energy, potential energy, work, power)
  - Thermodynamics (ideal gas law, heat transfer, Carnot efficiency)
  - Waves & Oscillations (frequency, wavelength, period, wave speed)
  - Electromagnetism (Ohm's law, Coulomb's law, capacitance, inductance)
  - Optics (Snell's law, lens equation, magnification)
  - Relativity (time dilation, length contraction, mass-energy equivalence E=mc²)
  - Quantum Mechanics (de Broglie wavelength, energy levels, Heisenberg uncertainty)
  - Gravitation (gravitational force, escape velocity, orbital period)

- Mathematics calculator modules:
  - Algebra (quadratic formula, linear equations)
  - Geometry (area, perimeter, volume of shapes)
  - Trigonometry (sin/cos/tan, law of sines/cosines)
  - Calculus (derivatives, integrals of common functions)
  - Statistics (mean, median, mode, standard deviation, variance)
  - Unit Converter (SI units, imperial, temperature, etc.)

- Frontend features:
  - Category-based navigation (tabs/sidebar for Physics vs Math)
  - Each calculator shows: formula display, labeled input fields, result display with units
  - Formula is rendered visually (LaTeX-style or styled text)
  - Calculation history stored in backend
  - Trending/popular calculators section on home
  - Dark/light mode toggle
  - Responsive design

- Backend features:
  - Store calculation history per session/user
  - Track usage count per calculator to surface trending calculators
  - Retrieve history and popular calculators

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan
1. Backend: define data types for calculation history (calculator name, inputs, result, timestamp) and usage tracking. Expose APIs: logCalculation, getHistory, getPopularCalculators.
2. Frontend: implement category navigation, individual calculator components, formula display, inputs, result rendering.
3. Frontend: implement trending/popular section on homepage.
4. Frontend: calculation history panel.
5. Frontend: dark/light mode toggle, responsive layout.
