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
