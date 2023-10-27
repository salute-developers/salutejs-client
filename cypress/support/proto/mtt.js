/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
(function(global, factory) { /* global define, require, module */

    /* AMD */ if (typeof define === 'function' && define.amd)
        define(["protobufjs/minimal"], factory);

    /* CommonJS */ else if (typeof require === 'function' && typeof module === 'object' && module && module.exports)
        module.exports = factory(require("protobufjs/minimal"));

})(this, function($protobuf) {
    "use strict";

    // Common aliases
    var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
    
    // Exported root namespace
    var $root = $protobuf.roots.cypbroot || ($protobuf.roots.cypbroot = {});
    
    $root.Music2TrackProtocol = (function() {
    
        /**
         * Namespace Music2TrackProtocol.
         * @exports Music2TrackProtocol
         * @namespace
         */
        var Music2TrackProtocol = {};
    
        Music2TrackProtocol.DecoderResult = (function() {
    
            /**
             * Properties of a DecoderResult.
             * @memberof Music2TrackProtocol
             * @interface IDecoderResult
             * @property {string|null} [result] DecoderResult result
             * @property {boolean|null} [isMusicFound] DecoderResult isMusicFound
             * @property {boolean|null} [isFinal] DecoderResult isFinal
             */
    
            /**
             * Constructs a new DecoderResult.
             * @memberof Music2TrackProtocol
             * @classdesc Represents a DecoderResult.
             * @implements IDecoderResult
             * @constructor
             * @param {Music2TrackProtocol.IDecoderResult=} [properties] Properties to set
             */
            function DecoderResult(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * DecoderResult result.
             * @member {string} result
             * @memberof Music2TrackProtocol.DecoderResult
             * @instance
             */
            DecoderResult.prototype.result = "";
    
            /**
             * DecoderResult isMusicFound.
             * @member {boolean} isMusicFound
             * @memberof Music2TrackProtocol.DecoderResult
             * @instance
             */
            DecoderResult.prototype.isMusicFound = false;
    
            /**
             * DecoderResult isFinal.
             * @member {boolean} isFinal
             * @memberof Music2TrackProtocol.DecoderResult
             * @instance
             */
            DecoderResult.prototype.isFinal = false;
    
            /**
             * Encodes the specified DecoderResult message. Does not implicitly {@link Music2TrackProtocol.DecoderResult.verify|verify} messages.
             * @function encode
             * @memberof Music2TrackProtocol.DecoderResult
             * @static
             * @param {Music2TrackProtocol.IDecoderResult} message DecoderResult message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DecoderResult.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.result != null && Object.hasOwnProperty.call(message, "result"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.result);
                if (message.isMusicFound != null && Object.hasOwnProperty.call(message, "isMusicFound"))
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.isMusicFound);
                if (message.isFinal != null && Object.hasOwnProperty.call(message, "isFinal"))
                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.isFinal);
                return writer;
            };
    
            /**
             * Decodes a DecoderResult message from the specified reader or buffer.
             * @function decode
             * @memberof Music2TrackProtocol.DecoderResult
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {Music2TrackProtocol.DecoderResult} DecoderResult
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DecoderResult.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Music2TrackProtocol.DecoderResult();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.result = reader.string();
                            break;
                        }
                    case 2: {
                            message.isMusicFound = reader.bool();
                            break;
                        }
                    case 3: {
                            message.isFinal = reader.bool();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            return DecoderResult;
        })();
    
        Music2TrackProtocol.ErrorResponse = (function() {
    
            /**
             * Properties of an ErrorResponse.
             * @memberof Music2TrackProtocol
             * @interface IErrorResponse
             * @property {string|null} [errorMessage] ErrorResponse errorMessage
             * @property {number|null} [errorCode] ErrorResponse errorCode
             */
    
            /**
             * Constructs a new ErrorResponse.
             * @memberof Music2TrackProtocol
             * @classdesc Represents an ErrorResponse.
             * @implements IErrorResponse
             * @constructor
             * @param {Music2TrackProtocol.IErrorResponse=} [properties] Properties to set
             */
            function ErrorResponse(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * ErrorResponse errorMessage.
             * @member {string} errorMessage
             * @memberof Music2TrackProtocol.ErrorResponse
             * @instance
             */
            ErrorResponse.prototype.errorMessage = "";
    
            /**
             * ErrorResponse errorCode.
             * @member {number} errorCode
             * @memberof Music2TrackProtocol.ErrorResponse
             * @instance
             */
            ErrorResponse.prototype.errorCode = 0;
    
            /**
             * Encodes the specified ErrorResponse message. Does not implicitly {@link Music2TrackProtocol.ErrorResponse.verify|verify} messages.
             * @function encode
             * @memberof Music2TrackProtocol.ErrorResponse
             * @static
             * @param {Music2TrackProtocol.IErrorResponse} message ErrorResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ErrorResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.errorMessage != null && Object.hasOwnProperty.call(message, "errorMessage"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.errorMessage);
                if (message.errorCode != null && Object.hasOwnProperty.call(message, "errorCode"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.errorCode);
                return writer;
            };
    
            /**
             * Decodes an ErrorResponse message from the specified reader or buffer.
             * @function decode
             * @memberof Music2TrackProtocol.ErrorResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {Music2TrackProtocol.ErrorResponse} ErrorResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ErrorResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Music2TrackProtocol.ErrorResponse();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.errorMessage = reader.string();
                            break;
                        }
                    case 2: {
                            message.errorCode = reader.int32();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            return ErrorResponse;
        })();
    
        Music2TrackProtocol.MttResponse = (function() {
    
            /**
             * Properties of a MttResponse.
             * @memberof Music2TrackProtocol
             * @interface IMttResponse
             * @property {Music2TrackProtocol.IDecoderResult|null} [decoderResultField] MttResponse decoderResultField
             * @property {Music2TrackProtocol.IErrorResponse|null} [errorResponse] MttResponse errorResponse
             */
    
            /**
             * Constructs a new MttResponse.
             * @memberof Music2TrackProtocol
             * @classdesc Represents a MttResponse.
             * @implements IMttResponse
             * @constructor
             * @param {Music2TrackProtocol.IMttResponse=} [properties] Properties to set
             */
            function MttResponse(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * MttResponse decoderResultField.
             * @member {Music2TrackProtocol.IDecoderResult|null|undefined} decoderResultField
             * @memberof Music2TrackProtocol.MttResponse
             * @instance
             */
            MttResponse.prototype.decoderResultField = null;
    
            /**
             * MttResponse errorResponse.
             * @member {Music2TrackProtocol.IErrorResponse|null|undefined} errorResponse
             * @memberof Music2TrackProtocol.MttResponse
             * @instance
             */
            MttResponse.prototype.errorResponse = null;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * MttResponse MessageType.
             * @member {"decoderResultField"|"errorResponse"|undefined} MessageType
             * @memberof Music2TrackProtocol.MttResponse
             * @instance
             */
            Object.defineProperty(MttResponse.prototype, "MessageType", {
                get: $util.oneOfGetter($oneOfFields = ["decoderResultField", "errorResponse"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Encodes the specified MttResponse message. Does not implicitly {@link Music2TrackProtocol.MttResponse.verify|verify} messages.
             * @function encode
             * @memberof Music2TrackProtocol.MttResponse
             * @static
             * @param {Music2TrackProtocol.IMttResponse} message MttResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MttResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.decoderResultField != null && Object.hasOwnProperty.call(message, "decoderResultField"))
                    $root.Music2TrackProtocol.DecoderResult.encode(message.decoderResultField, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.errorResponse != null && Object.hasOwnProperty.call(message, "errorResponse"))
                    $root.Music2TrackProtocol.ErrorResponse.encode(message.errorResponse, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };
    
            /**
             * Decodes a MttResponse message from the specified reader or buffer.
             * @function decode
             * @memberof Music2TrackProtocol.MttResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {Music2TrackProtocol.MttResponse} MttResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MttResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Music2TrackProtocol.MttResponse();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.decoderResultField = $root.Music2TrackProtocol.DecoderResult.decode(reader, reader.uint32());
                            break;
                        }
                    case 2: {
                            message.errorResponse = $root.Music2TrackProtocol.ErrorResponse.decode(reader, reader.uint32());
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            return MttResponse;
        })();
    
        return Music2TrackProtocol;
    })();

    return $root;
});
