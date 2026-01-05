import Signal from "./../classes/Signal"

export default class Clock {
    public Tick = new Signal();
    public Elapsed = new Signal();

    private currentTime: number;

    constructor(interval: number){
        this.currentTime = -1

        setInterval(()=>{
            this.currentTime++;
            this.Tick.Fire(this.currentTime)

            if (this.currentTime >= interval){
                this.currentTime = -1
                this.Elapsed.Fire()
            }
                
        }, 1000)
    }

    getCurrentSeconds(): number {
        return this.currentTime
    }
}