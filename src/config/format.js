export const limitText = (text) => {
    if (text.length > 10) {
        return text.substr(0, 10) + '...';
    } else {
        return text;
    }
};
