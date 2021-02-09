"use strict";
/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/cookie-consent-js
 * License: MIT, see file 'LICENSE'
 */
exports.__esModule = true;
exports.CookieConsent = void 0;
var CookieConsent = /** @class */ (function () {
    function CookieConsent(props) {
        this.props = {
            buttonPrimaryClass: "btn btn-primary",
            buttonSecondaryClass: "btn btn-secondary",
            privacyPolicyUrl: "privacy-policy.html",
            autoShowModal: true,
            lang: navigator.language,
            blockAccess: false,
            position: "right",
            postSelectionCallback: undefined,
            content: {
                de: {
                    title: "Cookie-Einstellungen",
                    body: "Wir nutzen Cookies, um Inhalte zu personalisieren und die Zugriffe auf unsere Website zu analysieren. " +
                        "Sie können wählen, ob Sie nur für die Funktion der Website notwendige Cookies akzeptieren oder auch " +
                        "Tracking-Cookies zulassen möchten. Weitere Informationen finden Sie in unserer --privacy-policy--.",
                    privacyPolicy: "Datenschutzerklärung",
                    buttonAcceptAll: "Alle Cookies akzeptieren",
                    buttonAcceptTechnical: "Nur technisch notwendige Cookies akzeptieren"
                },
                en: {
                    title: "Cookie settings",
                    body: "We use cookies to personalize content and analyze access to our website. " +
                        "You can choose whether you only accept cookies that are necessary for the functioning of the website " +
                        "or whether you also want to allow tracking cookies. For more information, please refer to our --privacy-policy--.",
                    privacyPolicy: "privacy policy",
                    buttonAcceptAll: "Accept all cookies",
                    buttonAcceptTechnical: "Only accept technically necessary cookies"
                }
            },
            cookieName: "cookie-consent-tracking-allowed",
            modalId: "cookieConsentModal" // the id of the modal dialog element
        };
        for (var property in props) {
            // noinspection JSUnfilteredForInLoop
            this.props[property] = props[property];
        }
        this.lang = this.props.lang;
        if (this.lang.indexOf("-") !== -1) {
            this.lang = this.lang.split("-")[0];
        }
        if (this.props.content[this.lang] === undefined) {
            this.lang = "en"; // fallback
        }
        var _t = this.props.content[this.lang];
        var linkPrivacyPolicy = '<a href="' + this.props.privacyPolicyUrl + '">' + _t.privacyPolicy + '</a>';
        var modalClass = "cookie-consent-modal";
        if (this.props.blockAccess) {
            modalClass += " block-access";
        }
        this.modalContent = '<div class="' + modalClass + '">' +
            '<div class="modal-content-wrap ' + this.props.position + '">' +
            '<div class="modal-content">' +
            '<div class="modal-header">--header--</div>' +
            '<div class="modal-body">--body--</div>' +
            '<div class="modal-footer">--footer--</div>' +
            '</div></div>';
        this.modalContent = this.modalContent.replace(/--header--/, "<h3 class=\"modal-title\">" + _t.title + "</h3>");
        this.modalContent = this.modalContent.replace(/--body--/, _t.body.replace(/--privacy-policy--/, linkPrivacyPolicy));
        this.modalContent = this.modalContent.replace(/--footer--/, "<div class='buttons'>" +
            "<button class='btn-accept-necessary " + this.props.buttonSecondaryClass + "'>" + _t.buttonAcceptTechnical + "</button>" +
            "<button class='btn-accept-all " + this.props.buttonPrimaryClass + "'>" + _t.buttonAcceptAll + "</button>" +
            "</div>");
    }
    CookieConsent.setCookie = function (name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; Path=/; SameSite=Strict;";
    };
    CookieConsent.getCookie = function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return undefined;
    };
    CookieConsent.removeCookie = function (name) {
        document.cookie = name + '=; Path=/; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    };
    CookieConsent.documentReady = function (fn) {
        if (document.readyState !== 'loading') {
            fn();
        }
        else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    };
    CookieConsent.prototype.hideDialog = function () {
        this.modal.style.display = "none";
    };
    CookieConsent.prototype.showDialog = function () {
        var _this = this;
        CookieConsent.documentReady(function () {
            _this.modal = document.getElementById(_this.props.modalId);
            if (!_this.modal) {
                _this.modal = document.createElement("div");
                _this.modal.id = _this.props.modalId;
                _this.modal.innerHTML = _this.modalContent;
                document.body.append(_this.modal);
                _this.modal.querySelector(".btn-accept-necessary").addEventListener("click", function () {
                    CookieConsent.setCookie(_this.props.cookieName, "false", 365);
                    _this.hideDialog();
                    if (_this.props.postSelectionCallback) {
                        _this.props.postSelectionCallback();
                    }
                });
                _this.modal.querySelector(".btn-accept-all").addEventListener("click", function () {
                    CookieConsent.setCookie(_this.props.cookieName, "true", 365);
                    _this.hideDialog();
                    if (_this.props.postSelectionCallback) {
                        _this.props.postSelectionCallback();
                    }
                });
            }
            else {
                _this.modal.style.display = "block";
            }
        });
    };
    // API
    CookieConsent.prototype.init = function () {
        if (CookieConsent.getCookie(this.props.cookieName) === undefined && this.props.autoShowModal) {
            this.showDialog();
        }
    };
    CookieConsent.prototype.reset = function () {
        CookieConsent.removeCookie(this.props.cookieName);
        this.showDialog();
    };
    CookieConsent.prototype.trackingAllowed = function () {
        return CookieConsent.getCookie(this.props.cookieName) === "true";
    };
    return CookieConsent;
}());
exports.CookieConsent = CookieConsent;
