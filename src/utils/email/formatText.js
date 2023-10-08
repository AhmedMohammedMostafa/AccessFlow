/**
 * Replaces placeholders in a text string with corresponding values from a data object.
 * @param {string} text - The text string containing placeholders to be replaced.
 * @param {Object} data - The data object containing key-value pairs to replace placeholders.
 * @returns {string} - The formatted text string with replaced placeholders.
 * @throws {TypeError} - If the text parameter is not a string or the data parameter is not an object.
 */
export const formatText = (text, data) => {
    if (typeof text !== 'string') {
        throw new TypeError('The text parameter must be a string.');
    }
    if (typeof data !== 'object' || data === null) {
        throw new TypeError('The data parameter must be an object.');
    }
    let formattedText = text;
    for (let key in data) {
        formattedText = formattedText.replace(new RegExp(`{${key}}`, 'g'), data[key]);
    }
    return formattedText;
}