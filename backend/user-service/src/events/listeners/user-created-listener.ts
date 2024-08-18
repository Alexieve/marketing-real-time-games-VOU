import { 
    Listener,  
    AdminCreatedEvent, 
    BrandCreatedEvent, 
    CustomerCreatedEvent, 
    RoutingKey,
    ExchangeName
} from "@vmquynh-vou/shared";
import { ConsumeMessage } from 'amqplib';
import { queueGroupName } from "./queue-group-name";
import { User } from "../../models/user";
import { Brand } from "../../models/brand";
import { Customer } from "../../models/customer";
import { 
    AdminCreatedPublisher, 
    BrandCreatedPublisher, 
    CustomerCreatedPublisher 
} from "../publishers/user-created-publisher";

export class BrandCreatedListener extends Listener<BrandCreatedEvent> {
    exchange: ExchangeName.UserExchange = ExchangeName.UserExchange;
    routingKey: RoutingKey.BrandCreated = RoutingKey.BrandCreated;
    queue = queueGroupName.BrandCreatedQueue;

    async onMessage(data: BrandCreatedEvent['data'], msg: ConsumeMessage) {
        // Xác nhận (acknowledge) thông điệp
        console.log('Event data!', data);
        this.channel.ack(msg);
    }
}

