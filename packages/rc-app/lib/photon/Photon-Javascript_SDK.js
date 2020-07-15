var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/// --------------------------------------------------------------------------------------------------------------------------------------------------------------
/// ------------------- Exitgames.Common
/// --------------------------------------------------------------------------------------------------------------------------------------------------------------
/**
    Exitgames
    @namespace Exitgames
*/
/**
    Exitgames utilities
    @namespace Exitgames.Common
*/
var Exitgames;
(function (Exitgames) {
    var Common;
    (function (Common) {
        var Logger = /** @class */ (function () {
            /**
                @classdesc Logger with ability to control logging level.
                Prints messages to browser console.
                Each logging method perfoms toString() calls and default formatting of arguments only after it checks logging level. Therefore disabled level logging method call with plain arguments doesn't involves much overhead.
                But if one prefer custom formatting or some calculation for logging methods arguments he should check logging level before doing this to avoid unnecessary operations:
                if(logger.isLevelEnabled(Logger.Level.DEBUG)) {
                    logger.debug("", someCall(x, y), x + "," + y);
                }
                @constructor Exitgames.Common.Logger
                @param {string} [prefix=""] All log messages will be prefixed with that.
                @param {Exitgames.Common.Logger.Level} [level=Level.INFO] Initial logging level.
            */
            function Logger(prefix, level) {
                if (prefix === void 0) { prefix = ""; }
                if (level === void 0) { level = Logger.Level.INFO; }
                this.prefix = prefix;
                this.level = level;
            }
            /**
                @summary Sets logger prefix.
                @method Exitgames.Common.Logger#setPrefix
                @param {stirng} prefix New prefix.
            */
            Logger.prototype.setPrefix = function (prefix) {
                this.prefix = prefix;
            };
            /**
                @summary Gets logger prefix.
                @method Exitgames.Common.Logger#getPrefix
                @returns {string} Prefix.
            */
            Logger.prototype.getPrefix = function () {
                return this.prefix;
            };
            /**
                @summary Changes current logging level.
                @method Exitgames.Common.Logger#setLevel
                @param {Exitgames.Common.Logger.Level} level New logging level.
            */
            Logger.prototype.setLevel = function (level) {
                level = Math.max(level, Logger.Level.DEBUG);
                level = Math.min(level, Logger.Level.OFF);
                this.level = level;
            };
            /**
                @summary Sets global method to be called on logger.exception call.
                @method Exitgames.Common.Logger#setExceptionHandler
                @param {(string) => boolean} handler Exception handler. Return true to cancel throwing.
            */
            Logger.setExceptionHandler = function (handler) {
                this.exceptionHandler = handler;
            };
            /**
                @summary Checks if logging level active.
                @method Exitgames.Common.Logger#isLevelEnabled
                @param {Exitgames.Common.Logger.Level} level Level to check.
                @returns {boolean} True if level active.
            */
            Logger.prototype.isLevelEnabled = function (level) { return level >= this.level; };
            /**
                @summary Returns current logging level.
                @method Exitgames.Common.Logger#getLevel
                @returns {Exitgames.Common.Logger.Level} Current logging level.
            */
            Logger.prototype.getLevel = function () { return this.level; };
            /**
                @summary Logs message if logging level = DEBUG, INFO, WARN, ERROR
                @method Exitgames.Common.Logger#debug
                @param {string} mess Message to log.
                @param {...any} optionalParams For every additional parameter toString() applies and result added to the end of log message after space character.
            */
            Logger.prototype.debug = function (mess) {
                var optionalParams = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    optionalParams[_i - 1] = arguments[_i];
                }
                this.log(Logger.Level.DEBUG, mess, optionalParams);
            };
            /**
                @summary Logs message if logging level = INFO, WARN, ERROR
                @method Exitgames.Common.Logger#info
                @param {string} mess Message to log.
                @param {...any} optionalParams For every additional parameter toString() applies and result added to the end of log message after space character.
            */
            Logger.prototype.info = function (mess) {
                var optionalParams = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    optionalParams[_i - 1] = arguments[_i];
                }
                this.log(Logger.Level.INFO, mess, optionalParams);
            };
            /**
                @summary Logs message if logging level = WARN, ERROR
                @method Exitgames.Common.Logger#warn
                @param {string} mess Message to log.
                @param {...any} optionalParams For every additional parameter toString() applies and result added to the end of log message after space character.
            */
            Logger.prototype.warn = function (mess) {
                var optionalParams = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    optionalParams[_i - 1] = arguments[_i];
                }
                this.log(Logger.Level.WARN, mess, optionalParams);
            };
            /**
                @summary Logs message if logging level = ERROR
                @method Exitgames.Common.Logger#error
                @param {string} mess Message to log.
                @param {...any} optionalParams For every additional parameter toString() applies and result added to the end of log message after space character.
            */
            Logger.prototype.error = function (mess) {
                var optionalParams = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    optionalParams[_i - 1] = arguments[_i];
                }
                this.log(Logger.Level.ERROR, mess, optionalParams);
            };
            /**
                @summary Throws an Error or executes exception handler if set.
                @method Exitgames.Common.Logger#exception
                @param {string} mess Message passed to Error or exception handler.
                @param {...any} optionalParams For every additional parameter toString() applies and result added to the end of log message after space character.
            */
            Logger.prototype.exception = function (code, mess) {
                var optionalParams = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    optionalParams[_i - 2] = arguments[_i];
                }
                if (Logger.exceptionHandler && Logger.exceptionHandler(code, this.format0(mess, optionalParams))) {
                    return;
                }
                throw new Error(this.format0("[" + code + "] " + mess, optionalParams));
            };
            /**
                @summary Applies default logger formatting to arguments
                @method Exitgames.Common.Logger#format
                @param {string} mess String to start formatting with.
                @param {...any} optionalParams For every additional parameter toString() applies and result added to the end of formatted string after space character.
                @returns {string} Formatted string.
            */
            Logger.prototype.format = function (mess) {
                var optionalParams = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    optionalParams[_i - 1] = arguments[_i];
                }
                return this.format0(mess, optionalParams);
            };
            /**
                @summary Applies default logger formatting to array of objects.
                @method Exitgames.Common.Logger#format
                @param {string} mess String to start formatting with.
                @param {any[]} optionalParams For every additional parameter toString() applies and result added to the end of formatted string after space character.
                @returns {string} Formatted string.
            */
            Logger.prototype.formatArr = function (mess, optionalParams) { return this.format0(mess, optionalParams); };
            Logger.prototype.log = function (level, msg, optionalParams) {
                if (level >= this.level) {
                    // for global vars console !== undefined throws an error
                    if (typeof console !== "undefined" && msg !== undefined) {
                        try {
                            var logMethod = console[Logger.log_types[level]];
                            if (!logMethod) {
                                logMethod = console["log"];
                            }
                            if (logMethod) {
                                logMethod.apply(console, [this.prefix, msg].concat(optionalParams));
                            }
                        }
                        catch (error) {
                            // silently fail
                        }
                    }
                }
            };
            Logger.prototype.format0 = function (msg, optionalParams) {
                return (this.prefix == "" ? "" : this.prefix + " ") + msg + " " + optionalParams.map(function (x) {
                    if (x !== undefined) {
                        switch (typeof x) {
                            case "object":
                                try {
                                    return JSON.stringify(x);
                                }
                                catch (error) {
                                    return x.toString() + "(" + error + ")";
                                }
                            default:
                                return x.toString();
                        }
                    }
                }).join(" ");
            };
            /**
                @summary Logging levels. Set to restrict log output.
                @member Exitgames.Common.Logger.Level
                @readonly
                @property {number} DEBUG All logging methods enabled.
                @property {number} INFO info(...), warn(...), error(...) methods enabled.
                @property {number} WARN warn(...) and error(...) methods enabled.
                @property {number} ERROR Only error(...) method enabled.
                @property {number} OFF Logging off.
            */
            Logger.Level = {
                //TRACE : 0,
                DEBUG: 1,
                INFO: 2,
                WARN: 3,
                ERROR: 4,
                //FATAL: 5,
                OFF: 6
            };
            Logger.log_types = ["debug", "debug", "info", "warn", "error"];
            return Logger;
        }());
        Common.Logger = Logger;
        var Util = /** @class */ (function () {
            function Util() {
            }
            Util.indexOf = function (arr, item, from) {
                for (var l = arr.length, i = from < 0 ? Math.max(0, l + from) : from || 0; i < l; i++) {
                    if (arr[i] === item) {
                        return i;
                    }
                }
                return -1;
            };
            Util.isArray = function (obj) {
                return Object.prototype.toString.call(obj) === "[object Array]";
            };
            //TODO: naming. could be named mergeHashtable or something more specific
            Util.merge = function (target, additional) {
                for (var i in additional) {
                    if (additional.hasOwnProperty(i)) {
                        target[i] = additional[i];
                    }
                }
            };
            Util.getPropertyOrElse = function (obj, prop, defaultValue) {
                if (obj.hasOwnProperty(prop)) {
                    return obj[prop];
                }
                else {
                    return defaultValue;
                }
            };
            Util.enumValueToName = function (enumObj, value) {
                for (var i in enumObj) {
                    if (value == enumObj[i]) {
                        return i;
                    }
                }
                return "undefined";
            };
            Util.getEnumKeyByValue = function (enumObj, value) {
                for (var i in enumObj) {
                    if (value == enumObj[i]) {
                        return i;
                    }
                }
                return undefined;
            };
            return Util;
        }());
        Common.Util = Util;
    })(Common = Exitgames.Common || (Exitgames.Common = {}));
})(Exitgames || (Exitgames = {}));
/// <reference path="photon-common.ts"/>
/**
    Photon
    @namespace Photon
*/
var Photon;
(function (Photon) {
    /**
        @summary These are the options that can be used as underlying transport protocol.
        @member Photon.ConnectionProtocol
        @readonly
        @property {number} Ws WebSockets connection.
        @property {number} Wss WebSockets Secure connection.
    **/
    var ConnectionProtocol;
    (function (ConnectionProtocol) {
        ConnectionProtocol[ConnectionProtocol["Ws"] = 0] = "Ws";
        ConnectionProtocol[ConnectionProtocol["Wss"] = 1] = "Wss";
    })(ConnectionProtocol = Photon.ConnectionProtocol || (Photon.ConnectionProtocol = {}));
    // Stubs for extended types used by photon-peer-em (emscripten)
    var TypeExtType = /** @class */ (function () {
        function TypeExtType() {
        }
        return TypeExtType;
    }());
    Photon.TypeExtType = TypeExtType;
    var TypeExt = /** @class */ (function () {
        function TypeExt() {
        }
        TypeExt.Is = function (x) {
            return false;
        };
        TypeExt.Byte = function (x) {
            return x;
        };
        TypeExt.Short = function (x) {
            return x;
        };
        TypeExt.Int = function (x) {
            return x;
        };
        TypeExt.Long = function (x) {
            return x;
        };
        TypeExt.Float = function (x) {
            return x;
        };
        TypeExt.Double = function (x) {
            return x;
        };
        TypeExt.String = function (x) {
            return x;
        };
        TypeExt.Bool = function (x) {
            return x;
        };
        TypeExt.Dict = function (t1, t2, x) {
            return x;
        };
        return TypeExt;
    }());
    Photon.TypeExt = TypeExt;
    var PhotonPeer = /** @class */ (function () {
        /**
            @classdesc Instances of the PhotonPeer class are used to connect to a Photon server and communicate with it.
            A PhotonPeer instance allows communication with the Photon Server, which in turn distributes messages to other PhotonPeer clients.
            An application can use more than one PhotonPeer instance, which are treated as separate users on the server.
            Each should have its own listener instance, to separate the operations, callbacks and events.
            @constructor Photon.PhotonPeer
            @param {Photon.ConnectionProtocol} protocol Connection protocol.
            @param {string} address Server address:port.
            @param {string} [subprotocol=""] WebSocket protocol.
            @param {string} [debugName=""] Log messages prefixed with this value.
        */
        function PhotonPeer(protocol, address, subprotocol, debugName) {
            if (subprotocol === void 0) { subprotocol = ""; }
            if (debugName === void 0) { debugName = ""; }
            this.protocol = protocol;
            this.address = address;
            this.subprotocol = subprotocol;
            /**
                @summary Peer sends 'keep alive' message to server as this timeout exceeded after last send operation.
                Set it < 1000 to disable 'keep alive' operation
                @member Photon.PhotonPeer#keepAliveTimeoutMs
                @type {number}
                @default 3000
            */
            this.keepAliveTimeoutMs = 3000;
            this._frame = "~m~";
            this._isConnecting = false;
            this._isConnected = false;
            this._isClosing = false;
            this._peerStatusListeners = {};
            this._eventListeners = {};
            this._responseListeners = {};
            this.lastRtt = 0;
            this.initTimestamp = Date.now();
            this.keepAliveTimer = 0;
            this.url = this.addProtocolPrefix(this.address, this.protocol);
            this._logger = new Exitgames.Common.Logger(debugName && debugName != "" ? debugName + ":" : "");
        }
        PhotonPeer.prototype.addProtocolPrefix = function (address, protocol) {
            var protocolPrefix = {
                ws: "ws://",
                wss: "wss://"
            };
            for (var k in protocolPrefix) {
                if (address.indexOf(protocolPrefix[k]) == 0) {
                    return address;
                }
            }
            switch (protocol) {
                case ConnectionProtocol.Ws:
                    return protocolPrefix.ws + address;
                case ConnectionProtocol.Wss:
                    return protocolPrefix.wss + address;
                default:// error
                    return protocolPrefix.ws + address;
            }
        };
        PhotonPeer.prototype.Destroy = function () {
        };
        /**
            @summary Checks if peer is connecting.
            @method Photon.PhotonPeer#isConnecting
            @returns {boolean} True if peer is connecting.
        */
        PhotonPeer.prototype.isConnecting = function () { return this._isConnecting; };
        PhotonPeer.prototype.getLastRtt = function () { return this.lastRtt; };
        /**
            @summary Checks if peer is connected.
            @method Photon.PhotonPeer#isConnected
            @returns {boolean} True if peer is connected.
        */
        PhotonPeer.prototype.isConnected = function () { return this._isConnected; };
        /**
            @summary Checks if peer is closing.
            @method Photon.PhotonPeer#isClosing
            @returns {boolean} True if peer is closing.
        */
        PhotonPeer.prototype.isClosing = function () { return this._isClosing; };
        /**
            @summary Starts connection to server.
            @method Photon.PhotonPeer#connect
        */
        PhotonPeer.prototype.connect = function (appid) {
            var _this = this;
            this._sessionid = undefined;
            var url = this.url + "/" + appid + "?libversion=4.1.0.0";
            if (this.subprotocol == "") {
                this._socket = new WebSocket(url, "Json");
            }
            else {
                this._socket = new WebSocket(url, this.subprotocol);
            }
            this._onConnecting();
            // Set event handlers.
            this._socket.onopen = function (ev) {
                //this.logger.debug("onopen");
            };
            this._socket.onmessage = function (ev) {
                var message = _this._decode(ev.data);
                _this._onMessage(message.toString());
            };
            this._socket.onclose = function (ev) {
                _this._logger.debug("onclose: wasClean =", ev.wasClean, ", code=", ev.code, ", reason =", ev.reason);
                if (_this._isConnecting) {
                    _this._onConnectFailed(ev);
                }
                else {
                    if (1006 == ev.code) {
                        _this._onTimeout();
                    }
                    _this._onDisconnect();
                }
            };
            this._socket.onerror = function (ev) {
                _this._onError(ev);
            };
        };
        /**
            @summary Disconnects from server.
            @method Photon.PhotonPeer#disconnect
        */
        PhotonPeer.prototype.disconnect = function () {
            this._isClosing = true;
            this._socket.close();
        };
        /**
            @summary Sends operation to the Photon Server.
            @method Photon.PhotonPeer#sendOperation
            @param {number} code Code of operation.
            @param {object} [data] Parameters of operation as a flattened array of key-value pairs: [key1, value1, key2, value2...]
            @param {boolean} [sendReliable=false] Selects if the operation must be acknowledged or not. If false, the operation is not guaranteed to reach the server.
            @param {number} [channelId=0] The channel in which this operation should be sent.
        */
        PhotonPeer.prototype.sendOperation = function (code, data, sendReliable, channelId) {
            if (sendReliable === void 0) { sendReliable = false; }
            if (channelId === void 0) { channelId = 0; }
            var sndJSON = { "req": code, "vals": [] };
            if (Exitgames.Common.Util.isArray(data)) {
                sndJSON["vals"] = data;
            }
            else {
                if (data === undefined) {
                    sndJSON["vals"] = [];
                }
                else {
                    this._logger.exception(201, "PhotonPeer[sendOperation] - Trying to send non array data:", data);
                }
            }
            this._send(sndJSON);
            this._logger.debug("PhotonPeer[sendOperation] - Sending request:", sndJSON);
        };
        /**
            @summary Registers listener for peer status change.
            @method Photon.PhotonPeer#addPeerStatusListener
            @param {PhotonPeer.StatusCodes} statusCode Status change to this value will be listening.
            @param {Function} callback The listener function that processes the status change. This function don't accept any parameters.
        */
        PhotonPeer.prototype.addPeerStatusListener = function (statusCode, callback) {
            this._addListener(this._peerStatusListeners, statusCode, callback);
        };
        /**
            @summary Registers listener for custom event.
            @method Photon.PhotonPeer#addEventListener
            @param {number} eventCode Custom event code.
            @param {Function} callback The listener function that processes the event. This function may accept object with event content.
        */
        PhotonPeer.prototype.addEventListener = function (eventCode, callback) {
            this._addListener(this._eventListeners, eventCode.toString(), callback);
        };
        /**
            @summary Registers listener for operation response.
            @method Photon.PhotonPeer#addResponseListener
            @param {number} operationCode Operation code.
            @param {Function} callback The listener function that processes the event. This function may accept object with operation response content.
        */
        PhotonPeer.prototype.addResponseListener = function (operationCode, callback) {
            this._addListener(this._responseListeners, operationCode.toString(), callback);
        };
        /**
            @summary Removes listener if exists for peer status change.
            @method Photon.PhotonPeer#removePeerStatusListener
            @param {string} statusCode One of PhotonPeer.StatusCodes to remove listener for.
            @param {Function} callback Listener to remove.
        */
        PhotonPeer.prototype.removePeerStatusListener = function (statusCode, callback) {
            this._removeListener(this._peerStatusListeners, statusCode, callback);
        };
        /**
            @summary Removes listener if exists for custom event.
            @method Photon.PhotonPeer#removeEventListener
            @param {number} eventCode Event code to remove to remove listener for.
            @param {Function} callback Listener to remove.
        */
        PhotonPeer.prototype.removeEventListener = function (eventCode, callback) {
            this._removeListener(this._eventListeners, eventCode.toString(), callback);
        };
        /**
            @summary Removes listener if exists for operation response.
            @method Photon.PhotonPeer#removeResponseListener
            @param {number} operationCode Operation code to remove listener for.
            @param {Function} callback Listener to remove.
        */
        PhotonPeer.prototype.removeResponseListener = function (operationCode, callback) {
            this._removeListener(this._responseListeners, operationCode.toString(), callback);
        };
        /**
            @summary Removes all listeners for peer status change specified.
            @method Photon.PhotonPeer#removePeerStatusListenersForCode
            @param {string} statusCode One of PhotonPeer.StatusCodes to remove all listeners for.
        */
        PhotonPeer.prototype.removePeerStatusListenersForCode = function (statusCode) {
            this._removeListenersForCode(this._peerStatusListeners, statusCode);
        };
        /**
            @summary Removes all listeners for custom event specified.
            @method Photon.PhotonPeer#removeEventListenersForCode
            @param {number} eventCode Event code to remove all listeners for.
        */
        PhotonPeer.prototype.removeEventListenersForCode = function (eventCode) {
            this._removeListenersForCode(this._eventListeners, eventCode.toString());
        };
        /**
            @summary Removes all listeners for operation response specified.
            @method Photon.PhotonPeer#removeResponseListenersForCode
            @param {number} operationCode Operation code to remove all listeners for.
        */
        PhotonPeer.prototype.removeResponseListenersForCode = function (operationCode) {
            this._removeListenersForCode(this._responseListeners, operationCode.toString());
        };
        /**
            @summary Sets peer logger level.
            @method Photon.PhotonPeer#setLogLevel
            @param {Exitgames.Common.Logger.Level} level Logging level.
        */
        PhotonPeer.prototype.setLogLevel = function (level) {
            this._logger.setLevel(level);
        };
        /**
            @summary Called if no listener found for received custom event.
            Override to relay unknown event to user's code or handle known events without listener registration.
            @method Photon.PhotonPeer#onUnhandledEvent
            @param {number} eventCode Code of received event.
            @param {object} [args] Content of received event or empty object.
        */
        PhotonPeer.prototype.onUnhandledEvent = function (eventCode, args) {
            this._logger.warn('PhotonPeer: No handler for event', eventCode, 'registered.');
        };
        /**
            @summary Called if no listener found for received operation response event.
            Override to relay unknown response to user's code or handle known responses without listener registration.
            @method Photon.PhotonPeer#onUnhandledEvent
            @param {number} operationCode Code of received response.
            @param {object} [args] Content of received response or empty object.
        */
        PhotonPeer.prototype.onUnhandledResponse = function (operationCode, args) {
            this._logger.warn('PhotonPeer: No handler for response', operationCode, 'registered.');
        };
        // TODO: lite calls this
        // protected
        PhotonPeer.prototype._dispatchEvent = function (code, args) {
            if (!this._dispatch(this._eventListeners, code.toString(), args, "event")) {
                this.onUnhandledEvent(code, args);
            }
        };
        // TODO: lite calls this
        // protected
        PhotonPeer.prototype._dispatchResponse = function (code, args) {
            if (!this._dispatch(this._responseListeners, code.toString(), args, "response")) {
                this.onUnhandledResponse(code, args);
            }
        };
        PhotonPeer.prototype._stringify = function (message) {
            if (Object.prototype.toString.call(message) == "[object Object]") {
                if (!JSON) {
                    this._logger.exception(202, "PhotonPeer[_stringify] - Trying to encode as JSON, but JSON.stringify is missing.");
                }
                return "~j~" + JSON.stringify(message);
            }
            else {
                return String(message);
            }
        };
        PhotonPeer.prototype._encode = function (messages) {
            var ret = "", message, messages = Exitgames.Common.Util.isArray(messages) ? messages : [messages];
            for (var i = 0, l = messages.length; i < l; i++) {
                message = messages[i] === null || messages[i] === undefined ? "" : this._stringify(messages[i]);
                ret += this._frame + message.length + this._frame + message;
            }
            return ret;
        };
        PhotonPeer.prototype._decode = function (data) {
            var messages = [], number, n, newdata = data;
            var nulIndex = data.indexOf("\x00");
            if (nulIndex !== -1) {
                newdata = data.replace(/[\0]/g, "");
            }
            data = newdata;
            do {
                if (data.substr(0, 3) !== this._frame) {
                    return messages;
                }
                data = data.substr(3);
                number = "", n = "";
                for (var i = 0, l = data.length; i < l; i++) {
                    n = Number(data.substr(i, 1));
                    if (data.substr(i, 1) == n) {
                        number += n;
                    }
                    else {
                        data = data.substr(number.length + this._frame.length);
                        number = Number(number);
                        break;
                    }
                }
                messages.push(data.substr(0, number));
                data = data.substr(number);
            } while (data !== "");
            return messages;
        };
        PhotonPeer.prototype._onMessage = function (message) {
            if (message.substr(0, 3) == "~j~") {
                this._onMessageReceived(JSON.parse(message.substr(3)));
            }
            else {
                if (!this._sessionid) {
                    this._sessionid = message;
                    this._onConnect();
                }
                else {
                    this._onMessageReceived(message);
                }
            }
        };
        PhotonPeer.prototype.resetKeepAlive = function () {
            var _this = this;
            //this._logger.debug("reset kep alive: ", Date.now());
            clearTimeout(this.keepAliveTimer);
            if (this.keepAliveTimeoutMs >= 1000) {
                this.keepAliveTimer = setTimeout(function () {
                    // send time from peer creation to avoid timestamp overflow on server side
                    _this._send((_a = {}, _a["irq"] = 1, _a["vals"] = [1, Date.now() - _this.initTimestamp], _a), true);
                    var _a;
                }, this.keepAliveTimeoutMs);
            }
        };
        PhotonPeer.prototype._send = function (data, checkConnected) {
            if (checkConnected === void 0) { checkConnected = false; }
            var message = this._encode(data);
            if (this._isConnected && !this._isClosing) {
                this.resetKeepAlive();
                //this._logger.debug("_send:", message);
                this._socket.send(message);
            }
            else {
                if (!checkConnected) {
                    this._logger.exception(203, 'PhotonPeer[_send] - Operation', data.req, '- failed, "isConnected" is', this._isConnected, ', "isClosing" is', this._isClosing, "!");
                }
            }
        };
        PhotonPeer.prototype._onMessageReceived = function (message) {
            if (typeof message === "object") {
                this._logger.debug("PhotonPeer[_onMessageReceived] - Socket received message:", message);
                // copy protocol 'message' protocol object to runtime object: the latter's properties can be renamed by minifier.
                var msgJSON = { err: message["err"], msg: message["msg"], vals: message["vals"], res: message["res"], evt: message["evt"], irs: message["irs"] };
                var msgErr = msgJSON.err ? msgJSON.err : 0;
                msgJSON.vals = msgJSON.vals !== undefined ? msgJSON.vals : [];
                if (msgJSON.vals.length > 0) {
                    msgJSON.vals = this._parseMessageValuesArrayToJSON(msgJSON.vals);
                }
                if (msgJSON.res !== undefined) {
                    var code = parseInt(msgJSON.res);
                    this._parseResponse(code, msgJSON);
                }
                else {
                    if (msgJSON.evt !== undefined) {
                        var code = parseInt(msgJSON.evt);
                        this._parseEvent(code, msgJSON);
                    }
                    else {
                        if (msgJSON.irs !== undefined) {
                            var code = parseInt(msgJSON.irs);
                            this._parseInternalResponse(code, msgJSON);
                        }
                        else {
                            this._logger.exception(204, "PhotonPeer[_onMessageReceived] - Received undefined message type:", msgJSON);
                        }
                    }
                }
            }
        };
        PhotonPeer.prototype._parseMessageValuesArrayToJSON = function (vals) {
            var parsedJSON = {};
            if (Exitgames.Common.Util.isArray(vals)) {
                if (vals.length % 2 == 0) {
                    var toParse = vals, key, value;
                    while (toParse.length > 0) {
                        key = toParse.shift() + "";
                        value = toParse.shift();
                        parsedJSON[key] = value;
                    }
                }
                else {
                    this._logger.exception(205, "PhotonPeer[_parseMessageValuesToJSON] - Received invalid values array:", vals);
                }
            }
            return parsedJSON;
        };
        PhotonPeer.prototype._parseEvent = function (code, event) {
            switch (code) {
                default:
                    this._dispatchEvent(code, { vals: event.vals });
                    break;
            }
        };
        PhotonPeer.prototype._parseResponse = function (code, response) {
            switch (code) {
                default:
                    this._dispatchResponse(code, { errCode: response.err, errMsg: response.msg, vals: response.vals });
                    break;
            }
        };
        PhotonPeer.prototype._parseInternalResponse = function (code, response) {
            this.lastRtt = Date.now() - this.initTimestamp - response.vals[1];
            this._logger.debug("internal response:", response);
        };
        PhotonPeer.prototype._onConnecting = function () {
            this._logger.debug("PhotonPeer[_onConnecting] - Starts connecting", this.url, '..., raising "connecting" event ...');
            this._isConnecting = true;
            this._dispatchPeerStatus(PhotonPeer.StatusCodes.connecting);
            this.resetKeepAlive();
        };
        PhotonPeer.prototype._onConnect = function () {
            this._logger.debug('PhotonPeer[_onConnect] - Connected successfully! Raising "connect" event ...');
            this._isConnecting = false;
            this._isConnected = true;
            this._dispatchPeerStatus(PhotonPeer.StatusCodes.connect);
            this.resetKeepAlive();
        };
        PhotonPeer.prototype._onConnectFailed = function (evt) {
            this._logger.error('PhotonPeer[_onConnectFailed] - Socket connection could not be created:', this.url, this.subprotocol, 'Wrong host or port?\n Raising "connectFailed event ...');
            this._isConnecting = this._isConnected = false;
            this._dispatchPeerStatus(PhotonPeer.StatusCodes.connectFailed);
        };
        PhotonPeer.prototype._onDisconnect = function () {
            var wasConnected = this._isConnected;
            var wasClosing = this._isClosing;
            this._logger.debug('PhotonPeer[_onDisconnect] - Socket closed, raising "disconnect" event ...');
            this._isClosing = this._isConnected = this._isConnecting = false;
            if (wasConnected) {
                if (wasClosing) {
                    this._dispatchPeerStatus(PhotonPeer.StatusCodes.disconnect);
                }
                else {
                    this._dispatchPeerStatus(PhotonPeer.StatusCodes.connectClosed);
                }
            }
        };
        PhotonPeer.prototype._onTimeout = function () {
            this._logger.debug('PhotonPeer[_onTimeout] - Client timed out! Raising "timeout" event ...');
            this._dispatchPeerStatus(PhotonPeer.StatusCodes.timeout);
        };
        PhotonPeer.prototype._onError = function (ev) {
            this._logger.error("PhotonPeer[_onError] - Connection error:", arguments[0]);
            this._isConnecting = this._isConnected = this._isClosing = false;
            this._dispatchPeerStatus(PhotonPeer.StatusCodes.error);
        };
        PhotonPeer.prototype._addListener = function (listeners, code, callback) {
            if (!(code in listeners)) {
                listeners[code] = [];
            }
            if (callback && typeof callback === "function") {
                this._logger.debug('PhotonPeer[_addListener] - Adding listener for event', code);
                listeners[code].push(callback);
            }
            else {
                this._logger.error('PhotonPeer[_addListener] - Listener', code, 'is not a function but of type', typeof callback, '. No listener added!');
            }
            return this;
        };
        PhotonPeer.prototype._dispatch = function (listeners, code, args, debugType) {
            if (code in listeners) {
                var events = listeners[code];
                for (var i = 0, l = events.length; i < l; i++) {
                    if (!Exitgames.Common.Util.isArray(args)) {
                        args = [args];
                    }
                    events[i].apply(this, args === undefined ? [] : args);
                }
                return true;
            }
            else {
                return false;
            }
        };
        PhotonPeer.prototype._dispatchPeerStatus = function (code) {
            if (!this._dispatch(this._peerStatusListeners, code, undefined, "peerStatus")) {
                this._logger.warn('PhotonPeer[_dispatchPeerStatus] - No handler for ', code, 'registered.');
            }
        };
        PhotonPeer.prototype._removeListener = function (listeners, code, callback) {
            if ((code in listeners)) {
                var prevLenght = listeners[code].length;
                listeners[code] = listeners[code].filter(function (x) { return x != callback; });
                this._logger.debug('PhotonPeer[_removeListener] - Removing listener for event', code, "removed:", prevLenght - listeners[code].length);
            }
            return this;
        };
        PhotonPeer.prototype._removeListenersForCode = function (listeners, code) {
            this._logger.debug('PhotonPeer[_removeListenersForCode] - Removing all listeners for event', code);
            if (code in listeners) {
                listeners[code] = [];
            }
            return this;
        };
        /**
            @summary Enum for peer status codes.
            Use to subscribe to status changes.
            @member Photon.PhotonPeer.StatusCodes
            @readonly
            @property {string} connecting Is connecting to server.
            @property {string} connect Connected to server.
            @property {string} connectFailed Connection to server failed.
            @property {string} disconnect Disconnected from server.
            @property {string} connectClosed Connection closed by server.
            @property {string} error General connection error.
            @property {string} timeout Disconnected from server for timeout.
        */
        PhotonPeer.StatusCodes = {
            connecting: "connecting",
            connect: "connect",
            connectFailed: "connectFailed",
            disconnect: "disconnect",
            connectClosed: "connectClosed",
            error: "error",
            timeout: "timeout"
        };
        return PhotonPeer;
    }());
    Photon.PhotonPeer = PhotonPeer;
})(Photon || (Photon = {}));
/**
    Photon Load Balancing API
    @namespace Photon.LoadBalancing
*/
var Photon;
(function (Photon) {
    var LoadBalancing;
    (function (LoadBalancing) {
        var WebFlags = {
            HttpForward: 0x01,
            SendAuthCookie: 0x02,
            SendSync: 0x04,
            SendState: 0x08
        };
        var Actor = /** @class */ (function () {
            /**
                @classdesc Summarizes a "player" within a room, identified (in that room) by ID (or "actorNr"). Extend to implement custom logic.
                @constructor Photon.LoadBalancing.Actor
                @param {string} name Actor name.
                @param {number} actorNr Actor ID.
                @param {boolean} isLocal Actor is local.
            */
            function Actor(name, actorNr, isLocal) {
                this.name = name;
                this.actorNr = actorNr;
                this.isLocal = isLocal;
                this.customProperties = {};
                this.suspended = false;
            }
            // public getLoadBalancingClient() { return this.loadBalancingClient; }
            /**
                @summary Actor's room: the room initialized by client for create room operation or room client connected to.
                @method Photon.LoadBalancing.Actor#getRoom
                @returns {Photon.LoadBalancing.Room} Actor's room.
            */
            Actor.prototype.getRoom = function () { return this.loadBalancingClient.myRoom(); };
            /**
                @summary Raises game custom event.
                @method Photon.LoadBalancing.Actor#raiseEvent
                @param {number} eventCode Identifies this type of event (and the content). Your game's event codes can start with 0.
                @param {object} [data] Custom data you want to send along (use null, if none).
                @param {object} [options] Additional options
                @property {object} options Additional options
                @property {number} [options.interestGroup] The ID of the interest group this event goes to (exclusively).
                @property {Photon.LoadBalancing.Constants.EventCaching} [options.cache=EventCaching.DoNotCache] Events can be cached (merged and removed) for players joining later on.
                @property {Photon.LoadBalancing.Constants.ReceiverGroup} [options.receivers=ReceiverGroup.Others] Defines to which group of players the event is passed on.
                @property {number[]} [options.targetActors] Defines the target players who should receive the event (use only for small target groups).
                @property {boolean} [options.webForward=false] Forward to web hook.
            */
            Actor.prototype.raiseEvent = function (eventCode, data, options) {
                if (this.loadBalancingClient) {
                    this.loadBalancingClient.raiseEvent(eventCode, data, options);
                }
            };
            /**
                @summary Sets actor name.
                @method Photon.LoadBalancing.Actor#setName
                @param {string} name Actor name.
            */
            Actor.prototype.setName = function (name) { this.name = name; };
            // properties methods
            /**
                @summary Called on every actor properties update: properties set by client, poperties update from server.
                Override to update custom room state.
                @method Photon.LoadBalancing.Actor#onPropertiesChange
                @param {object} changedCustomProps Key-value map of changed properties.
                @param {boolean} [byClient] true if properties set by client.
            */
            Actor.prototype.onPropertiesChange = function (changedCustomProps, byClient) { };
            /**
                @summary Returns custom property by name.
                @method Photon.LoadBalancing.Actor#getCustomProperty
                @param {string} name Name of the property.
                @returns {object} Property or undefined if property not found.
            */
            Actor.prototype.getCustomProperty = function (name) { return this.customProperties[name]; };
            /**
                @summary Returns custom property by name or default value.
                @method Photon.LoadBalancing.Actor#getCustomPropertyOrElse
                @param {string} name Name of the property.
                @param {object} defaultValue Default property value.
                @returns {object} Property or default value if property not found.
            */
            Actor.prototype.getCustomPropertyOrElse = function (name, defaultValue) { return Exitgames.Common.Util.getPropertyOrElse(this.customProperties, name, defaultValue); };
            /**
                @summary Sets custom property.
                @method Photon.LoadBalancing.Actor#setCustomProperty
                @param {string} name Name of the property.
                @param {object} value Property value.
                @param {boolean} [webForward=false] Forward to web hook.
                @param {object} [expectedValue] Property value expected when update occurs. (CAS : "Check And Swap")
            */
            Actor.prototype.setCustomProperty = function (name, value, webForward, expectedValue) {
                if (webForward === void 0) { webForward = false; }
                this.customProperties[name] = value;
                var props = {};
                props[name] = value;
                var expectedProps;
                if (expectedValue != undefined) {
                    expectedProps = (_a = {}, _a[name] = expectedValue, _a);
                }
                if (this.loadBalancingClient && this.loadBalancingClient.isJoinedToRoom()) {
                    this.loadBalancingClient._setPropertiesOfActor(this.actorNr, props, webForward, expectedProps);
                }
                this.onPropertiesChange(props, true);
                var _a;
            };
            /**
                @summary Sets custom properties.
                @method Photon.LoadBalancing.Actor#setCustomProperties
                @param {object} properties Table of properties to set.
                @param {boolean} [webForward=false] Forward to web hook.
                @param {object} [expectedProperties] Table of properties expected when update occurs. (CAS : "Check And Swap")
            */
            Actor.prototype.setCustomProperties = function (properties, webForward, expectedProperties) {
                if (webForward === void 0) { webForward = false; }
                var props = {};
                for (var name in properties) {
                    this.customProperties[name] = properties[name];
                    props[name] = properties[name];
                }
                if (this.loadBalancingClient && this.loadBalancingClient.isJoinedToRoom()) {
                    this.loadBalancingClient._setPropertiesOfActor(this.actorNr, props, webForward, expectedProperties);
                }
                this.onPropertiesChange(props, true);
            };
            /**
                @summary Returns true if actor is in suspended state.
                @returns {boolean} Actor suspend state.
            **/
            Actor.prototype.isSuspended = function () {
                return this.suspended;
            };
            Actor.prototype._getAllProperties = function () {
                var p = {};
                p[LoadBalancing.Constants.ActorProperties.PlayerName] = this.name;
                for (var k in this.customProperties) {
                    p[k] = this.customProperties[k];
                }
                return p;
            };
            Actor.prototype._setLBC = function (lbc) { this.loadBalancingClient = lbc; };
            Actor.prototype._updateFromResponse = function (vals) {
                this.actorNr = vals[LoadBalancing.Constants.ParameterCode.ActorNr];
                var props = vals[LoadBalancing.Constants.ParameterCode.PlayerProperties];
                if (props !== undefined) {
                    var name = props[LoadBalancing.Constants.ActorProperties.PlayerName];
                    if (name !== undefined) {
                        this.name = name;
                    }
                    this._updateCustomProperties(props);
                }
            };
            Actor.prototype._updateMyActorFromResponse = function (vals) {
                this.actorNr = vals[LoadBalancing.Constants.ParameterCode.ActorNr];
            };
            Actor.prototype._updateCustomProperties = function (vals) {
                for (var p in vals) {
                    this.customProperties[p] = vals[p];
                }
                this.onPropertiesChange(vals, false);
            };
            Actor.prototype._setSuspended = function (s) {
                this.suspended = s;
            };
            Actor._getActorNrFromResponse = function (vals) {
                return vals[LoadBalancing.Constants.ParameterCode.ActorNr];
            };
            return Actor;
        }());
        LoadBalancing.Actor = Actor;
        // readonly room info from server
        var RoomInfo = /** @class */ (function () {
            /**
                @classdesc Used for Room listings of the lobby (not yet joining). Offers the basic info about a room: name, player counts, properties, etc.
                @constructor Photon.LoadBalancing.RoomInfo
                @param {string} name Room name.
            */
            function RoomInfo(name) {
                // standard room properties
                // TODO: access via getters
                /**
                    @summary Room name.
                    @member Photon.LoadBalancing.RoomInfo#name
                    @type {string}
                    @readonly
                */
                this.name = "";
                /**
                    @summary Joined room Game server address.
                    @member Photon.LoadBalancing.RoomInfo#address
                    @type {string}
                    @readonly
                */
                this.address = "";
                /**
                    @summary Max players before room is considered full.
                    @member Photon.LoadBalancing.RoomInfo#maxPlayers
                    @type {number}
                    @readonly
                */
                this.maxPlayers = 0;
                /**
                    @summary Shows the room in the lobby's room list. Makes sense only for local room.
                    @member Photon.LoadBalancing.RoomInfo#isVisible
                    @type {boolean}
                    @readonly
                */
                this.isVisible = true;
                /**
                    @summary Defines if this room can be joined.
                    @member Photon.LoadBalancing.RoomInfo#isOpen
                    @type {boolean}
                    @readonly
                */
                this.isOpen = true;
                /**
                    @summary Count of player currently in room.
                    @member Photon.LoadBalancing.RoomInfo#playerCount
                    @type {number}
                    @readonly
                */
                this.playerCount = 0;
                /**
                    @summary Time in ms indicating how long the room instance will be keeped alive in the server room cache after all clients have left the room.
                    @member Photon.LoadBalancing.RoomInfo#emptyRoomLiveTime
                    @type {number}
                    @readonly
                */
                this.emptyRoomLiveTime = 0;
                /**
                    @summary Time in ms indicating how long suspended player will be kept in the room.
                    @member Photon.LoadBalancing.RoomInfo#suspendedPlayerLiveTime
                    @type {number}
                    @readonly
                **/
                this.suspendedPlayerLiveTime = 0;
                /**
                    @summary Room removed (in room list updates).
                    @member Photon.LoadBalancing.RoomInfo#removed
                    @type {boolean}
                    @readonly
                */
                this.removed = false;
                // TODO: does end user need this?
                this.cleanupCacheOnLeave = false;
                /**
                    @summary Master client set by game server. Note: Not all servers support this currently. If the value of the property is 0, use lowest actorid instead.
                    @member Photon.LoadBalancing.RoomInfo#masterClientId
                    @type { number }
                    @readonly
                */
                this.masterClientId = 0;
                // custom properties
                this._customProperties = {};
                this._propsListedInLobby = [];
                this.name = name;
            }
            /**
                @summary Called on every room properties update: room creation, properties set by client, poperties update from server.
                Override to update custom room state.
                @method Photon.LoadBalancing.RoomInfo#onPropertiesChange
                @param {object} changedCustomProps Key-value map of changed properties.
                @param {boolean} [byClient] true if called on room creation or properties set by client.
            */
            RoomInfo.prototype.onPropertiesChange = function (changedCustomProps, byClient) { };
            /**
                @summary Returns custom property by name.
                @method Photon.LoadBalancing.RoomInfo#getCustomProperty
                @param {string} name Name of the property.
                @returns {object} Property or undefined if property not found.
            */
            RoomInfo.prototype.getCustomProperty = function (prop) { return this._customProperties[prop]; };
            /**
                @summary Returns custom property by name or default value.
                @method Photon.LoadBalancing.RoomInfo#getCustomPropertyOrElse
                @param {string} name Name of the property.
                @param {object} defaultValue Default property value.
                @returns {object} Property or default value if property not found.
            */
            RoomInfo.prototype.getCustomPropertyOrElse = function (prop, defaultValue) { return Exitgames.Common.Util.getPropertyOrElse(this._customProperties, prop, defaultValue); };
            RoomInfo.prototype._updateFromMasterResponse = function (vals) {
                this.address = vals[LoadBalancing.Constants.ParameterCode.Address];
                var name = vals[LoadBalancing.Constants.ParameterCode.RoomName];
                if (name) {
                    this.name = name;
                }
            };
            RoomInfo.prototype._updateFromProps = function (props) {
                if (props) {
                    this.maxPlayers = this.updateIfExists(this.maxPlayers, LoadBalancing.Constants.GameProperties.MaxPlayers, props);
                    this.isVisible = this.updateIfExists(this.isVisible, LoadBalancing.Constants.GameProperties.IsVisible, props);
                    this.isOpen = this.updateIfExists(this.isOpen, LoadBalancing.Constants.GameProperties.IsOpen, props);
                    this.playerCount = this.updateIfExists(this.playerCount, LoadBalancing.Constants.GameProperties.PlayerCount, props);
                    this.removed = this.updateIfExists(this.removed, LoadBalancing.Constants.GameProperties.Removed, props);
                    this._propsListedInLobby = this.updateIfExists(this._propsListedInLobby, LoadBalancing.Constants.GameProperties.PropsListedInLobby, props);
                    this.cleanupCacheOnLeave = this.updateIfExists(this.cleanupCacheOnLeave, LoadBalancing.Constants.GameProperties.CleanupCacheOnLeave, props);
                    this.masterClientId = this.updateIfExists(this.masterClientId, LoadBalancing.Constants.GameProperties.MasterClientId, props);
                    this.emptyRoomLiveTime = this.updateIfExists(this.emptyRoomLiveTime, LoadBalancing.Constants.GameProperties.EmptyRoomTtl, props);
                    this.suspendedPlayerLiveTime = this.updateIfExists(this.suspendedPlayerLiveTime, LoadBalancing.Constants.GameProperties.PlayerTtl, props);
                    var changedProps = {};
                    for (var k in props) {
                        if (parseInt(k).toString() != k) {
                            if (this._customProperties[k] !== props[k]) {
                                this._customProperties[k] = props[k];
                                changedProps[k] = props[k];
                            }
                        }
                    }
                    this.onPropertiesChange(changedProps, false);
                }
            };
            RoomInfo.prototype._updateFromEvent = function (payload) {
                if (payload) {
                    this.masterClientId = this.updateIfExists(this.masterClientId, LoadBalancing.Constants.ParameterCode.MasterClientId, payload);
                }
            };
            RoomInfo.prototype.updateIfExists = function (prevValue, code, props) {
                if (props.hasOwnProperty(code)) {
                    return props[code];
                }
                else {
                    return prevValue;
                }
            };
            return RoomInfo;
        }());
        LoadBalancing.RoomInfo = RoomInfo;
        // joined room with writable properties
        var Room = /** @class */ (function (_super) {
            __extends(Room, _super);
            /**
                @classdesc Represents a room client joins or is joined to. Extend to implement custom logic. Custom properties can be set via setCustomProperty() while being in the room.
                @mixes Photon.LoadBalancing.RoomInfo
                @constructor Photon.LoadBalancing.Room
                @param {string} name Room name.
            */
            function Room(name) {
                return _super.call(this, name) || this;
            }
            // room created from client via factory always has this field set
            //public getLoadBalancingClient() { return this.loadBalancingClient; }
            /**
                @summary Sets custom property
                @method Photon.LoadBalancing.Room#setCustomProperty
                @param {string} name Name of the property.
                @param {object} value Property value.
                @param {boolean} [webForward=false] Forward to web hook.
                @param {object} [expectedValue] Property value expected when update occurs. (CAS : "Check And Swap")
            */
            Room.prototype.setCustomProperty = function (name, value, webForward, expectedValue) {
                if (webForward === void 0) { webForward = false; }
                this._customProperties[name] = value;
                var props = {};
                props[name] = value;
                var expectedProps;
                if (expectedValue != undefined) {
                    expectedProps = (_a = {}, _a[name] = expectedValue, _a);
                }
                if (this.loadBalancingClient && this.loadBalancingClient.isJoinedToRoom()) {
                    this.loadBalancingClient._setPropertiesOfRoom(props, webForward, expectedProps);
                }
                this.onPropertiesChange(props, true);
                var _a;
            };
            /**
                @summary Sets custom property
                @method Photon.LoadBalancing.Room#setCustomProperties
                @param {object} properties Table of properties to set.
                @param {boolean} [webForward=false] Forward to web hook.
                @param {object} [expectedProperties] Table of properties expected when update occurs. (CAS : "Check And Swap")
            */
            Room.prototype.setCustomProperties = function (properties, webForward, expectedProperties) {
                if (webForward === void 0) { webForward = false; }
                var props = {};
                for (var name in properties) {
                    this._customProperties[name] = properties[name];
                    props[name] = properties[name];
                }
                if (this.loadBalancingClient && this.loadBalancingClient.isJoinedToRoom()) {
                    this.loadBalancingClient._setPropertiesOfRoom(props, webForward, expectedProperties);
                }
                this.onPropertiesChange(props, true);
            };
            Room.prototype.setProp = function (name, value) {
                if (this.loadBalancingClient && this.loadBalancingClient.isJoinedToRoom()) {
                    var props = {};
                    props[name] = value;
                    this.loadBalancingClient._setPropertiesOfRoom(props, false, undefined);
                }
            };
            /**
             * @summary Sets rooms visibility in the lobby's room list.
             * @method Photon.LoadBalancing.Room#setIsVisible
             * @param {boolean} isVisible New visibility value.
            */
            Room.prototype.setIsVisible = function (isVisible) {
                if (this.isVisible != isVisible) {
                    this.isVisible = isVisible;
                    this.setProp(LoadBalancing.Constants.GameProperties.IsVisible, isVisible);
                }
            };
            /**
             * @summary Sets if this room can be joined.
             * @method Photon.LoadBalancing.Room#setIsOpen
             * @param {boolean} isOpen New property value.
            */
            Room.prototype.setIsOpen = function (isOpen) {
                if (this.isOpen != isOpen) {
                    this.isOpen = isOpen;
                    this.setProp(LoadBalancing.Constants.GameProperties.IsOpen, isOpen);
                }
            };
            /**
             * @summary Sets max players before room is considered full.
             * @method Photon.LoadBalancing.Room#setMaxPlayers
             * @param {number} maxPlayers New max players value.
            */
            Room.prototype.setMaxPlayers = function (maxPlayers) {
                if (this.maxPlayers != maxPlayers) {
                    this.maxPlayers = maxPlayers;
                    this.setProp(LoadBalancing.Constants.GameProperties.MaxPlayers, maxPlayers);
                }
            };
            /**
             * @summary Sets room live time in the server room cache after all clients have left the room.
             * @method Photon.LoadBalancing.Room#setEmptyRoomLiveTime
             * @param {number} emptyRoomLiveTime New live time value in ms.
            */
            Room.prototype.setEmptyRoomLiveTime = function (emptyRoomLiveTime) {
                if (this.emptyRoomLiveTime != emptyRoomLiveTime) {
                    this.emptyRoomLiveTime = emptyRoomLiveTime;
                    this.setProp(LoadBalancing.Constants.GameProperties.EmptyRoomTtl, emptyRoomLiveTime);
                }
            };
            /**
             * @summary Sets time in ms indicating how long suspended player will be kept in the room.
             * @method Photon.LoadBalancing.Room#setSuspendedPlayerLiveTime
             * @param {number} suspendedPlayerLiveTime New live time value in ms.
            */
            Room.prototype.setSuspendedPlayerLiveTime = function (suspendedPlayerLiveTime) {
                if (this.suspendedPlayerLiveTime != suspendedPlayerLiveTime) {
                    this.suspendedPlayerLiveTime = suspendedPlayerLiveTime;
                    this.setProp(LoadBalancing.Constants.GameProperties.PlayerTtl, suspendedPlayerLiveTime);
                }
            };
            /**
             * @summary Sets expected server plugins.
             * @method Photon.LoadBalancing.Room#setPlugins
             * @param {string[]} plugins New plugins list.
            */
            Room.prototype.setPlugins = function (plugins) {
                this.plugins = plugins;
            };
            /**
                @summary Sets list of the room properties to pass to the RoomInfo list in a lobby.
                @method Photon.LoadBalancing.Room#setPropsListedInLobby
                @param {string[]} props Array of properties names.
            */
            Room.prototype.setPropsListedInLobby = function (props) {
                this._propsListedInLobby = props;
            };
            Room.prototype._setLBC = function (lbc) { this.loadBalancingClient = lbc; };
            return Room;
        }(RoomInfo));
        LoadBalancing.Room = Room;
        var LoadBalancingClient = /** @class */ (function () {
            /**
                @classdesc Implements the Photon LoadBalancing workflow. This class should be extended to handle system or custom events and operation responses.
                @constructor Photon.LoadBalancing.LoadBalancingClient
                @param {Photon.ConnectionProtocol} protocol Connecton protocol.
                @param {string} appId Cloud application ID.
                @param {string} appVersion Cloud application version.
            */
            function LoadBalancingClient(protocol, appId, appVersion) {
                this.appId = appId;
                this.appVersion = appVersion;
                // protected
                this.autoJoinLobby = true; // hardcoded behaviour; inheritor class can override this
                // options mainly keep state between servers
                // set / cleared in connectToNameServer()(connectToRegionMaster()), connect()
                // lobbyName and lobbyType passed to JoinLobby operation (we don't have separate JoinLobby operation and set them in connect())
                this.connectOptions = {};
                // shares lobby info between Master and Game CreateGame calls (createRoomInternal)
                this.createRoomOptions = {};
                // shares options between Master and Game JoinGame operations
                this.joinRoomOptions = {};
                this.roomInfos = new Array();
                this.roomInfosDict = {}; // 'by name' access support
                this.actors = {};
                this.actorsArray = []; // actors 'at index' access support (Scirra/Costruct 2)
                this.lowestActorId = 0; // master client support
                this.userAuthType = LoadBalancing.Constants.CustomAuthenticationType.None;
                this.userAuthParameters = "";
                this.userAuthData = "";
                this.lobbyStatsRequestList = new Array();
                // protected
                this.state = LoadBalancingClient.State.Uninitialized;
                this.logger = new Exitgames.Common.Logger("Client:");
                this.validNextState = {};
                var serverAddress = "";
                if (typeof (protocol) == "number") {
                    this.connectionProtocol = protocol;
                    switch (protocol) {
                        case Photon.ConnectionProtocol.Ws:
                            this.masterServerAddress = "ws://app-eu.exitgamescloud.com:9090";
                            this.nameServerAddress = "ws://ns.exitgames.com:9093";
                            break;
                        case Photon.ConnectionProtocol.Wss:
                            this.masterServerAddress = "wss://app-eu.exitgamescloud.com:19090";
                            this.nameServerAddress = "wss://ns.exitgames.com:19093";
                            break;
                        default:
                            var s0 = "wrong_protocol_error";
                            this.masterServerAddress = s0;
                            this.nameServerAddress = s0;
                            this.logger.error("Wrong protocol: ", protocol);
                            break;
                    }
                }
                else if (typeof (protocol) == "string") {
                    this.connectionProtocol = Photon.ConnectionProtocol.Ws;
                    var s = protocol;
                    this.masterServerAddress = s;
                    this.nameServerAddress = s;
                }
                else {
                    this.connectionProtocol = Photon.ConnectionProtocol.Ws;
                    var s1 = "wrong_protocol_type_error";
                    this.masterServerAddress = s1;
                    this.nameServerAddress = s1;
                    this.logger.error("Wrong protocol type: ", typeof (protocol));
                }
                this.initValidNextState();
                this.currentRoom = this.roomFactoryInternal("");
                this._myActor = this.actorFactoryInternal("", -1, true);
                this.addActor(this._myActor);
            }
            // override to handle system events:
            /**
                @summary Called on client state change. Override to handle it.
                @method Photon.LoadBalancing.LoadBalancingClient#onStateChange
                @param {Photon.LoadBalancing.LoadBalancingClient.State} state New client state.
            */
            LoadBalancingClient.prototype.onStateChange = function (state) { };
            /**
                @summary Called if client error occures. Override to handle it.
                @method Photon.LoadBalancing.LoadBalancingClient#onError
                @param {Photon.LoadBalancing.LoadBalancingClient.PeerErrorCode} errorCode Client error code.
                @param {string} errorMsg Error message.
            */
            LoadBalancingClient.prototype.onError = function (errorCode, errorMsg) { };
            /**
                @summary Called on operation response. Override if need custom workflow or response error handling.
                @method Photon.LoadBalancing.LoadBalancingClient#onOperationResponse
                @param {number} errorCode Server error code.
                @param {string} errorMsg Error message.
                @param {number} code Operation code.
                @param {object} content Operation response content.
            */
            LoadBalancingClient.prototype.onOperationResponse = function (errorCode, errorMsg, code, content) { };
            /**
                @summary Called on custom event. Override to handle it.
                @method Photon.LoadBalancing.LoadBalancingClient#onEvent
                @param {number} code Event code.
                @param {object} content Event content.
                @param {number} actorNr Actor ID event raised by.
            */
            LoadBalancingClient.prototype.onEvent = function (code, content, actorNr) { };
            /**
                @summary Called on room list received from Master server (on connection). Override to handle it.
                @method Photon.LoadBalancing.LoadBalancingClient#onRoomList
                @param {{@link Photon.LoadBalancing.RoomInfo}[]} rooms Room list.
            */
            LoadBalancingClient.prototype.onRoomList = function (rooms) { };
            /**
                @summary Called on room list updates received from Master server. Override to handle it.
                @method Photon.LoadBalancing.LoadBalancingClient#onRoomListUpdate
                @param {{@link Photon.LoadBalancing.RoomInfo}[]} rooms Updated room list.
                @param {{@link Photon.LoadBalancing.RoomInfo}[]} roomsUpdated Rooms whose properties were changed.
                @param {{@link Photon.LoadBalancing.RoomInfo}[]} roomsAdded New rooms in list.
                @param {{@link Photon.LoadBalancing.RoomInfo}[]} roomsRemoved Rooms removed from list.
            */
            LoadBalancingClient.prototype.onRoomListUpdate = function (rooms, roomsUpdated, roomsAdded, roomsRemoved) { };
            // TODO: move to Room? Or remove and use Room.onPropertiesChange only?
            /**
                @summary Called on joined room properties changed event. Override to handle it.
                @method Photon.LoadBalancing.LoadBalancingClient#onMyRoomPropertiesChange
            */
            LoadBalancingClient.prototype.onMyRoomPropertiesChange = function () { };
            /**
                @summary Called on actor properties changed event. Override to handle it.
                @method Photon.LoadBalancing.LoadBalancingClient#onActorPropertiesChange
                @param {Photon.LoadBalancing.Actor} actor Actor whose properties were changed.
            */
            LoadBalancingClient.prototype.onActorPropertiesChange = function (actor) { };
            /**
                @summary Called when client joins room. Override to handle it.
                @method Photon.LoadBalancing.LoadBalancingClient#onJoinRoom
                @param {boolean} createdByMe True if room is created by client.
            */
            LoadBalancingClient.prototype.onJoinRoom = function (createdByMe) { };
            /**
                @summary Called when new actor joins the room client joined to. Override to handle it.
                @method Photon.LoadBalancing.LoadBalancingClient#onActorJoin
                @param {Photon.LoadBalancing.Actor} actor New actor.
            */
            LoadBalancingClient.prototype.onActorJoin = function (actor) { };
            /**
                @summary Called when actor leaves the room client joined to. Also called for every actor during room cleanup. Override to handle it.
                @method Photon.LoadBalancing.LoadBalancingClient#onActorLeave
                @param {Photon.LoadBalancing.Actor} actor Actor left the room.
                @param {boolean} cleanup True if called during room cleanup (e.g. on disconnect).
            */
            LoadBalancingClient.prototype.onActorLeave = function (actor, cleanup) { };
            /**
                @summary Called when actor suspended in the room client joined to.Override to handle it.
                @method Photon.LoadBalancing.LoadBalancingClient#onActorSuspend
                @param {Photon.LoadBalancing.Actor} actor Actor suspended in the room.
            */
            LoadBalancingClient.prototype.onActorSuspend = function (actor) { };
            /**
                @summary Called when {@link Photon.LoadBalancing.LoadBalancingClient#findFriends findFriends} request completed. <br/>
                Override to handle request results.
                @method Photon.LoadBalancing.LoadBalancingClient#onFindFriendsResult
                @param {number} errorCode Result error code. 0 if request is successful.
                @param {string} errorMsg Error message.
                @param {object} friends Table with actors names as keys and friend statuses as values: {name1: friendStatus1, name2: friendStatus2, ... }.
                @property {object} friendStatus Friend status.
                @property {boolean} friendStatus.online Online status.
                @property {string} friendStatus.roomId Joined room.
            */
            LoadBalancingClient.prototype.onFindFriendsResult = function (errorCode, errorMsg, friends) { };
            /**
                @summary Called when lobbies statistics update received. <br/>
                Update can be automated by set up during {@link Photon.LoadBalancing.LoadBalancingClient#connect connect} or requested explicitly by {@link Photon.LoadBalancing.LoadBalancingClient#requestLobbyStats requestLobbyStats}. <br/>
                Override to handle request results.
                @method Photon.LoadBalancing.LoadBalancingClient#onLobbyStats
                @param {number} errorCode Result error code. 0 if request is successful. For automated updates is always 0.
                @param {string} errorMsg Error message. For automated updates is always empty.
                @param {object[]} lobbies Array of lobbies statistics: [lobbyStats1, lobbyStats1, ... ].
                @property {object} lobbyStats Lobby statistics.
                @property {string} lobbyStats.lobbyName Lobby name.
                @property {number} lobbyStats.lobbyType Lobby type.
                @property {number} lobbyStats.peerCount The number of players in the lobby (on Master, not playing).
                @property {number} lobbyStats.gameCount The number of games in the lobby.
            */
            LoadBalancingClient.prototype.onLobbyStats = function (errorCode, errorMsg, lobbies) { };
            /**
                @summary Called when application statistics update received. <br/>
                Override to handle request results.
                @method Photon.LoadBalancing.LoadBalancingClient#onAppStats
                @param {number} errorCode Result error code. Currently is always 0.
                @param {string} errorMsg Error message. Currently is always empty.
                @param {object} stats Application statistics.
                @property {object} stats Application statistics.
                @property {number} stats.peerCount Count of players currently online on Game servers.
                @property {number} stats.masterPeerCount Count of players on Master server (looking for game).
                @property {number} stats.gameCount Count of games currently in use (includes invisible and full rooms, so it doesn't match lobby list).
            */
            LoadBalancingClient.prototype.onAppStats = function (errorCode, errorMsg, stats) { };
            /**
                @summary Called when {@link Photon.LoadBalancing.LoadBalancingClient#getRegions getRegions} request completed.<br/>
                Override to handle request results.
                @param {number} errorCode Result error code. 0 if request is successful.
                @param {string} errorMsg Error message.
                @param {object} regions Object with region codes as keys and Master servers addresses as values
            */
            LoadBalancingClient.prototype.onGetRegionsResult = function (errorCode, errorMsg, regions) { };
            /**
                Called when {@link Photon.LoadBalancing.LoadBalancingClient#webRpc webRpc} request completed.<br/>
                Override to handle request results.
                @param {number} errorCode Result error code. 0 if request is successful.
                @param {string} message Error message if errorCode ~ = 0 or optional message returned by remote procedure.
                @param {string} uriPath Request path.
                @param {number} resultCode Result code returned by remote procedure.
                @param {object} data Data returned by remote procedure.
            **/
            LoadBalancingClient.prototype.onWebRpcResult = function (errorCode, message, uriPath, resultCode, data) { };
            /**
                @summary Override with creation of custom room (extended from Room): { return new CustomRoom(...); }
                @method Photon.LoadBalancing.LoadBalancingClient#roomFactory
                @param {string} name Room name. Pass to super() in custom actor constructor.
            */
            LoadBalancingClient.prototype.roomFactory = function (name) { return new Room(name); };
            /**
                @summary Override with creation of custom actor (extended from Actor): { return new CustomActor(...); }
                @method Photon.LoadBalancing.LoadBalancingClient#actorFactory
                @param {string} name Actor name. Pass to super() in custom room constructor.
                @param {number} actorNr Actor ID. Pass to super() in custom room constructor.
                @param {boolean} isLocal Actor is local. Pass to super() in custom room constructor.
            */
            LoadBalancingClient.prototype.actorFactory = function (name, actorNr, isLocal) { return new Actor(name, actorNr, isLocal); };
            //------------------------
            /**
                @summary Returns local actor.
                Client always has local actor even if not joined.
                @method Photon.LoadBalancing.LoadBalancingClient#myActor
                @returns {Photon.LoadBalancing.Actor} Local actor.
            */
            LoadBalancingClient.prototype.myActor = function () { return this._myActor; };
            /**
                @summary Returns client's room.
                Client always has it's room even if not joined. It's used for room creation operation.
                @method Photon.LoadBalancing.LoadBalancingClient#myRoom
                @returns {Photon.LoadBalancing.Room} Current room.
            */
            LoadBalancingClient.prototype.myRoom = function () { return this.currentRoom; };
            /**
                @summary Returns actors in room client currently joined including local actor.
                @method Photon.LoadBalancing.LoadBalancingClient#myRoomActors
                @returns {object} actorNr -> {@link Photon.LoadBalancing.Actor} map of actors in room.
            */
            LoadBalancingClient.prototype.myRoomActors = function () { return this.actors; };
            /**
                @summary Returns numer of actors in room client currently joined including local actor.
                @method Photon.LoadBalancing.LoadBalancingClient#myRoomActorCount
                @returns {number} Number of actors.
            */
            LoadBalancingClient.prototype.myRoomActorCount = function () { return this.actorsArray.length; };
            LoadBalancingClient.prototype.myRoomActorsArray = function () { return this.actorsArray; }; // actors 'at index' access support (Scirra/Costruct 2)                
            /**
                @summary Actor number of the player who's the master of this Room. Note: This changes when the current master leaves the room.
                @member Photon.LoadBalancing.RoomInfo#masterClientId
                @type {number}
                @readonly
            */
            LoadBalancingClient.prototype.myRoomMasterActorNr = function () {
                if (this.myRoom().masterClientId) {
                    return this.myRoom().masterClientId;
                }
                else {
                    return this.lowestActorId;
                }
            };
            LoadBalancingClient.prototype.lastRtt = function () {
                return this.gamePeer && this.gamePeer.getLastRtt();
            };
            LoadBalancingClient.prototype.roomFactoryInternal = function (name) {
                if (name === void 0) { name = ""; }
                var r = this.roomFactory(name);
                r._setLBC(this);
                return r;
            };
            LoadBalancingClient.prototype.actorFactoryInternal = function (name, actorNr, isLocal) {
                if (name === void 0) { name = ""; }
                if (actorNr === void 0) { actorNr = -1; }
                if (isLocal === void 0) { isLocal = false; }
                var a = this.actorFactory(name, actorNr, isLocal);
                a._setLBC(this);
                return a;
            };
            /**
                @summary Changes default NameServer address and port before connecting to NameServer.
                @method Photon.LoadBalancing.LoadBalancingClient#setNameServerAddress
                @param {string} address New address and port.
            */
            LoadBalancingClient.prototype.setNameServerAddress = function (address) {
                this.nameServerAddress = address;
            };
            /**
                @summary Returns current NameServer address.
                @method Photon.LoadBalancing.LoadBalancingClient#getNameServerAddress
                @returns {string} NameServer address address.
            */
            LoadBalancingClient.prototype.getNameServerAddress = function () {
                return this.nameServerAddress;
            };
            /**
                @summary Changes default Master server address and port before connecting to Master server.
                @method Photon.LoadBalancing.LoadBalancingClient#setMasterServerAddress
                @param {string} address New address and port.
            */
            LoadBalancingClient.prototype.setMasterServerAddress = function (address) {
                this.masterServerAddress = address;
            };
            /**
                @summary Returns current Master server address.
                @method Photon.LoadBalancing.LoadBalancingClient#getMasterServerAddress
                @returns {string} Master server address.
            */
            LoadBalancingClient.prototype.getMasterServerAddress = function () {
                return this.nameServerAddress;
            };
            /**
                @summary Sets optional user id(required by some cloud services)
                @method Photon.LoadBalancing.LoadBalancingClient#setUserId
                @param {string} userId New user id.
            */
            LoadBalancingClient.prototype.setUserId = function (userId) {
                this.userId = userId;
            };
            /**
                @summary Returns previously set user id.
                @method Photon.LoadBalancing.LoadBalancingClient#getUserId
                @returns {string} User id.
            */
            LoadBalancingClient.prototype.getUserId = function () {
                return this.userId;
            };
            /**
                @summary Enables custom authentication and sets it's parameters.
                @method Photon.LoadBalancing.LoadBalancingClient#setCustomAuthentication
                @param {string} authParameters This string must contain any (http get) parameters expected by the used authentication service.
                @param {Photon.LoadBalancing.Constants.CustomAuthenticationType} [authType=Photon.LoadBalancing.Constants.CustomAuthenticationType.Custom] The type of custom authentication provider that should be used.
                @param {any} [authData] The data to be passed-on to the auth service via POST. String passed as is, objects as application/json
            */
            LoadBalancingClient.prototype.setCustomAuthentication = function (authParameters, authType, authData) {
                if (authType === void 0) { authType = Photon.LoadBalancing.Constants.CustomAuthenticationType.Custom; }
                this.userAuthType = authType;
                this.userAuthParameters = authParameters;
                this.userAuthData = authData;
            };
            // TODO: remove backward compatibility (deprecated)
            /**
                @summary Starts connection to Master server.
                @method Photon.LoadBalancing.LoadBalancingClient#connect
                @param {object} [options] Additional options
                @property {object} options Additional options
                @property {boolean} [options.keepMasterConnection=false] Don't disconnect from Master server after joining room.
                @property {string} [options.lobbyName] Name of the lobby connect to.
                @property {Photon.LoadBalancing.Constants.LobbyType} [options.lobbyType=LobbyType.Default] Type of the lobby.
                @property {boolean} [options.lobbyStats=false] If true, Master server will be sending lobbies statistics periodically.<br/> Override {@link Photon.LoadBalancing.LoadBalancingClient#onLobbyStats onLobbyStats} to handle request results.<br/>Alternatively, {@link Photon.LoadBalancing.LoadBalancingClient#requestLobbyStats requestLobbyStats} can be used.
                @returns {boolean} True if current client state allows connection.
            */
            LoadBalancingClient.prototype.connect = function (options) {
                // backward compatibility
                if (typeof (options) === "boolean") {
                    if (options) {
                        options = { keepMasterConnection: true };
                    }
                    else {
                        options = { keepMasterConnection: false };
                    }
                }
                //
                if (!options) {
                    options = {};
                }
                if (this.checkNextState(LoadBalancingClient.State.ConnectingToMasterserver, true)) {
                    this.changeState(LoadBalancingClient.State.ConnectingToMasterserver);
                    this.logger.info("Connecting to Master", this.masterServerAddress);
                    // make options copy to protect
                    this.connectOptions = {};
                    for (var k in options)
                        this.connectOptions[k] = options[k];
                    if (this.masterPeer)
                        this.masterPeer.Destroy();
                    this.masterPeer = new MasterPeer(this, this.connectionProtocol, this.masterServerAddress, "");
                    this.initMasterPeer(this.masterPeer);
                    this.masterPeer.connect(this.appId);
                    return true;
                }
                else {
                    return false;
                }
            };
            /**
                @summary Starts connection to NameServer.
                @method Photon.LoadBalancing.LoadBalancingClient#connectToNameServer
                @param {object} [options] Additional options
                @property {object} options Additional options
                @property {string} [options.region] Don't disconnect from Master server after joining room.
                @property {string} [options.lobbyName] Name of the lobby connect to.
                @property {Photon.LoadBalancing.Constants.LobbyType} [options.lobbyType=LobbyType.Default] Type of the lobby.
                @property {boolean} [options.lobbyStats=false] If true, Master server will be sending lobbies statistics periodically.<br/> Override {@link Photon.LoadBalancing.LoadBalancingClient#onLobbyStats onLobbyStats} to handle request results.<br/>Alternatively, {@link Photon.LoadBalancing.LoadBalancingClient#requestLobbyStats requestLobbyStats} can be used.
                @property {boolean} [options.keepMasterConnection=false] Don't disconnect from Master server after joining room.
            */
            LoadBalancingClient.prototype.connectToNameServer = function (options) {
                if (!options) {
                    options = {};
                }
                if (this.checkNextState(LoadBalancingClient.State.ConnectingToNameServer, true)) {
                    this.changeState(LoadBalancingClient.State.ConnectingToNameServer);
                    this.logger.info("Connecting to NameServer", this.nameServerAddress);
                    // make options copy to protect
                    this.connectOptions = {};
                    for (var k in options)
                        this.connectOptions[k] = options[k];
                    if (this.nameServerPeer)
                        this.nameServerPeer.Destroy();
                    this.nameServerPeer = new NameServerPeer(this, this.connectionProtocol, this.nameServerAddress, "");
                    this.initNameServerPeer(this.nameServerPeer);
                    this.nameServerPeer.connect(this.appId);
                    return true;
                }
                else {
                    return false;
                }
            };
            LoadBalancingClient.prototype.fillCreateRoomOptions = function (op, options) {
                options = options || {};
                var gp = {};
                if (options.isVisible !== undefined)
                    gp[LoadBalancing.Constants.GameProperties.IsVisible] = options.isVisible;
                if (options.isOpen !== undefined)
                    gp[LoadBalancing.Constants.GameProperties.IsOpen] = options.isOpen;
                if (options.maxPlayers !== undefined)
                    gp[LoadBalancing.Constants.GameProperties.MaxPlayers] = options.maxPlayers;
                if (options.propsListedInLobby !== undefined)
                    gp[LoadBalancing.Constants.GameProperties.PropsListedInLobby] = Photon.TypeExt.String(options.propsListedInLobby);
                if (options.customGameProperties !== undefined) {
                    for (var p in options.customGameProperties) {
                        gp[p] = options.customGameProperties[p];
                    }
                }
                op.push(LoadBalancing.Constants.ParameterCode.GameProperties, gp);
                op.push(LoadBalancing.Constants.ParameterCode.CleanupCacheOnLeave, true); //TODO: make this optional?
                op.push(LoadBalancing.Constants.ParameterCode.Broadcast, true); //TODO: make this optional?
                if (options.emptyRoomLiveTime !== undefined)
                    op.push(LoadBalancing.Constants.ParameterCode.EmptyRoomTTL, Photon.TypeExt.Int(options.emptyRoomLiveTime));
                if (options.suspendedPlayerLiveTime !== undefined)
                    op.push(LoadBalancing.Constants.ParameterCode.PlayerTTL, Photon.TypeExt.Int(options.suspendedPlayerLiveTime));
                if (options.plugins !== undefined)
                    op.push(LoadBalancing.Constants.ParameterCode.Plugins, options.plugins);
                // shold be always set to true by client
                op.push(LoadBalancing.Constants.ParameterCode.CheckUserOnJoin, true);
                if (options.lobbyName) {
                    op.push(LoadBalancing.Constants.ParameterCode.LobbyName);
                    op.push(options.lobbyName);
                    if (options.lobbyType != undefined) {
                        op.push(LoadBalancing.Constants.ParameterCode.LobbyType);
                        op.push(options.lobbyType);
                    }
                }
            };
            /**
                @summary Creates a new room on the server (or fails when the name is already taken). Takes parameters (except name) for new room from myRoom() object. Set them before call.
                @method Photon.LoadBalancing.LoadBalancingClient#createRoomFromMy
                @param {string} [roomName] New room name. Assigned automatically by server if empty or not specified.
                @param {object} [options] Additional options
                @property {object} options Additional options
                @property {string} [options.lobbyName] Name of the lobby to create room in.
                @property {Photon.LoadBalancing.Constants.LobbyType} [options.lobbyType=LobbyType.Default] Type of the lobby.
            */
            LoadBalancingClient.prototype.createRoomFromMy = function (roomName, options) {
                this.currentRoom.name = roomName ? roomName : "";
                options = this.copyCreateOptionsFromMyRoom(options);
                return this.createRoomInternal(this.masterPeer, options);
            };
            LoadBalancingClient.prototype.copyCreateOptionsFromMyRoom = function (options) {
                options = options || {};
                //retrieve options from my room
                options.isVisible = this.currentRoom.isVisible;
                options.isOpen = this.currentRoom.isOpen;
                options.maxPlayers = this.currentRoom.maxPlayers;
                options.customGameProperties = this.currentRoom._customProperties;
                options.propsListedInLobby = this.currentRoom._propsListedInLobby;
                options.emptyRoomLiveTime = this.currentRoom.emptyRoomLiveTime;
                options.suspendedPlayerLiveTime = this.currentRoom.suspendedPlayerLiveTime;
                options.plugins = this.currentRoom.plugins;
                return options;
            };
            /**
                @summary Creates a new room on the server (or fails when the name is already taken).
                @method Photon.LoadBalancing.LoadBalancingClient#createRoom
                @param {string} [roomName] The name to create a room with. Must be unique and not in use or can't be created. If not specified or null, the server will assign a GUID as name.
                @param {object} [options] Additional options
                @property {object} options Additional options
                @property {boolean} [options.isVisible=true] Shows the room in the lobby's room list.
                @property {boolean} [options.isOpen=true] Keeps players from joining the room (or opens it to everyone).
                @property {number} [options.maxPlayers=0] Max players before room is considered full (but still listed).
                @property {object} [options.customGameProperties] Custom properties to apply to the room on creation (use string-typed keys but short ones).
                @property {string[]} [options.propsListedInLobby] Defines the custom room properties that get listed in the lobby.
                @property {number} [options.emptyRoomLiveTime=0] Room live time (ms) in the server room cache after all clients have left the room.
                @property {number} [options.suspendedPlayerLiveTime=0] Player live time (ms) in the room after player suspended.
                @property {string[]} [options.plugins] Expected server plugins.
                @property {string} [options.lobbyName] Name of the lobby to create room in.
                @property {Photon.LoadBalancing.Constants.LobbyType} [options.lobbyType=LobbyType.Default] Type of the lobby.
    
            */
            LoadBalancingClient.prototype.createRoom = function (roomName, options) {
                this.currentRoom = this.roomFactoryInternal(roomName ? roomName : "");
                return this.createRoomInternal(this.masterPeer, options);
            };
            /**
                @summary Joins a room by name and sets this player's properties.
                @method Photon.LoadBalancing.LoadBalancingClient#joinRoom
                @param {string} roomName The name of the room to join. Must be existing already, open and non-full or can't be joined.
                @param {object} [options] Additional options
                @property {object} options Additional options
                @property {string} [options.rejoin=false] Rejoin using current userId.
                @property {boolean} [options.createIfNotExists=false] Create room if not exists.
                @param {object} [createOptions] Room options for creation
                @property {object} createOptions Room options for creation
                @property {boolean} [createOptions.isVisible=true] Shows the room in the lobby's room list.
                @property {boolean} [createOptions.isOpen=true] Keeps players from joining the room (or opens it to everyone).
                @property {number} [createOptions.maxPlayers=0] Max players before room is considered full (but still listed).
                @property {object} [createOptions.customGameProperties] Custom properties to apply to the room on creation (use string-typed keys but short ones).
                @property {string[]} [createOptions.propsListedInLobby] Defines the custom room properties that get listed in the lobby.
                @property {number} [createOptions.emptyRoomLiveTime=0] Room live time (ms) in the server room cache after all clients have left the room.
                @property {number} [createOptions.suspendedPlayerLiveTime=0] Player live time (ms) in the room after player suspended.
                @property {string[]} [createOptions.plugins] Informs the server of the expected plugin setup.
                @property {string} [createOptions.lobbyName=""] Name of the lobby to create room in.
                @property {Photon.LoadBalancing.Constants.LobbyType} [createOptions.lobbyType=LobbyType.Default] Type of the lobby.
    
            */
            LoadBalancingClient.prototype.joinRoom = function (roomName, options, createOptions) {
                var op = [];
                if (options) {
                    if (options.createIfNotExists) {
                        op.push(LoadBalancing.Constants.ParameterCode.JoinMode, LoadBalancingClient.JoinMode.CreateIfNotExists);
                        this.fillCreateRoomOptions(op, createOptions);
                    }
                    if (options.rejoin) {
                        op.push(LoadBalancing.Constants.ParameterCode.JoinMode, LoadBalancingClient.JoinMode.RejoinOnly);
                    }
                }
                this.currentRoom = this.roomFactoryInternal(roomName);
                op.push(LoadBalancing.Constants.ParameterCode.RoomName, roomName);
                this.joinRoomOptions = options || {};
                this.createRoomOptions = createOptions || {};
                this.logger.info("Join Room", roomName, options, createOptions, "...");
                this.masterPeer.sendOperation(LoadBalancing.Constants.OperationCode.JoinGame, op);
                return true;
            };
            /**
                @summary Joins a random, available room.
                This operation fails if all rooms are closed or full.
                @method Photon.LoadBalancing.LoadBalancingClient#joinRandomRoom
                @param {object} [options] Additional options
                @property {object} options Additional options
                @property {object} [options.expectedCustomRoomProperties] If specified, a room will only be joined, if it matches these custom properties. Use null to accept rooms with any properties.
                @property {number} [options.expectedMaxPlayers] If specified, filters for a particular maxPlayer setting. Use 0 to accept any maxPlayer value.
                @property {Photon.LoadBalancing.Constants.MatchmakingMode} [options.matchmakingMode=MatchmakingMode.FillRoom] Selects one of the available matchmaking algorithms.
                @property {string} [options.lobbyName] Name of the lobby to search rooms in.
                @property {Photon.LoadBalancing.Constants.LobbyType} [options.lobbyType=LobbyType.Default] Type of the lobby.
                @property {string} [options.sqlLobbyFilter] Basically the "where" clause of a sql statement. Examples: 'C0 = 1 AND C2 > 50'. 'C5 = "Map2" AND C2 > 10 AND C2 < 20'
            */
            LoadBalancingClient.prototype.joinRandomRoom = function (options) {
                var op = [];
                if (options) {
                    if (options.matchingType != undefined && options.matchingType != LoadBalancing.Constants.MatchmakingMode.FillRoom) {
                        op.push(LoadBalancing.Constants.ParameterCode.MatchMakingType);
                        op.push(options.matchingType);
                    }
                    var expectedRoomProperties = {};
                    var propNonEmpty = false;
                    if (options.expectedCustomRoomProperties != undefined) {
                        for (var k in options.expectedCustomRoomProperties) {
                            expectedRoomProperties[k] = options.expectedCustomRoomProperties[k];
                            propNonEmpty = true;
                        }
                    }
                    if (options.expectedMaxPlayers != undefined && options.expectedMaxPlayers > 0) {
                        expectedRoomProperties[LoadBalancing.Constants.GameProperties.MaxPlayers] = options.expectedMaxPlayers;
                        propNonEmpty = true;
                    }
                    if (propNonEmpty) {
                        op.push(LoadBalancing.Constants.ParameterCode.GameProperties);
                        op.push(expectedRoomProperties);
                    }
                    if (options.lobbyName) {
                        op.push(LoadBalancing.Constants.ParameterCode.LobbyName);
                        op.push(options.lobbyName);
                        if (options.lobbyType != undefined) {
                            op.push(LoadBalancing.Constants.ParameterCode.LobbyType);
                            op.push(options.lobbyType);
                        }
                    }
                    if (options.sqlLobbyFilter) {
                        op.push(LoadBalancing.Constants.ParameterCode.Data);
                        op.push(options.sqlLobbyFilter);
                    }
                }
                this.logger.info("Join Random Room", options && options.lobbyName, options && options.lobbyType, "...");
                this.masterPeer.sendOperation(LoadBalancing.Constants.OperationCode.JoinRandomGame, op);
                return true;
            };
            LoadBalancingClient.prototype._setPropertiesOfRoom = function (properties, webForward, expectedProperties) {
                var op = [];
                op.push(LoadBalancing.Constants.ParameterCode.Properties);
                op.push(properties);
                op.push(LoadBalancing.Constants.ParameterCode.Broadcast);
                op.push(true);
                if (webForward) {
                    op.push(LoadBalancing.Constants.ParameterCode.WebFlags);
                    op.push(Photon.TypeExt.Byte(WebFlags.HttpForward));
                }
                if (expectedProperties) {
                    op.push(LoadBalancing.Constants.ParameterCode.ExpectedValues);
                    op.push(expectedProperties);
                }
                this.gamePeer.sendOperation(LoadBalancing.Constants.OperationCode.SetProperties, op);
            };
            LoadBalancingClient.prototype._setPropertiesOfActor = function (actorNr, properties, webForward, expectedProperties) {
                var op = [];
                op.push(LoadBalancing.Constants.ParameterCode.ActorNr);
                op.push(actorNr);
                op.push(LoadBalancing.Constants.ParameterCode.Properties);
                op.push(properties);
                op.push(LoadBalancing.Constants.ParameterCode.Broadcast);
                op.push(true);
                if (webForward) {
                    op.push(LoadBalancing.Constants.ParameterCode.WebFlags);
                    op.push(Photon.TypeExt.Byte(WebFlags.HttpForward));
                }
                if (expectedProperties) {
                    op.push(LoadBalancing.Constants.ParameterCode.ExpectedValues);
                    op.push(expectedProperties);
                }
                this.gamePeer.sendOperation(LoadBalancing.Constants.OperationCode.SetProperties, op);
            };
            /**
                @summary Disconnects from all servers.
                @method Photon.LoadBalancing.LoadBalancingClient#disconnect
            */
            LoadBalancingClient.prototype.disconnect = function () {
                if (this.nameServerPeer) {
                    this.nameServerPeer.disconnect();
                }
                this._cleanupNameServerPeerData();
                if (this.masterPeer) {
                    this.masterPeer.disconnect();
                }
                this._cleanupMasterPeerData();
                if (this.gamePeer) {
                    this.gamePeer.disconnect();
                }
                this._cleanupGamePeerData();
                this.changeState(LoadBalancingClient.State.Disconnected);
            };
            /**
                @summary Disconnects client from Game server keeping player in room (to rejoin later) and connects to Master server if not connected.
                @method Photon.LoadBalancing.LoadBalancingClient#suspendRoom
                @property {object} options Additional options
                @property {boolean} [options.sendAuthCookie] Securely transmit the encrypted object AuthCookie to the web service in PathLeave webhook when available
            */
            LoadBalancingClient.prototype.suspendRoom = function (options) {
                if (this.isJoinedToRoom()) {
                    if (this.gamePeer) {
                        var params = [];
                        if (options) {
                            if (options.sendAuthCookie) {
                                params.push(LoadBalancing.Constants.ParameterCode.WebFlags, Photon.TypeExt.Byte(WebFlags.SendAuthCookie));
                            }
                        }
                        params.push(LoadBalancing.Constants.ParameterCode.IsInactive, true);
                        this.gamePeer.sendOperation(LoadBalancing.Constants.OperationCode.Leave, params);
                        this.gamePeerWaitingForDisconnect = true;
                    }
                    this._cleanupGamePeerData();
                    if (this.isConnectedToMaster()) {
                        this.changeState(LoadBalancingClient.State.JoinedLobby);
                    }
                    else {
                        this.changeState(LoadBalancingClient.State.Disconnected);
                        this.connect(this.connectOptions);
                    }
                }
            };
            /**
                @summary Leaves room and connects to Master server if not connected.
                @method Photon.LoadBalancing.LoadBalancingClient#leaveRoom
                @property {object} options Additional options
                @property {boolean} [options.sendAuthCookie] Securely transmit the encrypted object AuthCookie to the web service in PathLeave webhook when available
            */
            LoadBalancingClient.prototype.leaveRoom = function (options) {
                if (this.isJoinedToRoom()) {
                    if (this.gamePeer) {
                        var params = [];
                        if (options) {
                            if (options.sendAuthCookie) {
                                params.push(LoadBalancing.Constants.ParameterCode.WebFlags, Photon.TypeExt.Byte(WebFlags.SendAuthCookie));
                            }
                        }
                        this.gamePeer.sendOperation(LoadBalancing.Constants.OperationCode.Leave, params);
                        this.gamePeerWaitingForDisconnect = true;
                    }
                    this._cleanupGamePeerData();
                    if (this.isConnectedToMaster()) {
                        this.changeState(LoadBalancingClient.State.JoinedLobby);
                    }
                    else {
                        this.changeState(LoadBalancingClient.State.Disconnected);
                        this.connect(this.connectOptions);
                    }
                }
            };
            /**
                @summary Raises game custom event
                @method Photon.LoadBalancing.LoadBalancingClient#raiseEvent
                @param {number} eventCode Identifies this type of event (and the content). Your game's event codes can start with 0.
                @param {object} [data] Custom data you want to send along (use null, if none).
                @param {object} [options] Additional options
                @property {object} options Additional options
                @property {number} [options.interestGroup] The ID of the interest group this event goes to (exclusively).
                @property {Photon.LoadBalancing.Constants.EventCaching} [options.cache=EventCaching.DoNotCache] Events can be cached (merged and removed) for players joining later on.
                @property {Photon.LoadBalancing.Constants.ReceiverGroup} [options.receivers=ReceiverGroup.Others] Defines to which group of players the event is passed on.
                @property {number[]} [options.targetActors] Defines the target players who should receive the event (use only for small target groups).
                @property {boolean} [options.webForward=false] Forward to web hook.
            */
            LoadBalancingClient.prototype.raiseEvent = function (eventCode, data, options) {
                if (this.isJoinedToRoom()) {
                    this.gamePeer.raiseEvent(eventCode, data, options);
                }
            };
            /**
                @summary Changes client's interest groups (for events in room).<br/>
                Note the difference between passing null and []: null won't add/remove any groups, [] will add/remove all (existing) groups.<br/>
                First, removing groups is executed. This way, you could leave all groups and join only the ones provided.
                @method Photon.LoadBalancing.LoadBalancingClient#changeGroups
                @param {number[]} groupsToRemove Groups to remove from interest. Null will not leave any. A [] will remove all.
                @param {number[]} groupsToAdd Groups to add to interest. Null will not add any. A [] will add all current.
            */
            LoadBalancingClient.prototype.changeGroups = function (groupsToRemove, groupsToAdd) {
                if (this.isJoinedToRoom()) {
                    this.logger.debug("Group change:", groupsToRemove, groupsToAdd);
                    this.gamePeer.changeGroups(groupsToRemove, groupsToAdd);
                }
            };
            /**
                @summary Requests Master server for actors online status and joined rooms.<br/>
                Override {@link Photon.LoadBalancing.LoadBalancingClient#onFindFriendsResult onFindFriendsResult} to handle request results.
                @method Photon.LoadBalancing.LoadBalancingClient#findFriends
                @param {string[]} friendsToFind Actors names.
            **/
            LoadBalancingClient.prototype.findFriends = function (friendsToFind) {
                if (this.isConnectedToMaster()) {
                    if (friendsToFind && typeof (friendsToFind) == "object") {
                        this.findFriendsRequestList = new Array();
                        for (var i = 0; i < friendsToFind.length; ++i) {
                            if (typeof (friendsToFind[i]) == "string") {
                                this.findFriendsRequestList[i] = friendsToFind[i];
                            }
                            else {
                                this.logger.error("FindFriends request error:", "Friend name is not a string", i);
                                this.onFindFriendsResult(-1, "Friend name is not a string" + " " + i, {});
                                return;
                            }
                        }
                        this.logger.debug("Find friends:", friendsToFind);
                        this.masterPeer.findFriends(this.findFriendsRequestList);
                    }
                    else {
                        this.logger.error("FindFriends request error:", "Parameter is not an array");
                        this.onFindFriendsResult(-1, "Parameter is not an array", {});
                    }
                }
                else {
                    this.logger.error("FindFriends request error:", "Not connected to Master");
                    this.onFindFriendsResult(LoadBalancingClient.PeerErrorCode.MasterError, "Not connected to Master", {});
                }
            };
            /**
                @summary Requests Master server for lobbies statistics.<br/>
                Override {@link Photon.LoadBalancing.LoadBalancingClient#onLobbyStats onLobbyStats} to handle request results.<br/>
                Alternatively, automated updates can be set up during {@link Photon.LoadBalancing.LoadBalancingClient#connect connect}.
                @method Photon.LoadBalancing.LoadBalancingClient#requestLobbyStats
                @param {any[]} lobbiesToRequest Array of lobbies id pairs [ [lobbyName1, lobbyType1], [lobbyName2, lobbyType2], ... ]. If not specified or null, statistics for all lobbies requested.
    
            **/
            LoadBalancingClient.prototype.requestLobbyStats = function (lobbiesToRequest) {
                if (this.isConnectedToMaster()) {
                    this.lobbyStatsRequestList = new Array();
                    if (lobbiesToRequest) {
                        if (typeof (lobbiesToRequest) == "object") {
                            for (var i = 0; i < lobbiesToRequest.length; ++i) {
                                var l = lobbiesToRequest[i];
                                if (typeof (l) == "object") {
                                    var n = l[0];
                                    if (n) {
                                        var t;
                                        if (l[1] === undefined) {
                                            t = LoadBalancing.Constants.LobbyType.Default;
                                        }
                                        else {
                                            if (typeof (l[1]) == "number") {
                                                t = l[1];
                                            }
                                            else {
                                                this.requestLobbyStatsErr("Lobby type is invalid", i);
                                                return;
                                            }
                                        }
                                        this.lobbyStatsRequestList[i] = [n.toString(), t];
                                    }
                                    else {
                                        this.requestLobbyStatsErr("Lobby name is empty", i);
                                        return;
                                    }
                                }
                                else {
                                    this.requestLobbyStatsErr("Lobby id is not an array", i);
                                    return;
                                }
                            }
                        }
                        else {
                            this.requestLobbyStatsErr("Parameter is not an array");
                            return;
                        }
                    }
                    this.masterPeer.requestLobbyStats(this.lobbyStatsRequestList);
                }
                else {
                    this.logger.error("LobbyState request error:", "Not connected to Master");
                    this.onLobbyStats(LoadBalancingClient.PeerErrorCode.MasterError, "Not connected to Master", []);
                }
            };
            LoadBalancingClient.prototype.requestLobbyStatsErr = function (m, other) {
                if (other === void 0) { other = ""; }
                this.logger.error("LobbyState request error:", m, other);
                this.onLobbyStats(-1, m + " " + other, []);
            };
            /**
                @summary Requests NameServer for regions list.<br/>
                Override {@link Photon.LoadBalancing.LoadBalancingClient#onGetRegionsResult onGetRegionsResult} to handle request results.<br/>
                @method Photon.LoadBalancing.LoadBalancingClient#getRegions
            **/
            LoadBalancingClient.prototype.getRegions = function () {
                if (this.isConnectedToNameServer()) {
                    this.logger.debug("GetRegions...");
                    this.nameServerPeer.getRegions(this.appId);
                }
                else {
                    this.logger.error("GetRegions request error:", "Not connected to NameServer");
                    this.onGetRegionsResult(LoadBalancingClient.PeerErrorCode.NameServerError, "Not connected to NameServer", {});
                }
            };
            /**
                @summary Sends web rpc request to Master server.<br/ >
                Override {@link Photon.LoadBalancing.LoadBalancingClient#onWebRpcResult onWebRpcResult} to handle request results.<br/>
                @method Photon.LoadBalancing.LoadBalancingClient#webRpc
                @param {string} uriPath Request path.
                @param {object} parameters Request parameters.
                @param {object} [options] Additional options
                @property {object} options Additional options
                @property {boolean} [options.sendAuthCookie] Defines if the authentication cookie gets sent to a WebHook (if setup)
            **/
            LoadBalancingClient.prototype.webRpc = function (uriPath, parameters, options) {
                if (this.isConnectedToMaster()) {
                    this.logger.debug("WebRpc...");
                    this.masterPeer.webRpc(uriPath, parameters, options);
                }
                else if (this.isJoinedToRoom()) {
                    this.logger.debug("WebRpc...");
                    this.gamePeer.webRpc(uriPath, parameters, options);
                }
                else {
                    this.logger.error("WebRpc request error:", "Connected to neither Master nor Game server");
                    this.onWebRpcResult(LoadBalancingClient.PeerErrorCode.MasterError, "Connected to neither Master nor Game server", uriPath, 0, {});
                }
            };
            /**
                @summary Connects to a specific region's Master server, using the NameServer to find the IP.
                Override {@link Photon.LoadBalancing.LoadBalancingClient#onWebRpcResult onWebRpcResult} to handle request results.<br/>
                @method Photon.LoadBalancing.LoadBalancingClient#connectToRegionMaster
                @param {string} region Region connect to Master server of.
                @returns {boolean} True if current client state allows connection.
            **/
            LoadBalancingClient.prototype.connectToRegionMaster = function (region) {
                if (this.isConnectedToNameServer()) {
                    this.logger.debug("Connecting to Region Master", region, "...");
                    this.nameServerPeer.opAuth(this.appId, this.appVersion, this.userAuthType, this.userAuthParameters, this.userAuthData, this.userId, region);
                    return true;
                }
                else if (this.connectToNameServer({ region: region })) {
                    return true;
                }
                else {
                    this.logger.error("Connecting to Region Master error:", "Not connected to NameServer");
                    return false;
                }
            };
            /**
                @summary Checks if client is connected to Master server (usually joined to lobby and receives room list updates).
                @method Photon.LoadBalancing.LoadBalancingClient#isConnectedToMaster
                @returns {boolean} True if client is connected to Master server.
            */
            LoadBalancingClient.prototype.isConnectedToMaster = function () {
                return this.masterPeer && this.masterPeer.isConnected();
            };
            /**
                @summary Checks if client is connected to NameServer server.
                @method Photon.LoadBalancing.LoadBalancingClient#isConnectedToNameServer
                @returns {boolean} True if client is connected to NameServer server.
            */
            LoadBalancingClient.prototype.isConnectedToNameServer = function () {
                return this.nameServerPeer && this.nameServerPeer.isConnected();
            };
            /**
                @summary Checks if client is in lobby and ready to join or create game.
                @method Photon.LoadBalancing.LoadBalancingClient#isInLobby
                @returns {boolean} True if client is in lobby.
            */
            LoadBalancingClient.prototype.isInLobby = function () {
                return this.state == LoadBalancingClient.State.JoinedLobby;
            };
            /**
                @summary Checks if client is joined to game.
                @method Photon.LoadBalancing.LoadBalancingClient#isJoinedToRoom
                @returns {boolean} True if client is joined to game.
            */
            LoadBalancingClient.prototype.isJoinedToRoom = function () {
                return this.state == LoadBalancingClient.State.Joined;
            };
            /**
                @deprecated Use isJoinedToRoom()
            */
            LoadBalancingClient.prototype.isConnectedToGame = function () {
                return this.isJoinedToRoom();
            };
            /**
                @summary Current room list from Master server.
                @method Photon.LoadBalancing.LoadBalancingClient#availableRooms
                @returns {{@link Photon.LoadBalancing.RoomInfo}[]} Current room list
            */
            LoadBalancingClient.prototype.availableRooms = function () { return this.roomInfos; };
            /**
                @summary Sets client logger level
                @method Photon.LoadBalancing.LoadBalancingClient#setLogLevel
                @param {Exitgames.Common.Logger.Level} level Logging level.
            */
            LoadBalancingClient.prototype.setLogLevel = function (level) {
                this.logger.setLevel(level);
                if (this.nameServerPeer) {
                    this.nameServerPeer.setLogLevel(level);
                }
                if (this.masterPeer) {
                    this.masterPeer.setLogLevel(level);
                }
                if (this.gamePeer) {
                    this.gamePeer.setLogLevel(level);
                }
            };
            LoadBalancingClient.prototype.addRoom = function (r) { this.roomInfos.push(r); this.roomInfosDict[r.name] = r; };
            LoadBalancingClient.prototype.clearRooms = function () { this.roomInfos = new Array(); this.roomInfosDict = {}; };
            LoadBalancingClient.prototype.purgeRemovedRooms = function () {
                this.roomInfos = this.roomInfos.filter(function (x) { return !x.removed; });
                for (var n in this.roomInfosDict) {
                    if (this.roomInfosDict[n].removed) {
                        delete this.roomInfosDict[n];
                    }
                }
            };
            LoadBalancingClient.prototype.addActor = function (a) {
                this.actors[a.actorNr] = a;
                this.actorsArray.push(a);
                this.currentRoom.playerCount = this.actorsArray.length;
                if (this.lowestActorId == 0 || this.lowestActorId > a.actorNr)
                    this.lowestActorId = a.actorNr;
            };
            LoadBalancingClient.prototype.removeActor = function (actorNr) {
                delete this.actors[actorNr];
                this.actorsArray = this.actorsArray.filter(function (x) { return x.actorNr != actorNr; });
                this.currentRoom.playerCount = this.actorsArray.length;
                if (this.lowestActorId == actorNr) {
                    if (this.actorsArray.length > 0)
                        this.lowestActorId = this.actorsArray.reduce(function (prev, curr) { return prev.actorNr < curr.actorNr ? prev : curr; }).actorNr;
                    else
                        this.lowestActorId = 0;
                }
            };
            LoadBalancingClient.prototype.clearActors = function () {
                this.actors = {};
                this.actorsArray = [];
                this.currentRoom.playerCount = 0;
                this.lowestActorId = 0;
            };
            LoadBalancingClient.prototype.changeState = function (nextState) {
                this.logger.info("State:", LoadBalancingClient.StateToName(this.state), "->", LoadBalancingClient.StateToName(nextState));
                this.state = nextState;
                this.onStateChange(nextState);
            };
            LoadBalancingClient.prototype.createRoomInternal = function (peer, options) {
                var op = [];
                if (this.currentRoom.name)
                    op.push(LoadBalancing.Constants.ParameterCode.RoomName, this.currentRoom.name);
                this.fillCreateRoomOptions(op, options);
                if (peer === this.masterPeer) {
                    this.createRoomOptions = options;
                }
                if (peer === this.gamePeer) {
                    op.push(LoadBalancing.Constants.ParameterCode.PlayerProperties);
                    op.push(this._myActor._getAllProperties());
                }
                var log = peer == this.gamePeer ? this.gamePeer._logger : this.masterPeer._logger;
                log.info("Create Room", options && options.lobbyName, options && options.lobbyType, "...");
                peer.sendOperation(LoadBalancing.Constants.OperationCode.CreateGame, op);
            };
            LoadBalancingClient.prototype.updateUserIdAndNickname = function (vals, logger) {
                var userId = vals[LoadBalancing.Constants.ParameterCode.UserId];
                if (userId != undefined) {
                    this.setUserId(userId);
                    logger.info("Setting userId sent by server:", userId);
                }
                var nickname = vals[LoadBalancing.Constants.ParameterCode.Nickname];
                if (nickname != undefined) {
                    this.myActor().setName(nickname);
                    logger.info("Setting nickname sent by server:", nickname);
                }
            };
            LoadBalancingClient.prototype.initNameServerPeer = function (np) {
                var _this = this;
                np.setLogLevel(this.logger.getLevel());
                // errors
                np.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.error, function () {
                    _this.changeState(LoadBalancingClient.State.Error);
                    _this._onErrorInternal(LoadBalancingClient.PeerErrorCode.NameServerError, "NameServer peer error");
                });
                np.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.connectFailed, function () {
                    _this.changeState(LoadBalancingClient.State.Error);
                    _this._onErrorInternal(LoadBalancingClient.PeerErrorCode.NameServerConnectFailed, "NameServer peer connect failed. " + _this.nameServerAddress);
                });
                np.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.timeout, function () {
                    _this.changeState(LoadBalancingClient.State.Error);
                    _this._onErrorInternal(LoadBalancingClient.PeerErrorCode.NameServerTimeout, "NameServer peer timeout");
                });
                np.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.connecting, function () {
                });
                np.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.connect, function () {
                    np._logger.info("Connected");
                    _this.changeState(LoadBalancingClient.State.ConnectedToNameServer);
                    // connectToRegionMaster inited connection
                    if (_this.connectOptions.region != undefined) {
                        np.opAuth(_this.appId, _this.appVersion, _this.userAuthType, _this.userAuthParameters, _this.userAuthData, _this.userId, _this.connectOptions.region);
                    }
                });
                np.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.disconnect, function () {
                    if (np == _this.nameServerPeer) {
                        _this._cleanupNameServerPeerData();
                        np._logger.info("Disconnected");
                    }
                });
                np.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.connectClosed, function () {
                    np._logger.info("Server closed connection");
                    _this.changeState(LoadBalancingClient.State.Error);
                    _this._onErrorInternal(LoadBalancingClient.PeerErrorCode.NameServerConnectClosed, "NameServer server closed connection");
                });
                // events
                // responses - check operation result. data.errCode
                np.addResponseListener(LoadBalancing.Constants.OperationCode.GetRegions, function (data) {
                    np._logger.debug("resp GetRegions", data);
                    var regions = {};
                    if (data.errCode == 0) {
                        var r = data.vals[LoadBalancing.Constants.ParameterCode.Region];
                        var a = data.vals[LoadBalancing.Constants.ParameterCode.Address];
                        for (var i in r) {
                            regions[r[i]] = a[i];
                        }
                    }
                    else {
                        np._logger.error("GetRegions request error.", data.errCode);
                    }
                    _this.onGetRegionsResult(data.errCode, data.errMsg, regions);
                });
                np.addResponseListener(LoadBalancing.Constants.OperationCode.Authenticate, function (data) {
                    np._logger.debug("resp Authenticate", data);
                    if (data.errCode == 0) {
                        np._logger.info("Authenticated");
                        np.disconnect();
                        _this.updateUserIdAndNickname(data.vals, np._logger);
                        _this.masterServerAddress = data.vals[LoadBalancing.Constants.ParameterCode.Address];
                        np._logger.info("Connecting to Master server", _this.masterServerAddress, "...");
                        _this.connectOptions.userAuthSecret = data.vals[LoadBalancing.Constants.ParameterCode.Secret];
                        _this.connect(_this.connectOptions);
                    }
                    else {
                        _this.changeState(LoadBalancingClient.State.Error);
                        _this._onErrorInternal(LoadBalancingClient.PeerErrorCode.NameServerAuthenticationFailed, "NameServer authentication failed: " + data.errCode + " " + data.errMsg);
                    }
                });
            };
            // protected
            LoadBalancingClient.prototype.initMasterPeer = function (mp) {
                var _this = this;
                mp.setLogLevel(this.logger.getLevel());
                // errors
                mp.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.error, function () {
                    _this.changeState(LoadBalancingClient.State.Error);
                    _this._onErrorInternal(LoadBalancingClient.PeerErrorCode.MasterError, "Master peer error");
                });
                mp.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.connectFailed, function () {
                    _this.changeState(LoadBalancingClient.State.Error);
                    _this._onErrorInternal(LoadBalancingClient.PeerErrorCode.MasterConnectFailed, "Master peer connect failed: " + _this.masterServerAddress);
                });
                mp.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.timeout, function () {
                    _this.changeState(LoadBalancingClient.State.Error);
                    _this._onErrorInternal(LoadBalancingClient.PeerErrorCode.MasterTimeout, "Master peer error timeout");
                });
                mp.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.connecting, function () {
                });
                // status
                mp.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.connect, function () {
                    //TODO: encryption phase
                    mp._logger.info("Connected");
                    var op = [];
                    // if NameSever gave us secret
                    if (_this.connectOptions.userAuthSecret) {
                        op.push(LoadBalancing.Constants.ParameterCode.Secret, _this.connectOptions.userAuthSecret);
                        mp.sendOperation(LoadBalancing.Constants.OperationCode.Authenticate, op);
                        mp._logger.info("Authenticate with secret...");
                    }
                    else {
                        op.push(LoadBalancing.Constants.ParameterCode.ApplicationId);
                        op.push(_this.appId);
                        op.push(LoadBalancing.Constants.ParameterCode.AppVersion);
                        op.push(_this.appVersion);
                        if (_this.userAuthType != LoadBalancing.Constants.CustomAuthenticationType.None) {
                            op.push(LoadBalancing.Constants.ParameterCode.ClientAuthenticationType, Photon.TypeExt.Byte(_this.userAuthType));
                            op.push(LoadBalancing.Constants.ParameterCode.ClientAuthenticationParams, _this.userAuthParameters);
                            if (_this.userAuthData) {
                                op.push(LoadBalancing.Constants.ParameterCode.ClientAuthenticationData, _this.userAuthData);
                            }
                        }
                        if (_this.userId) {
                            op.push(LoadBalancing.Constants.ParameterCode.UserId, _this.userId);
                        }
                        if (_this.connectOptions.lobbyStats) {
                            op.push(LoadBalancing.Constants.ParameterCode.LobbyStats, true);
                        }
                        mp.sendOperation(LoadBalancing.Constants.OperationCode.Authenticate, op);
                        mp._logger.info("Authenticate...");
                    }
                });
                mp.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.disconnect, function () {
                    if (mp == _this.masterPeer) {
                        _this._cleanupMasterPeerData();
                        mp._logger.info("Disconnected");
                    }
                });
                mp.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.connectClosed, function () {
                    mp._logger.info("Server closed connection");
                    _this.changeState(LoadBalancingClient.State.Error);
                    _this._onErrorInternal(LoadBalancingClient.PeerErrorCode.MasterConnectClosed, "Master server closed connection");
                });
                //events
                mp.addEventListener(LoadBalancing.Constants.EventCode.GameList, function (data) {
                    var gameList = data.vals[LoadBalancing.Constants.ParameterCode.GameList];
                    _this.clearRooms();
                    for (var g in gameList) {
                        var r = new RoomInfo(g);
                        r._updateFromProps(gameList[g]);
                        _this.addRoom(r);
                    }
                    _this.onRoomList(_this.roomInfos);
                    mp._logger.debug("ev GameList", _this.roomInfos, gameList);
                });
                mp.addEventListener(LoadBalancing.Constants.EventCode.GameListUpdate, function (data) {
                    var gameList = data.vals[LoadBalancing.Constants.ParameterCode.GameList];
                    var roomsUpdated = new Array();
                    var roomsAdded = new Array();
                    var roomsRemoved = new Array();
                    for (var g in gameList) {
                        var exist = _this.roomInfos.filter(function (x) { return x.name == g; });
                        if (exist.length > 0) {
                            var r = exist[0];
                            r._updateFromProps(gameList[g]);
                            if (r.removed) {
                                roomsRemoved.push(r);
                            }
                            else {
                                roomsUpdated.push(r);
                            }
                        }
                        else {
                            var ri = new RoomInfo(g);
                            ri._updateFromProps(gameList[g]);
                            _this.addRoom(ri);
                            roomsAdded.push(ri);
                        }
                    }
                    _this.purgeRemovedRooms();
                    _this.onRoomListUpdate(_this.roomInfos, roomsUpdated, roomsAdded, roomsRemoved);
                    mp._logger.debug("ev GameListUpdate:", _this.roomInfos, "u:", roomsUpdated, "a:", roomsAdded, "r:", roomsRemoved, gameList);
                });
                // responses - check operation result: data.errCode
                mp.addResponseListener(LoadBalancing.Constants.OperationCode.Authenticate, function (data) {
                    mp._logger.debug("resp Authenticate", data);
                    if (!data.errCode) {
                        mp._logger.info("Authenticated");
                        _this.updateUserIdAndNickname(data.vals, mp._logger);
                        if (data.vals[LoadBalancing.Constants.ParameterCode.Secret] != undefined) {
                            _this.connectOptions.userAuthSecret = data.vals[LoadBalancing.Constants.ParameterCode.Secret];
                        }
                        _this.changeState(LoadBalancingClient.State.ConnectedToMaster);
                        var op = [];
                        if (_this.connectOptions.lobbyName) {
                            op.push(LoadBalancing.Constants.ParameterCode.LobbyName);
                            op.push(_this.connectOptions.lobbyName);
                            if (_this.connectOptions.lobbyType != undefined) {
                                op.push(LoadBalancing.Constants.ParameterCode.LobbyType);
                                op.push(_this.connectOptions.lobbyType);
                            }
                        }
                        if (_this.autoJoinLobby) {
                            mp.sendOperation(LoadBalancing.Constants.OperationCode.JoinLobby, op);
                            mp._logger.info("Join Lobby", _this.connectOptions.lobbyName, _this.connectOptions.lobbyType, "...");
                        }
                    }
                    else {
                        _this.changeState(LoadBalancingClient.State.Error);
                        _this._onErrorInternal(LoadBalancingClient.PeerErrorCode.MasterAuthenticationFailed, "Master authentication failed: " + data.errCode + " " + data.errMsg);
                    }
                });
                mp.addResponseListener(LoadBalancing.Constants.OperationCode.JoinLobby, function (data) {
                    mp._logger.debug("resp JoinLobby", data);
                    if (!data.errCode) {
                        mp._logger.info("Joined to Lobby");
                        _this.changeState(LoadBalancingClient.State.JoinedLobby);
                    }
                    _this._onOperationResponseInternal2(LoadBalancing.Constants.OperationCode.JoinLobby, data);
                });
                mp.addResponseListener(LoadBalancing.Constants.OperationCode.CreateGame, function (data) {
                    mp._logger.debug("resp CreateGame", data);
                    if (!data.errCode) {
                        _this.currentRoom._updateFromMasterResponse(data.vals);
                        mp._logger.debug("Created/Joined " + _this.currentRoom.name);
                        _this.connectToGameServer(LoadBalancing.Constants.OperationCode.CreateGame);
                    }
                    _this._onOperationResponseInternal2(LoadBalancing.Constants.OperationCode.CreateGame, data);
                });
                mp.addResponseListener(LoadBalancing.Constants.OperationCode.JoinGame, function (data) {
                    mp._logger.debug("resp JoinGame", data);
                    if (!data.errCode) {
                        _this.currentRoom._updateFromMasterResponse(data.vals);
                        mp._logger.debug("Joined " + _this.currentRoom.name);
                        _this.connectToGameServer(LoadBalancing.Constants.OperationCode.JoinGame);
                    }
                    _this._onOperationResponseInternal2(LoadBalancing.Constants.OperationCode.JoinGame, data);
                });
                mp.addResponseListener(LoadBalancing.Constants.OperationCode.JoinRandomGame, function (data) {
                    mp._logger.debug("resp JoinRandomGame", data);
                    if (!data.errCode) {
                        _this.currentRoom._updateFromMasterResponse(data.vals);
                        mp._logger.debug("Joined " + _this.currentRoom.name);
                        _this.connectToGameServer(LoadBalancing.Constants.OperationCode.JoinRandomGame);
                    }
                    _this._onOperationResponseInternal2(LoadBalancing.Constants.OperationCode.JoinRandomGame, data);
                });
                mp.addResponseListener(LoadBalancing.Constants.OperationCode.FindFriends, function (data) {
                    mp._logger.debug("resp FindFriends", data);
                    var res = {};
                    if (!data.errCode) {
                        var onlines = data.vals[LoadBalancing.Constants.ParameterCode.FindFriendsResponseOnlineList] || {};
                        var roomIds = data.vals[LoadBalancing.Constants.ParameterCode.FindFriendsResponseRoomIdList] || {};
                        for (var i = 0; i < _this.findFriendsRequestList.length; ++i) {
                            var name = _this.findFriendsRequestList[i];
                            if (name) {
                                res[name] = { online: onlines[i], roomId: roomIds[i] };
                            }
                        }
                    }
                    else {
                        mp._logger.error("FindFriends request error:", data.errCode);
                    }
                    _this.onFindFriendsResult(data.errCode, data.errMsg, res);
                });
                mp.addResponseListener(LoadBalancing.Constants.OperationCode.LobbyStats, function (data) {
                    mp._logger.debug("resp LobbyStats", data);
                    var res = new Array();
                    if (!data.errCode) {
                        var names = data.vals[LoadBalancing.Constants.ParameterCode.LobbyName]; // not inited intentionally
                        var types = data.vals[LoadBalancing.Constants.ParameterCode.LobbyType] || {};
                        var peers = data.vals[LoadBalancing.Constants.ParameterCode.PeerCount] || {};
                        var games = data.vals[LoadBalancing.Constants.ParameterCode.GameCount] || {};
                        if (names) {
                            for (var i = 0; i < names.length; ++i) {
                                res[i] = { lobbyName: names[i], lobbyType: types[i], peerCount: peers[i], gameCount: games[i] };
                            }
                        }
                        else {
                            for (var i = 0; i < _this.lobbyStatsRequestList.length; ++i) {
                                var l = _this.lobbyStatsRequestList[i];
                                res[i] = { lobbyName: l[0], lobbyType: l[1], peerCount: peers[i], gameCount: games[i] };
                            }
                        }
                    }
                    else {
                        mp._logger.error("LobbyStats request error:", data.errCode);
                    }
                    _this.onLobbyStats(data.errCode, data.errMsg, res);
                });
                mp.addEventListener(LoadBalancing.Constants.EventCode.LobbyStats, function (data) {
                    mp._logger.debug("ev LobbyStats", data);
                    var res = new Array();
                    var names = data.vals[LoadBalancing.Constants.ParameterCode.LobbyName]; // not inited intentionally
                    var types = data.vals[LoadBalancing.Constants.ParameterCode.LobbyType] || {};
                    var peers = data.vals[LoadBalancing.Constants.ParameterCode.PeerCount] || {};
                    var games = data.vals[LoadBalancing.Constants.ParameterCode.GameCount] || {};
                    if (names) {
                        for (var i = 0; i < names.length; ++i) {
                            res[i] = { lobbyName: names[i], lobbyType: types[i], peerCount: peers[i], gameCount: games[i] };
                        }
                    }
                    _this.onLobbyStats(0, "", res);
                });
                mp.addEventListener(LoadBalancing.Constants.EventCode.AppStats, function (data) {
                    mp._logger.debug("ev AppStats", data);
                    var res = {
                        peerCount: data.vals[LoadBalancing.Constants.ParameterCode.PeerCount],
                        masterPeerCount: data.vals[LoadBalancing.Constants.ParameterCode.MasterPeerCount],
                        gameCount: data.vals[LoadBalancing.Constants.ParameterCode.GameCount]
                    };
                    _this.onAppStats(0, "", res);
                });
                mp.addResponseListener(LoadBalancing.Constants.OperationCode.Rpc, mp.webRpcHandler(this));
            };
            LoadBalancingClient.prototype.connectToGameServer = function (masterOpCode) {
                if (!this.connectOptions.keepMasterConnection) {
                    this.masterPeer.disconnect();
                }
                if (this.checkNextState(LoadBalancingClient.State.ConnectingToGameserver, true)) {
                    this.logger.info("Connecting to Game", this.currentRoom.address);
                    if (this.gamePeer)
                        this.gamePeer.Destroy();
                    this.gamePeer = new GamePeer(this, this.connectionProtocol, this.currentRoom.address, "");
                    this.gamePeerWaitingForDisconnect = false;
                    this.initGamePeer(this.gamePeer, masterOpCode);
                    this.gamePeer.connect(this.appId);
                    this.changeState(LoadBalancingClient.State.ConnectingToGameserver);
                    return true;
                }
                else {
                    return false;
                }
            };
            LoadBalancingClient.prototype.initGamePeer = function (gp, masterOpCode) {
                var _this = this;
                gp.setLogLevel(this.logger.getLevel());
                // errors
                gp.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.error, function () {
                    _this.changeState(LoadBalancingClient.State.Error);
                    _this._onErrorInternal(LoadBalancingClient.PeerErrorCode.GameError, "Game peer error");
                });
                gp.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.connectFailed, function () {
                    _this.changeState(LoadBalancingClient.State.Error);
                    _this._onErrorInternal(LoadBalancingClient.PeerErrorCode.GameConnectFailed, "Game peer connect failed: " + _this.currentRoom.address);
                });
                gp.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.timeout, function () {
                    _this.changeState(LoadBalancingClient.State.Error);
                    _this._onErrorInternal(LoadBalancingClient.PeerErrorCode.GameTimeout, "Game peer timeout");
                });
                // status
                gp.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.connect, function () {
                    gp._logger.info("Connected");
                    //TODO: encryption phase
                    var op = [];
                    op.push(LoadBalancing.Constants.ParameterCode.ApplicationId);
                    op.push(_this.appId);
                    op.push(LoadBalancing.Constants.ParameterCode.AppVersion);
                    op.push(_this.appVersion);
                    if (_this.connectOptions.userAuthSecret != undefined) {
                        op.push(LoadBalancing.Constants.ParameterCode.Secret);
                        op.push(_this.connectOptions.userAuthSecret);
                    }
                    if (_this.userAuthType != LoadBalancing.Constants.CustomAuthenticationType.None) {
                        op.push(LoadBalancing.Constants.ParameterCode.ClientAuthenticationType);
                        op.push(Photon.TypeExt.Byte(_this.userAuthType));
                    }
                    if (_this.userId) {
                        op.push(LoadBalancing.Constants.ParameterCode.UserId, _this.userId);
                    }
                    gp.sendOperation(LoadBalancing.Constants.OperationCode.Authenticate, op);
                    gp._logger.info("Authenticate...");
                });
                gp.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.disconnect, function () {
                    if (gp == _this.gamePeer) {
                        _this._cleanupGamePeerData();
                        gp._logger.info("Disconnected");
                    }
                });
                gp.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.connectClosed, function () {
                    gp._logger.info("Server closed connection");
                    if (!_this.gamePeerWaitingForDisconnect) {
                        _this.changeState(LoadBalancingClient.State.Error);
                        _this._onErrorInternal(LoadBalancingClient.PeerErrorCode.MasterConnectClosed, "Game server closed connection");
                    }
                });
                // responses
                gp.addResponseListener(LoadBalancing.Constants.OperationCode.Authenticate, function (data) {
                    gp._logger.debug("resp Authenticate", data);
                    if (!data.errCode) {
                        gp._logger.info("Authenticated");
                        gp._logger.info("Connected");
                        if (masterOpCode == LoadBalancing.Constants.OperationCode.CreateGame) {
                            _this.createRoomInternal(gp, _this.createRoomOptions);
                        }
                        else {
                            var op = [];
                            op.push(LoadBalancing.Constants.ParameterCode.RoomName);
                            op.push(_this.currentRoom.name);
                            op.push(LoadBalancing.Constants.ParameterCode.Broadcast);
                            op.push(true);
                            op.push(LoadBalancing.Constants.ParameterCode.PlayerProperties);
                            op.push(_this._myActor._getAllProperties());
                            if (masterOpCode == LoadBalancing.Constants.OperationCode.JoinGame) {
                                if (_this.joinRoomOptions.createIfNotExists) {
                                    op.push(LoadBalancing.Constants.ParameterCode.JoinMode, LoadBalancingClient.JoinMode.CreateIfNotExists);
                                    _this.fillCreateRoomOptions(op, _this.createRoomOptions);
                                }
                                if (_this.joinRoomOptions.rejoin) {
                                    op.push(LoadBalancing.Constants.ParameterCode.JoinMode, LoadBalancingClient.JoinMode.RejoinOnly);
                                }
                            }
                            gp.sendOperation(LoadBalancing.Constants.OperationCode.JoinGame, op);
                        }
                        _this.changeState(LoadBalancingClient.State.ConnectedToGameserver);
                    }
                    else {
                        _this.changeState(LoadBalancingClient.State.Error);
                        _this._onErrorInternal(LoadBalancingClient.PeerErrorCode.GameAuthenticationFailed, "Game authentication failed: " + data.errCode + " " + data.errMsg);
                    }
                });
                gp.addResponseListener(LoadBalancing.Constants.OperationCode.CreateGame, function (data) {
                    gp._logger.debug("resp CreateGame", data);
                    if (!data.errCode) {
                        _this._myActor._updateMyActorFromResponse(data.vals);
                        gp._logger.info("myActor: ", _this._myActor);
                        _this.currentRoom._updateFromProps(data.vals[LoadBalancing.Constants.ParameterCode.GameProperties]);
                        _this.clearActors();
                        _this.addActor(_this._myActor);
                        _this.changeState(LoadBalancingClient.State.Joined);
                        _this.onJoinRoom(true);
                    }
                    _this._onOperationResponseInternal2(LoadBalancing.Constants.OperationCode.CreateGame, data);
                });
                gp.addResponseListener(LoadBalancing.Constants.OperationCode.JoinGame, function (data) {
                    gp._logger.debug("resp JoinGame", data);
                    if (!data.errCode) {
                        _this._myActor._updateMyActorFromResponse(data.vals);
                        gp._logger.info("myActor: ", _this._myActor);
                        _this.clearActors();
                        _this.addActor(_this._myActor);
                        var actorList = data.vals[LoadBalancing.Constants.ParameterCode.ActorList];
                        var actorProps = data.vals[LoadBalancing.Constants.ParameterCode.PlayerProperties];
                        if (actorList !== undefined) {
                            for (var i = 0; i < actorList.length; i++) {
                                var actorNr = actorList[i];
                                var props;
                                if (actorProps !== undefined)
                                    props = actorProps[actorNr];
                                var name;
                                if (props !== undefined) {
                                    name = props[LoadBalancing.Constants.ActorProperties.PlayerName];
                                }
                                var a;
                                if (actorNr == _this._myActor.actorNr)
                                    a = _this._myActor;
                                else {
                                    a = _this.actorFactoryInternal(name, actorNr);
                                    _this.addActor(a);
                                }
                                if (props !== undefined) {
                                    a._updateCustomProperties(props);
                                }
                            }
                        }
                        _this.currentRoom._updateFromProps(data.vals[LoadBalancing.Constants.ParameterCode.GameProperties]);
                        _this.changeState(LoadBalancingClient.State.Joined);
                        _this.onJoinRoom(false);
                    }
                    _this._onOperationResponseInternal2(LoadBalancing.Constants.OperationCode.JoinGame, data);
                });
                gp.addResponseListener(LoadBalancing.Constants.OperationCode.SetProperties, function (data) {
                    gp._logger.debug("resp SetProperties", data);
                    _this._onOperationResponseInternal2(LoadBalancing.Constants.OperationCode.SetProperties, data);
                });
                gp.addResponseListener(LoadBalancing.Constants.OperationCode.Leave, function (data) {
                    gp._logger.debug("resp Leave", data);
                    gp.disconnect();
                    _this._onOperationResponseInternal2(LoadBalancing.Constants.OperationCode.Leave, data);
                });
                gp.addResponseListener(LoadBalancing.Constants.OperationCode.Rpc, gp.webRpcHandler(this));
                // events
                gp.addEventListener(LoadBalancing.Constants.EventCode.Join, function (data) {
                    gp._logger.debug("ev Join", data);
                    if (Actor._getActorNrFromResponse(data.vals) === _this._myActor.actorNr) {
                        //this._myActor._updateMyActorFromResponse(data.vals);
                        _this._myActor._updateFromResponse(data.vals);
                        //                    this.addActor(this._myActor);
                        _this.onActorJoin(_this._myActor); // let client read updated properties
                    }
                    else {
                        var actor = _this.actorFactoryInternal();
                        actor._updateFromResponse(data.vals);
                        _this.addActor(actor);
                        _this.onActorJoin(actor);
                    }
                });
                gp.addEventListener(LoadBalancing.Constants.EventCode.Leave, function (data) {
                    gp._logger.debug("ev Leave", data);
                    _this.myRoom()._updateFromEvent(data.vals); // updating masterClientId
                    var actorNr = Actor._getActorNrFromResponse(data.vals);
                    if (actorNr && _this.actors[actorNr]) {
                        var a = _this.actors[actorNr];
                        if (data.vals[LoadBalancing.Constants.ParameterCode.IsInactive]) {
                            a._setSuspended(true);
                            _this.onActorSuspend(a);
                        }
                        else {
                            _this.removeActor(actorNr);
                            _this.onActorLeave(a, false);
                        }
                    }
                });
                gp.addEventListener(LoadBalancing.Constants.EventCode.Disconnect, function (data) {
                    gp._logger.debug("ev Disconnect", data);
                    var actorNr = Actor._getActorNrFromResponse(data.vals);
                    if (actorNr && _this.actors[actorNr]) {
                        var a = _this.actors[actorNr];
                        a._setSuspended(true);
                        _this.onActorSuspend(a);
                    }
                });
                gp.addEventListener(LoadBalancing.Constants.EventCode.PropertiesChanged, function (data) {
                    gp._logger.debug("ev PropertiesChanged", data);
                    var targetActorNr = data.vals[LoadBalancing.Constants.ParameterCode.TargetActorNr];
                    if (targetActorNr !== undefined && targetActorNr > 0) {
                        if (_this.actors[targetActorNr] !== undefined) {
                            var actor = _this.actors[targetActorNr];
                            actor._updateCustomProperties(data.vals[LoadBalancing.Constants.ParameterCode.Properties]);
                            _this.onActorPropertiesChange(actor);
                        }
                    }
                    else {
                        _this.currentRoom._updateFromProps(data.vals[LoadBalancing.Constants.ParameterCode.Properties]);
                        _this.onMyRoomPropertiesChange();
                    }
                });
            };
            LoadBalancingClient.prototype._cleanupNameServerPeerData = function () {
            };
            LoadBalancingClient.prototype._cleanupMasterPeerData = function () {
            };
            LoadBalancingClient.prototype._cleanupGamePeerData = function () {
                for (var i in this.actors) {
                    this.onActorLeave(this.actors[i], true);
                }
                this.clearActors();
                this.addActor(this._myActor);
            };
            LoadBalancingClient.prototype._onOperationResponseInternal2 = function (code, data) {
                if (data.errCode) {
                    this.logger.warn("Operation", code, "error:", data.errMsg, "(" + data.errCode + ")");
                }
                this.onOperationResponse(data.errCode, data.errMsg, code, data.vals);
            };
            LoadBalancingClient.prototype._onErrorInternal = function (errorCode, errorMsg) {
                this.logger.error("Error:", errorCode, errorMsg);
                this.onError(errorCode, errorMsg);
            };
            //TODO: ugly way to init const table
            LoadBalancingClient.prototype.initValidNextState = function () {
                this.validNextState[LoadBalancingClient.State.Error] = [LoadBalancingClient.State.ConnectingToMasterserver, LoadBalancingClient.State.ConnectingToNameServer];
                this.validNextState[LoadBalancingClient.State.Uninitialized] = [LoadBalancingClient.State.ConnectingToMasterserver, LoadBalancingClient.State.ConnectingToNameServer];
                this.validNextState[LoadBalancingClient.State.ConnectedToNameServer] = [LoadBalancingClient.State.ConnectingToMasterserver];
                this.validNextState[LoadBalancingClient.State.Disconnected] = [LoadBalancingClient.State.ConnectingToMasterserver, LoadBalancingClient.State.ConnectingToNameServer];
                this.validNextState[LoadBalancingClient.State.ConnectedToMaster] = [LoadBalancingClient.State.JoinedLobby];
                this.validNextState[LoadBalancingClient.State.JoinedLobby] = [LoadBalancingClient.State.ConnectingToGameserver];
                this.validNextState[LoadBalancingClient.State.ConnectingToGameserver] = [LoadBalancingClient.State.ConnectedToGameserver];
                this.validNextState[LoadBalancingClient.State.ConnectedToGameserver] = [LoadBalancingClient.State.Joined];
            };
            LoadBalancingClient.prototype.checkNextState = function (nextState, dontThrow) {
                if (dontThrow === void 0) { dontThrow = false; }
                var valid = this.validNextState[this.state];
                var res = valid && valid.indexOf(nextState) >= 0;
                if (!res) {
                    if (dontThrow) {
                        this.logger.error("LoadBalancingPeer checkNextState fail: " + LoadBalancingClient.StateToName(this.state) + " -> " + LoadBalancingClient.StateToName(nextState));
                    }
                    else {
                        this.logger.exception(501, "LoadBalancingPeer checkNextState fail: " + LoadBalancingClient.StateToName(this.state) + " -> " + LoadBalancingClient.StateToName(nextState));
                    }
                }
                return res;
            };
            /**
                @summary Converts {@link Photon.LoadBalancing.LoadBalancingClient.State State} element to string name.
                @method Photon.LoadBalancing.LoadBalancingClient.StateToName
                @param {Photon.LoadBalancing.LoadBalancingClient.State} state Client state enum element.
                @returns {string} Specified element name or undefined if not found.
            */
            LoadBalancingClient.StateToName = function (value) { return Exitgames.Common.Util.getEnumKeyByValue(LoadBalancingClient.State, value); };
            LoadBalancingClient.JoinMode = {
                Default: 0,
                CreateIfNotExists: 1,
                //            JoinOrejoin: 2,
                RejoinOnly: 3
            };
            // tsc looses all comments after first static member 
            // jsdoc reads comments from any place within class (and may be from any place in file)
            LoadBalancingClient.PeerErrorCode = {
                /**
                    @summary Enum for client peers error codes.
                    @member Photon.LoadBalancing.LoadBalancingClient.PeerErrorCode
                    @readonly
                    @property {number} Ok No Error.
                    @property {number} MasterError General Master server peer error.
                    @property {number} MasterConnectFailed Master server connection error.
                    @property {number} MasterConnectClosed Disconnected from Master server.
                    @property {number} MasterTimeout Disconnected from Master server for timeout.
                    @property {number} MasterEncryptionEstablishError Master server encryption establishing failed.
                    @property {number} MasterAuthenticationFailed Master server authentication failed.
                    @property {number} GameError General Game server peer error.
                    @property {number} GameConnectFailed Game server connection error.
                    @property {number} GameConnectClosed Disconnected from Game server.
                    @property {number} GameTimeout Disconnected from Game server for timeout.
                    @property {number} GameEncryptionEstablishError Game server encryption establishing failed.
                    @property {number} GameAuthenticationFailed Game server authentication failed.
                    @property {number} NameServerError General NameServer peer error.
                    @property {number} NameServerConnectFailed NameServer connection error.
                    @property {number} NameServerConnectClosed Disconnected from NameServer.
                    @property {number} NameServerTimeout Disconnected from NameServer for timeout.
                    @property {number} NameServerEncryptionEstablishError NameServer encryption establishing failed.
                    @property {number} NameServerAuthenticationFailed NameServer authentication failed.
                 */
                Ok: 0,
                MasterError: 1001,
                MasterConnectFailed: 1002,
                MasterConnectClosed: 1003,
                MasterTimeout: 1004,
                MasterEncryptionEstablishError: 1005,
                MasterAuthenticationFailed: 1101,
                GameError: 2001,
                GameConnectFailed: 2002,
                GameConnectClosed: 2003,
                GameTimeout: 2004,
                GameEncryptionEstablishError: 2005,
                GameAuthenticationFailed: 2101,
                NameServerError: 3001,
                NameServerConnectFailed: 3002,
                NameServerConnectClosed: 3003,
                NameServerTimeout: 3004,
                NameServerEncryptionEstablishError: 3005,
                NameServerAuthenticationFailed: 3101
            };
            LoadBalancingClient.State = {
                /**
                    @summary Enum for client states.
                    @member Photon.LoadBalancing.LoadBalancingClient.State
                    @readonly
                    @property {number} Error Critical error occurred.
                    @property {number} Uninitialized Client is created but not used yet.
                    @property {number} ConnectingToNameServer Connecting to NameServer.
                    @property {number} ConnectedToNameServer Connected to NameServer.
                    @property {number} ConnectingToMasterserver Connecting to Master (includes connect, authenticate and joining the lobby).
                    @property {number} ConnectedToMaster Connected to Master server.
                    @property {number} JoinedLobby Connected to Master and joined lobby. Display room list and join/create rooms at will.
                    @property {number} ConnectingToGameserver Connecting to Game server(client will authenticate and join/create game).
                    @property {number} ConnectedToGameserver Connected to Game server (going to auth and join game).
                    @property {number} Joined The client joined room.
                    @property {number} Disconnected The client is no longer connected (to any server). Connect to Master to go on.
                */
                Error: -1,
                Uninitialized: 0,
                ConnectingToNameServer: 1,
                ConnectedToNameServer: 2,
                ConnectingToMasterserver: 3,
                ConnectedToMaster: 4,
                JoinedLobby: 5,
                ConnectingToGameserver: 6,
                ConnectedToGameserver: 7,
                Joined: 8,
                Disconnected: 10
            };
            return LoadBalancingClient;
        }());
        LoadBalancing.LoadBalancingClient = LoadBalancingClient;
        //TODO: internal
        var LbcPeer = /** @class */ (function (_super) {
            __extends(LbcPeer, _super);
            function LbcPeer() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            LbcPeer.prototype.webRpc = function (uriPath, parameters, options) {
                var params = [];
                params.push(LoadBalancing.Constants.ParameterCode.UriPath, uriPath);
                params.push(LoadBalancing.Constants.ParameterCode.RpcCallParams, parameters);
                if (options) {
                    if (options.sendAuthCookie) {
                        params.push(LoadBalancing.Constants.ParameterCode.WebFlags, Photon.TypeExt.Byte(WebFlags.SendAuthCookie));
                    }
                }
                this.sendOperation(LoadBalancing.Constants.OperationCode.Rpc, params);
            };
            LbcPeer.prototype.webRpcHandler = function (lbc) {
                var _this = this;
                return function (d) {
                    _this._logger.debug("resp Rpc", d);
                    var uriPath, message, data, resultCode;
                    if (d.errCode == 0) {
                        uriPath = d.vals[LoadBalancing.Constants.ParameterCode.UriPath];
                        data = d.vals[LoadBalancing.Constants.ParameterCode.RpcCallRetData];
                        resultCode = d.vals[LoadBalancing.Constants.ParameterCode.RpcCallRetCode];
                    }
                    else {
                        _this._logger.error("WebRpc request error:", d.errCode);
                    }
                    lbc.onWebRpcResult(d.errCode, d.errMsg, uriPath, resultCode, data);
                };
            };
            return LbcPeer;
        }(Photon.PhotonPeer));
        LoadBalancing.LbcPeer = LbcPeer;
        var NameServerPeer = /** @class */ (function (_super) {
            __extends(NameServerPeer, _super);
            function NameServerPeer(client, protocol, address, subprotocol) {
                var _this = _super.call(this, protocol, address, subprotocol, client.logger.getPrefix() + " NameServer") || this;
                _this.client = client;
                return _this;
            }
            // overrides
            NameServerPeer.prototype.onUnhandledEvent = function (code, args) {
                this.client.onEvent(code, args.vals[LoadBalancing.Constants.ParameterCode.CustomEventContent], args.vals[LoadBalancing.Constants.ParameterCode.ActorNr]);
            };
            NameServerPeer.prototype.onUnhandledResponse = function (code, args) {
                this.client.onOperationResponse(args.errCode, args.errMsg, code, args.vals);
            };
            NameServerPeer.prototype.getRegions = function (appId) {
                var params = [];
                params.push(LoadBalancing.Constants.ParameterCode.ApplicationId, appId);
                this.sendOperation(LoadBalancing.Constants.OperationCode.GetRegions, params, true, 0);
            };
            // this = LBC
            NameServerPeer.prototype.opAuth = function (appId, appVersion, userAuthType, userAuthParameters, userAuthData, userId, region) {
                var op = [];
                op.push(LoadBalancing.Constants.ParameterCode.ApplicationId, appId);
                op.push(LoadBalancing.Constants.ParameterCode.AppVersion, appVersion);
                if (userAuthType != LoadBalancing.Constants.CustomAuthenticationType.None) {
                    op.push(LoadBalancing.Constants.ParameterCode.ClientAuthenticationType, Photon.TypeExt.Byte(userAuthType));
                    op.push(LoadBalancing.Constants.ParameterCode.ClientAuthenticationParams, userAuthParameters);
                    if (userAuthData) {
                        op.push(LoadBalancing.Constants.ParameterCode.ClientAuthenticationData, userAuthData);
                    }
                }
                if (userId) {
                    op.push(LoadBalancing.Constants.ParameterCode.UserId, userId);
                }
                //    		if (this.connectOptions.lobbyStats) {
                //    			op.push(Constants.ParameterCode.LobbyStats, true);
                //    		}
                op.push(LoadBalancing.Constants.ParameterCode.Region, region);
                this.sendOperation(LoadBalancing.Constants.OperationCode.Authenticate, op, true, 0);
                this._logger.info("Authenticate...");
            };
            return NameServerPeer;
        }(LbcPeer));
        LoadBalancing.NameServerPeer = NameServerPeer;
        //TODO: internal
        var MasterPeer = /** @class */ (function (_super) {
            __extends(MasterPeer, _super);
            function MasterPeer(client, protocol, address, subprotocol) {
                var _this = _super.call(this, protocol, address, subprotocol, client.logger.getPrefix() + " Master") || this;
                _this.client = client;
                return _this;
            }
            // overrides
            MasterPeer.prototype.onUnhandledEvent = function (code, args) {
                this.client.onEvent(code, args.vals[LoadBalancing.Constants.ParameterCode.CustomEventContent], args.vals[LoadBalancing.Constants.ParameterCode.ActorNr]);
            };
            MasterPeer.prototype.onUnhandledResponse = function (code, args) {
                this.client.onOperationResponse(args.errCode, args.errMsg, code, args.vals);
            };
            MasterPeer.prototype.findFriends = function (friendsToFind) {
                var params = [];
                params.push(LoadBalancing.Constants.ParameterCode.FindFriendsRequestList);
                params.push(friendsToFind);
                this.sendOperation(LoadBalancing.Constants.OperationCode.FindFriends, params);
            };
            MasterPeer.prototype.requestLobbyStats = function (lobbiesToRequest) {
                var params = [];
                if (lobbiesToRequest && lobbiesToRequest.length > 0) {
                    var n = new Array();
                    var t = new Array();
                    for (var i = 0; i < lobbiesToRequest.length; ++i) {
                        n[i] = lobbiesToRequest[i][0];
                        t[i] = lobbiesToRequest[i][1];
                    }
                    params.push(LoadBalancing.Constants.ParameterCode.LobbyName);
                    params.push(n);
                    params.push(LoadBalancing.Constants.ParameterCode.LobbyType);
                    params.push(t);
                }
                this.sendOperation(LoadBalancing.Constants.OperationCode.LobbyStats, params);
            };
            return MasterPeer;
        }(LbcPeer));
        LoadBalancing.MasterPeer = MasterPeer;
        //TODO: internal
        var GamePeer = /** @class */ (function (_super) {
            __extends(GamePeer, _super);
            function GamePeer(client, protocol, address, subprotocol) {
                var _this = _super.call(this, protocol, address, subprotocol, client.logger.getPrefix() + " Game") || this;
                _this.client = client;
                return _this;
            }
            // overrides
            GamePeer.prototype.onUnhandledEvent = function (code, args) {
                this.client.onEvent(code, args.vals[LoadBalancing.Constants.ParameterCode.CustomEventContent], args.vals[LoadBalancing.Constants.ParameterCode.ActorNr]);
            };
            // overrides
            GamePeer.prototype.onUnhandledResponse = function (code, args) {
                this.client.onOperationResponse(args.errCode, args.errMsg, code, args.vals);
            };
            GamePeer.prototype.raiseEvent = function (eventCode, data, options) {
                if (this.client.isJoinedToRoom()) {
                    this._logger.debug("raiseEvent", eventCode, data, options);
                    var params = [LoadBalancing.Constants.ParameterCode.Code, Photon.TypeExt.Byte(eventCode), LoadBalancing.Constants.ParameterCode.Data, data];
                    if (options) {
                        if (options.receivers != undefined && options.receivers !== LoadBalancing.Constants.ReceiverGroup.Others) {
                            params.push(LoadBalancing.Constants.ParameterCode.ReceiverGroup);
                            params.push(Photon.TypeExt.Byte(options.receivers));
                        }
                        if (options.cache != undefined && options.cache !== LoadBalancing.Constants.EventCaching.DoNotCache) {
                            params.push(LoadBalancing.Constants.ParameterCode.Cache);
                            params.push(Photon.TypeExt.Byte(options.cache));
                        }
                        if (options.interestGroup != undefined) {
                            if (this.checkGroupNumber(options.interestGroup)) {
                                params.push(LoadBalancing.Constants.ParameterCode.Group);
                                params.push(Photon.TypeExt.Byte(options.interestGroup));
                            }
                            else {
                                this._logger.exception(502, "raiseEvent - Group not a number: " + options.interestGroup);
                            }
                        }
                        if (options.targetActors != undefined) {
                            params.push(LoadBalancing.Constants.ParameterCode.ActorList);
                            params.push(options.targetActors);
                        }
                        if (options.webForward) {
                            params.push(LoadBalancing.Constants.ParameterCode.WebFlags);
                            params.push(Photon.TypeExt.Byte(WebFlags.HttpForward));
                        }
                    }
                    this.sendOperation(LoadBalancing.Constants.OperationCode.RaiseEvent, params);
                }
                else {
                    throw new Error("raiseEvent - Not joined!");
                }
            };
            GamePeer.prototype.changeGroups = function (groupsToRemove, groupsToAdd) {
                var params = [];
                if (groupsToRemove != null && groupsToRemove != undefined) {
                    this.checkGroupArray(groupsToRemove, "groupsToRemove");
                    params.push(LoadBalancing.Constants.ParameterCode.Remove);
                    params.push(Photon.TypeExt.Byte(groupsToRemove));
                }
                if (groupsToAdd != null && groupsToAdd != undefined) {
                    this.checkGroupArray(groupsToAdd, "groupsToAdd");
                    params.push(LoadBalancing.Constants.ParameterCode.Add);
                    params.push(Photon.TypeExt.Byte(groupsToAdd));
                }
                this.sendOperation(LoadBalancing.Constants.OperationCode.ChangeGroups, params);
            };
            GamePeer.prototype.checkGroupNumber = function (g) {
                return !(typeof (g) != "number" || isNaN(g) || g === Infinity || g === -Infinity);
            };
            GamePeer.prototype.checkGroupArray = function (groups, groupsName) {
                if (Exitgames.Common.Util.isArray(groups)) {
                    for (var i = 0; i < groups.length; ++i) {
                        var g = groups[i];
                        if (this.checkGroupNumber(g)) {
                        }
                        else {
                            this._logger.exception(503, "changeGroups - " + groupsName + " (" + groups + ") not an array of numbers: element " + i + " = " + g);
                        }
                    }
                }
                else {
                    this._logger.exception(504, "changeGroups - groupsToRemove not an array: " + groups);
                }
            };
            return GamePeer;
        }(LbcPeer));
        LoadBalancing.GamePeer = GamePeer;
    })(LoadBalancing = Photon.LoadBalancing || (Photon.LoadBalancing = {}));
})(Photon || (Photon = {}));
/**
    Photon Load Balancing API Constants
    @namespace Photon.LoadBalancing.Constants
*/
var Photon;
(function (Photon) {
    var Lite;
    (function (Lite) {
        var Constants;
        (function (Constants) {
            // Summary:
            //     Lite - keys for parameters of operation requests and responses (short: OpKey).
            //
            // Remarks:
            //     These keys match a definition in the Lite application (part of the server
            //     SDK).  If your game is built as extension of Lite, don't re-use these codes
            //     for your custom events.  These keys are defined per application, so Lite
            //     has different keys than MMO or your custom application. This is why these
            //     are not an enumeration.  Lite and Lite Lobby will use the keys 255 and lower,
            //     to give you room for your own codes.  Keys for operation-parameters could
            //     be assigned on a per operation basis, but it makes sense to have fixed keys
            //     for values which are used throughout the whole application.
            Constants.LiteOpKey = {
                // Summary:
                //     (252) Code for list of players in a room. Currently not used.
                ActorList: 252,
                //
                // Summary:
                //     (254) Code of the Actor of an operation. Used for property get and set.
                ActorNr: 254,
                //
                // Summary:
                //     (249) Code for property set (Hashtable).
                ActorProperties: 249,
                //
                // Summary:
                //     (238) The "Add" operation-parameter can be used to add something to some
                //     list or set. E.g. add groups to player's interest groups.
                Add: 238,
                //
                // Summary:
                //     (250) Code for broadcast parameter of OpSetProperties method.
                Broadcast: 250,
                //
                // Summary:
                //     (247) Code for caching events while raising them.
                Cache: 247,
                //
                // Summary:
                //     (244) Code used when sending some code-related parameter, like OpRaiseEvent's
                //     event-code.
                //
                // Remarks:
                //     This is not the same as the Operation's code, which is no longer sent as
                //     part of the parameter Dictionary in Photon 3.
                Code: 244,
                //
                // Summary:
                //     (245) Code of data of an event. Used in OpRaiseEvent.
                Data: 245,
                //
                // Summary:
                //     (255) Code of the game id (a unique room name). Used in OpJoin.
                GameId: 255,
                //
                // Summary:
                //     (248) Code for property set (Hashtable).
                GameProperties: 248,
                //
                // Summary:
                //     (240) Code for "group" operation-parameter (as used in Op RaiseEvent).
                Group: 240,
                //
                // Summary:
                //     (251) Code for property set (Hashtable). This key is used when sending only
                //     one set of properties.  If either ActorProperties or GameProperties are used
                //     (or both), check those keys.
                Properties: 251,
                //
                // Summary:
                //     (246) Code to select the receivers of events (used in Lite, Operation RaiseEvent).
                ReceiverGroup: 246,
                //
                // Summary:
                //     (239) The "Remove" operation-parameter can be used to remove something from
                //     a list. E.g. remove groups from player's interest groups.
                Remove: 239,
                //
                // Summary:
                //     (253) Code of the target Actor of an operation. Used for property set. Is
                //     0 for game.
                TargetActorNr: 253,
                //
                // Summary:
                //     (236) A parameter indicating how long a room instance should be keeped alive in the 
                //     room cache after all players left the room.
                /// <summary>
                EmptyRoomLiveTime: 236
            };
            // Summary:
            //     Lite - Event codes.  These codes are defined by the Lite application's logic
            //     on the server side.  Other application's won't necessarily use these.
            //
            // Remarks:
            //     If your game is built as extension of Lite, don't re-use these codes for
            //     your custom events.
            Constants.LiteEventCode = {
                // Summary:
                //     (255) Event Join: someone joined the game
                Join: 255,
                //
                // Summary:
                //     (254) Event Leave: someone left the game
                Leave: 254,
                //
                // Summary:
                //     (253) Event PropertiesChanged
                PropertiesChanged: 253
            };
            // Summary:
            //     Lite - Operation Codes.  This enumeration contains the codes that are given
            //     to the Lite Application's operations. Instead of sending "Join", this enables
            //     us to send the byte 255.
            //
            // Remarks:
            //     Other applications (the MMO demo or your own) could define other operations
            //     and other codes.  If your game is built as extension of Lite, don't re-use
            //     these codes for your custom events.
            Constants.LiteOpCode = {
                // Summary:
                //     (248) Operation code to change interest groups in Rooms (Lite application
                //     and extending ones).
                ChangeGroups: 248,
                //
                // Summary:
                //     (251) Operation code for OpGetProperties.
                GetProperties: 251,
                //
                // Summary:
                //     (255) Code for OpJoin, to get into a room.
                Join: 255,
                //
                // Summary:
                //     (254) Code for OpLeave, to get out of a room.
                Leave: 254,
                //
                // Summary:
                //     (253) Code for OpRaiseEvent (not same as eventCode).
                RaiseEvent: 253,
                //
                // Summary:
                //     (252) Code for OpSetProperties.
                SetProperties: 252
            };
        })(Constants = Lite.Constants || (Lite.Constants = {}));
    })(Lite = Photon.Lite || (Photon.Lite = {}));
})(Photon || (Photon = {}));
(function (Photon) {
    var LoadBalancing;
    (function (LoadBalancing) {
        var Constants;
        (function (Constants) {
            var LiteOpKey = Photon.Lite.Constants.LiteOpKey;
            var LiteOpCode = Photon.Lite.Constants.LiteOpCode;
            var LiteEventCode = Photon.Lite.Constants.LiteEventCode;
            /**
                @summary Master and Game servers error codes.
                @member Photon.LoadBalancing.Constants.ErrorCode
                @readonly
                @property {number} Ok No Error.
                @property {number} OperationNotAllowedInCurrentState Operation can't be executed yet.
                @property {number} InvalidOperationCode The operation you called is not implemented on the server (application) you connect to. Make sure you run the fitting applications.
                @property {number} InternalServerError Something went wrong in the server. Try to reproduce and contact Exit Games.
                @property {number} InvalidAuthentication Authentication failed. Possible cause: AppId is unknown to Photon (in cloud service).
                @property {number} GameIdAlreadyExists GameId (name) already in use (can't create another). Change name.
                @property {number} GameFull Game is full. This can when players took over while you joined the game.
                @property {number} GameClosed Game is closed and can't be joined. Join another game.
                @property {number} NoRandomMatchFound Random matchmaking only succeeds if a room exists thats neither closed nor full. Repeat in a few seconds or create a new room.
                @property {number} GameDoesNotExist Join can fail if the room (name) is not existing (anymore). This can happen when players leave while you join.
                @property {number} MaxCcuReached Authorization on the Photon Cloud failed becaus the concurrent users (CCU) limit of the app's subscription is reached.
                @property {number} InvalidRegion Authorization on the Photon Cloud failed because the app's subscription does not allow to use a particular region's server.
            */
            Constants.ErrorCode = {
                Ok: 0,
                // server - Photon low(er) level: <: 0
                /// <summary>
                /// (-3) Operation can't be executed yet (e.g. OpJoin can't be called before being authenticated, RaiseEvent cant be used before getting into a room).
                /// </summary>
                /// <remarks>
                /// Before you call any operations on the Cloud servers, the automated client workflow must complete its authorization.
                /// In PUN, wait until State is: JoinedLobby (with AutoJoinLobby : true) or ConnectedToMaster (AutoJoinLobby : false)
                /// </remarks>
                OperationNotAllowedInCurrentState: -3,
                /// <summary>(-2) The operation you called is not implemented on the server (application) you connect to. Make sure you run the fitting applications.</summary>
                InvalidOperationCode: -2,
                /// <summary>(-1) Something went wrong in the server. Try to reproduce and contact Exit Games.</summary>
                InternalServerError: -1,
                // server - PhotonNetwork: 0x7FFF and down
                // logic-level error codes start with short.max
                /// <summary>(32767) Authentication failed. Possible cause: AppId is unknown to Photon (in cloud service).</summary>
                InvalidAuthentication: 0x7FFF,
                /// <summary>(32766) GameId (name) already in use (can't create another). Change name.</summary>
                GameIdAlreadyExists: 0x7FFF - 1,
                /// <summary>(32765) Game is full. This can when players took over while you joined the game.</summary>
                GameFull: 0x7FFF - 2,
                /// <summary>(32764) Game is closed and can't be joined. Join another game.</summary>
                GameClosed: 0x7FFF - 3,
                // AlreadyMatched: 0x7FFF - 4,
                /// <summary>(32762) Not in use currently.</summary>
                // ServerFull: 0x7FFF - 5,
                /// <summary>(32761) Not in use currently.</summary>
                // UserBlocked: 0x7FFF - 6,
                /// <summary>(32760) Random matchmaking only succeeds if a room exists thats neither closed nor full. Repeat in a few seconds or create a new room.</summary>
                NoRandomMatchFound: 0x7FFF - 7,
                /// <summary>(32758) Join can fail if the room (name) is not existing (anymore). This can happen when players leave while you join.</summary>
                GameDoesNotExist: 0x7FFF - 9,
                /// <summary>(32757) Authorization on the Photon Cloud failed becaus the concurrent users (CCU) limit of the app's subscription is reached.</summary>
                /// <remarks>
                /// Unless you have a plan with "CCU Burst", clients might fail the authentication step during connect. 
                /// Affected client are unable to call operations. Please note that players who end a game and return 
                /// to the Master server will disconnect and re-connect, which means that they just played and are rejected 
                /// in the next minute / re-connect.
                /// This is a temporary measure. Once the CCU is below the limit, players will be able to connect an play again.
                /// 
                /// OpAuthorize is part of connection workflow but only on the Photon Cloud, this error can happen. 
                /// Self-hosted Photon servers with a CCU limited license won't let a client connect at all.
                /// </remarks>
                MaxCcuReached: 0x7FFF - 10,
                /// <summary>(32756) Authorization on the Photon Cloud failed because the app's subscription does not allow to use a particular region's server.</summary>
                /// <remarks>
                /// Some subscription plans for the Photon Cloud are region-bound. Servers of other regions can't be used then.
                /// Check your Master server address and compare it with your Photon Cloud Dashboard's info.
                /// 
                /// OpAuthorize is part of connection workflow but only on the Photon Cloud, this error can happen. 
                /// Self-hosted Photon servers with a CCU limited license won't let a client connect at all.
                /// </remarks>
                InvalidRegion: 0x7FFF - 11,
                /// <summary>
                /// (32755) Custom Authentication of the user failed due to setup reasons (see Cloud Dashboard) or the provided user data (like username or token). Check error message for details.
                /// </summary>
                CustomAuthenticationFailed: 0x7FFF - 12,
                /// <summary>(32753) The Authentication ticket expired. Usually, this is refreshed behind the scenes. Connect (and authorize) again.</summary>
                AuthenticationTicketExpired: 0x7FF1,
                /// <summary>
                /// (32752) A server-side plugin (or webhook) failed to execute and reported an error. Check the OperationResponse.DebugMessage.
                /// </summary>
                PluginReportedError: 0x7FFF - 15,
                /// <summary>
                /// (32751) CreateGame/JoinGame/Join operation fails if expected plugin does not correspond to loaded one.
                /// </summary>
                PluginMismatch: 0x7FFF - 16,
                /// <summary>
                /// (32750) for join requests. Indicates the current peer already called join and is joined to the room.
                /// </summary>
                JoinFailedPeerAlreadyJoined: 32750,
                /// <summary>
                /// (32749)  for join requests. Indicates the list of InactiveActors already contains an actor with the requested ActorNr or UserId.
                /// </summary>
                JoinFailedFoundInactiveJoiner: 32749,
                /// <summary>
                /// (32748) for join requests. Indicates the list of Actors (active and inactive) did not contain an actor with the requested ActorNr or UserId.
                /// </summary>
                JoinFailedWithRejoinerNotFound: 32748,
                /// <summary>
                /// (32747) for join requests. Note: for future use - Indicates the requested UserId was found in the ExcludedList.
                /// </summary>
                JoinFailedFoundExcludedUserId: 32747,
                /// <summary>
                /// (32746) for join requests. Indicates the list of ActiveActors already contains an actor with the requested ActorNr or UserId.
                /// </summary>
                JoinFailedFoundActiveJoiner: 32746,
                /// <summary>
                /// (32745)  for SetProerties and Raisevent (if flag HttpForward is true) requests. Indicates the maximum allowed http requests per minute was reached.
                /// </summary>
                HttpLimitReached: 32745,
                /// <summary>
                /// (32744) for WebRpc requests. Indicates the the call to the external service failed.
                /// </summary>
                ExternalHttpCallFailed: 32744,
                /// <summary>
                /// (32742) Server error during matchmaking with slot reservation. E.g. the reserved slots can not exceed MaxPlayers.
                /// </summary>
                SlotError: 32742,
                /// <summary>
                /// (32741) Server will react with this error if invalid encryption parameters provided by token
                /// </summary>
                InvalidEncryptionParameters: 32741
            };
            /// <summary>
            /// These  values define "well known" properties for an Actor / Player.
            /// </summary>
            /// <remarks>
            /// "Custom properties" have to use a string-type as key. They can be assigned at will.
            /// </remarks>
            Constants.ActorProperties = {
                /// <summary>(255) Name of a player/actor.</summary>
                PlayerName: 255
            };
            /** End user doesn't need this */
            /// <summary>
            /// These  values are for "well known" room/game properties used in Photon Loadbalancing.
            /// </summary>
            /// <remarks>
            /// "Custom properties" have to use a string-type as key. They can be assigned at will.
            /// </remarks>
            Constants.GameProperties = {
                /// <summary>(255) Max number of players that "fit" into this room. 0 is for "unlimited".</summary>
                MaxPlayers: 255,
                /// <summary>(254) Makes this room listed or not in the lobby on Master.</summary>
                IsVisible: 254,
                /// <summary>(253) Allows more players to join a room (or not).</summary>
                IsOpen: 253,
                /// <summary>(252) Current count od players in the room. Used only in the lobby on Master.</summary>
                PlayerCount: 252,
                /// <summary>(251) True if the room is to be removed from room listing (used in update to room list in lobby on Master)</summary>
                Removed: 251,
                /// <summary>(250) A list of the room properties to pass to the RoomInfo list in a lobby. This is used in CreateRoom, which defines this list once per room.</summary>
                PropsListedInLobby: 250,
                /// <summary>Equivalent of Operation Join parameter CleanupCacheOnLeave.</summary>
                CleanupCacheOnLeave: 249,
                /// <summary>(248) Code for MasterClientId, which is synced by server. When sent as op-parameter this is (byte)203. As room property this is (byte)248.</summary>
                /// <remarks>Tightly related to ParameterCode.MasterClientId.</remarks>
                MasterClientId: 248,
                /// <summary>(246) Player Time To Live. How long any player can be inactive (due to disconnect or leave) before the user gets removed from the playerlist (freeing a slot).</summary>
                PlayerTtl: 246,
                /// <summary>(245) Room Time To Live. How long a room stays available (and in server-memory), after the last player becomes inactive. After this time, the room gets persisted or destroyed.</summary>
                EmptyRoomTtl: 245
            };
            /** End user doesn't need this */
            /// <summary>
            /// These values are for events defined by Photon Loadbalancing.
            /// </summary>
            /// <remarks>They start at 255 and go DOWN. Your own in-game events can start at 0.</remarks>
            Constants.EventCode = {
                /// <summary>(230) Initial list of RoomInfos (in lobby on Master)</summary>
                GameList: 230,
                /// <summary>(229) Update of RoomInfos to be merged into "initial" list (in lobby on Master)</summary>
                GameListUpdate: 229,
                /// <summary>(228) Currently not used. State of queueing in case of server-full</summary>
                QueueState: 228,
                /// <summary>(227) Currently not used. Event for matchmaking</summary>
                // Match: 227,
                /// <summary>(226) Event with stats about this application (players, rooms, etc)</summary>
                AppStats: 226,
                /// <summary>(210) Internally used in case of hosting by Azure</summary>
                AzureNodeInfo: 210,
                /// <summary>(255) Event Join: someone joined the game. The new actorNumber is provided as well as the properties of that actor (if set in OpJoin).</summary>
                Join: LiteEventCode.Join,
                /// <summary>(254) Event Leave: The player who left the game can be identified by the actorNumber.</summary>
                Leave: LiteEventCode.Leave,
                /// <summary>(253) When you call OpSetProperties with the broadcast option "on", this event is fired. It contains the properties being set.</summary>
                PropertiesChanged: LiteEventCode.PropertiesChanged,
                /// <summary>(252) When player left game unexpecable and playerTtl > 0 this event is fired</summary>
                Disconnect: 252,
                LobbyStats: 224
            };
            /** End user doesn't need this */
            /// <summary>Codes for parameters of Operations and Events.</summary>
            Constants.ParameterCode = {
                /// <summary>(230) Address of a (Game) server to use.</summary>
                Address: 230,
                /// <summary>(229) Count of players in this application in a rooms (used in stats event)</summary>
                PeerCount: 229,
                /// <summary>(228) Count of games in this application (used in stats event)</summary>
                GameCount: 228,
                /// <summary>(227) Count of players on the Master server (in this app, looking for rooms)</summary>
                MasterPeerCount: 227,
                /// <summary>(225) User's ID</summary>
                UserId: 225,
                /// <summary>(224) Your application's ID: a name on your own Photon or a GUID on the Photon Cloud</summary>
                ApplicationId: 224,
                /// <summary>(223) Not used currently (as "Position"). If you get queued before connect, this is your position</summary>
                Position: 223,
                /// <summary>(223) Modifies the matchmaking algorithm used for OpJoinRandom. Allowed parameter values are defined in enum MatchmakingMode.</summary>
                MatchMakingType: 223,
                /// <summary>(222) List of RoomInfos about open / listed rooms</summary>
                GameList: 222,
                /// <summary>(221) Internally used to establish encryption</summary>
                Secret: 221,
                /// <summary>(220) Version of your application</summary>
                AppVersion: 220,
                /// <summary>(210) Internally used in case of hosting by Azure</summary>
                AzureNodeInfo: 210,
                /// <summary>(209) Internally used in case of hosting by Azure</summary>
                AzureLocalNodeId: 209,
                /// <summary>(208) Internally used in case of hosting by Azure</summary>
                AzureMasterNodeId: 208,
                /// <summary>(255) Code for the gameId/roomName (a unique name per room). Used in OpJoin and similar.</summary>
                RoomName: LiteOpKey.GameId,
                /// <summary>(250) Code for broadcast parameter of OpSetProperties method.</summary>
                Broadcast: LiteOpKey.Broadcast,
                /// <summary>(252) Code for list of players in a room. Currently not used.</summary>
                ActorList: LiteOpKey.ActorList,
                /// <summary>(254) Code of the Actor of an operation. Used for property get and set.</summary>
                ActorNr: LiteOpKey.ActorNr,
                /// <summary>(249) Code for property set (Hashtable).</summary>
                PlayerProperties: LiteOpKey.ActorProperties,
                /// <summary>(245) Code of data/custom content of an event. Used in OpRaiseEvent.</summary>
                CustomEventContent: LiteOpKey.Data,
                /// <summary>(245) Code of data of an event. Used in OpRaiseEvent.</summary>
                Data: LiteOpKey.Data,
                /// <summary>(244) Code used when sending some code-related parameter, like OpRaiseEvent's event-code.</summary>
                /// <remarks>This is not the same as the Operation's code, which is no longer sent as part of the parameter Dictionary in Photon 3.</remarks>
                Code: LiteOpKey.Code,
                /// <summary>(248) Code for property set (Hashtable).</summary>
                GameProperties: LiteOpKey.GameProperties,
                /// <summary>
                /// (251) Code for property-set (Hashtable). This key is used when sending only one set of properties.
                /// If either ActorProperties or GameProperties are used (or both), check those keys.
                /// </summary>
                Properties: LiteOpKey.Properties,
                /// <summary>(253) Code of the target Actor of an operation. Used for property set. Is 0 for game</summary>
                TargetActorNr: LiteOpKey.TargetActorNr,
                /// <summary>(246) Code to select the receivers of events (used in Lite, Operation RaiseEvent).</summary>
                ReceiverGroup: LiteOpKey.ReceiverGroup,
                /// <summary>(247) Code for caching events while raising them.</summary>
                Cache: LiteOpKey.Cache,
                /// <summary>(241) Boolean parameter of CreateGame Operation. If true, server cleans up roomcache of leaving players (their cached events get removed).</summary>
                CleanupCacheOnLeave: 241,
                /// <summary>(240) Code for "group" operation-parameter (as used in Op RaiseEvent).</summary>
                Group: LiteOpKey.Group,
                /// <summary>(239) The "Remove" operation-parameter can be used to remove something from a list. E.g. remove groups from player's interest groups.</summary>
                Remove: LiteOpKey.Remove,
                /// <summary>(238) The "Add" operation-parameter can be used to add something to some list or set. E.g. add groups to player's interest groups.</summary>
                Add: LiteOpKey.Add,
                /// <summary>(236) A parameter indicating how long a room instance should be keeped alive in the room cache after all players left the room.</summary>
                EmptyRoomTTL: LiteOpKey.EmptyRoomLiveTime,
                PlayerTTL: 235,
                Plugins: 204,
                /// <summary>(217) This key's (byte) value defines the target custom authentication type/service the client connects with. Used in OpAuthenticate.</summary>
                ClientAuthenticationType: 217,
                /// <summary>(216) This key's (string) value provides parameters sent to the custom authentication type/service the client connects with. Used in OpAuthenticate.</summary>
                ClientAuthenticationParams: 216,
                ClientAuthenticationData: 214,
                /// <summary>(215) The JoinMode enum defines which variant of joining a room will be executed: Join only if available, create if not exists or re -join.</summary >
                /// <remarks>Replaces CreateIfNotExists which was only a bool -value.</remarks >
                JoinMode: 215,
                /// <summary>(203) Code for MasterClientId, which is synced by server. When sent as op-parameter this is code 203.</summary>
                /// <remarks>Tightly related to GamePropertyKey.MasterClientId.</remarks>
                MasterClientId: 203,
                /// <summary>(1) Used in Op FindFriends request. Value must be string[] of friends to look up.</summary>
                FindFriendsRequestList: 1,
                /// <summary>(1) Used in Op FindFriends response. Contains boolean[] list of online states (false if not online).</summary>
                FindFriendsResponseOnlineList: 1,
                /// <summary>(2) Used in Op FindFriends response. Contains string[] of room names ("" where not known or no room joined).</summary>
                FindFriendsResponseRoomIdList: 2,
                /// <summary>(213) Used in matchmaking-related methods and when creating a room to name a lobby (to join or to attach a room to).</summary>
                LobbyName: 213,
                /// <summary>(212) Used in matchmaking-related methods and when creating a room to define the type of a lobby. Combined with the lobby name this identifies the lobby.</summary>
                LobbyType: 212,
                LobbyStats: 211,
                /// <summary>(210) Used for region values in OpAuth and OpGetRegions.</summary >
                Region: 210,
                IsInactive: 233,
                CheckUserOnJoin: 232,
                /// <summary>(231) Code for "Check And Swap" (CAS) when changing properties.</summary>
                ExpectedValues: 231,
                UriPath: 209,
                RpcCallParams: 208,
                RpcCallRetCode: 207,
                RpcCallRetMessage: 206,
                RpcCallRetData: 208,
                WebFlags: 234,
                // Used by the server in Operation Responses, when it sends the nickname of the client (the user's nickname).
                Nickname: 202
            };
            /**
                @summary Codes for parameters and events used in Photon Load Balancing API.
                @member Photon.LoadBalancing.Constants.OperationCode
                @readonly
                @property {number} Authenticate Authenticates this peer and connects to a virtual application.
                @property {number} JoinLobby Joins lobby (on Master).
                @property {number} LeaveLobby Leaves lobby (on Master).
                @property {number} CreateGame Creates a game (or fails if name exists).
                @property {number} JoinGame Joins room (by name).
                @property {number} JoinRandomGame Joins random room (on Master).
                @property {number} Leave Leaves the room.
                @property {number} RaiseEvent Raises event (in a room, for other actors/players).
                @property {number} SetProperties Sets Properties (of room or actor/player).
                @property {number} GetProperties Gets Properties.
                @property {number} ChangeGroups Changes interest groups in room.
                @property {number} FindFriends Requests Master server for actors online status and joined rooms.
                @property {number} LobbyStats Requests Master server for lobbies statistics.
            */
            Constants.OperationCode = {
                /// <summary>(230) Authenticates this peer and connects to a virtual application</summary>
                Authenticate: 230,
                /// <summary>(229) Joins lobby (on Master)</summary>
                JoinLobby: 229,
                /// <summary>(228) Leaves lobby (on Master)</summary>
                LeaveLobby: 228,
                /// <summary>(227) Creates a game (or fails if name exists)</summary>
                CreateGame: 227,
                /// <summary>(226) Join game (by name)</summary>
                JoinGame: 226,
                /// <summary>(225) Joins random game (on Master)</summary>
                JoinRandomGame: 225,
                // CancelJoinRandom : 224, // obsolete, cause JoinRandom no longer is a "process". now provides result immediately
                /// <summary>(254) Code for OpLeave, to get out of a room.</summary>
                Leave: LiteOpCode.Leave,
                /// <summary>(253) Raise event (in a room, for other actors/players)</summary>
                RaiseEvent: LiteOpCode.RaiseEvent,
                /// <summary>(252) Set Properties (of room or actor/player)</summary>
                SetProperties: LiteOpCode.SetProperties,
                /// <summary>(251) Get Properties</summary>
                GetProperties: LiteOpCode.GetProperties,
                /// <summary>(248) Operation code to change interest groups in Rooms (Lite application and extending ones).</summary>
                ChangeGroups: LiteOpCode.ChangeGroups,
                /// <summary>(222) Request the rooms and online status for a list of friends (by name, which should be unique).</summary>
                FindFriends: 222,
                LobbyStats: 221,
                /// <summary>(220) Gets list of regional servers from a NameServer.</summary>
                GetRegions: 220,
                /// <summary>(219) Rpc Operation.</summary>
                Rpc: 219
            };
            /**
                @summary Options for matchmaking rules for joinRandomGame.
                @member Photon.LoadBalancing.Constants.MatchmakingMode
                @readonly
                @property {number} FillRoom Default. FillRoom Fills up rooms (oldest first) to get players together as fast as possible. Makes most sense with MaxPlayers > 0 and games that can only start with more players.
                @property {number} SerialMatching Distributes players across available rooms sequentially but takes filter into account. Without filter, rooms get players evenly distributed.
                @property {number} RandomMatching Joins a (fully) random room. Expected properties must match but aside from this, any available room might be selected.
            */
            Constants.MatchmakingMode = {
                /// <summary>Fills up rooms (oldest first) to get players together as fast as possible. Default.</summary>
                /// <remarks>Makes most sense with MaxPlayers > 0 and games that can only start with more players.</remarks>
                FillRoom: 0,
                /// <summary>Distributes players across available rooms sequentially but takes filter into account. Without filter, rooms get players evenly distributed.</summary>
                SerialMatching: 1,
                /// <summary>Joins a (fully) random room. Expected properties must match but aside from this, any available room might be selected.</summary>
                RandomMatching: 2
            };
            /**
                @summary Caching options for events.
                @member Photon.LoadBalancing.Constants.EventCaching
                @readonly
                @property {number} DoNotCache Default. Do not cache.
                @property {number} MergeCache Will merge this event's keys with those already cached.
                @property {number} ReplaceCache Replaces the event cache for this eventCode with this event's content.
                @property {number} RemoveCache Removes this event (by eventCode) from the cache.
                @property {number} AddToRoomCache Adds an event to the room's cache.
                @property {number} AddToRoomCacheGlobal Adds this event to the cache for actor 0 (becoming a "globally owned" event in the cache).
                @property {number} RemoveFromRoomCache Remove fitting event from the room's cache.
                @property {number} RemoveFromRoomCacheForActorsLeft Removes events of players who already left the room (cleaning up).
            */
            Constants.EventCaching = {
                // Summary:
                //     Default value (not sent).
                DoNotCache: 0,
                //
                // Summary:
                //     Will merge this event's keys with those already cached.
                MergeCache: 1,
                //
                // Summary:
                //     Replaces the event cache for this eventCode with this event's content.
                ReplaceCache: 2,
                //
                // Summary:
                //     Removes this event (by eventCode) from the cache.
                RemoveCache: 3,
                //
                // Summary:
                //     Adds an event to the room's cache.
                AddToRoomCache: 4,
                //
                // Summary:
                //     Adds this event to the cache for actor 0 (becoming a "globally owned" event
                //     in the cache).
                AddToRoomCacheGlobal: 5,
                //
                // Summary:
                //     Remove fitting event from the room's cache.
                RemoveFromRoomCache: 6,
                //
                // Summary:
                //     Removes events of players who already left the room (cleaning up).
                RemoveFromRoomCacheForActorsLeft: 7
            };
            /**
                @summary Options for choosing room's actors who should receive events.
                @member Photon.LoadBalancing.Constants.ReceiverGroup
                @readonly
                @property {number} Others Default. Anyone else gets my event.
                @property {number} All Everyone in the current room (including this peer) will get this event.
                @property {number} MasterClient The "master client" does not have special rights but is the one who is in this room the longest time.
            */
            Constants.ReceiverGroup = {
                // Summary:
                //     Default value (not sent). Anyone else gets my event.
                Others: 0,
                //
                // Summary:
                //     Everyone in the current room (including this peer) will get this event.
                All: 1,
                //
                // Summary:
                //     The server sends this event only to the actor with the lowest actorNumber.
                //
                // Remarks:
                //     The "master client" does not have special rights but is the one who is in
                //     this room the longest time.
                MasterClient: 2
            };
            /**
                @summary Options for optional "Custom Authentication" services used with Photon.
                @member Photon.LoadBalancing.Constants.CustomAuthenticationType
                @readonly
                @property {number} Custom Default. Use a custom authentification service.
                @property {number} Steam Authenticates users by their Steam Account. Set auth values accordingly.
                @property {number} Facebook Authenticates users by their Facebook Account. Set auth values accordingly.
                @property {number} None Disables custom authentification.
            */
            Constants.CustomAuthenticationType = {
                Custom: 0,
                Steam: 1,
                Facebook: 2,
                None: 255
            };
            /**
                @summary Options of lobby types available. Lobby types might be implemented in certain Photon versions and won't be available on older servers.
                @member Photon.LoadBalancing.Constants.LobbyType
                @readonly
                @property {number} Default This lobby is used unless another is defined by game or JoinRandom. Room-lists will be sent and JoinRandomRoom can filter by matching properties.
                @property {number} SqlLobby This lobby type lists rooms like Default but JoinRandom has a parameter for SQL-like "where" clauses for filtering. This allows bigger, less, or and and combinations.
            **/
            Constants.LobbyType = {
                Default: 0,
                SqlLobby: 2
            };
        })(Constants = LoadBalancing.Constants || (LoadBalancing.Constants = {}));
    })(LoadBalancing = Photon.LoadBalancing || (Photon.LoadBalancing = {}));
})(Photon || (Photon = {}));
/// <reference path="photon-common.ts"/>
/**
    Photon Chat API Constants
    @namespace Photon.Chat.Constants
*/
var Photon;
(function (Photon) {
    var Chat;
    (function (Chat) {
        var Constants;
        (function (Constants) {
            Constants.ParameterCode = {
                Channels: 0,
                Channel: 1,
                Messages: 2,
                Message: 3,
                Senders: 4,
                Sender: 5,
                ChannelUserCount: 6,
                UserId: 225,
                MsgId: 8,
                MsgIds: 9,
                SubscribeResults: 15,
                Status: 10,
                Friends: 11,
                SkipMessage: 12,
                HistoryLength: 14,
                WebFlags: 21
            };
            //- Codes for parameters and events used in Photon Chat API.
            Constants.OperationCode = {
                Subscribe: 0,
                Unsubscribe: 1,
                Publish: 2,
                SendPrivate: 3,
                ChannelHistory: 4,
                UpdateStatus: 5,
                AddFriendds: 6,
                RemoveFriends: 7 // Removes users from the list that should update you of their status.
            };
            Constants.EventCode = {
                ChatMessages: 0,
                Users: 1,
                PrivateMessage: 2,
                FriendsList: 3,
                StatusUpdate: 4,
                Subscribe: 5,
                Unsubscribe: 6
            };
            /**
                @summary Contains commonly used status values for {@link Photon.Chat.ChatClient#setUserStatus}.You can define your own.<br/>
                While "online"(Online and up), the status message will be sent to anyone who has you on his friend list.<br/>
                Define custom online status values as you like with these rules:<br/>
                0: Means "offline".It will be used when you are not connected. In this status, there is no status message.<br/>
                1: Means "invisible" and is sent to friends as "offline". They see status 0, no message but you can chat.<br/>
                2: And any higher value will be treated as "online". Status can be set.<br/>
                @readonly
                @property {number} Offline Offline.
                @property {number} Invisible Offline. Be invisible to everyone. Sends no message.
                @property {number} Online Online and available.
                @property {number} Away Online but not available.
                @property {number} Dnd Do not disturb.
                @property {number} Lfg Looking For Game / Group. Could be used when you want to be invited or do matchmaking.
                @property {number} Playing Could be used when in a room, playing.
                @member Photon.Chat.Constants.UserStatus
            */
            Constants.UserStatus = {
                Offline: 0,
                Invisible: 1,
                Online: 2,
                Away: 3,
                Dnd: 4,
                Lfg: 5,
                Playing: 6
            };
            /**
                @summary Converts {@link Photon.Chat.Constants.UserStatus} element to string name.
                @param {Photon.Chat.Constants.UserStatus} status User status enum element.
                @returns {string} Specified element name or undefined if not found.
                @method Photon.Chat.Constants.UserStatusToName
            */
            function UserStatusToName(status) { return Exitgames.Common.Util.getEnumKeyByValue(Constants.UserStatus, status); }
            Constants.UserStatusToName = UserStatusToName;
        })(Constants = Chat.Constants || (Chat.Constants = {}));
    })(Chat = Photon.Chat || (Photon.Chat = {}));
})(Photon || (Photon = {}));
/// <reference path="photon-loadbalancing.ts"/>
/// <reference path="photon-chat-constants.ts"/>
/**
    Photon Chat API
    @namespace Photon.Chat
*/
var Photon;
(function (Photon) {
    var Chat;
    (function (Chat) {
        var WebFlags = {
            HttpForward: 0x01,
            SendAuthCookie: 0x02,
            SendSync: 0x04,
            SendState: 0x08
        };
        /**
            @class Photon.Chat.Message
            @classdesc Encapsulates chat message data.
        */
        var Message = /** @class */ (function () {
            function Message(sender, content) {
                this.sender = sender;
                this.content = content;
            }
            /**
                @summary Returns message sender.
                @return {string} Message sender.
                @method Photon.Chat.Message#getSender
            */
            Message.prototype.getSender = function () {
                return this.sender;
            };
            /**
                @summary Returns message content.
                @return {any} Message content.
                @method Photon.Chat.Message#getContent
            */
            Message.prototype.getContent = function () {
                return this.content;
            };
            return Message;
        }());
        Chat.Message = Message;
        /**
            @class Photon.Chat.Channel
            @classdesc Represents chat channel.
        */
        var Channel = /** @class */ (function () {
            function Channel(name, isPrivat) {
                this.name = name;
                this.isPrivat = isPrivat;
                this.messages = [];
            }
            /**
                @summary Returns channel name (counterpart user id for private channel).
                @return {string} Channel name.
                @method Photon.Chat.Channel#getName
            */
            Channel.prototype.getName = function () {
                return this.name;
            };
            /**
                @summary Returns true if channel is private.
                @return {boolean} Channel private status.
                @method Photon.Chat.Channel#isPrivate
            */
            Channel.prototype.isPrivate = function () {
                return this.isPrivat;
            };
            /**
                @summary Returns messages cache.
                @return {{@link Photon.Chat.Message}[]} Array of messages.
                @method Photon.Chat.Channel#getMessages
            */
            Channel.prototype.getMessages = function () {
                return this.messages;
            };
            /**
                @summary Returns ID of the last message received.
                @return {number} Last message ID.
                @method Photon.Chat.Channel#getLastId
            */
            Channel.prototype.getLastId = function () {
                return this.lastId;
            };
            /**
                @summary Clears messages cache.
                @method Photon.Chat.Channel#clearMessages
            */
            Channel.prototype.clearMessages = function () {
                this.messages.splice(0);
            };
            // internal
            Channel.prototype.addMessages = function (senders, messages) {
                var newMessages = [];
                for (var i in senders) {
                    if (parseInt(i) < messages.length) {
                        var m = new Message(senders[i], messages[i]);
                        this.messages.push(m);
                        newMessages.push(m);
                    }
                }
                return newMessages;
            };
            return Channel;
        }());
        Chat.Channel = Channel;
        var ChatClient = /** @class */ (function (_super) {
            __extends(ChatClient, _super);
            /**
                @classdesc Implements the Photon Chat API workflow.<br/>
                This class should be extended to handle system or custom events and operation responses.<br/>
                
                @borrows Photon.LoadBalancing.LoadBalancingClient#setCustomAuthentication
                @borrows Photon.LoadBalancing.LoadBalancingClient#connectToNameServer
                @borrows Photon.LoadBalancing.LoadBalancingClient#getRegions
                @borrows Photon.LoadBalancing.LoadBalancingClient#onGetRegionsResult
                @borrows Photon.LoadBalancing.LoadBalancingClient#isConnectedToNameServer
                @borrows Photon.LoadBalancing.LoadBalancingClient#disconnect
                @borrows Photon.LoadBalancing.LoadBalancingClient#setLogLevel
    
                @constructor Photon.Chat.ChatClient
                @param {Photon.ConnectionProtocol} protocol Connecton protocol.
                @param {string} appId Cloud application ID.
                @param {string} appVersion Cloud application version.
            */
            function ChatClient(protocol, appId, appVersion) {
                var _this = _super.call(this, protocol, appId, appVersion) || this;
                _this.publicChannels = {};
                _this.privateChannels = {};
                _this.subscribeRequests = [];
                _this.unsubscribeRequests = [];
                _this.autoJoinLobby = false;
                return _this;
            }
            /**
                @summary Called on client state change. Override to handle it.
                @method Photon.Chat.ChatClient#onStateChange
                @param {Photon.Chat.ChatClient.ChatState} state New client state.
            */
            ChatClient.prototype.onStateChange = function (state) { };
            /**
                @summary Called if client error occures. Override to handle it.
                @method Chat.ChatClient#onError
                @param {Chat.ChatClient.ChatPeerErrorCode} errorCode Client error code.
                @param {string} errorMsg Error message.
            */
            ChatClient.prototype.onError = function (errorCode, errorMsg) { };
            /**
                @summary Called when {@link Photon.Chat.ChatClient#subscribe subscribe} request completed.<br/ >
                Override to handle request results.
                @param {object} results Object with channel names as keys and boolean results as values.
                @method Photon.Chat.ChatClient#onSubscribeResult
            */
            ChatClient.prototype.onSubscribeResult = function (results) { };
            /**
                @summary Called when {@link Photon.Chat.ChatClient#unsubscribe unsubscribe} request completed.<br/ >
                Override to handle request results.
                @param {object} results Object with channel names as keys and boolean results as values.
                @method Photon.Chat.ChatClient#onUnsubscribeResult
            */
            ChatClient.prototype.onUnsubscribeResult = function (results) { };
            /**
                @summary Called when new chat messages received.<br/ >
                Override to handle messages receive event.
                @param {string} channelName Chat channel name.
                @param {{@link Photon.Chat.Message}[]} messages Array of received messages.
                @method Photon.Chat.ChatClient#onChatMessages
            */
            ChatClient.prototype.onChatMessages = function (channelName, messages) { };
            /**
                @summary Called when new private message received.<br/ >
                Override to handle message receive event.
                @param {string} channelName Private channel name(counterpart user id).
                @param {Photon.Chat.Message} message Received message.
                @method Photon.Chat.ChatClient#onPrivateMessage
            */
            ChatClient.prototype.onPrivateMessage = function (channelName, message) { };
            /**
                @summary Called when user from friend list changes state.<br/ >
                Override to handle change state event.
                @param {string} userId User id.
                @param {number} status New User status. Predefined {@link Photon.chat.Constants.UserStatus Constants.UserStatus} or custom.
                @param {boolean} gotMessage True if status message updated.
                @param {string} statusMessage Optional status message (may be null even if gotMessage = true).
                @method Photon.Chat.ChatClient#onUserStatusUpdate
            */
            ChatClient.prototype.onUserStatusUpdate = function (userId, status, gotMessage, statusMessage) { };
            /**
                @summary Connects to a specific region's Master server, using the NameServer to find the IP.
                Override {@link Photon.Chat.ChatClient#onWebRpcResult onWebRpcResult} to handle request results.<br/>
                @method Photon.Chat.ChatClient#connectToRegionFrontEnd
                @param {string} region Region connect to Master server of.
                @returns {boolean} True if current client state allows connection.
            **/
            ChatClient.prototype.connectToRegionFrontEnd = function (region) {
                return this.connectToRegionMaster(region);
            };
            /**
                @summary Returns true if client connected to Front End.When connected, client can send messages, subscribe to channels and so on.
                @return {boolean} True if connected.
                @method Photon.Chat.ChatClient#isConnectedToFrontEnd
            */
            ChatClient.prototype.isConnectedToFrontEnd = function () {
                return this.state == ChatClient.ChatState.ConnectedToFrontEnd;
            };
            /**
                @summary Sends operation to subscribe to a list of channels by name.<br/>
                Override {@link Photon.Chat.ChatClient#onSubscribeResult onSubscribeResult} to handle request results.
                @param {string[]} channelNames Array of channel names to subscribe to.
                @param {object} [options] Additional options
                @property {object} options Additional options
                @property {number} [options.historyLength] Controls messages history sent on subscription. Not specified or 0: no history. 1 and higher: number of messages in history. -1: all history.
                @property {number[]} [options.lastIds] Array of IDs of last messages received per channel. Useful when resubscribing to receive only messages we missed.
                @return {boolean} True if operation sent.
                @method Photon.Chat.ChatClient#subscribe
            */
            ChatClient.prototype.subscribe = function (channelNames, options) {
                // backward compatibility
                if (typeof (options) == "number") {
                    options = { historyLength: options };
                }
                if (this.isConnectedToFrontEnd()) {
                    this.logger.debug("Subscribe channels:", channelNames);
                    var params = [];
                    params.push(Chat.Constants.ParameterCode.Channels, Photon.TypeExt.String(channelNames));
                    if (options) {
                        if (options.historyLength) {
                            params.push(Chat.Constants.ParameterCode.HistoryLength, Photon.TypeExt.Int(options.historyLength));
                        }
                        if (options.lastIds) {
                            params.push(Chat.Constants.ParameterCode.MsgIds, Photon.TypeExt.Int(options.lastIds));
                            if (options.historyLength === undefined) {
                                params.push(Chat.Constants.ParameterCode.HistoryLength, Photon.TypeExt.Int(-1));
                            }
                        }
                    }
                    this.masterPeer.sendOperation(Chat.Constants.OperationCode.Subscribe, params);
                    return true;
                }
                else {
                    this.logger.error("subscribe request error:", "Not connected to Front End");
                    return false;
                }
            };
            /**
                @summary Sends operation to unsubscribe from a list of channels by name.<br/ >
                Override {@link Photon.Chat.ChatClient#onUnsubscribeResult onUnsubscribeResult} to handle request results.
                @param {string[]} channelNames Array of channel names to unsubscribe from.
                @return {boolean} True if operation sent.
                @method Photon.Chat.ChatClient#unsubscribe
            */
            ChatClient.prototype.unsubscribe = function (channelNames) {
                if (this.isConnectedToFrontEnd()) {
                    this.logger.debug("Unsubscribe channels:", channelNames);
                    var params = [];
                    params.push(Chat.Constants.ParameterCode.Channels, Photon.TypeExt.String(channelNames));
                    this.masterPeer.sendOperation(Chat.Constants.OperationCode.Unsubscribe, params);
                    return true;
                }
                else {
                    this.logger.error("unsubscribe request error:", "Not connected to Front End");
                    return false;
                }
            };
            /**
                @summary Sends a message to a public channel.<br/>
                Channel should be subscribed before publishing to it.
                Everyone in that channel will get the message.
                @param {string} channelName Channel name to send message to.
                @param {any} content Text string or arbitrary data to send.
                @param {object} [options] Additional options
                @property {object} options Additional options
                @property {boolean} [options.webForward] Optionally, private messages can be forwarded as webhooks. Configure webhooks for your Chat app to use this.
                @return {boolean} True if message sent.
                @method Photon.Chat.ChatClient#publishMessage
            */
            ChatClient.prototype.publishMessage = function (channelName, content, options) {
                if (this.isConnectedToFrontEnd()) {
                    var params = [];
                    params.push(Chat.Constants.ParameterCode.Channel, channelName);
                    params.push(Chat.Constants.ParameterCode.Message, content);
                    if (options) {
                        if (options.webForward) {
                            params.push(Chat.Constants.ParameterCode.WebFlags);
                            params.push(Photon.TypeExt.Byte(WebFlags.HttpForward));
                        }
                    }
                    this.masterPeer.sendOperation(Chat.Constants.OperationCode.Publish, params);
                    return true;
                }
                else {
                    this.logger.error("publishMessage request error:", "Not connected to Front End");
                    return false;
                }
            };
            /**
                @summary Sends a private message to a single target user.<br/>
                @param {string} userId User id to send this message to.
                @param {any} content Text string or arbitrary data to send.
                @param {object} [options] Additional options
                @property {object} options Additional options
                @property {boolean} [options.webForward] Optionally, private messages can be forwarded as webhooks. Configure webhooks for your Chat app to use this.
                @return {boolean} True if message sent.
                @method Photon.Chat.ChatClient#sendPrivateMessage
            */
            ChatClient.prototype.sendPrivateMessage = function (userId, content, options) {
                if (this.isConnectedToFrontEnd()) {
                    var params = [];
                    params.push(Chat.Constants.ParameterCode.UserId, userId);
                    params.push(Chat.Constants.ParameterCode.Message, content);
                    if (options) {
                        if (options.webForward) {
                            params.push(Chat.Constants.ParameterCode.WebFlags);
                            params.push(Photon.TypeExt.Byte(WebFlags.HttpForward));
                        }
                    }
                    this.masterPeer.sendOperation(Chat.Constants.OperationCode.SendPrivate, params);
                    return true;
                }
                else {
                    this.logger.error("sendPrivateMessage request error:", "Not connected to Front End");
                    return false;
                }
            };
            /**
                @summary Sets the user's status (pre-defined or custom) and an optional message.<br/>
                The predefined status values can be found in {@link Photon.Chat.Constants.UserStatus Constants.UserStatus}.<br/>
                State UserStatus.Invisible will make you offline for everyone and send no message.
                @param {number} status User status to set.
                @param {string} [message=null] State message.
                @param {boolean} [skipMessage=false] If true { client does not send state message.
                @return {boolean} True if command sent.
                @method Photon.Chat.ChatClient#setUserStatus
            */
            ChatClient.prototype.setUserStatus = function (status, statusMessage, skipMessage) {
                if (statusMessage === void 0) { statusMessage = null; }
                if (skipMessage === void 0) { skipMessage = false; }
                if (this.isConnectedToFrontEnd()) {
                    var params = [];
                    params.push(Chat.Constants.ParameterCode.Status, Photon.TypeExt.Int(status));
                    if (skipMessage)
                        params.push(Chat.Constants.ParameterCode.SkipMessage, true);
                    else
                        params.push(Chat.Constants.ParameterCode.Message, statusMessage);
                    this.masterPeer.sendOperation(Chat.Constants.OperationCode.UpdateStatus, params);
                    return true;
                }
                else {
                    this.logger.error("setUserStatus request error:", "Not connected to Front End");
                    return false;
                }
            };
            /**
                @summary Adds users to the list on the Chat Server which will send you status updates for those.
                @tparam string[] userIds Array of user ids.
                @return {boolean} True if command sent.
            */
            ChatClient.prototype.addFriends = function (userIds) {
                if (this.isConnectedToFrontEnd()) {
                    var params = [];
                    params.push(Chat.Constants.ParameterCode.Friends, Photon.TypeExt.String(userIds));
                    this.masterPeer.sendOperation(Chat.Constants.OperationCode.AddFriendds, params);
                    return true;
                }
                else {
                    this.logger.error("addFriends request error:", "Not connected to Front End");
                    return false;
                }
            };
            /**
                @summary Removes users from the list on the Chat Server which will send you status updates for those.
                @tparam string[] friends Array of user ids.
                @return {boolean} True if command sent.
            */
            ChatClient.prototype.removeFriends = function (userIds) {
                if (this.isConnectedToFrontEnd()) {
                    var params = [];
                    params.push(Chat.Constants.ParameterCode.Friends, Photon.TypeExt.String(userIds));
                    this.masterPeer.sendOperation(Chat.Constants.OperationCode.RemoveFriends, params);
                    return true;
                }
                else {
                    this.logger.error("removeFriends request error:", "Not connected to Front End");
                    return false;
                }
            };
            /**
                @summary Returns list of public channels client subscribed to.
                @return Channel[] Array of public channels.
            */
            ChatClient.prototype.getPublicChannels = function () {
                return this.publicChannels;
            };
            /**
                @summary Returns list of channels representing current private conversation.
                @return Channel[] Array of private channels.
            */
            ChatClient.prototype.getPrivateChannels = function () {
                return this.privateChannels;
            };
            // private
            ChatClient.prototype.getOrAddChannel = function (channels, name, isPrivate) {
                if (channels[name] == undefined) {
                    channels[name] = new Channel(name, isPrivate);
                }
                return channels[name];
            };
            // internal
            ChatClient.prototype.initMasterPeer = function (mp) {
                var _this = this;
                _super.prototype.initMasterPeer.call(this, mp);
                // onOperationResponse called if no listener exists
                //mp.addResponseListener(Constants.OperationCode.Publish, (data: any) => {
                //    mp._logger.debug("resp Publish", data.errCode, data.errMsg);
                //});
                //mp.addResponseListener(Constants.OperationCode.SendPrivate, (data: any) => {
                //    mp._logger.debug("resp SendPrivate", data.errCode, data.errMsg);
                //});
                //mp.addResponseListener(Constants.OperationCode.UpdateStatus, (data: any) => {
                //    mp._logger.debug("resp UpdateStatus", data.errCode, data.errMsg);
                //});
                //mp.addResponseListener(Constants.OperationCode.FriendList, (data: any) => {
                //    mp._logger.debug("resp FriendList", data.errCode, data.errMsg);
                //});
                mp.addEventListener(Chat.Constants.EventCode.ChatMessages, function (data) {
                    var senders = data.vals[Chat.Constants.ParameterCode.Senders];
                    var messages = data.vals[Chat.Constants.ParameterCode.Messages];
                    var channelName = data.vals[Chat.Constants.ParameterCode.Channel];
                    var ch = _this.publicChannels[channelName];
                    if (ch) {
                        var newMessages = ch.addMessages(senders, messages);
                        ch.lastId = data.vals[Chat.Constants.ParameterCode.MsgId];
                        _this.onChatMessages(channelName, newMessages);
                    }
                    else {
                        mp._logger.warn("ev ChatMessages: Got message from unsubscribed channel ", channelName);
                    }
                });
                mp.addEventListener(Chat.Constants.EventCode.PrivateMessage, function (data) {
                    var sender = data.vals[Chat.Constants.ParameterCode.Sender];
                    var message = data.vals[Chat.Constants.ParameterCode.Message];
                    var userId = data.vals[Chat.Constants.ParameterCode.UserId];
                    var channelName = "";
                    if (_this.getUserId() == sender)
                        channelName = userId;
                    else
                        channelName = sender;
                    var ch = _this.getOrAddChannel(_this.privateChannels, channelName, true);
                    ch.lastId = data.vals[Chat.Constants.ParameterCode.MsgId];
                    _this.onPrivateMessage(channelName, new Message(sender, message));
                });
                mp.addEventListener(Chat.Constants.EventCode.StatusUpdate, function (data) {
                    var sender = data.vals[Chat.Constants.ParameterCode.Sender];
                    var status = data.vals[Chat.Constants.ParameterCode.Status];
                    var message = data.vals[Chat.Constants.ParameterCode.Message];
                    var gotMessage = message !== undefined;
                    _this.onUserStatusUpdate(sender, status, gotMessage, message);
                });
                mp.addEventListener(Chat.Constants.EventCode.Subscribe, function (data) {
                    mp._logger.debug("ev Subscribe", data);
                    var res = {};
                    var channels = data.vals[Chat.Constants.ParameterCode.Channels] || [];
                    var results = data.vals[Chat.Constants.ParameterCode.SubscribeResults] || [];
                    for (var i in channels) {
                        var ch = channels[i];
                        res[ch] = false;
                        if (i < results.length && results[i]) {
                            _this.getOrAddChannel(_this.publicChannels, ch, false);
                            res[ch] = true;
                        }
                    }
                    _this.onSubscribeResult(res);
                });
                mp.addEventListener(Chat.Constants.EventCode.Unsubscribe, function (data) {
                    mp._logger.debug("ev Unsubscribe", data);
                    var res = {};
                    var channels = data.vals[Chat.Constants.ParameterCode.Channels] || [];
                    for (var i in channels) {
                        var ch = channels[i];
                        delete (_this.publicChannels[ch]);
                        res[ch] = true;
                    }
                    _this.onUnsubscribeResult(res);
                });
            };
            /**
                @summary Converts {@link Photon.Chat.ChatClient.ChatState ChatState} element to string name.
                @method Photon.Chat.ChatClient.StateToName
                @param {Photon.Chat.ChatClient.ChatState} state Client state.
                @returns {string} Specified element name or undefined if not found.
            */
            ChatClient.StateToName = function (value) {
                var x = Exitgames.Common.Util.getEnumKeyByValue(ChatClient.ChatState, value);
                if (x === undefined) {
                    // Super class states support - useless since all states overridden but may help somehow when debugging
                    return Exitgames.Common.Util.getEnumKeyByValue(ChatClient.State, value);
                }
                else {
                    return x;
                }
            };
            ChatClient.ChatPeerErrorCode = {
                /**
                    @summary Enum for client peers error codes.
                    @member Photon.Chat.ChatClient.ChatPeerErrorCode
                    @readonly
                    @property {number} Ok No Error.
                    @property {number} FrontEndError General FrontEnd server peer error.
                    @property {number} FrontEndConnectFailed FrontEnd server connection error.
                    @property {number} FrontEndConnectClosed Disconnected from FrontEnd server.
                    @property {number} FrontEndTimeout Disconnected from FrontEnd server for timeout.
                    @property {number} FrontEndEncryptionEstablishError FrontEnd server encryption establishing failed.
                    @property {number} FrontEndAuthenticationFailed FrontEnd server authentication failed.
                    @property {number} NameServerError General NameServer peer error.
                    @property {number} NameServerConnectFailed NameServer connection error.
                    @property {number} NameServerConnectClosed Disconnected from NameServer.
                    @property {number} NameServerTimeout Disconnected from NameServer for timeout.
                    @property {number} NameServerEncryptionEstablishError NameServer encryption establishing failed.
                    @property {number} NameServerAuthenticationFailed NameServer authentication failed.
                 */
                Ok: 0,
                FrontEndError: 1001,
                FrontEndConnectFailed: 1002,
                FrontEndConnectClosed: 1003,
                FrontEndTimeout: 1004,
                FrontEndEncryptionEstablishError: 1005,
                FrontEndAuthenticationFailed: 1101,
                NameServerError: 3001,
                NameServerConnectFailed: 3002,
                NameServerConnectClosed: 3003,
                NameServerTimeout: 3004,
                NameServerEncryptionEstablishError: 300,
                NameServerAuthenticationFailed: 3101
            };
            ChatClient.ChatState = {
                /**
                    @summary Enum for client states.
                    @member Photon.Chat.ChatClient.ChatState
                    @readonly
                    @property {number} Error Critical error occurred.
                    @property {number} Uninitialized Client is created but not used yet.
                    @property {number} ConnectingToNameServer Connecting to NameServer.
                    @property {number} ConnectedToNameServer Connected to NameServer.
                    @property {number} ConnectingToFrontEnd Connecting to FrontEnd server.
                    @property {number} ConnectedToFrontEnd Connected to FrontEnd server.
                    @property {number} Disconnected The client is no longer connected (to any server).
                */
                Error: -1,
                Uninitialized: 0,
                ConnectingToNameServer: 1,
                ConnectedToNameServer: 2,
                ConnectingToFrontEnd: 3,
                ConnectedToFrontEnd: 4,
                Disconnected: 10
            };
            return ChatClient;
        }(Photon.LoadBalancing.LoadBalancingClient));
        Chat.ChatClient = ChatClient;
    })(Chat = Photon.Chat || (Photon.Chat = {}));
})(Photon || (Photon = {}));
