// components/Modal.jsx
export default function Modal({ onClose, children }) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded shadow-lg p-6 max-w-3xl w-full relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
          {children}
        </div>
      </div>
    );
  }