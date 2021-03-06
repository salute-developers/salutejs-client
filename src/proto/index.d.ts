import * as $protobuf from "protobufjs";
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
     * Encodes the specified Message message, length delimited. Does not implicitly {@link Message.verify|verify} messages.
     * @param message Message message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Message message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Message
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Message;

    /**
     * Decodes a Message message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Message
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Message;

    /**
     * Verifies a Message message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Message message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Message
     */
    public static fromObject(object: { [k: string]: any }): Message;

    /**
     * Creates a plain object from a Message message. Also converts values to other types if specified.
     * @param message Message
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Message, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Message to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
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
     * Encodes the specified InitialSettings message, length delimited. Does not implicitly {@link InitialSettings.verify|verify} messages.
     * @param message InitialSettings message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IInitialSettings, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an InitialSettings message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns InitialSettings
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): InitialSettings;

    /**
     * Decodes an InitialSettings message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns InitialSettings
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): InitialSettings;

    /**
     * Verifies an InitialSettings message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an InitialSettings message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns InitialSettings
     */
    public static fromObject(object: { [k: string]: any }): InitialSettings;

    /**
     * Creates a plain object from an InitialSettings message. Also converts values to other types if specified.
     * @param message InitialSettings
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: InitialSettings, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this InitialSettings to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
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
     * Encodes the specified Device message, length delimited. Does not implicitly {@link Device.verify|verify} messages.
     * @param message Device message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IDevice, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Device message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Device
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Device;

    /**
     * Decodes a Device message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Device
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Device;

    /**
     * Verifies a Device message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Device message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Device
     */
    public static fromObject(object: { [k: string]: any }): Device;

    /**
     * Creates a plain object from a Device message. Also converts values to other types if specified.
     * @param message Device
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Device, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Device to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
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
     * Encodes the specified Settings message, length delimited. Does not implicitly {@link Settings.verify|verify} messages.
     * @param message Settings message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISettings, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Settings message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Settings
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Settings;

    /**
     * Decodes a Settings message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Settings
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Settings;

    /**
     * Verifies a Settings message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Settings message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Settings
     */
    public static fromObject(object: { [k: string]: any }): Settings;

    /**
     * Creates a plain object from a Settings message. Also converts values to other types if specified.
     * @param message Settings
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Settings, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Settings to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
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
     * Encodes the specified LegacyDevice message, length delimited. Does not implicitly {@link LegacyDevice.verify|verify} messages.
     * @param message LegacyDevice message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ILegacyDevice, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a LegacyDevice message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns LegacyDevice
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): LegacyDevice;

    /**
     * Decodes a LegacyDevice message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns LegacyDevice
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): LegacyDevice;

    /**
     * Verifies a LegacyDevice message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a LegacyDevice message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns LegacyDevice
     */
    public static fromObject(object: { [k: string]: any }): LegacyDevice;

    /**
     * Creates a plain object from a LegacyDevice message. Also converts values to other types if specified.
     * @param message LegacyDevice
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: LegacyDevice, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this LegacyDevice to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
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
     * Encodes the specified Voice message, length delimited. Does not implicitly {@link Voice.verify|verify} messages.
     * @param message Voice message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IVoice, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Voice message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Voice
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Voice;

    /**
     * Decodes a Voice message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Voice
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Voice;

    /**
     * Verifies a Voice message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Voice message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Voice
     */
    public static fromObject(object: { [k: string]: any }): Voice;

    /**
     * Creates a plain object from a Voice message. Also converts values to other types if specified.
     * @param message Voice
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Voice, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Voice to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
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
     * Encodes the specified Text message, length delimited. Does not implicitly {@link Text.verify|verify} messages.
     * @param message Text message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IText, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Text message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Text
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Text;

    /**
     * Decodes a Text message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Text
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Text;

    /**
     * Verifies a Text message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Text message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Text
     */
    public static fromObject(object: { [k: string]: any }): Text;

    /**
     * Creates a plain object from a Text message. Also converts values to other types if specified.
     * @param message Text
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Text, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Text to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
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
     * Encodes the specified SystemMessage message, length delimited. Does not implicitly {@link SystemMessage.verify|verify} messages.
     * @param message SystemMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISystemMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a SystemMessage message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SystemMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SystemMessage;

    /**
     * Decodes a SystemMessage message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SystemMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SystemMessage;

    /**
     * Verifies a SystemMessage message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a SystemMessage message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SystemMessage
     */
    public static fromObject(object: { [k: string]: any }): SystemMessage;

    /**
     * Creates a plain object from a SystemMessage message. Also converts values to other types if specified.
     * @param message SystemMessage
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: SystemMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this SystemMessage to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
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
     * Encodes the specified Status message, length delimited. Does not implicitly {@link Status.verify|verify} messages.
     * @param message Status message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IStatus, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Status message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Status
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Status;

    /**
     * Decodes a Status message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Status
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Status;

    /**
     * Verifies a Status message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Status message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Status
     */
    public static fromObject(object: { [k: string]: any }): Status;

    /**
     * Creates a plain object from a Status message. Also converts values to other types if specified.
     * @param message Status
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Status, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Status to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
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
     * Encodes the specified Bytes message, length delimited. Does not implicitly {@link Bytes.verify|verify} messages.
     * @param message Bytes message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IBytes, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Bytes message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Bytes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Bytes;

    /**
     * Decodes a Bytes message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Bytes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Bytes;

    /**
     * Verifies a Bytes message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Bytes message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Bytes
     */
    public static fromObject(object: { [k: string]: any }): Bytes;

    /**
     * Creates a plain object from a Bytes message. Also converts values to other types if specified.
     * @param message Bytes
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Bytes, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Bytes to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
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
     * Encodes the specified DevContext message, length delimited. Does not implicitly {@link DevContext.verify|verify} messages.
     * @param message DevContext message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IDevContext, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a DevContext message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DevContext
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): DevContext;

    /**
     * Decodes a DevContext message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DevContext
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): DevContext;

    /**
     * Verifies a DevContext message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a DevContext message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DevContext
     */
    public static fromObject(object: { [k: string]: any }): DevContext;

    /**
     * Creates a plain object from a DevContext message. Also converts values to other types if specified.
     * @param message DevContext
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: DevContext, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this DevContext to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
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
     * Encodes the specified Cancel message, length delimited. Does not implicitly {@link Cancel.verify|verify} messages.
     * @param message Cancel message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICancel, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Cancel message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Cancel
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Cancel;

    /**
     * Decodes a Cancel message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Cancel
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Cancel;

    /**
     * Verifies a Cancel message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Cancel message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Cancel
     */
    public static fromObject(object: { [k: string]: any }): Cancel;

    /**
     * Creates a plain object from a Cancel message. Also converts values to other types if specified.
     * @param message Cancel
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Cancel, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Cancel to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
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
     * Encodes the specified Mute message, length delimited. Does not implicitly {@link Mute.verify|verify} messages.
     * @param message Mute message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IMute, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Mute message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Mute
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Mute;

    /**
     * Decodes a Mute message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Mute
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Mute;

    /**
     * Verifies a Mute message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Mute message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Mute
     */
    public static fromObject(object: { [k: string]: any }): Mute;

    /**
     * Creates a plain object from a Mute message. Also converts values to other types if specified.
     * @param message Mute
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Mute, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Mute to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
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
     * Encodes the specified GetHistoryRequest message, length delimited. Does not implicitly {@link GetHistoryRequest.verify|verify} messages.
     * @param message GetHistoryRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IGetHistoryRequest, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a GetHistoryRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GetHistoryRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GetHistoryRequest;

    /**
     * Decodes a GetHistoryRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GetHistoryRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GetHistoryRequest;

    /**
     * Verifies a GetHistoryRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a GetHistoryRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GetHistoryRequest
     */
    public static fromObject(object: { [k: string]: any }): GetHistoryRequest;

    /**
     * Creates a plain object from a GetHistoryRequest message. Also converts values to other types if specified.
     * @param message GetHistoryRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: GetHistoryRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this GetHistoryRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
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
     * Encodes the specified App message, length delimited. Does not implicitly {@link App.verify|verify} messages.
     * @param message App message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IApp, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an App message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns App
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): App;

    /**
     * Decodes an App message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns App
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): App;

    /**
     * Verifies an App message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an App message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns App
     */
    public static fromObject(object: { [k: string]: any }): App;

    /**
     * Creates a plain object from an App message. Also converts values to other types if specified.
     * @param message App
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: App, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this App to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
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
     * Encodes the specified Offset message, length delimited. Does not implicitly {@link Offset.verify|verify} messages.
     * @param message Offset message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IOffset, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Offset message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Offset
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Offset;

    /**
     * Decodes an Offset message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Offset
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Offset;

    /**
     * Verifies an Offset message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an Offset message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Offset
     */
    public static fromObject(object: { [k: string]: any }): Offset;

    /**
     * Creates a plain object from an Offset message. Also converts values to other types if specified.
     * @param message Offset
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Offset, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Offset to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
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
     * Encodes the specified ChatHistoryRequest message, length delimited. Does not implicitly {@link ChatHistoryRequest.verify|verify} messages.
     * @param message ChatHistoryRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IChatHistoryRequest, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a ChatHistoryRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ChatHistoryRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ChatHistoryRequest;

    /**
     * Decodes a ChatHistoryRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ChatHistoryRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ChatHistoryRequest;

    /**
     * Verifies a ChatHistoryRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a ChatHistoryRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ChatHistoryRequest
     */
    public static fromObject(object: { [k: string]: any }): ChatHistoryRequest;

    /**
     * Creates a plain object from a ChatHistoryRequest message. Also converts values to other types if specified.
     * @param message ChatHistoryRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ChatHistoryRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ChatHistoryRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
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
     * Encodes the specified Uuid message, length delimited. Does not implicitly {@link Uuid.verify|verify} messages.
     * @param message Uuid message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IUuid, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Uuid message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Uuid
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Uuid;

    /**
     * Decodes an Uuid message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Uuid
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Uuid;

    /**
     * Verifies an Uuid message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an Uuid message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Uuid
     */
    public static fromObject(object: { [k: string]: any }): Uuid;

    /**
     * Creates a plain object from an Uuid message. Also converts values to other types if specified.
     * @param message Uuid
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Uuid, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Uuid to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
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
     * Encodes the specified GetHistoryResponse message, length delimited. Does not implicitly {@link GetHistoryResponse.verify|verify} messages.
     * @param message GetHistoryResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IGetHistoryResponse, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a GetHistoryResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GetHistoryResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GetHistoryResponse;

    /**
     * Decodes a GetHistoryResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GetHistoryResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GetHistoryResponse;

    /**
     * Verifies a GetHistoryResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a GetHistoryResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GetHistoryResponse
     */
    public static fromObject(object: { [k: string]: any }): GetHistoryResponse;

    /**
     * Creates a plain object from a GetHistoryResponse message. Also converts values to other types if specified.
     * @param message GetHistoryResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: GetHistoryResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this GetHistoryResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
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
     * Encodes the specified HistoryMessages message, length delimited. Does not implicitly {@link HistoryMessages.verify|verify} messages.
     * @param message HistoryMessages message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IHistoryMessages, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a HistoryMessages message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns HistoryMessages
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): HistoryMessages;

    /**
     * Decodes a HistoryMessages message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns HistoryMessages
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): HistoryMessages;

    /**
     * Verifies a HistoryMessages message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a HistoryMessages message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns HistoryMessages
     */
    public static fromObject(object: { [k: string]: any }): HistoryMessages;

    /**
     * Creates a plain object from a HistoryMessages message. Also converts values to other types if specified.
     * @param message HistoryMessages
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: HistoryMessages, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this HistoryMessages to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
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
             * Encodes the specified DoubleValue message, length delimited. Does not implicitly {@link google.protobuf.DoubleValue.verify|verify} messages.
             * @param message DoubleValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IDoubleValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DoubleValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DoubleValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.DoubleValue;

            /**
             * Decodes a DoubleValue message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DoubleValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.DoubleValue;

            /**
             * Verifies a DoubleValue message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DoubleValue message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DoubleValue
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.DoubleValue;

            /**
             * Creates a plain object from a DoubleValue message. Also converts values to other types if specified.
             * @param message DoubleValue
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.DoubleValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DoubleValue to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
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
             * Encodes the specified FloatValue message, length delimited. Does not implicitly {@link google.protobuf.FloatValue.verify|verify} messages.
             * @param message FloatValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IFloatValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FloatValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FloatValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FloatValue;

            /**
             * Decodes a FloatValue message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FloatValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FloatValue;

            /**
             * Verifies a FloatValue message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FloatValue message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FloatValue
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.FloatValue;

            /**
             * Creates a plain object from a FloatValue message. Also converts values to other types if specified.
             * @param message FloatValue
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.FloatValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FloatValue to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
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
             * Encodes the specified Int64Value message, length delimited. Does not implicitly {@link google.protobuf.Int64Value.verify|verify} messages.
             * @param message Int64Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IInt64Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Int64Value message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Int64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Int64Value;

            /**
             * Decodes an Int64Value message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Int64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Int64Value;

            /**
             * Verifies an Int64Value message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Int64Value message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Int64Value
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Int64Value;

            /**
             * Creates a plain object from an Int64Value message. Also converts values to other types if specified.
             * @param message Int64Value
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Int64Value, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Int64Value to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
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
             * Encodes the specified UInt64Value message, length delimited. Does not implicitly {@link google.protobuf.UInt64Value.verify|verify} messages.
             * @param message UInt64Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IUInt64Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a UInt64Value message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns UInt64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.UInt64Value;

            /**
             * Decodes a UInt64Value message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns UInt64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.UInt64Value;

            /**
             * Verifies a UInt64Value message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a UInt64Value message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns UInt64Value
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.UInt64Value;

            /**
             * Creates a plain object from a UInt64Value message. Also converts values to other types if specified.
             * @param message UInt64Value
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.UInt64Value, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this UInt64Value to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
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
             * Encodes the specified Int32Value message, length delimited. Does not implicitly {@link google.protobuf.Int32Value.verify|verify} messages.
             * @param message Int32Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IInt32Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Int32Value message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Int32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Int32Value;

            /**
             * Decodes an Int32Value message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Int32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Int32Value;

            /**
             * Verifies an Int32Value message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Int32Value message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Int32Value
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Int32Value;

            /**
             * Creates a plain object from an Int32Value message. Also converts values to other types if specified.
             * @param message Int32Value
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Int32Value, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Int32Value to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
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
             * Encodes the specified UInt32Value message, length delimited. Does not implicitly {@link google.protobuf.UInt32Value.verify|verify} messages.
             * @param message UInt32Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IUInt32Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a UInt32Value message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns UInt32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.UInt32Value;

            /**
             * Decodes a UInt32Value message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns UInt32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.UInt32Value;

            /**
             * Verifies a UInt32Value message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a UInt32Value message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns UInt32Value
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.UInt32Value;

            /**
             * Creates a plain object from a UInt32Value message. Also converts values to other types if specified.
             * @param message UInt32Value
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.UInt32Value, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this UInt32Value to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
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
             * Encodes the specified BoolValue message, length delimited. Does not implicitly {@link google.protobuf.BoolValue.verify|verify} messages.
             * @param message BoolValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IBoolValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a BoolValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns BoolValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.BoolValue;

            /**
             * Decodes a BoolValue message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns BoolValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.BoolValue;

            /**
             * Verifies a BoolValue message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a BoolValue message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns BoolValue
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.BoolValue;

            /**
             * Creates a plain object from a BoolValue message. Also converts values to other types if specified.
             * @param message BoolValue
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.BoolValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this BoolValue to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
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
             * Encodes the specified StringValue message, length delimited. Does not implicitly {@link google.protobuf.StringValue.verify|verify} messages.
             * @param message StringValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IStringValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a StringValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns StringValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.StringValue;

            /**
             * Decodes a StringValue message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns StringValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.StringValue;

            /**
             * Verifies a StringValue message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a StringValue message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns StringValue
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.StringValue;

            /**
             * Creates a plain object from a StringValue message. Also converts values to other types if specified.
             * @param message StringValue
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.StringValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this StringValue to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
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
             * Encodes the specified BytesValue message, length delimited. Does not implicitly {@link google.protobuf.BytesValue.verify|verify} messages.
             * @param message BytesValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IBytesValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a BytesValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns BytesValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.BytesValue;

            /**
             * Decodes a BytesValue message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns BytesValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.BytesValue;

            /**
             * Verifies a BytesValue message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a BytesValue message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns BytesValue
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.BytesValue;

            /**
             * Creates a plain object from a BytesValue message. Also converts values to other types if specified.
             * @param message BytesValue
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.BytesValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this BytesValue to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }
}
