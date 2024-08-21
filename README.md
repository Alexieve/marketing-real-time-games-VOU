# VOU - Marketing with Real-time Games

## Overview
VOU is a system designed to help partners create promotional campaigns based on real-time games without the need for building a separate system. Inspired by popular viral marketing games like Momo’s "Sưu Tập Linh Thú" and Viettelpay’s "Lắc Mana", VOU offers a platform where various brands can engage users through interactive games, manage promotions, and track the effectiveness of their campaigns.

## Features

### Admin Web Platform
- **User Account Management**: Add, update, and delete user accounts, which may include brands, game participants, or admins. Activation and locking of accounts are also supported.
- **Game Information Management**: Update and manage game information, including the game’s name, image, type, and other attributes. Current real-time games supported include:
  1. **Realtime Quiz**: Similar to HQ Trivia.
  2. **Shake-to-Win**: Shake the phone to get random rewards or collect items to redeem rewards. Users can trade items to form complete sets for rewards.
- **Reporting and Statistics**: Generate statistics related to partners, players, and games.

### Brand Web Platform
- **Event Management**: Register and manage promotional events, including adding, updating, and retrieving event information. Each event has details such as name, image, voucher quantity, start and end times, and associated games.
- **Reporting**: Generate reports on promotional budgets and the status of campaigns.

### Player Mobile Platform
- **Account Registration**: Register accounts using phone numbers with OTP verification. Players can save favorite events, participate in games, and redeem rewards.
- **Item Collection and Exchange**: Players can collect and trade items with friends via phone number or email, which can be used to redeem vouchers.
- **Voucher Redemption**: Players can redeem vouchers for online or offline rewards, which include QR code scanning at brand locations.

## Technologies Used

### System Architecture
- **Microservices**: The system is divided into small, independent services, each responsible for specific functions like user management, game management, AI-based MC, and campaign management.
- **API Communication**: Uses RESTful API and RabbitMQ for communication between services and WebSockets for real-time interactions.
- **Databases**:
  - **Relational**: PostgreSQL for user and game configuration data.
  - **NoSQL**: MongoDB/Redis/Firebase for real-time data and caching.

### Real-Time Performance
- **Scalability**: The system is designed to handle thousands of concurrent players.
- **Reliability and Security**: High reliability and data security are prioritized.
- **Maintenance**: The system is easy to maintain and update.

### AI Virtual MC
- Uses AI and natural language processing (NLP) to create a virtual MC for real-time interaction in games.

## Setup Instructions

### Prerequisites
- [Docker](https://www.docker.com/)
- [Kubernetes](https://kubernetes.io/)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/vou-marketing-games.git
