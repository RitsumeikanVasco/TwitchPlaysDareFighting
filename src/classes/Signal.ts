export default class Signal {
    private listeners: Map<string, (...optionalParams: any[])=>void> = new Map();
    private listenerCount: number = 0;

    constructor(){
        console.log()
    }

    Connect(callback: (...optionalParams: any[])=>void){
        const index: string = this.listenerCount.toString()
        this.listeners.set(index, callback)
        this.listenerCount++

        return () => { // Disconnect Function
            this.listeners.delete(index)
        }
    }

    Fire(...optionalParams: any[]){
        this.listeners.forEach((callback)=>{
            callback(...optionalParams)
        })
    }
}