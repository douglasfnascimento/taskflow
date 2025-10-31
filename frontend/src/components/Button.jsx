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
      textColor: "text-white",
    },
    red: {
      bg: "bg-red-800",
      hover: "hover:bg-red-500",
      textColor: "text-white",
    },
    green: {
      bg: "bg-green-800",
      hover: "hover:bg-green-500",
      textColor: "text-white",
    },
    white: {
      bg: "bg-white",
      hover: "hover:bg-gray-300",
      textColor: "text-blue-800",
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
        "min-w-max py-1 px-3 rounded-xl flex items-center gap-2 cursor-pointer",
        "transition-colors duration-200 focus:outline-none font-semibold"
      )}
    >
      <span>{text}</span>
      {Icon && <Icon className="w-4 h-4 font-semibold" />}
    </button>
  );
}
