import { $query, $update, Record, StableBTreeMap, Vec, match, Result, nat64, ic, Opt } from 'azle';
import { v4 as uuidv4 } from 'uuid';

// First of all, we manage products & items supplied and orderable

/**
 * This type represents an asset that can be bought or put on sale
 */

type Item = Record<{
    id:                     string;
    name:                   string;
    description:            string;
    firstReferenceAt:       nat64;
    stockEstimation:        number;
    disabled:               boolean;
    updatedAt:              Opt<nat64>;
}>
type ItemPayload = Record<{
    name:           string;
    description:    string;
}>

const common_catalog = new StableBTreeMap<string, Item>(0, 44, 1024);

$query;
export function getItems(): Result<Vec<Item>, string> {
    return Result.Ok(common_catalog.values());
}

$query;
export function getItem(id: string): Result<Item, string> {
    return match(common_catalog.get(id), {
        Some: (item) => Result.Ok<Item, string>(item),
        None: () => Result.Err<Item, string>(`Item with id=${id} not found.`)
    });
}

$update
export function addItem(payload: ItemPayload): Result<Item, string> {
    const item: Item = { id: uuidv4(), firstReferenceAt: ic.time(), stockEstimation: 0, disabled: false, updatedAt: Opt.None, ...payload };
    common_catalog.insert(item.id, item);
    return Result.Ok(item);
}

$update;
export function updateItem(id: string, payload: ItemPayload): Result<Item, string> {
    return match(common_catalog.get(id), {
        Some: (item) => {
            const updatedItem: Item = {...item, ...payload, updatedAt: Opt.Some(ic.time())};
            return Result.Ok<Item, string>(updatedItem);
        },
        None: () => Result.Err<Item, string>(`couldn't update item specifications. Item with id=${id} not found`)
    });
}

$update;
export function disableItem(id: string): Result<Item, string> {
    return match(common_catalog.get(id), {
        Some: (item) => {
            const disabledItem: Item = {...item, disabled: true, updatedAt: Opt.Some(ic.time())};
            return Result.Ok<Item, string>(disabledItem);
        },
        None: () => Result.Err<Item, string>(`couldn't disable item. Item with id=${id} not found`)
    });
}

$update;
export function enableItem(id: string): Result<Item, string> {
    return match(common_catalog.get(id), {
        Some: (item) => {
            const enabledItem: Item = {...item, disabled: false, updatedAt: Opt.Some(ic.time())};
            return Result.Ok<Item, string>(enabledItem);
        },
        None: () => Result.Err<Item, string>(`couldn't enable item. Item with id=${id} not found`)
    });
}

$update;
export function addSupplyStock(id: string, quantity: number): Result<Item, string> {
    return match(common_catalog.get(id), {
        Some: (item) => {
            const suppliedItem: Item = {...item, stockEstimation: item.stockEstimation + quantity, updatedAt: Opt.Some(ic.time())};
            return Result.Ok<Item, string>(suppliedItem);
        },
        None: () => Result.Err<Item, string>(`could't increase stock on item. Item with id=${id} not found`)
    });
}

$update;
export function decreaseStock(id: string, quantity: number): Result<Item, string> {
    return match(common_catalog.get(id), {
        Some: (item) => {
            const unstockedItem: Item = {...item, stockEstimation: item.stockEstimation - quantity, updatedAt: Opt.Some(ic.time())};
            return Result.Ok<Item, string>(unstockedItem);
        },
        None: () => Result.Err<Item, string>(`couldn't decrease stock. Item with id=${id} not found`)
    });
}



// a workaround to make uuid package work with Azle
globalThis.crypto = {
    getRandomValues: () => {
        let array = new Uint8Array(32);
        for(let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }
        return array;
    }
}