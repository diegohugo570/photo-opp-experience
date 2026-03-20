import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';

import screenCapture from '../../assets/screen-capture.png';
import screenCountdown3 from '../../assets/screen-countdown-3.png';
import screenCountdown2 from '../../assets/screen-countdown-2.png';
import screenCountdown1 from '../../assets/screen-countdown-1.png';
import screenProcessing from '../../assets/screen-processing.png';
import screenReview from '../../assets/screen-review.png';
import screenDownload from '../../assets/screen-download.png';
import screenThanksModal from '../../assets/screen-thanks-modal.png';
import screenThanks from '../../assets/screen-thanks.png';

export default function CaptureProcess() {
  const [step, setStep] = useState('PRE_CAPTURE'); // PRE_CAPTURE | COUNTDOWN | PROCESSING | REVIEW | DOWNLOAD | THANKS_MODAL | THANKS
  const [countdown, setCountdown] = useState(3);
  const [imageUrl, setImageUrl] = useState('');
  const [, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const shouldOpenCamera = step === 'PRE_CAPTURE' || step === 'COUNTDOWN';
    let cancelled = false;

    const openCamera = async () => {
      if (!shouldOpenCamera) return;
      if (streamRef.current) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1080 }, height: { ideal: 1920 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (error) {
        console.error('Camera error:', error);
      }
    };

    if (shouldOpenCamera) {
      openCamera();
    } else if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    return () => {
      cancelled = true;
    };
  }, [step]);

  const startCountdown = () => {
    setCountdown(3);
    setStep('COUNTDOWN');
    let current = 3;
    const timer = setInterval(() => {
      current -= 1;
      if (current <= 0) {
        clearInterval(timer);
        captureAndUpload();
        return;
      }
      setCountdown(current);
    }, 1000);
  };

  const captureAndUpload = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth || !video.videoHeight) {
      setStep('PRE_CAPTURE');
      return;
    }

    setStep('PROCESSING');
    setIsUploading(true);

    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        setIsUploading(false);
        setStep('PRE_CAPTURE');
        return;
      }

      const localPreview = URL.createObjectURL(blob);
      const formData = new FormData();
      formData.append('image', blob, 'capture.png');

      try {
        const { data } = await axios.post('http://localhost:5000/api/photos/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setImageUrl(data?.url || localPreview);
      } catch (error) {
        console.error('Upload error:', error);
        setImageUrl(localPreview);
      } finally {
        setIsUploading(false);
        setStep('REVIEW');
      }
    }, 'image/png');
  };

  const bg = (() => {
    if (step === 'PRE_CAPTURE') return screenCapture;
    if (step === 'COUNTDOWN') {
      if (countdown === 3) return screenCountdown3;
      if (countdown === 2) return screenCountdown2;
      return screenCountdown1;
    }
    if (step === 'PROCESSING') return screenProcessing;
    if (step === 'REVIEW') return screenReview;
    if (step === 'DOWNLOAD') return screenDownload;
    if (step === 'THANKS_MODAL') return screenThanksModal;
    return screenThanks;
  })();

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-gradient-to-br from-white to-zinc-200 flex items-center justify-center">
      <img
        src={bg}
        alt="Capture flow"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ minHeight: '100vh', minWidth: '100vw' }}
      />

      {/* Hidden real video stream for capture/upload logic */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-0"
      />

      {/* REVIEW overlay: show captured photo on top of the static reference */}
      {step === 'REVIEW' && imageUrl && (
        <img
          src={imageUrl}
          alt="Captured preview"
          className="absolute left-0 top-[9.4%] w-full h-[60.8%] object-cover pointer-events-none"
          style={{ zIndex: 1 }}
        />
      )}

      {/* DOWNLOAD + THANKS overlay: show real QR code on top of the placeholder */}
      {(step === 'DOWNLOAD' || step === 'THANKS_MODAL' || step === 'THANKS') && (
        <>
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
            {step === 'DOWNLOAD' || step === 'THANKS_MODAL' ? (
              // Bottom-right QR box (matches the download/reference screen layout)
              <div className="absolute left-0 right-0 top-[12%] bottom-[10%] flex items-end justify-end px-4 pb-10">
                <div className="w-[43%] h-[41%] p-4 flex items-end justify-end">
                  <div className="h-[75%] flex items-center justify-center w-full bg-transparent">
                    <QRCodeSVG
                      value={imageUrl || ''}
                      size={130}
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                </div>
              </div>
            ) : (
              // Center QR square on the final thanks screen
              <div className="absolute left-1/2 top-[54%] -translate-x-1/2 w-[70%] max-w-[320px] aspect-square flex items-center justify-center">
                <QRCodeSVG
                  value={imageUrl || ''}
                  size={180}
                  level="H"
                  includeMargin={false}
                />
              </div>
            )}
          </div>
        </>
      )}

      {/* Capture ring click target */}
      {(step === 'PRE_CAPTURE' || step === 'COUNTDOWN') && (
        <button
          type="button"
          onClick={startCountdown}
          disabled={step === 'COUNTDOWN'}
          aria-label="Capturar"
          className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-[110px] h-[110px] border-4 border-[#d1d1d1] bg-white shadow-lg flex items-center justify-center text-2xl font-black disabled:opacity-60 z-20"
        >
          {/* Anel de captura visual */}
        </button>
      )}

      {/* Review actions */}
      {step === 'REVIEW' && (
        <>
          <button
            type="button"
            onClick={() => setStep('PRE_CAPTURE')}
            aria-label="Refazer"
            className="absolute bottom-[7%] left-[8%] w-[36%] h-[9%] bg-[#5b5b5b] text-white font-bold text-2xl tracking-tight flex items-center justify-center shadow-lg border-none focus:outline-none focus:ring-2 focus:ring-[#5b5b5b] transition-all z-20"
          >Refazer</button>
          <button
            type="button"
            onClick={() => setStep('DOWNLOAD')}
            aria-label="Continuar"
            className="absolute bottom-[7%] right-[8%] w-[36%] h-[9%] bg-[#5b5b5b] text-white font-bold text-2xl tracking-tight flex items-center justify-center shadow-lg border-none focus:outline-none focus:ring-2 focus:ring-[#5b5b5b] transition-all z-20"
          >Continuar</button>
        </>
      )}

      {/* Download/Thanks finalize actions */}
      {step === 'DOWNLOAD' && (
        <button
          type="button"
          onClick={() => setStep('THANKS_MODAL')}
          aria-label="Finalizar"
          className="absolute bottom-0 left-0 w-full h-[12%] bg-[#5b5b5b] text-white font-bold text-2xl tracking-tight flex items-center justify-center shadow-lg border-none focus:outline-none focus:ring-2 focus:ring-[#5b5b5b] transition-all z-20"
        >Finalizar</button>
      )}
      {step === 'THANKS_MODAL' && (
        <button
          type="button"
          onClick={() => setStep('THANKS')}
          aria-label="Finalizar"
          className="absolute bottom-0 left-0 w-full h-[12%] bg-[#5b5b5b] text-white font-bold text-2xl tracking-tight flex items-center justify-center shadow-lg border-none focus:outline-none focus:ring-2 focus:ring-[#5b5b5b] transition-all z-20"
        >Finalizar</button>
      )}
      {step === 'THANKS' && (
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="Finalizar"
          className="absolute bottom-0 left-0 w-full h-[12%] bg-[#5b5b5b] text-white font-bold text-2xl tracking-tight flex items-center justify-center shadow-lg border-none focus:outline-none focus:ring-2 focus:ring-[#5b5b5b] transition-all z-20"
        >Finalizar</button>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
