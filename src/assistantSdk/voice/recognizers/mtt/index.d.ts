import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace Music2TrackProtocol. */
export namespace Music2TrackProtocol {

    /** Properties of a DecoderResult. */
    interface IDecoderResult {

        /** DecoderResult result */
        result?: (string|null);

        /** DecoderResult isMusicFound */
        isMusicFound?: (boolean|null);

        /** DecoderResult isFinal */
        isFinal?: (boolean|null);
    }

    /** Represents a DecoderResult. */
    class DecoderResult implements IDecoderResult {

        /**
         * Constructs a new DecoderResult.
         * @param [properties] Properties to set
         */
        constructor(properties?: Music2TrackProtocol.IDecoderResult);

        /** DecoderResult result. */
        public result: string;

        /** DecoderResult isMusicFound. */
        public isMusicFound: boolean;

        /** DecoderResult isFinal. */
        public isFinal: boolean;

        /**
         * Decodes a DecoderResult message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DecoderResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Music2TrackProtocol.DecoderResult;
    }

    /** Properties of an ErrorResponse. */
    interface IErrorResponse {

        /** ErrorResponse errorMessage */
        errorMessage?: (string|null);

        /** ErrorResponse errorCode */
        errorCode?: (number|null);
    }

    /** Represents an ErrorResponse. */
    class ErrorResponse implements IErrorResponse {

        /**
         * Constructs a new ErrorResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: Music2TrackProtocol.IErrorResponse);

        /** ErrorResponse errorMessage. */
        public errorMessage: string;

        /** ErrorResponse errorCode. */
        public errorCode: number;

        /**
         * Decodes an ErrorResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ErrorResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Music2TrackProtocol.ErrorResponse;
    }

    /** Properties of a MttResponse. */
    interface IMttResponse {

        /** MttResponse decoderResultField */
        decoderResultField?: (Music2TrackProtocol.IDecoderResult|null);

        /** MttResponse errorResponse */
        errorResponse?: (Music2TrackProtocol.IErrorResponse|null);
    }

    /** Represents a MttResponse. */
    class MttResponse implements IMttResponse {

        /**
         * Constructs a new MttResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: Music2TrackProtocol.IMttResponse);

        /** MttResponse decoderResultField. */
        public decoderResultField?: (Music2TrackProtocol.IDecoderResult|null);

        /** MttResponse errorResponse. */
        public errorResponse?: (Music2TrackProtocol.IErrorResponse|null);

        /** MttResponse MessageType. */
        public MessageType?: ("decoderResultField"|"errorResponse");

        /**
         * Decodes a MttResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MttResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Music2TrackProtocol.MttResponse;
    }
}
