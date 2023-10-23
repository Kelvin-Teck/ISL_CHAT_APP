### API Documentation for ISL Chat Application



### USER CONTROLLERS
### User Registration API

- **Endpoint:** `POST /user/register`
- **Request Body:**
  - `name` (string): User's desired username
  - `email` (string): User's email address
  - `password` (string): User's chosen password
- **Response:**
  - `msg` (string): Confirmation message



### User Login API

- **Endpoint:** `POST /user/login`
- **Request Body:**
  - `name` (string): User's username
  - `password` (string): User's password
- **Response:**
  - If login is successful:
    - `token` (string): Authentication token for the user
  - If login fails:
    - `msg` (string): Error message, e.g., "Invalid Username or Password"


### Fetch Users API

- **Endpoint:** `GET /user/fetchUsers`
- **Request Parameters:**
  - `search` (string, optional): A search keyword to filter users by name or email.
- **Response:**
  - List of user objects, each containing:
    - `_id` (string): User's unique identifier
    - `name` (string): User's name
    - `email` (string): User's email address
- **Description:**
  - Retrieves a list of users based on an optional search query.
  - If `search` is provided, it performs a case-insensitive search on user names and email addresses, returning matching users.
  - If no `search` is provided, it returns all users except the current user (identified by the token).




### MESSAGE CONTROLLERS
### All Messages API

- **Endpoint:** `GET /message/:chatId`
- **URL Parameter:**
  - `chatId` (string): Identifier of the chat for which messages are retrieved.
- **Response:**
  - List of messages.

**Description:**

- Retrieves messages for a specific chat.
- Returns a list of messages.
- Use `chatId` to specify the chat for which messages are requested.




### Send Message API

- **Endpoint:** `POST /message`
- **Request Body:**
  - `content` (string): The message content.
  - `chatId` (string): Identifier of the chat to which the message is sent.
  - `receiverId` (string): Identifier of the message receiver (modify based on your application's logic).

- **Response:**
  - Message object with sender, receiver, and chat information.

**Description:**

- Sends a message to a specific chat.
- Requires the message content (`content`), chat identifier (`chatId`), and receiver identifier (`receiverId`) in the request body.
- Returns the sent message with sender, receiver, and chat details.




### CHAT CONTROLLERS
### Access Chat API

- **Endpoint:** `POST /message/accessChat`
- **Request Body:**
  - `userId` (string): Identifier of the user to access the chat with.

- **Response:**
  - Chat object with details.

**Description:**

- Accesses an existing chat or creates a new one for communication with another user.
- Requires the `userId` of the user with whom you want to access the chat.
- Returns the chat object with relevant details.

**Usage:**

- Use this API to access or create a chat with another user.
- Provide the `userId` in the request body to specify the user with whom you want to chat.

**Example Request Body:**

```json
{
  "userId": "user_id_123"
}



### Fetch Chats API

- **Endpoint:** `GET /message/fetchChats`
- **Response:**
  - List of chat objects with details.

**Description:**

- Retrieves a list of chats associated with the authenticated user.
- Returns a list of chat objects with relevant details, sorted by the most recently updated chats.

**Usage:**

- Use this API to fetch the chats for the authenticated user.
- Make a GET request to the `/message/fetchChats` endpoint to retrieve the chat list.

**Example Request:**

```javascript
GET /message/fetchChats




### Fetch Groups API

- **Endpoint:** `GET /message/fetchGroups`
- **Response:**
  - List of group chat objects.

**Description:**

- Retrieves a list of all group chats available in the application.
- Returns a list of group chat objects with relevant details.

**Usage:**

- Use this API to fetch all group chats.
- Make a GET request to the `/message/fetchGroups` endpoint to retrieve the list of group chats.

**Example Request:**

```javascript
GET /message/fetchGroups




### Create Group Chat API

- **Endpoint:** `POST /message/createGroup`
- **Request Body:**
  - `users` (string, JSON): Array of user IDs to include in the group chat.
  - `name` (string): Name of the group chat.

- **Response:**
  - Group chat object with details.

**Description:**

- Creates a new group chat with specified users and a name.
- Requires the list of `users` to include in the group chat and a `name` for the chat.
- Returns the created group chat object with relevant details.

**Usage:**

- Use this API to create a new group chat.
- Provide the list of `users` and a `name` in the request body to create the group chat.

**Example Request Body:**

```json
{
  "users": "[user_id_1, user_id_2, user_id_3]",
  "name": "My Group Chat"
}



### Add Self to Group API

- **Endpoint:** `PUT /message/addSelfToGroup`
- **Request Body:**
  - `chatId` (string): Identifier of the chat or group to join.
  - `userId` (string): Identifier of the user adding themselves to the group.

- **Response:**
  - Updated group chat object with details.

**Description:**

- Allows a user to add themselves to a group chat.
- Requires the `chatId` of the group to join and the `userId` of the user adding themselves.
- Returns the updated group chat object with relevant details.

**Usage:**

- Use this API to add yourself to a group chat.
- Provide the `chatId` and `userId` in the request body to join the group chat.

**Example Request Body:**

```json
{
  "chatId": "group_chat_id_123",
  "userId": "user_id_to_add"
}




### Group Exit API

- **Endpoint:** `PUT /message/groupExit`
- **Request Body:**
  - `chatID` (string): Identifier of the chat to exit from.
  - `userId` (string): Identifier of the user leaving the chat.

- **Response:**
  - Updated group chat object with details.

**Description:**

- Allows a user to exit a group chat.
- Requires the `chatID` of the chat to exit from and the `userId` of the user leaving the chat.
- Returns the updated group chat object with relevant details after the user has exited.

**Usage:**

- Use this API to allow a user to exit a group chat.
- Provide the `chatID` and `userId` in the request body to exit the group chat.

**Example Request Body:**

```json
{
  "chatID": "group_chat_id_123",
  "userId": "user_id_1"
}



