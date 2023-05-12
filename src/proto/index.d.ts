import * as $protobuf from "protobufjs";
import Long = require("long");
/** Properties of a Message. */
export interface IMessage {

    /** Message userId */
    userId?: (string|null);

    /** Message messageId */
    messageId?: (number|Long|null);

    /** Message last */
    last?: (number|null);

    /** Message token */
    token?: (string|null);

    /** Message userChannel */
    userChannel?: (string|null);

    /** Message vpsToken */
    vpsToken?: (string|null);

    /** Устарело с версии 3. */
    devContext?: (IDevContext[]|null);

    /** Message messageName */
    messageName?: (string|null);

    /** Message version */
    version?: (number|null);

    /** Message voice */
    voice?: (IVoice|null);

    /** Message text */
    text?: (IText|null);

    /** Message systemMessage */
    systemMessage?: (ISystemMessage|null);

    /** Message legacyDevice */
    legacyDevice?: (ILegacyDevice|null);

    /** Message settings */
    settings?: (ISettings|null);

    /** Message status */
    status?: (IStatus|null);

    /** Message device */
    device?: (IDevice|null);

    /** Message bytes */
    bytes?: (IBytes|null);

    /** Message initialSettings */
    initialSettings?: (IInitialSettings|null);

    /** Message cancel */
    cancel?: (ICancel|null);

    /** Message getHistoryRequest */
    getHistoryRequest?: (IGetHistoryRequest|null);

    /** Message mute */
    mute?: (IMute|null);

    /** Message timestamp */
    timestamp?: (number|Long|null);

    /** Message meta */
    meta?: ({ [k: string]: string }|null);
}

/** Represents a Message. */
export class Message implements IMessage {

    /**
     * Constructs a new Message.
     * @param [properties] Properties to set
     */
    constructor(properties?: IMessage);

    /** Message userId. */
    public userId: string;

    /** Message messageId. */
    public messageId: (number|Long);

    /** Message last. */
    public last: number;

    /** Message token. */
    public token: string;

    /** Message userChannel. */
    public userChannel: string;

    /** Message vpsToken. */
    public vpsToken: string;

    /** Устарело с версии 3. */
    public devContext: IDevContext[];

    /** Message messageName. */
    public messageName: string;

    /** Message version. */
    public version: number;

    /** Message voice. */
    public voice?: (IVoice|null);

    /** Message text. */
    public text?: (IText|null);

    /** Message systemMessage. */
    public systemMessage?: (ISystemMessage|null);

    /** Message legacyDevice. */
    public legacyDevice?: (ILegacyDevice|null);

    /** Message settings. */
    public settings?: (ISettings|null);

    /** Message status. */
    public status?: (IStatus|null);

    /** Message device. */
    public device?: (IDevice|null);

    /** Message bytes. */
    public bytes?: (IBytes|null);

    /** Message initialSettings. */
    public initialSettings?: (IInitialSettings|null);

    /** Message cancel. */
    public cancel?: (ICancel|null);

    /** Message getHistoryRequest. */
    public getHistoryRequest?: (IGetHistoryRequest|null);

    /** Message mute. */
    public mute?: (IMute|null);

    /** Message timestamp. */
    public timestamp: (number|Long);

    /** Message meta. */
    public meta: { [k: string]: string };

    /** Message content. */
    public content?: ("voice"|"text"|"systemMessage"|"legacyDevice"|"settings"|"status"|"device"|"bytes"|"initialSettings"|"cancel"|"getHistoryRequest"|"mute");

    /**
     * Creates a new Message instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Message instance
     */
    public static create(properties?: IMessage): Message;

    /**
     * Encodes the specified Message message. Does not implicitly {@link Message.verify|verify} messages.
     * @param message Message message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Message message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Message
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Message;
}

/** Properties of an InitialSettings. */
export interface IInitialSettings {

    /** InitialSettings userId */
    userId?: (string|null);

    /** InitialSettings userChannel */
    userChannel?: (string|null);

    /** InitialSettings device */
    device?: (IDevice|null);

    /** InitialSettings settings */
    settings?: (ISettings|null);

    /** InitialSettings locale */
    locale?: (string|null);
}

/** Represents an InitialSettings. */
export class InitialSettings implements IInitialSettings {

    /**
     * Constructs a new InitialSettings.
     * @param [properties] Properties to set
     */
    constructor(properties?: IInitialSettings);

    /** InitialSettings userId. */
    public userId: string;

    /** InitialSettings userChannel. */
    public userChannel: string;

    /** InitialSettings device. */
    public device?: (IDevice|null);

    /** InitialSettings settings. */
    public settings?: (ISettings|null);

    /** InitialSettings locale. */
    public locale: string;

    /**
     * Creates a new InitialSettings instance using the specified properties.
     * @param [properties] Properties to set
     * @returns InitialSettings instance
     */
    public static create(properties?: IInitialSettings): InitialSettings;

    /**
     * Encodes the specified InitialSettings message. Does not implicitly {@link InitialSettings.verify|verify} messages.
     * @param message InitialSettings message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IInitialSettings, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an InitialSettings message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns InitialSettings
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): InitialSettings;
}

/** Properties of a Device. */
export interface IDevice {

    /** Device platformType */
    platformType?: (string|null);

    /** Device platformVersion */
    platformVersion?: (string|null);

    /** Обязательно. Пример, SBERBOX */
    surface?: (string|null);

    /** Device surfaceVersion */
    surfaceVersion?: (string|null);

    /** Device features */
    features?: (string|null);

    /** Device capabilities */
    capabilities?: (string|null);

    /** Device deviceId */
    deviceId?: (string|null);

    /** Device deviceManufacturer */
    deviceManufacturer?: (string|null);

    /** Device deviceModel */
    deviceModel?: (string|null);

    /** Device additionalInfo */
    additionalInfo?: (string|null);

    /** Device tenant */
    tenant?: (string|null);
}

/** Represents a Device. */
export class Device implements IDevice {

    /**
     * Constructs a new Device.
     * @param [properties] Properties to set
     */
    constructor(properties?: IDevice);

    /** Device platformType. */
    public platformType: string;

    /** Device platformVersion. */
    public platformVersion: string;

    /** Обязательно. Пример, SBERBOX */
    public surface: string;

    /** Device surfaceVersion. */
    public surfaceVersion: string;

    /** Device features. */
    public features: string;

    /** Device capabilities. */
    public capabilities: string;

    /** Device deviceId. */
    public deviceId: string;

    /** Device deviceManufacturer. */
    public deviceManufacturer: string;

    /** Device deviceModel. */
    public deviceModel: string;

    /** Device additionalInfo. */
    public additionalInfo: string;

    /** Device tenant. */
    public tenant: string;

    /**
     * Creates a new Device instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Device instance
     */
    public static create(properties?: IDevice): Device;

    /**
     * Encodes the specified Device message. Does not implicitly {@link Device.verify|verify} messages.
     * @param message Device message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IDevice, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Device message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Device
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Device;
}

/** Properties of a Settings. */
export interface ISettings {

    /** Settings dubbing */
    dubbing?: (number|null);

    /** Settings echo */
    echo?: (number|null);

    /** Settings ttsEngine */
    ttsEngine?: (string|null);

    /** Settings asrEngine */
    asrEngine?: (string|null);

    /** Settings asrAutoStop */
    asrAutoStop?: (number|null);

    /** Settings devMode */
    devMode?: (number|null);

    /** Settings authConnector */
    authConnector?: (string|null);

    /** Settings surface */
    surface?: (string|null);
}

/** Represents a Settings. */
export class Settings implements ISettings {

    /**
     * Constructs a new Settings.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISettings);

    /** Settings dubbing. */
    public dubbing: number;

    /** Settings echo. */
    public echo: number;

    /** Settings ttsEngine. */
    public ttsEngine: string;

    /** Settings asrEngine. */
    public asrEngine: string;

    /** Settings asrAutoStop. */
    public asrAutoStop: number;

    /** Settings devMode. */
    public devMode: number;

    /** Settings authConnector. */
    public authConnector: string;

    /** Settings surface. */
    public surface: string;

    /**
     * Creates a new Settings instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Settings instance
     */
    public static create(properties?: ISettings): Settings;

    /**
     * Encodes the specified Settings message. Does not implicitly {@link Settings.verify|verify} messages.
     * @param message Settings message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISettings, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Settings message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Settings
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Settings;
}

/** Properties of a LegacyDevice. */
export interface ILegacyDevice {

    /** LegacyDevice clientType */
    clientType?: (string|null);

    /** LegacyDevice channel */
    channel?: (string|null);

    /** LegacyDevice channelVersion */
    channelVersion?: (string|null);

    /** LegacyDevice platformName */
    platformName?: (string|null);

    /** LegacyDevice platformVersion */
    platformVersion?: (string|null);

    /** LegacyDevice sdkVersion */
    sdkVersion?: (string|null);

    /** LegacyDevice protocolVersion */
    protocolVersion?: (string|null);
}

/** Represents a LegacyDevice. */
export class LegacyDevice implements ILegacyDevice {

    /**
     * Constructs a new LegacyDevice.
     * @param [properties] Properties to set
     */
    constructor(properties?: ILegacyDevice);

    /** LegacyDevice clientType. */
    public clientType: string;

    /** LegacyDevice channel. */
    public channel: string;

    /** LegacyDevice channelVersion. */
    public channelVersion: string;

    /** LegacyDevice platformName. */
    public platformName: string;

    /** LegacyDevice platformVersion. */
    public platformVersion: string;

    /** LegacyDevice sdkVersion. */
    public sdkVersion: string;

    /** LegacyDevice protocolVersion. */
    public protocolVersion: string;

    /**
     * Creates a new LegacyDevice instance using the specified properties.
     * @param [properties] Properties to set
     * @returns LegacyDevice instance
     */
    public static create(properties?: ILegacyDevice): LegacyDevice;

    /**
     * Encodes the specified LegacyDevice message. Does not implicitly {@link LegacyDevice.verify|verify} messages.
     * @param message LegacyDevice message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ILegacyDevice, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a LegacyDevice message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns LegacyDevice
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): LegacyDevice;
}

/** Properties of a Voice. */
export interface IVoice {

    /** Voice data */
    data?: (Uint8Array|null);
}

/** Represents a Voice. */
export class Voice implements IVoice {

    /**
     * Constructs a new Voice.
     * @param [properties] Properties to set
     */
    constructor(properties?: IVoice);

    /** Voice data. */
    public data: Uint8Array;

    /**
     * Creates a new Voice instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Voice instance
     */
    public static create(properties?: IVoice): Voice;

    /**
     * Encodes the specified Voice message. Does not implicitly {@link Voice.verify|verify} messages.
     * @param message Voice message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IVoice, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Voice message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Voice
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Voice;
}

/** Properties of a Text. */
export interface IText {

    /** Text data */
    data?: (string|null);

    /** Text type */
    type?: (string|null);
}

/** Represents a Text. */
export class Text implements IText {

    /**
     * Constructs a new Text.
     * @param [properties] Properties to set
     */
    constructor(properties?: IText);

    /** Text data. */
    public data: string;

    /** Text type. */
    public type: string;

    /**
     * Creates a new Text instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Text instance
     */
    public static create(properties?: IText): Text;

    /**
     * Encodes the specified Text message. Does not implicitly {@link Text.verify|verify} messages.
     * @param message Text message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IText, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Text message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Text
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Text;
}

/** Properties of a SystemMessage. */
export interface ISystemMessage {

    /** SystemMessage data */
    data?: (string|null);
}

/** Represents a SystemMessage. */
export class SystemMessage implements ISystemMessage {

    /**
     * Constructs a new SystemMessage.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISystemMessage);

    /** SystemMessage data. */
    public data: string;

    /**
     * Creates a new SystemMessage instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SystemMessage instance
     */
    public static create(properties?: ISystemMessage): SystemMessage;

    /**
     * Encodes the specified SystemMessage message. Does not implicitly {@link SystemMessage.verify|verify} messages.
     * @param message SystemMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISystemMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a SystemMessage message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SystemMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SystemMessage;
}

/** Properties of a Status. */
export interface IStatus {

    /** Status code */
    code?: (number|null);

    /** Status description */
    description?: (string|null);

    /** Status technicalDescription */
    technicalDescription?: (string|null);
}

/** Represents a Status. */
export class Status implements IStatus {

    /**
     * Constructs a new Status.
     * @param [properties] Properties to set
     */
    constructor(properties?: IStatus);

    /** Status code. */
    public code: number;

    /** Status description. */
    public description: string;

    /** Status technicalDescription. */
    public technicalDescription: string;

    /**
     * Creates a new Status instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Status instance
     */
    public static create(properties?: IStatus): Status;

    /**
     * Encodes the specified Status message. Does not implicitly {@link Status.verify|verify} messages.
     * @param message Status message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IStatus, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Status message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Status
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Status;
}

/** Properties of a Bytes. */
export interface IBytes {

    /** Bytes data */
    data?: (Uint8Array|null);

    /** Bytes desc */
    desc?: (string|null);
}

/** Represents a Bytes. */
export class Bytes implements IBytes {

    /**
     * Constructs a new Bytes.
     * @param [properties] Properties to set
     */
    constructor(properties?: IBytes);

    /** Bytes data. */
    public data: Uint8Array;

    /** Bytes desc. */
    public desc: string;

    /**
     * Creates a new Bytes instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Bytes instance
     */
    public static create(properties?: IBytes): Bytes;

    /**
     * Encodes the specified Bytes message. Does not implicitly {@link Bytes.verify|verify} messages.
     * @param message Bytes message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IBytes, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Bytes message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Bytes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Bytes;
}

/** Properties of a DevContext. */
export interface IDevContext {

    /** DevContext name */
    name?: (string|null);

    /** DevContext timestampMs */
    timestampMs?: (number|Long|null);

    /** DevContext data */
    data?: (string|null);
}

/** Represents a DevContext. */
export class DevContext implements IDevContext {

    /**
     * Constructs a new DevContext.
     * @param [properties] Properties to set
     */
    constructor(properties?: IDevContext);

    /** DevContext name. */
    public name: string;

    /** DevContext timestampMs. */
    public timestampMs: (number|Long);

    /** DevContext data. */
    public data: string;

    /**
     * Creates a new DevContext instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DevContext instance
     */
    public static create(properties?: IDevContext): DevContext;

    /**
     * Encodes the specified DevContext message. Does not implicitly {@link DevContext.verify|verify} messages.
     * @param message DevContext message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IDevContext, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a DevContext message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DevContext
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): DevContext;
}

/** Properties of a Cancel. */
export interface ICancel {
}

/** Represents a Cancel. */
export class Cancel implements ICancel {

    /**
     * Constructs a new Cancel.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICancel);

    /**
     * Creates a new Cancel instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Cancel instance
     */
    public static create(properties?: ICancel): Cancel;

    /**
     * Encodes the specified Cancel message. Does not implicitly {@link Cancel.verify|verify} messages.
     * @param message Cancel message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICancel, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Cancel message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Cancel
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Cancel;
}

/** Properties of a Mute. */
export interface IMute {
}

/** Represents a Mute. */
export class Mute implements IMute {

    /**
     * Constructs a new Mute.
     * @param [properties] Properties to set
     */
    constructor(properties?: IMute);

    /**
     * Creates a new Mute instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Mute instance
     */
    public static create(properties?: IMute): Mute;

    /**
     * Encodes the specified Mute message. Does not implicitly {@link Mute.verify|verify} messages.
     * @param message Mute message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IMute, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Mute message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Mute
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Mute;
}

/** Properties of a GetHistoryRequest. */
export interface IGetHistoryRequest {

    /** GetHistoryRequest messageTypes */
    messageTypes?: (string[]|null);

    /** GetHistoryRequest app */
    app?: (IApp|null);

    /** GetHistoryRequest offset */
    offset?: (IOffset|null);
}

/** Represents a GetHistoryRequest. */
export class GetHistoryRequest implements IGetHistoryRequest {

    /**
     * Constructs a new GetHistoryRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: IGetHistoryRequest);

    /** GetHistoryRequest messageTypes. */
    public messageTypes: string[];

    /** GetHistoryRequest app. */
    public app?: (IApp|null);

    /** GetHistoryRequest offset. */
    public offset?: (IOffset|null);

    /**
     * Creates a new GetHistoryRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GetHistoryRequest instance
     */
    public static create(properties?: IGetHistoryRequest): GetHistoryRequest;

    /**
     * Encodes the specified GetHistoryRequest message. Does not implicitly {@link GetHistoryRequest.verify|verify} messages.
     * @param message GetHistoryRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IGetHistoryRequest, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a GetHistoryRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GetHistoryRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GetHistoryRequest;
}

/** Properties of an App. */
export interface IApp {

    /** App type */
    type?: (google.protobuf.IStringValue|null);

    /** App projectId */
    projectId?: (google.protobuf.IStringValue|null);

    /** App systemName */
    systemName?: (google.protobuf.IStringValue|null);
}

/** Represents an App. */
export class App implements IApp {

    /**
     * Constructs a new App.
     * @param [properties] Properties to set
     */
    constructor(properties?: IApp);

    /** App type. */
    public type?: (google.protobuf.IStringValue|null);

    /** App projectId. */
    public projectId?: (google.protobuf.IStringValue|null);

    /** App systemName. */
    public systemName?: (google.protobuf.IStringValue|null);

    /**
     * Creates a new App instance using the specified properties.
     * @param [properties] Properties to set
     * @returns App instance
     */
    public static create(properties?: IApp): App;

    /**
     * Encodes the specified App message. Does not implicitly {@link App.verify|verify} messages.
     * @param message App message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IApp, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an App message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns App
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): App;
}

/** Properties of an Offset. */
export interface IOffset {

    /** Offset limit */
    limit?: (google.protobuf.IStringValue|null);

    /** Offset contentId */
    contentId?: (google.protobuf.IStringValue|null);
}

/** Represents an Offset. */
export class Offset implements IOffset {

    /**
     * Constructs a new Offset.
     * @param [properties] Properties to set
     */
    constructor(properties?: IOffset);

    /** Offset limit. */
    public limit?: (google.protobuf.IStringValue|null);

    /** Offset contentId. */
    public contentId?: (google.protobuf.IStringValue|null);

    /**
     * Creates a new Offset instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Offset instance
     */
    public static create(properties?: IOffset): Offset;

    /**
     * Encodes the specified Offset message. Does not implicitly {@link Offset.verify|verify} messages.
     * @param message Offset message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IOffset, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Offset message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Offset
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Offset;
}

/** Properties of a ChatHistoryRequest. */
export interface IChatHistoryRequest {

    /** ChatHistoryRequest uuid */
    uuid?: (IUuid|null);

    /** ChatHistoryRequest device */
    device?: (IDevice|null);

    /** ChatHistoryRequest getHistoryRequest */
    getHistoryRequest?: (IGetHistoryRequest|null);
}

/** Represents a ChatHistoryRequest. */
export class ChatHistoryRequest implements IChatHistoryRequest {

    /**
     * Constructs a new ChatHistoryRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: IChatHistoryRequest);

    /** ChatHistoryRequest uuid. */
    public uuid?: (IUuid|null);

    /** ChatHistoryRequest device. */
    public device?: (IDevice|null);

    /** ChatHistoryRequest getHistoryRequest. */
    public getHistoryRequest?: (IGetHistoryRequest|null);

    /**
     * Creates a new ChatHistoryRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ChatHistoryRequest instance
     */
    public static create(properties?: IChatHistoryRequest): ChatHistoryRequest;

    /**
     * Encodes the specified ChatHistoryRequest message. Does not implicitly {@link ChatHistoryRequest.verify|verify} messages.
     * @param message ChatHistoryRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IChatHistoryRequest, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a ChatHistoryRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ChatHistoryRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ChatHistoryRequest;
}

/** Properties of an Uuid. */
export interface IUuid {

    /** Uuid userId */
    userId?: (string|null);

    /** Uuid userChannel */
    userChannel?: (string|null);

    /** Uuid sub */
    sub?: (string|null);
}

/** Represents an Uuid. */
export class Uuid implements IUuid {

    /**
     * Constructs a new Uuid.
     * @param [properties] Properties to set
     */
    constructor(properties?: IUuid);

    /** Uuid userId. */
    public userId: string;

    /** Uuid userChannel. */
    public userChannel: string;

    /** Uuid sub. */
    public sub: string;

    /**
     * Creates a new Uuid instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Uuid instance
     */
    public static create(properties?: IUuid): Uuid;

    /**
     * Encodes the specified Uuid message. Does not implicitly {@link Uuid.verify|verify} messages.
     * @param message Uuid message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IUuid, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Uuid message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Uuid
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Uuid;
}

/** Properties of a GetHistoryResponse. */
export interface IGetHistoryResponse {

    /** GetHistoryResponse historyMessages */
    historyMessages?: (IHistoryMessages[]|null);
}

/** Represents a GetHistoryResponse. */
export class GetHistoryResponse implements IGetHistoryResponse {

    /**
     * Constructs a new GetHistoryResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: IGetHistoryResponse);

    /** GetHistoryResponse historyMessages. */
    public historyMessages: IHistoryMessages[];

    /**
     * Creates a new GetHistoryResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GetHistoryResponse instance
     */
    public static create(properties?: IGetHistoryResponse): GetHistoryResponse;

    /**
     * Encodes the specified GetHistoryResponse message. Does not implicitly {@link GetHistoryResponse.verify|verify} messages.
     * @param message GetHistoryResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IGetHistoryResponse, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a GetHistoryResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GetHistoryResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GetHistoryResponse;
}

/** Properties of a HistoryMessages. */
export interface IHistoryMessages {

    /** HistoryMessages content */
    content?: (string|null);

    /** HistoryMessages contentId */
    contentId?: (string|null);

    /** HistoryMessages timeCreated */
    timeCreated?: (string|null);
}

/** Represents a HistoryMessages. */
export class HistoryMessages implements IHistoryMessages {

    /**
     * Constructs a new HistoryMessages.
     * @param [properties] Properties to set
     */
    constructor(properties?: IHistoryMessages);

    /** HistoryMessages content. */
    public content: string;

    /** HistoryMessages contentId. */
    public contentId: string;

    /** HistoryMessages timeCreated. */
    public timeCreated: string;

    /**
     * Creates a new HistoryMessages instance using the specified properties.
     * @param [properties] Properties to set
     * @returns HistoryMessages instance
     */
    public static create(properties?: IHistoryMessages): HistoryMessages;

    /**
     * Encodes the specified HistoryMessages message. Does not implicitly {@link HistoryMessages.verify|verify} messages.
     * @param message HistoryMessages message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IHistoryMessages, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a HistoryMessages message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns HistoryMessages
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): HistoryMessages;
}

/** Namespace google. */
export namespace google {

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of a DoubleValue. */
        interface IDoubleValue {

            /** DoubleValue value */
            value?: (number|null);
        }

        /** Represents a DoubleValue. */
        class DoubleValue implements IDoubleValue {

            /**
             * Constructs a new DoubleValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IDoubleValue);

            /** DoubleValue value. */
            public value: number;

            /**
             * Creates a new DoubleValue instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DoubleValue instance
             */
            public static create(properties?: google.protobuf.IDoubleValue): google.protobuf.DoubleValue;

            /**
             * Encodes the specified DoubleValue message. Does not implicitly {@link google.protobuf.DoubleValue.verify|verify} messages.
             * @param message DoubleValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IDoubleValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DoubleValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DoubleValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.DoubleValue;
        }

        /** Properties of a FloatValue. */
        interface IFloatValue {

            /** FloatValue value */
            value?: (number|null);
        }

        /** Represents a FloatValue. */
        class FloatValue implements IFloatValue {

            /**
             * Constructs a new FloatValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IFloatValue);

            /** FloatValue value. */
            public value: number;

            /**
             * Creates a new FloatValue instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FloatValue instance
             */
            public static create(properties?: google.protobuf.IFloatValue): google.protobuf.FloatValue;

            /**
             * Encodes the specified FloatValue message. Does not implicitly {@link google.protobuf.FloatValue.verify|verify} messages.
             * @param message FloatValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IFloatValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FloatValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FloatValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FloatValue;
        }

        /** Properties of an Int64Value. */
        interface IInt64Value {

            /** Int64Value value */
            value?: (number|Long|null);
        }

        /** Represents an Int64Value. */
        class Int64Value implements IInt64Value {

            /**
             * Constructs a new Int64Value.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IInt64Value);

            /** Int64Value value. */
            public value: (number|Long);

            /**
             * Creates a new Int64Value instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Int64Value instance
             */
            public static create(properties?: google.protobuf.IInt64Value): google.protobuf.Int64Value;

            /**
             * Encodes the specified Int64Value message. Does not implicitly {@link google.protobuf.Int64Value.verify|verify} messages.
             * @param message Int64Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IInt64Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Int64Value message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Int64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Int64Value;
        }

        /** Properties of a UInt64Value. */
        interface IUInt64Value {

            /** UInt64Value value */
            value?: (number|Long|null);
        }

        /** Represents a UInt64Value. */
        class UInt64Value implements IUInt64Value {

            /**
             * Constructs a new UInt64Value.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IUInt64Value);

            /** UInt64Value value. */
            public value: (number|Long);

            /**
             * Creates a new UInt64Value instance using the specified properties.
             * @param [properties] Properties to set
             * @returns UInt64Value instance
             */
            public static create(properties?: google.protobuf.IUInt64Value): google.protobuf.UInt64Value;

            /**
             * Encodes the specified UInt64Value message. Does not implicitly {@link google.protobuf.UInt64Value.verify|verify} messages.
             * @param message UInt64Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IUInt64Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a UInt64Value message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns UInt64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.UInt64Value;
        }

        /** Properties of an Int32Value. */
        interface IInt32Value {

            /** Int32Value value */
            value?: (number|null);
        }

        /** Represents an Int32Value. */
        class Int32Value implements IInt32Value {

            /**
             * Constructs a new Int32Value.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IInt32Value);

            /** Int32Value value. */
            public value: number;

            /**
             * Creates a new Int32Value instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Int32Value instance
             */
            public static create(properties?: google.protobuf.IInt32Value): google.protobuf.Int32Value;

            /**
             * Encodes the specified Int32Value message. Does not implicitly {@link google.protobuf.Int32Value.verify|verify} messages.
             * @param message Int32Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IInt32Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Int32Value message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Int32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Int32Value;
        }

        /** Properties of a UInt32Value. */
        interface IUInt32Value {

            /** UInt32Value value */
            value?: (number|null);
        }

        /** Represents a UInt32Value. */
        class UInt32Value implements IUInt32Value {

            /**
             * Constructs a new UInt32Value.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IUInt32Value);

            /** UInt32Value value. */
            public value: number;

            /**
             * Creates a new UInt32Value instance using the specified properties.
             * @param [properties] Properties to set
             * @returns UInt32Value instance
             */
            public static create(properties?: google.protobuf.IUInt32Value): google.protobuf.UInt32Value;

            /**
             * Encodes the specified UInt32Value message. Does not implicitly {@link google.protobuf.UInt32Value.verify|verify} messages.
             * @param message UInt32Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IUInt32Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a UInt32Value message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns UInt32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.UInt32Value;
        }

        /** Properties of a BoolValue. */
        interface IBoolValue {

            /** BoolValue value */
            value?: (boolean|null);
        }

        /** Represents a BoolValue. */
        class BoolValue implements IBoolValue {

            /**
             * Constructs a new BoolValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IBoolValue);

            /** BoolValue value. */
            public value: boolean;

            /**
             * Creates a new BoolValue instance using the specified properties.
             * @param [properties] Properties to set
             * @returns BoolValue instance
             */
            public static create(properties?: google.protobuf.IBoolValue): google.protobuf.BoolValue;

            /**
             * Encodes the specified BoolValue message. Does not implicitly {@link google.protobuf.BoolValue.verify|verify} messages.
             * @param message BoolValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IBoolValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a BoolValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns BoolValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.BoolValue;
        }

        /** Properties of a StringValue. */
        interface IStringValue {

            /** StringValue value */
            value?: (string|null);
        }

        /** Represents a StringValue. */
        class StringValue implements IStringValue {

            /**
             * Constructs a new StringValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IStringValue);

            /** StringValue value. */
            public value: string;

            /**
             * Creates a new StringValue instance using the specified properties.
             * @param [properties] Properties to set
             * @returns StringValue instance
             */
            public static create(properties?: google.protobuf.IStringValue): google.protobuf.StringValue;

            /**
             * Encodes the specified StringValue message. Does not implicitly {@link google.protobuf.StringValue.verify|verify} messages.
             * @param message StringValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IStringValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a StringValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns StringValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.StringValue;
        }

        /** Properties of a BytesValue. */
        interface IBytesValue {

            /** BytesValue value */
            value?: (Uint8Array|null);
        }

        /** Represents a BytesValue. */
        class BytesValue implements IBytesValue {

            /**
             * Constructs a new BytesValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IBytesValue);

            /** BytesValue value. */
            public value: Uint8Array;

            /**
             * Creates a new BytesValue instance using the specified properties.
             * @param [properties] Properties to set
             * @returns BytesValue instance
             */
            public static create(properties?: google.protobuf.IBytesValue): google.protobuf.BytesValue;

            /**
             * Encodes the specified BytesValue message. Does not implicitly {@link google.protobuf.BytesValue.verify|verify} messages.
             * @param message BytesValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IBytesValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a BytesValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns BytesValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.BytesValue;
        }
    }
}
