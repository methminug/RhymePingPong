# Rhyme Ping Pong

Go back and forth with rhymes instead of a ping pong ball and see if you can have the last word! The application uses inputs of previous players to come up with its rhymes as a response to yours.

The rhythm and flow of most poems, sometimes felt like a game of ping pong to me, which became the inspiration behind the simple game, Rhyme Ping Pong. 😁

This application tries to come up with a rhyme for each sentence entered and simultaneously builds up its knowledge by storing each unique sentence entered so that it can be used as a rhyme in the future.

## Screenshots

<img src="https://user-images.githubusercontent.com/62464945/187123273-d2987041-b612-459f-aa32-589d627900b3.png" width="800" />
<img src="https://user-images.githubusercontent.com/62464945/187122726-c25ca4ac-5928-42bd-a6c5-4619a51c93c7.png" width="800" />
<img src="https://user-images.githubusercontent.com/62464945/187122739-de02145f-a01d-41a5-923e-50bd3d174fbb.png" width="800" />

# Overview video
Here's a short video that explains the project and how it uses Redis:

[![Embed your YouTube video](https://user-images.githubusercontent.com/62464945/187299751-9a5397e3-4751-4eaa-84eb-185a7bdb3d8f.png)](https://www.youtube.com/watch?v=h04xTe3a1wQ)

## How it works

New sentences input by the user are stored along with the word ending of the sentence’s final word, which is then used to query for a rhyming sentence each time a user inputs a new sentence. 
The word ending consists of the final 2 (or 3 if the 2nd to last letter is a consonant) letters of the last word in a sentence.

### How the data is stored:

The data (sentences received) is stored in as a JSON data structure and a sentence is stored according to the the following schema:

- sentenceString - String
- wordEnding - String

#### Saving a new sentence
  - Checking for duplicates first,

```js
  const duplicate = await sentenceRepository
    .search()
    .where("sentenceString")
    .equals(req.body.string)
    .return.first();
```

- Then saving the sentence if no duplicates were found. `wordEnding` contains the word ending of the final word of that senetnce.

```js
  if (duplicate === null) {
    const sentence = sentenceRepository.createEntity(req.body.string);
    sentence.sentenceString = req.body.string;
    sentence.wordEnding = req.body.wordEnding;
    const id = await sentenceRepository.save(sentence);
    res.send(id);
  }
```

### How the data is accessed:

[RediSearch](https://github.com/redis/redis-om-node#-using-redisearch) was used for querying, and data was accessed in the follwong ways, where `sentenceRepository` creates the main access point for reading and writing entities on Redis.:

- Searching for a rhyming sentence
  - Sentences are checked for how well they rhyme by querying the `wordEnding` attribute
  - Then the record with a sentence identical to the user input sentence is removed if available, to avoid repeating the same sentence in the case of a user sending a sentence that is already n the database.
  - A random sentence is picked to be displayed from the retrieved list to avoid displaying the same rhyming sentence each time.

```js
  const rhymes = await sentenceRepository
      .search()
      .where("wordEnding")
      .equals(req.params.word)
      .and("sentenceString")
      .not.equals(req.params.sentence)
      .return.all();
```

- Retrieving all stored sentences
```js
  const allSentences = await sentenceRepository.search().returnAll();
 ```
 

## How to run it locally

### Prerequisites

 - **Node** - version ">=14.17.0"

### Local installation

### Frontend

1. Open a terminal in the root of the project folder.
2. Run `cd frontend` to enter the folder.
2. Run `npm install`.
3. After package installation completes, run `npm start`.
4. Open `http://localhost:3000/` in your browser.

### Backend

1. Open a terminal in the root of the project folder.
2. Run `cd backend` to enter the folder.
2. Run `npm install`.
3. Create a free account on [Redis Cloud](https://redis.info/try-free-dev-to) and create your database.
4. Create a new user for the database.
5. In a `.env` file in the root of `/backend`, add the values for:

```
REDIS_DB_ENDPOINT=<Public endpoint>
REDIS_USER=<Database user's name>
REDIS_PWD=<Database user's password>
```

6. Run `npm start`.

### Feel free to try this game out! 🏓

## More Information about Redis Stack

Here some resources to help you quickly get started using Redis Stack. If you still have questions, feel free to ask them in the [Redis Discord](https://discord.gg/redis) or on [Twitter](https://twitter.com/redisinc).

### Getting Started

1. Sign up for a [free Redis Cloud account using this link](https://redis.info/try-free-dev-to) and use the [Redis Stack database in the cloud](https://developer.redis.com/create/rediscloud).
1. Based on the language/framework you want to use, you will find the following client libraries:
    - [Redis OM .NET (C#)](https://github.com/redis/redis-om-dotnet)
        - Watch this [getting started video](https://www.youtube.com/watch?v=ZHPXKrJCYNA)
        - Follow this [getting started guide](https://redis.io/docs/stack/get-started/tutorials/stack-dotnet/)
    - [Redis OM Node (JS)](https://github.com/redis/redis-om-node)
        - Watch this [getting started video](https://www.youtube.com/watch?v=KUfufrwpBkM)
        - Follow this [getting started guide](https://redis.io/docs/stack/get-started/tutorials/stack-node/)
    - [Redis OM Python](https://github.com/redis/redis-om-python)
        - Watch this [getting started video](https://www.youtube.com/watch?v=PPT1FElAS84)
        - Follow this [getting started guide](https://redis.io/docs/stack/get-started/tutorials/stack-python/)
    - [Redis OM Spring (Java)](https://github.com/redis/redis-om-spring)
        - Watch this [getting started video](https://www.youtube.com/watch?v=YhQX8pHy3hk)
        - Follow this [getting started guide](https://redis.io/docs/stack/get-started/tutorials/stack-spring/)

The above videos and guides should be enough to get you started in your desired language/framework. From there you can expand and develop your app. Use the resources below to help guide you further:

1. [Developer Hub](https://redis.info/devhub) - The main developer page for Redis, where you can find information on building using Redis with sample projects, guides, and tutorials.
1. [Redis Stack getting started page](https://redis.io/docs/stack/) - Lists all the Redis Stack features. From there you can find relevant docs and tutorials for all the capabilities of Redis Stack.
1. [Redis Rediscover](https://redis.com/rediscover/) - Provides use-cases for Redis as well as real-world examples and educational material
1. [RedisInsight - Desktop GUI tool](https://redis.info/redisinsight) - Use this to connect to Redis to visually see the data. It also has a CLI inside it that lets you send Redis CLI commands. It also has a profiler so you can see commands that are run on your Redis instance in real-time
1. Youtube Videos
    - [Official Redis Youtube channel](https://redis.info/youtube)
    - [Redis Stack videos](https://www.youtube.com/watch?v=LaiQFZ5bXaM&list=PL83Wfqi-zYZFIQyTMUU6X7rPW2kVV-Ppb) - Help you get started modeling data, using Redis OM, and exploring Redis Stack
    - [Redis Stack Real-Time Stock App](https://www.youtube.com/watch?v=mUNFvyrsl8Q) from Ahmad Bazzi
    - [Build a Fullstack Next.js app](https://www.youtube.com/watch?v=DOIWQddRD5M) with Fireship.io
    - [Microservices with Redis Course](https://www.youtube.com/watch?v=Cy9fAvsXGZA) by Scalable Scripts on freeCodeCamp
