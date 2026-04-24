// Enhanced Timeline Renderer
// Upgraded from basic renderer to support CineGen features

export function renderTracksEnhanced(state, els, showToast) {
  // Enhanced rendering that supports multi-track, effects, transitions, etc.
  
  // Clear existing elements
  els.trackContainer.innerHTML = '';
  els.timeRuler.innerHTML = '';
  
  if (!state.timeline) return;
  
  const { timeline, trackHeight } = state;
  const pxPerSecond = state.pxPerSecond || 100; // Default if not provided
  
  // Get active tracks (respecting solo/mute state)
  const activeTracks = getActiveTracks(timeline);
  
  // Render time ruler
  renderTimeRulerEnhanced(els.timeRuler, timeline, pxPerSecond, els);
  
  // Render each track
  let offsetTop = 0;
  activeTracks.forEach(track => {
    const trackElement = document.createElement('div');
    trackElement.className = 'track';
    trackElement.dataset.trackId = track.id;
    trackElement.style.top = `${offsetTop}px`;
    trackElement.style.height = `${trackHeight}px`;
    
    // Add track label
    const trackLabel = document.createElement('div');
    trackLabel.className = 'track-label';
    trackLabel.textContent = track.name || `Track ${track.id}`;
    trackLabel.style.width = `${els.trackLabelWidth || 150}px`;
    trackElement.appendChild(trackLabel);
    
    // Add track controls (mute, solo, lock)
    const trackControls = document.createElement('div');
    trackControls.className = 'track-controls';
    trackControls.innerHTML = `
      <button class="track-control-btn mute" title="Mute Track">M</button>
      <button class="track-control-btn solo" title="Solo Track">S</button>
      <button class="track-control-btn lock" title="Lock Track">L</button>
    `;
    trackElement.appendChild(trackControls);
    
    // Add track content container
    const trackContent = document.createElement('div');
    trackContent.className = 'track-content';
    trackContent.style.position = 'relative';
    trackContent.style.overflow = 'hidden';
    trackContent.style.width = 'calc(100% - 150px)'; // Account for label width
    trackContent.style.left = '150px';
    trackElement.appendChild(trackContent);
    
    // Render clips on this track
    const trackClips = getClipsOnTrack(timeline, track.id)
      .sort((a, b) => a.startTime - b.startTime);
    
    trackClips.forEach(clip => {
      const clipElement = createEnhancedClipElement(clip, state, els);
      trackContent.appendChild(clipElement);
    });
    
    // Render transitions between clips on this track
    renderTrackTransitions(trackContent, trackClips, state, els);
    
    els.trackContainer.appendChild(trackElement);
    offsetTop += trackHeight;
  });
  
  // Set container height
  els.trackContainer.style.height = `${offsetTop}px`;
}

// Helper function to get active tracks (respecting solo/mute)
function getActiveTracks(timeline) {
  // In a full implementation, this would check solo/mute state
  // For now, return all tracks
  return timeline.tracks || [];
}

// Helper function to get clips on a specific track
function getClipsOnTrack(timeline, trackId) {
  return timeline.clips.filter(clip => clip.trackId === trackId);
}

// Enhanced time ruler rendering
function renderTimeRulerEnhanced(container, timeline, pxPerSecond, els) {
  container.innerHTML = '';
  
  if (!timeline) return;
  
  const duration = timeline.duration || 60; // Default 60 seconds
  const width = duration * pxPerSecond;
  container.style.width = `${width}px`;
  
  // Second markers
  for (let i = 0; i <= Math.ceil(duration); i++) {
    const marker = document.createElement('div');
    marker.className = 'time-marker';
    marker.style.left = `${i * pxPerSecond}px`;
    
    const label = document.createElement('div');
    label.className = 'time-label';
    label.textContent = formatTimecode(i);
    marker.appendChild(label);
    
    container.appendChild(marker);
  }
  
  // Frame markers (sub-divisions)
  const framesPerSecond = 24; // Standard film/video rate
  const pxPerFrame = pxPerSecond / framesPerSecond;
  
  for (let i = 0; i < Math.floor(duration * framesPerSecond); i++) {
    if (i % framesPerSecond !== 0) { // Skip second markers
      const marker = document.createElement('div');
      marker.className = 'frame-marker';
      marker.style.left = `${i * pxPerFrame}px`;
      container.appendChild(marker);
    }
  }
}

// Create enhanced clip element with support for effects, transitions, etc.
function createEnhancedClipElement(clip, state, els) {
  const element = document.createElement('div');
  element.className = 'clip';
  element.dataset.clipId = clip.id;
  
  // Calculate position and size
  const pxPerSecond = state.pxPerSecond || 100;
  const left = clip.startTime * pxPerSecond;
  const width = clip.effectiveDuration * pxPerSecond;
  
  element.style.position = 'absolute';
  element.style.left = `${left}px`;
  element.style.width = `${width}px`;
  element.style.top = '0';
  element.style.bottom = '0';
  
  // Set clip type styling
  if (clip.kind === 'video') {
    element.style.backgroundColor = clip.color || '#4a90e2';
    element.style.borderLeft = '3px solid #2563eb';
    
    // Try to show video thumbnail if available
    if (clip.source && typeof clip.source === 'string') {
      element.style.backgroundImage = `url(${clip.source})`;
      element.style.backgroundSize = 'cover';
      element.style.backgroundPosition = 'center';
    }
  } else if (clip.kind === 'audio') {
    element.style.backgroundColor = clip.color || '#fd79a8';
    element.style.borderLeft = '3px solid #e91e63';
    
    // Add waveform visualization
    const waveform = document.createElement('div');
    waveform.className = 'clip-waveform';
    waveform.style.position = 'absolute';
    waveform.style.top = '0';
    waveform.style.left = '0';
    waveform.style.width = '100%';
    waveform.style.height = '100%';
    element.appendChild(waveform);
  } else {
    element.style.backgroundColor = clip.color || '#a29bfe';
    element.style.borderLeft = '3px solid #6c5ce7';
  }
  
  // Add clip label
  const label = document.createElement('div');
  label.className = 'clip-label';
  label.textContent = clip.name || `Clip ${clip.id.slice(0, 8)}`;
  element.appendChild(label);
  
  // Add effect indicators
  const effectIndicator = document.createElement('div');
  effectIndicator.className = 'clip-effect-indicator';
  effectIndicator.title = 'Effects applied';
  element.appendChild(effectIndicator);
  
  // Add transition indicators (on edges)
  const leftTransition = document.createElement('div');
  leftTransition.className = 'clip-transition-left';
  element.appendChild(leftTransition);
  
  const rightTransition = document.createElement('div');
  rightTransition.className = 'clip-transition-right';
  element.appendChild(rightTransition);
  
  // Make clip draggable/resizable (would integrate with useTimelineDrag)
  // This is a placeholder - actual dragging would be handled by React events
  
  return element;
}

// Render transitions between clips on a track
function renderTrackTransitions(container, clips, state, els) {
  const pxPerSecond = state.pxPerSecond || 100;
  
  for (let i = 0; i < clips.length - 1; i++) {
    const currentClip = clips[i];
    const nextClip = clips[i + 1];
    
    // Check if there's a transition between these clips
    // In a real implementation, this would check the transition system
    const hasTransition = false; // Placeholder
    
    if (hasTransition) {
      const transitionStart = currentClip.startTime + currentClip.effectiveDuration;
      const transitionEnd = nextClip.startTime;
      const transitionDuration = transitionEnd - transitionStart;
      
      if (transitionDuration > 0) {
        const transitionElement = document.createElement('div');
        transitionElement.className = 'clip-transition';
        transitionElement.style.position = 'absolute';
        transitionElement.style.left = `${transitionStart * pxPerSecond}px`;
        transitionElement.style.width = `${transitionDuration * pxPerSecond}px`;
        transitionElement.style.top = '0';
        transitionElement.style.bottom = '0';
        transitionElement.style.background = 'linear-gradient(90deg, rgba(74,144,226,0.3), rgba(253,121,168,0.3))';
        transitionElement.style.border = '1px dashed rgba(74,144,226,0.5)';
        container.appendChild(transitionElement);
      }
    }
  }
}

// Export for use in timeline editor
export default { renderTracksEnhanced };