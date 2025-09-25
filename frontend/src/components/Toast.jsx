import clsx from "clsx";

export default function Toast({ isVisible, message, type }) {
  return (
    <>
      {isVisible && (
        <div
          className={clsx(
            "fixed top-5 right-5 z-50 px-4 py-2 rounded-xl shadow-lg border transition-transform transform duration-300 ease-out",
            type === "success" && "bg-green-600 border-green-700 text-white",
            type === "error" && "bg-red-600 border-red-700 text-white",
            type === "warning" && "bg-yellow-600 border-yellow-600 text-white",
            !type && "bg-blue-500 border-blue-600 text-white"
          )}
        >
          {message}
        </div>
      )}
    </>
  );
}
