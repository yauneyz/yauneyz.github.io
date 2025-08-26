---
title: "Classic Data Science Algorithms from Scratch"
technologies: [Python, NumPy, SciPy, Matplotlib, Jupyter]
github_url: "https://github.com/yauneyz/ds-implementations"
excerpt: "From-scratch implementations of core machine learning and statistical algorithms including K-Means, Random Forest, Naive Bayes, Kalman Filter, and MCMC methods."
published: true
sort_order: 70
---

# Classic Data Science Algorithms from Scratch

A collection of foundational machine learning and statistical algorithms implemented from first principles in Python. Each implementation focuses on understanding the mathematical foundations rather than using black-box libraries.

## Algorithms Implemented

### K-Means Clustering
Complete implementation of the K-means clustering algorithm with support for different distance metrics and normalization. Applied to real-world datasets including Sacramento housing data and earthquake coordinates with spherical coordinate transformations.

### Random Forest
Full decision tree and random forest implementation including entropy calculations, information gain splitting, and ensemble voting. Includes tree visualization capabilities and performance testing on classification datasets.

### Naive Bayes Classifier  
Text classification implementation using Naive Bayes with Laplace smoothing. Built for spam detection with feature extraction from raw text messages and probabilistic classification.

### Kalman Filter
State estimation implementation for tracking dynamic systems with process and measurement noise. Includes predict and update phases with covariance propagation for optimal state estimation.

### Metropolis-Hastings MCMC
Bayesian inference implementation using Markov Chain Monte Carlo sampling. Includes posterior distribution sampling for statistical parameters and Ising model simulation for statistical physics applications.

## Technical Implementation

### Core Features
- **Pure Python**: All algorithms built using only NumPy, SciPy, and standard libraries
- **Mathematical Foundations**: Each implementation follows the theoretical formulations from literature
- **Real Data Applications**: Tested on actual datasets including earthquake coordinates, housing data, and text corpora
- **Visualization**: Comprehensive plotting and analysis of algorithm performance and results

### Key Challenges Addressed

**Numerical Stability**: Implemented proper handling of edge cases like empty clusters in K-means and numerical precision issues in probability calculations for Naive Bayes.

**Efficiency Optimization**: Vectorized operations using NumPy for performance while maintaining readability and mathematical clarity.

**Statistical Accuracy**: Proper implementation of convergence criteria, acceptance rates, and burn-in periods for MCMC methods to ensure valid statistical inference.

## Results

The implementations successfully replicate the behavior of their scikit-learn counterparts while providing complete transparency into the algorithmic mechanics. Performance testing shows comparable accuracy on standard datasets with clear visualization of algorithm internals.

## What I Learned

Building these algorithms from scratch deepened my understanding of the mathematical foundations underlying modern machine learning. The process revealed the importance of numerical stability, convergence criteria, and proper statistical methodology that are often hidden in high-level libraries.