// App.jsx
import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  // state variables
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [timer, setTimer] = useState('');

  // ref variables
  const videoRef = useRef(null);


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

  async function saveVideoScreenShots() {
    if (!videoRef.current || !videoRef.current.srcObject) {
      return;
    }

    try {
      const track = videoRef.current.srcObject.getVideoTracks()[0];
      if (!track) return;

      // Use ImageCapture API
      const imageCapture = new ImageCapture(track);
      const blob = await imageCapture.takePhoto();
      const arrayBuffer = await blob.arrayBuffer();

      // Send raw binary buffer to main process
      window.athena.storeCameraSnapImageOnDisk(arrayBuffer);
    } catch (error) {
      console.error("Failed to capture image via ImageCapture:", error);
    }
  }

  async function getCameraAccess() {
    try {
      const videoData = await navigator.mediaDevices.getUserMedia({
        video: true
      });

      if (videoRef.current) {
        videoRef.current.srcObject = videoData
      }
      setCameraEnabled(true);
    } catch (error) {
      alert('Cannot access Camera');
    }
  }

  async function enableFullScreen() {
    try {
      await document.documentElement.requestFullscreen();
      setFullScreen(true);
    } catch (error) {
      alert('Cannot access full screen');
    }
  }


  return (
    <div className="page-container">
      {/* Main Card */}
      <div className="card-container">
        {/* Section 1: Camera / Heimdall */}
        <div className="permission-item">
          <div className="permission-content">
            <h3>Configure Camera</h3>
            <p>Kindly configure Camera to attempt quiz/contests.</p>
            <div className="action-row">
              <button
                className="btn btn-black"
                disabled={cameraEnabled}
                onClick={getCameraAccess}
              >
                {cameraEnabled ? 'Camera Connected' : 'Get Camera Access'}
              </button>

              {/* Hidden/Active Video Feed Preview */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className={`video-preview`}
              />
            </div>
          </div>
        </div>

        <div className="divider"></div>

        {/* Section 2: Fullscreen */}
        <div className="permission-item">
          <div className="permission-content">
            <h3>Switch to full screen</h3>
            <button
              className="btn btn-primary"
              disabled={fullScreen}
              onClick={() => {
                enableFullScreen();
              }}
            >
              {fullScreen ? 'Full Screen Enabled' : 'Give Full Screen Permissions'}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="bottom-actions">
        <button
          className="btn btn-primary"
          disabled={!cameraEnabled || !fullScreen}
          onClick={async () => {
            try {
              const response = await window.athena.startTimerOnMain();
            } catch (error) {

            }
          }}
        >
          Go To Test
        </button>
      </div>

      <div>
        {timer + ' (s) elapsed'}
      </div>

      <div>
        <button onClick={() => {
          saveVideoScreenShots()
        }}>
          saveVideoScreenShots
        </button>
      </div>


      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button onClick={() => {
          window.athena.showRules()
        }}>
          Show Native Rules
        </button>

        <button onClick={() => { alert("Rules ...") }}>
          Show Chromium Rules
        </button>
      </div>

      <div>
        <button onClick={() => {
          window.athena.selectFolder()
        }}>
          Select folder
        </button>
      </div>

    </div>
  );
}

export default App
