---
title: "Madden NFL Computer Vision Classifier"
technologies: [Python, PyTorch, OpenCV, Computer Vision]
github_url: "https://github.com/yauneyz/madden"
excerpt: "Neural networks trained to classify NFL formations and plays from Madden gameplay footage using computer vision techniques."
published: true
sort_order: 70
---

# Teaching AI to Read Football

Can a neural network learn to recognize football formations and plays just by watching Madden NFL gameplay? This project explores using computer vision to automatically classify offensive formations and plays from video footage.

## Approach

### Formation Classification
The first task involved classifying four similar but distinct variants of the shotgun formation from static screenshots:
- Gun Bunch
- Gun Empty Base Flex
- Gun Normal Y Off Close
- Gun Trey Y-Flex

I trained an Inception v3 model on manually labeled formation screenshots, achieving high accuracy on distinguishing between these formation types.

### Play Classification
The more challenging task was classifying actual plays from video sequences:
- Inside Zone (running play)
- Y-Sail (passing play)
- Mesh Spot (passing play)
- Escape (scramble play)

## Technical Implementation

### Data Collection & Labeling
Video training data was manually extracted and labeled from Madden NFL gameplay footage. Screenshots were captured at key moments showing clear formation setups, while play videos were trimmed to show the essential action from snap to completion.

**Note:** The original video training data is not included in this repository due to size constraints, but the data structure and labeling methodology are documented.

### Architecture
- **Formation Classifier**: Fine-tuned Inception v3 model with custom final layer for 4-class classification
- **Play Classifier**: ResNet18-based frame classifier that processes individual video frames and aggregates predictions across the entire play sequence

### Frame-by-Frame Analysis
For play classification, each video frame is processed independently, then predictions are aggregated using a voting mechanism. This approach handles the temporal complexity of football plays where different phases (snap, development, completion) may look quite different.
