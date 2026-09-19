# Hints

Try the challenge before opening this file.

## Challenge 1: Create

`Task.create()` needs the object sent by the client. Express places that object
in `req.body`.

The unfinished statement has this shape:

```js
const newTask = await Task.____(____);
```

## Challenge 2: Read

`Task.find()` returns an array containing all matching documents. Calling it
without a filter returns every task.

```js
const tasks = await Task.____();
```

## Challenge 3: Update

The update method needs three pieces of information:

1. Which task should change?
2. What new data should be applied?
3. Should Mongoose return the old or updated document?

```js
const updatedTask = await Task._____________(
  taskId,
  req.body,
  { returnDocument: "after" }
);
```

## Challenge 4: Delete

The delete method only needs the task's ID:

```js
const deletedTask = await Task._____________(taskId);
```

## Response hint

Send a JavaScript value as JSON like this:

```js
res.status(200).json(someValue);
```

Creating a document normally uses status `201`. The other successful requests
can use status `200`.
