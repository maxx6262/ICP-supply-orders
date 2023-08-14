#!/bin/sh
dfx canister call Customer getCustomers '()'
dfx canister call Customer addCustomer '( record {
  "name"= "Maxime LECOUSTRE";
  "postalAdress": "25 rue Jules Guesdes, 62620 Barlin, France";
  "contact": "mlecoustre@proton.mail";
})'
dfx canister call Customer getCustomers '()'
