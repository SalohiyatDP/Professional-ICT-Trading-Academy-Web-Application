import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-6xl">🕯️</p>
      <h1 className="mt-4 text-2xl font-bold text-white">Sahifa topilmadi</h1>
      <p className="mt-1 text-muted">Bu daraja hali shakllanmagan.</p>
      <Link to="/" className="btn-primary mt-4">
        Boshqaruv paneliga qaytish
      </Link>
    </div>
  );
}
