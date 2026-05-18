const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

Modal.element = [];

function Modal(options = {}) {
    const {
        templateId,
        destroyOnClose = true,
        cssClass = [],
        closeMethods = ["button", "overlay", "escape"],
        footer = false,
        onOpen,
        onClose,
    } = options;
    const template = $(`#${templateId}`);

    if (!template) {
        console.error(`#${templateId} does not exist!`);
        return;
    }

    this._allowButtonClose = closeMethods.includes("button");
    this._allowBackdropClose = closeMethods.includes("overlay");
    this._allowEscapeClose = closeMethods.includes("escape");

    this._getScrollbarWidth = () => {
        if(this._scrollbarWidth) return this._scrollbarWidth;

        const div = document.createElement("div");
        Object.assign(div.style, {
            overflow: "scroll",
            position: "absolute",
            top: "-9999px",
        });

        document.body.appendChild(div);
        this._scrollbarWidth = div.offsetWidth - div.clientWidth;
        document.body.removeChild(div);

        return this._scrollbarWidth;
    }
    handleTransitionEnd = (e) => {
        if(e.propertyName !== "transform") return;

    }


    this._build = () => {
        const content = template.content.cloneNode(true);

        // Create modal elements
        this._backdrop = document.createElement("div");
        this._backdrop.className = "modal-backdrop";

        const container = document.createElement("div");
        container.className = "modal-container";

        cssClass.forEach((className) => {
            if (typeof className === "string") {
                container.classList.add(className);
            }
        });

        if (this._allowButtonClose) {
            const closeBtn = this._createButton("&times;", "modal-close", this.close)

            container.append(closeBtn);
        }

        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";

        // Append content and elements
        modalContent.append(content);
        container.append(modalContent);

        if(footer){
            this._modalFooter = document.createElement("div");
            this._modalFooter.className = "modal-footer";

            this._renderFooterContent();
            this._renderFooterButton();

            container.append(this._modalFooter);
        }

        this._backdrop.append(container);
        document.body.append(this._backdrop);
    };

    this.setFooterContent = (html) => {
        this._footerContent = html;
        this._renderFooterContent();
    }

    this._footerButton = [];

    this.addFooterButton = (title, cssClass, callback) => {
        const btn = this._createButton(title, cssClass, callback)

        this._footerButton.push(btn);
        this._renderFooterButton()
    }

    this._renderFooterContent = () => {
        if(this._modalFooter && this._footerContent){
            this._modalFooter.innerHTML = this._footerContent;
        }
    }
    this._renderFooterButton = () =>{
        if(this._modalFooter){
            this._footerButton.forEach( btn => {
                this._modalFooter.appendChild(btn)
            })
        }
    }
    this._createButton = (title, cssClass, callback) => {
        const btn = document.createElement('button');
        btn.className = cssClass;
        btn.innerHTML = title;
        btn.onclick = callback;

        return btn;
    }

    this.open = () => {
        Modal.element.push(this);

        if(typeof onOpen === "function") onOpen();

        if (!this._backdrop) {
            this._build();
        }

        setTimeout(() => {
            this._backdrop.classList.add("show");
        }, 0);

        // Disable scrolling
        document.body.classList.add("no-scroll");
        document.body.style.paddingRight = this._getScrollbarWidth() + "px";

        // Attach event listeners
        if (this._allowBackdropClose) {
            this._backdrop.onclick = (e) => {
                if (e.target === this._backdrop) {
                    this.close();
                }
            };
        }

        if (this._allowEscapeClose) {
            document.addEventListener("keydown", this._handleEscapeKey);
        }
         this.onTransitionEnd(onOpen);
        return this._backdrop;
    };

    this._handleEscapeKey = (e) => {
        const lastModal =  Modal.element[Modal.element.length - 1];

        if (e.key === "Escape" && this === lastModal) {
            this.close();
        }
    }

    this.onTransitionEnd = (callback) => {
        this._backdrop.ontransitionend = (e) => {
            if(e.propertyName !== "transform") return;
            if(typeof callback === "function") callback();
        };
    }

    this.close = (destroy = destroyOnClose) => {
        this._backdrop.classList.remove("show");

        if (this._allowEscapeClose) {
            document.removeEventListener("keydown", this._handleEscapeKey);
        }

        this.onTransitionEnd(() => {
            if (this._backdrop && destroy) {
                this._backdrop.remove();
                this._backdrop = null;
                this._modalFooter = null;
            }

            // Enable scrolling
            if(Modal.element.length > -1){
                document.body.classList.remove("no-scroll");
                document.body.style.paddingRight = "";

            }

            if(typeof onClose === "function") onClose();
        });
    };

    this.destroy = () => {
        this.close(true);
    };
}

const modal1 = new Modal({
    templateId: "modal-1",
    destroyOnClose: false,
    onOpen: () => {
        console.log("Modal 1 opened");
    },
    onClose: () => {
        console.log("Modal 1 closed");
    },
});

$("#open-modal-1").onclick = () => {
    const modalElement = modal1.open();
};

const modal2 = new Modal({
    templateId: "modal-2",
    closeMethods: [],
    footer: true,
    cssClass: ["class1", "class2", "classN"],
    footer: true,
    onOpen: () => {
        console.log("Modal 2 opened");
    },
    onClose: () => {
        console.log("Modal 2 closed");
    },
});

modal2.addFooterButton("Danger", "modal-btn danger pull-left", (e) => {
    modal2.close();
} );
modal2.addFooterButton("Cancel", "modal-btn", (e) => {
    modal2.close();
} );
$("#open-modal-2").onclick = () => {
    const modalElement = modal2.open();

    const form = modalElement.querySelector("#login-form");
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const formData = {
                email: $("#email").value.trim(),
                password: $("#password").value.trim(),
            };

            console.log(formData);
        };
    }
};

const modal3 = new Modal({
    templateId: "modal-3",
    // closeMethods: [],
    footer: true,
    cssClass: ["class1", "class2", "classN"],
    footer: true,
    onOpen: () => {
        console.log("Modal 3 opened");
    },
    onClose: () => {
        console.log("Modal 3 closed");
    },
});
modal3.addFooterButton("<span>Agree</span>", "modal-btn primary", (e) => {
    modal3.close();
} );
// modal3.setFooterContent("<h2>set Footer Content</h2>");
$("#open-modal-3").onclick = () => {
    const modalElement = modal3.open();

    const form = modalElement.querySelector("#login-form");
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const formData = {
                email: $("#email").value.trim(),
                password: $("#password").value.trim(),
            };

            console.log(formData);
        };
    }
};
