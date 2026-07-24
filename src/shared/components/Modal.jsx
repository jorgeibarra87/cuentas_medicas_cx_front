export default function Modal({ isOpen, onClose, title, children, size = "md" }) {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-[95vw]"
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-300">
            <div
                className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} relative flex flex-col max-h-[90vh]`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <span className="text-xl font-semibold text-gray-800">{title}</span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-4 overflow-y-auto flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}