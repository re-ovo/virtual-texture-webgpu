"use client";

import { initContext } from "@/renderer/context";
import { startRendering } from "@/renderer/rendering";
import { useEffect, useRef } from "react";

export default function Renderer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Initialize context and start rendering
      initContext(canvas).then((context) => {
        startRendering(context);
      });
    }
  }, []);

  return <canvas className="w-full h-full" ref={canvasRef} />;
}
