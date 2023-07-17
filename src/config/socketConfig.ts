// @ts-ignore
import * as SockJS from 'sockjs-client/dist/sockjs';
import Stomp, {Frame, Message} from "stompjs";


class Socket {
    private baseUrl: string
    private endpoint: string
    private sockJS: SockJS
    private client: Stomp.Client
    private retryCount: number = 0
    private isConnected: boolean = false

    constructor(baseUrl: string, endpoint: string) {
        this.baseUrl = baseUrl
        this.endpoint = endpoint
        this.sockJS = new SockJS(this.getFullUrl())
        this.client = Stomp.over(this.sockJS)
    }

    private getFullUrl(): string{
        return new URL(this.endpoint, this.baseUrl).toString()
    }

    connect(): Promise<Frame | undefined> {
        return new Promise((resolve, reject) => {
            if (!this.client.connected) {
                this.client.connect({}, (frame) => {
                    this.isConnected = true
                    resolve(frame)
                }, () => {
                    this.isConnected = false
                    this.retry(resolve, reject)
                })
            }
        })
    }

    subscribe(destination: string, callBack: (message: Message) => any, headers?: {}) {
        this.client.subscribe(destination, callBack, headers)
    }

    disconnect = () => {
        this.client.disconnect(() => {})
    };

    send(destination: string, body?: any, header?: {}) {
        this.client.send(destination, header, typeof body === 'string' ? body : JSON.stringify(body))
    }

    private retry(resolve: { (value: any): void; (arg0: Stomp.Frame | undefined): void; }, reject: (reason?: any) => void) {
        setTimeout(() => {
            if (!this.client.connected) {
                this.sockJS = new SockJS(this.getFullUrl())
                this.client = Stomp.over(this.sockJS)
                this.client.connect({}, (frame) => {
                    this.isConnected = true
                    resolve(frame)
                }, () => {
                    this.isConnected = false
                    console.log(`socket retry times ${this.retryCount}`)
                    if (this.retryCount < 10) {
                        this.retryCount ++
                        this.retry(resolve, reject)
                    } else {
                        this.retryCount = 0
                        reject(new Error("max retry count reached"))
                    }
                })
            }
        }, 5000)
    }
}

const socket = new Socket("http://localhost:8080", "/ws")

export default socket
