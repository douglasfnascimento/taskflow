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
      bg: "bg-blue-600",
      hover: "hover:bg-blue-700",
      textColor: "text-white",
    },
    red: {
      bg: "bg-red-500",
      hover: "hover:bg-red-600",
      textColor: "text-white",
    },
    green: {
      bg: "bg-emerald-600",
      hover: "hover:bg-emerald-700",
      textColor: "text-white",
    },
    white: {
      bg: "bg-white border border-gray-300",
      hover: "hover:bg-gray-50",
      textColor: "text-gray-700",
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
        currentColor.textColor,
        "min-w-max h-10 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm text-sm",
        "transition-colors duration-200 focus:outline-none font-semibold whitespace-nowrap"
      )}
    >
      <span>{text}</span>
      {Icon && <Icon className="w-4.5 h-4.5 font-semibold" />}
    </button>
  );
}
