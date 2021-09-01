const TurndownService = require("turndown");
const turndownService = new TurndownService();
const mayukoPic = "https://raw.githubusercontent.com/mayukobot/mayuko-discord/master/assets/pfp.jpg";

turndownService.remove("span")

const shorten = str => {
    const markdown = turndownService.turndown(str);
    if(markdown.length > 400) {
        return markdown.substring(0, 400) + "...";
    } else {
        return markdown;
    }
};

const discordMessage = ({
    name,
    url,
    imageUrl,
    description,
    footer,
    title
} = {}) => {
    return {
        title: title,
        author: {
            name: name,
            url: url,
            icon_url: mayukoPic
        },
        thumbnail: {
            url: imageUrl
        },
        description: shorten(description),
        footer: {
            text: footer
        }
    };
};

module.exports = discordMessage;