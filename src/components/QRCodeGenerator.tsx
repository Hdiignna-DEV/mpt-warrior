'use client';

import { useEffect, useRef } from 'react';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
  className?: string;
}

export function QRCodeGenerator({
  value,
  size = 256,
  level = 'M',
  includeMargin = true,
  className = '',
}: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const generateQRCode = async () => {
      if (!canvasRef.current) return;

      try {
        // Dynamic import untuk menghindari SSR issues
        const QRCode = (await import('qrcode')).default;
        await QRCode.toCanvas(canvasRef.current, value, {
          errorCorrectionLevel: level,
          width: size,
          margin: includeMargin ? 2 : 0,
          color: {
            dark: '#ffffff',
            light: '#1e293b',
          },
        });
      } catch (error) {
        console.error('Failed to generate QR code:', error);
        // Fallback: show placeholder
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(0, 0, size, size);
            ctx.fillStyle = '#ffffff';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('QR Code', size / 2, size / 2 - 10);
            ctx.font = '12px Arial';
            ctx.fillText('(qrcode package)', size / 2, size / 2 + 10);
          }
        }
      }
    };

    generateQRCode();
  }, [value, size, level, includeMargin]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: size,
        height: size,
      }}
    />
  );
}

export default QRCodeGenerator;
