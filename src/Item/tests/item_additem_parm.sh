#!/bin/sh
dfx canister call Item addItem '(record {
  "name"= "$1";
  "decription"= "$2";
})'

# expected = Item type filled