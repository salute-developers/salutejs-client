import * as $protobuf from "protobufjs";
import Long = require("long");
/** Properties of a Variables. */
export interface IVariables {

    /** Variables variables */
    variables?: ({ [k: string]: string }|null);
}

/** Represents a Variables. */
export class Variables implements IVariables {

    /**
     * Constructs a new Variables.
     * @param [properties] Properties to set
     */
    constructor(properties?: IVariables);

    /** Variables variables. */
    public variables: { [k: string]: string };

    /**
     * Decodes a Variables message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Variables
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Variables;
}

/** Properties of an UndecodedSeconds. */
export interface IUndecodedSeconds {

    /** UndecodedSeconds undecodedSeconds */
    undecodedSeconds?: (number|null);
}

/** Represents an UndecodedSeconds. */
export class UndecodedSeconds implements IUndecodedSeconds {

    /**
     * Constructs a new UndecodedSeconds.
     * @param [properties] Properties to set
     */
    constructor(properties?: IUndecodedSeconds);

    /** UndecodedSeconds undecodedSeconds. */
    public undecodedSeconds: number;

    /**
     * Decodes an UndecodedSeconds message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns UndecodedSeconds
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): UndecodedSeconds;
}

/** Properties of a FullyFinalized. */
export interface IFullyFinalized {
}

/** Represents a FullyFinalized. */
export class FullyFinalized implements IFullyFinalized {

    /**
     * Constructs a new FullyFinalized.
     * @param [properties] Properties to set
     */
    constructor(properties?: IFullyFinalized);

    /**
     * Decodes a FullyFinalized message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns FullyFinalized
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): FullyFinalized;
}

/** Properties of an EmotionResult. */
export interface IEmotionResult {

    /** EmotionResult name */
    name?: (string|null);

    /** EmotionResult confidence */
    confidence?: (number|null);
}

/** Represents an EmotionResult. */
export class EmotionResult implements IEmotionResult {

    /**
     * Constructs a new EmotionResult.
     * @param [properties] Properties to set
     */
    constructor(properties?: IEmotionResult);

    /** EmotionResult name. */
    public name: string;

    /** EmotionResult confidence. */
    public confidence: number;

    /**
     * Decodes an EmotionResult message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns EmotionResult
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): EmotionResult;
}

/** Properties of a Hypothesis. */
export interface IHypothesis {

    /** Hypothesis words */
    words?: (string|null);

    /** Hypothesis acousticCost */
    acousticCost?: (number|null);

    /** Hypothesis linguisticCost */
    linguisticCost?: (number|null);

    /** Hypothesis finalCost */
    finalCost?: (number|null);

    /** Hypothesis phraseStart */
    phraseStart?: (number|null);

    /** Hypothesis phraseEnd */
    phraseEnd?: (number|null);

    /** Hypothesis normalizedText */
    normalizedText?: (string|null);
}

/** Represents a Hypothesis. */
export class Hypothesis implements IHypothesis {

    /**
     * Constructs a new Hypothesis.
     * @param [properties] Properties to set
     */
    constructor(properties?: IHypothesis);

    /** Hypothesis words. */
    public words: string;

    /** Hypothesis acousticCost. */
    public acousticCost: number;

    /** Hypothesis linguisticCost. */
    public linguisticCost: number;

    /** Hypothesis finalCost. */
    public finalCost: number;

    /** Hypothesis phraseStart. */
    public phraseStart: number;

    /** Hypothesis phraseEnd. */
    public phraseEnd: number;

    /** Hypothesis normalizedText. */
    public normalizedText: string;

    /**
     * Decodes a Hypothesis message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Hypothesis
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Hypothesis;
}

/** Properties of a DecoderResult. */
export interface IDecoderResult {

    /** DecoderResult hypothesis */
    hypothesis?: (IHypothesis[]|null);

    /** DecoderResult chunkStart */
    chunkStart?: (number|null);

    /** DecoderResult chunkEnd */
    chunkEnd?: (number|null);

    /** DecoderResult timeEndpointDetectionMs */
    timeEndpointDetectionMs?: (number|null);

    /** DecoderResult timeDecodingMs */
    timeDecodingMs?: (number|null);

    /** DecoderResult variables */
    variables?: (IVariables|null);

    /** DecoderResult isFinal */
    isFinal?: (boolean|null);

    /** DecoderResult emotionResult */
    emotionResult?: (IEmotionResult[]|null);

    /** DecoderResult contextAnswer */
    contextAnswer?: (DecoderResult.IContextAnswer[]|null);
}

/** Represents a DecoderResult. */
export class DecoderResult implements IDecoderResult {

    /**
     * Constructs a new DecoderResult.
     * @param [properties] Properties to set
     */
    constructor(properties?: IDecoderResult);

    /** DecoderResult hypothesis. */
    public hypothesis: IHypothesis[];

    /** DecoderResult chunkStart. */
    public chunkStart: number;

    /** DecoderResult chunkEnd. */
    public chunkEnd: number;

    /** DecoderResult timeEndpointDetectionMs. */
    public timeEndpointDetectionMs: number;

    /** DecoderResult timeDecodingMs. */
    public timeDecodingMs: number;

    /** DecoderResult variables. */
    public variables?: (IVariables|null);

    /** DecoderResult isFinal. */
    public isFinal: boolean;

    /** DecoderResult emotionResult. */
    public emotionResult: IEmotionResult[];

    /** DecoderResult contextAnswer. */
    public contextAnswer: DecoderResult.IContextAnswer[];

    /**
     * Decodes a DecoderResult message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DecoderResult
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): DecoderResult;
}

export namespace DecoderResult {

    /** Properties of a ContextAnswer. */
    interface IContextAnswer {

        /** ContextAnswer contextResult */
        contextResult?: (DecoderResult.ContextAnswer.IContextRef[]|null);
    }

    /** Represents a ContextAnswer. */
    class ContextAnswer implements IContextAnswer {

        /**
         * Constructs a new ContextAnswer.
         * @param [properties] Properties to set
         */
        constructor(properties?: DecoderResult.IContextAnswer);

        /** ContextAnswer contextResult. */
        public contextResult: DecoderResult.ContextAnswer.IContextRef[];

        /**
         * Decodes a ContextAnswer message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ContextAnswer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): DecoderResult.ContextAnswer;
    }

    namespace ContextAnswer {

        /** Properties of a ContextRef. */
        interface IContextRef {

            /** ContextRef id */
            id?: (string|null);

            /** ContextRef index */
            index?: (number|null);

            /** ContextRef originalValue */
            originalValue?: (string|null);

            /** ContextRef predictedValue */
            predictedValue?: (string|null);

            /** ContextRef score */
            score?: (number|null);
        }

        /** Represents a ContextRef. */
        class ContextRef implements IContextRef {

            /**
             * Constructs a new ContextRef.
             * @param [properties] Properties to set
             */
            constructor(properties?: DecoderResult.ContextAnswer.IContextRef);

            /** ContextRef id. */
            public id: string;

            /** ContextRef index. */
            public index: number;

            /** ContextRef originalValue. */
            public originalValue: string;

            /** ContextRef predictedValue. */
            public predictedValue: string;

            /** ContextRef score. */
            public score: number;

            /**
             * Decodes a ContextRef message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ContextRef
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): DecoderResult.ContextAnswer.ContextRef;
        }
    }
}

/** Properties of an ErrorResponse. */
export interface IErrorResponse {

    /** ErrorResponse errorMessage */
    errorMessage?: (string|null);
}

/** Represents an ErrorResponse. */
export class ErrorResponse implements IErrorResponse {

    /**
     * Constructs a new ErrorResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: IErrorResponse);

    /** ErrorResponse errorMessage. */
    public errorMessage: string;

    /**
     * Decodes an ErrorResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ErrorResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ErrorResponse;
}

/** Properties of a PacketWrapperFromServer. */
export interface IPacketWrapperFromServer {

    /** PacketWrapperFromServer undecodedSecondsField */
    undecodedSecondsField?: (IUndecodedSeconds|null);

    /** PacketWrapperFromServer fullyFinalizedField */
    fullyFinalizedField?: (IFullyFinalized|null);

    /** PacketWrapperFromServer decoderResultField */
    decoderResultField?: (IDecoderResult|null);

    /** PacketWrapperFromServer errorResponse */
    errorResponse?: (IErrorResponse|null);
}

/** Represents a PacketWrapperFromServer. */
export class PacketWrapperFromServer implements IPacketWrapperFromServer {

    /**
     * Constructs a new PacketWrapperFromServer.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPacketWrapperFromServer);

    /** PacketWrapperFromServer undecodedSecondsField. */
    public undecodedSecondsField?: (IUndecodedSeconds|null);

    /** PacketWrapperFromServer fullyFinalizedField. */
    public fullyFinalizedField?: (IFullyFinalized|null);

    /** PacketWrapperFromServer decoderResultField. */
    public decoderResultField?: (IDecoderResult|null);

    /** PacketWrapperFromServer errorResponse. */
    public errorResponse?: (IErrorResponse|null);

    /** PacketWrapperFromServer MessageType. */
    public MessageType?: ("undecodedSecondsField"|"fullyFinalizedField"|"decoderResultField"|"errorResponse");

    /**
     * Decodes a PacketWrapperFromServer message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PacketWrapperFromServer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PacketWrapperFromServer;
}
