import { toast } from 'sonner'
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  Bell,
  Shield,
  AlertOctagon
} from 'lucide-react'
import { createElement } from 'react'

type ToastData = {
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

const defaultOptions = {
  className: 'border-border bg-background text-foreground',
  position: 'top-center' as const,
  duration: 5000,
}

const iconProps = { className: 'h-4 w-4' }

const icons = {
  success: () => createElement(CheckCircle2, iconProps),
  error: () => createElement(XCircle, iconProps),
  info: () => createElement(Info, iconProps),
  warning: () => createElement(AlertTriangle, iconProps),
  critical: () => createElement(AlertOctagon, iconProps),
  alert: () => createElement(Bell, iconProps),
  attention: () => createElement(AlertCircle, iconProps),
  security: () => createElement(Shield, iconProps),
}

export const useToast = () => {
  return {
    success: (messageOrData: string | ToastData) => {
      if (typeof messageOrData === 'string') {
        toast.success(messageOrData, { ...defaultOptions, icon: icons.success() })
      } else {
        const { title, description, ...rest } = messageOrData
        toast.success(title || description || '', {
          ...defaultOptions,
          icon: icons.success(),
          description: title ? description : undefined,
          ...rest
        })
      }
    },
    error: (messageOrData: string | ToastData) => {
      if (typeof messageOrData === 'string') {
        toast.error(messageOrData, { ...defaultOptions, icon: icons.error() })
      } else {
        const { title, description, ...rest } = messageOrData
        toast.error(title || description || '', {
          ...defaultOptions,
          icon: icons.error(),
          description: title ? description : undefined,
          ...rest
        })
      }
    },
    info: (messageOrData: string | ToastData) => {
      if (typeof messageOrData === 'string') {
        toast.info(messageOrData, { ...defaultOptions, icon: icons.info() })
      } else {
        const { title, description, ...rest } = messageOrData
        toast.info(title || description || '', {
          ...defaultOptions,
          icon: icons.info(),
          description: title ? description : undefined,
          ...rest
        })
      }
    },
    warning: (messageOrData: string | ToastData) => {
      if (typeof messageOrData === 'string') {
        toast.warning(messageOrData, { ...defaultOptions, icon: icons.warning() })
      } else {
        const { title, description, ...rest } = messageOrData
        toast.warning(title || description || '', {
          ...defaultOptions,
          icon: icons.warning(),
          description: title ? description : undefined,
          ...rest
        })
      }
    },
    critical: (messageOrData: string | ToastData) => {
      if (typeof messageOrData === 'string') {
        toast.error(messageOrData, { ...defaultOptions, icon: icons.critical() })
      } else {
        const { title, description, ...rest } = messageOrData
        toast.error(title || description || '', {
          ...defaultOptions,
          icon: icons.critical(),
          description: title ? description : undefined,
          ...rest
        })
      }
    },
    alert: (messageOrData: string | ToastData) => {
      if (typeof messageOrData === 'string') {
        toast(messageOrData, { ...defaultOptions, icon: icons.alert() })
      } else {
        const { title, description, ...rest } = messageOrData
        toast(title || description || '', {
          ...defaultOptions,
          icon: icons.alert(),
          description: title ? description : undefined,
          ...rest
        })
      }
    },
    attention: (messageOrData: string | ToastData) => {
      if (typeof messageOrData === 'string') {
        toast(messageOrData, { ...defaultOptions, icon: icons.attention() })
      } else {
        const { title, description, ...rest } = messageOrData
        toast(title || description || '', {
          ...defaultOptions,
          icon: icons.attention(),
          description: title ? description : undefined,
          ...rest
        })
      }
    },
    security: (messageOrData: string | ToastData) => {
      if (typeof messageOrData === 'string') {
        toast(messageOrData, { ...defaultOptions, icon: icons.security() })
      } else {
        const { title, description, ...rest } = messageOrData
        toast(title || description || '', {
          ...defaultOptions,
          icon: icons.security(),
          description: title ? description : undefined,
          ...rest
        })
      }
    }
  }
}
