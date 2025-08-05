---
title: "Thinky – Research Annotation Platform"
technologies: [ClojureScript, Electron, Reagent, re-frame]
github_url: "https://github.com/yauneyz/thinky-v2"
demo_url: "https://www.thinky.dev"
excerpt: "An offline-friendly Electron app that lets scholars highlight, tag, and instantly resurface PDF passages across multiple research projects."
published: true
---

# Thinky

Thinky is an “innovator’s notebook” that pulls reading, note-taking, and idea management into one desktop application.

## Features

### Core Functionality
- **Real-time PDF Annotation** – highlight, comment, and tag passages without leaving the reading flow
- **Hierarchical Tags** – organise concepts in a flexible tree and filter by any branch
- **Workspace Manager** – keep unlimited projects open at once with a nested workspace tree
- **Instant Retrieval** – a global *Item Finder* surfaces any annotation, document, or note in milliseconds

### Advanced Features
- **Windowing System** – split-screen editors & PDFs that can be minimised, resized, or zoomed to focus
- **Annotation Library** – saved filters combine content, tag, folder, and workspace scopes for powerful queries
- **Vim Mode & Keyboard-first UX** – optional Vim key-bindings plus fast directory navigation in the Item Finder
- **Offline-First** – local storage makes the app fully usable on flights or in the field; changes sync when back online.

## Technical Implementation

### Frontend
Built with **ClojureScript + Reagent/re-frame** for a purely functional, event-driven UI running inside Electron. Re-frame’s unidirectional data-flow keeps the growing workspace/tree state predictable, while Reagent delivers React-like components with React’s virtual-DOM performance.

### Backend / Persistence
A local Datalog store (DataScript) tracks documents, annotations, and tag relations; queries power instant full-text and faceted search. The app exposes a lightweight WebSocket API for future collaborative features.

### Desktop Packaging & CI
- **electron-builder** produces signed installers for macOS, Windows, and Linux.
- **GitHub Actions** handles cross-platform builds, unit tests, and automatic release uploads.

## Key Challenges

| Challenge | Solution & Impact |
|-----------|------------------|
| Rendering large PDFs smoothly inside Electron | Added lazy page virtualization and memoised canvas layers, maintaining 60 fps scrolling on 300‑page documents. |
| Keeping UI responsive with thousands of annotations | Indexed DataScript queries and batched re-frame event dispatches to cut render time by 45 %. |
| Designing an intuitive multi-window workflow | Prototyped several layouts with real users; settled on the current minimise/zoom pattern that reduced context‑switch time by an average of 26 %. |

## Results

- Private beta has 120+ graduate‑student users across 8 universities.
- Users report saving **~4 h/week** on literature reviews thanks to faster retrieval and cross‑paper comparison.
- The underlying annotation engine now processes **>50 k** highlights with < 100 ms query latency on commodity hardware.

## What I Learned

Building Thinky deepened my expertise in functional UI architecture, local‑first data syncing, and developer‑tested desktop distribution pipelines. Most importantly, continual feedback loops with real researchers taught me to balance power‑user flexibility with first‑run approachability.
