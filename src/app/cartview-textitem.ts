import { CardViewItem } from './Classes/CartviewTextitem';
import { CardViewBaseItemModel, DynamicComponentModel,CardViewTextItemPipeProperty,CardViewTextItemProperties } from '@alfresco/adf-core';
export class CardViewTextItemModel extends CardViewBaseItemModel implements CardViewItem, DynamicComponentModel {
    type: string = 'text';
    inputType: string = 'text';
    multiline?: boolean;
    pipes?: CardViewTextItemPipeProperty[];
    clickCallBack?: any;

    constructor(cardViewTextItemProperties: CardViewTextItemProperties) {
        super(cardViewTextItemProperties);
        this.multiline = !!cardViewTextItemProperties.multiline;
        this.pipes = cardViewTextItemProperties.pipes || [];
        this.clickCallBack = cardViewTextItemProperties.clickCallBack ? cardViewTextItemProperties.clickCallBack : null;

        if (this.default && this.isEmpty()) {
            this.value = this.default;
        }
    }

    get displayValue(): string {
        return this.applyPipes(this.value);
    }

    applyPipes(displayValue) {
        if (this.pipes.length) {
            displayValue = this.pipes.reduce((accumulator, { pipe, params = [] }) => {
                return pipe.transform(accumulator, ...params);
            }, displayValue);
        }
        return displayValue;
    }
}