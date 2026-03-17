import { CURRENCY } from '../config.js';

export function formatCurrency(amount) {
    return `${CURRENCY.SYMBOL}${amount.toFixed(2)}`;
}

export function formatCurrencyWithZar(amount) {
    const zar = amount * CURRENCY.ZAR_ESTIMATE;
    return `${formatCurrency(amount)} (~R${zar.toFixed(0)} ZAR)`;
}
