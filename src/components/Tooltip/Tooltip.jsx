import "./Tooltip.css";

const Tooltip = ({ text, children, maxWidth = 360 }) => {
  if (!text) return children;

  return (
    <span className="tip" tabIndex={0}>
      {children}
      <span className="tip__bubble" role="tooltip" style={{ maxWidth }}>
        {text}
      </span>
    </span>
  );
};

export default Tooltip;
