# ZEN HQ Mobile Ionic application

Getting Started with this Project
-----------

To get started, clone this repo, and run `npm install` in the root directory.

Then, you should run `ionic serve` to make sure the project loads.

### Unit Tests

To run the tests, run `npm run test`.

See the example test in `src/app/app.component.spec.ts` for an example of a component test.

### End-To-End Tests (Browser-Only)

To serve the app, run `ionic serve`.

To run the end-to-end tests, run (while the app is being served) `npm run e2e`.

See the example end-to-end test in `e2e/app.e2e-spec.ts`.

### Code Coverage Functionality

Run `npm run test-coverage` which will run the project's unit tests with Karma and produce documentation that gives guidance on how well the project's tests cover the code.

![Example Image of Completed Code Coverage](https://user-images.githubusercontent.com/1648535/30074946-54a36e50-9241-11e7-9ca8-6263d0353c58.png)

The documentation is created inside the `/coverage` folder (ignored by git).

## Credits

This repository is based on the awesome [unit testing example](https://github.com/roblouie/unit-testing-demo) from [@roblouie](https://github.com/roblouie/) :thumbsup:

Updates
==========

We've updated this repo to use Ionic v3.2.1 and Ionic CLI v3.0.0.

If you already have this repository downloaded on your system, after you sync with our Master branch make certain you delete your `node_modules` folder and then run `npm install`.

Also, since we've updated to Ionic CLI v3.0.0, you will need to update your version as well:
```
npm remove -g ionic
npm install -g ionic
```
If you run `ionic -v` it should return `3.0.0` (or better, depending on what has been released.
