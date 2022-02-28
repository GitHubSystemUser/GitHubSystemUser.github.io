if (!location.hostname.includes("127" || "localhost" || "192") && location.protocol !== 'https:') {
    // location.replace(`https:${location.href.substring(location.protocol.length)}`);
}

log("Application initialised.");
sessionStorage["c92e7678-ee64-5a9d-8d08-158e3fa0ed00"] = "false";

const application = {
    name: "QR",
    version: "00000",
    ready: () => sessionStorage.getPropertyValue("c92e7678-ee64-5a9d-8d08-158e3fa0ed00"),
    config: {
        load: () => {
            return JSON.parse(localStorage["b8ace5fd-4b18-5574-aa0f-67d81f47bab6"]);
        },

        get: function (string) {
            try {
                return this.load()[string];
            } catch(error) {
                return null;
            }
        },

        save: function (data) {
            let appConfig = this.load();
            appConfig[Object.keys(data)[0]] = Object.values(data)[0];
            localStorage["b8ace5fd-4b18-5574-aa0f-67d81f47bab6"] = JSON.stringify(appConfig);
        }
    },
    state: {
        get: () => {
            if (location.hostname.includes("127" || "localhost" || "192")) return { display: "staging", pwa: true, browser: false };
            if (location.protocol === "file:") return { display: "staging", pwa: true, browser: false };
            const currentState = window.matchMedia("(display-mode: standalone)").matches;
            if (document.referrer.startsWith("android-app://")) {
                return { display: "twa", pwa: false, browser: false };
            } else if (navigator.standalone || currentState) {
                return { display: "pwa", pwa: true, browser: false };
            }
            return { display: "browser", pwa: false, browser: true };
        },
        device: () => {
            const currentState = window.matchMedia("only screen and (max-device-width: 768px").matches;

            if (isTouch) {
                return { mouse: false, touch: true };
            }
        
            if (currentState) {
                return { mouse: false, touch: true };
            } else {
                return { mouse: true, touch: false };
            }
        }
    },
    url: {
        getParameters: (param) => {
            return new URLSearchParams(window.location.search).get(param);
        }
    },
    clipboard: {
        write: (string) => {
            const input = document.querySelector(".widget-clipboard-input");
            input.value = string;
            input.focus();
            input.select();
            return new Promise((resolve, reject) => {
                if(document.execCommand("copy")) {
                    resolve({ copied: input.value });
                } else {
                    reject()
                }
                input.blur();
                input.value = "";
            });
        }
    }
}


const broadcast = new BroadcastChannel("app");

const ctxMenu = document.querySelector(".widget-context-menu");
Reflect.defineProperty(ctxMenu, "state", {
    value: function state(options) {
        if (options.enabled === false) {
            ctxMenu.classList.remove("enabled");
            document.querySelector(".context-menu-UBrbSd").classList.remove("enabled");
            document.querySelectorAll(".actions-category").forEach(ctxTab => {
                ctxTab.classList.remove("enabled");
            });
            document.querySelectorAll("[data-ctx-menu]").forEach(tab => {
                tab.classList.remove("enabled")
            })
            document.querySelector(".widget-context-menu .actions").classList.add("enabled");
            document.querySelector(".widget-context-menu .actions-container").style.setProperty("height", window.getComputedStyle(document.querySelector(".widget-context-menu .actions")).getPropertyValue("height"));
            document.querySelector(".widget-context-menu .header h2").textContent = "Lorem ipsum dolor sit.";
        }
        if (options.enabled === true) {
            ctxMenu.classList.add("enabled");
            ctxMenu.style.setProperty("animation", "ctxMenu 200ms ease");
            ctxMenu.addEventListener("animationend", handler, false);

            function handler() {
                ctxMenu.style.setProperty("animation", "");
                ctxMenu.removeEventListener("animation", handler, false)
            };
            document.querySelector(".context-menu-UBrbSd").classList.add("enabled");
        }
        return;
    },
});


/* PWA */

broadcast.addEventListener("message", (event) => {
    if (event.data.event) {
        switch (event.data.event) {
            case "buildInstalled":
                document.querySelector(".focusLock-Ns3yie").classList.remove("enabled");
                document.querySelector(".focusLock-Ns3yie-background").classList.remove("enabled");
                window.location.reload();
                break;

            default:
                break;
        }
    };
});


let isTouch = false;
document.addEventListener("touchstart", handler);
function handler() {
    isTouch = true;
    document.removeEventListener("touchstart", handler);
}

if (application.state.get().pwa) {
    localStorage.setItem("standalone", "true");
    document.querySelector(".widget-app-download").remove();
} else {
    let deferredPrompt;

    localStorage.setItem("standalone", "false");

    window.addEventListener("beforeinstallprompt", (event) => {
        event.preventDefault();
        deferredPrompt = event;
    });

    document.querySelector(".widget-auth").style.setProperty("display", "none");
    document.querySelector("main").style.setProperty("display", "none");

    if (localStorage.getItem("appInstalled") !== "true") {
        document.querySelector(".download-fail").textContent = "I already have Discrod installed";

        document.querySelector(".widget-app-download-btn").addEventListener("click", async () => {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((result) => {
                if (result.outcome === "accepted") {

                }
                deferredPrompt = null;
            }).catch((error) => {
                console.error(error);
            });
        });
    }

    document.querySelector(".download-fail").addEventListener("click", () => {
        if (document.querySelector(".download-fail").textContent === "I already have Discrod installed") {
            localStorage.setItem("appInstalled", "true");
        } else {
            localStorage.setItem("appInstalled", "failed");
        }
        window.location.reload();
    });

    window.addEventListener("appinstalled", () => {
        localStorage.setItem("appInstalled", "true");
        document.querySelector(".download-fail").remove();
        document.querySelector(".widget-app-download svg").style.setProperty("display", "flex");
        setTimeout(() => {
            document.querySelector(".widget-app-download svg").classList.add("enabled");
        }, 100);
        document.querySelector(".widget-app-download .widget-app-download-btn").remove();
        document.querySelector(".widget-app-download svg").addEventListener("animationend", handler, true);
        function handler() {
            document.querySelector(".widget-app-download svg").classList.remove("enabled");
            setTimeout(() => {
                document.querySelector(".widget-app-download svg").remove()
                document.querySelector(".widget-app-download .open-discrod").classList.add("enabled");
            }, 300)
            document.querySelector(".widget-app-download svg").removeEventListener("animationend", handler, true);
        }
    });

    if (localStorage.getItem("appInstalled") === "true") {
        document.querySelector(".widget-app-download .widget-app-download-btn").remove();
        document.querySelector(".widget-app-download svg").remove();
        document.querySelector(".widget-app-download .open-discrod").classList.add("enabled");
        document.querySelector(".download-fail").style.setProperty("display", "");
    }
}

/* ...SW */
let installingServiceWorker;
window.updateAvailable = new Promise((resolve, reject) => {
    if ("serviceWorker" in navigator && ["localhost", "127"].indexOf(location.hostname) === -1) {
        try {
            navigator.serviceWorker.register("sw.js").then((registered) => {
                registered.addEventListener("updatefound", (event) => {

                    installingServiceWorker = registered.installing;

                    installingServiceWorker.addEventListener("statechange", () => {
                        switch (installingServiceWorker.state) {
                            case "installed":
                                if (navigator.serviceWorker.controller) {
                                    resolve(true)
                                } else {
                                    resolve(false)
                                }
                                break;
                        }
                    });

                })
            });
        } catch (error) {
            reject(error);
            AK81JO3R0001325823571263488(true);
        }
    }
});



const root = document.querySelector(":root");
Reflect.defineProperty(root, "state", {
    value: function state(options) {
        if (options.theme) {
            root.classList.remove(...["theme-light", "theme-dark", "theme-pure-evil"]);
            switch (options.theme) {
                case "light":
                    root.classList.add("theme-light");
                    application.config.save({ theme: "light" });                    
                    break;
                case "dark":
                    root.classList.add("theme-dark");
                    application.config.save({ theme: "dark" });
                    break;
                case "pureEvil":
                    root.classList.add("theme-pure-evil");
                    application.config.save({ theme: "pureEvil" });
                    break;

                default:
                    root.classList.add("theme-light");
                    application.config.save({ theme: "light" });
                    break;
            }
        };
        return;
    },
});

window.addEventListener("load", () => {
    const URL = new URLSearchParams(window.location.hash.slice(1));
    let [access_token, token_type] = [URL.get("access_token"), URL.get("token_type")];
    const apiEndpoint = "https://discord.com/api/v8";
    const api = "https://discord.com/api";
    const imageBaseUrl = "https://cdn.discordapp.com"


    if (!access_token) {
        let access_token = localStorage.getItem("074709ac-2f9f-5548-8d55-9592a8f447c8");
        let token_type = localStorage.getItem("0f5df70e-3701-51b1-b259-05ffad3ee49d");
        if(!access_token) return;
        log(`[Login System] User logged as "${data}"`);
        document.querySelector(".widget-auth").remove();
        if (localStorage.getItem("version") !== document.querySelector("clientVersion").innerText) {
            openModal(document.querySelector("#changelog"));
            localStorage.setItem("version", document.querySelector("clientVersion").innerText);
        }

        return;
    };

    fetch(`${api}/users/@me`, { headers: { authorization: `${token_type} ${access_token}` } })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data)
            if (data.code === 0) return;

            localStorage.setItem("b97a35cc-1a59-5ceb-96dc-6b7c88da3a91", "true");
            localStorage.setItem("074709ac-2f9f-5548-8d55-9592a8f447c8", access_token);
            localStorage.setItem("0f5df70e-3701-51b1-b259-05ffad3ee49d", token_type);

        });

    fetch(`${api}/users/@me/guilds?limit=200`, { headers: { authorization: `${token_type} ${access_token}` } })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data)
            data.forEach(guild => {
                document.querySelector(".guild-list").insertAdjacentHTML("beforeend", `<div data-element-id="widget_guilds_list_item_guild_vertical" class="widget-guilds-list-item-guild-vertical">
                <div data-element-id="guilds_item_avatar_wrap" class="guilds-item-avatar-wrap">
                    <img data-element-id="guilds_item_avatar" src="${imageBaseUrl}/icons/${guild.id}/${guild.icon}.png" class="guilds-item-avatar">
                </div>
            </div>`);
            });
        });

})

document.querySelectorAll("appTemplate").forEach((element) => element.remove());
window.addEventListener("load", () => {
    
    if(localStorage.getItem("b97a35cc-1a59-5ceb-96dc-6b7c88da3a91") === "true") {
        log(`[Login System] User detected as logged.`);
    }

    const LNtrXgXRma = application.config.get("LNtrXgXRma");
    
    if (LNtrXgXRma) {
        log(`[Login System] User detected as logged.`);
        if (localStorage.getItem("84c5f76b-0d2e-5b17-aa2d-cf3ab426ff79")) {
            log(`[Login System] User locally logged as "${JSON.parse(localStorage.getItem("84c5f76b-0d2e-5b17-aa2d-cf3ab426ff79")).username}"`, { priority: "warning" });
            document.querySelector(".widget-auth").remove();

            if (application.config.get("version") !== application.version) {
                openModal(document.querySelector("#changelog"));
                application.config.save({ version: application.version });
            }
        } else {
            localStorage.clear();
            window.location.reload();
        }
    } else {
        log(`[Login System] User not logged.`);
        // document.querySelector("main").remove();
        localStorage["b8ace5fd-4b18-5574-aa0f-67d81f47bab6"] = "{}";
        application.config.save({ version: application.version });
        root.state({ theme: "light" });
        new Notice("Logging in", "Use \"Discrod Login\" to login.", [{ ID: "_null", style: "secondary", type: "data-close-notice", name: "Next" }]).send().then(() => {
            new Notice("Logging in", "Username can be anything, it may get used in some area of the App. Password is the default one.", [{ ID: "_null", style: "primary CTA", type: "data-close-notice", name: "Okay" }]).send()
        });
    }
    root.state({ theme: application.config.get("theme") });

    // if (localStorage.getItem("version")) {
    //     localStorage.clear();
    //     window.location.reload();
    // }

    document.querySelector(".widget-home-panel-loading").classList.add("disabled");

    setTimeout(() => {
        document.querySelector(".widget-app-loader").classList.add("disabled");
        sessionStorage["c92e7678-ee64-5a9d-8d08-158e3fa0ed00"] = "true";
        if(getURLParameters("tab")) {
        try {
            
            document.querySelectorAll("[data-tab-contents]").forEach(tabC => {
                tabC.classList.remove("active")
            })
            document.querySelectorAll("[data-tab-target]").forEach(tab => {
                tab.classList.remove("active")
            })
            document.querySelector(`#${getURLParameters("tab")}`).classList.add("active");
        } catch { AK81JO3R0001325823571263488(true) }
    }
    if(getURLParameters("screenLayout")) {
        const screenLayout = document.querySelector(`#${getURLParameters("screenLayout")}`)
        if (screenLayout == null) return;

        try {
            setTimeout(() => {
                switch (screenLayout.dataset.screenLayoutStyle) {
                    case "alpha":
                        document.querySelector("main").classList.add("alpha");
                        document.querySelector("main").style.setProperty("transition", "transform 200ms cubic-bezier(0,0,1,1)");
                        screenLayout.classList.add("enabled");
                        screenLayout.style.setProperty("animation", "screenLayoutEnabled 500ms cubic-bezier(0,.8,0,1) forwards");
                        break;
                    case "beta":
                        screenLayout.classList.add("enabled");
                        document.querySelector("main").classList.add("beta");
                        document.querySelector("main").style.setProperty("transition", "transform 400ms ease-in-out");
                        break;

                    default:
                        break;
                }
            }, 100);
        } catch (error) {
            console.log(error);
            return AK81JO3R0001325823571263488(true);
        }
    }
    }, 1000);
});

log("[WebSocket] Connecting to WebSocket server.");
const socket = new WebSocket("ws://localhost:2912");
socket.addEventListener("open", (event) => {
    log("[WebSocket] Server connected");
    socket.send("Hi")
});

socket.addEventListener("close", (event) => {
    log(`[WebSocket] WebSocket connection terminated. Code: ${event.code}`, { priority: "warning" });
});

socket.addEventListener("error", (event) => {
    log(`[WebSocket] Error: ${event}`, { priority: "critical" });
    console.log(event)
});

socket.addEventListener("message", (event) => {
    log("[WebSocket] Message received");
});

/* 🍞 */
class Toast {
    constructor(content, duration, callback) {
        this.content = content;
        this.duration = duration;
        this.callback = callback;
    }

    send() {

        return new Promise((resolve, reject) => {
            try {
                document.querySelector(".toasts-recycler").insertAdjacentHTML("beforeend", `<div data-element-id="_dev" class="toast"><h1 data-element-id="_dev" class="toast-text">${this.content}</h1></div>`);

                resolve(document.querySelector(".toasts-recycler").lastChild);
            } catch (error) {
                console.log(error)
                reject(error);
            }
        }).then((toast) => {
            return new Promise((resolve, reject) => {
                try {
                    toast.style.animation = "toast-appearing 700ms ease forwards";

                    if (typeof this.callback === "function") {
                        toast.addEventListener("animationend", this.callback);
                    };

                    toast.addEventListener("animationend", (animation) => {
                        if (animation.animationName !== "toast-appearing") return;

                        setTimeout(() => {
                            toast.style.animation = "toast-disappearing 1s ease forwards";

                            toast.addEventListener("animationend", (animation) => {
                                if (animation.animationName !== "toast-disappearing") return;
                                resolve(toast);
                                toast.remove();
                            });
                        }, this.duration);
                    });
                } catch (error) {
                    console.log(error)
                    reject(error);
                    return AK81JO3R0001325823571263488(true);
                };
            });
        });
    }
}

/* 💾🍞 */
class ToastMessage {
    constructor(content, options) {
        this.content = content;
        this.options = options;
    }

    send() {

        return new Promise((resolve, reject) => {
            try {
                
                switch (this.options.type) {
                    case "information":
                        document.querySelector(".widget-toasts-recycler").insertAdjacentHTML("beforeend", `<div data-element-id="_app" class="new-toast"><svg width="24" height="24" viewBox="0 0 12 12"><path fill="currentColor" d="M6 1C3.243 1 1 3.244 1 6c0 2.758 2.243 5 5 5s5-2.242 5-5c0-2.756-2.243-5-5-5zm0 2.376a.625.625 0 110 1.25.625.625 0 010-1.25zM7.5 8.5h-3v-1h1V6H5V5h1a.5.5 0 01.5.5v2h1v1z"></path></svg><div data-element-id="_app" class="new-toast-text">${this.content}</div></div>`);
                        break;
                    case "success":
                        document.querySelector(".widget-toasts-recycler").insertAdjacentHTML("beforeend", `<div data-element-id="_app" class="new-toast"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="#3BA55C" d="M9.00043 14.0492L19.5904 3.46924L23.1212 7.00006L8.99993 21.1214L1.28485 13.4063L4.83367 9.88248L9.00043 14.0492Z"></path></svg><div data-element-id="_app" class="new-toast-text">${this.content}</div></div>`);
                        break;
                    case "fail":
                        document.querySelector(".widget-toasts-recycler").insertAdjacentHTML("beforeend", `<div data-element-id="_app" class="new-toast"><svg width="24" height="24" viewBox="0 0 24 24"><path fill="#ED4245" d="M18.4 1.879L22.121 5.6l-6.4 6.4 6.4 6.4-3.721 3.721-6.4-6.4-6.4 6.4L1.879 18.4l6.4-6.4-6.4-6.4L5.6 1.879l6.4 6.4 6.4-6.4z"></path></svg><div data-element-id="_app" class="new-toast-text">${this.content}</div></div>`);
                        break;
                    case "warning":
                        document.querySelector(".widget-toasts-recycler").insertAdjacentHTML("beforeend", `<div data-element-id="_app" class="new-toast"><svg width="24" height="24" viewBox="0 0 14 14"><path fill="currentColor" d="M12,0 C12.8284271,0 14,1.17157288 14,2 L14,12 C14,12.8284271 12.8284271,14 12,14 L2,14 C1.17157288,14 0,12.8284271 0,12 L0,2 C0,1.17157288 1.17157288,0 2,0 L12,0 Z M8,3 L6,3 L6,8 L8,8 L8,3 Z M8,11 L8,9 L6,9 L6,11 L8,11 Z"></path></svg><div data-element-id="_app" class="new-toast-text">${this.content}</div></div>`);
                        break;
                
                    default:
                        document.querySelector(".widget-toasts-recycler").insertAdjacentHTML("beforeend", `<div data-element-id="_app" class="new-toast"><svg width="24" height="24" viewBox="0 0 12 12"><path fill="currentColor" d="M6 1C3.243 1 1 3.244 1 6c0 2.758 2.243 5 5 5s5-2.242 5-5c0-2.756-2.243-5-5-5zm0 2.376a.625.625 0 110 1.25.625.625 0 010-1.25zM7.5 8.5h-3v-1h1V6H5V5h1a.5.5 0 01.5.5v2h1v1z"></path></svg><div data-element-id="_app" class="new-toast-text">${this.content}</div></div>`);
                        break;
                }
                resolve(document.querySelector(".widget-toasts-recycler").lastChild);
            } catch (error) {
                console.log(error)
                reject(error);
            }
        }).then((toast) => {
            return new Promise((resolve, reject) => {
                try {
                    let visibilityDuration = this.options.duration ? this.options.duration : 2000;
                    toast.style.animation = "new-toast-appearing 500ms ease forwards";
                    

                    toast.addEventListener("animationend", (animation) => {
                        if (animation.animationName !== "new-toast-appearing") return;

                        setTimeout(() => {
                            toast.style.animation = "new-toast-disappearing 500ms ease forwards";

                            toast.addEventListener("animationend", (animation) => {
                                if (animation.animationName !== "new-toast-disappearing") return;
                                resolve(toast);
                                toast.remove();
                            });
                        }, visibilityDuration);
                    });
                } catch (error) {
                    console.log(error)
                    reject(error);
                    return AK81JO3R0001325823571263488(true);
                };
            });
        });
    }

    edit() {
        throw new Error("Unavaible");
    }

    delete() {
        throw new Error("Unavaible");
    }

    kill() {
        throw new Error("Unavaible");
    }
}

/* Notice */
class Notice {
    constructor(title, content, components) {
        this.title = title;
        this.body = content;
        this.components = components;
    }

    send() {
        return new Promise((resolve, reject) => {
            document.querySelector(".notice-header").innerText = this.title;
            document.querySelector(".notice-body-text").innerText = this.body;
            let elements = [];
            let components = this.components.reverse();
            for (const component of this.components) {
                let { ID, style, type, name } = component;
                ID = ID ?? "_null";
                type = type ?? "";

                document.querySelector(".notice-buttons-wrap").insertAdjacentHTML("beforeend", `<div data-element-id="${ID}" class="notice-button-wrapper"><button class="${style}" data-interactable>${name}</button></div>`);
                let element = document.querySelector(".notice-buttons-wrap").lastChild;
                elements.push(element)
                element.addEventListener("click", (event) => {
                    event.target.closest(".notice").classList.remove("enabled");
                    elements.forEach((element) => { element.remove() });
                    document.querySelector(".notice-background").classList.remove("enabled");
                    resolve(event.target)
                })
            }

            document.querySelector(".notice").classList.add("enabled");
            document.querySelector(".notice-background").classList.add("enabled");

        })

    }
}

/* Global Status */
class Status {
    constructor(content, image, type) {
        this.content = content;
        this.image = image;
        this.type = type;
    }

    send() {

        return new Promise((resolve, reject) => {
            try {
                document.querySelector(".widget-tabs-host").style.setProperty("transform", "translate(0, 28px)");
                document.querySelector(".widget-tabs-host-status-indicator").classList.remove("red" && "orange" && "green");
                document.querySelector(".widget-tabs-host-status-indicator").classList.add("enabled");
                document.querySelector(".widget-tabs-host-status-indicator .indicator .indicator-content .indicator-text").textContent = this.content;
                if (this.image) {
                    document.querySelector(".widget-tabs-host-status-indicator .indicator .indicator-content .indicator-icon").src = this.image;
                    document.querySelector(".widget-tabs-host-status-indicator .indicator .indicator-content .indicator-icon").style.setProperty("display", "");
                } else {
                    document.querySelector(".widget-tabs-host-status-indicator .indicator .indicator-content .indicator-icon").style.setProperty("display", "none");
                }
                document.querySelector(".widget-tabs-host-status-indicator").classList.add(this.type);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    };

    kill() {

        return new Promise((resolve, reject) => {
            try {
                document.querySelector(".widget-tabs-host").style.setProperty("transform", "none");
                document.querySelector(".widget-tabs-host-status-indicator").classList.remove("enabled");
                document.querySelector(".widget-tabs-host-status-indicator .indicator .indicator-content .indicator-text").textContent = "";
                document.querySelector(".widget-tabs-host-status-indicator .indicator .indicator-content .indicator-icon").src = "";
                document.querySelector(".widget-tabs-host-status-indicator").classList.remove("red" && "orange" && "green");
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    };
}

/* Alert */
class Alert {
    constructor(title, message, type) {
        this.title = title;
        this.message = message;
        this.type = type;
    }

    send() {
        return new Promise((resolve, reject) => {
            document.querySelector(".alert .alert-title").innerText = this.title;
            document.querySelector(".alert .message").innerText = this.message;

            if (this.type === 1) {
                document.querySelector(".alert").classList.add("enabled");
                document.querySelector(".alert-background").classList.add("enabled");

                document.querySelectorAll(".alert .button-panel .alert-button-wrap button").forEach((element) => {
                    element.addEventListener("click", handle, false);

                    function handle(event) {
                        document.querySelector(".alert").classList.remove("enabled");
                        document.querySelector(".alert-background").classList.remove("enabled");
                        resolve(event.target);
                        element.removeEventListener("click", handle, false);
                    }
                });
            }

            if (this.type === 2) {
                document.querySelector(".alert").classList.add("enabled");
                document.querySelector(".alert-background").classList.add("enabled");

                document.querySelectorAll("[data-alert-type]").forEach((element) => {
                    if (element.dataset.alertType === "1") element.classList.add("disabled");
                });

                document.querySelectorAll(".alert .button-panel .alert-button-wrap button").forEach((element) => {
                    element.addEventListener("click", handle, false);

                    function handle(event) {
                        console.log(event.target)
                        let data = {
                            clicked: event.target.innerText.toLowerCase(),
                            element: event.target
                        };
                        document.querySelector(".alert").classList.remove("enabled");
                        document.querySelector(".alert-background").classList.remove("enabled");
                        resolve(data);
                        element.removeEventListener("click", handle, false);
                    }
                });
            }

        })

    }
}

class SelectMenu {
    constructor(custom_id, options, placeholder, subtitle, min_values, max_values) {
        this.custom_id = custom_id;
        this.options = options;
        this.placeholder = placeholder;
        this.subtitle = subtitle;
        this.min_values = min_values;
        this.max_values = max_values;
    }
}

class User {
    constructor(username, discriminator, avatar, banner, accent_color) {
        this.username = username;
        this.discriminator = discriminator;
        this.avatar = avatar;
        this.banner = banner;
        this.accentColor = accent_color;
    }
}
log("[App Update] Checking for updates.");
window["updateAvailable"].then((updateAvailable) => {
    if (updateAvailable) {
        log("[App Update] Update detected.");
        document.querySelector(".focusLock-Ns3yie").classList.add("enabled");
        document.querySelector(".focusLock-Ns3yie-background").classList.add("enabled");

        document.querySelector(".focusLock-Ns3yie").addEventListener("click", (event) => {
            if (event.target.innerText === "Install") {
                log("[App Update] event.target.innerText === \"Install\", installing update.");
                broadcast.postMessage({ command: "skipWaiting" });
            } else {
                localStorage.setItem("updatePending", "true");
                log("[App Update] updatePending set to true.");
                document.querySelector(".focusLock-Ns3yie").classList.remove("enabled");
                document.querySelector(".focusLock-Ns3yie-background").classList.remove("enabled");
                if (!localStorage.getItem("installUpdateNotice")) {
                    ctxMenu.state({ enabled: true });
                    new Alert("Tip", "Use the context menu to install the update whenever you're ready.", 1).send();
                    ctxMenu.querySelectorAll("[data-context-menu-action=\"update\"]").forEach((element) => {
                        rippleEffect(event)
                    });
                    localStorage.setItem("installUpdateNotice", true);
                }
            }
        });
    } else {
        log("[App Update] No updates found.");
    }
}).catch(() => {
    log("[App Update] No updates found.");
});



document.querySelector(".discrod-login").addEventListener("click", () => {
    console.log(document.querySelector(".widget-discrod-login .discrod-login-container .username-main-input-wrap .username-main-input").value)
    if (document.querySelector(".widget-discrod-login .discrod-login-container .username-main-input-wrap .username-main-input").value.length <= 0) { document.querySelector(".widget-discrod-login .discrod-login-container .username-main-input-wrap .username-main-input").focus(); return new Toast("Login is invalid.", 3000).send(); }
    if (document.querySelector(".widget-discrod-login .discrod-login-container .discrod-login-password-wrap .discrod-login-password-input").value.toLowerCase() !== "s") {
        document.querySelector(".widget-discrod-login .discrod-login-container .discrod-login-password-wrap .discrod-login-password-input").value = "";
        document.querySelector(".widget-discrod-login .discrod-login-container .discrod-login-password-wrap .discrod-login-password-input").focus();
        return new Toast("Password is invalid.", 3000).send();
    }
    const user = new User(document.querySelector(".widget-discrod-login .discrod-login-container .username-main-input-wrap .username-main-input").value.toString(), "0000", "https://cdn.discordapp.com/embed/avatars/0.png?size=4096", null, "#5865F2")
    
    localStorage.setItem("84c5f76b-0d2e-5b17-aa2d-cf3ab426ff79", JSON.stringify(user));
    application.config.save({ LNtrXgXRma: true });
    window.location.reload();
});

/* Components */

document.querySelectorAll("checkbox").forEach((element) => {
    element.addEventListener("click", () => element.classList.toggle("checked"));
});

document.querySelectorAll("progressBar").forEach((element) => {
    element.insertAdjacentHTML("beforeend", `<svg viewBox="-80 -80 160 160"><circle cx="0" cy="0" r="75"></circle></svg>`);
    element.dataset.elementId = "_app";
});

document.querySelectorAll("loader").forEach((element) => {
    element.insertAdjacentHTML("beforeend", `<div class="wanderingCubesItem"></div>`);
    element.dataset.elementId = "_app";
});

document.querySelectorAll(".setting-container").forEach((element) => {
    element.addEventListener("click", (event) => {
        if (event.target.classList.contains("disabled")) return;
        if (event.target.dataset.selected === "true") {
            event.target.dataset.selected = "false";
            try {
                event.target.querySelector("checkbox").classList.remove("checked");
            } catch (error) {
                
            }
        } else {
            event.target.dataset.selected = "true";
            try {
                event.target.querySelector("checkbox").classList.add("checked");
            } catch (error) {
                
            }
        }

        switch (element.dataset.settingId) {
            case "value":

                break;
            case "_test":
            save({ test: 5})
            log(load().test)
                break;
            case "discrodAppThemeLight":
                root.state({ theme: "light" });
                break;
            case "discrodAppThemeDark":
                root.state({ theme: "dark" });
                break;
            case "discrodAppThemePureEvil":
                iPE--;
                if (iPE !== 0) return new Toast(`You hear a rumble! Knock ${iPE} more times...`, 3000).send();

                root.state({ theme: "pureEvil" });
                new Toast("Brave one, the path to darkness opens!", 3000).send();
                break;
            case "discrodAppClassicNavStyle":
                if (application.config.get("navStyle") !== "classic") {
                    application.config.save({ navStyle: "classic" });
                    document.querySelector("#nav-stage-discovery").style.display = "";
                    document.querySelector("#nav-mentions").style.display = "";
                    document.querySelector("#nav-stage-discovery-or-mentions").style.display = "none";
                } else {
                    application.config.save({ navStyle: "default" });
                    document.querySelector("#nav-stage-discovery").style.display = "none";
                    document.querySelector("#nav-mentions").style.display = "none";
                    document.querySelector("#nav-stage-discovery-or-mentions").style.display = "";
                }
                break;
            default:
                break;
        }
    });
});

document.querySelectorAll("[data-bottom-sheet]").forEach((element) => {
    element.addEventListener("click", () => {
        const bottomSheet = document.querySelector(".design-bottom-sheet-host").querySelector(element.dataset.bottomSheet);
        if (bottomSheet == null) return;

        try {
            bottomSheet.classList.add("enabled");
            // bottomSheet.style.setProperty("--design-bottom-sheet-dialog-height", window.getComputedStyle(bottomSheet.querySelector(".design-bottom-sheet")).getPropertyValue("height"));
            bottomSheet.style.setProperty("display", "");
            bottomSheet.style.setProperty("animation", "bottomSheetEnabled 200ms ease forwards");
        } catch (error) {
            console.log(error);
            return AK81JO3R0001325823571263488(true);
        }
    });
});

document.querySelectorAll("[data-bottom-sheet-touch-outside]").forEach((element) => {
    element.addEventListener("click", () => {
        const bottomSheet = element.closest(".design-bottom-sheet-dialog");
        if (bottomSheet == null) return;

        try {
            bottomSheet.style.setProperty("animation", "bottomSheetDisabled 200ms ease forwards");
            bottomSheet.addEventListener("animationend", animationHandler);
            function animationHandler(event) {
                if (event.animationName !== "bottomSheetDisabled") return;
                bottomSheet.classList.remove("enabled");
                bottomSheet.style.setProperty("display", "none");
                bottomSheet.removeEventListener("animationend", animationHandler);
            }
        } catch (error) {
            console.error(error);
            return AK81JO3R0001325823571263488(true);
        }
    });
});

/* Dev */
let devMode = false;
let disableUnhandledNotice = false;
// document.querySelector(".widget-chat-list-adapter-item-text-root").addEventListener("click", () => {
//     new Alert("Context Menu", "Hello", 1).send()
// })
// window.addEventListener("mousemove", (event) => {
//     document.querySelector(".widget-context-menu").style.top = `${event.pageY}px`;
//     document.querySelector(".widget-context-menu").style.left = `${event.pageX}px`;
// })

window.addEventListener("contextmenu", async (event) => {
    event.preventDefault();
    if(event.target.id === "nav-stage-discovery-or-mentions") {
        event.target.dataset.tabTarget === "#mentions" ? event.target.dataset.tabTarget = "#stage-discovery" : event.target.dataset.tabTarget = "#mentions";
        document.querySelector("#nav-stage-discovery-or-mentions").click();
        return;
    }
    ctxMenu.state({ enabled: true });
    if (!window.matchMedia("only screen and (max-device-width: 768px").matches) {
        ctxMenu.style.top = `${event.pageY}px`;
        ctxMenu.style.left = `${event.pageX}px`;
    }
    document.querySelector(".context-menu-UBrbSd").onclick = () => {
        ctxMenu.state({ enabled: false });
    }
    return;
    document.querySelector(".dev-design-bottom-sheet").classList.add("enabled");
    document.querySelector(".notice-background").classList.add("enabled");
});
let iPE = 10000;
document.querySelector(".widget-context-menu").addEventListener("click", (event) => {
    switch (event.target.dataset.contextMenuAction) {
        case "devMode":
            if (devMode === false) {
                event.target.querySelector("checkbox").classList.add("checked");
                devMode = true;
            } else {
                event.target.querySelector("checkbox").classList.remove("checked");
                devMode = false;
            }

            setTimeout(() => ctxMenu.state({ enabled: false }), 300);
            break;
        case "forceNav":
            document.querySelector("header").classList.remove("disabled");
            ctxMenu.state({ enabled: false });
            break;
        case "forceSearch":
            document.querySelector("#nav-quick-switcher").style.display = "";
            ctxMenu.state({ enabled: false });
            break;
        case "clearLocaleStorage":
            ctxMenu.state({ enabled: false });
            new Notice("Hold!", "Are you sure you want to remove all stored data?", [{ ID: "_null", style: "destructive", name: "Confirm" }, { ID: "_null", style: "secondary", type: "data-close-notice", name: "Cancel" }]).send().then((button) => {
                if (button.innerText === "Confirm") {
                    localStorage.clear();
                    new Toast("Cleared local data", 2000).send();
                } else {
                    ctxMenu.state({ enabled: true });
                }
            });
            break;
        case "disabledNotice":
            disableUnhandledNotice = true;
            new Toast("Disabled notices", 2000).send();
            ctxMenu.state({ enabled: false });
            break;
        case "reload":
            window.location.reload();
            ctxMenu.state({ enabled: false });
            break;
        case "debugScreen":
            ctxMenu.state({ enabled: false });
            break;
        case "light":
            root.state({ theme: "light" });
            break;
        case "dark":
            root.state({ theme: "dark" });
            break;
        case "pureEvil":
            iPE--;
            if(iPE !== 0) return new Toast(`You hear a rumble! Knock ${iPE} more times...`, 3000).send();
            root.state({ theme: "pureEvil" });
            new Toast("Brave one, the path to darkness opens!", 3000).send();
            break;
        case "bug":
            openWindow("https://discord.gg/hQhy6cmJEd", "Discrod");
            break;
        case "update":
            if (!localStorage.getItem("updatePending")) {
                new Toast("You are already up-to-date.", 3000).send();
                break;
            }
            log("[App Update] Update detected via LocalStorage, installing.");
            broadcast.postMessage({ command: "skipWaiting" });
            new Toast("Updating...", 3000).send();
            break;
        case "close":
            ctxMenu.state({ enabled: false });
            break;
        

        default:
            break;
    }
});

document.querySelectorAll("[data-ctx-menu]").forEach(tab => {
    document.querySelector(".widget-context-menu .actions-container").style.setProperty("height", window.getComputedStyle(document.querySelector(".widget-context-menu .actions-container")).getPropertyValue("height"));
    tab.addEventListener("click", () => {
        try {
            document.querySelectorAll(".actions-category").forEach(ctxTab => {
                ctxTab.classList.remove("enabled");
            });
            document.querySelectorAll("[data-ctx-menu]").forEach(tab => {
                tab.classList.remove("enabled")
            })
            tab.classList.add("enabled");
            document.querySelector(tab.dataset.ctxMenu).classList.add("enabled");
            document.querySelector(".widget-context-menu .actions").classList.remove("enabled");
            document.querySelector(".widget-context-menu .actions-container").style.setProperty("height", window.getComputedStyle(document.querySelector(tab.dataset.ctxMenu)).getPropertyValue("height"));
            document.querySelector(".widget-context-menu .header h2").textContent = document.querySelector(tab.dataset.ctxMenu).dataset.ctxCategoryName;

        } catch { AK81JO3R0001325823571263488(true) }
    })
});

document.querySelectorAll(".actions-category-back-button").forEach((element) => {
    element.addEventListener("click", () => {
        element.closest(".actions-category").classList.remove("enabled");
        document.querySelector(".widget-context-menu .actions").classList.add("enabled");
        document.querySelector(".widget-context-menu .actions-container").style.setProperty("height", window.getComputedStyle(document.querySelector(".widget-context-menu .actions")).getPropertyValue("height"));
        document.querySelector(".widget-context-menu .header h2").textContent = "Lorem ipsum dolor sit.";
    });
});

// document.querySelector(".dev-design-bottom-sheet form").addEventListener("submit", (event) => {
//     event.preventDefault();
//     document.querySelector(".dev-design-bottom-sheet").classList.remove("enabled");
//     document.querySelector(".notice-background").classList.remove("enabled");

//     if (document.querySelector(".dev-select-component-sheet-item-selected").checked) {
//         devMode = true;
//         return
//     } else {
//         devMode = false;
//         return
//     }

// });
// document.querySelectorAll(".dev-widget-select-component-bottom-sheet-item").forEach((element) => {
//     element.addEventListener("click", (event) => {
//         if(event.target.id === "layoutInspector") {
//             const checkbox = document.querySelector(".dev-select-component-sheet-item-selected");
//             checkbox.checked ? document.querySelector(".dev-select-component-sheet-item-selected").checked = false : document.querySelector(".dev-select-component-sheet-item-selected").checked = true;
//         }
//         if(event.target.id === "forceNav") {
//             closeSelectMenu();
//             document.querySelector("header").classList.remove("disabled");
//         }
//         if(event.target.id === "forceSearch") {
//             closeSelectMenu();
//             document.querySelector("#nav-quick-switcher").style.display = "";
//         }
//         if(event.target.id === "clearLocalStorage") {
//             new Notice("Hold!", "Are you sure you want to remove all stored data?", [{ ID: "_null", style: "destructive", name: "Confirm" }, { ID: "_null", style: "secondary", type: "data-close-notice", name: "Cancel" }]).send().then((button) => {
//                 if (button.innerText === "Confirm") {
//                     closeSelectMenu();
//                     localStorage.clear();
//                     new Toast("Cleared local data", 2000).send();
//                 }
//             });
//         }
//         if(event.target.id === "disableUnhandledNotice") {
//             closeSelectMenu();
//             disableUnhandledNotice = true;
//             new Toast("Disabled notices", 2000).send();
//         }

//         if(event.target.id === "reload") {
//             closeSelectMenu();
//             window.location.reload();
//         }
//     });
//     function closeSelectMenu() {
//         document.querySelector(".dev-design-bottom-sheet").classList.remove("enabled");
//         document.querySelector(".notice-background").classList.remove("enabled");
//     }
// });

/* App */
/* window.addEventListener("mousemove", (event) => {
    document.querySelector(".cursor").style.display = "block";
    document.querySelector(".cursor").style.top = `${event.pageY}px`;
    document.querySelector(".cursor").style.left = `${event.pageX}px`;
    document.querySelector(".cursor-info").style.display = "block";
    document.querySelector(".cursor-info").style.top = `${event.pageY}px`;
    document.querySelector(".cursor-info").style.left = `${event.pageX}px`;
    // document.querySelector(".cursor-info").textContent = event.ta;
    if(!isElementInViewport(document.querySelector(".cursor-info"))) {
        new Toast("e", 100).send()
        let rect = document.querySelector(".cursor-info").getBoundingClientRect();
        log(parseInt(document.querySelector(".cursor-info").style.top) - rect.top)
        document.querySelector(".cursor-info").style.marginTop = `${parseInt(document.querySelector(".cursor-info").style.top) - rect.top}px`;
        // document.querySelector(".cursor-info").style.marginLeft = `${rect.left - rect.right}px`;
    }
});

window.addEventListener("mouseout", () => {
    document.querySelector(".cursor").style.display = "none";
    document.querySelector(".cursor-info").style.display = "none";
});

window.addEventListener("click", () => {
    document.querySelector(".cursor").style.setProperty("animation", "cursorClick 200ms ease");

    document.querySelector(".cursor").addEventListener("animationend", handler, false);

    function handler() {
        document.querySelector(".cursor").style.setProperty("animation", "");
        document.querySelector(".cursor").removeEventListener("animation", handler, false)
    };
});

const cursorInteractable = ["button", "a", "[data-interactable]", "checkbox", "input[type=submit]", "input[type=button]"];
const cursorInput = ["input[type=text]", "input[type=password]", "input[type=tel]", "input[type=email]", "textarea"];

cursorInteractable.forEach((elementInteractable) => {
    document.querySelectorAll(elementInteractable).forEach((element) => {
        element.addEventListener("mouseover", () => {
            document.querySelector(".cursor").classList.add("interactable");
            document.querySelector(".cursor-info").textContent = "Interactable Element";
        });
    
        element.addEventListener("mouseout", () => {
            document.querySelector(".cursor").classList.remove("interactable");
            document.querySelector(".cursor-info").textContent = "";
        });
    });
});
cursorInput.forEach((elementInput) => {
    document.querySelectorAll(elementInput).forEach((element) => {
        element.addEventListener("mouseover", () => {
            document.querySelector(".cursor").classList.add("input");
            document.querySelector(".cursor-info").textContent = "Text Input";
        });
    
        element.addEventListener("mouseout", () => {
            document.querySelector(".cursor").classList.remove("input");
            document.querySelector(".cursor-info").textContent = "";
        });
    });
}); */

document.querySelector(".error-page .app-mount .wrapper-error-page button").addEventListener("click", () => window.location.reload());

// document.querySelector(".error-page .app-mount .wrapper-error-page button").addEventListener("click", () => unhandled());

document.addEventListener("mousemove", (event) => {
    if(!devMode) return
    document.querySelector(".layout-inspector-title").style.top = `${event.pageY + 30}px`;
    document.querySelector(".layout-inspector-title").style.left = `${event.pageX}px`;
});
document.addEventListener("mouseover", (event) => {
    if(!devMode) return
    const element = document.elementFromPoint(event.clientX, event.clientY);
    document.querySelector(".layout-inspector").style.display = "block";
    document.querySelector(".layout-inspector").style.top = `${element.getBoundingClientRect().top}px`;
    document.querySelector(".layout-inspector").style.left = `${element.getBoundingClientRect().left}px`;
    document.querySelector(".layout-inspector-title").innerText = element?.dataset?.elementId;
    document.querySelector(".layout-inspector").style.width = `${element.offsetWidth}px`;
    document.querySelector(".layout-inspector").style.height = `${element.offsetHeight}px`;
    element.onmouseout = () => {
        document.querySelector(".layout-inspector").style.display = "none";
    };
});


/* Placeholders */
document.querySelectorAll("placeholder").forEach((placeholder) => {
    const option = parseInt(placeholder.attributes[0].value);
    switch (option) {
        case 1:
            placeholder.insertAdjacentHTML("beforeend", `<svg width="30" height="30" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="250" cy="250" r="250" fill="#7289DA"/><circle cx="250" cy="250" r="150" fill="#5865F2"/></svg>`);
            break;

        case 2:
            placeholder.insertAdjacentHTML("beforeend", `<svg width="30" height="30" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="500" height="500" rx="100" fill="#7289DA"/>
            <rect x="100" y="100" width="300" height="300" rx="100" fill="#5865F2"/>
            </svg>
            `);
            break;

        case 3:
            placeholder.insertAdjacentHTML("beforeend", `<svg width="30" height="30" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M227.856 100.5C237.478 83.8333 261.534 83.8333 271.157 100.5L444.362 400.5C453.985 417.167 441.956 438 422.711 438H76.3013C57.0563 438 45.0281 417.167 54.6506 400.5L227.856 100.5Z" fill="#7289DA"/>
            <path d="M228.253 205.5C237.876 188.833 261.932 188.833 271.554 205.5L358.157 355.5C367.779 372.167 355.751 393 336.506 393H163.301C144.056 393 132.028 372.167 141.651 355.5L228.253 205.5Z" fill="#5865F2"/>
            </svg>
            `);
            break;

        default:
            placeholder.insertAdjacentHTML("beforeend", `<svg width="30" height="30" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="250" cy="250" r="250" fill="#7289DA"/>
            <circle cx="250" cy="250" r="150" fill="#5865F2"/>
            </svg>
            `);
            break;
    };
});

document.querySelectorAll("beta").forEach((tag) => {
    tag.innerText = "Beta";
    tag.addEventListener("click", rippleEffect);
});

document.querySelectorAll("[data-new]").forEach((element) => {
    return
    element.addEventListener("click", newFeature);
    element.insertAdjacentHTML("beforeend", `<div class="indicator-1afSc8" aria-controls="popout_30" aria-expanded="false" role="button" tabindex="0">
    <div class="animationContainer-C1kDfz animating-1Fb05y highPriority-2lg-eA">
      <div>
        <div class="top-3fo3zT animating-1Fb05y"></div>
        <div class="bottom-UE1eOv animating-1Fb05y"></div>
      </div>
      <div class="innerCircle-2Tsscg animating-1Fb05y highPriority-2lg-eA"></div>
      <div class="outerCircle-2K0c82 animating-1Fb05y highPriority-2lg-eA"></div>
    </div>
  </div>`);

  function newFeature(event) {
      element.removeEventListener("click", newFeature);
      element.querySelector(".indicator-1afSc8").remove();
  }
});

document.querySelectorAll("[data-interactable]").forEach((element) => {
    element.addEventListener("touchstart", rippleEffect);
});

document.querySelectorAll("[data-interactable]").forEach((element) => {
    element.addEventListener("mouseenter", mouseRippleEffect);
});

function rippleEffect(event) {
    const button = event.touches[0].target;
    const rect = button.getBoundingClientRect();
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    let animationPlaying = false;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.pageX - (rect.left + radius)}px`
    circle.style.top = `${event.pageY - (rect.top + radius)}px`
    circle.classList.add("ripple");
    // circle.addEventListener("animationstart", () => {
    //     animationPlaying = true;
    // });
    button.appendChild(circle);
    // circle.addEventListener("animationend", () => {
    //     animationPlaying = false;
    // });
    // button.ontouchend = () => {
    //     if(animationPlaying) {
            
    //     } else {
    //         // circle.remove();
    //     }
    // };
    circle.addEventListener("animationend", () => {
        circle.remove();
    });
};

function mouseRippleEffect(event) {
    if(application.state.device().touch) {
        document.querySelectorAll("[data-interactable]").forEach((element) => {
            element.removeEventListener("mouseenter", mouseRippleEffect);
        });
        return;
    }
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.pageX - (rect.left + radius)}px`
    circle.style.top = `${event.pageY - (rect.top + radius)}px`
    circle.classList.add("mouseRipple");
    button.appendChild(circle);
    button.onmouseout = () => {
        circle.remove();
    };
    // circle.addEventListener("animationend", 
};

/* Nav */
const bottomNavigationView = document.querySelector("header");
Reflect.defineProperty(bottomNavigationView, "state", {
    value: function state(options) {
        if(options.enabled === false) bottomNavigationView.classList.add("disabled");
        if(options.enabled === true) bottomNavigationView.classList.remove("disabled");
        return;
    },
});
document.querySelectorAll("nav button").forEach((btn) => {
    btn.addEventListener("click", rippleEffect);
});

document.querySelectorAll("[data-tab-target]").forEach(tab => {
    tab.addEventListener("click", () => {
        let stageStatus = new Status("RIP Stage Discovery :(", null);
        stageStatus.kill();

        if (tab.dataset.tabTarget === "#stage-discovery") stageStatus.send();

        try {
            document.querySelectorAll("[data-tab-contents]").forEach(tabC => {
                tabC.classList.remove("active")
            })
            document.querySelectorAll("[data-tab-target]").forEach(tab => {
                tab.classList.remove("active")
            })
            tab.classList.add("active");
            document.querySelector(tab.dataset.tabTarget).classList.add("active");
        } catch { AK81JO3R0001325823571263488(true) }
    })
});



document.querySelectorAll("[data-close-notice]").forEach((element) => {
    element.addEventListener("click", () => {
        element.closest(".notice").classList.remove("enabled");
        document.querySelector(".notice-background").classList.remove("enabled");
    });
});

const PEyaBB = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}


document.querySelectorAll("[data-screen-layout-target]").forEach((element) => {
    element.addEventListener("click", () => {
        const screenLayout = document.querySelector(element.dataset.screenLayoutTarget)
        if (screenLayout == null) return;

        try {
            setTimeout(() => {
                switch (screenLayout.dataset.screenLayoutStyle) {
                    case "alpha":
                        document.querySelector("main").classList.add("alpha");
                        document.querySelector("main").style.setProperty("transition", "transform 300ms cubic-bezier(0,0,1,1)");
                        screenLayout.classList.add("enabled");
                        screenLayout.style.setProperty("animation", "screenLayoutEnabled 500ms cubic-bezier(0,.8,0,1) forwards");
                        break;
                    case "beta":
                        screenLayout.classList.add("enabled");
                        document.querySelector("main").classList.add("beta");
                        document.querySelector("main").style.setProperty("transition", "transform 400ms ease-in-out");
                        break;

                    default:
                        break;
                }
                if(screenLayout.querySelector(".screen-layout-view loader")) {
                    setTimeout(() => {
                        screenLayout.querySelector(".screen-layout-view loader").classList.add("retry");
                        screenLayout.querySelector(".screen-layout-view loader").insertAdjacentHTML("beforeend", `<div class="retry"><img src="./src/ressources/App/0a111abac0327b74a86ee380548ec5cd.svg"><div data-element-id="_null" class="secondary-button loader-retry-button"><button data-element-id="_app" data-interactable>Retry</button></div></div>`);
                    }, 10000)
                    
                }
            }, 100);
        } catch (error) {
            console.log(error);
            return AK81JO3R0001325823571263488(true);
        }
    });
});

document.querySelectorAll("[data-screen-layout-back-button]").forEach((element) => {
    element.addEventListener("click", () => {
        const screenLayout = element.closest(".screen-layout");
        if (screenLayout == null) return;

        try {
            switch (screenLayout.dataset.screenLayoutStyle) {
                case "alpha":
                    screenLayout.style.setProperty("animation", "screenLayoutDisabled 200ms cubic-bezier(1, 0, 0.8, 1) forwards");
                    screenLayout.addEventListener("animationend", function handler() {
                        screenLayout.classList.remove("enabled");
                        screenLayout.removeEventListener("animationend", handler, true)
                    }, true);
                    break;
                case "beta":
                    screenLayout.style.setProperty("animation", "none");
                    screenLayout.classList.remove("enabled");
                    break;

                default:
                    break;
            }

            document.querySelector("main").classList.remove(...["alpha", "beta", "gamma"]);
        } catch (error) {
            console.error(error);
            return AK81JO3R0001325823571263488(true);
        }
    });
});


/* Auth */
document.querySelectorAll("[data-auth]").forEach((element) => {
    element.addEventListener("click", (event) => {
        if (document.querySelector(element.dataset.auth) == null) return;

        try {
            document.querySelector(element.dataset.auth).classList.add("enabled");
            if (element.dataset.auth !== "#registerIdentity" && element.dataset.auth !== "#login" & element.dataset.auth !== "#discrodLogin") event.target.closest(".auth-screen").style.left = "-100%";
            document.querySelector(".widget-auth-landing").classList.remove("enabled");
        } catch (error) {
            console.error(error);
            return AK81JO3R0001325823571263488(true);
        }
    });
});

document.querySelectorAll("[data-auth-back-button]").forEach((element) => {
    element.addEventListener("click", (event) => {
        const dataAuth = element.closest(".auth-screen");
        if (dataAuth == null) return;

        try {
            if (element.dataset.authBackButton === ".widget-auth-landing") {
                document.querySelector(".widget-auth-landing").classList.add("enabled");
            } else {
                document.querySelector(element.dataset.authBackButton).style.left = "";
            }
            dataAuth.classList.remove("enabled");
        } catch (error) {
            console.error(error);
            return AK81JO3R0001325823571263488(true);
        }
    });
});

document.querySelectorAll(".auth-register-identity-segment-card").forEach(element => {
    element.addEventListener("click", () => {

        document.querySelectorAll(".auth-register-identity-segment-card").forEach(element => {
            element.classList.remove("enabled");
        });

        if (element.dataset.elementId === "auth_register_identity_first_segment_card") {
            document.querySelector(".auth-register-identity-input").classList.remove("enabled");
            document.querySelector(".widget-auth-register-identity .content .auth-register-identity-input .phone-or-email-main-input-wrap label").innerText = "Phone Number";
            document.querySelector(".widget-auth-register-identity .content .auth-register-identity-input .phone-or-email-main-input-wrap input").value = "";
            document.querySelector(".widget-auth-register-identity .content .auth-register-identity-input .phone-or-email-main-input-wrap .phone-or-email-main-input").type = "tel";
        } else if (element.dataset.elementId === "auth_register_identity_second_segment_card") {
            document.querySelector(".auth-register-identity-input").classList.add("enabled");
            document.querySelector(".widget-auth-register-identity .content .auth-register-identity-input .phone-or-email-main-input-wrap label").innerText = "Email";
            document.querySelector(".widget-auth-register-identity .content .auth-register-identity-input .phone-or-email-main-input-wrap input").value = "";
            document.querySelector(".widget-auth-register-identity .content .auth-register-identity-input .phone-or-email-main-input-wrap .phone-or-email-main-input").type = "email";
        } else {
            return AK81JO3R0001325823571263488(true);
        }

        document.querySelector(".widget-auth-register-identity .content .auth-register-identity-input .phone-or-email-main-input-wrap .phone-or-email-main-input").focus()
        element.classList.add("enabled");
    });
});

document.querySelector(".app-discord-login-button").addEventListener("click", () => {
    let loginURL = "https://discord.com/api/oauth2/authorize?client_id=901774223763202049&redirect_uri=http%3A%2F%2F127.0.0.1%3A5500&response_type=token&scope=identify%20guilds.join"
    document.querySelectorAll(".app-discord-login-settings .setting-container").forEach((element) => {
        if(element.dataset.selected !== "true") return;
        switch (element.dataset.settingId) {
            case "discrodAllowConnections":
                loginURL += "%20connections";
                break;
            case "discrodAllowGuilds":
                loginURL += "%20guilds";
                break;
        
            default:
                break;
        }
    });
    openWindow(loginURL)
})


document.querySelectorAll("[data-design-bottom-sheet-target]").forEach((element) => {
    element.addEventListener("click", () => {
        new Toast(element.dataset.designBottomSheetTarget, 500).send()
        const bottomSheet = document.querySelector(element.dataset.designBottomSheetTarget)
        if (bottomSheet == null) return;

        try {
            setTimeout(() => {
                bottomSheet.classList.add("enabled");
                // let designBottomSheetBackground = document.createElement("div");
                // designBottomSheetBackground.classList.add("design-bottom-sheet-background");
                // document.querySelector(".alert-background").classList.add("enabled")
                document.querySelector(".test-design-bottom-sheet-background").classList.add("enabled");
                document.querySelector(".test-design-bottom-sheet-background").addEventListener("click", handleDesignBottomSheetBg, false)
                function handleDesignBottomSheetBg() {
                    bottomSheet.classList.remove("enabled");
                    document.querySelector(".test-design-bottom-sheet-background").classList.remove("enabled");
                    document.querySelector(".test-design-bottom-sheet-background").removeEventListener("click", handleDesignBottomSheetBg, false)
                }
                // document.body.prepend(designBottomSheetBackground);

                // bottomSheet.insertAdjacentHTML("beforeend", `<div data-element-id="_null" class="design-bottom-sheet-background"></div>`);
                // document.querySelector("main").classList.add("enabled")
            }, 100);

        } catch (error) {
            console.error(error);
            return AK81JO3R0001325823571263488(true);
        }
    });
});

document.querySelectorAll("[data-design-bottom-sheet-background]").forEach((element) => {
    element.addEventListener("click", () => {
        const bottomSheet = element.closest(".test-design-bottom-sheet");
        if (bottomSheet == null) return;

        try {
            bottomSheet.classList.remove("enabled");
            // document.querySelector("main").classList.remove("enabled");
        } catch (error) {
            console.error(error);
            return AK81JO3R0001325823571263488(true);
        }
    });
});

/* Home */
const widgetChannelsListItemChannelPrivate = document.querySelector(".widget-channels-list-item-channel-private");
const names = ["Pearl", "Emily", "Elizabeth", "Emma", "Salome", "Adam", "Susan"];
const status = ["Playing Discrod", "Join my discrod server!", "Listening to Spotify", "Lorem is kinda cool", "Imagine a placeholder", "Why are you reading this?", ".", "", "Suspicious", "Hi", "Hello", "What happend to the search tab????", "Don't use landscape", "AAAAAAAAAAAAAAAAAAA", "What's up with undefined status?", "Open Discrod ~ Do Bug"]
// for(let i = 0; i <= 100; i++) {
//     let div = widgetChannelsListItemChannelPrivate.cloneNode(true);
//     document.querySelector(".widget-channels-list-container .channels-list").append(div);
// }

names.forEach((name) => {
    let avatar = "";
    let CustomStatus;
    let r = PEyaBB(1, 4);
    let rS = PEyaBB(0, status.length);
    avatar = `./src/ressources/App/embed/${r}.png`;
    CustomStatus = status[rS];
    if(name.length === 6) {
        CustomStatus = `🙂  Discrod Canary ${PEyaBB(1, 100)}.${PEyaBB(1, 10)} - Alpha (${PEyaBB(10000, 99999)})`
        avatar = "./src/ressources/App/embed/0.png";
    }
    document.querySelector(".widget-channels-list-container .channels-list").insertAdjacentHTML("beforeend", ` <div data-element-id="widget_channels_list_item_channel_private" class="widget-channels-list-item-channel-private">
    <img data-element-id="channels_list_item_private_avatar" src=${avatar} class="channels-list-item-private-avatar">
    <div data-element-id="_null" class="channels-list-item-private-name-wrap">
    <h1 data-element-id="channels_list_item_private_name" class="channels-list-item-private-name">${name}</h1>
    <h2 data-element-id="channels_list_item_private_desc" class="channels-list-item-private-desc">${CustomStatus}</h2>
</div>`);
});
const placeholderWidths = ["48px", "83px", "118px", "152px", "187px", "222px"]
document.querySelectorAll(".blank-item-username-placeholder").forEach((element) => {
    element.style.width = placeholderWidths[PEyaBB(0, 5)];
})


document.querySelectorAll(".widget-guilds-list-item-guild-vertical").forEach((element) => {
    element.addEventListener("click", (clickedElement) => {
        document.querySelectorAll(".widget-guilds-list-item-guild-vertical").forEach((element) => {
            element.classList.remove("selected");
        });
        element.classList.add("selected");
        
    });
});



// document.querySelectorAll("[data-tab-target]").forEach(tab => {
//     tab.addEventListener("click", () => {
//         let stageStatus = new Status("RIP Stage Discovery :(", null);
//         stageStatus.kill();

//         if (tab.dataset.tabTarget === "#stage-discovery") stageStatus.send();


//         try {
//             document.querySelectorAll("[data-tab-contents]").forEach(tabC => {
//                 tabC.classList.remove("active")
//             })
//             document.querySelectorAll("[data-tab-target]").forEach(tab => {
//                 tab.classList.remove("active")
//             })
//             tab.classList.add("active");
//             document.querySelector(tab.dataset.tabTarget).classList.add("active");
//         } catch { FQfEAXwVqF(true) }
//     })
// });

document.querySelector("[data-toggle-drawer]").addEventListener("click", () => {
    const centerPanel = document.querySelector(".widget-tabs-host-home .overlapping-panels .panel-center");
    const leftPanel = document.querySelector(".widget-tabs-host-home .overlapping-panels .panel-left");

    if (centerPanel.classList.contains("enabled")) {
        document.querySelector("header").classList.remove("disabled");
        centerPanel.style.left = `calc(355px + 8px)`;
        leftPanel.style.display = "flex"
        setTimeout(() => centerPanel.classList.toggle("enabled"), 200);
    } else {
        document.querySelector("header").classList.add("disabled");
        centerPanel.classList.toggle("enabled");
        centerPanel.style.left = `0`;
        setTimeout(() => leftPanel.style.display = "none", 200);
    }

    centerPanel.style.transition = ``;
});

document.querySelector(".menu-channel-side-panel").addEventListener("click", () => {
    const centerPanel = document.querySelector(".widget-tabs-host-home .overlapping-panels .panel-center");
    const rightPanel = document.querySelector(".widget-tabs-host-home .overlapping-panels .panel-right");
    

    // new Notice("Disabled Interaction", "This is an disabled interaction.", [{ ID: "_null", style: "destructive", name: "Okay" }]).send();

    if (centerPanel.classList.contains("enabled")) {
        rightPanel.style.display = "block";
        centerPanel.style.left = `calc(-347px + -16px)`;
        setTimeout(() => centerPanel.classList.toggle("enabled"), 200);
    } else {
        centerPanel.classList.toggle("enabled");
        centerPanel.style.left = `0`;
        setTimeout(() => rightPanel.style.display = "none", 200);
    }

    // centerPanel.style.transition = ``;
});

document.querySelector(".flex-input-widget .left-btns-container").addEventListener("click", (event) => {

    switch (event.target.dataset.elementId) {
        case "gallery_btn":
            unhandled();
            break;

        case "gift_btn":
            break;

        case "expand_btn":
            unhandled();
            break;

        default:
            break;
    };
});

document.querySelector(".flex-input-widget textarea").addEventListener("click", (event) => {
    event.preventDefault();
    event.target.focus();
    unhandled();
    event.target.blur();
});

document.querySelector(".widget-channel-sidebar-actions-guild-view").addEventListener("click", (event) => {

    switch (event.target.dataset.elementId) {

        case "widget_channel_sidebar_actions_notifications":
            unhandled();
            break;

        default:
            break;
    };
});

document.querySelector(".dialog-chat-actions-containers").addEventListener("click", (event) => {

    switch (event.target.dataset.elementId) {
        case "_null":
            new Alert("Apps", "- Hey\n- Hey", 2).send();
            break;

        default:
            unhandled();
            break;
    };

    document.querySelector(".dialog-chat-actions-containers").classList.remove("enabled");
    document.querySelector(".test-design-bottom-sheet-background").classList.remove("enabled");
});



/* 
let startingPointX

document.querySelector(".widget-tabs-host-home").addEventListener("touchstart", (event) => {
    document.querySelector(".widget-tabs-host-home .overlapping-panels .panel-center").style.setProperty("transition", "none");
    startingPointX = event.touches[0].clientX;
});
document.querySelector(".widget-tabs-host-home").addEventListener("touchmove", (event) => {
    let change = startingPointX - event.touches[0].clientX;

    if(change < 20) return console.log("p1 change < 0");

    document.querySelector(".widget-tabs-host-home .overlapping-panels .panel-center").style.left = `${(screen.width - change)}px`;
    event.preventDefault()
});
document.querySelector(".widget-tabs-host-home").addEventListener("touchend", (event) => {

    if(startingPointX - event.changedTouches[0].clientX < screen.width / 3) {
        document.querySelector(".widget-tabs-host-home .overlapping-panels .panel-center").style.left = `calc(100% - 56px + 8px`;
        document.querySelector(".widget-tabs-host-home .overlapping-panels .panel-center").classList.remove("enabled");
        document.querySelector("header").classList.remove("disabled");
    } else {
        document.querySelector(".widget-tabs-host-home .overlapping-panels .panel-center").style.transition = `300ms ease`;
        document.querySelector(".widget-tabs-host-home .overlapping-panels .panel-center").style.left = `0`;
        document.querySelector("header").classList.add("disabled");
    }
});

document.querySelector(".widget-tabs-host-home .overlapping-panels .panel-center").addEventListener("touchstart", (event) => {
    startingPointX = event.touches[0].clientX;
    document.querySelector(".widget-tabs-host-home .overlapping-panels .panel-center").style.transition = ``;
});
document.querySelector(".widget-tabs-host-home .overlapping-panels .panel-center").addEventListener("touchmove", (event) => {
    let change = event.touches[0].clientX - startingPointX;

    if(change < 20) return console.log("p2 change < 0");

    document.querySelector(".widget-tabs-host-home .overlapping-panels .panel-center").style.left = `${change}px`;
    event.preventDefault()
});
document.querySelector(".widget-tabs-host-home .overlapping-panels .panel-center").addEventListener("touchend", (event) => {

    if(event.changedTouches[0].clientX - startingPointX < screen.width / 4) {
        document.querySelector(".widget-tabs-host-home .overlapping-panels .panel-center").style.left = `0`;
        document.querySelector(".widget-tabs-host-home .overlapping-panels .panel-center").classList.add("enabled")
    } else {
        document.querySelector(".widget-tabs-host-home .overlapping-panels .panel-center").style.transition = `300ms ease`;
        document.querySelector(".widget-tabs-host-home .overlapping-panels .panel-center").style.left = `calc(100% - 56px + 8px`;
    }
});
*/


const svg = `<svg width="24" height="24" aria-hidden="false" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M16.886 7.999H20C21.104 7.999 22 8.896 22 9.999V11.999H2V9.999C2 8.896 2.897 7.999 4 7.999H7.114C6.663 7.764 6.236 7.477 5.879 7.121C4.709 5.951 4.709 4.048 5.879 2.879C7.012 1.746 8.986 1.746 10.121 2.877C11.758 4.514 11.979 7.595 11.998 7.941C11.9991 7.9525 11.9966 7.96279 11.9941 7.97304C11.992 7.98151 11.99 7.98995 11.99 7.999H12.01C12.01 7.98986 12.0079 7.98134 12.0058 7.97287C12.0034 7.96282 12.0009 7.95286 12.002 7.942C12.022 7.596 12.242 4.515 13.879 2.878C15.014 1.745 16.986 1.746 18.121 2.877C19.29 4.049 19.29 5.952 18.121 7.121C17.764 7.477 17.337 7.764 16.886 7.999ZM7.293 5.707C6.903 5.316 6.903 4.682 7.293 4.292C7.481 4.103 7.732 4 8 4C8.268 4 8.519 4.103 8.707 4.292C9.297 4.882 9.641 5.94 9.825 6.822C8.945 6.639 7.879 6.293 7.293 5.707ZM14.174 6.824C14.359 5.941 14.702 4.883 15.293 4.293C15.481 4.103 15.732 4 16 4C16.268 4 16.519 4.103 16.706 4.291C17.096 4.682 17.097 5.316 16.707 5.707C16.116 6.298 15.057 6.642 14.174 6.824ZM3 13.999V19.999C3 21.102 3.897 21.999 5 21.999H11V13.999H3ZM13 13.999V21.999H19C20.104 21.999 21 21.102 21 19.999V13.999H13Z"></path></svg>`

// document.querySelectorAll("svg").forEach((element) => {
//     element.innerHTML = ""
//     element.insertAdjacentHTML("beforeend", `<loader></loader>`)
//     let loader = element.querySelector("loader");
    
//     loader.style.setProperty("width", window.getComputedStyle(element).getPropertyValue("width"))
//     loader.style.setProperty("height", window.getComputedStyle(element).getPropertyValue("height"))
//     log(window.getComputedStyle(loader).getPropertyValue("width"))
//     element.append(loader);
// })

// document.querySelectorAll("img").forEach((element) => {
//     element.outerHTML = `<loader></loader>`
// })

document.querySelector(".widget-guilds .guild-list .widget-guilds-list-item-folder-container .widget-guilds-list-item-folder").addEventListener("click", () => {

    document.querySelector(".widget-guilds .guild-list .widget-guilds-list-item-folder-container").classList.toggle("collapsed");
    document.querySelector(".widget-guilds-list-item-folder-container .widget-guilds-list-item-folder").classList.toggle("collapsed")

    let color = window.getComputedStyle(document.querySelector(".widget-guilds .guild-list .widget-guilds-list-item-folder .guilds-item-folder-container .guilds-item-folder .folder-view-folder-image")).getPropertyValue("color")
    if(document.querySelector(".widget-guilds-list-item-folder-container .widget-guilds-list-item-folder").classList.contains("collapsed")) {
        if(color.indexOf("a") !== 3) {
            color = color.replace(")", ", 0.4)").replace("rgb", "rgba");
        }
    } else {
        color = "var(--background-primary)";
    }
     

    document.querySelector(".widget-guilds .guild-list .widget-guilds-list-item-folder-container").style.setProperty("--folderBackground", color)

    // for(const element of document.querySelector(".widget-guilds-list-item-folder-container .widget-guilds-list-item-folder-children").children) {
    //         console.log(element.children.find((elmnt) => { elmnt == "avata" }))
    //     }


    // for(const element of document.querySelector(".widget-guilds-list-item-folder-container .widget-guilds-list-item-folder-children").children) {
    //     document.querySelector(".widget-guilds-list-item-folder-container .widget-guilds-list-item-folder").classList.add("collapsed")
    //     element.style.display = "none"
    //     setTimeout(() => {
    //         element.style.display = ""
    //         document.querySelector(".widget-guilds-list-item-folder-container .widget-guilds-list-item-folder").classList.remove("collapsed")
    //     }, 5000);
    // }
});
// setInterval(() => {
//     if (screen.availHeight < screen.availWidth) {
//         try {
//             warning()
//         } catch {
//             FQfEAXwVqF(true);
//         }
//     }
// }, 300)
    

/* Friends */
// setInterval(() => {
//     document.querySelector(".friend-list .online .list").insertAdjacentHTML("beforeend", `<div class="user"> <div class="pfp"><img src="https://discord.com/assets/48cf0556d93901c8cb16317be2436523.svg"></div> <div class="username">Discord User</div> <div class="actions"> <button><img src="https://discord.com/assets/48cf0556d93901c8cb16317be2436523.svg"></button> <button><img src="https://discord.com/assets/48cf0556d93901c8cb16317be2436523.svg"></button> </div> </div>`);
// }, 3000)


/* Stage Discovery */


document.querySelector(".discovery-start-stage").addEventListener("click", () => {
    // FQfEAXwVqF(true, 5000);
});

/* User Settings */
// document.querySelectorAll(".user-settings-tab .settings-container button").forEach((element) => {
//     element.addEventListener("click", () => {
//         if(element.classList.contains("changelog")) return;
//         unhandled({ timeout: 200 });
        
//     });
// });

document.querySelector(".user-settings-tab").addEventListener("click", (event) => {
    console.log(event.target.dataset.elementId)

    let target = document.elementFromPoint(event.pageX, event.pageY);

    switch (target) {
        case "set_status_container":
            unhandled();
            break;
        case "settings_nitro":
            unhandled();
            break;
        case "notifications":
            unhandled();
            break;
        case "support":
            new Notice("Disabled Interaction", "Interactions with this component are disabled.", [{ ID: "_null", style: "destructive", name: "Okay" }]).send();
            break;
        case "upload_debug_logs":
            new Notice("Disabled Interaction", "Interactions with this component are disabled.", [{ ID: "_null", style: "destructive", name: "Okay" }]).send();
            break;
        case "acknowledgements":
            new Notice("Disabled Interaction", "Interactions with this component are disabled.", [{ ID: "_null", style: "destructive", name: "Okay" }]).send();
            break;

        default:
            break;
    };

    document.querySelector(".dialog-chat-actions-containers").classList.remove("enabled");
    document.querySelector(".test-design-bottom-sheet-background").classList.remove("enabled");
});



/* Unhandled */

const unhandledInteractions = [
    document.querySelector(".menu-settings-log-out"),
    document.querySelector(".menu-settings-more-options"),
    document.querySelector(".widget-guilds-list-item-profile"),
    document.querySelector(".expression-btn-container"),
    document.querySelector(".gallery-btn"),
    document.querySelector(".widget-connected-list"),
    document.querySelector(".discovery-intro-card-dismiss"),
    document.querySelector(".menu-user-mentions-filter"),
    document.querySelector(".user-profile-header-badges-recycler"),
    document.querySelector(".group-invite-friends-recipients-container"),
    document.querySelector(".thread-browser-view-pager"),
    document.querySelector(".boost-status-flipper"),
    document.querySelector(".add-friend-view-pager"),
    document.querySelector(".recycler-view"),
    document.querySelector(".start-stage-server-selection-button"),
    document.querySelectorAll("[data-unhandled-interaction]"),
    document.querySelectorAll(".widget-channels-list-item-channel-private"),
    document.querySelectorAll(".discovery-stage-card-body-view"),
    document.querySelectorAll(".friends-list-item-buttons-wrap"),
    document.querySelectorAll(".friends-list-item"),
];

for(const element of unhandledInteractions) {
    if(element.length !== undefined) {
        element.forEach((node) => {
            node.addEventListener("click", unhandled);
        })
    }

    try {
        element.addEventListener("click", unhandled);
    } catch (error) {
        element.forEach((node) => {
            node.addEventListener("click", unhandled);
        })
    }
}




// navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then((stream) => {
//     document.querySelector(".qr-scanner").srcObject = stream;
//     document.querySelector(".qr-scanner").play();
// });

const openModal = (modal) => {
    if (modal == null) return
    setTimeout(() => {
        try {
            modal.classList.add("active");
        } catch (error) {
            console.error(error);
            return AK81JO3R0001325823571263488(true);
        }
    }, 200);
}

const closeModal = (modal) => {
    if (modal == null) return

    try {
        modal.classList.remove("active");
    } catch (error) {
        console.error(error);
        return AK81JO3R0001325823571263488(true);
    }
}

document.querySelectorAll("[data-setting-view-target]").forEach((element) => {
    element.addEventListener("click", () => {
        openModal(document.querySelector(element.dataset.settingViewTarget));
    });
});

document.querySelectorAll("[data-back-button]").forEach((element) => {
    element.addEventListener("click", () => {
        closeModal(element.closest(".modal"));
        document.querySelector(".change-log-scrollview .change-log-video").pause();
        document.querySelector(".change-log-scrollview .change-log-video").currentTime = 0;
    });
});

document.querySelectorAll("[data-close-modal-button]").forEach((element) => {
    element.addEventListener("click", () => {
        closeModal(element.closest(".modal"));
    });
});

document.querySelectorAll("[data-changelog-button]").forEach((element) => {
    element.addEventListener("click", () => {
        if (element.dataset.changelogButton === "displayNotice") {
            const notice = new Notice("Change Log Notice", "Hellow World!", [{ ID: "_null", style: "primary CTA", type: "data-close-notice", name: "Okay" }]);
            notice.send()
        }

        if (element.dataset.changelogButton === "displayToast") {
            new Toast("Hello There", 5000).send()
        }
        if (element.dataset.changelogButton === "displayCtxMenu") {
            ctxMenu.state({ enabled: true });
        }
    });
});

document.querySelector(".change-log-scrollview .change-log-video-wrapper").addEventListener("click", () => {
    document.querySelector(".change-log-scrollview .change-log-video").play();
});

document.querySelector(".dev-widget-chat-list-adapter-item-invite .dev-item-invite-join-button").addEventListener("click", () => {
    openWindow("https://discord.gg/hQhy6cmJEd", "Discrod")
});

document.querySelector(".change-log-scrollview").addEventListener("scroll", KtikSH, false);

function KtikSH() {
    document.querySelector(".change-log-scrollview").removeEventListener("scroll", KtikSH, false);
    setTimeout(() => {
        document.querySelector(".change-log-scrollview .scroll-indicator").style.animation = "scroll-indicator-disabled 1s cubic-bezier(1,-0.5,1,.5) forwards";

        document.querySelector(".change-log-scrollview .scroll-indicator").addEventListener("animationend", (animation) => {
            if (animation.animationName !== "scroll-indicator-disabled") return;
            document.querySelector(".change-log-scrollview .scroll-indicator").remove();
        });
    }, 1000);
};


document.querySelectorAll("[data-expression-tray-content-target]").forEach(element => {
    element.addEventListener("click", () => {
        const target = document.querySelector(element.dataset.expressionTrayContentTarget);

        document.querySelectorAll("[data-expression-tray-content]").forEach(element => {
            element.classList.remove("enabled");
        });

        document.querySelectorAll("[data-expression-tray-content-target]").forEach(element => {
            element.classList.remove("enabled");
        });

        element.classList.add("enabled");
        target.classList.add("enabled");
    });
});




async function unhandled(options) {

    if (disableUnhandledNotice) return;

    // new Notice("Notice", "This is an unhandled interaction.", [{ ID: "_null", style: "primary CTA", name: "Okay" }]).send();
    window.navigator.vibrate(300);
    document.querySelector("main").style.setProperty("animation", "warningNoRotate 500ms infinite");
    setTimeout(() => {
        document.querySelector("main").style.setProperty("animation", "");
    }, 300);
    new ToastMessage("This is an unhandled interaction.", { type: "warning" }).send().then(() => {
    })
    // if (options?.timeout) {
    //     setTimeout(async () => {
    //         await notice.send().then((button) => {
    //             console.log(button)
    //             if (button.innerText === "Confirm") {
    //                 FQfEAXwVqF(true)
    //             }
    //         });
    //     }, options.timeout);
    // } else {
    //     await notice.send().then((button) => {
    //         console.log(button)
    //         if (button.innerText === "Confirm") {
    //             FQfEAXwVqF(true)
    //         }
    //     });
    // };
};

function isElementInViewport(element) {

    let rect = element.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
    );
};

function openWindow(url, title, options) {

    let defaultOpts = "statusbar=no,height=745,width=485,screenX=100,screenY=50";
    if (!options) options = defaultOpts;
    let win = window.open(url, title, options);
    if (win) {
        win.focus();
    } else {
        alert("Please allow popups for this website!");
    }
};

function AK81JO3R0001325823571263488(sBqfl, timeout) {
    const VzcxRS = document.querySelector(".error-page");

    if (timeout) {
        setTimeout(() => {
            sBqfl ? VzcxRS.classList.add("true") : VzcxRS.classList.remove("true");
        }, timeout);
    } else {
        sBqfl ? VzcxRS.classList.add("true") : VzcxRS.classList.remove("true");
    }

    // VzcxRS.addEventListener("animationend", kguXh, false);

    // function kguXh() {

    //     VzcxRS.removeEventListener("animationend", kguXh, false);
    // }
};

function getURLParameters(param) {
    // for (const option of interaction.options._hoistedOptions) {
    //             const { name, value } = option;
    //             arguments[name] = value;
    //         }
    // Array.from(new URLSearchParams(window.location.search).keys()).reduce((key, value) => ({ ...key, [key]: new URLSearchParams(window.location.search).get(key)}), {});
    return new URLSearchParams(window.location.search).get(param);
}

function log(string, options) {
    document.querySelector(".widget-app-debugging-logs").insertAdjacentHTML("beforeend", `<div data-element-id="_app" class="debugging-adapter-item"><p data-element-id="_app" class="log-message ${options?.priority}">${string}</p></div>`);
    console.log(string, options);
    return;
}

let timer;
let longPress = new Event("longPress");

window.addEventListener("mousedown", (event) => {
    const mouseEvent = { x: event.clientX, y: event.clientY, max: 15 };
    timer = window.setTimeout(() => {
        longPress.details = { target: event.target };
        event.target.dispatchEvent(longPress);
    }, 500);
    window.addEventListener("mousemove", handler);
    function handler(event) {
        if((mouseEvent.x - event.clientX) >= mouseEvent.max || (mouseEvent.x - event.clientX) <= -mouseEvent.max || (mouseEvent.y - event.clientY) >= mouseEvent.max || (mouseEvent.y - event.clientY) <= -mouseEvent.max) {
            clearTimeout(timer);
            window.removeEventListener("mousemove", handler);
        }
    };
})
window.addEventListener("mouseup", () => {
    clearTimeout(timer);
})
window.addEventListener("touchstart", (event) => {
    const touchEvent = { x: event.touches[0].clientX, y: event.touches[0].clientY, max: 15 };
    timer = window.setTimeout(() => {
        longPress.details = { target: event.target };
        event.target.dispatchEvent(longPress);
    }, 500);
    window.addEventListener("touchmove", handler);
    function handler(event) {
        if((touchEvent.x - event.touches[0].clientX) >= touchEvent.max || (touchEvent.x - event.touches[0].clientX) <= -touchEvent.max || (touchEvent.y - event.touches[0].clientY) >= touchEvent.max || (touchEvent.y - event.touches[0].clientY) <= -touchEvent.max) {
            clearTimeout(timer);
            window.removeEventListener("touchmove", handler);
        }
    };
})
window.addEventListener("touchend", () => {
    clearTimeout(timer);
});

document.querySelector(".widget-app-debugging-logs").addEventListener("longPress", (event) => {
    log(event.details.target)
    if (!event.details.target.classList.contains(".log-message")) return;
    application.clipboard.write(event.target.textContent).then(() => {
        new Toast("Copied to clipboard.", 1000).send();
    })
});


// document.addEventListener('touchstart', handleTouchStart, false);        
// document.addEventListener('touchmove', handleTouchMove, false);

// var xDown = null;                                                        
// var yDown = null;

// function getTouches(evt) {
//   return evt.touches ||             // browser API
//          evt.originalEvent.touches; // jQuery
// }                                                     
                                                                         
// function handleTouchStart(evt) {
//     const firstTouch = getTouches(evt)[0];                                      
//     xDown = firstTouch.clientX;                                      
//     yDown = firstTouch.clientY;                                      
// };                                                
                                                                         
// function handleTouchMove(evt) {
//     if ( ! xDown || ! yDown ) {
//         return;
//     }

//     var xUp = evt.touches[0].clientX;                                    
//     var yUp = evt.touches[0].clientY;

//     var xDiff = xDown - xUp;
//     var yDiff = yDown - yUp;
                                                                         
//     if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
//         if ( xDiff > 0 ) {
//             /* right swipe */ 
//         } else {
//             /* left swipe */
//         }                       
//     } else {
//         if ( yDiff > 0 ) {
//             /* down swipe */ 
//             document.querySelector(".widget-fast-nav").classList.add("enabled")
//             document.querySelector(".widget-fast-nav-bg").classList.add("enabled")
//         } else { 
//             /* up swipe */
//             document.querySelector(".widget-fast-nav").classList.remove("enabled")
//             document.querySelector(".widget-fast-nav-bg").classList.remove("enabled")
//         }                                                                 
//     }
//     /* reset values */
//     xDown = null;
//     yDown = null;                                             
// };

// document.querySelectorAll(".widget-fast-nav button").forEach((element) => {
//     element.addEventListener("click", () => {
//         document.querySelector(".widget-fast-nav").classList.remove("enabled")
//             document.querySelector(".widget-fast-nav-bg").classList.remove("enabled")
//     })
// })