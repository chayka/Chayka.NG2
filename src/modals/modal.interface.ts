/**
 * This interface is used to setup modal popup buttons
 */
export interface ModalButtonInterface {

    /**
     * Button text
     */
    text: string,

    /**
     * Button click callback
     */
    click?: () => void,

    /**
     * If true then modal popup is not closed upon button click
     */
    persist?: boolean,

    /**
     * CSS classes that is applied to button.
     * If button classes mapping is setup using buttons service
     * then translation will be done automatically
     * (e.g. 'danger' -> 'button-danger')
     */
    cls?: string[],
}

/**
 * This interface is used to setup modal component instance
 */
export interface ModalInterface {

    /**
     * Content of modal window
     */
    content: string,

    /**
     * Modal popup title
     */
    title?: string,

    /**
     * Modal popup buttons
     */
    buttons?: ModalButtonInterface[]

    /**
     * Modal popup classes
     */
    cls: string[],

    /**
     * CSS value of width property
     */
    width?: string,

    /**
     * CSS value of height property
     */
    height?: string,
}