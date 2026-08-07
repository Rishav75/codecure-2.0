import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export function QRScanner({ onScan }: { onScan: (data: string) => void }) {
  const [error, setError] = useState("");

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (decodedText) => {
        scanner.clear();
        onScan(decodedText);
      },
      (err) => {
        // Ignored, happens constantly when scanning
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [onScan]);

  return (
    <div className="w-full max-w-sm mx-auto">
      <div id="reader" className="w-full rounded-2xl overflow-hidden border-2 border-indigo-500/30 bg-zinc-900"></div>
      {error && <p className="text-red-400 mt-2 text-sm text-center">{error}</p>}
    </div>
  );
}
