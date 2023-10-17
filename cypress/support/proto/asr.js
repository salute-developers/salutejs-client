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
    
    $root.Variables = (function() {
    
        /**
         * Properties of a Variables.
         * @exports IVariables
         * @interface IVariables
         * @property {Object.<string,string>|null} [variables] Variables variables
         */
    
        /**
         * Constructs a new Variables.
         * @exports Variables
         * @classdesc Represents a Variables.
         * @implements IVariables
         * @constructor
         * @param {IVariables=} [properties] Properties to set
         */
        function Variables(properties) {
            this.variables = {};
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * Variables variables.
         * @member {Object.<string,string>} variables
         * @memberof Variables
         * @instance
         */
        Variables.prototype.variables = $util.emptyObject;
    
        /**
         * Encodes the specified Variables message. Does not implicitly {@link Variables.verify|verify} messages.
         * @function encode
         * @memberof Variables
         * @static
         * @param {IVariables} message Variables message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Variables.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.variables != null && Object.hasOwnProperty.call(message, "variables"))
                for (var keys = Object.keys(message.variables), i = 0; i < keys.length; ++i)
                    writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.variables[keys[i]]).ldelim();
            return writer;
        };
    
        /**
         * Decodes a Variables message from the specified reader or buffer.
         * @function decode
         * @memberof Variables
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Variables} Variables
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Variables.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Variables(), key, value;
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (message.variables === $util.emptyObject)
                            message.variables = {};
                        var end2 = reader.uint32() + reader.pos;
                        key = "";
                        value = "";
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
                        message.variables[key] = value;
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        return Variables;
    })();
    
    $root.UndecodedSeconds = (function() {
    
        /**
         * Properties of an UndecodedSeconds.
         * @exports IUndecodedSeconds
         * @interface IUndecodedSeconds
         * @property {number|null} [undecodedSeconds] UndecodedSeconds undecodedSeconds
         */
    
        /**
         * Constructs a new UndecodedSeconds.
         * @exports UndecodedSeconds
         * @classdesc Represents an UndecodedSeconds.
         * @implements IUndecodedSeconds
         * @constructor
         * @param {IUndecodedSeconds=} [properties] Properties to set
         */
        function UndecodedSeconds(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * UndecodedSeconds undecodedSeconds.
         * @member {number} undecodedSeconds
         * @memberof UndecodedSeconds
         * @instance
         */
        UndecodedSeconds.prototype.undecodedSeconds = 0;
    
        /**
         * Encodes the specified UndecodedSeconds message. Does not implicitly {@link UndecodedSeconds.verify|verify} messages.
         * @function encode
         * @memberof UndecodedSeconds
         * @static
         * @param {IUndecodedSeconds} message UndecodedSeconds message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UndecodedSeconds.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.undecodedSeconds != null && Object.hasOwnProperty.call(message, "undecodedSeconds"))
                writer.uint32(/* id 1, wireType 5 =*/13).float(message.undecodedSeconds);
            return writer;
        };
    
        /**
         * Decodes an UndecodedSeconds message from the specified reader or buffer.
         * @function decode
         * @memberof UndecodedSeconds
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {UndecodedSeconds} UndecodedSeconds
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UndecodedSeconds.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.UndecodedSeconds();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.undecodedSeconds = reader.float();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        return UndecodedSeconds;
    })();
    
    $root.FullyFinalized = (function() {
    
        /**
         * Properties of a FullyFinalized.
         * @exports IFullyFinalized
         * @interface IFullyFinalized
         */
    
        /**
         * Constructs a new FullyFinalized.
         * @exports FullyFinalized
         * @classdesc Represents a FullyFinalized.
         * @implements IFullyFinalized
         * @constructor
         * @param {IFullyFinalized=} [properties] Properties to set
         */
        function FullyFinalized(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * Encodes the specified FullyFinalized message. Does not implicitly {@link FullyFinalized.verify|verify} messages.
         * @function encode
         * @memberof FullyFinalized
         * @static
         * @param {IFullyFinalized} message FullyFinalized message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FullyFinalized.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };
    
        /**
         * Decodes a FullyFinalized message from the specified reader or buffer.
         * @function decode
         * @memberof FullyFinalized
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {FullyFinalized} FullyFinalized
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FullyFinalized.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.FullyFinalized();
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
    
        return FullyFinalized;
    })();
    
    $root.EmotionResult = (function() {
    
        /**
         * Properties of an EmotionResult.
         * @exports IEmotionResult
         * @interface IEmotionResult
         * @property {string|null} [name] EmotionResult name
         * @property {number|null} [confidence] EmotionResult confidence
         */
    
        /**
         * Constructs a new EmotionResult.
         * @exports EmotionResult
         * @classdesc Represents an EmotionResult.
         * @implements IEmotionResult
         * @constructor
         * @param {IEmotionResult=} [properties] Properties to set
         */
        function EmotionResult(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * EmotionResult name.
         * @member {string} name
         * @memberof EmotionResult
         * @instance
         */
        EmotionResult.prototype.name = "";
    
        /**
         * EmotionResult confidence.
         * @member {number} confidence
         * @memberof EmotionResult
         * @instance
         */
        EmotionResult.prototype.confidence = 0;
    
        /**
         * Encodes the specified EmotionResult message. Does not implicitly {@link EmotionResult.verify|verify} messages.
         * @function encode
         * @memberof EmotionResult
         * @static
         * @param {IEmotionResult} message EmotionResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EmotionResult.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            if (message.confidence != null && Object.hasOwnProperty.call(message, "confidence"))
                writer.uint32(/* id 2, wireType 5 =*/21).float(message.confidence);
            return writer;
        };
    
        /**
         * Decodes an EmotionResult message from the specified reader or buffer.
         * @function decode
         * @memberof EmotionResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {EmotionResult} EmotionResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EmotionResult.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.EmotionResult();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.name = reader.string();
                        break;
                    }
                case 2: {
                        message.confidence = reader.float();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        return EmotionResult;
    })();
    
    $root.Hypothesis = (function() {
    
        /**
         * Properties of a Hypothesis.
         * @exports IHypothesis
         * @interface IHypothesis
         * @property {string|null} [words] Hypothesis words
         * @property {number|null} [acousticCost] Hypothesis acousticCost
         * @property {number|null} [linguisticCost] Hypothesis linguisticCost
         * @property {number|null} [finalCost] Hypothesis finalCost
         * @property {number|null} [phraseStart] Hypothesis phraseStart
         * @property {number|null} [phraseEnd] Hypothesis phraseEnd
         * @property {string|null} [normalizedText] Hypothesis normalizedText
         */
    
        /**
         * Constructs a new Hypothesis.
         * @exports Hypothesis
         * @classdesc Represents a Hypothesis.
         * @implements IHypothesis
         * @constructor
         * @param {IHypothesis=} [properties] Properties to set
         */
        function Hypothesis(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * Hypothesis words.
         * @member {string} words
         * @memberof Hypothesis
         * @instance
         */
        Hypothesis.prototype.words = "";
    
        /**
         * Hypothesis acousticCost.
         * @member {number} acousticCost
         * @memberof Hypothesis
         * @instance
         */
        Hypothesis.prototype.acousticCost = 0;
    
        /**
         * Hypothesis linguisticCost.
         * @member {number} linguisticCost
         * @memberof Hypothesis
         * @instance
         */
        Hypothesis.prototype.linguisticCost = 0;
    
        /**
         * Hypothesis finalCost.
         * @member {number} finalCost
         * @memberof Hypothesis
         * @instance
         */
        Hypothesis.prototype.finalCost = 0;
    
        /**
         * Hypothesis phraseStart.
         * @member {number} phraseStart
         * @memberof Hypothesis
         * @instance
         */
        Hypothesis.prototype.phraseStart = 0;
    
        /**
         * Hypothesis phraseEnd.
         * @member {number} phraseEnd
         * @memberof Hypothesis
         * @instance
         */
        Hypothesis.prototype.phraseEnd = 0;
    
        /**
         * Hypothesis normalizedText.
         * @member {string} normalizedText
         * @memberof Hypothesis
         * @instance
         */
        Hypothesis.prototype.normalizedText = "";
    
        /**
         * Encodes the specified Hypothesis message. Does not implicitly {@link Hypothesis.verify|verify} messages.
         * @function encode
         * @memberof Hypothesis
         * @static
         * @param {IHypothesis} message Hypothesis message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Hypothesis.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.words != null && Object.hasOwnProperty.call(message, "words"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.words);
            if (message.acousticCost != null && Object.hasOwnProperty.call(message, "acousticCost"))
                writer.uint32(/* id 2, wireType 5 =*/21).float(message.acousticCost);
            if (message.linguisticCost != null && Object.hasOwnProperty.call(message, "linguisticCost"))
                writer.uint32(/* id 3, wireType 5 =*/29).float(message.linguisticCost);
            if (message.finalCost != null && Object.hasOwnProperty.call(message, "finalCost"))
                writer.uint32(/* id 4, wireType 5 =*/37).float(message.finalCost);
            if (message.phraseStart != null && Object.hasOwnProperty.call(message, "phraseStart"))
                writer.uint32(/* id 5, wireType 5 =*/45).float(message.phraseStart);
            if (message.phraseEnd != null && Object.hasOwnProperty.call(message, "phraseEnd"))
                writer.uint32(/* id 6, wireType 5 =*/53).float(message.phraseEnd);
            if (message.normalizedText != null && Object.hasOwnProperty.call(message, "normalizedText"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.normalizedText);
            return writer;
        };
    
        /**
         * Decodes a Hypothesis message from the specified reader or buffer.
         * @function decode
         * @memberof Hypothesis
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Hypothesis} Hypothesis
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Hypothesis.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Hypothesis();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.words = reader.string();
                        break;
                    }
                case 2: {
                        message.acousticCost = reader.float();
                        break;
                    }
                case 3: {
                        message.linguisticCost = reader.float();
                        break;
                    }
                case 4: {
                        message.finalCost = reader.float();
                        break;
                    }
                case 5: {
                        message.phraseStart = reader.float();
                        break;
                    }
                case 6: {
                        message.phraseEnd = reader.float();
                        break;
                    }
                case 7: {
                        message.normalizedText = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        return Hypothesis;
    })();
    
    $root.DecoderResult = (function() {
    
        /**
         * Properties of a DecoderResult.
         * @exports IDecoderResult
         * @interface IDecoderResult
         * @property {Array.<IHypothesis>|null} [hypothesis] DecoderResult hypothesis
         * @property {number|null} [chunkStart] DecoderResult chunkStart
         * @property {number|null} [chunkEnd] DecoderResult chunkEnd
         * @property {number|null} [timeEndpointDetectionMs] DecoderResult timeEndpointDetectionMs
         * @property {number|null} [timeDecodingMs] DecoderResult timeDecodingMs
         * @property {IVariables|null} [variables] DecoderResult variables
         * @property {boolean|null} [isFinal] DecoderResult isFinal
         * @property {Array.<IEmotionResult>|null} [emotionResult] DecoderResult emotionResult
         * @property {Array.<DecoderResult.IContextAnswer>|null} [contextAnswer] DecoderResult contextAnswer
         */
    
        /**
         * Constructs a new DecoderResult.
         * @exports DecoderResult
         * @classdesc Represents a DecoderResult.
         * @implements IDecoderResult
         * @constructor
         * @param {IDecoderResult=} [properties] Properties to set
         */
        function DecoderResult(properties) {
            this.hypothesis = [];
            this.emotionResult = [];
            this.contextAnswer = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * DecoderResult hypothesis.
         * @member {Array.<IHypothesis>} hypothesis
         * @memberof DecoderResult
         * @instance
         */
        DecoderResult.prototype.hypothesis = $util.emptyArray;
    
        /**
         * DecoderResult chunkStart.
         * @member {number} chunkStart
         * @memberof DecoderResult
         * @instance
         */
        DecoderResult.prototype.chunkStart = 0;
    
        /**
         * DecoderResult chunkEnd.
         * @member {number} chunkEnd
         * @memberof DecoderResult
         * @instance
         */
        DecoderResult.prototype.chunkEnd = 0;
    
        /**
         * DecoderResult timeEndpointDetectionMs.
         * @member {number} timeEndpointDetectionMs
         * @memberof DecoderResult
         * @instance
         */
        DecoderResult.prototype.timeEndpointDetectionMs = 0;
    
        /**
         * DecoderResult timeDecodingMs.
         * @member {number} timeDecodingMs
         * @memberof DecoderResult
         * @instance
         */
        DecoderResult.prototype.timeDecodingMs = 0;
    
        /**
         * DecoderResult variables.
         * @member {IVariables|null|undefined} variables
         * @memberof DecoderResult
         * @instance
         */
        DecoderResult.prototype.variables = null;
    
        /**
         * DecoderResult isFinal.
         * @member {boolean} isFinal
         * @memberof DecoderResult
         * @instance
         */
        DecoderResult.prototype.isFinal = false;
    
        /**
         * DecoderResult emotionResult.
         * @member {Array.<IEmotionResult>} emotionResult
         * @memberof DecoderResult
         * @instance
         */
        DecoderResult.prototype.emotionResult = $util.emptyArray;
    
        /**
         * DecoderResult contextAnswer.
         * @member {Array.<DecoderResult.IContextAnswer>} contextAnswer
         * @memberof DecoderResult
         * @instance
         */
        DecoderResult.prototype.contextAnswer = $util.emptyArray;
    
        /**
         * Encodes the specified DecoderResult message. Does not implicitly {@link DecoderResult.verify|verify} messages.
         * @function encode
         * @memberof DecoderResult
         * @static
         * @param {IDecoderResult} message DecoderResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DecoderResult.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.hypothesis != null && message.hypothesis.length)
                for (var i = 0; i < message.hypothesis.length; ++i)
                    $root.Hypothesis.encode(message.hypothesis[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.chunkStart != null && Object.hasOwnProperty.call(message, "chunkStart"))
                writer.uint32(/* id 2, wireType 5 =*/21).float(message.chunkStart);
            if (message.chunkEnd != null && Object.hasOwnProperty.call(message, "chunkEnd"))
                writer.uint32(/* id 3, wireType 5 =*/29).float(message.chunkEnd);
            if (message.timeEndpointDetectionMs != null && Object.hasOwnProperty.call(message, "timeEndpointDetectionMs"))
                writer.uint32(/* id 4, wireType 5 =*/37).float(message.timeEndpointDetectionMs);
            if (message.timeDecodingMs != null && Object.hasOwnProperty.call(message, "timeDecodingMs"))
                writer.uint32(/* id 5, wireType 5 =*/45).float(message.timeDecodingMs);
            if (message.variables != null && Object.hasOwnProperty.call(message, "variables"))
                $root.Variables.encode(message.variables, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.isFinal != null && Object.hasOwnProperty.call(message, "isFinal"))
                writer.uint32(/* id 7, wireType 0 =*/56).bool(message.isFinal);
            if (message.emotionResult != null && message.emotionResult.length)
                for (var i = 0; i < message.emotionResult.length; ++i)
                    $root.EmotionResult.encode(message.emotionResult[i], writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.contextAnswer != null && message.contextAnswer.length)
                for (var i = 0; i < message.contextAnswer.length; ++i)
                    $root.DecoderResult.ContextAnswer.encode(message.contextAnswer[i], writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
            return writer;
        };
    
        /**
         * Decodes a DecoderResult message from the specified reader or buffer.
         * @function decode
         * @memberof DecoderResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {DecoderResult} DecoderResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DecoderResult.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.DecoderResult();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.hypothesis && message.hypothesis.length))
                            message.hypothesis = [];
                        message.hypothesis.push($root.Hypothesis.decode(reader, reader.uint32()));
                        break;
                    }
                case 2: {
                        message.chunkStart = reader.float();
                        break;
                    }
                case 3: {
                        message.chunkEnd = reader.float();
                        break;
                    }
                case 4: {
                        message.timeEndpointDetectionMs = reader.float();
                        break;
                    }
                case 5: {
                        message.timeDecodingMs = reader.float();
                        break;
                    }
                case 6: {
                        message.variables = $root.Variables.decode(reader, reader.uint32());
                        break;
                    }
                case 7: {
                        message.isFinal = reader.bool();
                        break;
                    }
                case 8: {
                        if (!(message.emotionResult && message.emotionResult.length))
                            message.emotionResult = [];
                        message.emotionResult.push($root.EmotionResult.decode(reader, reader.uint32()));
                        break;
                    }
                case 9: {
                        if (!(message.contextAnswer && message.contextAnswer.length))
                            message.contextAnswer = [];
                        message.contextAnswer.push($root.DecoderResult.ContextAnswer.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        DecoderResult.ContextAnswer = (function() {
    
            /**
             * Properties of a ContextAnswer.
             * @memberof DecoderResult
             * @interface IContextAnswer
             * @property {Array.<DecoderResult.ContextAnswer.IContextRef>|null} [contextResult] ContextAnswer contextResult
             */
    
            /**
             * Constructs a new ContextAnswer.
             * @memberof DecoderResult
             * @classdesc Represents a ContextAnswer.
             * @implements IContextAnswer
             * @constructor
             * @param {DecoderResult.IContextAnswer=} [properties] Properties to set
             */
            function ContextAnswer(properties) {
                this.contextResult = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * ContextAnswer contextResult.
             * @member {Array.<DecoderResult.ContextAnswer.IContextRef>} contextResult
             * @memberof DecoderResult.ContextAnswer
             * @instance
             */
            ContextAnswer.prototype.contextResult = $util.emptyArray;
    
            /**
             * Encodes the specified ContextAnswer message. Does not implicitly {@link DecoderResult.ContextAnswer.verify|verify} messages.
             * @function encode
             * @memberof DecoderResult.ContextAnswer
             * @static
             * @param {DecoderResult.IContextAnswer} message ContextAnswer message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ContextAnswer.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.contextResult != null && message.contextResult.length)
                    for (var i = 0; i < message.contextResult.length; ++i)
                        $root.DecoderResult.ContextAnswer.ContextRef.encode(message.contextResult[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };
    
            /**
             * Decodes a ContextAnswer message from the specified reader or buffer.
             * @function decode
             * @memberof DecoderResult.ContextAnswer
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {DecoderResult.ContextAnswer} ContextAnswer
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ContextAnswer.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.DecoderResult.ContextAnswer();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.contextResult && message.contextResult.length))
                                message.contextResult = [];
                            message.contextResult.push($root.DecoderResult.ContextAnswer.ContextRef.decode(reader, reader.uint32()));
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            ContextAnswer.ContextRef = (function() {
    
                /**
                 * Properties of a ContextRef.
                 * @memberof DecoderResult.ContextAnswer
                 * @interface IContextRef
                 * @property {string|null} [id] ContextRef id
                 * @property {number|null} [index] ContextRef index
                 * @property {string|null} [originalValue] ContextRef originalValue
                 * @property {string|null} [predictedValue] ContextRef predictedValue
                 * @property {number|null} [score] ContextRef score
                 */
    
                /**
                 * Constructs a new ContextRef.
                 * @memberof DecoderResult.ContextAnswer
                 * @classdesc Represents a ContextRef.
                 * @implements IContextRef
                 * @constructor
                 * @param {DecoderResult.ContextAnswer.IContextRef=} [properties] Properties to set
                 */
                function ContextRef(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * ContextRef id.
                 * @member {string} id
                 * @memberof DecoderResult.ContextAnswer.ContextRef
                 * @instance
                 */
                ContextRef.prototype.id = "";
    
                /**
                 * ContextRef index.
                 * @member {number} index
                 * @memberof DecoderResult.ContextAnswer.ContextRef
                 * @instance
                 */
                ContextRef.prototype.index = 0;
    
                /**
                 * ContextRef originalValue.
                 * @member {string} originalValue
                 * @memberof DecoderResult.ContextAnswer.ContextRef
                 * @instance
                 */
                ContextRef.prototype.originalValue = "";
    
                /**
                 * ContextRef predictedValue.
                 * @member {string} predictedValue
                 * @memberof DecoderResult.ContextAnswer.ContextRef
                 * @instance
                 */
                ContextRef.prototype.predictedValue = "";
    
                /**
                 * ContextRef score.
                 * @member {number} score
                 * @memberof DecoderResult.ContextAnswer.ContextRef
                 * @instance
                 */
                ContextRef.prototype.score = 0;
    
                /**
                 * Encodes the specified ContextRef message. Does not implicitly {@link DecoderResult.ContextAnswer.ContextRef.verify|verify} messages.
                 * @function encode
                 * @memberof DecoderResult.ContextAnswer.ContextRef
                 * @static
                 * @param {DecoderResult.ContextAnswer.IContextRef} message ContextRef message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ContextRef.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                    if (message.index != null && Object.hasOwnProperty.call(message, "index"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.index);
                    if (message.originalValue != null && Object.hasOwnProperty.call(message, "originalValue"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.originalValue);
                    if (message.predictedValue != null && Object.hasOwnProperty.call(message, "predictedValue"))
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.predictedValue);
                    if (message.score != null && Object.hasOwnProperty.call(message, "score"))
                        writer.uint32(/* id 5, wireType 5 =*/45).float(message.score);
                    return writer;
                };
    
                /**
                 * Decodes a ContextRef message from the specified reader or buffer.
                 * @function decode
                 * @memberof DecoderResult.ContextAnswer.ContextRef
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {DecoderResult.ContextAnswer.ContextRef} ContextRef
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ContextRef.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.DecoderResult.ContextAnswer.ContextRef();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.id = reader.string();
                                break;
                            }
                        case 2: {
                                message.index = reader.int32();
                                break;
                            }
                        case 3: {
                                message.originalValue = reader.string();
                                break;
                            }
                        case 4: {
                                message.predictedValue = reader.string();
                                break;
                            }
                        case 5: {
                                message.score = reader.float();
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                return ContextRef;
            })();
    
            return ContextAnswer;
        })();
    
        return DecoderResult;
    })();
    
    $root.ErrorResponse = (function() {
    
        /**
         * Properties of an ErrorResponse.
         * @exports IErrorResponse
         * @interface IErrorResponse
         * @property {string|null} [errorMessage] ErrorResponse errorMessage
         */
    
        /**
         * Constructs a new ErrorResponse.
         * @exports ErrorResponse
         * @classdesc Represents an ErrorResponse.
         * @implements IErrorResponse
         * @constructor
         * @param {IErrorResponse=} [properties] Properties to set
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
         * @memberof ErrorResponse
         * @instance
         */
        ErrorResponse.prototype.errorMessage = "";
    
        /**
         * Encodes the specified ErrorResponse message. Does not implicitly {@link ErrorResponse.verify|verify} messages.
         * @function encode
         * @memberof ErrorResponse
         * @static
         * @param {IErrorResponse} message ErrorResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ErrorResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.errorMessage != null && Object.hasOwnProperty.call(message, "errorMessage"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.errorMessage);
            return writer;
        };
    
        /**
         * Decodes an ErrorResponse message from the specified reader or buffer.
         * @function decode
         * @memberof ErrorResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {ErrorResponse} ErrorResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ErrorResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ErrorResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.errorMessage = reader.string();
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
    
    $root.PacketWrapperFromServer = (function() {
    
        /**
         * Properties of a PacketWrapperFromServer.
         * @exports IPacketWrapperFromServer
         * @interface IPacketWrapperFromServer
         * @property {IUndecodedSeconds|null} [undecodedSecondsField] PacketWrapperFromServer undecodedSecondsField
         * @property {IFullyFinalized|null} [fullyFinalizedField] PacketWrapperFromServer fullyFinalizedField
         * @property {IDecoderResult|null} [decoderResultField] PacketWrapperFromServer decoderResultField
         * @property {IErrorResponse|null} [errorResponse] PacketWrapperFromServer errorResponse
         */
    
        /**
         * Constructs a new PacketWrapperFromServer.
         * @exports PacketWrapperFromServer
         * @classdesc Represents a PacketWrapperFromServer.
         * @implements IPacketWrapperFromServer
         * @constructor
         * @param {IPacketWrapperFromServer=} [properties] Properties to set
         */
        function PacketWrapperFromServer(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * PacketWrapperFromServer undecodedSecondsField.
         * @member {IUndecodedSeconds|null|undefined} undecodedSecondsField
         * @memberof PacketWrapperFromServer
         * @instance
         */
        PacketWrapperFromServer.prototype.undecodedSecondsField = null;
    
        /**
         * PacketWrapperFromServer fullyFinalizedField.
         * @member {IFullyFinalized|null|undefined} fullyFinalizedField
         * @memberof PacketWrapperFromServer
         * @instance
         */
        PacketWrapperFromServer.prototype.fullyFinalizedField = null;
    
        /**
         * PacketWrapperFromServer decoderResultField.
         * @member {IDecoderResult|null|undefined} decoderResultField
         * @memberof PacketWrapperFromServer
         * @instance
         */
        PacketWrapperFromServer.prototype.decoderResultField = null;
    
        /**
         * PacketWrapperFromServer errorResponse.
         * @member {IErrorResponse|null|undefined} errorResponse
         * @memberof PacketWrapperFromServer
         * @instance
         */
        PacketWrapperFromServer.prototype.errorResponse = null;
    
        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;
    
        /**
         * PacketWrapperFromServer MessageType.
         * @member {"undecodedSecondsField"|"fullyFinalizedField"|"decoderResultField"|"errorResponse"|undefined} MessageType
         * @memberof PacketWrapperFromServer
         * @instance
         */
        Object.defineProperty(PacketWrapperFromServer.prototype, "MessageType", {
            get: $util.oneOfGetter($oneOfFields = ["undecodedSecondsField", "fullyFinalizedField", "decoderResultField", "errorResponse"]),
            set: $util.oneOfSetter($oneOfFields)
        });
    
        /**
         * Encodes the specified PacketWrapperFromServer message. Does not implicitly {@link PacketWrapperFromServer.verify|verify} messages.
         * @function encode
         * @memberof PacketWrapperFromServer
         * @static
         * @param {IPacketWrapperFromServer} message PacketWrapperFromServer message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PacketWrapperFromServer.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.undecodedSecondsField != null && Object.hasOwnProperty.call(message, "undecodedSecondsField"))
                $root.UndecodedSeconds.encode(message.undecodedSecondsField, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.fullyFinalizedField != null && Object.hasOwnProperty.call(message, "fullyFinalizedField"))
                $root.FullyFinalized.encode(message.fullyFinalizedField, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.decoderResultField != null && Object.hasOwnProperty.call(message, "decoderResultField"))
                $root.DecoderResult.encode(message.decoderResultField, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.errorResponse != null && Object.hasOwnProperty.call(message, "errorResponse"))
                $root.ErrorResponse.encode(message.errorResponse, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            return writer;
        };
    
        /**
         * Decodes a PacketWrapperFromServer message from the specified reader or buffer.
         * @function decode
         * @memberof PacketWrapperFromServer
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {PacketWrapperFromServer} PacketWrapperFromServer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PacketWrapperFromServer.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PacketWrapperFromServer();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.undecodedSecondsField = $root.UndecodedSeconds.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.fullyFinalizedField = $root.FullyFinalized.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.decoderResultField = $root.DecoderResult.decode(reader, reader.uint32());
                        break;
                    }
                case 8: {
                        message.errorResponse = $root.ErrorResponse.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        return PacketWrapperFromServer;
    })();

    return $root;
});
