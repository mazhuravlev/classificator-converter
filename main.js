const builder = require('xmlbuilder');
const fs = require('fs');
const data = fs.readFileSync('data.txt', 'utf-8');
const lines = data.split('\n').filter(x => x);
const joinPath = path => path.join('-');
const splitPath = pathString => pathString.split('-');
const records = lines.map(x => {
    const parts = x.split(';');
    return {path: splitPath(parts[0]), value: parts[1]};
});
const root = builder.create('root');
const paths = {};
records.forEach(record => {
    if(record.path.length == 1) {
        const pathString = joinPath(record.path);
        const el = root.ele('viewfolder', {path: pathString, name: record.value});
        paths[pathString] = el;
    } else {
        const parentPath = joinPath(record.path.slice(0, record.path.length - 1));
        const pathString = joinPath(record.path);
        const parentEl = paths[parentPath];
        const el = parentEl.ele('viewfolder', {path: pathString, name: record.value});
        paths[pathString] = el;
    }
});
const xml = root.end({ pretty: true});
fs.writeFileSync('result.xml', xml)