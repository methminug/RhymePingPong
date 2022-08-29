# Rhyme Ping Pong

Play ping pong, but with rhymes! 🏓

Go back and forth with rhymes instead of a ping pong ball in this game and see if you can have the last word against the app! The application uses inputs of previous players to come up with its rhymes as a response to yours.

## Screenshots

<img src="https://user-images.githubusercontent.com/62464945/187123273-d2987041-b612-459f-aa32-589d627900b3.png" width="800" />
<img src="https://user-images.githubusercontent.com/62464945/187122726-c25ca4ac-5928-42bd-a6c5-4619a51c93c7.png" width="800" />
<img src="https://user-images.githubusercontent.com/62464945/187122739-de02145f-a01d-41a5-923e-50bd3d174fbb.png" width="800" />

# Overview video

[![Embed your YouTube video]()

## How it works

New sentences input by the user are stored along with the word ending of the sentence’s final word, which is then used to query for a rhyming sentence each time a user inputs a new sentence.

### How the data is stored:

The data (sentences received) is stored in as a JSON data structure and a sentence is stored according to the the following schema:

- sentenceString - String
- wordEnding - String

### How the data is accessed:

[RediSearch](https://github.com/redis/redis-om-node#-using-redisearch) was used for querying, and data was accessed in the follwong ways, where `sentenceRepository` creates the main access point for reading and writing entities on Redis.:

- Searching for a rhyming sentence
  - Sentences are checked for how well they rhyme by querying the `wordEnding` attribute

```
  const rhymes = await sentenceRepository
      .search()
      .where("wordEnding")
      .equals(req.params.word)
      .return.all();
```

- Saving a new sentence
  - Checking for duplicates first,

```
  const duplicate = await sentenceRepository
    .search()
    .where("sentenceString")
    .equals(req.body.string)
    .return.first();
```

- Then saving the sentence if no duplicates were found. `wordEnding` contains the word ending of the final word of that senetnce.

```
  const sentence = sentenceRepository.createEntity(req.body.string);
  sentence.sentenceString = req.body.string;
  sentence.wordEnding = req.body.wordEnding;
  const id = await sentenceRepository.save(sentence);
```

## How to run it locally

### Prerequisites

 - **Node** - version ">=14.17.0"

### Local installation

### Frontend

---

1. Run `cd frontend` to enter the folder
2. Run `npm install`
3. After package installation completes, run `npm start`
4. Open `http://localhost:3000/` in your browser.

### Backend

---

1. Run `cd backend` to enter the folder
2. Run `npm install`
3. Create a free account on [Redis Cloud](https://redis.info/try-free-dev-to) and create your database.
4. Create a new user for the database.
5. In a `.env` file file at the root of this folder, add the values for:

```
REDIS_DB_ENDPOINT=<Public endpoint>
REDIS_USER=<Database user's name>
REDIS_PWD=<Database user's password>
```

6. Run `npm start`
