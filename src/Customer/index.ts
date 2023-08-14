import { $query, $update, Record, match, Vec, StableBTreeMap, ic, Opt, nat64, Result, int } from "azle";
import { v4 as uuidv4 } from 'uuid';

/**
 * This type represents people ordering products from suppliers
 */

type Customer =         Record<{
            id:             string;
            name:           string;
            postalAdress:   string;
            contact:        string;
            createdAt:      nat64;
            updatedAt:      Opt<nat64>;
            isWaitingOrder: boolean;
            lastActionAt:   nat64;
            }>

type CustomerPayload =  Record<{
            name:           string;
            postalAdress:   string;
            contact:        string;
}>

const customers = new StableBTreeMap<string, Customer>(0, 44, 1024);

$query;
export function getCustomers(): Result<Vec<Customer>, string> {
    return Result.Ok<Vec<Customer>, string>(customers.values());
}

$query;
export function getCustomer(id: string): Result<Customer, string> {
    return match(customers.get(id), {
        Some: (customer) => Result.Ok<Customer, string>(customer),
        None: () => Result.Err<Customer,string>(`Customer with id=${id} not found.`)
    });
}

$update;
export function addCustomer(payload: CustomerPayload): Result<Customer, string> {
    const customer: Customer = { id: uuidv4(), createdAt: ic.time(), updatedAt: Opt.None, isWaitingOrder: false, lastActionAt: ic.time(), ...payload};
    customers.insert(customer.id, customer);
    return Result.Ok<Customer, string>(customer);
}

$update;
export function updateCustomer(id: string, payload: CustomerPayload): Result<Customer, string> {
    return match(customers.get(id), {
        Some: (customer) => {
            const updatedCustomer: Customer = {...customer, ...payload, updatedAt: Opt.Some(ic.time()), lastActionAt: ic.time()};
            customer.insert(customer.id, customer);
            return Result.Ok<Customer, string>(customer);
        },
        None: () => Result.Err<Customer, string>(`couldn't update customer cause customer with id=${id} not found.`)
    });
}

$update;
export function deleteCustomer(id: string): Result<Customer, string> {
    return match(customers.get(id), {
        Some: (customer) => {
            customers.remove(id);
            return Result.Ok<Customer, string>(customer)
        },
        None: () => Result.Err<Customer, string>(`couldn't delete customer cause customer with id=${id} not found`)
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