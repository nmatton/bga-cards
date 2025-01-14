interface AnimationSettings {
    /**
     * The game class. Used to know if the game is in instantaneous mode (replay) becausewe don't want animations in this case.
     */
    game?: Game;
    /**
     * The animation duration, in ms (default: 500).
     */
    duration?: number;
    /**
     * The cumulated scale of the element to animate (default: 1).
     */
    scale?: number;
    /**
     * The zIndex to apply during animation (default: 10).
     */
    zIndex?: number;
    /**
     * The transform property to set after the animation.
     */
    finalTransform?: string;
    /**
     * A function called when animation starts (for example to add a 'animated' class).
     */
    animationStart?: (element: HTMLElement) => any;
    /**
     * A function called when animation ends (for example to add a 'animated' class).
     */
    animationEnd?: (element: HTMLElement) => any;
    /**
     * If the card is rotated at the start of animation.
     */
    rotationDelta?: number;
}
interface AnimationWithOriginSettings extends AnimationSettings {
    /**
     * A delta coordinates (object with x and y properties).
     */
    fromDelta?: {
        x: number;
        y: number;
    };
    /**
     * An initial Rect position. Can be the moved object BoundingClientRect itself, before being attached.
     */
    fromRect?: DOMRect;
    /**
     * The element to move the card from.
     */
    fromElement?: HTMLElement;
}
interface AnimationWithAttachAndOriginSettings extends AnimationWithOriginSettings {
    /**
     * A function called after attaching the element.
     */
    afterAttach?: (element: any, toElement: any) => void;
}
/**
 * Animation function signature. Will return a promise after animation is ended. True, if animation played, false, if it didn't.
 */
declare type AnimationFunction = (element: HTMLElement, settings: AnimationSettings) => Promise<boolean>;
/**
 * Linear slide of the card from origin to destination.
 *
 * @param element the element to animate. The element should be attached to the destination element before the animation starts.
 * @param settings an `AnimationSettings` object
 * @returns a promise when animation ends
 */
declare function slideAnimation(element: HTMLElement, settings: AnimationWithOriginSettings): Promise<boolean>;
declare function shouldAnimate(settings?: AnimationSettings): boolean;
/**
 * Return the x and y delta, based on the animation settings;
 *
 * @param settings an `AnimationSettings` object
 * @returns a promise when animation ends
 */
declare function getDeltaCoordinates(element: HTMLElement, settings: AnimationWithOriginSettings): {
    x: number;
    y: number;
};
declare function logAnimation(element: HTMLElement, settings: AnimationSettings): Promise<boolean>;
interface IZoomManager {
    /**
     * Returns the zoom level
     */
    zoom: number;
}
interface AnimationManagerSettings {
    /**
     * The default animation duration, in ms (default: 500).
     */
    duration?: number;
    /**
     * The zoom manager, providing the current scale.
     */
    zoomManager?: IZoomManager;
}
declare class AnimationManager {
    game: Game;
    private settings?;
    /**
     * The zoom manager, providing the current scale.
     */
    private zoomManager?;
    /**
     * @param game the BGA game class, usually it will be `this`
     * @param settings: a `AnimationManagerSettings` object
     */
    constructor(game: Game, settings?: AnimationManagerSettings);
    /**
     * Attach an element to a parent, then play animation from element's origin to its new position.
     *
     * @param element the element to animate
     * @param toElement the destination parent
     * @param fn the animation function
     * @param settings the animation settings
     * @returns a promise when animation ends
     */
    attachWithAnimation(element: HTMLElement, toElement: HTMLElement, fn: AnimationFunction, settings?: AnimationWithAttachAndOriginSettings): Promise<boolean>;
    /**
     * Attach an element to a parent with a slide animation.
     *
     * @param card the card informations
     */
    attachWithSlideAnimation(element: HTMLElement, toElement: HTMLElement, settings?: AnimationWithAttachAndOriginSettings): Promise<boolean>;
    /**
     * Attach an element to a parent with a slide animation.
     *
     * @param card the card informations
     */
    attachWithShowToScreenAnimation(element: HTMLElement, toElement: HTMLElement, settingsOrSettingsArray?: AnimationSettings | AnimationSettings[]): Promise<boolean>;
    /**
     * Slide from an element.
     *
     * @param element the element to animate
     * @param fromElement the origin element
     * @param settings the animation settings
     * @returns a promise when animation ends
     */
    slideFromElement(element: HTMLElement, fromElement: HTMLElement, settings?: AnimationSettings): Promise<boolean>;
    getZoomManager(): IZoomManager;
    /**
     * Set the zoom manager, to get the scale of the current game.
     *
     * @param zoomManager the zoom manager
     */
    setZoomManager(zoomManager: IZoomManager): void;
    getSettings(): AnimationManagerSettings | null | undefined;
}
interface CardAnimation<T> {
    /**
     * The stock to take the card. It will automatically remove the card from the other stock.
     */
    fromStock?: CardStock<T>;
    /**
     * The element to move the card from.
     */
    fromElement?: HTMLElement;
    /**
     * The side before animation.
     */
    originalSide?: 'front' | 'back';
    /**
     * If the card is rotated at the start of animation.
     */
    rotationDelta?: number;
    /**
     * An animation function, that return a Promise at the end of animation (the promise returns true if animation ended, false otherwise)
     */
    animation?: AnimationFunction;
}
interface CardAnimationSettings {
    /**
     * The side before animation.
     */
    originalSide?: 'front' | 'back';
    /**
     * If the card is rotated at the start of animation.
     */
    rotationDelta?: number;
    /**
     * An animation function, that return a Promise at the end of animation (the promise returns true if animation ended, false otherwise)
     */
    animation?: AnimationFunction;
}
declare type SortFunction = (a: any, b: any) => number;
declare function sortFunction(...sortedFields: string[]): SortFunction;
interface CardStockSettings {
    /**
     * Indicate the card sorting (unset means no sorting, new cards will be added at the end).
     * For example, use `sort: sortFunction('type', '-type_arg')` to sort by type then type_arg (in reversed order if prefixed with `-`).
     * Be sure you typed the values correctly! Else '11' will be before '2'.
     */
    sort?: SortFunction;
}
interface AddCardSettings {
    /**
     * If the card will be on its visible side on the stock
     */
    visible?: boolean;
    forceToElement?: HTMLElement;
    index?: number;
}
declare type CardSelectionMode = 'none' | 'single' | 'multiple';
/**
 * The abstract stock. It shouldn't be used directly, use stocks that extends it.
 */
declare class CardStock<T> {
    protected manager: CardManager<T>;
    protected element: HTMLElement;
    protected cards: T[];
    protected selectedCards: T[];
    protected selectionMode: CardSelectionMode;
    protected sort?: SortFunction;
    /**
     * Called when selection change. Returns the selection.
     *
     * selection: the selected cards of the stock
     * lastChange: the last change on selection card (can be selected or unselected)
     */
    onSelectionChange?: (selection: T[], lastChange: T | null) => void;
    /**
     * Called when selection change. Returns the clicked card.
     *
     * card: the clicked card (can be selected or unselected)
     */
    onCardClick?: (card: T) => void;
    /**
     * @param manager the card manager
     * @param element the stock element (should be an empty HTML Element)
     */
    constructor(manager: CardManager<T>, element: HTMLElement, settings?: CardStockSettings);
    /**
     * @returns the cards on the stock
     */
    getCards(): T[];
    /**
     * @returns if the stock is empty
     */
    isEmpty(): boolean;
    /**
     * @returns the selected cards
     */
    getSelection(): T[];
    /**
     * @param card a card
     * @returns if the card is present in the stock
     */
    contains(card: T): boolean;
    protected cardInStock(card: T): boolean;
    protected cardElementInStock(element: HTMLElement): boolean;
    /**
     * @param card a card in the stock
     * @returns the HTML element generated for the card
     */
    getCardElement(card: T): HTMLElement;
    /**
     * Checks if the card can be added. By default, only if it isn't already present in the stock.
     *
     * @param card the card to add
     * @param settings the addCard settings
     * @returns if the card can be added
     */
    protected canAddCard(card: T, settings?: AddCardSettings): boolean;
    /**
     * Add a card to the stock.
     *
     * @param card the card to add
     * @param animation a `CardAnimation` object
     * @param settings a `AddCardSettings` object
     * @returns the promise when the animation is done (true if it was animated, false if it wasn't)
     */
    addCard(card: T, animation?: CardAnimation<T>, settings?: AddCardSettings): Promise<boolean>;
    protected getNewCardIndex(card: T): number | undefined;
    protected addCardElementToParent(cardElement: HTMLElement, settings?: AddCardSettings): void;
    protected moveFromOtherStock(card: T, cardElement: HTMLElement, animation: CardAnimation<T>, settings?: AddCardSettings): Promise<boolean>;
    protected moveFromElement(card: T, cardElement: HTMLElement, animation: CardAnimation<T>, settings?: AddCardSettings): Promise<boolean>;
    /**
     * Add an array of cards to the stock.
     *
     * @param cards the cards to add
     * @param animation a `CardAnimation` object
     * @param settings a `AddCardSettings` object
     * @param shift if number, the number of milliseconds between each card. if true, chain animations
     */
    addCards(cards: T[], animation?: CardAnimation<T>, settings?: AddCardSettings, shift?: number | boolean): void;
    /**
     * Remove a card from the stock.
     *
     * @param card the card to remove
     */
    removeCard(card: T): void;
    cardRemoved(card: T): void;
    /**
     * Remove a set of card from the stock.
     *
     * @param cards the cards to remove
     */
    removeCards(cards: T[]): void;
    /**
     * Remove all cards from the stock.
     */
    removeAll(): void;
    protected setSelectableCard(card: T, selectable: boolean): void;
    /**
     * Set if the stock is selectable, and if yes if it can be multiple.
     * If set to 'none', it will unselect all selected cards.
     *
     * @param selectionMode the selection mode
     */
    setSelectionMode(selectionMode: CardSelectionMode): void;
    /**
     * Set selected state to a card.
     *
     * @param card the card to select
     */
    selectCard(card: T, silent?: boolean): void;
    /**
     * Set unselected state to a card.
     *
     * @param card the card to unselect
     */
    unselectCard(card: T, silent?: boolean): void;
    /**
     * Select all cards
     */
    selectAll(silent?: boolean): void;
    /**
     * Unelect all cards
     */
    unselectAll(silent?: boolean): void;
    protected bindClick(): void;
    protected cardClick(card: T): void;
    /**
     * @param element The element to animate. The element is added to the destination stock before the animation starts.
     * @param fromElement The HTMLElement to animate from.
     */
    protected animationFromElement(element: HTMLElement, fromElement: HTMLElement, settings: CardAnimationSettings): Promise<boolean>;
    /**
     * Set the card to its front (visible) or back (not visible) side.
     *
     * @param card the card informations
     */
    setCardVisible(card: T, visible: boolean, settings?: FlipCardSettings): void;
    /**
     * Flips the card.
     *
     * @param card the card informations
     */
    flipCard(card: T, settings?: FlipCardSettings): void;
}
interface DeckSettings {
    /**
     * Indicate the width of the deck (should be the width of a card, in px)
     */
    width: number;
    /**
     * Indicate the height of the deck (should be the height of a card, in px)
     */
    height: number;
    /**
     * Indicate the current number of cards in the deck (default 52)
     */
    cardNumber?: number;
    /**
     * Indicate if the line should be centered (default yes)
     */
    autoUpdateCardNumber?: boolean;
    /**
     * Indicate the thresholds to add 1px to the thickness of the pile. Default [0, 2, 5, 10, 20, 30].
     */
    thicknesses?: number[];
    /**
     * Shadow direction. Default 'bottom-right'.
     */
    shadowDirection?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'bottom' | 'left' | 'right';
}
/**
 * Abstract stock to represent a deck. (pile of cards, with a fake 3d effect of thickness).
 */
declare class Deck<T> extends CardStock<T> {
    protected manager: CardManager<T>;
    protected element: HTMLElement;
    protected cardNumber: number;
    protected autoUpdateCardNumber: boolean;
    private thicknesses;
    constructor(manager: CardManager<T>, element: HTMLElement, settings: DeckSettings);
    setCardNumber(cardNumber: number): void;
    addCard(card: T, animation?: CardAnimation<T>, settings?: AddCardSettings): Promise<boolean>;
    cardRemoved(card: T): void;
}
interface LineStockSettings extends CardStockSettings {
    /**
     * Indicate if the line should wrap when needed (default wrap)
     */
    wrap?: 'wrap' | 'nowrap';
    /**
     * Indicate the line direction (default row)
     */
    direction?: 'row' | 'column';
    /**
     * indicate if the line should be centered (default yes)
     */
    center?: boolean;
    /**
    * CSS to set the gap between cards. '8px' if unset.
    */
    gap?: string;
}
/**
 * A basic stock for a list of cards, based on flex.
 */
declare class LineStock<T> extends CardStock<T> {
    protected manager: CardManager<T>;
    protected element: HTMLElement;
    /**
     * @param manager the card manager
     * @param element the stock element (should be an empty HTML Element)
     * @param settings a `LineStockSettings` object
     */
    constructor(manager: CardManager<T>, element: HTMLElement, settings?: LineStockSettings);
}
interface SlotStockSettings<T> extends LineStockSettings {
    /**
     * The ids for the slots (can be number or string)
     */
    slotsIds: SlotId[];
    /**
     * The classes to apply to each slot
     */
    slotClasses?: string[];
    /**
     * How to place the card on a slot automatically
     */
    mapCardToSlot?: (card: T) => SlotId;
}
declare type SlotId = number | string;
interface AddCardToSlotSettings extends AddCardSettings {
    /**
     * The slot to place the card on.
     */
    slot?: SlotId;
}
/**
 * A stock with fixed slots (some can be empty)
 */
declare class SlotStock<T> extends LineStock<T> {
    protected manager: CardManager<T>;
    protected element: HTMLElement;
    protected slotsIds: SlotId[];
    protected slots: HTMLDivElement[];
    protected slotClasses: string[];
    protected mapCardToSlot?: (card: T) => SlotId;
    /**
     * @param manager the card manager
     * @param element the stock element (should be an empty HTML Element)
     * @param settings a `SlotStockSettings` object
     */
    constructor(manager: CardManager<T>, element: HTMLElement, settings: SlotStockSettings<T>);
    protected createSlot(slotId: SlotId): void;
    /**
     * Add a card to the stock.
     *
     * @param card the card to add
     * @param animation a `CardAnimation` object
     * @param settings a `AddCardToSlotSettings` object
     * @returns the promise when the animation is done (true if it was animated, false if it wasn't)
     */
    addCard(card: T, animation?: CardAnimation<T>, settings?: AddCardToSlotSettings): Promise<boolean>;
    /**
     * Change the slots ids. Will empty the stock before re-creating the slots.
     *
     * @param slotsIds the new slotsIds. Will replace the old ones.
     */
    setSlotsIds(slotsIds: SlotId[]): void;
    protected cardElementInStock(element: HTMLElement): boolean;
    protected canAddCard(card: T, settings?: AddCardToSlotSettings): boolean;
}
interface ScrollableStockButtonSettings {
    /**
     * The HTML applied in the button
     */
    html?: string;
    /**
     * The classes added the button
     */
    classes?: string[];
}
interface ScrollableStockSettings extends CardStockSettings {
    /**
     * Setting for the left button
     */
    leftButton: ScrollableStockButtonSettings;
    /**
     * Setting for the right button
     */
    rightButton: ScrollableStockButtonSettings;
    /**
     * indicate the scroll (in px) when clicking the buttons
     */
    scrollStep?: number;
    /**
     * indicate if the scrollbar is visible (default true)
     */
    scrollbarVisible?: boolean;
    /**
    * CSS to set the gap between the buttons and the card container. '0' if unset.
    */
    buttonGap?: string;
    /**
     * indicate if the line should be centered (default yes)
     */
    center?: boolean;
    /**
    * CSS to set the gap between cards. '8px' if unset.
    */
    gap?: string;
}
/**
 * A stock with button to scroll left/right if content is bigger than available width
 */
declare class ScrollableStock<T> extends CardStock<T> {
    protected manager: CardManager<T>;
    protected scrollStep: number;
    protected element: HTMLElement;
    /**
     * @param manager the card manager
     * @param element the stock element (should be an empty HTML Element)
     * @param settings a `SlotStockSettings` object
     */
    constructor(manager: CardManager<T>, elementWrapper: HTMLElement, settings: ScrollableStockSettings);
    protected createButton(side: 'left' | 'right', settings: ScrollableStockButtonSettings): HTMLButtonElement;
    protected scroll(side: 'left' | 'right'): void;
}
interface HandStockSettings extends CardStockSettings {
    /**
     * card overlap, in CSS with unit. Default 60px
     */
    cardOverlap?: string;
    /**
     * card shift, in CSS with unit. Default 15px
     */
    cardShift?: string;
    /**
     * the inclination between each card. Default 12
     */
    inclination?: number;
}
declare class HandStock<T> extends CardStock<T> {
    protected manager: CardManager<T>;
    protected element: HTMLElement;
    protected inclination: number;
    constructor(manager: CardManager<T>, element: HTMLElement, settings: HandStockSettings);
    addCard(card: T, animation?: CardAnimation<T>, settings?: AddCardSettings): Promise<boolean>;
    cardRemoved(card: T): void;
    protected updateAngles(): void;
}
/**
 * A stock with manually placed cards
 */
declare class ManualPositionStock<T> extends CardStock<T> {
    protected manager: CardManager<T>;
    protected element: HTMLElement;
    protected updateDisplay: (element: HTMLElement, cards: T[], lastCard: T, stock: ManualPositionStock<T>) => any;
    /**
     * @param manager the card manager
     * @param element the stock element (should be an empty HTML Element)
     */
    constructor(manager: CardManager<T>, element: HTMLElement, settings: CardStockSettings, updateDisplay: (element: HTMLElement, cards: T[], lastCard: T, stock: ManualPositionStock<T>) => any);
    /**
     * Add a card to the stock.
     *
     * @param card the card to add
     * @param animation a `CardAnimation` object
     * @param settings a `AddCardSettings` object
     * @returns the promise when the animation is done (true if it was animated, false if it wasn't)
     */
    addCard(card: T, animation?: CardAnimation<T>, settings?: AddCardSettings): Promise<boolean>;
    cardRemoved(card: T): void;
}
/**
 * A stock to make cards disappear (to automatically remove discarded cards, or to represent a bag)
 */
declare class VoidStock<T> extends CardStock<T> {
    protected manager: CardManager<T>;
    protected element: HTMLElement;
    /**
     * @param manager the card manager
     * @param element the stock element (should be an empty HTML Element)
     */
    constructor(manager: CardManager<T>, element: HTMLElement);
    /**
     * Add a card to the stock.
     *
     * @param card the card to add
     * @param animation a `CardAnimation` object
     * @param settings a `AddCardSettings` object
     * @returns the promise when the animation is done (true if it was animated, false if it wasn't)
     */
    addCard(card: T, animation?: CardAnimation<T>, settings?: AddCardSettings): Promise<boolean>;
}
declare class HiddenDeck<T> extends Deck<T> {
    protected manager: CardManager<T>;
    protected element: HTMLElement;
    constructor(manager: CardManager<T>, element: HTMLElement, settings: DeckSettings);
    addCard(card: T, animation?: CardAnimation<T>, settings?: AddCardSettings): Promise<boolean>;
}
declare class VisibleDeck<T> extends Deck<T> {
    protected manager: CardManager<T>;
    protected element: HTMLElement;
    constructor(manager: CardManager<T>, element: HTMLElement, settings: DeckSettings);
    addCard(card: T, animation?: CardAnimation<T>, settings?: AddCardSettings): Promise<boolean>;
}
interface AllVisibleDeckSettings extends CardStockSettings {
    /**
     * Indicate the width of a card, in CSS with unit
     */
    width: string;
    /**
     * Indicate the height of a card, in CSS with unit
     */
    height: string;
    /**
     * The shift between each card (default 3)
     */
    shift?: string;
}
declare class AllVisibleDeck<T> extends CardStock<T> {
    protected manager: CardManager<T>;
    protected element: HTMLElement;
    constructor(manager: CardManager<T>, element: HTMLElement, settings: AllVisibleDeckSettings);
    addCard(card: T, animation?: CardAnimation<T>, settings?: AddCardSettings): Promise<boolean>;
    /**
     * Set opened state. If true, all cards will be entirely visible.
     *
     * @param opened indicate if deck must be always opened. If false, will open only on hover/touch
     */
    setOpened(opened: boolean): void;
    cardRemoved(card: T): void;
}
interface CardManagerSettings<T> {
    /**
     * @param card the card informations
     * @return the id for a card
     */
    getId?: (card: T) => string;
    /**
     * @param card the card informations
     * @param element the card main Div element. You can add a class (to set width/height), change dataset, ... based on the card informations. There should be no visual informations on it, as it will be set on front/back Divs.
     * @return the id for a card
     */
    setupDiv?: (card: T, element: HTMLDivElement) => void;
    /**
     * @param card the card informations
     * @param element the card main Div element. You can add a class (to set width/height), change dataset, ... based on the card informations. There should be no visual informations on it, as it will be set on front/back Divs.
     * @return the id for a card
     */
    setupFrontDiv?: (card: T, element: HTMLDivElement) => void;
    /**
     * @param card the card informations
     * @param element  the card back Div element. You can add a class, change dataset, set background for the back side
     * @return the id for a card
     */
    setupBackDiv?: (card: T, element: HTMLDivElement) => void;
    /**
     * @param card the card informations
     * @param element  the card back Div element. You can add a class, change dataset, set background for the back side
     * @return the id for a card
     */
    animationManager?: AnimationManager;
}
interface FlipCardSettings {
    updateFront: boolean;
    updateBack: boolean;
    updateData: boolean;
}
declare class CardManager<T> {
    game: Game;
    private settings;
    animationManager: AnimationManager;
    private stocks;
    /**
     * @param game the BGA game class, usually it will be `this`
     * @param settings: a `CardManagerSettings` object
     */
    constructor(game: Game, settings: CardManagerSettings<T>);
    addStock(stock: CardStock<T>): void;
    /**
     * @param card the card informations
     * @return the id for a card
     */
    getId(card: T): string;
    createCardElement(card: T, visible?: boolean): HTMLDivElement;
    /**
     * @param card the card informations
     * @return the HTML element of an existing card
     */
    getCardElement(card: T): HTMLElement;
    removeCard(card: T): void;
    /**
     * @param card the card informations
     * @return the stock containing the card
     */
    getCardStock(card: T): CardStock<T>;
    /**
     * Set the card to its front (visible) or back (not visible) side.
     *
     * @param card the card informations
     */
    setCardVisible(card: T, visible: boolean, settings?: FlipCardSettings): void;
    /**
     * Flips the card.
     *
     * @param card the card informations
     */
    flipCard(card: T, settings?: FlipCardSettings): void;
}
declare const define: any;
