import { BigInt } from "@graphprotocol/graph-ts"
import {
  DaiContract,
  Approval,
  LogNote,
  Transfer as TransferEvent, 
} from "../generated/DaiContract/DaiContract"
import { ExampleEntity, TransferDAI } from "../generated/schema"

export function handleApproval(event: Approval): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (entity == null) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.src = event.params.src
  entity.guy = event.params.guy

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.DOMAIN_SEPARATOR(...)
  // - contract.PERMIT_TYPEHASH(...)
  // - contract.allowance(...)
  // - contract.approve(...)
  // - contract.balanceOf(...)
  // - contract.decimals(...)
  // - contract.name(...)
  // - contract.nonces(...)
  // - contract.symbol(...)
  // - contract.totalSupply(...)
  // - contract.transfer(...)
  // - contract.transferFrom(...)
  // - contract.version(...)
  // - contract.wards(...)
}

export function handleLogNote(event: LogNote): void {}

export function handleTransfer(event: TransferEvent): void {
  let daiEntity = new TransferDAI(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );

  daiEntity.by = event.params.src;
  daiEntity.to = event.params.dst;
  daiEntity.amount = event.params.wad;

  daiEntity.save()

}
