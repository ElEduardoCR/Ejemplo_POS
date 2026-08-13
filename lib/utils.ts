// Utilidades varias

export const fmtMoney = (n: number): string =>
  "$" +
  Number(n || 0).toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const fmtNum = (n: number): string =>
  Number(n || 0).toLocaleString("es-MX");

export const fmtFechaCorta = (iso: string): string => {
  if (!iso) return "--";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("es-MX", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  } catch {
    return iso;
  }
};

export const fmtFechaHora = (iso: string): string => {
  if (!iso) return "--";
  try {
    const d = new Date(iso);
    return d.toLocaleString("es-MX", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
};

export const fmtFecha = (yyyyMmDd: string): string => {
  if (!yyyyMmDd) return "--";
  try {
    const d = new Date(yyyyMmDd + "T00:00:00");
    return d.toLocaleDateString("es-MX", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  } catch {
    return yyyyMmDd;
  }
};

export const nowSandboxISO = (fecha: string, hora: string): string => {
  // Devuelve ISO con la fecha+hora del sandbox en la zona local
  return new Date(`${fecha}T${hora}:00`).toISOString();
};

export const generarFolioVenta = (): string => {
  const stamp = new Date()
    .toISOString()
    .replace(/[-:T.Z]/g, "")
    .slice(0, 14);
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `V-${stamp}-${rand}`;
};

// Selecciona un item aleatorio de una lista
export const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Selecciona con pesos
export const pickWeighted = <T,>(items: T[], weights: number[]): T => {
  const total = weights.reduce((s, w) => s + w, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
};
