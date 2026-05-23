import { Alert, Snackbar, type AlertColor } from '@mui/material'
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { NotificationContext } from './notificationContext'

type Notification = {
  message: string
  severity: AlertColor
}

type NotificationProviderProps = {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notification, setNotification] = useState<Notification | null>(null)

  const notify = useCallback((message: string, severity: AlertColor = 'success') => {
    setNotification({ message, severity })
  }, [])

  const value = useMemo(() => ({ notify }), [notify])

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        open={Boolean(notification)}
        autoHideDuration={3600}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        onClose={() => setNotification(null)}
      >
        <Alert
          severity={notification?.severity ?? 'success'}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2 }}
          onClose={() => setNotification(null)}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  )
}
