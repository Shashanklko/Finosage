/**
 * Indian Currency Formatter
 * Follows the Indian numbering system:
 *   < ₹1,000        → ₹999
 *   ₹1,000–99,999   → ₹1K – ₹99.9K
 *   ₹1,00,000–99,99,999 → ₹1L – ₹99.9L
 *   ≥ ₹1,00,00,000  → ₹1Cr – ₹X.XCr
 */

export const formatINR = (value) => {
    if (value == null || isNaN(value)) return '₹0';
    const abs = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    if (abs >= 1_00_00_000) {
        // Crores  (1,00,00,000+)
        const cr = abs / 1_00_00_000;
        return `${sign}₹${cr >= 100 ? cr.toFixed(0) : cr.toFixed(1)} Cr`;
    }
    if (abs >= 1_00_000) {
        // Lakhs  (1,00,000 – 99,99,999)
        const lakh = abs / 1_00_000;
        return `${sign}₹${lakh >= 100 ? lakh.toFixed(0) : lakh.toFixed(1)} L`;
    }
    if (abs >= 1_000) {
        // Thousands (1,000 – 99,999)
        const k = abs / 1_000;
        return `${sign}₹${k >= 100 ? k.toFixed(0) : k.toFixed(1)}K`;
    }
    // Below 1,000
    return `${sign}₹${Math.round(abs)}`;
};

/**
 * Compact variant for chart Y-axis labels (shorter)
 */
export const formatINRShort = (value) => {
    if (value == null || isNaN(value)) return '₹0';
    const abs = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    if (abs >= 1_00_00_000) return `${sign}₹${(abs / 1_00_00_000).toFixed(1)}Cr`;
    if (abs >= 1_00_000) return `${sign}₹${(abs / 1_00_000).toFixed(0)}L`;
    if (abs >= 1_000) return `${sign}₹${(abs / 1_000).toFixed(0)}K`;
    return `${sign}₹${Math.round(abs)}`;
};
