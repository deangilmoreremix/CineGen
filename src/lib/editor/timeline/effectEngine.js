// Advanced Effect Engine
// Integrates CineGen's effect system with real-time preview and keyframe animation

export class EffectEngine {
  constructor() {
    // Effect presets with parameters
    this.effects = {
      colorCorrection: {
        name: 'Color Correction',
        parameters: {
          exposure: { type: 'range', min: -3, max: 3, default: 0, step: 0.1 },
          contrast: { type: 'range', min: 0, max: 5, default: 1, step: 0.1 },
          saturation: { type: 'range', min: 0, max: 3, default: 1, step: 0.1 },
          temperature: { type: 'range', min: -100, max: 100, default: 0, step: 1 },
          tint: { type: 'range', min: -100, max: 100, default: 0, step: 1 },
          highlights: { type: 'range', min: -1, max: 1, default: 0, step: 0.1 },
          shadows: { type: 'range', min: -1, max: 1, default: 0, step: 0.1 }
        }
      },
      gaussianBlur: {
        name: 'Gaussian Blur',
        parameters: {
          radius: { type: 'range', min: 0, max: 50, default: 0, step: 1 }
        }
      },
      sharpen: {
        name: 'Sharpen',
        parameters: {
          intensity: { type: 'range', min: 0, max: 5, default: 0, step: 0.1 }
        }
      },
      vignette: {
        name: 'Vignette',
        parameters: {
          intensity: { type: 'range', min: 0, max: 1, default: 0, step: 0.05 },
          midpoint: { type: 'range', min: 0, max: 1, default: 0.5, step: 0.05 }
        }
      },
      chromaticAberration: {
        name: 'Chromatic Aberration',
        parameters: {
          intensity: { type: 'range', min: 0, max: 20, default: 0, step: 1 }
        }
      },
      noise: {
        name: 'Noise',
        parameters: {
          intensity: { type: 'range', min: 0, max: 100, default: 0, step: 1 }
        }
      }
    };
    
    // Active effects on clips
    this.activeEffects = new Map(); // effectId -> {clipId, type, params, keyframes}
    this.effectCounter = 0;
  }

  // Get available effects
  getAvailableEffects() {
    return Object.keys(this.effects).map(key => ({
      id: key,
      ...this.effects[key]
    }));
  }

  // Get effect details
  getEffectDetails(effectId) {
    return this.effects[effectId] || null;
  }

  // Add effect to a clip
  addEffect(clipId, effectId, parameters = {}, keyframes = []) {
    const effect = this.effects[effectId];
    if (!effect) throw new Error(`Unknown effect: ${effectId}`);
    
    const effectId = `eff_${Date.now()}_${this.effectCounter++}`;
    
    // Merge default parameters with provided ones
    const finalParams = {};
    for (const [paramName, paramDef] of Object.entries(effect.parameters)) {
      finalParams[paramName] = parameters[paramName] !== undefined 
        ? parameters[paramName] 
        : paramDef.default;
    }
    
    this.activeEffects.set(effectId, {
      clipId,
      type: effectId,
      parameters: finalParams,
      keyframes: keyframes || [] // Array of {time, params} objects
    });
    
    return effectId;
  }

  // Remove effect
  removeEffect(effectId) {
    return this.activeEffects.delete(effectId);
  }

  // Update effect parameters
  updateEffectParameters(effectId, parameters) {
    const effect = this.activeEffects.get(effectId);
    if (!effect) return false;
    
    // Update only provided parameters, keep others unchanged
    for (const [paramName, value] of Object.entries(parameters)) {
      if (effect.parameters[paramName] !== undefined) {
        effect.parameters[paramName] = value;
      }
    }
    
    return true;
  }

  // Add/update keyframes for animated parameters
  addEffectKeyframe(effectId, time, parameters) {
    const effect = this.activeEffects.get(effectId);
    if (!effect) return false;
    
    // Find existing keyframe at this time or add new one
    const existingIndex = effect.keyframes.findIndex(kf => kf.time === time);
    if (existingIndex >= 0) {
      effect.keyframes[existingIndex] = { time, parameters: { ...effect.keyframes[existingIndex].parameters, ...parameters } };
    } else {
      effect.keyframes.push({ time, parameters: { ...effect.parameters, ...parameters } });
      // Sort by time
      effect.keyframes.sort((a, b) => a.time - b.time);
    }
    
    return true;
  }

  // Remove keyframe
  removeEffectKeyframe(effectId, time) {
    const effect = this.activeEffects.get(effectId);
    if (!effect) return false;
    
    const initialLength = effect.keyframes.length;
    effect.keyframes = effect.keyframes.filter(kf => kf.time !== time);
    return effect.keyframes.length !== initialLength;
  }

  // Get effect value at specific time (for keyframe interpolation)
  getEffectValueAtTime(effectId, paramName, time) {
    const effect = this.activeEffects.get(effectId);
    if (!effect) return null;
    
    // If no keyframes, return static value
    if (effect.keyframes.length === 0) {
      return effect.parameters[paramName];
    }
    
    // Find surrounding keyframes for interpolation
    let prevKf = effect.keyframes[0];
    let nextKf = effect.keyframes[effect.keyframes.length - 1];
    
    // If time is before first keyframe, use first keyframe value
    if (time <= prevKf.time) {
      return prevKf.parameters[paramName];
    }
    
    // If time is after last keyframe, use last keyframe value
    if (time >= nextKf.time) {
      return nextKf.parameters[paramName];
    }
    
    // Find the two keyframes to interpolate between
    for (let i = 0; i < effect.keyframes.length - 1; i++) {
      if (effect.keyframes[i].time <= time && effect.keyframes[i + 1].time >= time) {
        prevKf = effect.keyframes[i];
        nextKf = effect.keyframes[i + 1];
        break;
      }
    }
    
    // Linear interpolation
    const totalTime = nextKf.time - prevKf.time;
    if (totalTime === 0) return prevKf.parameters[paramName];
    
    const localTime = time - prevKf.time;
    const factor = localTime / totalTime;
    
    const startValue = prevKf.parameters[paramName];
    const endValue = nextKf.parameters[paramName];
    
    return startValue + (endValue - startValue) * factor;
  }

  // Get all effects on a clip
  getEffectsForClip(clipId) {
    const result = [];
    for (const [effectId, effect] of this.activeEffects.entries()) {
      if (effect.clipId === clipId) {
        result.push({ effectId, ...effect });
      }
    }
    return result;
  }

  // Clear all effects
  clearAllEffects() {
    this.activeEffects.clear();
    this.effectCounter = 0;
  }
}

// Export singleton instance
export const effectEngine = new EffectEngine();
export default EffectEngine;