import dayjs from "dayjs";

const generateTiddlyWikiTimestamp = () => {
    return dayjs().format('YYYYMMDDHHmmssSSS');
};

export default generateTiddlyWikiTimestamp;
