export default function Icon({ name, size = 22, className = '' }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontSize: size, width: size, height: size }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
