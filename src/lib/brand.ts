/** Product brand display strings (Zakah Advisor / ZA). */
export const PRODUCT_BRAND_NAME = 'Zakah Advisor'
export const PRODUCT_BRAND_SHORT = 'ZA'

/** Map legacy role labels from the API to current brand display names. */
export const ROLE_DISPLAY_LABELS: Record<string, string> = {
    'MG Admin': 'ZA Admin',
}

export function formatRoleLabel(role: string): string {
    return ROLE_DISPLAY_LABELS[role] ?? role
}
