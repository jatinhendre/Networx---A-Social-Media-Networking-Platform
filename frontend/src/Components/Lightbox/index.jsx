import React, { useState, useEffect } from "react";
import styles from "./lightbox.module.css";
import { ZoomIn, ZoomOut, RotateCcw, X } from "lucide-react";

export default function Lightbox({ src, onClose }) {
  const [scale, setScale] = useState(1);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!src) return null;

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 4));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleReset = () => {
    setScale(1);
  };

  const handleWheel = (e) => {
    // Zoom on wheel scroll
    if (e.deltaY < 0) {
      setScale((prev) => Math.min(prev + 0.1, 4));
    } else {
      setScale((prev) => Math.max(prev - 0.1, 0.5));
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.controlBar} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.controlBtn}
          onClick={handleZoomIn}
          title="Zoom In"
          aria-label="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
        <button
          className={styles.controlBtn}
          onClick={handleZoomOut}
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
        <button
          className={styles.controlBtn}
          onClick={handleReset}
          title="Reset Zoom"
          aria-label="Reset Zoom"
        >
          <RotateCcw size={18} />
        </button>
        <div className={styles.divider}></div>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          title="Close Lightbox"
          aria-label="Close Lightbox"
        >
          <X size={18} />
        </button>
      </div>

      <div
        className={styles.imageContainer}
        onWheel={handleWheel}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt="Zoomable Lightbox Preview"
          style={{ transform: `scale(${scale})` }}
          className={styles.lightboxImage}
        />
      </div>
    </div>
  );
}
