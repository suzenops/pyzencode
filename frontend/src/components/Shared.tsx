import { Code2 } from "lucide-react";
import { Link } from "react-router-dom";
export function Brand() {
  return (
    <Link to="/" className="brand" aria-label="PyZenCode home">
      <span className="brand-mark">
        <Code2 size={22} />
      </span>
      PyZen<span>Code</span>
    </Link>
  );
}
export function PageTitle({
  label,
  title,
  subtitle,
}: {
  label: string;
  title: string;
  subtitle: string;
}) {
  return (
    <header className="page-heading">
      <span className="eyebrow">{label}</span>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
}
export function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}
