// Feature Mapper for CineGen Integration
// Maps CineGen feature names to existing timeline editor functions

export class CineGenFeatureMapper {
  constructor(timelineEditor) {
    this.timelineEditor = timelineEditor;
    this.featureMap = this.createFeatureMap();
  }

  createFeatureMap() {
    return {
      // Multi-camera and track management
      'multiCameraSync': {
        target: 'multiTrackManager',
        method: 'syncGroupedTracks',
        description: 'Synchronize editing across grouped tracks for multi-camera workflows'
      },
      'createTrackGroup': {
        target: 'multiTrackManager',
        method: 'createTrackGroup',
        description: 'Create a group of tracks for synchronized editing'
      },
      'removeTrackGroup': {
        target: 'multiTrackManager',
        method: 'removeTrackGroup',
        description: 'Remove a track group'
      },
      'getTrackGroup': {
        target: 'multiTrackManager',
        method: 'getTrackGroup',
        description: 'Get the group ID for a track'
      },
      'soloTrack': {
        target: 'multiTrackManager',
        method: 'soloTrack',
        description: 'Solo a track (mute all others)'
      },
      'unsoloTrack': {
        target: 'multiTrackManager',
        method: 'unsoloTrack',
        description: 'Unsolo all tracks'
      },
      'isTrackSoloed': {
        target: 'multiTrackManager',
        method: 'isTrackSoloed',
        description: 'Check if a track is soloed'
      },
      'muteTrack': {
        target: 'multiTrackManager',
        method: 'muteTrack',
        description: 'Mute a track'
      },
      'unmuteTrack': {
        target: 'multiTrackManager',
        method: 'unmuteTrack',
        description: 'Unmute a track'
      },
      'isTrackMuted': {
        target: 'multiTrackManager',
        method: 'isTrackMuted',
        description: 'Check if a track is muted'
      },
      'lockTrack': {
        target: 'multiTrackManager',
        method: 'lockTrack',
        description: 'Lock a track to prevent editing'
      },
      'unlockTrack': {
        target: 'multiTrackManager',
        method: 'unlockTrack',
        description: 'Unlock a track'
      },
      'isTrackLocked': {
        target: 'multiTrackManager',
        method: 'isTrackLocked',
        description: 'Check if a track is locked'
      },
      'getActiveTracks': {
        target: 'multiTrackManager',
        method: 'getActiveTracks',
        description: 'Get tracks that are currently active (not muted/soloed)'
      },

      // Transition system
      'getAvailableTransitions': {
        target: 'transitionSystem',
        method: 'getAvailableTransitions',
        description: 'Get list of available transitions'
      },
      'getTransitionDetails': {
        target: 'transitionSystem',
        method: 'getTransitionDetails',
        description: 'Get details about a specific transition'
      },
      'addTransition': {
        target: 'transitionSystem',
        method: 'addTransition',
        description: 'Add a transition between two clips'
      },
      'removeTransition': {
        target: 'transitionSystem',
        method: 'removeTransition',
        description: 'Remove a transition'
      },
      'updateTransitionParameters': {
        target: 'transitionSystem',
        method: 'updateTransitionParameters',
        description: 'Update parameters of a transition'
      },
      'getTransitionForRendering': {
        target: 'transitionSystem',
        method: 'getTransitionForRendering',
        description: 'Get transition data for rendering'
      },
      'getTransitionsForClip': {
        target: 'transitionSystem',
        method: 'getTransitionsForClip',
        description: 'Get all transitions affecting a clip'
      },
      'setTransitionPreviewProgress': {
        target: 'transitionSystem',
        method: 'setTransitionPreviewProgress',
        description: 'Set preview progress for a transition (0-1)'
      },
      'clearAllTransitions': {
        target: 'transitionSystem',
        method: 'clearAllTransitions',
        description: 'Remove all transitions'
      },

      // Effect system
      'getAvailableEffects': {
        target: 'effectEngine',
        method: 'getAvailableEffects',
        description: 'Get list of available effects'
      },
      'getEffectDetails': {
        target: 'effectEngine',
        method: 'getEffectDetails',
        description: 'Get details about a specific effect'
      },
      'addEffect': {
        target: 'effectEngine',
        method: 'addEffect',
        description: 'Add an effect to a clip'
      },
      'removeEffect': {
        target: 'effectEngine',
        method: 'removeEffect',
        description: 'Remove an effect from a clip'
      },
      'updateEffectParameters': {
        target: 'effectEngine',
        method: 'updateEffectParameters',
        description: 'Update parameters of an effect'
      },
      'addEffectKeyframe': {
        target: 'effectEngine',
        method: 'addEffectKeyframe',
        description: 'Add a keyframe for animated effect parameters'
      },
      'removeEffectKeyframe': {
        target: 'effectEngine',
        method: 'removeEffectKeyframe',
        description: 'Remove a keyframe from an effect'
      },
      'getEffectValueAtTime': {
        target: 'effectEngine',
        method: 'getEffectValueAtTime',
        description: 'Get effect parameter value at specific time (with keyframe interpolation)'
      },
      'getEffectsForClip': {
        target: 'effectEngine',
        method: 'getEffectsForClip',
        description: 'Get all effects applied to a clip'
      },
      'clearAllEffects': {
        target: 'effectEngine',
        method: 'clearAllEffects',
        description: 'Remove all effects'
      },

      // AI Features
      'suggestSmartClips': {
        target: 'aiFeatures',
        method: 'suggestSmartClips',
        description: 'Get AI-powered suggestions for smart clipping'
      },
      'suggestTransitions': {
        target: 'aiFeatures',
        method: 'suggestTransitions',
        description: 'Get AI-powered transition suggestions'
      },
      'suggestMusicForClip': {
        target: 'aiFeatures',
        method: 'suggestMusicForClip',
        description: 'Get AI-powered music suggestions for a clip'
      },
      'suggestAudioSync': {
        target: 'aiFeatures',
        method: 'suggestAudioSync',
        description: 'Get AI-powered audio-video synchronization suggestions'
      },
      'suggestFillGapContent': {
        target: 'aiFeatures',
        method: 'suggestFillGapContent',
        description: 'Get AI-powered fill gap content suggestions'
      },
      'getSuggestions': {
        target: 'aiFeatures',
        method: 'getSuggestions',
        description: 'Get all current AI suggestions'
      },
      'clearSuggestions': {
        target: 'aiFeatures',
        method: 'clearSuggestions',
        description: 'Clear all AI suggestions'
      }
    };
  }

  // Check if a feature is available
  isFeatureAvailable(featureName) {
    return !!this.featureMap[featureName];
  }

  // Get feature information
  getFeatureInfo(featureName) {
    return this.featureMap[featureName] || null;
  }

  // Get all available features
  getAvailableFeatures() {
    return Object.keys(this.featureMap);
  }

  // Call a feature by name
  async callFeature(featureName, ...args) {
    const featureInfo = this.featureMap[featureName];
    if (!featureInfo) {
      throw new Error(`Unknown feature: ${featureName}`);
    }

    // Get the target system
    let target = null;
    switch (featureInfo.target) {
      case 'multiTrackManager':
        target = this.timelineEditor.cineGenAdapter?.getMultiTrackManager();
        break;
      case 'transitionSystem':
        target = this.timelineEditor.cineGenAdapter?.getTransitionSystem();
        break;
      case 'effectEngine':
        target = this.timelineEditor.cineGenAdapter?.getEffectEngine();
        break;
      case 'aiFeatures':
        target = this.timelineEditor.cineGenAdapter?.getAIFeatures();
        break;
      default:
        throw new Error(`Unknown target system: ${featureInfo.target}`);
    }

    if (!target) {
      throw new Error(`Target system not initialized for feature: ${featureName}`);
    }

    // Call the method
    if (typeof target[featureInfo.method] === 'function') {
      const result = target[featureInfo.method].apply(target, args);
      // Handle async functions
      if (result instanceof Promise) {
        return await result;
      }
      return result;
    } else {
      throw new Error(`Method ${featureInfo.method} not found on target system`);
    }
  }

  // Get features by category
  getFeaturesByCategory(category) {
    const categories = {
      'trackManagement': [
        'multiCameraSync', 'createTrackGroup', 'removeTrackGroup', 'getTrackGroup',
        'soloTrack', 'unsoloTrack', 'isTrackSoloed', 'muteTrack', 'unmuteTrack',
        'isTrackMuted', 'lockTrack', 'unlockTrack', 'isTrackLocked', 'getActiveTracks'
      ],
      'transitions': [
        'getAvailableTransitions', 'getTransitionDetails', 'addTransition', 'removeTransition',
        'updateTransitionParameters', 'getTransitionForRendering', 'getTransitionsForClip',
        'setTransitionPreviewProgress', 'clearAllTransitions'
      ],
      'effects': [
        'getAvailableEffects', 'getEffectDetails', 'addEffect', 'removeEffect',
        'updateEffectParameters', 'addEffectKeyframe', 'removeEffectKeyframe',
        'getEffectValueAtTime', 'getEffectsForClip', 'clearAllEffects'
      ],
      'aiFeatures': [
        'suggestSmartClips', 'suggestTransitions', 'suggestMusicForClip',
        'suggestAudioSync', 'suggestFillGapContent', 'getSuggestions', 'clearSuggestions'
      ]
    };
    
    return categories[category] || [];
  }
}

// Export factory function
export function createCineGenFeatureMapper(timelineEditor) {
  return new CineGenFeatureMapper(timelineEditor);
}

export default CineGenFeatureMapper;