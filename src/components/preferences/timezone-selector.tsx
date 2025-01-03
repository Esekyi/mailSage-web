import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { timezones } from "@/lib/timezones" // We'll create this

interface TimezoneSelectorProps {
  timezone: string;
  onChange: (timezone: string) => void;
  disabled?: boolean;
}

export function TimezoneSelector({
  timezone,
  onChange,
  disabled
}: TimezoneSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Timezone</CardTitle>
        <CardDescription>Select your timezone for accurate time display</CardDescription>
      </CardHeader>
      <CardContent>
        <Select
          value={timezone}
          onValueChange={onChange}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select timezone" />
          </SelectTrigger>
          <SelectContent>
            {timezones.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}
