let SimpleOfflineHandler = (function() {
    // Create the top bar to display our status.
    let connectionElement = document.createElement("div");
    connectionElement.innerText = "Loading...";
    connectionElement.id = "connection";
    document.body.insertBefore(connectionElement, document.body.firstChild);

    function updateStatus(online) {
        connectionElement.innerText = online ? "Online!" : "Offline :(";
        if (online && !connectionElement.classList.contains("online")) {
            connectionElement.classList.add("online");
            Controller.reloadKitteh();
        } else if (!online && connectionElement.classList.contains("online")) {
            connectionElement.classList.remove("online");
            Controller.reloadKitteh();
        }
    }

    async function checkStatus() {
        try {
            const response = await fetch("../favicon.ico");
            updateStatus(true);
        } catch (error) {
            updateStatus(false);
        }
        // TODO: Incremental backoff.
        setTimeout(checkStatus, 5000);
    }

    checkStatus();
})();
