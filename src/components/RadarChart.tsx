'use client';

import { useEffect, useRef } from 'react';

interface RadarData {
  label: string;
  value: number; // 0-100
  color: string;
}

interface RadarChartProps {
  data: RadarData[];
  title?: string;
  size?: number;
}

export function RadarChart({ data, title = 'Skill Assessment', size = 300 }: RadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const maxValue = 100;
    const numLevels = 5;
    const angleSlice = (Math.PI * 2) / data.length;
    const radius = Math.min(centerX, centerY) - 40;

    // Clear canvas
    ctx.fillStyle = 'rgba(255, 255, 255, 0.01)';
    ctx.fillRect(0, 0, size, size);

    // Draw concentric circles (levels)
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= numLevels; i++) {
      const r = (radius / numLevels) * i;
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw level labels (20, 40, 60, 80, 100)
    ctx.fillStyle = 'rgba(100, 100, 100, 0.6)';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    for (let i = 1; i <= numLevels; i++) {
      const value = (maxValue / numLevels) * i;
      const r = (radius / numLevels) * i;
      ctx.fillText(value.toString(), centerX - 5, centerY - r + 5);
    }

    // Draw axes and labels
    ctx.strokeStyle = 'rgba(150, 150, 150, 0.4)';
    ctx.lineWidth = 1;
    ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';

    data.forEach((item, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      // Draw axis line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Draw label
      const labelRadius = radius + 30;
      const labelX = centerX + labelRadius * Math.cos(angle);
      const labelY = centerY + labelRadius * Math.sin(angle);
      ctx.fillText(item.label, labelX, labelY);
    });

    // Draw user data (polygon)
    ctx.fillStyle = 'rgba(100, 200, 255, 0.3)';
    ctx.strokeStyle = 'rgba(100, 150, 255, 0.8)';
    ctx.lineWidth = 2;

    ctx.beginPath();
    data.forEach((item, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const r = (radius / maxValue) * item.value;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw data points
    ctx.fillStyle = 'rgba(100, 150, 255, 1)';
    data.forEach((item, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const r = (radius / maxValue) * item.value;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [data, size]);

  return (
    <div className="flex flex-col items-center gap-4">
      {title && <h3 className="text-lg font-bold text-gray-800">{title}</h3>}
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="border border-gray-200 rounded-lg bg-white"
      />
    </div>
  );
}
