self.addEventListener('install', async () => {
    const cache = await caches.open("tetris-appshell");
    cache.addAll([
        "/",
        "/Core.js",
        "/CanvasPainter.js",
        "/script.js",
        "/style.css"
    ])
})