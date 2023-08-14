#!/bin/sh

dfx canister call Item getItem '({$1})'
# expect requested item


dfx canister call Item updateItem '({$1}, record {
  "name": "{$2}";
  "description": "{$3}"
})'
# expect updated item

dfx canister call Item disableItem '({$1})'
# expect item disabled

dfx canister call Item getItem '({$1})'
# expect requested item still disabled with true update time

dfx canister call Item enableItem '({$1})'
# expect item enabled

dfx canister call Item addSupplyStock '({$1}, 10.)'
# expect item with stock = 10

dfx canister call Item decreaseStock '({$1}, 4.)'
# expect item with stock = 10 - 4 = 6

dfx canister call Item deleteItem '({$1})'
# expect removed item