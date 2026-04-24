// Advanced Transition System
// Integrates CineGen's transition library with preview and customization

export class TransitionSystem {
  constructor() {
    // Transition presets with parameters
    this.transitions = {
      dissolve: {
        name: 'Dissolve',
        defaultDuration: 0.5,
        parameters: {},
        shader: 'dissolve'
      },
      fade: {
        name: 'Fade',
        defaultDuration: 0.5,
        parameters: {},
        shader: 'fade'
      },
      slide: {
        name: 'Slide',
        defaultDuration: 0.5,
        parameters: {
          direction: { type: 'enum', values: ['left', 'right', 'up', 'down'], default: 'left' }
        },
        shader: 'slide'
      },
      zoom: {
        name: 'Zoom',
        defaultDuration: 0.5,
        parameters: {
          ease: { type: 'enum', values: ['in', 'out', 'inout'], default: 'inout' }
        },
        shader: 'zoom'
      },
      whip: {
        name: 'Whip',
        defaultDuration: 0.3,
        parameters: {
          direction: { type: 'enum', values: ['left', 'right', 'up', 'down'], default: 'left' },
          intensity: { type: 'range', min: 0.5, max: 2, default: 1, step: 0.1 }
        },
        shader: 'whip'
      },
      glitch: {
        name: 'Glitch',
        defaultDuration: 0.4,
        parameters: {
          intensity: { type: 'range', min: 0.1, max: 1, default: 0.5, step: 0.05 },
          colorOffset: { type: 'range', min: 0, max: 20, default: 5, step: 1 }
        },
        shader: 'glitch'
      },
      lightLeak: {
        name: 'Light Leak',
        defaultDuration: 0.6,
        parameters: {
          intensity: { type: 'range', min: 0.1, max: 1, default: 0.3, step: 0.05 },
          color: { type: 'color', default: '#ff9e6d' }
        },
        shader: 'lightLeak'
      }
    };
    
    // Active transitions on timeline
    this.activeTransitions = new Map(); // transitionId -> {clipIds, type, params, progress}
  }

  // Get available transitions
  getAvailableTransitions() {
    return Object.keys(this.transitions).map(key => ({
      id: key,
      ...this.transitions[key]
    }));
  }

  // Get transition details
  getTransitionDetails(transitionId) {
    return this.transitions[transitionId] || null;
  }

  // Add transition between two clips
  addTransition(clipIdA, clipIdB, transitionId, duration = null, parameters = {}) {
    const transition = this.transitions[transitionId];
    if (!transition) throw new Error(`Unknown transition: ${transitionId}`);
    
    const transitionId = `trans_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const finalDuration = duration !== null ? duration : transition.defaultDuration;
    
    // Merge default parameters with provided ones
    const finalParams = {};
    for (const [paramName, paramDef] of Object.entries(transition.parameters)) {
      finalParams[paramName] = parameters[paramName] !== undefined 
        ? parameters[paramName] 
        : paramDef.default;
    }
    
    this.activeTransitions.set(transitionId, {
      clipIds: [clipIdA, clipIdB],
      type: transitionId,
      duration: finalDuration,
      parameters: finalParams,
      progress: 0 // 0-1 for preview
    });
    
    return transitionId;
  }

  // Remove transition
  removeTransition(transitionId) {
    return this.activeTransitions.delete(transitionId);
  }

  // Update transition parameters
  updateTransitionParameters(transitionId, parameters) {
    const transition = this.activeTransitions.get(transitionId);
    if (!transition) return false;
    
    // Update only provided parameters, keep others unchanged
    for (const [paramName, value] of Object.entries(parameters)) {
      if (transition.parameters[paramName] !== undefined) {
        transition.parameters[paramName] = value;
      }
    }
    
    return true;
  }

  // Get transition for rendering
  getTransitionForRendering(transitionId) {
    return this.activeTransitions.get(transitionId) || null;
  }

  // Get all transitions affecting a clip
  getTransitionsForClip(clipId) {
    const result = [];
    for (const [transitionId, transition] of this.activeTransitions.entries()) {
      if (transition.clipIds.includes(clipId)) {
        result.push({ transitionId, ...transition });
      }
    }
    return result;
  }

  // Set transition preview progress (for UI preview)
  setTransitionPreviewProgress(transitionId, progress) {
    const transition = this.activeTransitions.get(transitionId);
    if (transition) {
      transition.progress = Math.max(0, Math.min(1, progress));
      return true;
    }
    return false;
  }

  // Clear all transitions
  clearAllTransitions() {
    this.activeTransitions.clear();
  }
}

// Export singleton instance
export const transitionSystem = new TransitionSystem();
export default TransitionSystem;