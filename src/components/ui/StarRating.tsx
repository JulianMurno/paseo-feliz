import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";

interface Props {
  rating: number; // 0-5
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  reviewsCount?: number;
}

const sizeClass = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-lg",
};

// Componente reutilizable de estrellas (con media estrella) usando Font Awesome.
export function StarRating({ rating, showValue = true, size = "md", reviewsCount }: Props) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25 && rating - full < 0.75;
  const roundedUp = rating - full >= 0.75 ? 1 : 0;

  return (
    <span className={`inline-flex items-center gap-1.5 ${sizeClass[size]}`}>
      <span className="text-amber-400">
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < full + roundedUp) {
            return <FontAwesomeIcon key={i} icon={faStarSolid} />;
          }
          if (i === full && hasHalf) {
            return <FontAwesomeIcon key={i} icon={faStarHalfStroke} />;
          }
          return <FontAwesomeIcon key={i} icon={faStarRegular} className="text-amber-400/50" />;
        })}
      </span>
      {showValue && (
        <span className="font-bold text-ink">{rating.toFixed(1)}</span>
      )}
      {typeof reviewsCount === "number" && (
        <span className="text-ink/50">({reviewsCount})</span>
      )}
    </span>
  );
}
