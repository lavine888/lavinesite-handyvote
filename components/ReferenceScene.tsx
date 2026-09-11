"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { Application } from "./three/Application";
import type { ThreeExperience } from "./three/types";
import "./reference-scene.css";
export type ReferenceSceneApi = ThreeExperience & { screenHost: HTMLDivElement; paperHost: HTMLDivElement; parkingNode: HTMLDivElement };
type Props = { className?: string; screenContent?: ReactNode; paperContent?: ReactNode; onReady?: (api: ReferenceSceneApi | null) => void };
export default function ReferenceScene({ className, screenContent, paperContent, onReady }: Props) {
  const webgl=useRef<HTMLDivElement>(null), css=useRef<HTMLDivElement>(null), paper=useRef<HTMLDivElement>(null), screenHost=useRef<HTMLDivElement>(null), paperHost=useRef<HTMLDivElement>(null), parkingNode=useRef<HTMLDivElement>(null);
  useEffect(() => { if (!webgl.current||!css.current||!paper.current||!screenHost.current||!paperHost.current||!parkingNode.current) return; let app: Application|null=null; try { app=new Application({webglMount:webgl.current,cssMount:css.current,paperMount:paper.current,screenHost:screenHost.current,paperHost:paperHost.current,parkingNode:parkingNode.current,onComputerError:e=>console.error("Reference scene computer error",e),onComputerReady:()=>undefined}); app.start(); onReady?.(Object.assign(app,{screenHost:screenHost.current,paperHost:paperHost.current,parkingNode:parkingNode.current})); } catch(e) { console.error("Reference scene unavailable",e); } return ()=>{onReady?.(null);app?.destroy();}; }, [onReady]);
  return <div ref={webgl} className={`reference-scene ${className??""}`}>
    <div ref={css} className="reference-scene__css" />
    <div ref={paper} className="reference-scene__paper" />
    <div ref={parkingNode} className="reference-scene__parking">
      <div ref={screenHost} id="screen-host" className="reference-scene__host">{screenContent}</div>
      <div ref={paperHost} className="reference-scene__paper-host">{paperContent}</div>
    </div>
  </div>;
}
