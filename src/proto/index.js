/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
(function (global, factory) {
    /* global define, require, module */

    /* AMD */ if (typeof define === 'function' && define.amd) define(['protobufjs/minimal'], factory);
    /* CommonJS */ else if (typeof require === 'function' && typeof module === 'object' && module && module.exports)
        module.exports = factory(require('protobufjs/minimal'));
})(this, function ($protobuf) {
    'use strict';

    // Common aliases
    var $Reader = $protobuf.Reader,
        $Writer = $protobuf.Writer,
        $util = $protobuf.util;

    // Exported root namespace
    var $root = $protobuf.roots['default'] || ($protobuf.roots['default'] = {});

    $root.Message = (function () {
        /**
         * Properties of a Message.
         * @exports IMessage
         * @interface IMessage
         * @property {string|null} [userId] Message userId
         * @property {number|Long|null} [messageId] Message messageId
         * @property {number|null} [last] Message last
         * @property {string|null} [token] Message token
         * @property {string|null} [userChannel] Message userChannel
         * @property {string|null} [vpsToken] Message vpsToken
         * @property {Array.<IDevContext>|null} [devContext] Устарело с версии 3.
         * @property {string|null} [messageName] Message messageName
         * @property {number|null} [version] Message version
         * @property {IVoice|null} [voice] Message voice
         * @property {IText|null} [text] Message text
         * @property {ISystemMessage|null} [systemMessage] Message systemMessage
         * @property {ILegacyDevice|null} [legacyDevice] Message legacyDevice
         * @property {ISettings|null} [settings] Message settings
         * @property {IStatus|null} [status] Message status
         * @property {IDevice|null} [device] Message device
         * @property {IBytes|null} [bytes] Message bytes
         * @property {IInitialSettings|null} [initialSettings] Message initialSettings
         * @property {ICancel|null} [cancel] Message cancel
         * @property {IMute|null} [mute] Message mute
         * @property {number|Long|null} [timestamp] Message timestamp
         * @property {Object.<string,string>|null} [meta] Message meta
         */

        /**
         * Constructs a new Message.
         * @exports Message
         * @classdesc Represents a Message.
         * @implements IMessage
         * @constructor
         * @param {IMessage=} [properties] Properties to set
         */
        function Message(properties) {
            this.devContext = [];
            this.meta = {};
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
        }

        /**
         * Message userId.
         * @member {string} userId
         * @memberof Message
         * @instance
         */
        Message.prototype.userId = '';

        /**
         * Message messageId.
         * @member {number|Long} messageId
         * @memberof Message
         * @instance
         */
        Message.prototype.messageId = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

        /**
         * Message last.
         * @member {number} last
         * @memberof Message
         * @instance
         */
        Message.prototype.last = 0;

        /**
         * Message token.
         * @member {string} token
         * @memberof Message
         * @instance
         */
        Message.prototype.token = '';

        /**
         * Message userChannel.
         * @member {string} userChannel
         * @memberof Message
         * @instance
         */
        Message.prototype.userChannel = '';

        /**
         * Message vpsToken.
         * @member {string} vpsToken
         * @memberof Message
         * @instance
         */
        Message.prototype.vpsToken = '';

        /**
         * Устарело с версии 3.
         * @member {Array.<IDevContext>} devContext
         * @memberof Message
         * @instance
         */
        Message.prototype.devContext = $util.emptyArray;

        /**
         * Message messageName.
         * @member {string} messageName
         * @memberof Message
         * @instance
         */
        Message.prototype.messageName = '';

        /**
         * Message version.
         * @member {number} version
         * @memberof Message
         * @instance
         */
        Message.prototype.version = 0;

        /**
         * Message voice.
         * @member {IVoice|null|undefined} voice
         * @memberof Message
         * @instance
         */
        Message.prototype.voice = null;

        /**
         * Message text.
         * @member {IText|null|undefined} text
         * @memberof Message
         * @instance
         */
        Message.prototype.text = null;

        /**
         * Message systemMessage.
         * @member {ISystemMessage|null|undefined} systemMessage
         * @memberof Message
         * @instance
         */
        Message.prototype.systemMessage = null;

        /**
         * Message legacyDevice.
         * @member {ILegacyDevice|null|undefined} legacyDevice
         * @memberof Message
         * @instance
         */
        Message.prototype.legacyDevice = null;

        /**
         * Message settings.
         * @member {ISettings|null|undefined} settings
         * @memberof Message
         * @instance
         */
        Message.prototype.settings = null;

        /**
         * Message status.
         * @member {IStatus|null|undefined} status
         * @memberof Message
         * @instance
         */
        Message.prototype.status = null;

        /**
         * Message device.
         * @member {IDevice|null|undefined} device
         * @memberof Message
         * @instance
         */
        Message.prototype.device = null;

        /**
         * Message bytes.
         * @member {IBytes|null|undefined} bytes
         * @memberof Message
         * @instance
         */
        Message.prototype.bytes = null;

        /**
         * Message initialSettings.
         * @member {IInitialSettings|null|undefined} initialSettings
         * @memberof Message
         * @instance
         */
        Message.prototype.initialSettings = null;

        /**
         * Message cancel.
         * @member {ICancel|null|undefined} cancel
         * @memberof Message
         * @instance
         */
        Message.prototype.cancel = null;

        /**
         * Message mute.
         * @member {IMute|null|undefined} mute
         * @memberof Message
         * @instance
         */
        Message.prototype.mute = null;

        /**
         * Message timestamp.
         * @member {number|Long} timestamp
         * @memberof Message
         * @instance
         */
        Message.prototype.timestamp = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

        /**
         * Message meta.
         * @member {Object.<string,string>} meta
         * @memberof Message
         * @instance
         */
        Message.prototype.meta = $util.emptyObject;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * Message content.
         * @member {"voice"|"text"|"systemMessage"|"legacyDevice"|"settings"|"status"|"device"|"bytes"|"initialSettings"|"cancel"|"mute"|undefined} content
         * @memberof Message
         * @instance
         */
        Object.defineProperty(Message.prototype, 'content', {
            get: $util.oneOfGetter(
                ($oneOfFields = [
                    'voice',
                    'text',
                    'systemMessage',
                    'legacyDevice',
                    'settings',
                    'status',
                    'device',
                    'bytes',
                    'initialSettings',
                    'cancel',
                    'mute',
                ]),
            ),
            set: $util.oneOfSetter($oneOfFields),
        });

        /**
         * Creates a new Message instance using the specified properties.
         * @function create
         * @memberof Message
         * @static
         * @param {IMessage=} [properties] Properties to set
         * @returns {Message} Message instance
         */
        Message.create = function create(properties) {
            return new Message(properties);
        };

        /**
         * Encodes the specified Message message. Does not implicitly {@link Message.verify|verify} messages.
         * @function encode
         * @memberof Message
         * @static
         * @param {IMessage} message Message message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message.encode = function encode(message, writer) {
            if (!writer) writer = $Writer.create();
            if (message.userId != null && Object.hasOwnProperty.call(message, 'userId'))
                writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.userId);
            if (message.messageId != null && Object.hasOwnProperty.call(message, 'messageId'))
                writer.uint32(/* id 2, wireType 0 =*/ 16).int64(message.messageId);
            if (message.last != null && Object.hasOwnProperty.call(message, 'last'))
                writer.uint32(/* id 3, wireType 0 =*/ 24).int32(message.last);
            if (message.token != null && Object.hasOwnProperty.call(message, 'token'))
                writer.uint32(/* id 4, wireType 2 =*/ 34).string(message.token);
            if (message.voice != null && Object.hasOwnProperty.call(message, 'voice'))
                $root.Voice.encode(message.voice, writer.uint32(/* id 5, wireType 2 =*/ 42).fork()).ldelim();
            if (message.text != null && Object.hasOwnProperty.call(message, 'text'))
                $root.Text.encode(message.text, writer.uint32(/* id 6, wireType 2 =*/ 50).fork()).ldelim();
            if (message.systemMessage != null && Object.hasOwnProperty.call(message, 'systemMessage'))
                $root.SystemMessage.encode(
                    message.systemMessage,
                    writer.uint32(/* id 7, wireType 2 =*/ 58).fork(),
                ).ldelim();
            if (message.legacyDevice != null && Object.hasOwnProperty.call(message, 'legacyDevice'))
                $root.LegacyDevice.encode(
                    message.legacyDevice,
                    writer.uint32(/* id 8, wireType 2 =*/ 66).fork(),
                ).ldelim();
            if (message.settings != null && Object.hasOwnProperty.call(message, 'settings'))
                $root.Settings.encode(message.settings, writer.uint32(/* id 9, wireType 2 =*/ 74).fork()).ldelim();
            if (message.status != null && Object.hasOwnProperty.call(message, 'status'))
                $root.Status.encode(message.status, writer.uint32(/* id 10, wireType 2 =*/ 82).fork()).ldelim();
            if (message.userChannel != null && Object.hasOwnProperty.call(message, 'userChannel'))
                writer.uint32(/* id 11, wireType 2 =*/ 90).string(message.userChannel);
            if (message.vpsToken != null && Object.hasOwnProperty.call(message, 'vpsToken'))
                writer.uint32(/* id 12, wireType 2 =*/ 98).string(message.vpsToken);
            if (message.devContext != null && message.devContext.length)
                for (var i = 0; i < message.devContext.length; ++i)
                    $root.DevContext.encode(
                        message.devContext[i],
                        writer.uint32(/* id 13, wireType 2 =*/ 106).fork(),
                    ).ldelim();
            if (message.messageName != null && Object.hasOwnProperty.call(message, 'messageName'))
                writer.uint32(/* id 14, wireType 2 =*/ 114).string(message.messageName);
            if (message.version != null && Object.hasOwnProperty.call(message, 'version'))
                writer.uint32(/* id 15, wireType 0 =*/ 120).int32(message.version);
            if (message.device != null && Object.hasOwnProperty.call(message, 'device'))
                $root.Device.encode(message.device, writer.uint32(/* id 16, wireType 2 =*/ 130).fork()).ldelim();
            if (message.bytes != null && Object.hasOwnProperty.call(message, 'bytes'))
                $root.Bytes.encode(message.bytes, writer.uint32(/* id 17, wireType 2 =*/ 138).fork()).ldelim();
            if (message.initialSettings != null && Object.hasOwnProperty.call(message, 'initialSettings'))
                $root.InitialSettings.encode(
                    message.initialSettings,
                    writer.uint32(/* id 18, wireType 2 =*/ 146).fork(),
                ).ldelim();
            if (message.timestamp != null && Object.hasOwnProperty.call(message, 'timestamp'))
                writer.uint32(/* id 19, wireType 0 =*/ 152).int64(message.timestamp);
            if (message.meta != null && Object.hasOwnProperty.call(message, 'meta'))
                for (var keys = Object.keys(message.meta), i = 0; i < keys.length; ++i)
                    writer
                        .uint32(/* id 20, wireType 2 =*/ 162)
                        .fork()
                        .uint32(/* id 1, wireType 2 =*/ 10)
                        .string(keys[i])
                        .uint32(/* id 2, wireType 2 =*/ 18)
                        .string(message.meta[keys[i]])
                        .ldelim();
            if (message.cancel != null && Object.hasOwnProperty.call(message, 'cancel'))
                $root.Cancel.encode(message.cancel, writer.uint32(/* id 21, wireType 2 =*/ 170).fork()).ldelim();
            if (message.mute != null && Object.hasOwnProperty.call(message, 'mute'))
                $root.Mute.encode(message.mute, writer.uint32(/* id 23, wireType 2 =*/ 186).fork()).ldelim();
            return writer;
        };

        /**
         * Decodes a Message message from the specified reader or buffer.
         * @function decode
         * @memberof Message
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Message} Message
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length,
                message = new $root.Message(),
                key,
                value;
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                    case 1: {
                        message.userId = reader.string();
                        break;
                    }
                    case 2: {
                        message.messageId = reader.int64();
                        break;
                    }
                    case 3: {
                        message.last = reader.int32();
                        break;
                    }
                    case 4: {
                        message.token = reader.string();
                        break;
                    }
                    case 11: {
                        message.userChannel = reader.string();
                        break;
                    }
                    case 12: {
                        message.vpsToken = reader.string();
                        break;
                    }
                    case 13: {
                        if (!(message.devContext && message.devContext.length)) message.devContext = [];
                        message.devContext.push($root.DevContext.decode(reader, reader.uint32()));
                        break;
                    }
                    case 14: {
                        message.messageName = reader.string();
                        break;
                    }
                    case 15: {
                        message.version = reader.int32();
                        break;
                    }
                    case 5: {
                        message.voice = $root.Voice.decode(reader, reader.uint32());
                        break;
                    }
                    case 6: {
                        message.text = $root.Text.decode(reader, reader.uint32());
                        break;
                    }
                    case 7: {
                        message.systemMessage = $root.SystemMessage.decode(reader, reader.uint32());
                        break;
                    }
                    case 8: {
                        message.legacyDevice = $root.LegacyDevice.decode(reader, reader.uint32());
                        break;
                    }
                    case 9: {
                        message.settings = $root.Settings.decode(reader, reader.uint32());
                        break;
                    }
                    case 10: {
                        message.status = $root.Status.decode(reader, reader.uint32());
                        break;
                    }
                    case 16: {
                        message.device = $root.Device.decode(reader, reader.uint32());
                        break;
                    }
                    case 17: {
                        message.bytes = $root.Bytes.decode(reader, reader.uint32());
                        break;
                    }
                    case 18: {
                        message.initialSettings = $root.InitialSettings.decode(reader, reader.uint32());
                        break;
                    }
                    case 21: {
                        message.cancel = $root.Cancel.decode(reader, reader.uint32());
                        break;
                    }
                    case 23: {
                        message.mute = $root.Mute.decode(reader, reader.uint32());
                        break;
                    }
                    case 19: {
                        message.timestamp = reader.int64();
                        break;
                    }
                    case 20: {
                        if (message.meta === $util.emptyObject) message.meta = {};
                        var end2 = reader.uint32() + reader.pos;
                        key = '';
                        value = '';
                        while (reader.pos < end2) {
                            var tag2 = reader.uint32();
                            switch (tag2 >>> 3) {
                                case 1:
                                    key = reader.string();
                                    break;
                                case 2:
                                    value = reader.string();
                                    break;
                                default:
                                    reader.skipType(tag2 & 7);
                                    break;
                            }
                        }
                        message.meta[key] = value;
                        break;
                    }
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        return Message;
    })();

    $root.InitialSettings = (function () {
        /**
         * Properties of an InitialSettings.
         * @exports IInitialSettings
         * @interface IInitialSettings
         * @property {string|null} [userId] InitialSettings userId
         * @property {string|null} [userChannel] InitialSettings userChannel
         * @property {IDevice|null} [device] InitialSettings device
         * @property {ISettings|null} [settings] InitialSettings settings
         * @property {string|null} [locale] InitialSettings locale
         */

        /**
         * Constructs a new InitialSettings.
         * @exports InitialSettings
         * @classdesc Represents an InitialSettings.
         * @implements IInitialSettings
         * @constructor
         * @param {IInitialSettings=} [properties] Properties to set
         */
        function InitialSettings(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
        }

        /**
         * InitialSettings userId.
         * @member {string} userId
         * @memberof InitialSettings
         * @instance
         */
        InitialSettings.prototype.userId = '';

        /**
         * InitialSettings userChannel.
         * @member {string} userChannel
         * @memberof InitialSettings
         * @instance
         */
        InitialSettings.prototype.userChannel = '';

        /**
         * InitialSettings device.
         * @member {IDevice|null|undefined} device
         * @memberof InitialSettings
         * @instance
         */
        InitialSettings.prototype.device = null;

        /**
         * InitialSettings settings.
         * @member {ISettings|null|undefined} settings
         * @memberof InitialSettings
         * @instance
         */
        InitialSettings.prototype.settings = null;

        /**
         * InitialSettings locale.
         * @member {string} locale
         * @memberof InitialSettings
         * @instance
         */
        InitialSettings.prototype.locale = '';

        /**
         * Creates a new InitialSettings instance using the specified properties.
         * @function create
         * @memberof InitialSettings
         * @static
         * @param {IInitialSettings=} [properties] Properties to set
         * @returns {InitialSettings} InitialSettings instance
         */
        InitialSettings.create = function create(properties) {
            return new InitialSettings(properties);
        };

        /**
         * Encodes the specified InitialSettings message. Does not implicitly {@link InitialSettings.verify|verify} messages.
         * @function encode
         * @memberof InitialSettings
         * @static
         * @param {IInitialSettings} message InitialSettings message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InitialSettings.encode = function encode(message, writer) {
            if (!writer) writer = $Writer.create();
            if (message.userId != null && Object.hasOwnProperty.call(message, 'userId'))
                writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.userId);
            if (message.userChannel != null && Object.hasOwnProperty.call(message, 'userChannel'))
                writer.uint32(/* id 2, wireType 2 =*/ 18).string(message.userChannel);
            if (message.device != null && Object.hasOwnProperty.call(message, 'device'))
                $root.Device.encode(message.device, writer.uint32(/* id 3, wireType 2 =*/ 26).fork()).ldelim();
            if (message.settings != null && Object.hasOwnProperty.call(message, 'settings'))
                $root.Settings.encode(message.settings, writer.uint32(/* id 4, wireType 2 =*/ 34).fork()).ldelim();
            if (message.locale != null && Object.hasOwnProperty.call(message, 'locale'))
                writer.uint32(/* id 5, wireType 2 =*/ 42).string(message.locale);
            return writer;
        };

        /**
         * Decodes an InitialSettings message from the specified reader or buffer.
         * @function decode
         * @memberof InitialSettings
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {InitialSettings} InitialSettings
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InitialSettings.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length,
                message = new $root.InitialSettings();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                    case 1: {
                        message.userId = reader.string();
                        break;
                    }
                    case 2: {
                        message.userChannel = reader.string();
                        break;
                    }
                    case 3: {
                        message.device = $root.Device.decode(reader, reader.uint32());
                        break;
                    }
                    case 4: {
                        message.settings = $root.Settings.decode(reader, reader.uint32());
                        break;
                    }
                    case 5: {
                        message.locale = reader.string();
                        break;
                    }
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        return InitialSettings;
    })();

    $root.Device = (function () {
        /**
         * Properties of a Device.
         * @exports IDevice
         * @interface IDevice
         * @property {string|null} [platformType] Device platformType
         * @property {string|null} [platformVersion] Device platformVersion
         * @property {string|null} [surface] Обязательно. Пример, SBERBOX
         * @property {string|null} [surfaceVersion] Device surfaceVersion
         * @property {string|null} [features] Device features
         * @property {string|null} [capabilities] Device capabilities
         * @property {string|null} [deviceId] Device deviceId
         * @property {string|null} [deviceManufacturer] Device deviceManufacturer
         * @property {string|null} [deviceModel] Device deviceModel
         * @property {string|null} [additionalInfo] Device additionalInfo
         * @property {string|null} [tenant] Device tenant
         */

        /**
         * Constructs a new Device.
         * @exports Device
         * @classdesc Represents a Device.
         * @implements IDevice
         * @constructor
         * @param {IDevice=} [properties] Properties to set
         */
        function Device(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
        }

        /**
         * Device platformType.
         * @member {string} platformType
         * @memberof Device
         * @instance
         */
        Device.prototype.platformType = '';

        /**
         * Device platformVersion.
         * @member {string} platformVersion
         * @memberof Device
         * @instance
         */
        Device.prototype.platformVersion = '';

        /**
         * Обязательно. Пример, SBERBOX
         * @member {string} surface
         * @memberof Device
         * @instance
         */
        Device.prototype.surface = '';

        /**
         * Device surfaceVersion.
         * @member {string} surfaceVersion
         * @memberof Device
         * @instance
         */
        Device.prototype.surfaceVersion = '';

        /**
         * Device features.
         * @member {string} features
         * @memberof Device
         * @instance
         */
        Device.prototype.features = '';

        /**
         * Device capabilities.
         * @member {string} capabilities
         * @memberof Device
         * @instance
         */
        Device.prototype.capabilities = '';

        /**
         * Device deviceId.
         * @member {string} deviceId
         * @memberof Device
         * @instance
         */
        Device.prototype.deviceId = '';

        /**
         * Device deviceManufacturer.
         * @member {string} deviceManufacturer
         * @memberof Device
         * @instance
         */
        Device.prototype.deviceManufacturer = '';

        /**
         * Device deviceModel.
         * @member {string} deviceModel
         * @memberof Device
         * @instance
         */
        Device.prototype.deviceModel = '';

        /**
         * Device additionalInfo.
         * @member {string} additionalInfo
         * @memberof Device
         * @instance
         */
        Device.prototype.additionalInfo = '';

        /**
         * Device tenant.
         * @member {string} tenant
         * @memberof Device
         * @instance
         */
        Device.prototype.tenant = '';

        /**
         * Creates a new Device instance using the specified properties.
         * @function create
         * @memberof Device
         * @static
         * @param {IDevice=} [properties] Properties to set
         * @returns {Device} Device instance
         */
        Device.create = function create(properties) {
            return new Device(properties);
        };

        /**
         * Encodes the specified Device message. Does not implicitly {@link Device.verify|verify} messages.
         * @function encode
         * @memberof Device
         * @static
         * @param {IDevice} message Device message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Device.encode = function encode(message, writer) {
            if (!writer) writer = $Writer.create();
            if (message.platformType != null && Object.hasOwnProperty.call(message, 'platformType'))
                writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.platformType);
            if (message.platformVersion != null && Object.hasOwnProperty.call(message, 'platformVersion'))
                writer.uint32(/* id 2, wireType 2 =*/ 18).string(message.platformVersion);
            if (message.surface != null && Object.hasOwnProperty.call(message, 'surface'))
                writer.uint32(/* id 3, wireType 2 =*/ 26).string(message.surface);
            if (message.surfaceVersion != null && Object.hasOwnProperty.call(message, 'surfaceVersion'))
                writer.uint32(/* id 4, wireType 2 =*/ 34).string(message.surfaceVersion);
            if (message.features != null && Object.hasOwnProperty.call(message, 'features'))
                writer.uint32(/* id 5, wireType 2 =*/ 42).string(message.features);
            if (message.capabilities != null && Object.hasOwnProperty.call(message, 'capabilities'))
                writer.uint32(/* id 6, wireType 2 =*/ 50).string(message.capabilities);
            if (message.deviceId != null && Object.hasOwnProperty.call(message, 'deviceId'))
                writer.uint32(/* id 7, wireType 2 =*/ 58).string(message.deviceId);
            if (message.deviceManufacturer != null && Object.hasOwnProperty.call(message, 'deviceManufacturer'))
                writer.uint32(/* id 8, wireType 2 =*/ 66).string(message.deviceManufacturer);
            if (message.deviceModel != null && Object.hasOwnProperty.call(message, 'deviceModel'))
                writer.uint32(/* id 9, wireType 2 =*/ 74).string(message.deviceModel);
            if (message.additionalInfo != null && Object.hasOwnProperty.call(message, 'additionalInfo'))
                writer.uint32(/* id 10, wireType 2 =*/ 82).string(message.additionalInfo);
            if (message.tenant != null && Object.hasOwnProperty.call(message, 'tenant'))
                writer.uint32(/* id 11, wireType 2 =*/ 90).string(message.tenant);
            return writer;
        };

        /**
         * Decodes a Device message from the specified reader or buffer.
         * @function decode
         * @memberof Device
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Device} Device
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Device.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length,
                message = new $root.Device();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                    case 1: {
                        message.platformType = reader.string();
                        break;
                    }
                    case 2: {
                        message.platformVersion = reader.string();
                        break;
                    }
                    case 3: {
                        message.surface = reader.string();
                        break;
                    }
                    case 4: {
                        message.surfaceVersion = reader.string();
                        break;
                    }
                    case 5: {
                        message.features = reader.string();
                        break;
                    }
                    case 6: {
                        message.capabilities = reader.string();
                        break;
                    }
                    case 7: {
                        message.deviceId = reader.string();
                        break;
                    }
                    case 8: {
                        message.deviceManufacturer = reader.string();
                        break;
                    }
                    case 9: {
                        message.deviceModel = reader.string();
                        break;
                    }
                    case 10: {
                        message.additionalInfo = reader.string();
                        break;
                    }
                    case 11: {
                        message.tenant = reader.string();
                        break;
                    }
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        return Device;
    })();

    $root.Settings = (function () {
        /**
         * Properties of a Settings.
         * @exports ISettings
         * @interface ISettings
         * @property {number|null} [dubbing] Settings dubbing
         * @property {number|null} [echo] Settings echo
         * @property {string|null} [ttsEngine] Settings ttsEngine
         * @property {string|null} [asrEngine] Settings asrEngine
         * @property {number|null} [asrAutoStop] Settings asrAutoStop
         * @property {number|null} [devMode] Settings devMode
         * @property {string|null} [authConnector] Settings authConnector
         * @property {string|null} [surface] Settings surface
         */

        /**
         * Constructs a new Settings.
         * @exports Settings
         * @classdesc Represents a Settings.
         * @implements ISettings
         * @constructor
         * @param {ISettings=} [properties] Properties to set
         */
        function Settings(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
        }

        /**
         * Settings dubbing.
         * @member {number} dubbing
         * @memberof Settings
         * @instance
         */
        Settings.prototype.dubbing = 0;

        /**
         * Settings echo.
         * @member {number} echo
         * @memberof Settings
         * @instance
         */
        Settings.prototype.echo = 0;

        /**
         * Settings ttsEngine.
         * @member {string} ttsEngine
         * @memberof Settings
         * @instance
         */
        Settings.prototype.ttsEngine = '';

        /**
         * Settings asrEngine.
         * @member {string} asrEngine
         * @memberof Settings
         * @instance
         */
        Settings.prototype.asrEngine = '';

        /**
         * Settings asrAutoStop.
         * @member {number} asrAutoStop
         * @memberof Settings
         * @instance
         */
        Settings.prototype.asrAutoStop = 0;

        /**
         * Settings devMode.
         * @member {number} devMode
         * @memberof Settings
         * @instance
         */
        Settings.prototype.devMode = 0;

        /**
         * Settings authConnector.
         * @member {string} authConnector
         * @memberof Settings
         * @instance
         */
        Settings.prototype.authConnector = '';

        /**
         * Settings surface.
         * @member {string} surface
         * @memberof Settings
         * @instance
         */
        Settings.prototype.surface = '';

        /**
         * Creates a new Settings instance using the specified properties.
         * @function create
         * @memberof Settings
         * @static
         * @param {ISettings=} [properties] Properties to set
         * @returns {Settings} Settings instance
         */
        Settings.create = function create(properties) {
            return new Settings(properties);
        };

        /**
         * Encodes the specified Settings message. Does not implicitly {@link Settings.verify|verify} messages.
         * @function encode
         * @memberof Settings
         * @static
         * @param {ISettings} message Settings message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Settings.encode = function encode(message, writer) {
            if (!writer) writer = $Writer.create();
            if (message.dubbing != null && Object.hasOwnProperty.call(message, 'dubbing'))
                writer.uint32(/* id 1, wireType 0 =*/ 8).int32(message.dubbing);
            if (message.echo != null && Object.hasOwnProperty.call(message, 'echo'))
                writer.uint32(/* id 2, wireType 0 =*/ 16).int32(message.echo);
            if (message.ttsEngine != null && Object.hasOwnProperty.call(message, 'ttsEngine'))
                writer.uint32(/* id 3, wireType 2 =*/ 26).string(message.ttsEngine);
            if (message.asrEngine != null && Object.hasOwnProperty.call(message, 'asrEngine'))
                writer.uint32(/* id 4, wireType 2 =*/ 34).string(message.asrEngine);
            if (message.asrAutoStop != null && Object.hasOwnProperty.call(message, 'asrAutoStop'))
                writer.uint32(/* id 5, wireType 0 =*/ 40).int32(message.asrAutoStop);
            if (message.devMode != null && Object.hasOwnProperty.call(message, 'devMode'))
                writer.uint32(/* id 6, wireType 0 =*/ 48).int32(message.devMode);
            if (message.authConnector != null && Object.hasOwnProperty.call(message, 'authConnector'))
                writer.uint32(/* id 7, wireType 2 =*/ 58).string(message.authConnector);
            if (message.surface != null && Object.hasOwnProperty.call(message, 'surface'))
                writer.uint32(/* id 8, wireType 2 =*/ 66).string(message.surface);
            return writer;
        };

        /**
         * Decodes a Settings message from the specified reader or buffer.
         * @function decode
         * @memberof Settings
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Settings} Settings
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Settings.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length,
                message = new $root.Settings();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                    case 1: {
                        message.dubbing = reader.int32();
                        break;
                    }
                    case 2: {
                        message.echo = reader.int32();
                        break;
                    }
                    case 3: {
                        message.ttsEngine = reader.string();
                        break;
                    }
                    case 4: {
                        message.asrEngine = reader.string();
                        break;
                    }
                    case 5: {
                        message.asrAutoStop = reader.int32();
                        break;
                    }
                    case 6: {
                        message.devMode = reader.int32();
                        break;
                    }
                    case 7: {
                        message.authConnector = reader.string();
                        break;
                    }
                    case 8: {
                        message.surface = reader.string();
                        break;
                    }
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        return Settings;
    })();

    $root.LegacyDevice = (function () {
        /**
         * Properties of a LegacyDevice.
         * @exports ILegacyDevice
         * @interface ILegacyDevice
         * @property {string|null} [clientType] LegacyDevice clientType
         * @property {string|null} [channel] LegacyDevice channel
         * @property {string|null} [channelVersion] LegacyDevice channelVersion
         * @property {string|null} [platformName] LegacyDevice platformName
         * @property {string|null} [platformVersion] LegacyDevice platformVersion
         * @property {string|null} [sdkVersion] LegacyDevice sdkVersion
         * @property {string|null} [protocolVersion] LegacyDevice protocolVersion
         */

        /**
         * Constructs a new LegacyDevice.
         * @exports LegacyDevice
         * @classdesc Represents a LegacyDevice.
         * @implements ILegacyDevice
         * @constructor
         * @param {ILegacyDevice=} [properties] Properties to set
         */
        function LegacyDevice(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
        }

        /**
         * LegacyDevice clientType.
         * @member {string} clientType
         * @memberof LegacyDevice
         * @instance
         */
        LegacyDevice.prototype.clientType = '';

        /**
         * LegacyDevice channel.
         * @member {string} channel
         * @memberof LegacyDevice
         * @instance
         */
        LegacyDevice.prototype.channel = '';

        /**
         * LegacyDevice channelVersion.
         * @member {string} channelVersion
         * @memberof LegacyDevice
         * @instance
         */
        LegacyDevice.prototype.channelVersion = '';

        /**
         * LegacyDevice platformName.
         * @member {string} platformName
         * @memberof LegacyDevice
         * @instance
         */
        LegacyDevice.prototype.platformName = '';

        /**
         * LegacyDevice platformVersion.
         * @member {string} platformVersion
         * @memberof LegacyDevice
         * @instance
         */
        LegacyDevice.prototype.platformVersion = '';

        /**
         * LegacyDevice sdkVersion.
         * @member {string} sdkVersion
         * @memberof LegacyDevice
         * @instance
         */
        LegacyDevice.prototype.sdkVersion = '';

        /**
         * LegacyDevice protocolVersion.
         * @member {string} protocolVersion
         * @memberof LegacyDevice
         * @instance
         */
        LegacyDevice.prototype.protocolVersion = '';

        /**
         * Creates a new LegacyDevice instance using the specified properties.
         * @function create
         * @memberof LegacyDevice
         * @static
         * @param {ILegacyDevice=} [properties] Properties to set
         * @returns {LegacyDevice} LegacyDevice instance
         */
        LegacyDevice.create = function create(properties) {
            return new LegacyDevice(properties);
        };

        /**
         * Encodes the specified LegacyDevice message. Does not implicitly {@link LegacyDevice.verify|verify} messages.
         * @function encode
         * @memberof LegacyDevice
         * @static
         * @param {ILegacyDevice} message LegacyDevice message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LegacyDevice.encode = function encode(message, writer) {
            if (!writer) writer = $Writer.create();
            if (message.clientType != null && Object.hasOwnProperty.call(message, 'clientType'))
                writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.clientType);
            if (message.channel != null && Object.hasOwnProperty.call(message, 'channel'))
                writer.uint32(/* id 2, wireType 2 =*/ 18).string(message.channel);
            if (message.channelVersion != null && Object.hasOwnProperty.call(message, 'channelVersion'))
                writer.uint32(/* id 3, wireType 2 =*/ 26).string(message.channelVersion);
            if (message.platformName != null && Object.hasOwnProperty.call(message, 'platformName'))
                writer.uint32(/* id 4, wireType 2 =*/ 34).string(message.platformName);
            if (message.platformVersion != null && Object.hasOwnProperty.call(message, 'platformVersion'))
                writer.uint32(/* id 5, wireType 2 =*/ 42).string(message.platformVersion);
            if (message.sdkVersion != null && Object.hasOwnProperty.call(message, 'sdkVersion'))
                writer.uint32(/* id 6, wireType 2 =*/ 50).string(message.sdkVersion);
            if (message.protocolVersion != null && Object.hasOwnProperty.call(message, 'protocolVersion'))
                writer.uint32(/* id 7, wireType 2 =*/ 58).string(message.protocolVersion);
            return writer;
        };

        /**
         * Decodes a LegacyDevice message from the specified reader or buffer.
         * @function decode
         * @memberof LegacyDevice
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {LegacyDevice} LegacyDevice
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LegacyDevice.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length,
                message = new $root.LegacyDevice();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                    case 1: {
                        message.clientType = reader.string();
                        break;
                    }
                    case 2: {
                        message.channel = reader.string();
                        break;
                    }
                    case 3: {
                        message.channelVersion = reader.string();
                        break;
                    }
                    case 4: {
                        message.platformName = reader.string();
                        break;
                    }
                    case 5: {
                        message.platformVersion = reader.string();
                        break;
                    }
                    case 6: {
                        message.sdkVersion = reader.string();
                        break;
                    }
                    case 7: {
                        message.protocolVersion = reader.string();
                        break;
                    }
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        return LegacyDevice;
    })();

    $root.Voice = (function () {
        /**
         * Properties of a Voice.
         * @exports IVoice
         * @interface IVoice
         * @property {Uint8Array|null} [data] Voice data
         */

        /**
         * Constructs a new Voice.
         * @exports Voice
         * @classdesc Represents a Voice.
         * @implements IVoice
         * @constructor
         * @param {IVoice=} [properties] Properties to set
         */
        function Voice(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
        }

        /**
         * Voice data.
         * @member {Uint8Array} data
         * @memberof Voice
         * @instance
         */
        Voice.prototype.data = $util.newBuffer([]);

        /**
         * Creates a new Voice instance using the specified properties.
         * @function create
         * @memberof Voice
         * @static
         * @param {IVoice=} [properties] Properties to set
         * @returns {Voice} Voice instance
         */
        Voice.create = function create(properties) {
            return new Voice(properties);
        };

        /**
         * Encodes the specified Voice message. Does not implicitly {@link Voice.verify|verify} messages.
         * @function encode
         * @memberof Voice
         * @static
         * @param {IVoice} message Voice message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Voice.encode = function encode(message, writer) {
            if (!writer) writer = $Writer.create();
            if (message.data != null && Object.hasOwnProperty.call(message, 'data'))
                writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.data);
            return writer;
        };

        /**
         * Decodes a Voice message from the specified reader or buffer.
         * @function decode
         * @memberof Voice
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Voice} Voice
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Voice.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length,
                message = new $root.Voice();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                    case 1: {
                        message.data = reader.bytes();
                        break;
                    }
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        return Voice;
    })();

    $root.Text = (function () {
        /**
         * Properties of a Text.
         * @exports IText
         * @interface IText
         * @property {string|null} [data] Text data
         * @property {string|null} [type] Text type
         */

        /**
         * Constructs a new Text.
         * @exports Text
         * @classdesc Represents a Text.
         * @implements IText
         * @constructor
         * @param {IText=} [properties] Properties to set
         */
        function Text(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
        }

        /**
         * Text data.
         * @member {string} data
         * @memberof Text
         * @instance
         */
        Text.prototype.data = '';

        /**
         * Text type.
         * @member {string} type
         * @memberof Text
         * @instance
         */
        Text.prototype.type = '';

        /**
         * Creates a new Text instance using the specified properties.
         * @function create
         * @memberof Text
         * @static
         * @param {IText=} [properties] Properties to set
         * @returns {Text} Text instance
         */
        Text.create = function create(properties) {
            return new Text(properties);
        };

        /**
         * Encodes the specified Text message. Does not implicitly {@link Text.verify|verify} messages.
         * @function encode
         * @memberof Text
         * @static
         * @param {IText} message Text message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Text.encode = function encode(message, writer) {
            if (!writer) writer = $Writer.create();
            if (message.data != null && Object.hasOwnProperty.call(message, 'data'))
                writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.data);
            if (message.type != null && Object.hasOwnProperty.call(message, 'type'))
                writer.uint32(/* id 2, wireType 2 =*/ 18).string(message.type);
            return writer;
        };

        /**
         * Decodes a Text message from the specified reader or buffer.
         * @function decode
         * @memberof Text
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Text} Text
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Text.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length,
                message = new $root.Text();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                    case 1: {
                        message.data = reader.string();
                        break;
                    }
                    case 2: {
                        message.type = reader.string();
                        break;
                    }
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        return Text;
    })();

    $root.SystemMessage = (function () {
        /**
         * Properties of a SystemMessage.
         * @exports ISystemMessage
         * @interface ISystemMessage
         * @property {string|null} [data] SystemMessage data
         */

        /**
         * Constructs a new SystemMessage.
         * @exports SystemMessage
         * @classdesc Represents a SystemMessage.
         * @implements ISystemMessage
         * @constructor
         * @param {ISystemMessage=} [properties] Properties to set
         */
        function SystemMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
        }

        /**
         * SystemMessage data.
         * @member {string} data
         * @memberof SystemMessage
         * @instance
         */
        SystemMessage.prototype.data = '';

        /**
         * Creates a new SystemMessage instance using the specified properties.
         * @function create
         * @memberof SystemMessage
         * @static
         * @param {ISystemMessage=} [properties] Properties to set
         * @returns {SystemMessage} SystemMessage instance
         */
        SystemMessage.create = function create(properties) {
            return new SystemMessage(properties);
        };

        /**
         * Encodes the specified SystemMessage message. Does not implicitly {@link SystemMessage.verify|verify} messages.
         * @function encode
         * @memberof SystemMessage
         * @static
         * @param {ISystemMessage} message SystemMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SystemMessage.encode = function encode(message, writer) {
            if (!writer) writer = $Writer.create();
            if (message.data != null && Object.hasOwnProperty.call(message, 'data'))
                writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.data);
            return writer;
        };

        /**
         * Decodes a SystemMessage message from the specified reader or buffer.
         * @function decode
         * @memberof SystemMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {SystemMessage} SystemMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SystemMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length,
                message = new $root.SystemMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                    case 1: {
                        message.data = reader.string();
                        break;
                    }
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        return SystemMessage;
    })();

    $root.Status = (function () {
        /**
         * Properties of a Status.
         * @exports IStatus
         * @interface IStatus
         * @property {number|null} [code] Status code
         * @property {string|null} [description] Status description
         * @property {string|null} [technicalDescription] Status technicalDescription
         */

        /**
         * Constructs a new Status.
         * @exports Status
         * @classdesc Represents a Status.
         * @implements IStatus
         * @constructor
         * @param {IStatus=} [properties] Properties to set
         */
        function Status(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
        }

        /**
         * Status code.
         * @member {number} code
         * @memberof Status
         * @instance
         */
        Status.prototype.code = 0;

        /**
         * Status description.
         * @member {string} description
         * @memberof Status
         * @instance
         */
        Status.prototype.description = '';

        /**
         * Status technicalDescription.
         * @member {string} technicalDescription
         * @memberof Status
         * @instance
         */
        Status.prototype.technicalDescription = '';

        /**
         * Creates a new Status instance using the specified properties.
         * @function create
         * @memberof Status
         * @static
         * @param {IStatus=} [properties] Properties to set
         * @returns {Status} Status instance
         */
        Status.create = function create(properties) {
            return new Status(properties);
        };

        /**
         * Encodes the specified Status message. Does not implicitly {@link Status.verify|verify} messages.
         * @function encode
         * @memberof Status
         * @static
         * @param {IStatus} message Status message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Status.encode = function encode(message, writer) {
            if (!writer) writer = $Writer.create();
            if (message.code != null && Object.hasOwnProperty.call(message, 'code'))
                writer.uint32(/* id 1, wireType 0 =*/ 8).int32(message.code);
            if (message.description != null && Object.hasOwnProperty.call(message, 'description'))
                writer.uint32(/* id 2, wireType 2 =*/ 18).string(message.description);
            if (message.technicalDescription != null && Object.hasOwnProperty.call(message, 'technicalDescription'))
                writer.uint32(/* id 3, wireType 2 =*/ 26).string(message.technicalDescription);
            return writer;
        };

        /**
         * Decodes a Status message from the specified reader or buffer.
         * @function decode
         * @memberof Status
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Status} Status
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Status.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length,
                message = new $root.Status();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                    case 1: {
                        message.code = reader.int32();
                        break;
                    }
                    case 2: {
                        message.description = reader.string();
                        break;
                    }
                    case 3: {
                        message.technicalDescription = reader.string();
                        break;
                    }
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        return Status;
    })();

    $root.Bytes = (function () {
        /**
         * Properties of a Bytes.
         * @exports IBytes
         * @interface IBytes
         * @property {Uint8Array|null} [data] Bytes data
         * @property {string|null} [desc] Bytes desc
         */

        /**
         * Constructs a new Bytes.
         * @exports Bytes
         * @classdesc Represents a Bytes.
         * @implements IBytes
         * @constructor
         * @param {IBytes=} [properties] Properties to set
         */
        function Bytes(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
        }

        /**
         * Bytes data.
         * @member {Uint8Array} data
         * @memberof Bytes
         * @instance
         */
        Bytes.prototype.data = $util.newBuffer([]);

        /**
         * Bytes desc.
         * @member {string} desc
         * @memberof Bytes
         * @instance
         */
        Bytes.prototype.desc = '';

        /**
         * Creates a new Bytes instance using the specified properties.
         * @function create
         * @memberof Bytes
         * @static
         * @param {IBytes=} [properties] Properties to set
         * @returns {Bytes} Bytes instance
         */
        Bytes.create = function create(properties) {
            return new Bytes(properties);
        };

        /**
         * Encodes the specified Bytes message. Does not implicitly {@link Bytes.verify|verify} messages.
         * @function encode
         * @memberof Bytes
         * @static
         * @param {IBytes} message Bytes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Bytes.encode = function encode(message, writer) {
            if (!writer) writer = $Writer.create();
            if (message.data != null && Object.hasOwnProperty.call(message, 'data'))
                writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.data);
            if (message.desc != null && Object.hasOwnProperty.call(message, 'desc'))
                writer.uint32(/* id 2, wireType 2 =*/ 18).string(message.desc);
            return writer;
        };

        /**
         * Decodes a Bytes message from the specified reader or buffer.
         * @function decode
         * @memberof Bytes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Bytes} Bytes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Bytes.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length,
                message = new $root.Bytes();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                    case 1: {
                        message.data = reader.bytes();
                        break;
                    }
                    case 2: {
                        message.desc = reader.string();
                        break;
                    }
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        return Bytes;
    })();

    $root.DevContext = (function () {
        /**
         * Properties of a DevContext.
         * @exports IDevContext
         * @interface IDevContext
         * @property {string|null} [name] DevContext name
         * @property {number|Long|null} [timestampMs] DevContext timestampMs
         * @property {string|null} [data] DevContext data
         */

        /**
         * Constructs a new DevContext.
         * @exports DevContext
         * @classdesc Represents a DevContext.
         * @implements IDevContext
         * @constructor
         * @param {IDevContext=} [properties] Properties to set
         */
        function DevContext(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
        }

        /**
         * DevContext name.
         * @member {string} name
         * @memberof DevContext
         * @instance
         */
        DevContext.prototype.name = '';

        /**
         * DevContext timestampMs.
         * @member {number|Long} timestampMs
         * @memberof DevContext
         * @instance
         */
        DevContext.prototype.timestampMs = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

        /**
         * DevContext data.
         * @member {string} data
         * @memberof DevContext
         * @instance
         */
        DevContext.prototype.data = '';

        /**
         * Creates a new DevContext instance using the specified properties.
         * @function create
         * @memberof DevContext
         * @static
         * @param {IDevContext=} [properties] Properties to set
         * @returns {DevContext} DevContext instance
         */
        DevContext.create = function create(properties) {
            return new DevContext(properties);
        };

        /**
         * Encodes the specified DevContext message. Does not implicitly {@link DevContext.verify|verify} messages.
         * @function encode
         * @memberof DevContext
         * @static
         * @param {IDevContext} message DevContext message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DevContext.encode = function encode(message, writer) {
            if (!writer) writer = $Writer.create();
            if (message.name != null && Object.hasOwnProperty.call(message, 'name'))
                writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.name);
            if (message.timestampMs != null && Object.hasOwnProperty.call(message, 'timestampMs'))
                writer.uint32(/* id 2, wireType 0 =*/ 16).int64(message.timestampMs);
            if (message.data != null && Object.hasOwnProperty.call(message, 'data'))
                writer.uint32(/* id 3, wireType 2 =*/ 26).string(message.data);
            return writer;
        };

        /**
         * Decodes a DevContext message from the specified reader or buffer.
         * @function decode
         * @memberof DevContext
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {DevContext} DevContext
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DevContext.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length,
                message = new $root.DevContext();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                    case 1: {
                        message.name = reader.string();
                        break;
                    }
                    case 2: {
                        message.timestampMs = reader.int64();
                        break;
                    }
                    case 3: {
                        message.data = reader.string();
                        break;
                    }
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        return DevContext;
    })();

    $root.Cancel = (function () {
        /**
         * Properties of a Cancel.
         * @exports ICancel
         * @interface ICancel
         */

        /**
         * Constructs a new Cancel.
         * @exports Cancel
         * @classdesc Represents a Cancel.
         * @implements ICancel
         * @constructor
         * @param {ICancel=} [properties] Properties to set
         */
        function Cancel(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new Cancel instance using the specified properties.
         * @function create
         * @memberof Cancel
         * @static
         * @param {ICancel=} [properties] Properties to set
         * @returns {Cancel} Cancel instance
         */
        Cancel.create = function create(properties) {
            return new Cancel(properties);
        };

        /**
         * Encodes the specified Cancel message. Does not implicitly {@link Cancel.verify|verify} messages.
         * @function encode
         * @memberof Cancel
         * @static
         * @param {ICancel} message Cancel message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Cancel.encode = function encode(message, writer) {
            if (!writer) writer = $Writer.create();
            return writer;
        };

        /**
         * Decodes a Cancel message from the specified reader or buffer.
         * @function decode
         * @memberof Cancel
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Cancel} Cancel
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Cancel.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length,
                message = new $root.Cancel();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        return Cancel;
    })();

    $root.Mute = (function () {
        /**
         * Properties of a Mute.
         * @exports IMute
         * @interface IMute
         */

        /**
         * Constructs a new Mute.
         * @exports Mute
         * @classdesc Represents a Mute.
         * @implements IMute
         * @constructor
         * @param {IMute=} [properties] Properties to set
         */
        function Mute(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new Mute instance using the specified properties.
         * @function create
         * @memberof Mute
         * @static
         * @param {IMute=} [properties] Properties to set
         * @returns {Mute} Mute instance
         */
        Mute.create = function create(properties) {
            return new Mute(properties);
        };

        /**
         * Encodes the specified Mute message. Does not implicitly {@link Mute.verify|verify} messages.
         * @function encode
         * @memberof Mute
         * @static
         * @param {IMute} message Mute message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Mute.encode = function encode(message, writer) {
            if (!writer) writer = $Writer.create();
            return writer;
        };

        /**
         * Decodes a Mute message from the specified reader or buffer.
         * @function decode
         * @memberof Mute
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Mute} Mute
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Mute.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length,
                message = new $root.Mute();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        return Mute;
    })();

    $root.google = (function () {
        /**
         * Namespace google.
         * @exports google
         * @namespace
         */
        var google = {};

        google.protobuf = (function () {
            /**
             * Namespace protobuf.
             * @memberof google
             * @namespace
             */
            var protobuf = {};

            protobuf.DoubleValue = (function () {
                /**
                 * Properties of a DoubleValue.
                 * @memberof google.protobuf
                 * @interface IDoubleValue
                 * @property {number|null} [value] DoubleValue value
                 */

                /**
                 * Constructs a new DoubleValue.
                 * @memberof google.protobuf
                 * @classdesc Represents a DoubleValue.
                 * @implements IDoubleValue
                 * @constructor
                 * @param {google.protobuf.IDoubleValue=} [properties] Properties to set
                 */
                function DoubleValue(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
                }

                /**
                 * DoubleValue value.
                 * @member {number} value
                 * @memberof google.protobuf.DoubleValue
                 * @instance
                 */
                DoubleValue.prototype.value = 0;

                /**
                 * Creates a new DoubleValue instance using the specified properties.
                 * @function create
                 * @memberof google.protobuf.DoubleValue
                 * @static
                 * @param {google.protobuf.IDoubleValue=} [properties] Properties to set
                 * @returns {google.protobuf.DoubleValue} DoubleValue instance
                 */
                DoubleValue.create = function create(properties) {
                    return new DoubleValue(properties);
                };

                /**
                 * Encodes the specified DoubleValue message. Does not implicitly {@link google.protobuf.DoubleValue.verify|verify} messages.
                 * @function encode
                 * @memberof google.protobuf.DoubleValue
                 * @static
                 * @param {google.protobuf.IDoubleValue} message DoubleValue message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                DoubleValue.encode = function encode(message, writer) {
                    if (!writer) writer = $Writer.create();
                    if (message.value != null && Object.hasOwnProperty.call(message, 'value'))
                        writer.uint32(/* id 1, wireType 1 =*/ 9).double(message.value);
                    return writer;
                };

                /**
                 * Decodes a DoubleValue message from the specified reader or buffer.
                 * @function decode
                 * @memberof google.protobuf.DoubleValue
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.DoubleValue} DoubleValue
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                DoubleValue.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length,
                        message = new $root.google.protobuf.DoubleValue();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                            case 1: {
                                message.value = reader.double();
                                break;
                            }
                            default:
                                reader.skipType(tag & 7);
                                break;
                        }
                    }
                    return message;
                };

                return DoubleValue;
            })();

            protobuf.FloatValue = (function () {
                /**
                 * Properties of a FloatValue.
                 * @memberof google.protobuf
                 * @interface IFloatValue
                 * @property {number|null} [value] FloatValue value
                 */

                /**
                 * Constructs a new FloatValue.
                 * @memberof google.protobuf
                 * @classdesc Represents a FloatValue.
                 * @implements IFloatValue
                 * @constructor
                 * @param {google.protobuf.IFloatValue=} [properties] Properties to set
                 */
                function FloatValue(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
                }

                /**
                 * FloatValue value.
                 * @member {number} value
                 * @memberof google.protobuf.FloatValue
                 * @instance
                 */
                FloatValue.prototype.value = 0;

                /**
                 * Creates a new FloatValue instance using the specified properties.
                 * @function create
                 * @memberof google.protobuf.FloatValue
                 * @static
                 * @param {google.protobuf.IFloatValue=} [properties] Properties to set
                 * @returns {google.protobuf.FloatValue} FloatValue instance
                 */
                FloatValue.create = function create(properties) {
                    return new FloatValue(properties);
                };

                /**
                 * Encodes the specified FloatValue message. Does not implicitly {@link google.protobuf.FloatValue.verify|verify} messages.
                 * @function encode
                 * @memberof google.protobuf.FloatValue
                 * @static
                 * @param {google.protobuf.IFloatValue} message FloatValue message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                FloatValue.encode = function encode(message, writer) {
                    if (!writer) writer = $Writer.create();
                    if (message.value != null && Object.hasOwnProperty.call(message, 'value'))
                        writer.uint32(/* id 1, wireType 5 =*/ 13).float(message.value);
                    return writer;
                };

                /**
                 * Decodes a FloatValue message from the specified reader or buffer.
                 * @function decode
                 * @memberof google.protobuf.FloatValue
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.FloatValue} FloatValue
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                FloatValue.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length,
                        message = new $root.google.protobuf.FloatValue();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                            case 1: {
                                message.value = reader.float();
                                break;
                            }
                            default:
                                reader.skipType(tag & 7);
                                break;
                        }
                    }
                    return message;
                };

                return FloatValue;
            })();

            protobuf.Int64Value = (function () {
                /**
                 * Properties of an Int64Value.
                 * @memberof google.protobuf
                 * @interface IInt64Value
                 * @property {number|Long|null} [value] Int64Value value
                 */

                /**
                 * Constructs a new Int64Value.
                 * @memberof google.protobuf
                 * @classdesc Represents an Int64Value.
                 * @implements IInt64Value
                 * @constructor
                 * @param {google.protobuf.IInt64Value=} [properties] Properties to set
                 */
                function Int64Value(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Int64Value value.
                 * @member {number|Long} value
                 * @memberof google.protobuf.Int64Value
                 * @instance
                 */
                Int64Value.prototype.value = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

                /**
                 * Creates a new Int64Value instance using the specified properties.
                 * @function create
                 * @memberof google.protobuf.Int64Value
                 * @static
                 * @param {google.protobuf.IInt64Value=} [properties] Properties to set
                 * @returns {google.protobuf.Int64Value} Int64Value instance
                 */
                Int64Value.create = function create(properties) {
                    return new Int64Value(properties);
                };

                /**
                 * Encodes the specified Int64Value message. Does not implicitly {@link google.protobuf.Int64Value.verify|verify} messages.
                 * @function encode
                 * @memberof google.protobuf.Int64Value
                 * @static
                 * @param {google.protobuf.IInt64Value} message Int64Value message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Int64Value.encode = function encode(message, writer) {
                    if (!writer) writer = $Writer.create();
                    if (message.value != null && Object.hasOwnProperty.call(message, 'value'))
                        writer.uint32(/* id 1, wireType 0 =*/ 8).int64(message.value);
                    return writer;
                };

                /**
                 * Decodes an Int64Value message from the specified reader or buffer.
                 * @function decode
                 * @memberof google.protobuf.Int64Value
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.Int64Value} Int64Value
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Int64Value.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length,
                        message = new $root.google.protobuf.Int64Value();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                            case 1: {
                                message.value = reader.int64();
                                break;
                            }
                            default:
                                reader.skipType(tag & 7);
                                break;
                        }
                    }
                    return message;
                };

                return Int64Value;
            })();

            protobuf.UInt64Value = (function () {
                /**
                 * Properties of a UInt64Value.
                 * @memberof google.protobuf
                 * @interface IUInt64Value
                 * @property {number|Long|null} [value] UInt64Value value
                 */

                /**
                 * Constructs a new UInt64Value.
                 * @memberof google.protobuf
                 * @classdesc Represents a UInt64Value.
                 * @implements IUInt64Value
                 * @constructor
                 * @param {google.protobuf.IUInt64Value=} [properties] Properties to set
                 */
                function UInt64Value(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
                }

                /**
                 * UInt64Value value.
                 * @member {number|Long} value
                 * @memberof google.protobuf.UInt64Value
                 * @instance
                 */
                UInt64Value.prototype.value = $util.Long ? $util.Long.fromBits(0, 0, true) : 0;

                /**
                 * Creates a new UInt64Value instance using the specified properties.
                 * @function create
                 * @memberof google.protobuf.UInt64Value
                 * @static
                 * @param {google.protobuf.IUInt64Value=} [properties] Properties to set
                 * @returns {google.protobuf.UInt64Value} UInt64Value instance
                 */
                UInt64Value.create = function create(properties) {
                    return new UInt64Value(properties);
                };

                /**
                 * Encodes the specified UInt64Value message. Does not implicitly {@link google.protobuf.UInt64Value.verify|verify} messages.
                 * @function encode
                 * @memberof google.protobuf.UInt64Value
                 * @static
                 * @param {google.protobuf.IUInt64Value} message UInt64Value message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                UInt64Value.encode = function encode(message, writer) {
                    if (!writer) writer = $Writer.create();
                    if (message.value != null && Object.hasOwnProperty.call(message, 'value'))
                        writer.uint32(/* id 1, wireType 0 =*/ 8).uint64(message.value);
                    return writer;
                };

                /**
                 * Decodes a UInt64Value message from the specified reader or buffer.
                 * @function decode
                 * @memberof google.protobuf.UInt64Value
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.UInt64Value} UInt64Value
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                UInt64Value.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length,
                        message = new $root.google.protobuf.UInt64Value();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                            case 1: {
                                message.value = reader.uint64();
                                break;
                            }
                            default:
                                reader.skipType(tag & 7);
                                break;
                        }
                    }
                    return message;
                };

                return UInt64Value;
            })();

            protobuf.Int32Value = (function () {
                /**
                 * Properties of an Int32Value.
                 * @memberof google.protobuf
                 * @interface IInt32Value
                 * @property {number|null} [value] Int32Value value
                 */

                /**
                 * Constructs a new Int32Value.
                 * @memberof google.protobuf
                 * @classdesc Represents an Int32Value.
                 * @implements IInt32Value
                 * @constructor
                 * @param {google.protobuf.IInt32Value=} [properties] Properties to set
                 */
                function Int32Value(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Int32Value value.
                 * @member {number} value
                 * @memberof google.protobuf.Int32Value
                 * @instance
                 */
                Int32Value.prototype.value = 0;

                /**
                 * Creates a new Int32Value instance using the specified properties.
                 * @function create
                 * @memberof google.protobuf.Int32Value
                 * @static
                 * @param {google.protobuf.IInt32Value=} [properties] Properties to set
                 * @returns {google.protobuf.Int32Value} Int32Value instance
                 */
                Int32Value.create = function create(properties) {
                    return new Int32Value(properties);
                };

                /**
                 * Encodes the specified Int32Value message. Does not implicitly {@link google.protobuf.Int32Value.verify|verify} messages.
                 * @function encode
                 * @memberof google.protobuf.Int32Value
                 * @static
                 * @param {google.protobuf.IInt32Value} message Int32Value message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Int32Value.encode = function encode(message, writer) {
                    if (!writer) writer = $Writer.create();
                    if (message.value != null && Object.hasOwnProperty.call(message, 'value'))
                        writer.uint32(/* id 1, wireType 0 =*/ 8).int32(message.value);
                    return writer;
                };

                /**
                 * Decodes an Int32Value message from the specified reader or buffer.
                 * @function decode
                 * @memberof google.protobuf.Int32Value
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.Int32Value} Int32Value
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Int32Value.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length,
                        message = new $root.google.protobuf.Int32Value();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                            case 1: {
                                message.value = reader.int32();
                                break;
                            }
                            default:
                                reader.skipType(tag & 7);
                                break;
                        }
                    }
                    return message;
                };

                return Int32Value;
            })();

            protobuf.UInt32Value = (function () {
                /**
                 * Properties of a UInt32Value.
                 * @memberof google.protobuf
                 * @interface IUInt32Value
                 * @property {number|null} [value] UInt32Value value
                 */

                /**
                 * Constructs a new UInt32Value.
                 * @memberof google.protobuf
                 * @classdesc Represents a UInt32Value.
                 * @implements IUInt32Value
                 * @constructor
                 * @param {google.protobuf.IUInt32Value=} [properties] Properties to set
                 */
                function UInt32Value(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
                }

                /**
                 * UInt32Value value.
                 * @member {number} value
                 * @memberof google.protobuf.UInt32Value
                 * @instance
                 */
                UInt32Value.prototype.value = 0;

                /**
                 * Creates a new UInt32Value instance using the specified properties.
                 * @function create
                 * @memberof google.protobuf.UInt32Value
                 * @static
                 * @param {google.protobuf.IUInt32Value=} [properties] Properties to set
                 * @returns {google.protobuf.UInt32Value} UInt32Value instance
                 */
                UInt32Value.create = function create(properties) {
                    return new UInt32Value(properties);
                };

                /**
                 * Encodes the specified UInt32Value message. Does not implicitly {@link google.protobuf.UInt32Value.verify|verify} messages.
                 * @function encode
                 * @memberof google.protobuf.UInt32Value
                 * @static
                 * @param {google.protobuf.IUInt32Value} message UInt32Value message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                UInt32Value.encode = function encode(message, writer) {
                    if (!writer) writer = $Writer.create();
                    if (message.value != null && Object.hasOwnProperty.call(message, 'value'))
                        writer.uint32(/* id 1, wireType 0 =*/ 8).uint32(message.value);
                    return writer;
                };

                /**
                 * Decodes a UInt32Value message from the specified reader or buffer.
                 * @function decode
                 * @memberof google.protobuf.UInt32Value
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.UInt32Value} UInt32Value
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                UInt32Value.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length,
                        message = new $root.google.protobuf.UInt32Value();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                            case 1: {
                                message.value = reader.uint32();
                                break;
                            }
                            default:
                                reader.skipType(tag & 7);
                                break;
                        }
                    }
                    return message;
                };

                return UInt32Value;
            })();

            protobuf.BoolValue = (function () {
                /**
                 * Properties of a BoolValue.
                 * @memberof google.protobuf
                 * @interface IBoolValue
                 * @property {boolean|null} [value] BoolValue value
                 */

                /**
                 * Constructs a new BoolValue.
                 * @memberof google.protobuf
                 * @classdesc Represents a BoolValue.
                 * @implements IBoolValue
                 * @constructor
                 * @param {google.protobuf.IBoolValue=} [properties] Properties to set
                 */
                function BoolValue(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
                }

                /**
                 * BoolValue value.
                 * @member {boolean} value
                 * @memberof google.protobuf.BoolValue
                 * @instance
                 */
                BoolValue.prototype.value = false;

                /**
                 * Creates a new BoolValue instance using the specified properties.
                 * @function create
                 * @memberof google.protobuf.BoolValue
                 * @static
                 * @param {google.protobuf.IBoolValue=} [properties] Properties to set
                 * @returns {google.protobuf.BoolValue} BoolValue instance
                 */
                BoolValue.create = function create(properties) {
                    return new BoolValue(properties);
                };

                /**
                 * Encodes the specified BoolValue message. Does not implicitly {@link google.protobuf.BoolValue.verify|verify} messages.
                 * @function encode
                 * @memberof google.protobuf.BoolValue
                 * @static
                 * @param {google.protobuf.IBoolValue} message BoolValue message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                BoolValue.encode = function encode(message, writer) {
                    if (!writer) writer = $Writer.create();
                    if (message.value != null && Object.hasOwnProperty.call(message, 'value'))
                        writer.uint32(/* id 1, wireType 0 =*/ 8).bool(message.value);
                    return writer;
                };

                /**
                 * Decodes a BoolValue message from the specified reader or buffer.
                 * @function decode
                 * @memberof google.protobuf.BoolValue
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.BoolValue} BoolValue
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                BoolValue.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length,
                        message = new $root.google.protobuf.BoolValue();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                            case 1: {
                                message.value = reader.bool();
                                break;
                            }
                            default:
                                reader.skipType(tag & 7);
                                break;
                        }
                    }
                    return message;
                };

                return BoolValue;
            })();

            protobuf.StringValue = (function () {
                /**
                 * Properties of a StringValue.
                 * @memberof google.protobuf
                 * @interface IStringValue
                 * @property {string|null} [value] StringValue value
                 */

                /**
                 * Constructs a new StringValue.
                 * @memberof google.protobuf
                 * @classdesc Represents a StringValue.
                 * @implements IStringValue
                 * @constructor
                 * @param {google.protobuf.IStringValue=} [properties] Properties to set
                 */
                function StringValue(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
                }

                /**
                 * StringValue value.
                 * @member {string} value
                 * @memberof google.protobuf.StringValue
                 * @instance
                 */
                StringValue.prototype.value = '';

                /**
                 * Creates a new StringValue instance using the specified properties.
                 * @function create
                 * @memberof google.protobuf.StringValue
                 * @static
                 * @param {google.protobuf.IStringValue=} [properties] Properties to set
                 * @returns {google.protobuf.StringValue} StringValue instance
                 */
                StringValue.create = function create(properties) {
                    return new StringValue(properties);
                };

                /**
                 * Encodes the specified StringValue message. Does not implicitly {@link google.protobuf.StringValue.verify|verify} messages.
                 * @function encode
                 * @memberof google.protobuf.StringValue
                 * @static
                 * @param {google.protobuf.IStringValue} message StringValue message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                StringValue.encode = function encode(message, writer) {
                    if (!writer) writer = $Writer.create();
                    if (message.value != null && Object.hasOwnProperty.call(message, 'value'))
                        writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.value);
                    return writer;
                };

                /**
                 * Decodes a StringValue message from the specified reader or buffer.
                 * @function decode
                 * @memberof google.protobuf.StringValue
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.StringValue} StringValue
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                StringValue.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length,
                        message = new $root.google.protobuf.StringValue();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                            case 1: {
                                message.value = reader.string();
                                break;
                            }
                            default:
                                reader.skipType(tag & 7);
                                break;
                        }
                    }
                    return message;
                };

                return StringValue;
            })();

            protobuf.BytesValue = (function () {
                /**
                 * Properties of a BytesValue.
                 * @memberof google.protobuf
                 * @interface IBytesValue
                 * @property {Uint8Array|null} [value] BytesValue value
                 */

                /**
                 * Constructs a new BytesValue.
                 * @memberof google.protobuf
                 * @classdesc Represents a BytesValue.
                 * @implements IBytesValue
                 * @constructor
                 * @param {google.protobuf.IBytesValue=} [properties] Properties to set
                 */
                function BytesValue(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
                }

                /**
                 * BytesValue value.
                 * @member {Uint8Array} value
                 * @memberof google.protobuf.BytesValue
                 * @instance
                 */
                BytesValue.prototype.value = $util.newBuffer([]);

                /**
                 * Creates a new BytesValue instance using the specified properties.
                 * @function create
                 * @memberof google.protobuf.BytesValue
                 * @static
                 * @param {google.protobuf.IBytesValue=} [properties] Properties to set
                 * @returns {google.protobuf.BytesValue} BytesValue instance
                 */
                BytesValue.create = function create(properties) {
                    return new BytesValue(properties);
                };

                /**
                 * Encodes the specified BytesValue message. Does not implicitly {@link google.protobuf.BytesValue.verify|verify} messages.
                 * @function encode
                 * @memberof google.protobuf.BytesValue
                 * @static
                 * @param {google.protobuf.IBytesValue} message BytesValue message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                BytesValue.encode = function encode(message, writer) {
                    if (!writer) writer = $Writer.create();
                    if (message.value != null && Object.hasOwnProperty.call(message, 'value'))
                        writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.value);
                    return writer;
                };

                /**
                 * Decodes a BytesValue message from the specified reader or buffer.
                 * @function decode
                 * @memberof google.protobuf.BytesValue
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.BytesValue} BytesValue
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                BytesValue.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length,
                        message = new $root.google.protobuf.BytesValue();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                            case 1: {
                                message.value = reader.bytes();
                                break;
                            }
                            default:
                                reader.skipType(tag & 7);
                                break;
                        }
                    }
                    return message;
                };

                return BytesValue;
            })();

            return protobuf;
        })();

        return google;
    })();

    return $root;
});
