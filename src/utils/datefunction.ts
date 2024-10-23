export const formatDate = (date: Date | null): string => {
    try {
        if (!date) return '';
        const normalizedDate = new Date(date);
        normalizedDate.setHours(12, 0, 0, 0);
        return normalizedDate.toISOString().substring(0, 10);
    } catch (error) {
        return '';
    }
};

