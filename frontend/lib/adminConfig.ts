const adminAddressSources = [
    process.env.NEXT_PUBLIC_LOTTO_OWNER,
    process.env.NEXT_PUBLIC_LOTTO_ADMINS,
    process.env.NEXT_PUBLIC_ADMIN_ADDRESS,
    process.env.NEXT_PUBLIC_ADMIN_ADDRESSES,
];

const collectedAddresses = adminAddressSources.reduce<string[]>((accumulator, value) => {
    if (typeof value !== 'string' || value.length === 0) {
        return accumulator;
    }

    const parts = value.split(',');
    for (const part of parts) {
        const trimmed = part.trim();
        if (trimmed.length > 0) {
            accumulator.push(trimmed.toLowerCase());
        }
    }

    return accumulator;
}, []);

const allowedAdminAddresses = Array.from(new Set(collectedAddresses));

export const adminConfig = Object.freeze({
    allowedAdminAddresses,
});

export type AdminConfig = typeof adminConfig;

export { allowedAdminAddresses };

export function isAddressAllowed(address: string | null | undefined): boolean {
    if (!address) {
        return false;
    }

    return allowedAdminAddresses.includes(address.toLowerCase());
}