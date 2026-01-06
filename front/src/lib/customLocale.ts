import { es } from "date-fns/locale";

// Meses personalizados (0 = Enero, 11 = Diciembre)
const monthNames = [
  "Jaspe", // Enero
  "Zafiro", // Febrero
  "Ágata", // Marzo
  "Esmeralda", // Abril
  "Ónice", // Mayo
  "Cornalina", // Junio
  "Crisólito", // Julio
  "Berilo", // Agosto
  "Topacio", // Septiembre
  "Crisopraso", // Octubre
  "Jacinto", // Noviembre
  "Amatista", // Diciembre
];

export const zallampalamLocale = {
  ...es,
  localize: {
    ...es.localize,
    month: (n: number) => monthNames[n],

    // Opcional: Si date-fns pide formato largo/corto, podemos ser más específicos:
    // month: (n: number, options?: { width?: string }) => monthNames[n],
  },
};
