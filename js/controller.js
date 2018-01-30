'use strict';

var Controller = (function () {

    const img = document.querySelector("img");
    async function kitteh() {
        asyncLoadImage(img, "../imgs/kitten.jpg")
            .catch((image) => {
                log("The kitteh is nowhere to be found :(")
            });
    }

    function setupOfflineLibrary() {
        let useCustomOfflineHandler = true; // Switch to false to use offline.js, a common library.
                                            // It's not fully wired up, so turn on at your own risk.

        let script = document.createElement("script");
        script.src = useCustomOfflineHandler ? "js/simpleoffline.js" : "js/offline.min.js";
        script.addEventListener("load", () => {
            if (!useCustomOfflineHandler) {
                // Register for updates to change our kitteh.
                Offline.on("down", kitteh);
                Offline.on("up", kitteh);
            }
        });
        document.body.appendChild(script);
    }

    log("Controller loaded.")

    if (!'serviceWorker' in navigator) {
        log("Service Worker not supported! :( Application will not function");
        return;
    }

    log("Service Worker supported :)");

    if (navigator.serviceWorker.controller)
        log("A service worker was already registered.");

    navigator.serviceWorker.register("serviceworker.js")
        .then((serviceWorkerRegistration) => {
            log("Service worker registered with the following scope: "
                + serviceWorkerRegistration.scope);
            serviceWorkerRegistration.update();
        })
        .catch((error) => log("FAIL: " + error));
    navigator.serviceWorker.ready
        .then(function(registration) {
           console.log('Service Worker Ready');
        });

    // Load our first kitteh!
    kitteh();

    setupOfflineLibrary();

    return {
        reloadKitteh : () => kitteh()
    }
})();
