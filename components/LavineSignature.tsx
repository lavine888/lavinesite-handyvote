"use client";

export default function LavineSignature() {
  return (
    <>
      <aside className="lavine-signature" aria-label="Lavine identity markers">
        <div className="lavine-signature__axis">
          <span>MATH</span>
          <i />
          <span>CS</span>
          <i />
          <span>AI PRODUCT</span>
        </div>
        <div className="lavine-signature__statement">
          <small>OPERATING PRINCIPLE</small>
          <strong>BUILD → TEST → SHIP</strong>
          <p>Product lead with builder instincts.</p>
        </div>
        <div className="lavine-signature__coords">
          <span>HONG KONG</span>
          <b>↔</b>
          <span>SHENZHEN</span>
        </div>
      </aside>

      <style>{`
        .lavine-signature {
          position: fixed;
          z-index: 15;
          left: 34px;
          top: 82px;
          bottom: 34px;
          width: 220px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          pointer-events: none;
          font-family: var(--mono);
          mix-blend-mode: screen;
        }
        .lavine-signature__axis {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(237,244,255,.34);
          font-size: 8px;
          letter-spacing: .15em;
          transform: rotate(-90deg) translateX(-100%);
          transform-origin: left top;
          width: max-content;
        }
        .lavine-signature__axis i {
          display: block;
          width: 24px;
          height: 1px;
          background: linear-gradient(90deg, rgba(214,168,90,.15), rgba(214,168,90,.8));
        }
        .lavine-signature__axis span:last-child { color: rgba(214,168,90,.85); }
        .lavine-signature__statement {
          margin-left: 2px;
          max-width: 190px;
          opacity: .72;
        }
        .lavine-signature__statement small {
          display: block;
          margin-bottom: 7px;
          color: rgba(214,168,90,.78);
          font-size: 8px;
          letter-spacing: .15em;
        }
        .lavine-signature__statement strong {
          display: block;
          color: rgba(237,244,255,.82);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: .08em;
        }
        .lavine-signature__statement p {
          margin: 6px 0 0;
          color: rgba(133,145,170,.72);
          font: 400 8px/1.45 var(--mono);
          letter-spacing: .04em;
        }
        .lavine-signature__coords {
          display: flex;
          align-items: center;
          gap: 7px;
          color: rgba(237,244,255,.34);
          font-size: 8px;
          letter-spacing: .13em;
        }
        .lavine-signature__coords b { color: rgba(214,168,90,.72); font-weight: 400; }
        @media (max-width: 1023px), (hover: none), (pointer: coarse) {
          .lavine-signature { display: none; }
        }
      `}</style>
    </>
  );
}
