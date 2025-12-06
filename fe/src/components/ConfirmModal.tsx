import { X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "success" | "info";
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy bỏ",
  type = "info",
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  const getColors = () => {
    switch (type) {
      case "danger":
        return {
          bg: "from-red-500 to-red-600",
          hover: "hover:from-red-600 hover:to-red-700",
          icon: "bg-red-100 text-red-600",
        };
      case "warning":
        return {
          bg: "from-yellow-500 to-orange-500",
          hover: "hover:from-yellow-600 hover:to-orange-600",
          icon: "bg-yellow-100 text-yellow-600",
        };
      case "success":
        return {
          bg: "from-green-500 to-green-600",
          hover: "hover:from-green-600 hover:to-green-700",
          icon: "bg-green-100 text-green-600",
        };
      default:
        return {
          bg: "from-amber-500 to-orange-600",
          hover: "hover:from-amber-600 hover:to-orange-700",
          icon: "bg-amber-100 text-amber-600",
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
        {/* Header */}
        <div className={`bg-gradient-to-r ${colors.bg} p-6`}>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-6 py-3 bg-gradient-to-r ${colors.bg} ${colors.hover} text-white font-semibold rounded-xl shadow-lg transition-all`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
