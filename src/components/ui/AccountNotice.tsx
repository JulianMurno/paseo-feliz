import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleInfo } from "@fortawesome/free-solid-svg-icons";

// Aviso que se muestra en el inicio tras eliminar la cuenta (?cuenta=...).
export function AccountNotice({ status }: { status?: string }) {
  if (!status) return null;

  const messages: Record<string, { icon: typeof faCircleCheck; text: string }> = {
    eliminada: {
      icon: faCircleCheck,
      text: "Tu cuenta se eliminó por completo. ¡Esperamos verte de nuevo pronto! 🐾",
    },
    "datos-eliminados": {
      icon: faCircleInfo,
      text: "Tus datos se eliminaron y se cerró tu sesión. (Para borrar también la cuenta de autenticación, configura SUPABASE_SERVICE_ROLE_KEY).",
    },
    "demo-eliminada": {
      icon: faCircleInfo,
      text: "Modo demo: simulamos la eliminación de la cuenta. Configura Supabase para una cuenta real.",
    },
  };

  const msg = messages[status];
  if (!msg) return null;

  return (
    <div className="border-b border-primary/20 bg-primary/5">
      <div className="container-px flex items-center gap-3 py-3 text-sm font-semibold text-primary">
        <FontAwesomeIcon icon={msg.icon} />
        {msg.text}
      </div>
    </div>
  );
}
