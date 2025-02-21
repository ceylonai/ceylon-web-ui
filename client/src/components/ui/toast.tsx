import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react"
import { toast } from "sonner"

interface ToastProps {
  message: string
  description?: string
}

const toastStyles = {
  success: {
    className: "bg-white border-l-4 border-green-500 text-green-600",
    icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  },
  error: {
    className: "bg-white border-l-4 border-red-500 text-red-600",
    icon: <XCircle className="h-5 w-5 text-red-500" />,
  },
  warning: {
    className: "bg-white border-l-4 border-yellow-500 text-yellow-600",
    icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
  },
  info: {
    className: "bg-white border-l-4 border-blue-500 text-blue-600",
    icon: <Info className="h-5 w-5 text-blue-500" />,
  },
}

export const showToast = {
  success: ({ message, description }: ToastProps) => {
    toast(message, {
      description,
      ...toastStyles.success,
    })
  },
  error: ({ message, description }: ToastProps) => {
    toast(message, {
      description,
      ...toastStyles.error,
    })
  },
  warning: ({ message, description }: ToastProps) => {
    toast(message, {
      description,
      ...toastStyles.warning,
    })
  },
  info: ({ message, description }: ToastProps) => {
    toast(message, {
      description,
      ...toastStyles.info,
    })
  },
}

