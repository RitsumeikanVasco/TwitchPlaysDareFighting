import ShopItems from "./../enums/ShopItems"
import {purchase} from "./PointService"
import { EventEmitter } from "events";

const ITEMS_PRICE: Map<string, number> = new Map([
    [ShopItems.Health10, 50],
    [ShopItems.Health50, 250],
    [ShopItems.Health100, 400],
])

export let shopEmitter = new EventEmitter()

export function PurchaseItem(userid: string, itemId: string){
    if (!ITEMS_PRICE.has(itemId))
        return

    const price: number = ITEMS_PRICE.get(itemId) || 0

    purchase(userid, price, ()=>{
        // Hard-coded for simplicity
        switch(itemId){
            case ShopItems.Health10:
                break;
            case ShopItems.Health50:
                break;
            case ShopItems.Health100:
                break;
        }

        shopEmitter.emit("purchasedItem", userid, itemId)

        return true
    })
}