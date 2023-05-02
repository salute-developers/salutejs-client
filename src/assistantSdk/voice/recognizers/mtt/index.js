/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
(function(global, factory) { /* global define, require, module */

    /* AMD */ if (typeof define === 'function' && define.amd)
        define(["protobufjs/minimal"], factory);

    /* CommonJS */ else if (typeof require === 'function' && typeof module === 'object' && module && module.exports)
        module.exports = factory(require("protobufjs/minimal"));

})(this, function($protobuf) {
    "use strict";

    // Common aliases
    var $Reader = $protobuf.Reader, $util = $protobuf.util;
    
    // Exported root namespace
    var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});
    
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
