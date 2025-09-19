export function capitalizeWords(input: string): string {
    return input
        .split(" ")
        .map(
            word =>
                word.charAt(0).toUpperCase() +
                word.slice(1).toLowerCase()
        )
        .join(" ");
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
