# ICP-supply-orders
ICP canister trying to provide best supply solution from many assets needing list
Smart way to improve asset management in order preparation from stock from many suppliers
## Actors and type of objects

### Products & Items
Products and items can be anything that any customer may order, and for that there is at least one supplier able to provide it. 
There is a type to represents that is an item, and allowing us to find any referenced product.

##### Item/Product 
An item or a product may be anything that can be identifiable in a common catalog. These items are fungible. Supply way doesn't matter. 
* Item can be supplied from many different suppliers, it will be same case since it has same reference from common catalog *
* Only referenced products can be ordered or supplied
* Product can be added on common catalog through legit supplier request
* 
All products are reachable through common catalog distribution.

#### Catalog, Common Product Catalog
Catalog is a common reference base about items/products supplied orderable by customers.
It would be updated by
* adding new product when legit supplier requests it
* disable any item when no supplier able to provide supply
* enable a previous disabled one as any supplier having new supply
* deleted when no supply for many cycles and most of legit suppliers approve to dereference it

### Supplier / Saler 
He supplied items needing to complete orders to customers.
He provides stock of products and participate at common-catalog management.

#### Supplying process
He can process orders in several ways:
* supplying total ordered products at all requested quantities. He'll be the only supplier of order. He can immediately close it to be sent to customer.
--it's best way to improve tracability, and increase total process speed--
* supplying only part of elements on an order, when no supplier can supply fully. He also help in order process by decreasing missing itemsv. Order will require fewer quantities to be closed and sent.

#### Offering process
Supplier have to inform customers about products they are able to supply.
This canister will firstly manage current stock values of referenced products, that means products supplier is able to provide from now.
Offerings updated by suppliers help to update common-catalog references (new items, unsuppliable items, end-time products...)

### Customer
He can get at any moment common catalog content with references of all orderable products.
He can make orders being list of quantities of products he has to receive from all suppliers.

'Customers' represents people who maked orders and being still waiting about order execution
