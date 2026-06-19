// Configuración de Font Awesome para Next.js (App Router).
// Evita el "flash" de iconos gigantes deshabilitando la auto-inserción de CSS,
// ya que importamos el CSS manualmente en el layout.
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

config.autoAddCss = false;
