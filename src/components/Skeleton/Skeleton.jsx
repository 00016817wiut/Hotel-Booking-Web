import "./Skeleton.css";

const Skeleton = ({ className = "", style }) => {
  return <div className={`skel ${className}`.trim()} style={style} aria-hidden="true" />;
};

export default Skeleton;
