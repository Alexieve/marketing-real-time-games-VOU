import { 
  Publisher, 
  RoutingKey, 
  AdminCreatedEvent, 
  CustomerCreatedEvent, 
  BrandCreatedEvent, 
  ExchangeName
} from '@vmquynh-vou/shared';
export class AdminCreatedPublisher extends Publisher<AdminCreatedEvent> {
  exchange: ExchangeName.UserExchange = ExchangeName.UserExchange;
  routingKey: RoutingKey.AdminCreated = RoutingKey.AdminCreated;
}

export class CustomerCreatedPublisher extends Publisher<CustomerCreatedEvent> {
  exchange: ExchangeName.UserExchange = ExchangeName.UserExchange;
  routingKey: RoutingKey.CustomerCreated = RoutingKey.CustomerCreated;
}

export class BrandCreatedPublisher extends Publisher<BrandCreatedEvent> {
  exchange: ExchangeName.UserExchange = ExchangeName.UserExchange;
  routingKey: RoutingKey.BrandCreated = RoutingKey.BrandCreated;
}

