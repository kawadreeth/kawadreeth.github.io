// SITE DATA — single editable file for content

const ABOUT = {
  name: "Reeth S. Kawad",
  title: "Mechanical Engineer",
  tagline: "Hardware Test · Controls · Simulation",
  sub: "Clean Energy · Robotics · Dynamic Systems",
  bio: [
    "I'm a Mechanical Engineering student at USC (May 2026), focused on sustainable innovation, automation, and a special interest in thermofluid systems.",
    "My work sits at the intersection of physical hardware and intelligent system behaviour — I design, build, instrument, and test systems that interact with the real world.",
    "I'm actively looking for roles in robotics, clean energy, industrial automation, and hardware-focused engineering — wherever rigorous first-principles thinking and hands-on experimentation create real-world impact."
  ],
  photo: "assets/profile_picture.png",
  email: "reethkawad@gmail.com",
  linkedin: "https://www.linkedin.com/in/reethkawad/",
  github: "https://github.com/reethkawad",
  resume: "assets/Reeth_Kawad_CV.pdf"
};

// Projects (converted from legacy `data/projects.js` format)
const PROJECTS = [
  {
    slug: "vawt",
    year: 2025,
    links: [{ label: "Slides", url: "https://docs.google.com/presentation/d/1t6lhI9ofmo4_cDY-ZPjM7k2vi1ViNJeDVvUjHwRXDxI/edit" }],
    title: "Adaptive Pitch Control VAWT",
    zone: "cleantech",
    thumb: "assets/projects/vawt/slide_12.png",
    tags: ["VAWT", "Collective Pitch", "Lookup Table", "NACA0018", "Wind Tunnel", "LabVIEW", "Servo Actuation"],
    gallery: [
      "assets/projects/vawt/poster.png",
      "assets/projects/vawt/slide_06.png",
      "assets/projects/vawt/slide_07.png",
      "assets/projects/vawt/slide_09.png",
      "assets/projects/vawt/slide_10.png",
      "assets/projects/vawt/slide_11.png",
      "assets/projects/vawt/slide_12.png",
      "assets/projects/vawt/slide_13.png",
      "assets/projects/vawt/slide_14.png",
      "assets/projects/vawt/slide_15.png",
      "assets/projects/vawt/slide_16.png",
      "assets/projects/vawt/slide_17.png",
      "assets/projects/vawt/slide_18.png",
      "assets/projects/vawt/slide_19.png",
    ],
    star: {
      situation: "Vertical-axis wind turbines are omnidirectional and perform well in turbulent, urban wind, but sit at lower power coefficients (Cp ~ 0.2–0.35). Adaptive collective blade pitch is reported to add ~10% Cp in simulation, yet has little experimental validation.",
      task: "Design, build, and wind-tunnel test a NACA0018 VAWT with adaptive collective (and individual) blade pitch control, targeting a ~5% experimental Cp increase over a fixed-pitch baseline. Four-person team (group G9).",
      action: [
        "Selected the NACA0018 airfoil (highest torque coefficient per a 2019 EUCASS 2-D CFD study); built the rotor around a carbon-fibre shaft with hollow 3D-printed blades, Al 6061 bearing plates, an 8020 support frame, and a slip ring.",
        "Designed the pitch mechanism: 4.6 kg-cm HobbyPark servos on 3D-printed mounts with a servo horn epoxied to a 0.24-inch aluminium rod.",
        "Collective control — swept blade angle 0:5:30° in the wind tunnel to build a Cp–AoA lookup table across 15–21 m/s in LabVIEW.",
        "Individual control — implemented a sinusoidal pitch law versus azimuth (actuated every 20°) with a PID controller and a position encoder.",
        "Machined the bearing plates for concentricity and press-fit the bearings; ran a slip-ring friction test with calibrated weights."
      ],
      result: [
        "Cut slip-ring breakaway friction from >500 g to 150 g after lubrication.",
        "Of three wind-tunnel configurations, chord 3 in / height 5.75 in achieved rotation (above ~10 m/s wind speed).",
        "Across pitch angles, Run 3 (15°) gave the highest average RPM at 38.78 ± 16.09, vs 6°: 12.60, 25°: 30.25, 45°: 15.48; baseline electrical power ~3e-5 W on the best trial.",
        "Open issues carried into the next phase: one faulty servo, unstable oscillatory rotation, and a blade that snapped on the final test — next steps are servo replacement, ABS-reprinted airfoils, stable baseline oscillations, and completing the lookup table."
      ]
    }
  },
  {
    slug: "dexhand",
    year: 2025,
    title: "8 DoF Robotic Hand",
    zone: "robotics",
    thumb: "assets/projects/dexhand/thumb.png",
    tags: ["Robotics", "Mechanical Design", "Actuation", "SolidWorks", "MuJoCo", "C++"],
    gallery: [],
    star: {
      situation: "USC's DRCL is developing an 8-DOF robotic hand capable of catching and throwing a basketball at 20 N force — requiring compliant actuation for safe, controllable contact.",
      task: "Design and prototype the Series Elastic Actuator (SEA) module and rigid finger joints with parallel link mechanism, and validate force feedback fidelity through bench testing.",
      action: [
        "Designed 8-DOF finger joint assemblies with parallel link mechanisms in SolidWorks.",
        "Designed and rapid-prototyped an SEA test fixture for an N20 motor — spring selection, mounting, adhesive strategy, and locking mechanism.",
        "Performed torque calculations for N20 motor selection and validated output torque and compliance against design targets using bench-level force sensor measurements.",
        "Wrote C++ motor driver code for low-level motor control.",
        "Simulated hand kinematics and dynamics in MuJoCo to validate design decisions before hardware build."
      ],
      result: [
        "Produced a functional SEA prototype with validated force feedback fidelity benchmarked against design targets.",
        "Parallel-link finger joints designed and iterated in SolidWorks; prototypes fabricated and tested.",
        "Built practical expertise in compliant actuation design, motor sizing, C++ embedded control, and simulation-to-hardware workflows."
      ]
    }
  },
  {
    slug: "windtunnel",
    year: 2025,
    links: [{ label: "Slides", url: "https://docs.google.com/presentation/d/1k38KGBaTGPuPGuXxiu12ro7czQiqqdi4f8ElJLiNdic/edit" }],
    title: "Honeycomb Flow-Straightener Wind Tunnel",
    zone: "hardware",
    thumb: "assets/projects/windtunnel/thumb.jpg",
    tags: ["Aerodynamics", "Siemens NX", "Fabrication", "LabVIEW", "Stepper Traverse", "Pitot Tube", "Uncertainty Analysis"],
    gallery: [
      "assets/projects/windtunnel/boundary_effects.png",
      "assets/projects/windtunnel/wt_breakdown.png",
      "assets/projects/windtunnel/test_procedure.png",
      "assets/projects/windtunnel/turb_intensity_front.png" ,
      "assets/projects/windtunnel/turb_intensity_back.png"
    ],
    star: {
      situation: "Commercial wind tunnels are expensive and space-prohibitive, and low-cost DIY builds usually suffer from unstraightened, non-uniform flow straight off the fan (swirl, lateral velocity variation, high turbulence) that corrupts test-section measurements.",
      task: "Design, build, and experimentally validate a compact five-section blow-down wind tunnel with a honeycomb flow straightener, and quantify the turbulence reduction it produces.",
      action: [
        "Worked from published design rules (Mehta & Bradshaw 1979; Neriya-Hegade et al.) to size five sections: wide-angle diffuser, settling chamber + honeycomb, ~4:1 contraction, 500 mm (~20 in) test section, and exit diffuser.",
        "Selected a target Reynolds number and back-calculated section dimensions and fan duty; built fan delivers 270 CFM, ~6 m/s average test-section velocity, Re ~ 40,000.",
        "Modelled each section individually in Siemens NX for independent laser cutting; fabricated from laser-cut plywood, a transparent acrylic test section, and 3D-printed PLA honeycomb plus custom angled joinery connectors.",
        "Built a custom automated traverse: a stepper motor driving a rack-and-pinion sweeping a pitot tube across front and back measurement stations.",
        "Wrote a LabVIEW VI to run the traverse, acquire pressure-transducer data through a DAQ, apply Bernoulli in real time to convert differential pressure to velocity, and log to CSV.",
        "Collected 10-15 repeated samples per position for both honeycomb-installed and honeycomb-removed configurations to compute point-wise uncertainty bands; post-processed velocity profiles and turbulence intensity in Excel."
      ],
      result: [
        "Turbulence intensity reduced by 53% at the front measurement station and 86% at the rear.",
        "Velocity profile spread tightened roughly 3.5x front (6.6 +/- 4.2 -> 5.8 +/- 1.2 m/s) and 3.3x back (5.0 +/- 3.9 -> 6.1 +/- 1.2 m/s), converting an unstable, non-uniform flow into a steady one.",
        "Demonstrated that a low-cost DIY tunnel can reach research-grade flow quality with the right flow-conditioning design."
      ]
    }
  },
  {
    slug: "firewarden",
    year: 2025,
    links: [{ label: "Slides", url: "https://docs.google.com/presentation/d/1MqN-6LGhDYaIZfPuHh35OufWAdCKe-kJ4SWmYIpFWR4/edit" }],
    title: "FireWarden — Wildfire Defense System",
    zone: "cleantech",
    thumb: "assets/projects/firewarden/thumb.jpg",
    tags: ["Cleantech", "Fluid Systems", "Web App", "Entrepreneurship"],
    gallery: [
      "assets/projects/firewarden/onsite.jpg",
    ],
    star: {
      situation: "Wildfires are a growing risk for homeowners; most mitigation solutions are expensive and difficult to evaluate. No accessible tool existed for homeowners to size and plan a sprinkler-based defence system.",
      task: "Co-found the startup and lead technical development of a web application making wildfire sprinkler system design accessible — starting with pool-sourced systems.",
      action: [
        "Led development of a web application processing user addresses to generate optimised sprinkler layouts: analysing elevation data, pool resources, property geometry, and roof characteristics.",
        "Applied first-principles fluid dynamics to compute sprinkler flow rates, pressure requirements, and coverage geometry.",
        "Supported pilot deployment analysis on a Laguna Beach home.",
        "Led customer discovery, product development, and pitch competition preparation.",
        "Entered the Techstars Pre-Accelerator programme."
      ],
      result: [
        "Won the DAS InnovateLA Competition — $20,000 in prize funding.",
        "Entered the Techstars Pre-Accelerator programme.",
        "Validated product-market fit through customer discovery and pilot site analysis.",
        "Although FireWarden ceased operations, built strong foundations in startup strategy, technical product development, and technology commercialisation."
      ]
    }
  },
  {
    slug: "cwc",
    year: 2026,
    links: [{ label: "Slides", url: "https://docs.google.com/presentation/d/17vgS7t0bZnHQJ_7Hckk9GCfXtWHV4d2dm2YSUtScKQU/edit" }],
    title: "USC Collegiate Wind Competition",
    zone: "cleantech",
    thumb: "assets/projects/cwc/hero.png",
    tags: ["Wind Energy", "BEM", "QBlade", "MATLAB", "BLDC Generator", "Arduino", "MOSFET Braking", "Buck-Boost", "3D Printing"],
    gallery: [
      "assets/projects/cwc/slide_03.png",
      "assets/projects/cwc/slide_04.png",
      "assets/projects/cwc/slide_05.png",
      "assets/projects/cwc/slide_06.png",
      "assets/projects/cwc/slide_07.png",
      "assets/projects/cwc/slide_08.png",
      "assets/projects/cwc/slide_09.png",
      "assets/projects/cwc/slide_10.png",
      "assets/projects/cwc/slide_11.png",
      "assets/projects/cwc/slide_12.png",
      "assets/projects/cwc/slide_13.png",
      "assets/projects/cwc/slide_14.png",
      "assets/projects/cwc/slide_15.png",
      "assets/projects/cwc/slide_16.png",
      "assets/projects/cwc/slide_17.png"
    ],
    star: {
      situation: "USC's inaugural DOE Collegiate Wind Competition team had to build a turbine that handles every competition task rather than optimising for one, with at least one sensing method, a braking method, and an attempted blade-pitch actuation system — all under a $1,000 budget.",
      task: "Found the team and lead turbine electrical/controls, contributing across blade, rotor, drivetrain, and tower design.",
      action: [
        "Blade: selected the AH 1900C low-Reynolds airfoil, TSR 4, optimised at 7 m/s; wrote MATLAB BEM code optimising the axial-induction factor from the Betz limit with interpolated Cl/Cd polars (Re ~36k root to ~34k tip), then used QBlade to generate the final chord and twist distribution.",
        "Manufacturing: printed PLA blades vertically with a 100% infill root and +0.2 mm X-Y compensation for the thin trailing edge — factor of safety 1.5 at 13 m/s even with poor layer adhesion.",
        "Rotor: abandoned three servo-driven direct-pitch blades (heavy servos caused vibration and wind-alone power was insufficient) for a fixed-pitch two-piece squeeze-clamp hub with corner fillets and a blade alignment line.",
        "Drivetrain: 300 KV brushless motor used as the generator, a shaft encoder reading a two-magnet coupler for RPM accuracy, and a slip ring repurposed as a bearing.",
        "Tower: 3D-printed 100%-infill corner brackets with set screws for height and yaw adjustment.",
        "Electrical: rectifier, then a three-phase MOSFET-short braking stage, a buck-boost converter, and an Arduino UNO reading RPM, current, and voltage sensors with an E-stop and a fixed power-resistor load.",
        "Controls: a braking state machine that triggers on E-stop, load/PCC disconnect (voltage to zero), or an RPM threshold, and releases automatically once the condition clears."
      ],
      result: [
        "Founded USC's first CWC team and delivered a complete working turbine — blades, rotor, drivetrain, tower, electronics, and braking — within the $1,000 budget.",
        "Fan testing confirmed a stable 4.0 V output at the target 7.5 m/s wind speed.",
        "RPM-voltage extrapolation characterised the fixed load (I ~ 0.9); the power-resistor load was sized to a factor of safety above 5.",
        "Next steps: a variable resistive load, a lower-KV higher-torque generator, earlier PCB bring-up, carbon-fibre blades, a pitot wind-speed sensor to replace the RPM threshold, and post-rectifier filtering."
      ]
    }
  },
  {
    slug: "thermofluids",
    year: 2026,
    title: "Thermofluids Sandbox",
    zone: "cleantech",
    thumb: "assets/projects/thermofluids/coolingplate_viz.jpg",
    tags: ["Thermofluids", "Python", "CoolProp", "PID", "Kalman Filter", "MATLAB/Simulink", "Dash", "Heat Transfer"],
    gallery: [],
    overview: [
      "A self-driven set of thermal-fluid mini-projects I built to get first-principles depth beyond coursework — running the physics by hand, modelling the system, and closing the loop with a controller where it matters.",
      "Each one goes from a real motivation through a working model to results checked against theory. The write-ups below are plain summaries, not formal case studies."
    ],
    subprojects: [
      {
        title: "Industrial Heat Pump — Cycle & Real-Time Control",
        tools: ["Python", "CoolProp", "P-h Diagram", "Ziegler-Nichols", "PID", "Kalman Filter", "Euler Integration"],
        gallery: [
          "assets/projects/thermofluids/heat_pump_analysis.png",
          "assets/projects/thermofluids/tf-heatpump-cycle-table.png",
          "assets/projects/thermofluids/ph_diagram.png",
          "assets/projects/thermofluids/cop_vs_temp.png",
          "assets/projects/thermofluids/refrigerant_comparison.png",
          "assets/projects/thermofluids/pi_optimized.png",
          "assets/projects/thermofluids/kalman_filter.png",
          "assets/projects/thermofluids/open_loop.png",
          "assets/projects/thermofluids/2nd_order_open_loop.png",
          "assets/projects/thermofluids/ultimate_gain_2nd_order.png"
        ],
        summary: "A Python simulator for a high-temperature industrial heat pump (the kind that replaces a gas boiler), plus a controller that holds the delivered condensing temperature steady in real time. The cycle model maps out where efficiency comes from; the control side keeps it there under disturbances and noisy sensors.",
        points: [
          "Modelled the four-process vapour-compression cycle (compressor, condenser, isenthalpic throttle, evaporator) with a CoolProp property library, an interactive P-h diagram, and an isentropic-efficiency sweep.",
          "Compared R134a, R245fa, and water on critical temperature, latent heat, and vapour-pressure slope; added subcooling and pressure-ratio-vs-tip-speed scaling.",
          "Built a PID controller on a first-order thermal plant (compressor speed as the actuator), tuned by Ziegler-Nichols plus an automated integral-gain sweep, then extended it to a second-order plant with pipe-wall thermal mass (two coupled ODEs, forward-Euler) and a scalar Kalman filter on the sensor.",
          "Actual COP ~ 3.12 vs a Carnot ceiling of 5.88; COP drops from 4.1 to 1.8 as condensing temperature rises 60 to 140 C.",
          "R134a fails above ~95 C condensing (critical point); R245fa stays viable to ~140 C at COP ~ 2.3 at 120 C. A compressor efficiency drop of 0.75 to 0.60 costs 13% COP.",
          "Integral action removes steady-state offset and rejects a 10 C load step; under 2 C sensor noise the derivative term slammed the compressor 0-100%, and the Kalman filter cut RMS estimation error roughly 4x and smoothed the command."
        ]
      },
      {
        title: "Parametric Heat-Exchanger Models",
        tools: ["MATLAB", "Simulink", "Effectiveness-NTU", "LMTD"],
        gallery: [
          "assets/projects/thermofluids/tf-hx-simulink.png",
          "assets/projects/thermofluids/tf-hx-concentric.png",
          "assets/projects/thermofluids/tf-hx-crossflow.png",
          "assets/projects/thermofluids/tf-hx-shell-tube.png",
          "assets/projects/thermofluids/tf-hx-sizing-guide.png"
        ],
        summary: "Effectiveness-NTU models of three heat-exchanger geometries in MATLAB and Simulink, built to see how much the geometry itself buys you at a fixed heat duty.",
        points: [
          "Implemented the effectiveness-NTU method (Q = eps * C_min * dT_in, NTU = 1/(C_min * R_tot), R_tot = sum of 1/(hS)), parameterised on mass flow, specific heat, film coefficient, and area.",
          "Built concentric-tube (parallel-flow), cross-flow, and shell-and-tube models plus a Simulink loop model.",
          "Held inlet conditions fixed and swept geometry: the shell-and-tube unit transferred about 11,861 W from only 1.25 m2 of surface, versus 3.14 m2 for the other two at the same duty.",
        ]
      },
      {
        title: "AME 431 Heat-Transfer Study Suite",
        tools: ["Python", "SciPy", "NumPy", "ipywidgets", "MATLAB"],
        gallery: [],
        summary: "A first-principles heat-transfer reference I wrote for AME 431, covering conduction, numerical methods, and convection — with interactive Python widgets that replace chart-reading with actual root-finders.",
        points: [
          "Derived and documented conduction (fins with efficiency and effectiveness, lumped capacitance with the Biot check, one-term transient), numerical methods (explicit/implicit finite difference, Fo <= 0.5 stability, Thomas and Gauss-Seidel), and convection (Blasius, Nu = f(Re, Pr), Reynolds and Chilton-Colburn analogies, Grashof/Rayleigh).",
          "Built widgets that solve the transcendental eigenvalue equations with scipy.optimize.brentq instead of reading Heisler and Grober charts.",
          "Added a draggable boundary-layer explorer showing the laminar-to-turbulent transition move as you change position or velocity — e.g. a 3 m flat plate at 10 m/s transitions at x ~ 0.78 m."
        ]
      },
      {
        title: "Cold-Plate Transient Heat-Transfer Visualiser",
        tools: ["Python", "Dash", "Plotly", "Finite-Difference Solver", "pytest", "STEP CAD"],
        gallery: [
          "assets/projects/thermofluids/coolingplate_viz.jpg",
          "assets/projects/thermofluids/coolingplate_viz2.png"
        ],
        summary: "A finite-difference solver and Dash web app for a liquid-cooled cold plate, so you can see the steady and transient temperature fields and where the thermal resistance actually sits.",
        points: [
          "Wrote a finite-difference solver with steady-state, transient, resistance-network, and parameter-sweep modules plus coolant property models, over a 90-channel cold-plate block imported from STEP CAD.",
          "Built a Dash / Plotly app exposing geometry, flow, and boundary-condition inputs with live temperature-field, resistance-breakdown, and sweep plots.",
          "Backed it with a ~15-test suite: energy balance, symmetry, 1-D limit, transient step response, and steady-state convergence — so the tool trades channel count, flow rate, and heat load against plate temperature with results checked against analytical limits."
        ]
      }
    ]
  },
  {
    slug: "turbine-cfd",
    year: 2025,
    links: [{ label: "Slides", url: "https://docs.google.com/presentation/d/1OLxho54vMp9J3IGMkIaDk27m6YCoO0lnXvT0bBj5D4w/edit" }],
    title: "Axial Turbine Aero Design & CFD",
    zone: "cleantech",
    thumb: "assets/projects/turbine-cfd/slide_23.png",
    tags: ["Star-CCM+", "MATLAB", "Compressible Flow", "Turbomachinery", "Velocity Triangles", "GH2", "Mesh Refinement"],
    gallery: [
      "assets/projects/turbine-cfd/slide_03.png",
      "assets/projects/turbine-cfd/slide_04.png",
      "assets/projects/turbine-cfd/slide_07.png",
      "assets/projects/turbine-cfd/slide_08.png",
      "assets/projects/turbine-cfd/slide_09.png",
      "assets/projects/turbine-cfd/slide_10.png",
      "assets/projects/turbine-cfd/slide_12.png",
      "assets/projects/turbine-cfd/slide_13.png",
      "assets/projects/turbine-cfd/slide_14.png",
      "assets/projects/turbine-cfd/slide_15.png",
      "assets/projects/turbine-cfd/slide_16.png",
      "assets/projects/turbine-cfd/slide_17.png",
      "assets/projects/turbine-cfd/slide_23.png",
      "assets/projects/turbine-cfd/slide_24.png",
      "assets/projects/turbine-cfd/slide_25.png",
      "assets/projects/turbine-cfd/slide_26.png",
      "assets/projects/turbine-cfd/slide_27.png",
      "assets/projects/turbine-cfd/slide_30.png",
      "assets/projects/turbine-cfd/slide_31.png",
      "assets/projects/turbine-cfd/slide_32.png",
      "assets/projects/turbine-cfd/slide_33.png",
      "assets/projects/turbine-cfd/slide_35.png",
      "assets/projects/turbine-cfd/slide_37.png",
      "assets/projects/turbine-cfd/slide_38.png",
      "assets/projects/turbine-cfd/slide_39.png",
      "assets/projects/turbine-cfd/slide_40.png",
      "assets/projects/turbine-cfd/slide_43.png",
      "assets/projects/turbine-cfd/slide_45.png",
      "assets/projects/turbine-cfd/slide_46.png",
      "assets/projects/turbine-cfd/slide_47.png",
      "assets/projects/turbine-cfd/slide_48.png",
      "assets/projects/turbine-cfd/slide_50.png",
      "assets/projects/turbine-cfd/slide_53.png",
      "assets/projects/turbine-cfd/slide_54.png",
      "assets/projects/turbine-cfd/slide_55.png",
      "assets/projects/turbine-cfd/slide_56.png",
      "assets/projects/turbine-cfd/slide_58.png",
      "assets/projects/turbine-cfd/slide_61.png",
      "assets/projects/turbine-cfd/slide_62.png",
      "assets/projects/turbine-cfd/slide_63.png",
      "assets/projects/turbine-cfd/slide_64.png",
      "assets/projects/turbine-cfd/slide_66.png",
      "assets/projects/turbine-cfd/slide_68.png"
    ],
    star: {
      situation: "An AME 415 turbomachinery design project: design the single-stage axial turbine that drives a gaseous-hydrogen turbopump — 4800 HP at 15,000 rpm, turbine inlet 1685 psia (11.62 MPa) and 828 R (460 K), 70.5 lbm/s (32 kg/s) GH2, discharging to 1567 psia — maximising isentropic efficiency within a defined design space. Three-person team.",
      task: "Own the design chain from velocity-triangle sizing through Star-CCM+ CFD setup, execution, and results extraction, and validate the CFD against the MATLAB hand-calculations.",
      action: [
        "Swept flow coefficient phi = 0.4-0.8 and loading coefficient psi = 0.8-1.6 on the Smith chart in MATLAB; selected phi = 0.51, psi = 1.00 as the maximum-efficiency point meeting every constraint.",
        "Sized the stage at 150 stator vanes and 150 rotor blades with 0.9 blockage; derived velocity triangles and generated stator and rotor airfoil contours at hub, mean, and tip (rotor inlet angle +13.96 deg hub, -13.15 deg tip relative to mean).",
        "Built 2-D compressible CFD domains in Star-CCM+ for all six sections: total-pressure/temperature inlet (P01 = 1.16e7 Pa, T01 = 460 K), base mesh 4e-4 m, 20-25% surface sizing, and supersonic static-pressure overrides for the transonic exit.",
        "Post-processed Mach number, static pressure, entropy, velocity-vector, and pressure-loading fields for every section; extracted mass-flow-averaged performance and blade force/torque."
      ],
      result: [
        "Total-to-total efficiency 0.9199 (0.9201 via work) at 4806.6 HP.",
        "Rotor torque 2686.7 N.m (mean), 2526.9 N.m (hub), 2866.1 N.m (tip); Euler work ~112-115 kJ/kg.",
        "CFD flow angles and velocities matched the MATLAB velocity-triangle hand-calcs within ~1-3% (mass flow within ~5-17%), validating the analytical sizing.",
        "Delivered a complete turbine design package — velocity triangles, airfoil geometries, CFD field plots, and performance tables."
      ]
    }
  },
  {
    slug: "fsae",
    year: 2024,
    title: "FSAE Projects",
    zone: "hardware",
    thumb: "assets/projects/fsae/thumb.jpg",
    tags: ["Automotive", "CFD", "CNC", "ANSYS Fluent", "Composite Layup", "MATLAB"],
    gallery: [],
    star: {
      situation: "The team needed faster aerodynamic simulation iteration and tighter correlation between CFD predictions and physical test results.",
      task: "Improve aero development efficiency through simulation automation and build physical validation tools to close the simulation-to-hardware loop.",
      action: [
        "Automated aerodynamic mesh generation in ANSYS Fluent using a fault-tolerant mesh system and MATLAB scripting — cutting CFD setup time by approximately 60% and enabling rapid DOE iteration.",
        "Designed and analysed a tire cover in Siemens NX and ANSYS Fluent to minimise tire turbulence impact on drag.",
        "CNC-milled high-precision moulds and performed composite layup (resin infusion) to manufacture aerodynamic elements — including components twice the size yet 50% lighter using optimised fibre orientation.",
        "Developed setup and validation tools: toe alignment tool and yaw probe — used to correlate real-world aero measurements against simulation results."
      ],
      result: [
        "CFD setup time reduced by ~60% through MATLAB-driven mesh automation.",
        "Composite elements achieved target geometry accuracy for CFD correlation.",
        "Simulation-to-hardware validation loop closed through yaw probe and alignment tool data."
      ]
    }
  },
  {
    slug: "waterrocket",
    year: 2024,
    title: "Water Rocket Flight Optimisation",
    zone: "hardware",
    thumb: "assets/projects/waterrocket/thumb.JPG",
    tags: ["MATLAB", "Simulation", "Optimisation", "Flight Dynamics"],
    gallery: [],
    star: {
      situation: "Water rockets are typically tuned by trial and error; the relationship between air/water ratio, pressure, and parachute size is not intuitively optimised.",
      task: "Develop a MATLAB simulation to optimise air-to-water fill ratio, initial pressure, and parachute surface area for maximum altitude.",
      action: [
        "Developed a MATLAB simulation modelling the thrust phase (water expulsion), coast phase, and parachute descent.",
        "Swept air-to-water ratio, initial pressure, and parachute surface area as free parameters.",
        "Identified optimal configuration from simulation results."
      ],
      result: [
        "Identified optimal fill ratio, pressure, and parachute area for maximum altitude.",
        "Built practical expertise in MATLAB simulation and flight dynamics modelling."
      ]
    }
  },
  {
    slug: "drone",
    year: 2024,
    title: "Drone CAD & Structural Analysis",
    zone: "hardware",
    thumb: "assets/projects/drone/thumb.png",
    tags: ["CAD", "FEA", "Drones", "Siemens NX", "ANSYS"],
    gallery: [],
    star: {
      situation: "Drone structural design requires validation across multiple load cases before hardware commitment.",
      task: "Design a quadrotor drone frame in Siemens NX and conduct structural validation using FEA and multi-body dynamics (MBD) in ANSYS.",
      action: [
        "Designed a quadrotor drone frame using Siemens NX CAD.",
        "Conducted FEA analysis in ANSYS Mechanical for structural integrity under flight loads.",
        "Ran multi-body dynamics (MBD) analysis for dynamic loading scenarios."
      ],
      result: [
        "Validated structural integrity across multiple load cases.",
        "Demonstrated an integrated CAD + FEA + MBD workflow for drone structural design."
      ]
    }
  },
  {
    slug: "bridge",
    year: 2023,
    links: [{ label: "Slides", url: "https://docs.google.com/presentation/d/1VA9FRjOtLrg-IBJXrp6H5tkmueV63h8G1FIaLfHCmkg/edit" }],
    title: "Truss Bridge Optimisation",
    zone: "hardware",
    thumb: "assets/projects/bridge/thumb.png",
    tags: ["Structural", "MATLAB", "Optimisation"],
    gallery: [],
    star: {
      situation: "Truss bridge geometry significantly impacts load-to-weight efficiency, but manual analysis of many configurations is slow.",
      task: "Build a parametric MATLAB truss analysis sweeping geometry parameters to optimise for maximum load-to-weight ratio.",
      action: [
        "Modelled truss bridge forces using parametric MATLAB simulations.",
        "Swept geometric parameters to find the optimal configuration for structural efficiency.",
        "Validated simulation predictions with load cell testing."
      ],
      result: [
        "Identified optimal bridge geometry for load-to-weight efficiency.",
        "Validated simulation predictions against physical load cell testing."
      ]
    }
  },
  {
    slug: "monopoly",
    year: 2024,
    links: [{ label: "Slides", url: "https://docs.google.com/presentation/d/1Zo48lH4bJnZnYgCcLSDdN7ztpLo-VSnM-4SqTbtNbzY/edit" }],
    title: "Automated Monopoly Board",
    zone: "hardware",
    thumb: "assets/projects/monopoly/thumb.png",
    tags: ["Mechatronics", "Arduino", "Fabrication"],
    gallery: [],
    star: {
      situation: "A class project required designing an electromechanical system enabling human vs. bot gameplay on a physical Monopoly board.",
      task: "Lead the electro-mechanical design of a robotic Monopoly board game for a team of 6.",
      action: [
        "Led the electro-mechanical design of the robotic Monopoly board.",
        "Designed and built mechanisms for automated token movement and gameplay.",
        "Integrated Arduino-based control for bot decision-making and movement."
      ],
      result: [
        "Won 1st place in the class competition.",
        "Delivered a fully functional human vs. bot Monopoly system."
      ]
    }
  },
  {
    slug: "walkane",
    year: 2023,
    links: [{ label: "Slides", url: "https://docs.google.com/presentation/d/1Onowiq4yA5mdlF88hial_LIerdQzdFmOPIzcRKR9gaw/edit" }],
    title: "Walkane — Walker-Cane Hybrid",
    zone: "hardware",
    thumb: "assets/projects/walkane/thumb.png",
    tags: ["Product Design", "Prototyping", "Medical Device", "Mechanism Design"],
    gallery: [],
    star: {
      situation: "Existing walkers and canes handle flat ground or stairs poorly — transitions between the two are unstable and risky for elderly users.",
      task: "Engineer a hybrid walker-cane with a collapsible design that improves stability during stair-to-flat-ground transitions.",
      action: [
        "Designed a collapsible mechanism to transition between walker and cane configurations.",
        "Prototyped and iterated on the mechanism for stability and ease of use."
      ],
      result: [
        "Won 2nd place at the ASBME Makeathon.",
        "Demonstrated a viable assistive device bridging walker and cane form factors."
      ]
    }
  },
  {
    slug: "alarm",
    year: 2023,
    title: "Smart Alarm Clock — REM Monitoring",
    zone: "hardware",
    thumb: "assets/projects/alarm/thumb.png",
    tags: ["Arduino", "Sensors", "Embedded Systems", "DAQ"],
    gallery: [],
    star: {
      situation: "Standard alarms wake users regardless of sleep stage, leading to grogginess and impaired alertness.",
      task: "Build a smart alarm clock that tracks BPM via pulse meter and Arduino DAQ, using sleep cycle data to wake the user during the optimal REM phase.",
      action: [
        "Integrated a pulse meter with an Arduino-based DAQ to continuously monitor BPM.",
        "Developed sleep cycle detection logic to identify the optimal wake window.",
        "Built the complete hardware and embedded system within a hackathon time constraint."
      ],
      result: [
        "Won 1st place at the IEEE Hack-IoT competition.",
        "Demonstrated a functional BPM-tracking sleep optimisation alarm."
      ]
    }
  }
];

// Experience (populated from master career doc)
const EXPERIENCE = [
  {
    slug: "graymatter",
    company: "GrayMatter Robotics",
    logo: "",
    role: "Robotics Systems & Applications Intern",
    dates: "Jan 2026 – May 2026",
    location: "Torrance, CA",
    zone: "robotics",
    bullets: [
      "Led mechanical design for a production-ready universal sanding fixture accommodating 14 SKUs; eliminated vision misclassification and validated performance through force testing.",
      "Built a multimodal DAQ pipeline and analytics for sanding characterisation, reducing industrial engineering time studies by ~40%.",
      "Ran an uncertainty-bounded deflection test program on the mobile sanding platform and built a point-cloud scan-validation gate, owning most of the customer's robustness and cycle-time workstreams."
    ],
    subprojects: [
      {
        title: "Production-Ready Universal Sanding Fixture",
        tools: ["SolidWorks", "MeshLab", "Point Cloud Processing", "Spring-Loaded Mechanisms", "Force Testing", "3D Printing", "ROS2"],
        gallery: [],
        star: {
          situation: "Initial fixture designs caused the robot to sand the fixture itself — vision segmentation could not distinguish fixture geometry from the workpiece. The product line had 14 SKUs ranging S to XL.",
          task: "Redesign the fixture from scratch to hold all 14 configurations reliably, eliminate vision misclassification, and meet customer requirements for operator comfort, throughput, and reliability.",
          action: [
            "Mapped all mechanical, vision, and software constraints across teams before touching a design.",
            "Developed SolidWorks concepts and analysed point clouds in MeshLab — tuned segmentation parameters iteratively with the vision team.",
            "Introduced compliant spring-loaded features to accommodate S–XL size variation without manual adjustment between variants.",
            "Incorporated ultrasonic sensors to validate part seating before the sanding cycle begins.",
            "Performed force testing to identify failure modes and quantify performance improvements across design iterations.",
            "Executed rapid prototyping cycles using 3D printing and modular design for fast mechanical iteration."
          ],
          result: [
            "Universal fixture successfully accommodated all 14 SKUs (S through XL) in a single design.",
            "Eliminated vision misclassification — robot no longer sanded the fixture itself.",
            "Customer confirmed strong satisfaction with robustness and performance outcomes."
          ]
        }
      },
      {
        title: "Systems & Applications Engineering — Robotic Arm Process Development",
        tools: ["ROS2", "RVIZ", "MeshLab", "FANUC Arms", "Python", "YAML/JSON", "DOE", "GitHub"],
        gallery: [],
        star: {
          situation: "GrayMatter deploys robotic sanding arms on customer parts (helicopter blades, helmets, vehicle body panels) — each requiring custom segmentation, toolpath planning, and recipe validation before deployment.",
          task: "Lead system and applications engineering for customer parts: from 3D scan through segmentation, toolpath generation, FANUC robot programming, and process recipe development.",
          action: [
            "Conducted reachability studies from CAD models to identify surface coverage and blind spots before physical setup.",
            "Worked with multiple segmentation algorithms on point clouds (Euclidean clustering, curvature-based, projection segmentation, swept cylinder, surface normals) in MeshLab.",
            "Developed toolpaths by tuning CNT values, tool orientation, overlap percentage, and pass direction — balancing coverage, cycle time, and surface finish.",
            "Programmed FANUC robotic arms in ROS2 to execute validated toolpaths (visualised in Rviz), handling coordinate frame setup and motion parameter tuning.",
            "Performed camera calibration across line sensors (LMI) and structured-light scanners (Zivid), validating sensor output against known reference conditions.",
            "Designed and executed DOE-driven sanding campaigns — sweeping force, tilt angle, and RPM — identifying parameters meeting surface roughness within ±10% spec.",
            "Managed project files with GitHub; used YAML/JSON for process parameter storage and ROS2 pipeline configuration."
          ],
          result: [
            "Developed end-to-end proficiency in robotic process engineering: raw point cloud to deployed, validated robot program.",
            "Built practical expertise in ROS2 + RVIZ, MeshLab automation, FANUC programming, and process-DOE methodology.",
            "Reduced manual effort in segmentation and toolpath setup through Python automation scripts."
          ]
        }
      },
      {
        title: "Multimodal Human Sanding Characterisation DAQ Pipeline",
        tools: ["Force Sensors", "IMUs", "OpenVR", "Thermal Sensors", "Python", "ROS2", "Rerun Visualisation"],
        gallery: [],
        star: {
          situation: "GrayMatter needed to understand expert human sanding behaviour at a physical parameter level — force profiles, motion patterns, thermal signatures — to automate industrial engineering time studies.",
          task: "Build a multimodal DAQ pipeline synchronising force, IMU, position (OpenVR), and thermal sensor streams at 100+ Hz with a full post-processing analytics layer.",
          action: [
            "Selected and integrated force sensors, IMUs, OpenVR position trackers, and thermal sensors into a time-synchronised ROS2 pipeline running at 100+ Hz.",
            "Integrated Rerun for real-time and post-hoc visualisation of 3D sanding paths with per-segment physical parameter graphing.",
            "Built a post-processing analytics pipeline: ESH savings calculator, data-driven task classification, robot feasibility recommendations, and consumables calculator.",
            "Designed the pipeline to feed GrayMatter's solutions-engineering agent core and model optimisation workflows.",
            "Validated pipeline data quality against known reference conditions and human benchmarks."
          ],
          result: [
            "Reduced industrial engineering time studies by approximately 40%.",
            "Analytics layer enables quantified dollar-value business cases for robot deployment (ESH savings tool).",
            "Task classification output gives engineering teams a data-backed map of what a robot can and cannot do for a given customer part.",
            "Produced a reusable, modular platform (DAQ + visualisation + analytics) feeding GrayMatter's process intelligence roadmap."
          ]
        }
      },
      {
        title: "Mobile Platform Deflection Characterisation & Compliance Redesign",
        tools: ["Vive Tracker (OpenVR)", "IMU Vibration Monitoring", "Hysteresis Testing", "Uncertainty Analysis", "Suspension Systems", "Python"],
        gallery: [],
        star: {
          situation: "The mobile sanding platform showed inconsistent 3D scan quality and sanding defects during full-arm-extension operations. The existing manual laser/ruler/video method could not reliably characterise structural deflection, and the same issue was surfacing in production as a chronic actuator max-out fault.",
          task: "Own a formal test program to quantify structural deflection of the mobile platform under full robotic reach, using an uncertainty-bounded measurement methodology, and use the results to drive a hardware fix.",
          action: [
            "Replaced the manual method with a Vive-tracker spatial tracking system, porting a technique from a prior USC robotics research project.",
            "Added IMU-based vibration monitoring to separate genuine structural drift from high-frequency chatter.",
            "Defined and measured absolute deflection and tilt (in the platform frame) plus hysteresis recovery time after high-force sanding events.",
            "Ran uncertainty analysis on the tracking-based approach, achieving results accurate to within 8%.",
            "Evaluated three suspension mounting setups across pre/post-move and parked/unparked configurations, and mapped sanding quality against cantilever reach at 50%, 75%, and 100% of arm extension.",
            "Defined test end-cases (E-stop mid-sanding, max-extension sanding, simply-supported fixture) with the applications and mobile-platform teams."
          ],
          result: [
            "Quantified ~3 mm of platform deflection at full arm extension, measured to within 8% uncertainty.",
            "Root-caused the deflection to downstream point-cloud layering and sanding-quality defects — explaining a chronic actuator max-out fault seen repeatedly in production.",
            "Findings informed the specification of a higher-stroke compliance actuator (AFD 620) as the hardware fix.",
            "Established a reusable, uncertainty-bounded structural measurement methodology for future test programs."
          ]
        }
      },
      {
        title: "Point-Cloud Scan Validation & Production Robustness Program",
        tools: ["Point Cloud Registration (ICP / TEASER++)", "PCL", "Voxel Coverage Analysis", "Python", "ROS2", "Root Cause Analysis", "FANUC"],
        gallery: [],
        star: {
          situation: "A documented robot-to-part collision occurred because a degraded, incomplete 3D scan was never flagged before the robot planned motion on it — one of 34 accumulated production failures on a live customer deployment with no systematic root-cause process.",
          task: "Own the majority of the customer's official General Robustness and Cycle Time workstreams: build a scan-validation gate to catch bad sensor data before it reaches the robot, and drive systematic robustness testing.",
          action: [
            "Built a point-cloud validation system combining registration (ICP for helper-matrix localisation; TEASER++ with FPFH/SHOT descriptors for scan-to-baseline) with a voxel-based coverage engine (5 mm resolution, 26-connectivity flood-fill) outputting a coverage ratio, missing-patch detection, and a pass/no-pass threshold.",
            "Implemented multi-hypothesis pose registration to resolve alignment ambiguity on repetitive, symmetric wing geometry, correcting a known TEASER++ failure mode.",
            "Performed structured root-cause analysis across 34 production failure logs using an LLM-assisted log-analysis workflow, categorising failures into state-machine defects, hardware reliability, planner defects, and calibration drift, with ranked recommendations.",
            "Owned robustness action items across planner failure, sensor drift, camera layering, oversanding, sandpaper life, and consumable stack-up testing.",
            "Built supporting Python automation: a log-parsing tool for per-pass segmentation/toolpath/trajectory timing, and a Python/MeshLab pipeline accelerating scan-to-toolpath setup."
          ],
          result: [
            "Delivered a validation gate that closes the exact failure mode behind the account's most serious documented collision incident.",
            "RCA surfaced 10 distinct root-cause categories across 34 production runs, with ranked recommendations adopted for engineering follow-up.",
            "Individually own nearly the entirety of two of the customer's six official priority workstreams — a scope typically split across a larger team.",
            "Automation tooling reduced manual log-review and scan-to-toolpath setup time."
          ]
        }
      }
    ]
  },
  {
    slug: "lumindt",
    company: "Lumindt Labs",
    logo: "assets/lumindt.JPG",
    role: "Mechanical Engineering Intern",
    dates: "Jun 2025 – Aug 2025",
    location: "San Francisco, CA",
    zone: "cleantech",
    bullets: [
      "Designed and built a transient hot-wire thermal conductivity measurement system achieving <10% uncertainty for metal powder characterisation.",
      "Designed production-ready skid and modular fuel-cell frame hardware; performed ASME-based preliminary stress analysis."
    ],
    subprojects: [
      {
        title: "Transient Hot-Wire Thermal Conductivity Measurement System",
        tools: ["Transient Hot-Wire", "Platinum Wire (25μm)", "Signal Conditioning", "Raspberry Pi DAQ", "Python", "SolidWorks", "Uncertainty Analysis"],
        gallery: [],
        star: {
          situation: "Lumindt needed thermal conductivity data for metal powders being evaluated for thermal energy storage. No commercial instrument was suited to the specific material form factor.",
          task: "Design and build a complete thermal conductivity measurement system from scratch capable of repeatable, accurate characterisation of four metal powder samples.",
          action: [
            "Conducted a literature review and selected the transient hot-wire (THW) technique as optimal for loose powder characterisation.",
            "Designed and fabricated a custom test fixture in SolidWorks housing a 25-micron platinum wire sensor.",
            "Designed and built signal conditioning circuitry for the platinum wire's resistance-temperature response.",
            "Built a Raspberry Pi DAQ and wrote Python automation scripts for data capture, thermal cycling, and repeatability analysis.",
            "Developed a thermal sensing pipeline using real-time conductivity readings to identify hydrogen activation state and process stage in metal-powder electrolysers — sensor-based state estimation without direct chemical measurement.",
            "Conducted formal uncertainty analysis; investigated effects of porosity and contact resistance on measurement accuracy.",
            "Established documented, repeatable testing procedures across multiple temperature setpoints."
          ],
          result: [
            "Achieved repeatable thermal conductivity measurements with less than 10% uncertainty across four metal powder samples.",
            "Enabled material down-selection decisions for Lumindt's thermal energy storage development programme.",
            "Created a complete characterisation capability from zero — integrating heat transfer theory, precision instrumentation, electronics, and software."
          ]
        }
      },
      {
        title: "Structural Design — Electrolyser Skid & Fuel Cell Frame",
        tools: ["SolidWorks Weldments", "ASME Stress Analysis", "Manifold Design", "Steel Frame", "8020 Extrusions"],
        gallery: [],
        star: {
          situation: "Lumindt needed production-ready structural hardware: a skid for 24 electrolysers (300 kg each) and a modular frame for a 250 kW fuel cell system (200 kg capacity).",
          task: "Design both structures to meet load requirements, integrate fluid manifolds (hydrogen, coolant, water), minimise footprint, and ensure serviceability — validated against ASME standards.",
          action: [
            "Designed the 24-electrolyser skid in SolidWorks Weldments integrating optimised manifold routing for hydrogen, coolant, and water lines.",
            "Designed the 250 kW fuel cell frame using a welded steel base with carbon steel tubing and 8020 aluminium extrusions for modularity.",
            "Performed ASME-standard preliminary stress analyses to validate structural safety margins under operating loads.",
            "Selected balance-of-plant components (pumps, valves, adapters); fabricated custom adapters where off-the-shelf parts did not meet requirements.",
            "Built an Excel-based heat exchanger and coolant loop calculator to evaluate coolant composition effects on specific heat and efficiency."
          ],
          result: [
            "Delivered production-ready designs for both structures with validated structural safety margins.",
            "Manifold design met hydrogen, coolant, and water routing requirements within the constrained skid footprint.",
            "Demonstrated ability to work across mechanical design, structural analysis, fluid systems, and component selection in one workstream."
          ]
        }
      }
    ]
  },
  {
    slug: "makerspace",
    company: "USC Baum Family Makerspace",
    logo: "assets/machining.jpg",
    role: "Machinist & Fabrication Engineer",
    dates: "Sep 2023 – Present",
    location: "Los Angeles, CA",
    zone: "hardware",
    bullets: [
      "Programmed and operated Haas CNC, ProtoTRAK, Omax waterjet, and laser cutter; manufactured GD&T-critical parts to ±0.001 inch tolerances.",
      "Fabricated 100+ 3D printed prototypes and provided DFM guidance to reduce iteration cycles for research teams."
    ],
    star: {
      situation: "The Makerspace supports 80+ research labs and 12+ design teams at USC who need precision components fabricated beyond student skill level, and DFM guidance to make their designs manufacturable.",
      task: "Manufacture GD&T-critical components across a range of processes, support prototype development, and provide DFM guidance.",
      action: [
        "Programmed and operated Haas CNC Mill and Lathe, ProtoTRAK, Omax waterjet, and laser cutter to manufacture GD&T-critical components.",
        "Applied first-principles machining: selected cutting speeds, feeds, tool geometry, and fixturing strategy for each material using standard machining equations.",
        "Used dial indicators to verify dimensional accuracy and surface finish against GD&T callouts — qualifying parts before release.",
        "Fabricated 100+ 3D-printed prototypes across FDM (PLA), SLA (resin), and carbon fibre-reinforced FDM — including aerodynamic elements for the Formula SAE car.",
        "Provided DFM consultations: reviewed student designs for machinability and recommended design modifications to reduce iteration cycles."
      ],
      result: [
        "Machined GD&T-critical components to ±0.001 inch tolerances verified by dial indicator.",
        "Supported 80+ research labs and 12+ design teams.",
        "Fabricated 100+ prototypes across three 3D printing technologies.",
        "DFM guidance demonstrably reduced iteration cycles for multiple teams by catching manufacturability issues at the design stage."
      ]
    }
  },
  {
    slug: "drcl",
    company: "USC Dynamic Robotics & Controls Lab",
    logo: "",
    role: "Mechanical Engineer",
    dates: "Sep 2025 – Present",
    location: "Los Angeles, CA",
    zone: "robotics",
    bullets: [
      "Designed a Series Elastic Actuator (SEA) module and 8-DOF robotic hand finger assemblies; validated force feedback fidelity on bench tests.",
      "Simulated hand kinematics in MuJoCo and wrote C++ motor driver code for embedded control."
    ],
    star: {
      situation: "The lab is developing an 8-DOF robotic hand capable of catching and throwing a basketball at 20 N force — requiring compliant actuation for safe, controllable contact.",
      task: "Design and prototype the SEA module and rigid finger joints with parallel link mechanism, and validate force feedback fidelity through bench testing.",
      action: [
        "Designed 8-DOF finger joint assemblies with parallel link mechanisms in SolidWorks.",
        "Designed and rapid-prototyped an SEA test fixture for an N20 motor — spring selection, mounting, adhesive strategy, and locking mechanism.",
        "Performed torque calculations for N20 motor selection and validated output torque and compliance against design targets.",
        "Wrote C++ motor driver code for low-level motor control.",
        "Simulated hand kinematics and dynamics in MuJoCo to validate design decisions before hardware build."
      ],
      result: [
        "Produced a functional SEA prototype with validated force feedback fidelity benchmarked against design targets.",
        "Parallel-link finger joints designed and iterated in SolidWorks; prototypes fabricated and tested.",
        "Built practical expertise in compliant actuation design, motor sizing, C++ embedded control, and simulation-to-hardware workflows."
      ]
    }
  },
  {
    slug: "locomotion",
    company: "USC Robotic Locomotion & Dynamic Lab",
    logo: "",
    role: "Mechanical Design Engineer",
    dates: "Sep 2023 – May 2024",
    location: "Los Angeles, CA",
    zone: "robotics",
    bullets: [
      "Designed a 4-link leg mechanism and custom holding frame in Siemens NX for a force-sensing, direct-drive quadruped robot; validated structural integrity with ANSYS Mechanical FEA."
    ],
    star: {
      situation: "The lab was developing a direct-drive quadrupedal robot for complex terrain navigation and needed a leg mechanism that could sense contact forces while handling dynamic loading.",
      task: "Design a 4-link leg mechanism with custom holding frame for a force-sensing direct-drive quadruped, validated structurally for terrain navigation loads.",
      action: [
        "Devised a 4-link leg mechanism geometry in Siemens NX, balancing range of motion, force transmission, and packaging constraints.",
        "Designed a custom holding frame to mount the mechanism on the quadruped chassis.",
        "Ran ANSYS Mechanical FEA to validate structural integrity under expected terrain impact loads."
      ],
      result: [
        "Delivered a validated mechanism design meeting the lab's range-of-motion and structural requirements.",
        "Developed practical experience in linkage mechanism design and FEA-driven structural validation."
      ]
    }
  },
  {
    slug: "tutr",
    company: "TuTr Hyperloop",
    logo: "",
    role: "Mechanical Engineer Intern",
    dates: "Jun 2024 – Jul 2024",
    location: "Los Angeles, CA",
    zone: "hardware",
    bullets: [
      "Optimized hyperloop chassis weight by 30% using 1D/3D structural analysis in ANSYS and Siemens NX while preserving structural margins."
    ],
    star: {
      situation: "TuTr's hyperloop pod chassis needed to be lighter without compromising structural integrity for high-speed travel loads.",
      task: "Analyse the existing chassis design and identify weight reduction opportunities while maintaining structural safety margins.",
      action: [
        "Conducted 1D and 3D structural analyses in ANSYS Mechanical and Siemens NX to identify over-designed sections.",
        "Proposed targeted material removal and geometry changes; validated each iteration against stress and deflection limits."
      ],
      result: [
        "Optimised chassis weight by 30% while maintaining full structural integrity under operating load cases."
      ]
    }
  },
  {
    slug: "niwe",
    company: "National Institute of Wind Energy (NIWE)",
    logo: "",
    role: "Wind Blade Intern",
    dates: "Jul 2023 – Aug 2023",
    location: "Chennai, India",
    zone: "cleantech",
    bullets: [
      "Designed a 5.7 m wind turbine blade geometry in SolidWorks and ran ANSYS Mechanical structural simulations across multiple load cases.",
      "Delivered a complete blade analysis report to the certification department."
    ],
    star: {
      situation: "NIWE's certification department needed a research-grade structural analysis of a 5.7 m wind turbine blade across multiple load cases to support their certification workflow.",
      task: "Design, analyse, and optimise the blade geometry in SolidWorks and ANSYS Mechanical, evaluating structural performance across defined load cases.",
      action: [
        "Designed a 5.7 m wind turbine blade geometry in SolidWorks.",
        "Ran ANSYS Mechanical structural simulations across multiple load cases (gravity, wind, fatigue representative cases).",
        "Optimised blade geometry based on simulation results to meet structural performance targets."
      ],
      result: [
        "Delivered a complete blade analysis report to the certification department.",
        "Gained practical exposure to industrial wind blade design standards and certification workflows."
      ]
    }
  }
];

const SKILLS = {
  controls: {
    label: "Controls & Firmware",
    items: ["Arduino IDE", "I2C architecture", "State machine design", "PID control", "Bayesian optimisation", "MOSFET braking", "Buck-boost converter", "Embedded C++"]
  },
  robotics: {
    label: "Robotics",
    items: ["ROS2", "RVIZ", "FANUC arm programming", "Toolpath planning (CNT/orientation/overlap)", "Point cloud segmentation", "MuJoCo simulation", "Reachability studies"]
  },
  sensing: {
    label: "Sensing & DAQ",
    items: ["Force sensors", "IMUs", "OpenVR position tracking", "Thermal sensors", "Transient hot-wire", "Multimodal sync 100+ Hz", "Signal conditioning", "Rerun visualisation", "LabVIEW"]
  },
  mechanical: {
    label: "Mechanical Design",
    items: ["SolidWorks", "Siemens NX", "Fusion 360", "GD&T", "DFM", "Compliant mechanisms", "SEA design", "Parallel link mechanisms", "Weldment design"]
  },
  simulation: {
    label: "Simulation & Analysis",
    items: ["ANSYS Mechanical FEA", "ANSYS Fluent CFD", "MuJoCo", "QBlade", "StarCCM+", "MATLAB/Simulink", "FLORIS wake optimiser", "Mesh refinement"]
  },
  manufacturing: {
    label: "Manufacturing",
    items: ["Haas CNC Mill & Lathe", "ProtoTRAK", "Omax Waterjet", "Laser Cutter", "MasterCam", "FDM/SLA/Carbon Fibre 3D Printing", "Composite Layup", "Resin Infusion", "±0.001\" tolerancing"]
  },
  thermofluids: {
    label: "Thermofluids",
    items: ["Transient hot-wire method", "Heat exchanger design", "Coolant loop analysis", "Fluid dynamics", "CFD (Fluent)", "Thermal management", "Hydrogen system thermal characterisation", "Compressible flow", "Velocity triangle analysis", "Pressure/heat-transfer boundary conditions", "Vapour-compression cycle modelling (CoolProp)", "Kalman filtering"]
  },
  structural: {
    label: "Structural",
    items: ["ASME stress analysis", "Weldment structural calc", "Chassis optimisation", "Blade load case analysis", "1D & 3D FEA"]
  },
  software: {
    label: "Software & Scripting",
    items: ["Python", "MATLAB", "C++", "Arduino", "ROS2", "YAML/JSON", "GitHub", "LabVIEW"]
  },
  energy: {
    label: "Energy Systems",
    items: ["Wind turbine controls & design", "FLORIS farm optimisation", "QBlade/StarCCM+ blade aero", "Thermal energy storage", "Electrolyser & fuel cell systems", "Hydrogen gas handling"]
  },
  leadership: {
    label: "Leadership & Entrepreneurship",
    items: ["Team founding & management", "Cross-functional stakeholder coordination", "Customer discovery", "Pitch competitions", "Partnership development", "Chapter founding (AEE USC)"]
  }
};

// Expose for debugging
window.SITE = { ABOUT, PROJECTS, EXPERIENCE, SKILLS };
