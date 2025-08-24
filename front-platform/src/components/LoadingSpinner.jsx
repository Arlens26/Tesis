import React from "react"

export function LoadingSpinner({ 
  label = "Cargando...", 
  size = "default", 
  className = "",
  showLabel = true 
}) {
  const sizeClasses = {
    small: "w-24 h-1.5",
    default: "w-36 h-2",
    large: "w-48 h-3"
  }

  const paddingClasses = {
    small: "py-4",
    default: "py-8", 
    large: "py-12"
  }

  return (
    <div className={`flex flex-col items-center justify-center ${paddingClasses[size]} ${className}`}>
      <div className="w-full flex justify-center">
        <div className={`relative ${sizeClasses[size]} bg-gray-200 rounded-full overflow-hidden`}>
          <div 
            className="absolute left-0 top-0 h-full bg-primary rounded-full animate-loading-bar" 
            style={{ width: '40%' }} 
          />
        </div>
      </div>
      {showLabel && (
        <span className="mt-3 text-sm text-gray-700 font-medium">{label}</span>
      )}
      <style>{`
        @keyframes loading-bar {
          0% { left: -40%; width: 40%; }
          50% { left: 30%; width: 60%; }
          100% { left: 100%; width: 40%; }
        }
        .animate-loading-bar {
          animation: loading-bar 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  )
}
