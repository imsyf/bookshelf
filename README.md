# bookshelf
 An exercise on making REST API server using hapi.

 Some notable things about this project:
 - Took [hapipal](https://hapipal.com) as its starting point which provides:
   - Clear separation between server configuration and deployment code (lives inside `server` directory), and application code (lives inside `lib` directory)
   - Good default server configuration, changes were only made to allow CORS, modify port number, and strip trailing slash on route path
   - Automatic routes registration, by creating new JavaScript file inside `lib/routes` directory, write and then export our route object from it
   - Custom ESLint rules for code style consistency
 - Heavily utilizes [joi](https://hapi.dev/tutorials/validation/#joi) to validate incoming and outgoing data, which should cover:
   - The requirements explained in the [submission page](https://www.dicoding.com/academies/261/tutorials/14967)
   - Even stricter rules focusing on opinionated view of what's considered as valid data type and value needed to make consistent API responses, such as:
     - Excluding `-` and `_` from the return function that is used for generating random `id` to avoid [potential issues](https://github.com/ai/nanoid/issues/347) by customizing the default `nanoid` function
     - Allow multiple query parameters to filter out books list, so for example if a user were to send `GET` request to `/books?name=een&finished=0&reading=1`, the handler will return books that meet all three of those criteria <sup>[1] dunno why no one's doing this, i thought it's common understanding when you're working with query params, expect them to be used together [2] single query will also work, or you can combine one with another, or don't use at all [3] and that's the whole point, you should be ready for all the possibility [4] check out how it's done, i'm especially pleased how it turned out</sup>
     - See all in `lib/data/books/schema.js`
 - The implication of doing strict validation upfront using `joi` is that we're able to write a lean business logic inside method handler on each route object, because by that time we already know for sure we're working with valid data
 - Uses [boom](https://github.com/hapijs/boom/tree/master) to spit out HTTP-friendly error message
