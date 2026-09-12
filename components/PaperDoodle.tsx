"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

type Point = { x: number; y: number; t: number };
type Stroke = { id: string; color: string; width: number; points: Point[] };

const DRAFT_KEY = "lavine:paper-doodle:draft";
const SAVE_DELAY = 500;
const COLORS = ["#264653", "#1d3557", "#e63946", "#2a9d8f", "#e76f51", "#7a5c3e", "#6d6875", "#343b32"] as const;
const WIDTHS = [0.008, 0.016, 0.03] as const;
const ERASER = "__eraser__";

function validDraft(value: unknown): value is Stroke[] {
  if (!Array.isArray(value)) return false;
  return value.every((stroke) => {
    if (typeof stroke !== "object" || stroke === null) return false;
    const item = stroke as Record<string, unknown>;
    return typeof item.id === "string" && typeof item.color === "string" &&
      typeof item.width === "number" && Array.isArray(item.points) &&
      item.points.every((point) => {
        if (typeof point !== "object" || point === null) return false;
        const p = point as Record<string, unknown>;
        return typeof p.x === "number" && typeof p.y === "number" && typeof p.t === "number";
      });
  });
}

function readDraft(): Stroke[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return validDraft(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeDraft(strokes: Stroke[]): void {
  try { window.localStorage.setItem(DRAFT_KEY, JSON.stringify(strokes)); } catch { /* private mode */ }
}

function drawStroke(ctx: CanvasRenderingContext2D, stroke: Stroke, width: number, height: number): void {
  if (stroke.points.length === 0) return;
  ctx.globalCompositeOperation = stroke.color === ERASER ? "destination-out" : "source-over";
  ctx.strokeStyle = stroke.color === ERASER ? "#000" : stroke.color;
  ctx.lineWidth = Math.max(1.25, stroke.width * Math.min(width, height));
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const first = stroke.points[0];
  if (stroke.points.length === 1) {
    ctx.beginPath();
    ctx.arc(first.x * width, first.y * height, ctx.lineWidth / 2, 0, Math.PI * 2);
    ctx.fillStyle = stroke.color === ERASER ? "#000" : stroke.color;
    ctx.fill();
    return;
  }
  ctx.beginPath();
  ctx.moveTo(first.x * width, first.y * height);
  for (const point of stroke.points.slice(1)) ctx.lineTo(point.x * width, point.y * height);
  ctx.stroke();
}

function redraw(canvas: HTMLCanvasElement, strokes: Stroke[]): void {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (width <= 0 || height <= 0) return;
  const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
  const deviceWidth = Math.max(1, Math.round(width * dpr));
  const deviceHeight = Math.max(1, Math.round(height * dpr));
  if (canvas.width !== deviceWidth) canvas.width = deviceWidth;
  if (canvas.height !== deviceHeight) canvas.height = deviceHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, deviceWidth, deviceHeight);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  for (const stroke of strokes) drawStroke(ctx, stroke, width, height);
  ctx.globalCompositeOperation = "source-over";
}

/** Full-sheet transparent drawing layer with a compact floating tool bar. */
export default function PaperDoodle() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentRef = useRef<Stroke | null>(null);
  const latestStrokesRef = useRef<Stroke[]>([]);
  const touchedRef = useRef(false);
  const [strokes, setStrokes] = useState<Stroke[]>(readDraft);
  const [current, setCurrent] = useState<Stroke | null>(null);
  const [past, setPast] = useState<Stroke[][]>([]);
  const [future, setFuture] = useState<Stroke[][]>([]);
  const [color, setColor] = useState<string>(COLORS[0]);
  const [width, setWidth] = useState<number>(WIDTHS[1]);
  const [erasing, setErasing] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const paint = () => redraw(canvas, current ? [...strokes, current] : strokes);
    paint();
    const observer = new ResizeObserver(paint);
    observer.observe(root);
    return () => observer.disconnect();
  }, [strokes, current]);

  useEffect(() => {
    latestStrokesRef.current = strokes;
  }, [strokes]);

  useEffect(() => {
    if (!touchedRef.current) return;
    const timer = window.setTimeout(() => writeDraft(strokes), SAVE_DELAY);
    return () => window.clearTimeout(timer);
  }, [strokes]);

  useEffect(() => () => {
    if (touchedRef.current) writeDraft(latestStrokesRef.current);
  }, []);

  const localPoint = (event: ReactPointerEvent<HTMLCanvasElement>): Point => {
    const target = event.currentTarget;
    const native = event.nativeEvent;
    let x = native.offsetX;
    let y = native.offsetY;
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      const rect = target.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    }
    return {
      x: Math.max(0, Math.min(1, x / Math.max(1, target.clientWidth))),
      y: Math.max(0, Math.min(1, y / Math.max(1, target.clientHeight))),
      t: Date.now(),
    };
  };

  const finish = () => {
    const stroke = currentRef.current;
    if (!stroke) return;
    currentRef.current = null;
    touchedRef.current = true;
    setCurrent(null);
    setPast((items) => [...items, strokes]);
    setFuture([]);
    setStrokes((items) => [...items, stroke]);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (event.button !== 0 || currentRef.current) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const stroke: Stroke = {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`,
      color: erasing ? ERASER : color,
      width,
      points: [localPoint(event)],
    };
    currentRef.current = stroke;
    setCurrent(stroke);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const stroke = currentRef.current;
    if (!stroke) return;
    event.preventDefault();
    const next = { ...stroke, points: [...stroke.points, localPoint(event)] };
    currentRef.current = next;
    setCurrent(next);
  };

  const clear = () => {
    if (strokes.length === 0) return;
    touchedRef.current = false;
    setPast((items) => [...items, strokes]);
    setFuture([]);
    setStrokes([]);
    try { window.localStorage.removeItem(DRAFT_KEY); } catch { /* private mode */ }
  };

  const undo = () => {
    const previous = past[past.length - 1];
    if (!previous) return;
    touchedRef.current = true;
    setFuture((items) => [...items, strokes]);
    setPast((items) => items.slice(0, -1));
    setStrokes(previous);
  };

  const redo = () => {
    const next = future[future.length - 1];
    if (!next) return;
    touchedRef.current = true;
    setPast((items) => [...items, strokes]);
    setFuture((items) => items.slice(0, -1));
    setStrokes(next);
  };

  const stopToolbarEvent = (event: ReactPointerEvent<HTMLButtonElement>) => event.stopPropagation();

  return (
    <div ref={rootRef} className="reference-paper-drawing" aria-label="Paper drawing layer">
      <canvas
        ref={canvasRef}
        className="reference-paper-drawing-canvas"
        aria-label="Draw anywhere on the paper"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finish}
        onPointerCancel={finish}
      />
      <div className={`reference-paper-tools${toolsOpen ? " is-open" : ""}`} role={toolsOpen ? "toolbar" : undefined} aria-label={toolsOpen ? "Drawing tools" : undefined}>
        {toolsOpen && <div className="reference-paper-tools-row">
          {COLORS.map((item) => (
            <button key={item} type="button" className="reference-paper-tool color" aria-label={`Brush color ${item}`} aria-pressed={!erasing && color === item} onPointerDown={stopToolbarEvent} onClick={() => { setColor(item); setErasing(false); }} style={{ backgroundColor: item }} />
          ))}
          {WIDTHS.map((item, index) => (
            <button key={item} type="button" className="reference-paper-tool width" aria-label={`Brush size ${index + 1}`} aria-pressed={!erasing && width === item} onPointerDown={stopToolbarEvent} onClick={() => { setWidth(item); setErasing(false); }}><i style={{ width: `${6 + index * 5}px`, height: `${6 + index * 5}px` }} /></button>
          ))}
          <button type="button" className={`reference-paper-tool text${erasing ? " selected" : ""}`} aria-label="Eraser" aria-pressed={erasing} onPointerDown={stopToolbarEvent} onClick={() => setErasing((value) => !value)}>⌫</button>
          <button type="button" className="reference-paper-tool text" aria-label="Undo" disabled={past.length === 0} onPointerDown={stopToolbarEvent} onClick={undo}>↶</button>
          <button type="button" className="reference-paper-tool text" aria-label="Redo" disabled={future.length === 0} onPointerDown={stopToolbarEvent} onClick={redo}>↷</button>
          <button type="button" className="reference-paper-tool text" aria-label="Clear drawing" disabled={strokes.length === 0} onPointerDown={stopToolbarEvent} onClick={clear}>×</button>
        </div>}
        <button type="button" className="reference-paper-tools-toggle" aria-expanded={toolsOpen} aria-label={toolsOpen ? "Hide drawing tools" : "Show drawing tools"} onPointerDown={stopToolbarEvent} onClick={() => setToolsOpen((value) => !value)}>{toolsOpen ? "−" : "+"}</button>
      </div>
    </div>
  );
}
