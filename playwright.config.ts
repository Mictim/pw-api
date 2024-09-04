import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {

    // Specify the test files or directories to run
    testDir: "./test",
    fullyParallel: false,
    workers: 1,
    timeout: 2 * 60 * 1000,
    globalSetup: 'utils/generate-typings.ts',
    // Specify the output directory for test results
    reporter: [['list'], ['html']],
    use: {
        trace: {
            mode: 'on',
        }
    }
};

export default config;