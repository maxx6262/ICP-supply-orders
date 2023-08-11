import { $query, $update, Record, StableBTreeMap, Vec, match, Result, nat64, ic, Opt } from 'azle';
import { v4 as uuidv4 } from 'uuid';

/**
 * This type represents an asset that can be bought or put on sale
 */

type Item = Record<{
    id:                     string;
    name:                   string;
    description:            string;
    firstReferenceAt:       nat64;
    stockEstimation:        Opt<nat64>;
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
export function addItem(payload: ItemPayload) {
    const item: Item = { id: uuidv4(), firstReferenceAt: ic.time(), stockEstimation: Opt.None, disabled: false, updatedAt: Opt.None, ...payload };
    common_catalog.insert(item.id, item);
    return Result.Ok(item);
}
