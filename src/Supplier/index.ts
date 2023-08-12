import { $query, $update, Record, StableBTreeMap, Vec, match, Result, nat64, ic, Opt, int } from "azle";
import { v4 as uuidv4 } from 'uuid';

/**
 * This type represents supplier who supply
 * orderable items to customers through common catalog
 */
type Supplier = Record<{
    id:             string;
    name:           string;
    description:    string;
    isActive:       boolean;
    createdAt:      nat64;
    updatedAt:      Opt<nat64>;
    lastActivityAt: Opt<nat64>;
}>

type supplierPayload = Record<{
    name:           string;
    descriptions:   string;

}>

const suppliers = new StableBTreeMap<string, Supplier>(0, 44, 1024);

$query;
export function getSuppliers(): Result<Vec<Supplier>, string> {
    return Result.Ok(suppliers.values());
}

$query;
export function getSupplier(id: string): Result<Supplier, string> {
    return match(suppliers.get(id), {
        Some: (supplier) => Result.Ok<Supplier, string>(supplier),
        None: () => Result.Err<Supplier, string>(`Supplier with id=${id} not found`)
    });
}

$update;
export function addSupplier(payload: supplierPayload): Result<Supplier, string> {
    const supplier: Supplier = { id: uuidv4(), isActive: true, createdAt: ic.time(), updatedAt: Opt.None, lastActivityAt: Opt.None, ...payload };
    suppliers.insert(supplier.id, supplier);
    return Result.Ok<Supplier, string>(supplier);
}

$update;
export function updateSupplier(id: string, payload: supplierPayload): Result<Supplier, string> {
    return match(suppliers.get(id), {
        Some: (supplier) => {
            const updatedSupplier: Supplier = {...supplier, ...updateSupplier, updatedAt: Opt.Some(ic.time())};
            suppliers.insert(supplier.id, updatedSupplier);
            return Result.Ok<Supplier, string>(updatedSupplier)
        },
        None: () => Result.Err<Supplier, string>(`Supplier with id=${id} not found`)
    });
}

$update;
export function disableSupplier(id: string): Result<Supplier, string> {
    return match(suppliers.get(id), {
        Some: (supplier) => {
            const disabledSupplier: Supplier = {...supplier, isActive: false, updatedAt: Opt.Some(ic.time())};
            suppliers.insert(supplier.id, disabledSupplier);
            return Result.Ok<Supplier, string>(disabledSupplier)
        },
        None: () => Result.Err<Supplier, string>(`Supplier with id=${id} not found`)
    });
}

$update;
export function deleteSupplier(id: string): Result<Supplier, string> {
    return match(suppliers.get(id), {
        Some: (supplier) => {
            const deletedSupplier: Supplier = {...supplier, isActive: false, updatedAt: Opt.Some(ic.time())};
            suppliers.remove(supplier.id);
            return Result.Ok<Supplier, string>(deletedSupplier)
        },
        None: () => Result.Err<Supplier, string>(`couldn't delete supplier cause no supplier with id=${id} found`)
    });
}
