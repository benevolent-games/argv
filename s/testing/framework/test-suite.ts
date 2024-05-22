
export type TestSuite = {[key: string]: () => Promise<void>}

export function testSuite(suite: TestSuite) {
	return suite
}

