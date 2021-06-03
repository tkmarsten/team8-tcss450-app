//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
const pool = require('../../utilities/exports').pool

const router = express.Router()

const validation = require('../../utilities').validation
let isStringProvided = validation.isStringProvided


// NEW ENDPOINT

//PARAMS: userEmail, connectionEmail

// if (both users exist in a chatroom) {
//     return chatID
// } else {
//     make new chat room with both users
//     return chatID
// }

/**
 * @apiDefine JSONError
 * @apiError (400: JSON Error) {String} message "malformed JSON in parameters"
 */

/**
 * @api {post} /chats Request to add a chat
 * @apiName PostChats
 * @apiGroup Chats
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * @apiParam {String} name the name for the chat
 * @apiParam {String} email of user logged in
 * @apiParam {String} email of connection to chat with
 * 
 * @apiSuccess (Success 201) {boolean} successAlreadyExisted true when mutual chatroom found
 * @apiSuccess (Success 201) {boolean} successNewChatRoom true when newChatRoom is made.
 * @apiSuccess (Success 201) {Number} rowCount the number of rows returned
 * @apiSuccess (Success 201) {Object[]} list of mutual chat IDs
 * 
 * @apiError (400: Unknown user) {String} message "unknown email address"
 * 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: chatID Error) {String} message "Error assigning chatID"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiError (400: Unknown Chat ID) {String} message "invalid chat id"
 * 
 * @apiUse JSONError
 */
router.post("/", (request, response, next) => {
    //Retrieve data from query params
    const chatName = request.body.name
    const userEmail = request.body.userEmail
    const connectionEmail = request.body.connectionEmail


    if (!isStringProvided(chatName)
        || !isStringProvided(userEmail)
        || !isStringProvided(connectionEmail)) {

        response.status(400).send({
            message: "Missing required information"
        })
    } else {
        next()
    }
}, (request, response, next) => {
    //get the memberID from the emails

    //first memberID
    let insert = `SELECT MemberID FROM Members WHERE Email=$1`

    let values = [request.body.userEmail];
    pool.query(insert, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "user email not found"
                })
            } else {
                request.body.userEmail = result.rows[0].memberid
                next()
            }

        }).catch(err => {
            response.status(400).send({
                message: "SQL Error",
                error: err
            })

        })
}, (request, response, next) => {
    //second memberID
    let insert = `SELECT MemberID FROM Members WHERE Email=$1`

    let values = [request.body.connectionEmail];
    pool.query(insert, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "user email not found"
                })
            } else {
                request.body.connectionEmail = result.rows[0].memberid
                next()
            }

        }).catch(err => {
            response.status(400).send({
                message: "SQL Error",
                error: err
            })

        })

}, (request, response) => {
    //second memberID
    //select chatID from ChatMembers WHERE MemberID=$1 AND MemberID=$2 <> NULL
    let insert = `SELECT DISTINCT chatID FROM ChatMembers WHERE chatID IN (SELECT CM1.chatID FROM ChatMembers AS CM1 WHERE CM1.memberID=$1 INTERSECT SELECT CM2.chatID FROM ChatMembers AS CM2 WHERE CM2.memberID=$2)`

    let values = [request.body.userEmail, request.body.connectionEmail];
    pool.query(insert, values)
        .then(result => {
            if (result.rowCount == 0) {
                //CREATE NEW CHATROOM WITH BOTH THE USER AND THE CONNECTION
                //---------------------------------------------------------
                let insert = `INSERT INTO Chats(Name)
                  VALUES ($1)
                  RETURNING ChatId`
                var chatID;
                let values = [request.body.name]
                pool.query(insert, values)
                    .then(result => {
                        response.send({
                            successAlreadyExisted: false,
                            successNewChatRoom: true,
                            rowCount: 1,
                            rows: [result.rows[0].chatid]
                            
                        })
                        chatID = result.rows[0].chatid
                    }).catch(err => {
                        response.status(400).send({
                            message: "SQL Error",
                            error: err
                        })

                    })
                    
                // if (!(chatID == null)) {
                //     //add the user to the chat
                //     let insert = `INSERT INTO ChatMembers(ChatId, MemberId) VALUES ($1, $2) RETURNING *`
                //     let values = [chatID, request.body.userEmail]
                //     pool.query(insert, values)
                //         .then(result => {
                //             response.send({
                //                 success: true
                //             })
                //         }).catch(err => {
                //             response.status(400).send({
                //                 message: "SQL Error",
                //                 error: err
                //             })
                //         })

                //     //add connection to the chat
                //     let insert = `INSERT INTO ChatMembers(ChatId, MemberId) VALUES ($1, $2) RETURNING *`
                //     let values = [chatID, request.body.connectionEmail]
                //     pool.query(insert, values)
                //         .then(result => {
                //             response.send({
                //                 success: true
                //             })
                //         }).catch(err => {
                //             response.status(400).send({
                //                 message: "SQL Error",
                //                 error: err
                //             })
                //         })

                // } else {
                //     response.status(400).send({
                //         message: "Error assigning chatID"
                //         })
                // }
                // //---------------------------------------------------------
            } else {
                // connectionMemberId = result.rows[0].memberid
                // next()

                response.send({
                    successAlreadyExisted: true,
                    successNewChatRoom: false,
                    rowCount: result.rowCount, //SHOULD NORMALLY BE 1
                    rows: result.rows //INTEGERS IN A LIST representing mutual chatIDs

                })
            }

        }).catch(err => {
            response.status(400).send({
                message: "SQL Error",
                error: err
            })

        })
})

// /**
//  * @apiDefine JSONError
//  * @apiError (400: JSON Error) {String} message "malformed JSON in parameters"
//  */

// /**
//  * @api {post} /chats Request to add a chat
//  * @apiName PostChats
//  * @apiGroup Chats
//  * 
//  * @apiHeader {String} authorization Valid JSON Web Token JWT
//  * @apiParam {String} name the name for the chat
//  * 
//  * @apiSuccess (Success 201) {boolean} success true when the name is inserted
//  * @apiSuccess (Success 201) {Number} chatId the generated chatId
//  * 
//  * @apiError (400: Unknown user) {String} message "unknown email address"
//  * 
//  * @apiError (400: Missing Parameters) {String} message "Missing required information"
//  * 
//  * @apiError (400: SQL Error) {String} message the reported SQL error details
//  * 
//  * @apiError (400: Unknown Chat ID) {String} message "invalid chat id"
//  * 
//  * @apiUse JSONError
//  */
// router.post("/", (request, response, next) => {
//     if (!isStringProvided(request.body.name)) {
//         response.status(400).send({
//             message: "Missing required information"
//         })
//     } else {
//         next()
//     }
// }, (request, response) => {

//     let insert = `INSERT INTO Chats(Name)
//                   VALUES ($1)
//                   RETURNING ChatId`
//     let values = [request.body.name]
//     pool.query(insert, values)
//         .then(result => {
//             response.send({
//                 success: true,
//                 chatID: result.rows[0].chatid
//             })
//         }).catch(err => {
//             response.status(400).send({
//                 message: "SQL Error",
//                 error: err
//             })

//         })
// })

// /**
//  * @api {put} /chats/:chatId? Request add a user to a chat
//  * @apiName PutChats
//  * @apiGroup Chats
//  * 
//  * @apiDescription Adds the user associated with the required JWT. 
//  * 
//  * @apiHeader {String} authorization Valid JSON Web Token JWT
//  * 
//  * @apiParam {Number} chatId the chat to add the user to
//  * 
//  * @apiSuccess {boolean} success true when the name is inserted
//  * 
//  * @apiError (404: Chat Not Found) {String} message "chatID not found"
//  * @apiError (404: Email Not Found) {String} message "email not found"
//  * @apiError (400: Invalid Parameter) {String} message "Malformed parameter. chatId must be a number" 
//  * @apiError (400: Duplicate Email) {String} message "user already joined"
//  * @apiError (400: Missing Parameters) {String} message "Missing required information"
//  * 
//  * @apiError (400: SQL Error) {String} message the reported SQL error details
//  * 
//  * @apiUse JSONError
//  */
// router.put("/:chatId/", (request, response, next) => {
//     //validate on empty parameters
//     if (!request.params.chatId) {
//         response.status(400).send({
//             message: "Missing required information"
//         })
//     } else if (isNaN(request.params.chatId)) {
//         response.status(400).send({
//             message: "Malformed parameter. chatId must be a number"
//         })
//     } else {
//         next()
//     }
// }, (request, response, next) => {
//     //validate chat id exists
//     let query = 'SELECT * FROM CHATS WHERE ChatId=$1'
//     let values = [request.params.chatId]

//     pool.query(query, values)
//         .then(result => {
//             if (result.rowCount == 0) {
//                 response.status(404).send({
//                     message: "Chat ID not found"
//                 })
//             } else {
//                 next()
//             }
//         }).catch(error => {
//             response.status(400).send({
//                 message: "SQL Error",
//                 error: error
//             })
//         })
//     //code here based on the results of the query
// }, (request, response, next) => {
//     //validate email exists 
//     let query = 'SELECT * FROM Members WHERE MemberId=$1'
//     let values = [request.decoded.memberid]

//     console.log(request.decoded)

//     pool.query(query, values)
//         .then(result => {
//             if (result.rowCount == 0) {
//                 response.status(404).send({
//                     message: "email not found"
//                 })
//             } else {
//                 //user found
//                 next()
//             }
//         }).catch(error => {
//             response.status(400).send({
//                 message: "SQL Error",
//                 error: error
//             })
//         })
// }, (request, response, next) => {
//     //validate email does not already exist in the chat
//     let query = 'SELECT * FROM ChatMembers WHERE ChatId=$1 AND MemberId=$2'
//     let values = [request.params.chatId, request.decoded.memberid]

//     pool.query(query, values)
//         .then(result => {
//             if (result.rowCount > 0) {
//                 response.status(400).send({
//                     message: "user already joined"
//                 })
//             } else {
//                 next()
//             }
//         }).catch(error => {
//             response.status(400).send({
//                 message: "SQL Error",
//                 error: error
//             })
//         })

// }, (request, response) => {
//     //Insert the memberId into the chat
//     let insert = `INSERT INTO ChatMembers(ChatId, MemberId)
//                   VALUES ($1, $2)
//                   RETURNING *`
//     let values = [request.params.chatId, request.decoded.memberid]
//     pool.query(insert, values)
//         .then(result => {
//             response.send({
//                 success: true
//             })
//         }).catch(err => {
//             response.status(400).send({
//                 message: "SQL Error",
//                 error: err
//             })
//         })
// }
// )

/**
 * @api {put} /chats Request add a user to a chat
 * @apiName PutChats
 * @apiGroup Chats
 * 
 * @apiDescription Adds the user associated with the required JWT. 
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * 
 * @apiParam {Number} chatId the chat to add the user to
 * @apiParam {String} email of the member to insert into the chat
 * 
 * @apiSuccess {boolean} success true when the name is inserted
 * 
 * @apiError (404: Chat Not Found) {String} message "chatID not found"
 * @apiError (404: Email Not Found) {String} message "email not found"
 * @apiError (400: Invalid Parameter) {String} message "Malformed parameter. chatId must be a number"
 * @apiError (400: Invalid Parameter) {String} message "Malformed parameter. memberID must be a number"  
 * @apiError (400: Duplicate Email) {String} message "user already joined"
 * @apiError (400: Missing Parameters) {String} message "Missing chatID"
 * @apiError (400: Missing Parameters) {String} message "Missing memberID"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */
 router.put("/", (request, response, next) => {

    const chatID = request.body.chatID
    const email = request.body.email
    
    //validate on empty parameters
    if (!chatID) {
        response.status(400).send({
            message: "Missing chatID"
        })
    } else if (isNaN(chatID)) {
        response.status(400).send({
            message: "Malformed parameter. chatId must be a number"
        })
    } else if (!email) {
        response.status(400).send({
            message: "Missing email"
        })
    } else {
        next()
    }
}, (request, response, next) => {
    //get the memberID from the emails

    //first memberID
    let insert = `SELECT MemberID FROM Members WHERE Email=$1`

    let values = [request.body.email];
    pool.query(insert, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "user email not found"
                })
            } else {
                request.body.email = result.rows[0].memberid
                next()
            }

        }).catch(err => {
            response.status(400).send({
                message: "SQL Error",
                error: err
            })

        })
}, (request, response, next) => {
    //validate chat id exists
    let query = 'SELECT * FROM CHATS WHERE ChatId=$1'
    let values = [request.body.chatID]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "Chat ID not found"
                })
            } else {
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
    //code here based on the results of the query
}, (request, response, next) => {
    //validate email does not already exist in the chat
    let query = 'SELECT * FROM ChatMembers WHERE ChatId=$1 AND MemberId=$2'
    let values = [request.body.chatID, request.body.email]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount > 0) {
                response.status(400).send({
                    message: "user already joined"
                })
            } else {
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })

}, (request, response) => {
    //Insert the memberId into the chat
    let insert = `INSERT INTO ChatMembers(ChatId, MemberId)
                  VALUES ($1, $2)
                  RETURNING *`
    let values = [request.body.chatID, request.body.email]
    pool.query(insert, values)
        .then(result => {
            response.send({
                success: true
            })
        }).catch(err => {
            response.status(400).send({
                message: "SQL Error",
                error: err
            })
        })
}
)

/**
 * @api {get} /chats/:chatId? Request to get the nicknames of user in a chat
 * @apiName GetChats
 * @apiGroup Chats
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * 
 * @apiParam {Number} chatId the chat to look up. 
 * 
 * @apiSuccess {Number} rowCount the number of messages returned
 * @apiSuccess {Object[]} members List of members in the chat
 * @apiSuccess {String} messages.nickname The nickname for the member in the chat
 * @apiSuccess {String} messages.email The email for the member in the chat
 * 
 * @apiError (404: ChatId Not Found) {String} message "Chat ID Not Found"
 * @apiError (400: Invalid Parameter) {String} message "Malformed parameter. chatId must be a number" 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */
router.get("/:chatId", (request, response, next) => {
    //validate on missing or invalid (type) parameters
    if (!request.params.chatId) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else if (isNaN(request.params.chatId)) {
        response.status(400).send({
            message: "Malformed parameter. chatId must be a number"
        })
    } else {
        next()
    }
}, (request, response, next) => {
    //validate chat id exists
    let query = 'SELECT * FROM CHATS WHERE ChatId=$1'
    let values = [request.params.chatId]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "Chat ID not found"
                })
            } else {
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response) => {
    //Retrieve the members
    let query = `SELECT Members.Nickname, Members.Email 
                    FROM ChatMembers
                    INNER JOIN Members ON ChatMembers.MemberId=Members.MemberId
                    WHERE ChatId=$1`
    let values = [request.params.chatId]
    pool.query(query, values)
        .then(result => {
            response.send({
                chatId: request.params.chatId,
                rowCount: result.rowCount,
                rows: result.rows

            })
        }).catch(err => {
            response.status(400).send({
                message: "SQL Error",
                error: err
            })
        })
});

/**
 * @api {get} /chats/chatIDs/:email Request to get the all chatID's connected to a given email.
 * @apiName GetChatIDs
 * @apiGroup Chats
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * 
 * @apiParam {String} the user's email
 * 
 * @apiSuccess {Number} rowCount the number of chatID's returned
 * @apiSuccess {Object[]} chatID List
 * @apiSuccess {Number} ChatMembers.chatID the chat ID.
 * 
 * @apiError (404: ChatId Not Found) {String} message "Email not found"
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */
 router.get("/chatIDs/:email", (request, response, next) => {
    //validate on missing or invalid (type) parameters
    response.locals.memberid = null
    if (!request.params.email) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else {
        next()
    }
}, (request, response, next) => {
    //validate member ID exists
    let query = `SELECT Members.MemberID 
                 FROM Members 
                 WHERE Email = $1`
    let values = [request.params.email]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "Email not found"
                })
            } else {
                response.locals.memberid = result.rows[0].memberid
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response) => {
    //Retrieve the chat IDs
    let query = `SELECT ChatMembers.ChatID FROM ChatMembers WHERE MemberID=$1`
    let values = [response.locals.memberid]
    pool.query(query, values)
        .then(result => {
            response.send({
                rowCount: result.rowCount,
                rows: result.rows

            })
        }).catch(err => {
            response.status(400).send({
                message: "SQL Error",
                error: err
            })
        })
});


/**
 * @api {get} /chats/nickname/:email Request to get the nickname for a given email
 * @apiName GetChatIDs
 * @apiGroup Chats
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * 
 * @apiParam {String} the user's email
 * 
 * @apiSuccess {String} the nickname.
 * 
 * @apiError (404: ChatId Not Found) {String} message "Email not found"
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */
 router.get("/nickname/:email", (request, response, next) => {
    //validate on missing or invalid (type) parameters
    response.locals.memberid = null
    if (!request.params.email) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else {
        next()
    }
}, (request, response, next) => {
    //validate member ID exists
    let query = `SELECT Members.MemberID 
                 FROM Members 
                 WHERE Email = $1`
    let values = [request.params.email]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "Email not found"
                })
            } else {
                response.locals.memberid = result.rows[0].memberid
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response) => {
    //Retrieve the nickname
    let query = `SELECT Members.Nickname FROM Members WHERE MemberID=$1`
    let values = [response.locals.memberid]
    pool.query(query, values)
        .then(result => {
            response.send({
                nickname: result.rows[0].nickname

            })
        }).catch(err => {
            response.status(400).send({
                message: "SQL Error",
                error: err
            })
        })
});

/**
 * @api {delete} /chats/:chatId?/:email? Request delete a user from a chat
 * @apiName DeleteChats
 * @apiGroup Chats
 * 
 * @apiDescription Does not delete the user associated with the required JWT but 
 * instead deletes the user based on the email parameter.  
 * 
 * @apiParam {Number} chatId the chat to delete the user from
 * @apiParam {String} email the email of the user to delete
 * 
 * @apiSuccess {boolean} success true when the name is deleted
 * 
 * @apiError (404: Chat Not Found) {String} message "chatID not found"
 * @apiError (404: Email Not Found) {String} message "email not found"
 * @apiError (400: Invalid Parameter) {String} message "Malformed parameter. chatId must be a number" 
 * @apiError (400: Duplicate Email) {String} message "user not in chat"
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */
router.delete("/:chatId/:email", (request, response, next) => {
    //validate on empty parameters
    if (!request.params.chatId || !request.params.email) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else if (isNaN(request.params.chatId)) {
        response.status(400).send({
            message: "Malformed parameter. chatId must be a number"
        })
    } else {
        next()
    }
}, (request, response, next) => {
    //validate chat id exists
    let query = 'SELECT * FROM CHATS WHERE ChatId=$1'
    let values = [request.params.chatId]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "Chat ID not found"
                })
            } else {
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response, next) => {
    //validate email exists AND convert it to the associated memberId
    let query = 'SELECT MemberID FROM Members WHERE Email=$1'
    let values = [request.params.email]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "email not found"
                })
            } else {
                request.params.email = result.rows[0].memberid
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response, next) => {
    //validate email exists in the chat
    let query = 'SELECT * FROM ChatMembers WHERE ChatId=$1 AND MemberId=$2'
    let values = [request.params.chatId, request.params.email]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount > 0) {
                next()
            } else {
                response.status(400).send({
                    message: "user not in chat"
                })
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
    //SELECT ChatID FROM ChatMembers WHERE 
}, (request, response) => {
    //Delete the memberId from the chat
    let insert = `DELETE FROM ChatMembers
                  WHERE ChatId=$1
                  AND MemberId=$2
                  RETURNING *`
    let values = [request.params.chatId, request.params.email]
    pool.query(insert, values)
        .then(result => {
            response.send({
                success: true
            })
        }).catch(err => {
            response.status(400).send({
                message: "SQL Error",
                error: err
            })
        })
}
)

/**
 * @api {delete} /chats/chatRoom/:chatId? Request delete a user from a chat
 * @apiName DeleteChats
 * @apiGroup Chats
 * 
 * @apiDescription Deletes the chat room between two people when one person decides to leave.  
 * 
 * @apiParam {Number} chatId the chat to delete the user from
 * 
 * @apiSuccess {boolean} success true when the chatID is deleted
 * 
 * @apiError (404: Chat Not Found) {String} message "chatID not found"
 * @apiError (400: Invalid Parameter) {String} message "Malformed parameter. chatId must be a number" 
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */
 router.delete("/chatRoom/:chatId", (request, response, next) => {
    //validate on empty parameters
    if (!request.params.chatId) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else if (isNaN(request.params.chatId)) {
        response.status(400).send({
            message: "Malformed parameter. chatId must be a number"
        })
    } else {
        next()
    }
}, (request, response, next) => {
    //validate chat id exists
    let query = 'SELECT * FROM CHATS WHERE ChatId=$1'
    let values = [request.params.chatId]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "Chat ID not found"
                })
            } else {
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response) => {
    //Delete the chat room
    let query = 'DELETE FROM ChatMembers WHERE chatID=$1'
    let values = [request.params.chatId]

    pool.query(query, values)
        .then(result => {
            response.send({
                success: true
            })
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}
)
module.exports = router