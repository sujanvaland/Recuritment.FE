import { formatDistanceToNowStrict, differenceInDays } from "date-fns"

// Helper to trim microseconds to milliseconds
const sanitizeDate = (dateStr: string) => {
    // Only keep up to 3 digits in the fractional seconds
    return new Date(dateStr.replace(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3})\d*$/, "$1"));
};

export const getJobTimeInfo = (createdAt: string, expiresAt: string) => {
    const created = sanitizeDate(createdAt);
    const expires = sanitizeDate(expiresAt);

    const posted = formatDistanceToNowStrict(created, {
        addSuffix: true,
    });

    const daysToExpire = differenceInDays(expires, created);

    return {
        posted,
        expires: `${daysToExpire} days`,
    };
};