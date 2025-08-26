---
title: "Piloting a Lunar Lander with Optimal Control"
technologies: [Python, Numpy, SciPy]
github_url: "https://github.com/yauneyz/Lunar-Lander-Optimal-Control"
excerpt: "Hacking a lunar lander game with an automated PID controller to get perfect landings each time."
published: true
sort_order: 80
---

# You Can Do Cool Things Without AI

SpaceX's self-landing rockets are terrific. They make spaceship re-use far more achievable.

In the age of AI, one might think that such a feat needs to be accomplished with deep learning. And while the SpaceX might use some neural networks, an astonishingly large amount can be accomplished with optimal control.

Optimal control theory provides sophisticated methods for determining precise control inputs. This demo combines boundary value problem solving with Linear Quadratic Regulator (LQR) control to achieve autonomous landing.

While this demo operates in idealized conditions (perfect sensors, perfect control over thrust vectors) it shows how effective such methods can be.

<div style="max-width: 100%; text-align: center; margin: 20px 0;">
  <video style="width: 100%; max-width: 800px; height: auto; object-fit: contain;" controls>
    <source src="/assets/lander.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <p style="font-style: italic; margin-top: 10px;">Watch the autonomous controller pilot the lander to the highest-value landing zone</p>
</div>

## How It Works

The controller I implemented uses a three-phase approach:

1. **Optimal Trajectory Phase**: Uses SciPy's `solve_bvp` to solve a boundary value problem, calculating the mathematically optimal path from starting position to target landing zone while considering rocket dynamics and thrust constraints

2. **LQR Tracking Phase**: Switches to Linear Quadratic Regulator (LQR) control, which uses the solution to the continuous algebraic Riccati equation to provide optimal state feedback control for following the calculated trajectory

3. **Final PID Phase**: In the last moments before landing, uses a simple PID controller for precise altitude management

The system automatically targets the highest-value landing zone (marked with multipliers like "5x") and navigates there while managing fuel consumption and velocity constraints.

## Technical Implementation

**What I built:**
- Optimal trajectory calculation using boundary value problems and rocket dynamics ODEs
- LQR state feedback controller with custom Q/R matrices for performance tuning
- Integration logic to transition between control phases
- Controller interface that works with the existing game's physics

**What I used from the base game:**
- PyGame Zero framework and existing lunar lander game mechanics
- Terrain generation and physics simulation
- Collision detection and scoring system

The mathematical foundation relies on solving Hamilton-Jacobi-Bellman equations through numerical methods, demonstrating how classical control theory can achieve remarkably precise autonomous behavior.
