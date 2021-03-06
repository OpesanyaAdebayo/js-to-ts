# js-to-ts
I created this repo to demonstrate with a small example, how to migrate an existing Node.js project written in Javascript to Typescript. It was actually a basic application generated using the [express-generator](https://www.npmjs.com/package/express-generator) package, then it was slowly migrated to Typescript. The process to getting this done is outlined below.


## Pre-requisite
You need to have [Node.js](https://nodejs.org/en/) installed

### Generating a basic Javascript Application
1. Generate a basic application with [express-generator](https://www.npmjs.com/package/express-generator).Visit the package page for instructions on how to do so.
2. Navigate to the application folder in your terminal and run `npm install` to install all the dependencies.

### Converting to Typescript
1. It is conventional to have your Typescript files in a `src ` folder (it can be any name), which will be your working directory for Typescript files, so I created one in the project root folder.
2. I moved the `routes` and `bin` folders into `src`, and I also moved `app.js` too. This is because those are the Javascript files/folders we'll be working on.
3. Typescript compiles into Javascript, so you'll need the Typescript compiler. Even though you write your application in Typescript, what your server runs at the end is Javascript. You can install the Typescript compiler on your terminal as thus: `npm install -g typescript`. Voila! 🎉 You now have the `tsc` command available for use in your terminal. More on that shortly.
4. The Typescript compiler needs a `tsconfig.json` file which tells it which files to compile (sometimes called the compilation context), and which compilation options to use. For this tutorial, create an empty `tsconfig.json` file and copy/paste the contents in the `tsconfig.json` in this repo there.
5. Change all Javascript files (including `www`) to Typescript files by changing the extensions from `.js` to `.ts`.
6. Hooray 🎉🎉🎉! Now you  have successfuly migrated your application to Typscript. Now, let's start fixing those errors you see generated by the Typescript compiler. 💪🏼

### Fixing compilation errors
1. Let's first look at `index.ts` in the routes folder. Notice there's an error: `cannot find name require`.
To solve this problem, you need to install Typescript Type Definition files for Node. Simply run `npm install @types/node --save-dev` in your terminal and you should see the error disappear. Now you should have a `@types` folder in your `node_modules_`. All other type definition files will be installed in that folder.

2. Next we have 3 errors:
- `Parameter 'req' implicitly has an 'any' type`.
- `Parameter 'res' implicitly has an 'any' type`.
- `Parameter 'next' implicitly has an 'any' type`.

To solve this, we'll take advantage of definition files by Node and Express.
- First install Express Type Definition files by running `npm install @types/express --save-dev` in your terminal.
- Delete `var express = require('express');` and replace it with `import express, { Request, Response, NextFunction} from 'express';`
- Delete `router.get('/', function(req, res, next)` and replace it with `router.get('/', function(req: Request, res: Response, next: NextFunction)`. This basically enforces types for the `req`, `res` and `next` parameters. Do this across the routes files and `app.ts`

3. Once that is done, we'll need change our code to use the `import` syntax, instead of the `require` syntax. I know things can still go well if you stick with `require`, but it's advisable to use `import` except when you're not supposed to. The top section in your `app.js` should look like this now:
```
import express, { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import { default as logger } from 'morgan';
```
Also update your routes to look like this:
`export default router;` instead of `module.exports = router`

To import them in `app.js`, change the `require` syntax to:
```
import { default as index} from './routes/index';
import { default as users} from './routes/users';
```

4. Once you do this, you have a couple of errors: `could not find declaration file for <module>`. All you need to do is install type definitions for that module. Run `npm install @types/<module-name> --save-dev`.

5. Also in `app.js`, you have an error: `Parameter 'err' implicitly has an 'any' type`. What you need to to is specify the `err` paremeter type as Error as thus: `err: Error`.

6. This gives rise to another error within the error handler middleware: `Property 'status' does not exist on type 'Error'`. To fix this, we need to:
- Create an interface in a separate file `error.ts` that _extends_ `Error` and includes a `status` property, then export the interface. You can save the file in the root of the `src` folder. Your file should have the following content:
```
export default interface Error {
    status: number
}
```
7. Then, import the file we just created in `app.js` as thus: `import Error from '../error'`. The error should go away now.

8. The last errors should be in `www.ts`. What you need to do is:
- Import the Error interface as you did in Step 7.
- Update `error.ts` to look like this:
```
export default interface Error {
    status: number,
    message?: string,
    syscall: string,
    code: string

}
- Change `var app = require('../app');` to `import { default as app } from '../app'`

```
9. Now, that's all, and your application is fully migrated to Typescript.

### Running your application
1. Run `tsc` in your terminal to build the application. You'll notice that there's a new folder `dist` in your project root.

2. Create a start script in `package.json` to run the app as thus:
```
"scripts": {
    "start": "node ./dist/bin/www.js"
  }
```
3. Run `npm run start`.

4. You should have your app running on `http//localhost:3000`. You're live! 🎉🎉🎉

### Questions
If you have any further question or issue, please feel free to open an issue in this repo.