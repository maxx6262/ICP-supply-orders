#!/bin/sh

dfx canister call Itemp getItems
#  expect void

dfx canister call Item addItem '(record {
  "name"= "first item";
  "description"= "first item in catalog";
  })'
# Result expect with Item type filled

dfx canister call Item getItems
# expect same i.e. Record of First item, that is currently the one in catalog
#  we expect record filled with good id value, createdAt current timestamp, no stock and no updated value
dfx canister call addItem '(record {
  "name"= "other item";
  "description"= "other thing referenced into catalog"
})'
# Result with second item filled as Item

dfx canister call Item addItem '( record {
  "name"= "Last item from unitary tests pool";
  "description"=  "this is the last item from this wave";
})'
# Result with last item filled as Item

