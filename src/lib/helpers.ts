export function capitalizeWords(input: string | undefined): string {
    if (!input) {
        return ''
    }
    return input
        .split(" ")
        .map(
            word =>
                word.charAt(0).toUpperCase() +
                word.slice(1).toLowerCase()
        )
        .join(" ");
}

export function kebabToTitle(input: string): string {
    const sep = String.fromCharCode(45) // hyphen
    const tokens = input
        .trim()
        .split(new RegExp(`[${sep}_\\s]+`, "g"))
        .filter(Boolean)

    return tokens
        .map(t => t.toLowerCase())
        .map(t => t.charAt(0).toUpperCase() + t.slice(1))
        .join(" ")
}

export function formatLabel(key: string): string {
    return key
        // insert space before capital letters
        .replace(/([A-Z])/g, " $1")
        // replace underscores with spaces
        .replace(/_/g, " ")
        // trim spaces
        .trim()
        // capitalize each word
        .replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

export function isValidUrl(
    input: string,
    isHttp: boolean = true
): boolean {
    if (!input || typeof input !== "string") return false;

    try {
        const url = new URL(input);

        if (!url.hostname || url.hostname.trim().length === 0) return false;

        if (isHttp) {
            if (url.protocol !== "http:" && url.protocol !== "https:") return false;
        }

        return true;
    } catch {
        return false;
    }
}

export function formatToReadableWithTZ(
    isoString: string,
    timeZone: string = 'America/New_York'
): string {
    const date = new Date(isoString);

    // 🚨 Invalid date guard
    if (Number.isNaN(date.getTime())) {
        throw new Error(`Invalid date string provided: "${isoString}"`);
    }

    const parts = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone,
        timeZoneName: 'short',
    }).formatToParts(date);

    const get = (type: Intl.DateTimeFormatPartTypes) =>
        parts.find(p => p.type === type)?.value ?? '';

    return `${get('weekday')} / ${get('month')} ${get('day')}, ${get('year')} ${get('hour')}:${get('minute')} ${get('timeZoneName')}`;
}

export function camelCaseToTitle(input: string): string {
    if (!input) return '';

    return input
        // insert space before capital letters
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        // uppercase first letter
        .replace(/^./, (c) => c.toUpperCase());
}

export function isLikelyUrl(input: string): boolean {
    if (!input) return false;

    const value = input.trim();

    // no spaces
    if (/\s/.test(value)) return false;

    try {
        const url = new URL(
            value.startsWith('http') ? value : `https://${value}`
        );

        // hostname must look like a real domain
        return /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(url.hostname);
    } catch {
        return false;
    }
}


export function formatDateToYYYYMMDD(date: Date | undefined): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
