import clsx from "clsx";

export default function Button({
  onClick,
  text,
  Icon,
  color = "blue",
  type = "button",
}) {
  const colorMap = {
    blue: {
      bg: "bg-blue-800",
      hover: "hover:bg-blue-500",
      ring: "focus:ring-blue-500",
    },
    red: {
      bg: "bg-red-800",
      hover: "hover:bg-red-500",
      ring: "focus:ring-red-500",
    },
    green: {
      bg: "bg-green-800",
      hover: "hover:bg-green-500",
      ring: "focus:ring-green-500",
    },
  };

  const currentColor = colorMap[color] || colorMap.blue;

  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(
        currentColor.bg,
        currentColor.hover,
        currentColor.ring,
        "w-auto text-white py-1 px-3 rounded-xl flex items-center gap-2 cursor-pointer",
        "transition-colors duration-200 focus:outline-none font-semibold"
      )}
    >
      <span>{text}</span>
      {Icon && <Icon className="w-4 h-4 font-semibold" />}
    </button>
  );
}
