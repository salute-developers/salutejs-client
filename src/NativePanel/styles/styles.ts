import { fontFace } from '../fonts';

import { BubbleStyles, BubbleMDStyles, BubbleSMStyles } from './Bubble';
import { SphereButtonStyles, SphereButtonMDStyles, SphereButtonSMStyles } from './SphereButton';
import { CarouselTouchStyles } from './CarouselTouch';
import { KeyboardTouchStyles } from './KeyboardTouch';
import { VoiceTouchStyles } from './VoiceTouch';
import {
    SuggestsStyles,
    SuggestLGStyles,
    SuggestMDStyles,
    SuggestSMStyles,
    SuggestFilledStyles,
    SuggestOutlinedStyles,
} from './Suggests';
import { TextInputStyles, TextInputPureStyles, TextInputFilledStyles } from './TextInput';
import {
    NativePanelStyles,
    NativePanelTouchStyles,
    NativePanelDesktopStyles,
    NativePanelDesktopBubblePositionMD,
    NativePanelDesktopBubblePositionLG,
    NativePanelInputOffsetLGStyles,
    NativePanelInputOffsetMDStyles,
    NativePanelPaddingsLGStyles,
    NativePanelPaddingsMDStyles,
    NativePanelPaddingsSMStyles,
} from './NativePanel';

export const styles = `
${fontFace}
${NativePanelStyles}
${BubbleStyles}
${CarouselTouchStyles}
${KeyboardTouchStyles}
${SphereButtonStyles}
${SuggestsStyles}
${TextInputStyles}
${VoiceTouchStyles}

@keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

/** small */
@media screen and (max-width: 639px) {
    ${NativePanelTouchStyles}
    ${NativePanelPaddingsSMStyles}

    .Bubble {
        ${BubbleMDStyles}
    }

    .SphereButton {
        ${SphereButtonMDStyles}
    }

    .TextInput {
        ${TextInputFilledStyles}
    }

    .SuggestsSuggest {
        ${SuggestMDStyles}
        ${SuggestOutlinedStyles}
    }
}

/** medium */
@media screen and (min-width: 640px) and (max-width: 959px) {
    ${NativePanelDesktopStyles}
    ${NativePanelDesktopBubblePositionMD}
    ${NativePanelInputOffsetMDStyles}
    ${NativePanelPaddingsMDStyles}

    .Bubble {
        ${BubbleSMStyles}
    }

    .SphereButton {
        ${SphereButtonSMStyles}
    }

    .TextInput {
        ${TextInputPureStyles}
    }

    .SuggestsSuggest {
        ${SuggestSMStyles}
        ${SuggestFilledStyles}
    }
}

/** large */
@media screen and (min-width: 960px) {
    ${NativePanelDesktopStyles}
    ${NativePanelDesktopBubblePositionLG}
    ${NativePanelInputOffsetLGStyles}
    ${NativePanelPaddingsLGStyles}

    .bubble {
        font-size: calc(16px * 1.5);
    }

    .Bubble {
        ${BubbleMDStyles}
    }

    .SphereButton {
        ${SphereButtonMDStyles}
    }

    .TextInput {
        ${TextInputPureStyles}
    }
    
    .SuggestsSuggest {
        ${SuggestLGStyles}
        /* ${SuggestMDStyles} */
        ${SuggestFilledStyles}
    }
}
`;
