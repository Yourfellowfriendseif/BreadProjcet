// New LoadingSpinner.jsx component
export default function LoadingSpinner({ size = "default" }) {
  const sizeClasses = size === "sm" ? "h-4 w-4" : "h-8 w-8";
  
  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-blue-500 ${sizeClasses}`}></div>
    </div>
  );
}