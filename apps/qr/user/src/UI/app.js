if (!location.hostname.includes("127" || "localhost" || "192") && location.protocol !== 'https:') {
    // location.replace(`https:${location.href.substring(location.protocol.length)}`);
}

let state = false;

// window.addEventListener("click", (event) => {
//     alert(`Top ${event.pageY}, Left: ${event.pageX}`)
// })

document.querySelector("#jdfshhfqiuh").addEventListener("click", (event) => {
    document.querySelector(".scanner-layout").classList.toggle("enabled")
    document.querySelector(".scan").classList.toggle("enabled")
    document.querySelectorAll(".scanner-cornerpoint").forEach((e) => e.classList.toggle("enabled"))
})



if(("BarcodeDetector" in window)) {
    const barcodeDetector = new BarcodeDetector({ formats: ["qr_code"] });
    const videoStream = document.querySelector(".video-stream");

    if(barcodeDetector) {
        console.log("BarcodeDetector is supported.")
    } else {
        console.log("BarcodeDetector is not supported.")
    }

    // scanner.getSupportedFormats().then((formats) => {
    //     formats.forEach((format) => {
    //         log(format);
    //     })
    // })

    (async () => {
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            await navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: "environment" } }, audio: false }).then((stream) => {
                videoStream.srcObject = stream;
            });
        }

        

        let scannerFocus = document.querySelector(".scanner-focus");
        setInterval(async () => {
            barcodeDetector.detect(videoStream).then((codes) => {
                // document.querySelector(".last").innerText = `Top: ${document.querySelector(".scanner-cornerpoint.alpha").style.top}, Left: ${document.querySelector(".scanner-cornerpoint.alpha").style.left}`
                if(codes.length <= 0) return;

                // https://www.digitalocean.com/community/tutorials/front-and-rear-camera-access-with-javascripts-getusermedia

                const { top: codeTop, right: codeRight, bottom: codeBottom, left: codeLeft, width: codeWidth, height: codeHeight } = codes[0].boundingBox;

                scannerFocus.style.setProperty("width", `${codeWidth}px`);
                scannerFocus.style.setProperty("height", `${codeHeight}px`);
                scannerFocus.style.setProperty("top", `${codeTop}px`);
                scannerFocus.style.setProperty("right", `${codeRight}px`);
                scannerFocus.style.setProperty("bottom", `${codeBottom}px`);
                scannerFocus.style.setProperty("left", `${codeLeft}px`);
                scannerFocus.style.setProperty("--height", `${codeHeight}px`);

                document.querySelector(".scanner-cornerpoint.alpha").style.setProperty("top", `${codes[0].cornerPoints[0].y}px`);
                document.querySelector(".scanner-cornerpoint.alpha").style.setProperty("left", `${codes[0].cornerPoints[0].x}px`);
                document.querySelector(".scanner-cornerpoint.beta").style.setProperty("top", `${codes[0].cornerPoints[1].y}px`);
                document.querySelector(".scanner-cornerpoint.beta").style.setProperty("left", `${codes[0].cornerPoints[1].x}px`);
                document.querySelector(".scanner-cornerpoint.gamma").style.setProperty("top", `${codes[0].cornerPoints[2].y}px`);
                document.querySelector(".scanner-cornerpoint.gamma").style.setProperty("left", `${codes[0].cornerPoints[2].x}px`);
                document.querySelector(".scanner-cornerpoint.delta").style.setProperty("top", `${codes[0].cornerPoints[3].y}px`);
                document.querySelector(".scanner-cornerpoint.delta").style.setProperty("left", `${codes[0].cornerPoints[3].x}px`);
    
                // codes.forEach((code) => {
                //     log(code);
                // });
                alert(codes.map(code => code.rawValue));                
            }).catch((error) => {
                console.log(error);
            });

        }, 5);

    })();
} else {
    log("BarcodeDetector isn't supported.", { priority: "warning" });
}
document.querySelector(".scan-btn").addEventListener("click", async () => {
    new ToastMessage("Received", { type: "success" }).send()
    // await barcodeDetector.detect(document.querySelector(".qr-code")).then( (codes) => {
    //     if (codes.length <= 0) return;

    //     alert(codes)

    //     const { top: codeTop, right: codeRight, bottom: codeBottom, left: codeLeft, width: codeWidth, height: codeHeight } = codes[0].boundingBox;

    //     squareElement.style.setProperty("width", `${codeWidth}px`);
    //     squareElement.style.setProperty("height", `${codeHeight}px`);
    //     squareElement.style.setProperty("top", `${codeTop}px`);
    //     squareElement.style.setProperty("right", `${codeRight}px`);
    //     squareElement.style.setProperty("bottom", `${codeBottom}px`);
    //     squareElement.style.setProperty("left", `${codeLeft}px`);
    // }).catch((error) => {
    //     console.log(error);
    // });
})

log("Application initialised.");
sessionStorage["c92e7678-ee64-5a9d-8d08-158e3fa0ed00"] = "false";

const application = {
    name: "Discrod",
    version: "02208",
    ready: () => sessionStorage.getPropertyValue("c92e7678-ee64-5a9d-8d08-158e3fa0ed00"),
    config: {
        load: () => {
            if(!localStorage["b8ace5fd-4b18-5574-aa0f-67d81f47bab6"]) {
                localStorage["b8ace5fd-4b18-5574-aa0f-67d81f47bab6"] = "{}";
            }
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
            // if (location.hostname.includes("127" || "localhost" || "192")) 
            return { display: "staging", pwa: true, browser: false };
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


document.querySelectorAll("appTemplate").forEach((element) => element.remove());
window.addEventListener("load", () => {

    root.state({ theme: "light" });

    setTimeout(() => {
        document.querySelector(".app-loader").classList.add("disabled");
        sessionStorage["c92e7678-ee64-5a9d-8d08-158e3fa0ed00"] = "true";
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




/* Components */


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

window.addEventListener("contextmenu", async (event) => {
    event.preventDefault();
    window.location.reload();
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
/* const bottomNavigationView = document.querySelector("header");
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

 */

// document.querySelectorAll("[data-close-notice]").forEach((element) => {
//     element.addEventListener("click", () => {
//         element.closest(".notice").classList.remove("enabled");
//         document.querySelector(".notice-background").classList.remove("enabled");
//     });
// });

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



document.querySelectorAll("[data-screen-layout-close-button]").forEach((element) => {
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

};
function log(string, options) {
    // document.querySelector(".widget-app-debugging-logs").insertAdjacentHTML("beforeend", `<div data-element-id="_app" class="debugging-adapter-item"><p data-element-id="_app" class="log-message ${options?.priority}">${string}</p></div>`);
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