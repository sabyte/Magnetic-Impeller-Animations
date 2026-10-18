# Model notes

## Geometry represented

- External cylinder: diameter 9 mm, length 20 mm; diametric magnetization, driven by an N20 motor.
- The external magnet axis and the impeller shaft are parallel.
- The robot center is directly below the external magnet's longitudinal midpoint.
- Two cube magnets touch along the impeller shaft. Their magnetic moments point in the same transverse direction, across the shaft, following the user's corrected arrangement.
- The cube magnets are secured in the rotating impeller. The diagram does not model their mutual forces or housing stresses.
- The side view includes a stand and tubing supports. The blade shapes, housing, stands, and dimensions other than the stated external magnet dimensions are schematic, not imported CAD or measured geometry.

## Coordinates and rotation

The x axis follows the shaft. In the common end view, y points up and z points to the right. Clockwise and anticlockwise are always viewed from the same right-hand shaft ends, looking toward the motor. Looking from the opposite ends reverses both names.

The normalized source moment is:

`m_external = (0, sin(theta), cos(theta))`

Positive theta is anticlockwise in that end view. For a point directly below a point dipole, the normalized field is:

`B = (0, 2 sin(theta), -cos(theta))`

Therefore the local field rotates opposite to the source moment. Its tip traces an ellipse, and its magnitude and instantaneous angular speed vary through a turn.

The exact 2:1 transverse amplitude ratio is a **point-dipole approximation**, not a calibrated prediction for a finite 20 × 9 mm cylinder at close spacing. No mT, distance sweep, magnet grade, or measured RPM is inferred. Axial cancellation at the longitudinal symmetry plane applies to an ideal uniformly transverse-magnetized symmetric cylinder; the two point-dipole coefficients need not be exact for that finite cylinder.

The x component is zero at the centered ideal point by symmetry, not because there is no mechanical motion along x. Real sensor offsets, coordinate misalignment, magnet imperfections, and nearby materials can yield a nonzero measured shaft-parallel component. For measured data, calculate the magnitude using all three measured components unless excluding one is justified.

## Robot and magnetic torque

Magnetic torque is `tau = m_robot × B`. Transverse magnetization allows a torque around the shaft. The robot moment is prescribed to follow the computed local field with a fixed illustrative lag of 0.20 radians (about 11.5°). That lag is not measured and is not obtained by solving the robot's dynamical equations.

The animation assumes synchronous following. It does not predict startup, step-out, friction, fluid drag, inertia, slip, or stalling. At high driving speed or low available field, the real impeller may fail to follow the field. Within a synchronized cycle, the elliptically rotating field can also cause speed and lag variations not captured by a fixed-lag model.

## Fluid flow

The particles are prescribed visual tracers. They travel through the annular passage around the central hub, with a small illustrative transverse oscillation. No CFD, pressure solution, velocity profile, or flow measurement is included.

For the depicted flow convention:

| External magnet | Robot | Illustrated flow |
| --- | --- | --- |
| Clockwise | Anticlockwise | Right to left |
| Anticlockwise | Clockwise | Left to right |

The actual inlet depends on the impeller's blade handedness and rotation direction. Reversing the same impeller's rotation generally reverses its pumping tendency, but forward and reverse flow rates need not be equal. These particles do not establish which direction the user's physical blade geometry will pump.

## Defaults

The front view retains the earlier anticlockwise external / clockwise robot example. The side view opens with the latest requested clockwise external / anticlockwise robot example. Use the direction menu to compare them under the same rotation setting.

## Further reading

- [Magnetic localization and control of helical robots for clearing superficial blood clots](https://pmc.ncbi.nlm.nih.gov/articles/PMC6735531/) — transverse magnetization and rotating-field actuation.
- [Dynamics of a magnetic gear with two cogging-free operation modes](https://arxiv.org/abs/2008.05922) — how coupling geometry affects rotation direction and dynamics.
- [Magpylib field computation](https://magpylib.readthedocs.io/en/stable/_pages/user_guide/examples/examples_tutorial_field_computation.html) — for a future quantitative finite-magnet model.
