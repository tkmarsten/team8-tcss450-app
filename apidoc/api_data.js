define({ "api": [
  {
    "type": "delete",
    "url": "/auth",
    "title": "Request to delete a Pushy Token for the user",
    "name": "DeleteAuth",
    "group": "Auth",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Valid JSON Web Token JWT</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>true when the pushy token is deleted</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400: Missing Parameters": [
          {
            "group": "400: Missing Parameters",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Missing required information&quot;</p>"
          }
        ],
        "404: User Not Found": [
          {
            "group": "404: User Not Found",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;user not found&quot;</p>"
          }
        ],
        "400: JSON Error": [
          {
            "group": "400: JSON Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;malformed JSON in parameters&quot;</p>"
          }
        ],
        "400: SQL Error": [
          {
            "group": "400: SQL Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>the reported SQL error details</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/auth/pushyregister.js",
    "groupTitle": "Auth"
  },
  {
    "type": "get",
    "url": "/auth",
    "title": "Request to sign a user in the system",
    "name": "GetAuth",
    "group": "Auth",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>&quot;username:password&quot; uses Basic Auth</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>true when the name is found and password matches</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Authentication successful!&quot;&quot;</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>JSON Web Token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 OK\n{\n  \"success\": true,\n  \"message\": \"Authentication successful!\",\n  \"token\": \"eyJhbGciO...abc123\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400: Missing Authorization Header": [
          {
            "group": "400: Missing Authorization Header",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Missing Authorization Header&quot;</p>"
          }
        ],
        "400: Malformed Authorization Header": [
          {
            "group": "400: Malformed Authorization Header",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Malformed Authorization Header&quot;</p>"
          }
        ],
        "404: User Not Found": [
          {
            "group": "404: User Not Found",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;User not found&quot;</p>"
          }
        ],
        "400: Invalid Credentials": [
          {
            "group": "400: Invalid Credentials",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Credentials did not match&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/auth/signin.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/auth",
    "title": "Request to register a user",
    "name": "PostAuth",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "first",
            "description": "<p>a users first name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "last",
            "description": "<p>a users last name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>a users email *unique</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>a users password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "username",
            "description": "<p>a username *unique, if none provided, email will be used</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Body-Example:",
          "content": "{\n    \"first\":\"Charles\",\n    \"last\":\"Bryan\",\n    \"email\":\"cfb3@fake.email\",\n    \"password\":\"test12345\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>true when the name is inserted</p>"
          },
          {
            "group": "Success 201",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>the email of the user inserted</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400: Missing Parameters": [
          {
            "group": "400: Missing Parameters",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Missing required information&quot;</p>"
          }
        ],
        "400: Username exists": [
          {
            "group": "400: Username exists",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Username exists&quot;</p>"
          }
        ],
        "400: Email exists": [
          {
            "group": "400: Email exists",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Email exists&quot;</p>"
          }
        ],
        "400: Other Error": [
          {
            "group": "400: Other Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;other error, see detail&quot;</p>"
          },
          {
            "group": "400: Other Error",
            "type": "String",
            "optional": false,
            "field": "detail",
            "description": "<p>Information about th error</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/auth/register.js",
    "groupTitle": "Auth"
  },
  {
    "type": "put",
    "url": "/auth",
    "title": "Request to insert a Pushy Token for the user",
    "name": "PutAuth",
    "group": "Auth",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Valid JSON Web Token JWT</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>the Pushy Token of the user identified in the JWT</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>true when the pushy token is inserted</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400: Missing Parameters": [
          {
            "group": "400: Missing Parameters",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Missing required information&quot;</p>"
          }
        ],
        "404: User Not Found": [
          {
            "group": "404: User Not Found",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;user not found&quot;</p>"
          }
        ],
        "400: JSON Error": [
          {
            "group": "400: JSON Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;malformed JSON in parameters&quot;</p>"
          }
        ],
        "400: SQL Error": [
          {
            "group": "400: SQL Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>the reported SQL error details</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/auth/pushyregister.js",
    "groupTitle": "Auth"
  },
  {
    "type": "delete",
    "url": "/chats/chatRoom/:chatId?",
    "title": "Request delete a user from a chat",
    "name": "DeleteChats",
    "group": "Chats",
    "description": "<p>Deletes the chat room between two people when one person decides to leave.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "chatId",
            "description": "<p>the chat to delete the user from</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>true when the chatID is deleted</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404: Chat Not Found": [
          {
            "group": "404: Chat Not Found",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;chatID not found&quot;</p>"
          }
        ],
        "400: Invalid Parameter": [
          {
            "group": "400: Invalid Parameter",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Malformed parameter. chatId must be a number&quot;</p>"
          }
        ],
        "400: SQL Error": [
          {
            "group": "400: SQL Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>the reported SQL error details</p>"
          }
        ],
        "400: JSON Error": [
          {
            "group": "400: JSON Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;malformed JSON in parameters&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/chat/chats.js",
    "groupTitle": "Chats"
  },
  {
    "type": "get",
    "url": "/chats/chatIDs/:email",
    "title": "Request to get the all chatID's connected to a given email.",
    "name": "GetChatIDs",
    "group": "Chats",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Valid JSON Web Token JWT</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "the",
            "description": "<p>user's email</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "rowCount",
            "description": "<p>the number of chatID's returned</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "chatID",
            "description": "<p>List</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ChatMembers.chatID",
            "description": "<p>the chat ID.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404: ChatId Not Found": [
          {
            "group": "404: ChatId Not Found",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Email not found&quot;</p>"
          }
        ],
        "400: Missing Parameters": [
          {
            "group": "400: Missing Parameters",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Missing required information&quot;</p>"
          }
        ],
        "400: SQL Error": [
          {
            "group": "400: SQL Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>the reported SQL error details</p>"
          }
        ],
        "400: JSON Error": [
          {
            "group": "400: JSON Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;malformed JSON in parameters&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/chat/chats.js",
    "groupTitle": "Chats"
  },
  {
    "type": "get",
    "url": "/chats/nickname/:email",
    "title": "Request to get the nickname for a given email",
    "name": "GetChatIDs",
    "group": "Chats",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Valid JSON Web Token JWT</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "the",
            "description": "<p>user's email</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "the",
            "description": "<p>nickname.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404: ChatId Not Found": [
          {
            "group": "404: ChatId Not Found",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Email not found&quot;</p>"
          }
        ],
        "400: Missing Parameters": [
          {
            "group": "400: Missing Parameters",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Missing required information&quot;</p>"
          }
        ],
        "400: SQL Error": [
          {
            "group": "400: SQL Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>the reported SQL error details</p>"
          }
        ],
        "400: JSON Error": [
          {
            "group": "400: JSON Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;malformed JSON in parameters&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/chat/chats.js",
    "groupTitle": "Chats"
  },
  {
    "type": "get",
    "url": "/chats/:chatId?",
    "title": "Request to get the nicknames of user in a chat",
    "name": "GetChats",
    "group": "Chats",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Valid JSON Web Token JWT</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "chatId",
            "description": "<p>the chat to look up.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "rowCount",
            "description": "<p>the number of messages returned</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "members",
            "description": "<p>List of members in the chat</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "messages.nickname",
            "description": "<p>The nickname for the member in the chat</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "messages.email",
            "description": "<p>The email for the member in the chat</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404: ChatId Not Found": [
          {
            "group": "404: ChatId Not Found",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Chat ID Not Found&quot;</p>"
          }
        ],
        "400: Invalid Parameter": [
          {
            "group": "400: Invalid Parameter",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Malformed parameter. chatId must be a number&quot;</p>"
          }
        ],
        "400: Missing Parameters": [
          {
            "group": "400: Missing Parameters",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Missing required information&quot;</p>"
          }
        ],
        "400: SQL Error": [
          {
            "group": "400: SQL Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>the reported SQL error details</p>"
          }
        ],
        "400: JSON Error": [
          {
            "group": "400: JSON Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;malformed JSON in parameters&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/chat/chats.js",
    "groupTitle": "Chats"
  },
  {
    "type": "post",
    "url": "/chats",
    "title": "Request to add a chat",
    "name": "PostChats",
    "group": "Chats",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Valid JSON Web Token JWT</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>the name for the chat</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>of user logged in</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "type": "boolean",
            "optional": false,
            "field": "successAlreadyExisted",
            "description": "<p>true when mutual chatroom found</p>"
          },
          {
            "group": "Success 201",
            "type": "boolean",
            "optional": false,
            "field": "successNewChatRoom",
            "description": "<p>true when newChatRoom is made.</p>"
          },
          {
            "group": "Success 201",
            "type": "Number",
            "optional": false,
            "field": "rowCount",
            "description": "<p>the number of rows returned</p>"
          },
          {
            "group": "Success 201",
            "type": "Object[]",
            "optional": false,
            "field": "list",
            "description": "<p>of mutual chat IDs</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400: Unknown user": [
          {
            "group": "400: Unknown user",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;unknown email address&quot;</p>"
          }
        ],
        "400: Missing Parameters": [
          {
            "group": "400: Missing Parameters",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Missing required information&quot;</p>"
          }
        ],
        "400: chatID Error": [
          {
            "group": "400: chatID Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Error assigning chatID&quot;</p>"
          }
        ],
        "400: SQL Error": [
          {
            "group": "400: SQL Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>the reported SQL error details</p>"
          }
        ],
        "400: Unknown Chat ID": [
          {
            "group": "400: Unknown Chat ID",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;invalid chat id&quot;</p>"
          }
        ],
        "400: JSON Error": [
          {
            "group": "400: JSON Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;malformed JSON in parameters&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/chat/chats.js",
    "groupTitle": "Chats"
  },
  {
    "type": "put",
    "url": "/chats",
    "title": "Request add a user to a chat",
    "name": "PutChats",
    "group": "Chats",
    "description": "<p>Adds the user associated with the required JWT.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Valid JSON Web Token JWT</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "chatId",
            "description": "<p>the chat to add the user to</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>of the member to insert into the chat</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>true when the name is inserted</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404: Chat Not Found": [
          {
            "group": "404: Chat Not Found",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;chatID not found&quot;</p>"
          }
        ],
        "404: Email Not Found": [
          {
            "group": "404: Email Not Found",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;email not found&quot;</p>"
          }
        ],
        "400: Invalid Parameter": [
          {
            "group": "400: Invalid Parameter",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Malformed parameter. chatId must be a number&quot;</p>"
          }
        ],
        "400: Duplicate Email": [
          {
            "group": "400: Duplicate Email",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;user already joined&quot;</p>"
          }
        ],
        "400: Missing Parameters": [
          {
            "group": "400: Missing Parameters",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Missing chatID&quot;</p>"
          }
        ],
        "400: SQL Error": [
          {
            "group": "400: SQL Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>the reported SQL error details</p>"
          }
        ],
        "400: JSON Error": [
          {
            "group": "400: JSON Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;malformed JSON in parameters&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/chat/chats.js",
    "groupTitle": "Chats"
  },
  {
    "type": "delete",
    "url": "/contacts",
    "title": "Remove user's selected contact",
    "name": "DeleteContacts",
    "group": "Contacts",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Valid JSON Web Token JWT</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>the contact's email.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>true when the contact is deleted</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400: Missing body": [
          {
            "group": "400: Missing body",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Missing required information&quot;</p>"
          }
        ],
        "400: SQL Error": [
          {
            "group": "400: SQL Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>the reported SQL error details</p>"
          }
        ],
        "404: Email not found": [
          {
            "group": "404: Email not found",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Email not found&quot;</p>"
          }
        ],
        "400: JSON Error": [
          {
            "group": "400: JSON Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;malformed JSON in parameters&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/contacts/contacts.js",
    "groupTitle": "Contacts"
  },
  {
    "type": "get",
    "url": "/contacts/:email",
    "title": "Retrieve the user's contacts",
    "name": "GetContacts",
    "group": "Contacts",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Valid JSON Web Token JWT</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>the user's email.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "members",
            "description": "<p>List of contacts</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "members.firstname",
            "description": "<p>The first name of the contact</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "members.lastname",
            "description": "<p>The last name of the contact</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "members.nickname",
            "description": "<p>The nickname of the contact</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "members.email",
            "description": "<p>The email of the contact</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400: Missing parameter": [
          {
            "group": "400: Missing parameter",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Missing required information&quot;</p>"
          }
        ],
        "400: SQL Error": [
          {
            "group": "400: SQL Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>the reported SQL error details</p>"
          }
        ],
        "404: Email not found": [
          {
            "group": "404: Email not found",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Email not found&quot;</p>"
          }
        ],
        "400: JSON Error": [
          {
            "group": "400: JSON Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;malformed JSON in parameters&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/contacts/contacts.js",
    "groupTitle": "Contacts"
  },
  {
    "type": "post",
    "url": "/contacts",
    "title": "Add another user to your contacts",
    "name": "PostContacts",
    "group": "Contacts",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Valid JSON Web Token JWT</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>the contact's email.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>true when the contact is added</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400: Missing body": [
          {
            "group": "400: Missing body",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Missing required information&quot;</p>"
          }
        ],
        "400: Duplicate contact": [
          {
            "group": "400: Duplicate contact",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;User is already a contact&quot;</p>"
          }
        ],
        "400: SQL Error": [
          {
            "group": "400: SQL Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>the reported SQL error details</p>"
          }
        ],
        "404: Email not found": [
          {
            "group": "404: Email not found",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Email not found&quot;</p>"
          }
        ],
        "400: JSON Error": [
          {
            "group": "400: JSON Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;malformed JSON in parameters&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/contacts/contacts.js",
    "groupTitle": "Contacts"
  },
  {
    "type": "get",
    "url": "/messages/:chatId?/:messageId?",
    "title": "Request to get chat messages",
    "name": "GetMessages",
    "group": "Messages",
    "description": "<p>Request to get the 10 most recent chat messages from the server in a given chat - chatId. If an optional messageId is provided, return the 10 messages in the chat prior to (and not including) the message containing MessageID.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "chatId",
            "description": "<p>the chat to look up.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "messageId",
            "description": "<p>(Optional) return the 15 messages prior to this message</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "rowCount",
            "description": "<p>the number of messages returned</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "messages",
            "description": "<p>List of massages in the message table</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "messages.messageId",
            "description": "<p>The id for this message</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "messages.email",
            "description": "<p>The email of the user who posted this message</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "messages.message",
            "description": "<p>The message text</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "messages.timestamp",
            "description": "<p>The timestamp of when this message was posted</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404: ChatId Not Found": [
          {
            "group": "404: ChatId Not Found",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Chat ID Not Found&quot;</p>"
          }
        ],
        "400: Invalid Parameter": [
          {
            "group": "400: Invalid Parameter",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Malformed parameter. chatId must be a number&quot;</p>"
          }
        ],
        "400: Missing Parameters": [
          {
            "group": "400: Missing Parameters",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Missing required information&quot;</p>"
          }
        ],
        "400: SQL Error": [
          {
            "group": "400: SQL Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>the reported SQL error details</p>"
          }
        ],
        "400: JSON Error": [
          {
            "group": "400: JSON Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;malformed JSON in parameters&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/chat/messages.js",
    "groupTitle": "Messages"
  },
  {
    "type": "post",
    "url": "/messages",
    "title": "Request to add a message to a specific chat",
    "name": "PostMessages",
    "group": "Messages",
    "description": "<p>Adds the message from the user associated with the required JWT.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Valid JSON Web Token JWT</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "chatId",
            "description": "<p>the id of th chat to insert this message into</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>a message to store</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>true when the name is inserted</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400: Unknown user": [
          {
            "group": "400: Unknown user",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;unknown email address&quot;</p>"
          }
        ],
        "400: Missing Parameters": [
          {
            "group": "400: Missing Parameters",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Missing required information&quot;</p>"
          }
        ],
        "400: SQL Error": [
          {
            "group": "400: SQL Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>the reported SQL error details</p>"
          }
        ],
        "400: Unknown Chat ID": [
          {
            "group": "400: Unknown Chat ID",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;invalid chat id&quot;</p>"
          }
        ],
        "400: JSON Error": [
          {
            "group": "400: JSON Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;malformed JSON in parameters&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/chat/messages.js",
    "groupTitle": "Messages"
  },
  {
    "type": "delete",
    "url": "/requests/:email",
    "title": "Remove user's selected contact",
    "name": "DeleteRequests",
    "group": "Requests",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Valid JSON Web Token JWT</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>the contact's email.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>true when the contact request is deleted</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400: Missing body": [
          {
            "group": "400: Missing body",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Missing required information&quot;</p>"
          }
        ],
        "400: Self deletion": [
          {
            "group": "400: Self deletion",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;User attempting to delete themselves&quot;</p>"
          }
        ],
        "400: SQL Error": [
          {
            "group": "400: SQL Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>the reported SQL error details</p>"
          }
        ],
        "404: Email not found": [
          {
            "group": "404: Email not found",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Email not found&quot;</p>"
          }
        ],
        "400: JSON Error": [
          {
            "group": "400: JSON Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;malformed JSON in parameters&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/contacts/requests.js",
    "groupTitle": "Requests"
  },
  {
    "type": "get",
    "url": "/requests/:email",
    "title": "Retrieve the user's contact requests",
    "name": "GetRequests",
    "group": "Requests",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Valid JSON Web Token JWT</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>the user's email.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "members",
            "description": "<p>List of contact requests</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "members.email",
            "description": "<p>The email of the contact</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400: Missing parameter": [
          {
            "group": "400: Missing parameter",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Missing required information&quot;</p>"
          }
        ],
        "400: SQL Error": [
          {
            "group": "400: SQL Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>the reported SQL error details</p>"
          }
        ],
        "404: Email not found": [
          {
            "group": "404: Email not found",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Email not found&quot;</p>"
          }
        ],
        "400: JSON Error": [
          {
            "group": "400: JSON Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;malformed JSON in parameters&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/contacts/requests.js",
    "groupTitle": "Requests"
  },
  {
    "type": "post",
    "url": "/requests",
    "title": "Add another user to your contacts",
    "name": "PostRequests",
    "group": "Requests",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Valid JSON Web Token JWT</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>the contact's email.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>true when the contact request is sent</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400: Missing body": [
          {
            "group": "400: Missing body",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Missing required information&quot;</p>"
          }
        ],
        "400: Duplicate contact request": [
          {
            "group": "400: Duplicate contact request",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;There is already a pending request&quot;</p>"
          }
        ],
        "400: Self contact request": [
          {
            "group": "400: Self contact request",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;User attempting to add themselves&quot;</p>"
          }
        ],
        "400: SQL Error": [
          {
            "group": "400: SQL Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>the reported SQL error details</p>"
          }
        ],
        "404: Email not found": [
          {
            "group": "404: Email not found",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Email not found&quot;</p>"
          }
        ],
        "400: JSON Error": [
          {
            "group": "400: JSON Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;malformed JSON in parameters&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/contacts/requests.js",
    "groupTitle": "Requests"
  },
  {
    "type": "get",
    "url": "/search/:email",
    "title": "Retrieve the user's contacts",
    "name": "GetSearch",
    "group": "Search",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Valid JSON Web Token JWT</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>the user's email.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>true when the user is found</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400: Missing parameter": [
          {
            "group": "400: Missing parameter",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Missing required information&quot;</p>"
          }
        ],
        "400: Self search query": [
          {
            "group": "400: Self search query",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;User is searching themselves&quot;</p>"
          }
        ],
        "400: SQL Error": [
          {
            "group": "400: SQL Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>the reported SQL error details</p>"
          }
        ],
        "404: Email not found": [
          {
            "group": "404: Email not found",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Email not found&quot;</p>"
          }
        ],
        "400: JSON Error": [
          {
            "group": "400: JSON Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;malformed JSON in parameters&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/contacts/search.js",
    "groupTitle": "Search"
  }
] });
