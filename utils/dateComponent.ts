import { formatDistanceToNowStrict, differenceInDays, parseISO } from "date-fns";

// Helper to trim microseconds and parse as UTC ISO
const sanitizeDate = (dateStr: string) => {
    const trimmed = dateStr.slice(0, 23); // trims microseconds to milliseconds
    const utcDate = parseISO(trimmed);   // parses in UTC
    return new Date(utcDate.getTime() + new Date().getTimezoneOffset() * -60000); // convert to local
};

export const getJobTimeInfo = (createdAt: string, expiresAt: string) => {
    const created = sanitizeDate(createdAt); // UTC → local
    const expires = sanitizeDate(expiresAt); // UTC → local

    const posted = formatDistanceToNowStrict(created, { addSuffix: true });

    const daysLeft = differenceInDays(expires, new Date());

    const expiresText =
        daysLeft > 0
            ? `in ${daysLeft} days`
            : daysLeft === 0
                ? "today"
                : `expired ${Math.abs(daysLeft)} days ago`;

    return {
        posted,
        expires: expiresText,
    };
};
