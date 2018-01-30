'use strict';

// Named because we may want to add external controller functionality later
var Controller = (function () {
    async function kitteh() {
        asyncLoadImage(img, "../imgs/kitten.jpg")
            .catch((image) => {
                log("The kitteh is nowhere to be found :(")
            });
    }

    function updateStatus(connection) {
        connectionElement.innerText = connection.status;
        if (connection.status == "online" && !connectionElement.classList.contains("online")) {
            connectionElement.classList.add("online");
            kitteh();
        } else if (connection.status == "offline" && connectionElement.classList.contains("online")) {
            connectionElement.classList.remove("online");
            kitteh();
        }
    }

    async function checkStatus() {
        try {
            const status = await fetch("../data/status.json");
            status.json().then(status => updateStatus(status)).catch(error => console.log(error));
            setTimeout(checkStatus, 5000);
        } catch (error) {
            console.log(error);
            // When in doubt, try try again.
            setTimeout(checkStatus, 5000);
        }
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

    const img = document.querySelector("img");
    const connectionElement = document.querySelector("#connection")

    // Load our first kitteh and our updateStatus watcher
    kitteh();
    checkStatus();
})();
