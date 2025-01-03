"use client"

import { createContext, useContext, useEffect } from "react"
import { usePreferences } from "@/hooks/usePreferences"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(utc)
dayjs.extend(timezone)

interface TimezoneContextType {
  timezone: string
  formatDate: (date: Date | string, format?: string) => string
}

const TimezoneContext = createContext<TimezoneContextType>({
  timezone: "UTC",
  formatDate: () => "",
})

export function TimezoneProvider({ children }: { children: React.ReactNode }) {
  const { preferences } = usePreferences()
  const userTimezone = preferences?.timezone || "UTC"

  useEffect(() => {
    dayjs.tz.setDefault(userTimezone)
  }, [userTimezone])

  const formatDate = (date: Date | string, format = "YYYY-MM-DD HH:mm:ss") => {
    return dayjs(date).tz(userTimezone).format(format)
  }

  return (
    <TimezoneContext.Provider value={{ timezone: userTimezone, formatDate }}>
      {children}
    </TimezoneContext.Provider>
  )
}

export const useTimezone = () => useContext(TimezoneContext)
