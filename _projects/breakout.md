---
title: "Atari Breakout Playing Neural Network"
technologies: [Python, PyTorch]
github_url: "https://github.com/yauneyz/breakout"
excerpt: "A neural network trained to play Atari Breakout. Instead of using the traditional Q-learning technique, we implemented Yann LeCun's world model architecture combined with Monte Carlo Tree Search"
published: true
sort_order: 90
---

# Playing Breakout With a World Model

One of the great early triumphs of deep learning was the building of an agent to play Atari games, specifically Breakout, using deep Q-learning.

In addition , in 2022 Yann LeCun put out a [paper](https://openreview.net/pdf?id=BZ5a1r-kVsf) suggesting an architecture for achieving AGI, centered around the learning of a world model.

The question - is it possible to build an agent to play Breakout using LeCun's architecture?

## Architecture

The core architecture is chiefly derived from the paper.

### State Modeling
Each game state is represented by 4 consecutive frames of raw pixels (84×110 resolution), processed through a convolutional neural network (perception module) to create latent vector representations. Actions are embedded as one-hot vectors and combined with the state representations during world model training.

### World Model

The world model is a 6-layer transformer decoder with 8 attention heads, trained to predict the next latent state when given the current state sequence and an action. It learns the dynamics of the game by predicting how states evolve over time.

The world model enables the agent to simulate future scenarios during action selection. Combined with Monte Carlo Tree Search (MCTS), it explores possible action sequences to find the most promising paths forward.

### Critic

The critic is a 2-layer fully connected network that evaluates game states by predicting expected rewards. It takes the final frame's latent representation from a state sequence and outputs a scalar value indicating how promising that state is for achieving high scores.

## Results

The agent was able to learn how to move the paddle, and sometimes moved in the correct direction, but it was limited in its success.

## Analysis

The main limitations were:
- **Model capacity**: The relatively simple architectures for the world model and critic may not have had enough representational power to fully capture the game dynamics
- **Sparse rewards**: Brick-hitting events are rare, making learning difficult despite oversampling these transitions (dropping 99% of zero-reward states)
- **Temporal credit assignment**: The delay between actions and their consequences (hitting bricks) makes it challenging for the agent to learn cause-and-effect relationships
