# Red Hat VCS UI

Red Hat VCS is an application to track COVID-19 vaccination and testing submissions.

## Quick-start

## Development scripts
```sh
# Install development/build dependencies
npm install

# Start the development server
npm run start:dev

# Run a production build (outputs to "dist" dir)
npm run build

# Run the full test suite
npm run test

# Run a specific test
npm run test -- -t 'SPECIFIC_TEST_NAME'

Example: `npm run test -- -t '<EmployeeInfoCard />'

# Run the test suite with coverage
npm run test:coverage

# Run the linter
npm run lint

# Run the code formatter
npm run format

# Launch a tool to inspect the bundle size
npm run bundle-profile:analyze

# Start the express server (run a production build first)
npm run start

```

## Configurations
* [TypeScript Config](./tsconfig.json)
* [Webpack Config](./webpack.common.js)
* [Jest Config](./jest.config.js)
* [Editor Config](./.editorconfig)


