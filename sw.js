self.addEventListener('install', async () => {
    const cache = await caches.open("tetris-appshell");
    await cache.addAll([
        "/tetris/",
        "/tetris/index.html",
        "/tetris/Core.js",
        "/tetris/CanvasPainter.js",
        "/tetris/script.js",
        "/tetris/style.css",
        "/tetris/app.webmanifest.json",
        "/tetris/icon.png",
        "/tetris/mask_icon.png"
    ])
})