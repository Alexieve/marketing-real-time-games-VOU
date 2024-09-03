export type RootStackParamList = {
    EventList: undefined;
    EventDetail: {
        event: {
            _id: string;
            name: string;
            imageUrl: string;
            description: string;
            startTime: string;
            endTime: string;
            brand: string;
            game: {
                gameID: string;
                playTurn: number;
            };
        };
    };
    ExchangeVoucher: {
        eventID: string;
        gameID: string;
    };
    // Add other screens here if necessary
};
