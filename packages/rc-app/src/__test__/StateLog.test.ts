import { StateLog } from '../simulator/StateLog';

type TestType = {
  test1: number;
  test2: string;
};

let testData: TestType[] = null;

beforeEach(() => {
  testData = [
    {
      test1: 1,
      test2: '1',
    },
    {
      test1: 2,
      test2: '2',
    },
    {
      test1: 3,
      test2: '3',
    },
  ];
});

test('add and read states', () => {
  const stateLog = new StateLog<TestType>();
  stateLog.set(1, testData[0]);
  stateLog.set(2, testData[1]);
  stateLog.set(5, testData[2]);

  expect(stateLog.get(1)).toBe(testData[0]);
  expect(stateLog.get(2)).toBe(testData[1]);
  expect(stateLog.get(3)).toBeNull();
  expect(stateLog.get(4)).toBeNull();
  expect(stateLog.get(5)).toBe(testData[2]);
});

test('replace state', () => {
  const stateLog = new StateLog<TestType>();
  stateLog.set(1, testData[0]);

  expect(stateLog.get(1)).toBe(testData[0]);

  stateLog.set(1, testData[1]);

  expect(stateLog.get(1)).toBe(testData[1]);
});

test('remove stale states', () => {
  const stateLog = new StateLog<TestType>(10);
  stateLog.set(1, testData[0]);
  stateLog.set(200, testData[1]);
  stateLog.set(201, testData[2]);

  expect(stateLog.get(1)).toBe(testData[0]);
  expect(stateLog.get(200)).toBe(testData[1]);
  expect(stateLog.get(201)).toBe(testData[2]);

  stateLog.updateToStep(202);

  expect(stateLog.get(1)).toBeNull();
  expect(stateLog.get(200)).toBe(testData[1]);
  expect(stateLog.get(201)).toBe(testData[2]);

  stateLog.updateToStep(211);

  expect(stateLog.get(1)).toBeNull();
  expect(stateLog.get(200)).toBeNull();
  expect(stateLog.get(201)).toBe(testData[2]);

  stateLog.updateToStep(212);

  expect(stateLog.get(1)).toBeNull();
  expect(stateLog.get(200)).toBeNull();
  expect(stateLog.get(201)).toBeNull();
});
