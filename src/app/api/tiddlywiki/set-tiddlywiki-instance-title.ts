import { join } from "path";
import { writeFileSync } from "fs";
import generateTiddlyWikiTimestamp from "./generate-tiddlywiki-timestamp";

const setTiddlywikiInstanceTitle = (params: { dataDir: string; title: string; }) => {
    const siteTitleTid = [
        `created: ${generateTiddlyWikiTimestamp()}`,
        `modified: ${generateTiddlyWikiTimestamp()}`,
        'title: $:/SiteTitle',
        'type: text/vnd.tiddlywiki',
        '',
        params.title,
    ].join('\n');
    const filePath = join(params.dataDir, 'tiddlers', '$__SiteTitle.tid');
    writeFileSync(filePath, siteTitleTid, 'utf-8');
};

export default setTiddlywikiInstanceTitle;
