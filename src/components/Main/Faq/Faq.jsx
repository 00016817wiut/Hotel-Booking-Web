import "./Faq.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { faqItems } from "../../../utils/base";

const Faq = () => {
  const [openKey, setOpenKey] = useState(null);
  const rootRef = useRef(null);
  const [visible, setVisible] = useState(false);

  const items = useMemo(() => Array.isArray(faqItems) ? faqItems : [], []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (hit) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className={`faq${visible ? " faq--visible" : ""}`} id="faq" ref={rootRef}>
      <div className="faq__header">
        <p className="faq__eyebrow">FAQ</p>
        <h1>Часто задаваемые вопросы</h1>
        <p>Собрали ответы на самые частые вопросы о размещении, расположении и бронировании.</p>
      </div>

      <div className="faq__list">
        {items.map((item, idx) => {
          const key = String(item?.question || idx);
          const isOpen = openKey === key;
          return (
            <div className={`faq__item${isOpen ? " faq__item--open" : ""}`} key={key} style={{ "--i": idx }}>
              <button
                type="button"
                className="faq__summary"
                aria-expanded={isOpen}
                onClick={() => setOpenKey((prev) => (prev === key ? null : key))}
              >
                <span className="faq__q">{item.question}</span>
                <span className="faq__icon" aria-hidden="true" />
              </button>
              <div className="faq__panel" role="region" aria-hidden={!isOpen}>
                <div className="faq__panel-inner">
                  <p>{item.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Faq;
