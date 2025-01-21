import { join } from "path";
import { writeFileSync } from "fs";
import generateTiddlyWikiTimestamp from "./generate-tiddlywiki-timestamp";

const setTiddlywikiInstanceSubtitle = (params: { dataDir: string; subtitle?: string; }) => {
    const siteSubtitleTid = [
        `created: ${generateTiddlyWikiTimestamp()}`,
        `modified: ${generateTiddlyWikiTimestamp()}`,
        'title: $:/SiteSubtitle',
        'type: text/vnd.tiddlywiki',
        '',
        params?.subtitle ?? 'a non-linear personal web notebook',
    ].join('\n');
    const filePath = join(params.dataDir, 'tiddlers', '$__SiteSubtitle.tid');
    writeFileSync(filePath, siteSubtitleTid, 'utf-8');
};

export default setTiddlywikiInstanceSubtitle;
