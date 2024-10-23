export const formatDateToISODate = (date: Date): string => {
    try {
        return date.toISOString().substring(0, 10);
    } catch (error) {
        return '';
    }
};
