define({
    root: window.location.pathname.replace(/\/(?:index.html)?$/, ''),
    serverUrl: 'http://192.168.1.199/ThesaurusCore',
    servUrl: 'http://localhost:56121/api/',
    portalUrl: 'http://localhost/nsportal',
    refLanguage: 'fr',
    treeDivId: 'treeView',
    coreUrl: 'http://127.0.0.1/eco/',
    dateLabel: 'jj/mm/aaaa hh:mm:ss',
    dateFormats: ['DD/MM/YYYY', 'DD/MM/YYYY HH:mm:ss'],
    isCore: true,
    mapDefault: {
        zoom: 12,
        center: [33,-4]
    }
});
