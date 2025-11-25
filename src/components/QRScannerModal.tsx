import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRScannerModalProps {
  open: boolean;
  onClose: () => void;
  onScanSuccess: (qrCode: string) => void;
}

export const QRScannerModal = ({ open, onClose, onScanSuccess }: QRScannerModalProps) => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const elementReadyRef = useRef(false);

  useEffect(() => {
    if (open) {
      // Wait for DOM to be ready
      const timer = setTimeout(() => {
        elementReadyRef.current = true;
        requestCameraPermission();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      stopScanner();
      setPermissionGranted(null);
      elementReadyRef.current = false;
    }
  }, [open]);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      
      // Permission granted, stop the stream and start QR scanner
      stream.getTracks().forEach(track => track.stop());
      setPermissionGranted(true);
      startScanner();
    } catch (err) {
      console.error("Camera permission denied:", err);
      setPermissionGranted(false);
      toast({
        title: "Camera Permission Required",
        description: "Please allow camera access to scan QR codes.",
        variant: "destructive",
      });
    }
  };

  const startScanner = async () => {
    if (!elementReadyRef.current) {
      console.error("Element not ready");
      return;
    }

    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          onScanSuccess(decodedText);
          stopScanner();
          onClose();
        },
        (error) => {
          // Ignore scanning errors
        }
      );
      setIsScanning(true);
    } catch (err) {
      console.error("Error starting scanner:", err);
      toast({
        title: "Scanner Error",
        description: "Could not start QR scanner. Please try again.",
        variant: "destructive",
      });
    }
  };

  const stopScanner = async () => {
    try {
      if (scannerRef.current && isScanning) {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
        setIsScanning(false);
      }
    } catch (err) {
      console.error("Error stopping scanner:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
          <DialogDescription>
            Position the QR code within the camera frame to check in/out
          </DialogDescription>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          {permissionGranted === false ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="rounded-full bg-destructive/10 p-4">
                <Camera className="h-8 w-8 text-destructive" />
              </div>
              <div className="text-center space-y-2">
                <p className="font-semibold">Camera Access Required</p>
                <p className="text-sm text-muted-foreground">
                  Please allow camera access in your browser settings to scan QR codes
                </p>
              </div>
              <Button onClick={requestCameraPermission} className="mt-2">
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <div id="qr-reader" className="w-full rounded-lg overflow-hidden"></div>
              <p className="text-sm text-muted-foreground text-center">
                Position the QR code within the frame to scan
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
