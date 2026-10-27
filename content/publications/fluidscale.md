---
title: "FluidScale: A Machine Learning Model for Upscaling Screen-Space Fluids for Games"
authors: ["Martin Angell", "Matias Ortiz", "Gizem Kayar"]
venue: "In preparation for SIGGRAPH 2027"
year: 2027
status: "In preparation"
image: "/publications/fluidscale.gif"
summary: "A neural method for turning low-resolution DFSPH fluid simulations into high-resolution screen-space information at a speed fast enough for video games."
---

## Extended Summary

FluidScale reduces the computational cost of visually realistic, physically based fluid simulation in games by upsampling low-resolution Smoothed Particle Hydrodynamics (SPH) simulations using a neural model. The model works in screen space and takes only the information a basic screen-space fluid renderer already produces (depth, normals, and thickness).

## My Contributions

1. Resolving the divergence of paired low-resolution and high-resolution SPH simulations used for training our machine learning model by creating a new method for guiding a high-resolution simulation to hold to the macro-shape of a low-resolution simulation.
2. Creating our in-house simulator and renderer.
3. Creating our data collection pipeline for results from our two-alternative forced choice (2AFC) study, which ranks upsampling methods based on perceived realism.

## Contact Information

Lead Graphics Engineer: Martin Angell - [mta9404@nyu.edu](mailto:mta9404@nyu.edu)

Lead AI Engineer: [Matias Ortiz](https://matiasortiz.co/) - [mo2273@nyu.edu](mailto:mo2273@nyu.edu)

Principal Investigator: [Professor Gizem Kayar](https://wp.nyu.edu/courantinstituteofmathematicalsciences-gizemk/) - [gk2409@nyu.edu](mailto:gk2409@nyu.edu)
