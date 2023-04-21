self.addEventListener('install', async () => {
    const cache = await caches.open("tetris-appshell");
    cache.addAll([
        "/tetris/",
        "/tetris/index.html",
        "/tetris/Core.js",
        "/tetris/CanvasPainter.js",
        "/tetris/script.js",
        "/tetris/style.css"
    ])
})