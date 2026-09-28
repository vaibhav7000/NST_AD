// App.jsx
import { useEffect, useRef, useState } from 'react'
import './App.css'

// Note: Screen Preview Capture, Application Menu, Menu Tray, and Disable
// Ctrl/Cmd+C all run in app.js (main process) — nothing to wire up here.

function App() {
  // state variables
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [screenShareEnabled, setScreenShareEnabled] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [timer, setTimer] = useState(0);
  const [examStarted, setExamStarted] = useState(false);

  // ref variables — one video element per feed, so camera and screen
  // share never overwrite each other.
  const cameraVideoRef = useRef(null);
  const screenVideoRef = useRef(null);

  const allChecksReady = cameraEnabled && screenShareEnabled && fullScreen;

  useEffect(() => {
    // Register Listener for handling Timer Tick from Main
    const removeTimerTickListener = window.athena.registerListenerForTimerTickFromMain(setTimer);

    // Register Listener for handling Camera Snap Request from Main
    const removeCameraSnapListener = window.athena.registerListenerForCameraSnapFromMain(saveVideoScreenShots);

    return () => {
      removeTimerTickListener()
      removeCameraSnapListener()
    };
  }, []);

  // Feature: Parallel Save — takes a still frame from the live camera feed
  // each time main fires 'camera-shot'. Screen preview capture happens
  // independently in main via desktopCapturer.
  async function saveVideoScreenShots() {
    if (!cameraVideoRef.current || !cameraVideoRef.current.srcObject) {
      return;
    }

    try {
      const track = cameraVideoRef.current.srcObject.getVideoTracks()[0];
      if (!track) return;

      const imageCapture = new ImageCapture(track);
      const blob = await imageCapture.takePhoto();
      const arrayBuffer = await blob.arrayBuffer();

      window.athena.storeCameraSnapImageOnDisk(arrayBuffer);
    } catch (error) {
      console.error("Failed to capture image via ImageCapture:", error);
    }
  }

  // Camera permission — identity check, uses getUserMedia (webcam).
  async function getCameraAccess() {
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log(cameraStream);
      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = cameraStream;
      }
      setCameraEnabled(true);
    } catch (error) {
      alert('Cannot access camera. Please allow camera permissions and try again.');
    }
  }

  // Screen share permission — separate from the camera, uses
  // getDisplayMedia (screen/window capture).
  async function getScreenShareAccess() {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });

      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = screenStream;
      }
      setScreenShareEnabled(true);
    } catch (error) {
      alert('Cannot access screen share. Please allow screen sharing and try again.');
    }
  }

  async function enableFullScreen() {
    try {
      await document.documentElement.requestFullscreen();
      setFullScreen(true);
    } catch (error) {
      alert('Cannot switch to full screen.');
    }
  }

  async function startExam() {
    try {
      await window.athena.startTimerOnMain();
      setExamStarted(true);
    } catch (error) {
      // ignored — main already logs failures on its side
    }
  }

  function formatElapsed(totalSeconds) {
    const seconds = Math.max(0, Math.floor(totalSeconds || 0));
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Exam readiness check</h1>
        <p>Camera, screen sharing, and full screen all need to be on before the exam can begin.</p>
      </header>

      <div className="checklist">
        {/* Check 1: Camera */}
        <div className="check-row">
          <div className="check-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 8l4.553-2.276A1 1 0 0 1 21 6.618v10.764a1 1 0 0 1-1.447.894L15 16" />
              <rect x="3" y="6" width="12" height="12" rx="2" />
            </svg>
          </div>

          <div className="check-body">
            <h3>Camera</h3>
            <p>Used to verify it's you during the exam.</p>

            <div className="check-action">
              {cameraEnabled ? (
                <span className="check-status is-ready">
                  <CheckmarkIcon /> Camera connected
                </span>
              ) : (
                <button className="btn btn-primary" onClick={getCameraAccess}>
                  Allow camera access
                </button>
              )}

              <video
                ref={cameraVideoRef}
                autoPlay
                playsInline
                muted
                className={`preview ${cameraEnabled ? '' : 'is-hidden'}`}
              />
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* Check 2: Screen Share */}
        <div className="check-row">
          <div className="check-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2.5" y="4.5" width="19" height="13" rx="1.5" />
              <path d="M8 21h8M12 17.5V21" />
            </svg>
          </div>

          <div className="check-body">
            <h3>Screen sharing</h3>
            <p>Lets the proctor see what's on your screen throughout the exam.</p>

            <div className="check-action">
              {screenShareEnabled ? (
                <span className="check-status is-ready">
                  <CheckmarkIcon /> Screen sharing active
                </span>
              ) : (
                <button className="btn btn-primary" onClick={getScreenShareAccess}>
                  Share your screen
                </button>
              )}

              <video
                ref={screenVideoRef}
                autoPlay
                playsInline
                muted
                className={`preview ${screenShareEnabled ? '' : 'is-hidden'}`}
              />
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* Check 3: Full screen */}
        <div className="check-row">
          <div className="check-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 3H3v6M15 3h6v6M21 15v6h-6M3 15v6h6" />
            </svg>
          </div>

          <div className="check-body">
            <h3>Full screen</h3>
            <p>Stays on for the whole exam — leaving it may be flagged.</p>

            <div className="check-action">
              {fullScreen ? (
                <span className="check-status is-ready">
                  <CheckmarkIcon /> Full screen locked in
                </span>
              ) : (
                <button className="btn btn-primary" onClick={enableFullScreen}>
                  Switch to full screen
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="start-area">
        <button className="btn btn-begin" disabled={!allChecksReady || examStarted} onClick={startExam}>
          {examStarted ? 'Exam in progress' : 'Begin exam'}
        </button>

        {examStarted && (
          <div className="elapsed">
            <span className="elapsed-time">{formatElapsed(timer)}</span>
            <span className="elapsed-label">elapsed</span>
          </div>
        )}
      </div>

      {/* Utility / debug tools — tucked away so they don't compete with
          the actual exam flow. Handy while building, safe to strip out
          of a production build. */}
      <details className="tools">
        <summary>Troubleshooting &amp; manual tools</summary>
        <div className="tools-actions">
          <button className="btn btn-quiet" onClick={() => saveVideoScreenShots()}>
            Save screenshot now
          </button>
          <button className="btn btn-quiet" onClick={() => window.athena.showRules()}>
            Show native rules dialog
          </button>
          <button className="btn btn-quiet" onClick={() => alert('Rules ...')}>
            Show chromium rules
          </button>
          <button className="btn btn-quiet" onClick={() => window.athena.selectFolder()}>
            Select folder
          </button>
        </div>
      </details>
    </div>
  );
}

function CheckmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default App
