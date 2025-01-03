import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { UserPreferences } from "@/types/preferences"

interface GeneralPreferencesProps {
  preferences: UserPreferences;
  onChange: (key: keyof UserPreferences, value: boolean) => void;
  disabled?: boolean;
}

export function GeneralPreferences({
  preferences,
  onChange,
  disabled
}: GeneralPreferencesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Preferences</CardTitle>
        <CardDescription>Manage your general preferences and settings</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* Security Section */}
        <div>
          <h3 className="text-lg font-medium">Security</h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="login_alerts">Login Alerts</Label>
              <Switch
                id="login_alerts"
                checked={preferences.login_alerts}
                onCheckedChange={(checked) => onChange('login_alerts', checked)}
                disabled={disabled}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="failed_attempt_alerts">Failed Login Attempt Alerts</Label>
              <Switch
                id="failed_attempt_alerts"
                checked={preferences.failed_attempt_alerts}
                onCheckedChange={(checked) => onChange('failed_attempt_alerts', checked)}
                disabled={disabled}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="two_factor_auth">Two Factor Authentication</Label>
              <Switch
                id="two_factor_auth"
                checked={preferences.two_factor_auth}
                onCheckedChange={(checked) => onChange('two_factor_auth', checked)}
                disabled={disabled}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Usage Section */}
        <div>
          <h3 className="text-lg font-medium">Usage</h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="quota_alerts">Quota Alerts</Label>
              <Switch
                id="quota_alerts"
                checked={preferences.quota_alerts}
                onCheckedChange={(checked) => onChange('quota_alerts', checked)}
                disabled={disabled}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="usage_reports">Usage Reports</Label>
              <Switch
                id="usage_reports"
                checked={preferences.usage_reports}
                onCheckedChange={(checked) => onChange('usage_reports', checked)}
                disabled={disabled}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="rate_limit_alerts">Rate Limit Alerts</Label>
              <Switch
                id="rate_limit_alerts"
                checked={preferences.rate_limit_alerts}
                onCheckedChange={(checked) => onChange('rate_limit_alerts', checked)}
                disabled={disabled}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Templates Section */}
        <div>
          <h3 className="text-lg font-medium">Templates</h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="template_versioning">Template Versioning</Label>
              <Switch
                id="template_versioning"
                checked={preferences.template_versioning}
                onCheckedChange={(checked) => onChange('template_versioning', checked)}
                disabled={disabled}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="template_autosave">Template Autosave</Label>
              <Switch
                id="template_autosave"
                checked={preferences.template_autosave}
                onCheckedChange={(checked) => onChange('template_autosave', checked)}
                disabled={disabled}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="template_change_alerts">Template Change Alerts</Label>
              <Switch
                id="template_change_alerts"
                checked={preferences.template_change_alerts}
                onCheckedChange={(checked) => onChange('template_change_alerts', checked)}
                disabled={disabled}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* SMTP Section */}
        <div>
          <h3 className="text-lg font-medium">SMTP</h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="smtp_failure_alerts">SMTP Failure Alerts</Label>
              <Switch
                id="smtp_failure_alerts"
                checked={preferences.smtp_failure_alerts}
                onCheckedChange={(checked) => onChange('smtp_failure_alerts', checked)}
                disabled={disabled}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="smtp_performance_alerts">SMTP Performance Alerts</Label>
              <Switch
                id="smtp_performance_alerts"
                checked={preferences.smtp_performance_alerts}
                onCheckedChange={(checked) => onChange('smtp_performance_alerts', checked)}
                disabled={disabled}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="delivery_status_alerts">Delivery Status Alerts</Label>
              <Switch
                id="delivery_status_alerts"
                checked={preferences.delivery_status_alerts}
                onCheckedChange={(checked) => onChange('delivery_status_alerts', checked)}
                disabled={disabled}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Marketing Section */}
        <div>
          <h3 className="text-lg font-medium">Marketing</h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="marketing_emails">Marketing Emails</Label>
              <Switch
                id="marketing_emails"
                checked={preferences.marketing_emails}
                onCheckedChange={(checked) => onChange('marketing_emails', checked)}
                disabled={disabled}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="product_updates">Product Updates</Label>
              <Switch
                id="product_updates"
                checked={preferences.product_updates}
                onCheckedChange={(checked) => onChange('product_updates', checked)}
                disabled={disabled}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="maintenance_alerts">Maintenance Alerts</Label>
              <Switch
                id="maintenance_alerts"
                checked={preferences.maintenance_alerts}
                onCheckedChange={(checked) => onChange('maintenance_alerts', checked)}
                disabled={disabled}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
